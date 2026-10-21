/**
 * CollaBro — Script Editor
 * src/pages/ScriptDashboard/ScriptEditor.jsx
 *
 * Full-featured script editor with:
 *  - Autosave (debounced, server-confirmed)
 *  - Live word count and stats
 *  - Optimistic versioning to prevent stale writes
 *  - PDF export (auth-gated server endpoint, client-side generation)
 *  - Submit to client for project-linked scripts
 *  - Back navigation to dashboard
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import CustomCursor from '../../components/CustomCursor.jsx';
import './ScriptEditor.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ─── Word / character counting (no HTML, no markup) ─── */
function computeStats(text) {
  if (!text || typeof text !== 'string') {
    return { words: 0, chars: 0, charsNoSpaces: 0, paragraphs: 0, pageEstimate: 0 };
  }
  // Paragraphs: non-empty lines
  const lines = text.split('\n');
  const paragraphs = lines.filter((l) => l.trim().length > 0).length;
  // Words: split on whitespace
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  // Rough estimate: ~250 words per screenplay page
  const pageEstimate = Math.max(0, Math.round(words / 250));
  return { words, chars, charsNoSpaces, paragraphs, pageEstimate };
}

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/* ─── Icon (inline, no extra dependency) ─── */
function Icon({ name, size = 16 }) {
  const paths = {
    arrowLeft: <><path d="M19 12H5M12 5l-7 7 7 7" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
    download: <><path d="M12 16V4m-4 8 4 4 4-4M4 16v4h16v-4" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    alert: <><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.3 2 21h20L13.7 3.3a2 2 0 0 0-3.4 0z" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" /></>,
    refresh: <><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
}

/* ─── Save status indicator ─── */
function SaveStatus({ status, lastSavedAt, onManualSave }) {
  const labels = {
    idle: '',
    saving: 'Saving…',
    saved: `Saved ${formatDate(lastSavedAt)}`,
    error: 'Save failed',
  };
  const icon = {
    idle: null,
    saving: <div className="se-spinner" aria-hidden="true" />,
    saved: <Icon name="check" size={14} />,
    error: <Icon name="alert" size={14} />,
  };

  return (
    <div className={`se-save-status se-save-${status}`} aria-live="polite" aria-atomic="true">
      {icon[status]}
      <span>{labels[status]}</span>
      {status === 'error' && (
        <button className="se-retry-btn" onClick={onManualSave} aria-label="Retry save">
          <Icon name="refresh" size={13} /> Retry
        </button>
      )}
    </div>
  );
}

/* ─── Submit Modal ─── */
function SubmitModal({ project, onConfirm, onClose, submitting }) {
  const [note, setNote] = useState('');
  return (
    <div className="sd-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} role="presentation">
      <div className="sd-modal" role="dialog" aria-modal="true" aria-labelledby="submit-modal-title">
        <div className="sd-modal-header">
          <h2 id="submit-modal-title">Submit to Client</h2>
          <button className="sd-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="sd-modal-body">
          <p>
            You are submitting this script for <strong>{project?.title || 'the client project'}</strong>.
            The client will be able to review your work.
          </p>
          <div className="sd-field">
            <label htmlFor="submit-note">Note to client (optional)</label>
            <textarea
              id="submit-note"
              rows={3}
              placeholder="Add a message for the client…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
            />
          </div>
          <div className="sd-modal-actions">
            <button className="sd-btn sd-btn-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
            <button
              className="sd-btn sd-btn-primary"
              onClick={() => onConfirm(note)}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Script'}
              {!submitting && <Icon name="send" size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PDF Export utility (client-side, using auth-gated export endpoint) ─── */
async function exportScriptAsPdf(scriptId, addToast) {
  try {
    // 1. Fetch authorized export data from server
    const res = await fetch(`${API_URL}/api/scripts/${scriptId}/export`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      addToast('error', d.message || 'Could not export script. Make sure the script has content.');
      return;
    }
    const { exportData } = await res.json();

    // 2. Build a printable HTML document and trigger print-to-PDF
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      addToast('error', 'Could not open PDF preview. Please allow pop-ups for this site.');
      return;
    }

    const content = exportData.content
      .split('\n')
      .map((line) => {
        // Basic screenplay formatting detection
        const trimmed = line.trim();
        if (!trimmed) return '<div class="empty-line"></div>';
        // Scene headings: INT. / EXT. / starts with location indicator
        if (/^(INT\.|EXT\.|INT\/EXT\.|FADE IN:|FADE OUT:|FADE TO:|CUT TO:)/i.test(trimmed)) {
          return `<div class="slugline">${escapeHtml(trimmed)}</div>`;
        }
        // Character names: ALL CAPS, no punctuation, short
        if (/^[A-Z\s\(\)\.,']+$/.test(trimmed) && trimmed.length < 50 && !/[a-z]/.test(trimmed)) {
          return `<div class="character">${escapeHtml(trimmed)}</div>`;
        }
        // Parenthetical
        if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
          return `<div class="parenthetical">${escapeHtml(trimmed)}</div>`;
        }
        return `<div class="action">${escapeHtml(trimmed)}</div>`;
      })
      .join('\n');

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(exportData.title)} — CollaBro</title>
  <style>
    @page { margin: 1in; size: letter; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      max-width: 6.5in;
      margin: 0 auto;
    }
    .cover {
      text-align: center;
      margin-bottom: 60pt;
      padding-top: 120pt;
    }
    .cover h1 { font-size: 18pt; margin: 0 0 8pt; text-transform: uppercase; letter-spacing: 0.05em; }
    .cover .meta { font-size: 11pt; color: #444; margin: 4pt 0; }
    .cover .exported { font-size: 9pt; color: #888; margin-top: 24pt; }
    .synopsis {
      background: #f5f5f5;
      border-left: 3px solid #ccc;
      padding: 8pt 12pt;
      margin-bottom: 32pt;
      font-size: 11pt;
      font-style: italic;
    }
    .divider { border: none; border-top: 1px solid #ddd; margin: 24pt 0; }
    .slugline { font-weight: bold; text-transform: uppercase; margin: 16pt 0 8pt; }
    .character { text-align: center; margin-top: 12pt; margin-bottom: 0; }
    .parenthetical { text-align: center; margin: 0; color: #444; }
    .action { margin: 4pt 0; }
    .empty-line { height: 10pt; }
    .page-num { position: fixed; top: 0.5in; right: 1in; font-size: 10pt; color: #888; }
    @media print {
      body { max-width: none; }
      .page-num { display: block; }
    }
    @media screen {
      body { padding: 40px; background: white; }
    }
  </style>
</head>
<body>
  <div class="page-num" id="pagenum"></div>

  <div class="cover">
    <h1>${escapeHtml(exportData.title)}</h1>
    ${exportData.format ? `<div class="meta">${escapeHtml(exportData.format)}</div>` : ''}
    ${exportData.genre ? `<div class="meta">${escapeHtml(exportData.genre)}</div>` : ''}
    <div class="meta">Written by ${escapeHtml(exportData.author)}</div>
    <div class="meta">${exportData.wordCount?.toLocaleString() || 0} words${exportData.pageEstimate ? ` · ~${Math.round(exportData.wordCount / 250)} pages` : ''}</div>
    <div class="exported">Exported from CollaBro · ${new Date(exportData.exportedAt).toLocaleDateString()}</div>
  </div>

  ${exportData.synopsis ? `<div class="synopsis">${escapeHtml(exportData.synopsis)}</div>` : ''}

  <hr class="divider" />

  ${content}

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 500);
    };
  <\/script>
</body>
</html>`);
    printWindow.document.close();

    addToast('success', 'PDF preview opened. Use your browser\'s Print dialog to save as PDF.');
  } catch (err) {
    console.error('[Export PDF error]', err);
    addToast('error', 'PDF export failed. Please try again.');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ════════════════════════════════════════════════════════
   Main Editor Component
════════════════════════════════════════════════════════ */
export default function ScriptEditor() {
  const { id: scriptId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  /* Script state */
  const [script, setScript] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [genre, setGenre] = useState('');
  const [format, setFormat] = useState('');
  const [version, setVersion] = useState(1);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  /* UI state */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('idle'); // idle|saving|saved|error
  const [stats, setStats] = useState({ words: 0, chars: 0, charsNoSpaces: 0, paragraphs: 0, pageEstimate: 0 });
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState(null);
  const [toast, setToast] = useState(null);
  const [metaOpen, setMetaOpen] = useState(false);

  /* Refs for debounced autosave */
  const autosaveTimer = useRef(null);
  const pendingSave = useRef({ title: '', content: '', synopsis: '', genre: '', format: '', version: 1 });
  const isSaving = useRef(false);

  const addToast = useCallback((type, message) => {
    setToast({ type, message, id: Date.now() });
    setTimeout(() => setToast(null), 4500);
  }, []);

  /* Redirect if not authenticated */
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  /* Load the script */
  useEffect(() => {
    if (!scriptId || !user) return;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/scripts/${scriptId}`, { credentials: 'include' });
        if (!res.ok) {
          if (res.status === 403 || res.status === 404) {
            setError('Script not found or access denied.');
          } else {
            setError('Could not load script. Please try again.');
          }
          return;
        }
        const data = await res.json();
        const s = data.script;
        setScript(s);
        setTitle(s.title || '');
        setContent(s.content || '');
        setSynopsis(s.synopsis || '');
        setGenre(s.genre || '');
        setFormat(s.format || '');
        setVersion(s.version || 1);
        setLastSavedAt(s.lastSavedAt);
        setStats(computeStats(s.content || ''));

        // Sync pending save state
        pendingSave.current = {
          title: s.title || '',
          content: s.content || '',
          synopsis: s.synopsis || '',
          genre: s.genre || '',
          format: s.format || '',
          version: s.version || 1,
        };

        // Load linked project if any
        if (s.projectId) {
          const pRes = await fetch(`${API_URL}/api/script-projects/${s.projectId}`, { credentials: 'include' });
          if (pRes.ok) {
            const pData = await pRes.json();
            setProject(pData.project);
          }
        }
      } catch (e) {
        console.error('[Load script error]', e);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [scriptId, user]);

  /* Update stats on content change */
  useEffect(() => {
    setStats(computeStats(content));
  }, [content]);

  /* ─── Core save function ─── */
  const performSave = useCallback(async (payload, currentVersion) => {
    if (isSaving.current) return;
    isSaving.current = true;
    setSaveStatus('saving');

    try {
      const res = await fetch(`${API_URL}/api/scripts/${scriptId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          expectedVersion: currentVersion,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setSaveStatus('error');
          addToast('error', 'Save conflict: this script was updated elsewhere. Please reload.');
        } else {
          setSaveStatus('error');
          addToast('error', data.message || 'Could not save. Please try again.');
        }
        return;
      }

      // Update version and lastSavedAt from server response
      const serverScript = data.script;
      setVersion(serverScript.version);
      setLastSavedAt(serverScript.lastSavedAt);
      pendingSave.current.version = serverScript.version;
      setSaveStatus('saved');
    } catch (e) {
      console.error('[Autosave error]', e);
      setSaveStatus('error');
    } finally {
      isSaving.current = false;
    }
  }, [scriptId, addToast]);

  /* ─── Schedule autosave on content/title/meta change ─── */
  const scheduleAutosave = useCallback((newValues) => {
    // Merge latest values into pending
    pendingSave.current = { ...pendingSave.current, ...newValues };
    setSaveStatus('idle');

    // Clear previous timer
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);

    // Debounce: save 1.5 seconds after the user stops typing
    autosaveTimer.current = setTimeout(() => {
      const { version: v, ...rest } = pendingSave.current;
      performSave(rest, v);
    }, 1500);
  }, [performSave]);

  /* ─── Handler: content change ─── */
  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    scheduleAutosave({ content: val });
  };

  /* ─── Handler: title change ─── */
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    scheduleAutosave({ title: val });
  };

  /* ─── Handler: meta field changes ─── */
  const handleMetaChange = (field, val) => {
    if (field === 'synopsis') setSynopsis(val);
    if (field === 'genre') setGenre(val);
    if (field === 'format') setFormat(val);
    scheduleAutosave({ [field]: val });
  };

  /* ─── Manual save ─── */
  const handleManualSave = useCallback(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    const { version: v, ...rest } = pendingSave.current;
    performSave(rest, v);
  }, [performSave]);

  /* ─── PDF Export ─── */
  const handleExport = useCallback(() => {
    exportScriptAsPdf(scriptId, addToast);
  }, [scriptId, addToast]);

  /* ─── Submit to client ─── */
  const handleSubmitConfirm = async (note) => {
    if (!project) return;
    setSubmitting(true);
    try {
      // Save latest content first
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      const { version: v, ...rest } = pendingSave.current;
      await performSave(rest, v);

      const res = await fetch(`${API_URL}/api/script-projects/${project._id}/submit`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast('error', data.message || 'Submission failed. Please try again.');
        return;
      }
      setShowSubmitModal(false);
      addToast('success', 'Script submitted to client for review.');
      // Reload project status
      const pRes = await fetch(`${API_URL}/api/script-projects/${project._id}`, { credentials: 'include' });
      if (pRes.ok) {
        const pData = await pRes.json();
        setProject(pData.project);
      }
    } catch (e) {
      addToast('error', 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Cleanup on unmount: flush pending save ─── */
  useEffect(() => {
    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
        // Best-effort synchronous attempt is not reliable — the API call won't complete
        // Content is already in the DB from the last successful autosave
      }
    };
  }, []);

  /* ─── Keyboard shortcut: Ctrl+S / Cmd+S ─── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleManualSave]);

  /* ─── Warn on unsaved changes when leaving ─── */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (saveStatus === 'saving' || saveStatus === 'error') {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Leave anyway?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  /* ─── Render ─── */
  if (authLoading || (loading && !error)) {
    return (
      <>
        <CustomCursor />
        <div className="se-loading">
          <div className="se-spinner-large" />
          <p>Loading your script…</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CustomCursor />
        <div className="se-error-page">
          <Icon name="alert" size={32} />
          <h2>Could not load script</h2>
          <p>{error}</p>
          <button className="sd-btn sd-btn-primary" onClick={() => navigate('/script-dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  const canSubmit = project && ['open', 'in_progress', 'revision_requested'].includes(project.status);

  return (
    <>
    <CustomCursor />
    <div className="se-root">
      {/* Toast */}
      {toast && (
        <div className={`sd-toast sd-toast-${toast.type}`} key={toast.id} role="alert" aria-live="assertive">
          {toast.message}
        </div>
      )}

      {/* ─── Top Bar ─── */}
      <header className="se-topbar">
        <div className="se-topbar-left">
          <button
            className="se-back-btn"
            onClick={() => navigate('/script-dashboard')}
            aria-label="Back to dashboard"
          >
            <Icon name="arrowLeft" size={18} />
            <span>Dashboard</span>
          </button>

          <div className="se-title-wrap">
            <input
              className="se-title-input"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled Script"
              maxLength={200}
              aria-label="Script title"
            />
          </div>
        </div>

        <div className="se-topbar-right">
          <SaveStatus
            status={saveStatus}
            lastSavedAt={lastSavedAt}
            onManualSave={handleManualSave}
          />

          <button
            className="se-meta-btn"
            onClick={() => setMetaOpen((o) => !o)}
            aria-label={metaOpen ? 'Hide script details' : 'Show script details'}
            aria-expanded={metaOpen}
          >
            <Icon name="edit" size={16} />
            Details
          </button>

          <button
            className="se-action-btn se-export-btn"
            onClick={handleExport}
            aria-label="Export as PDF"
            title="Export as PDF"
          >
            <Icon name="download" size={16} />
            Export PDF
          </button>

          {canSubmit && (
            <button
              className="se-action-btn se-submit-btn"
              onClick={() => setShowSubmitModal(true)}
              aria-label="Submit to client"
            >
              <Icon name="send" size={16} />
              Submit to Client
            </button>
          )}

          {project && (
            <div className={`se-project-chip se-status-${project.status}`}>
              {project.status?.replace(/_/g, ' ')}
            </div>
          )}
        </div>
      </header>

      {/* ─── Meta Panel (synopsis, genre, format) ─── */}
      {metaOpen && (
        <div className="se-meta-panel">
          <div className="se-meta-row">
            <div className="sd-field">
              <label htmlFor="ed-format">Format</label>
              <select id="ed-format" value={format} onChange={(e) => handleMetaChange('format', e.target.value)}>
                <option value="">Select format…</option>
                <option>Feature</option>
                <option>Pilot</option>
                <option>Short Film</option>
                <option>Docuseries</option>
                <option>Limited Series</option>
                <option>Stage Play</option>
                <option>Web Series</option>
                <option>Other</option>
              </select>
            </div>
            <div className="sd-field">
              <label htmlFor="ed-genre">Genre</label>
              <input
                id="ed-genre"
                type="text"
                value={genre}
                onChange={(e) => handleMetaChange('genre', e.target.value)}
                placeholder="e.g. Thriller, Drama"
                maxLength={100}
              />
            </div>
          </div>
          <div className="sd-field">
            <label htmlFor="ed-synopsis">Synopsis</label>
            <textarea
              id="ed-synopsis"
              rows={3}
              value={synopsis}
              onChange={(e) => handleMetaChange('synopsis', e.target.value)}
              placeholder="Brief description of your script…"
              maxLength={2000}
            />
          </div>
          {project && (
            <div className="se-meta-brief">
              <strong>Client brief:</strong> {project.brief || project.description || '(No brief provided)'}
            </div>
          )}
        </div>
      )}

      {/* ─── Editor Body ─── */}
      <div className="se-body">
        {/* Stats sidebar */}
        <aside className="se-stats-sidebar" aria-label="Writing statistics">
          <div className="se-stat">
            <span className="se-stat-n">{stats.words.toLocaleString()}</span>
            <span className="se-stat-l">Words</span>
          </div>
          <div className="se-stat">
            <span className="se-stat-n">{stats.chars.toLocaleString()}</span>
            <span className="se-stat-l">Characters</span>
          </div>
          <div className="se-stat">
            <span className="se-stat-n">{stats.charsNoSpaces.toLocaleString()}</span>
            <span className="se-stat-l">Chars (no spaces)</span>
          </div>
          <div className="se-stat">
            <span className="se-stat-n">{stats.paragraphs.toLocaleString()}</span>
            <span className="se-stat-l">Paragraphs</span>
          </div>
          <div className="se-stat">
            <span className="se-stat-n">~{stats.pageEstimate}</span>
            <span className="se-stat-l">Est. pages</span>
          </div>

          {project?.targetWordCount && (
            <div className="se-progress-block">
              <div className="se-progress-label">
                {Math.min(100, Math.round((stats.words / project.targetWordCount) * 100))}% of target
              </div>
              <div className="se-progress-bar-bg">
                <div
                  className="se-progress-bar-fill"
                  style={{
                    width: `${Math.min(100, (stats.words / project.targetWordCount) * 100)}%`,
                  }}
                />
              </div>
              <div className="se-progress-sub">
                {stats.words.toLocaleString()} / {project.targetWordCount.toLocaleString()} words
              </div>
            </div>
          )}

          <button
            className="se-save-btn"
            onClick={handleManualSave}
            disabled={saveStatus === 'saving'}
            aria-label="Save now (Ctrl+S)"
            title="Save now (Ctrl+S)"
          >
            <Icon name="save" size={15} />
            Save
          </button>
        </aside>

        {/* Main textarea */}
        <div className="se-editor-wrap">
          <textarea
            className="se-editor"
            value={content}
            onChange={handleContentChange}
            placeholder={`FADE IN:\n\nINT. YOUR SCENE - DAY\n\nStart writing your script here…\n\nCHARACTER NAME\nSpoken dialogue goes here.\n\nFADE OUT.`}
            spellCheck={true}
            aria-label="Script content"
            aria-multiline="true"
          />
        </div>
      </div>

      {/* ─── Submit Modal ─── */}
      {showSubmitModal && (
        <SubmitModal
          project={project}
          onConfirm={handleSubmitConfirm}
          onClose={() => setShowSubmitModal(false)}
          submitting={submitting}
        />
      )}
    </div>
    </>
  );
}
