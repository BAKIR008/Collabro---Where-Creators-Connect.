/**
 * CollaBro — Project Detail Page
 * src/pages/ScriptDashboard/ProjectDetail.jsx
 *
 * Freelancer view of a client-assigned project.
 * Shows brief, deadline, linked script, submission history, feedback.
 * Allows opening the editor or creating the first script for the project.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import CustomCursor from '../../components/CustomCursor.jsx';
import './ScriptDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function formatDate(d) {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function statusLabel(s) {
  const m = {
    open: 'Open',
    in_progress: 'In Progress',
    submitted: 'Submitted',
    under_review: 'Under Review',
    revision_requested: 'Revision Requested',
    completed: 'Completed',
  };
  return m[s] || s;
}

function statusBadgeClass(s) {
  const m = {
    open: 'badge-grey',
    in_progress: 'badge-purple',
    submitted: 'badge-blue',
    under_review: 'badge-blue',
    revision_requested: 'badge-orange',
    completed: 'badge-green',
  };
  return `sd-badge ${m[s] || 'badge-grey'}`;
}

function Avatar({ src, name, size = 36 }) {
  const [err, setErr] = useState(false);
  const initials = (name || 'U').trim().split(/\s+/).map((p) => p[0]?.toUpperCase() || '').slice(0, 2).join('');
  if (src && !err) {
    return <img className="sd-avatar" src={src} alt={name || ''} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} onError={() => setErr(true)} />;
  }
  return (
    <div className="sd-avatar sd-avatar-initials" style={{ width: size, height: size, fontSize: size * 0.36 }} aria-label={name || 'User'}>
      {initials || '?'}
    </div>
  );
}

function Icon({ name, size = 18 }) {
  const paths = {
    arrowLeft: <><path d="M19 12H5M12 5l-7 7 7 7" /></>,
    pen: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
}

export default function ProjectDetail() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);

  const addToast = useCallback((type, message) => {
    setToast({ type, message, id: Date.now() });
    setTimeout(() => setToast(null), 4500);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  const loadProject = useCallback(async () => {
    if (!projectId || !user) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/script-projects/${projectId}`, { credentials: 'include' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.message || 'Could not load project.');
        return;
      }
      const data = await res.json();
      setProject(data.project);
    } catch (e) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [projectId, user]);

  useEffect(() => { loadProject(); }, [loadProject]);

  const handleStartScript = async () => {
    if (!project) return;
    // If already has a linked script, open it
    if (project.linkedScript) {
      navigate(`/script-dashboard/editor/${project.linkedScript._id || project.linkedScript}`);
      return;
    }
    // Create a new script linked to this project
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/scripts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          format: project.format || '',
          genre: project.genre || '',
          synopsis: project.description || '',
          projectId: project._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409 && data.scriptId) {
          // Already exists — navigate to it
          navigate(`/script-dashboard/editor/${data.scriptId}`);
          return;
        }
        addToast('error', data.message || 'Could not create script.');
        return;
      }
      navigate(`/script-dashboard/editor/${data.script._id}`);
    } catch (e) {
      addToast('error', 'Network error. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <CustomCursor />
        <div className="sd-loading-full">
          <div className="sd-spinner-large" />
          <p>Loading project…</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CustomCursor />
        <div className="sd-loading-full" style={{ gap: 16 }}>
          <p style={{ color: '#B85C1C', fontWeight: 700 }}>{error}</p>
          <button className="sd-btn sd-btn-primary" onClick={() => navigate('/script-dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  if (!project) return null;

  const script = project.linkedScript;
  const isFreelancer = project.freelancer?._id === user?._id ||
    project.freelancer?._id?.toString() === user?._id?.toString();
  const canWriteOrEdit = isFreelancer;
  const canSubmit = isFreelancer && ['open', 'in_progress', 'revision_requested'].includes(project.status);

  return (
    <>
    <CustomCursor />
    <div className="sd-root" style={{ flexDirection: 'column' }}>
      {toast && (
        <div className={`sd-toast sd-toast-${toast.type}`} key={toast.id} role="alert">
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header style={{ padding: '16px 32px', background: '#1A1714', color: '#FFFDF6', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          className="se-back-btn"
          style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}
          onClick={() => navigate('/script-dashboard')}
        >
          <Icon name="arrowLeft" size={18} /> Dashboard
        </button>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Client Projects</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{project.title}</span>
      </header>

      <main style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto', width: '100%', flex: 1, boxSizing: 'border-box' }}>
        {/* Project meta */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span className={statusBadgeClass(project.status)}>{statusLabel(project.status)}</span>
              {project.format && <span className="sd-format-tag">{project.format}</span>}
              {project.genre && <span className="sd-format-tag">{project.genre}</span>}
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: '0.04em', margin: '0 0 8px' }}>
              {project.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B6560' }}>
              <Avatar src={project.client?.profilePicture} name={project.client?.name} size={24} />
              From {project.client?.name || 'Client'}
              {project.deadline && (
                <>
                  <span>·</span>
                  <Icon name="calendar" size={13} />
                  Due {formatDate(project.deadline)}
                </>
              )}
            </div>
          </div>

          {canWriteOrEdit && (
            <button
              className="sd-btn sd-btn-primary"
              onClick={handleStartScript}
              disabled={creating}
            >
              {creating ? 'Opening…' : (
                <>
                  {script ? <><Icon name="pen" size={16} /> Open Editor</> : <><Icon name="plus" size={16} /> Start Writing</>}
                </>
              )}
            </button>
          )}
        </div>

        {/* Description / Brief */}
        {(project.description || project.brief) && (
          <div className="sd-project-card" style={{ marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6560' }}>Project Brief</h3>
            {project.description && <p style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 8px' }}>{project.description}</p>}
            {project.brief && project.brief !== project.description && (
              <p style={{ fontSize: 13, color: '#5a5550', background: '#F7F2E8', padding: '10px 14px', borderRadius: 6, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {project.brief}
              </p>
            )}
          </div>
        )}

        {/* Instructions */}
        {project.instructions && (
          <div className="sd-project-card" style={{ marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6560' }}>Instructions</h3>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{project.instructions}</p>
          </div>
        )}

        {/* Script status */}
        <div className="sd-project-card" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6560' }}>
            Script
          </h3>
          {script ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Icon name="document" size={20} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{script.title}</div>
                <div style={{ fontSize: 13, color: '#6B6560', marginTop: 2 }}>
                  {(script.wordCount || 0).toLocaleString()} words
                  {project.targetWordCount ? ` / ${project.targetWordCount.toLocaleString()} target` : ''}
                  {' · '}
                  <span className={statusBadgeClass(script.status)}>{statusLabel(script.status)}</span>
                </div>
              </div>
              {project.targetWordCount && (
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ height: 6, background: '#e2d9c8', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, ((script.wordCount || 0) / project.targetWordCount) * 100)}%`,
                      background: 'linear-gradient(90deg, #C9A84C, #D4B85A)',
                      borderRadius: 3,
                    }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#6B6560', marginTop: 4 }}>
                    {Math.min(100, Math.round(((script.wordCount || 0) / project.targetWordCount) * 100))}% of target
                  </div>
                </div>
              )}
              <button
                className="sd-btn sd-btn-secondary sd-btn-sm"
                onClick={() => navigate(`/script-dashboard/editor/${script._id || script}`)}
              >
                Open <Icon name="arrow" size={14} />
              </button>
            </div>
          ) : (
            <div style={{ fontSize: 14, color: '#6B6560', fontStyle: 'italic' }}>
              No script created yet.{' '}
              {canWriteOrEdit && (
                <button className="sd-btn sd-btn-primary sd-btn-sm" onClick={handleStartScript} disabled={creating}>
                  {creating ? 'Creating…' : 'Start Writing'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Latest feedback */}
        {project.latestFeedback && (
          <div className="sd-feedback-preview" style={{ marginBottom: 20, padding: '12px 16px' }}>
            <strong>Latest client feedback:</strong> {project.latestFeedback}
          </div>
        )}

        {/* Submission history */}
        {project.submissions?.length > 0 && (
          <div className="sd-project-card" style={{ marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6560' }}>
              Submission History ({project.submissions.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {project.submissions.map((sub, i) => (
                <div key={sub._id || i} style={{ padding: '12px 14px', background: '#F7F2E8', borderRadius: 8, border: '1px solid #e2d9c8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: 13 }}>Submission #{i + 1}</strong>
                    <span className={`sd-badge ${sub.clientResponse?.status === 'accepted' ? 'badge-green' : sub.clientResponse?.status === 'revision_requested' ? 'badge-orange' : 'badge-grey'}`}>
                      {sub.clientResponse?.status === 'accepted' ? 'Accepted' : sub.clientResponse?.status === 'revision_requested' ? 'Revision Requested' : 'Pending Review'}
                    </span>
                    <span style={{ fontSize: 11, color: '#6B6560' }}>
                      <Icon name="clock" size={11} /> {formatDate(sub.submittedAt)}
                      {' · '}{(sub.wordCount || 0).toLocaleString()} words
                    </span>
                  </div>
                  {sub.note && <p style={{ fontSize: 13, color: '#5a5550', margin: '0 0 6px' }}>Your note: {sub.note}</p>}
                  {sub.clientResponse?.feedback && (
                    <p style={{ fontSize: 13, color: '#5a3018', margin: 0, background: '#fbefe6', padding: '6px 10px', borderRadius: 4 }}>
                      Client: {sub.clientResponse.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
    </>
  );
}
