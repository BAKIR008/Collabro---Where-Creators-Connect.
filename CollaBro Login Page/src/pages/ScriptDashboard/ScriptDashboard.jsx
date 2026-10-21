/**
 * CollaBro — Script Writing Dashboard
 * src/pages/ScriptDashboard/ScriptDashboard.jsx
 *
 * The main authenticated dashboard for script writers.
 * Displays:
 *  - Profile from onboarding data (real user, real picture)
 *  - My Scripts (from API)
 *  - Client Projects (from API)
 *  - Editor navigation
 *
 * Does NOT include: Discover Creators, Find Collaborators, Community, Team formation.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import CustomCursor from '../../components/CustomCursor.jsx';
import './ScriptDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ─── Helpers ─── */

function formatDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateString);
}

function statusBadgeClass(status) {
  const map = {
    draft: 'badge-grey',
    submitted: 'badge-blue',
    revision: 'badge-orange',
    completed: 'badge-green',
    open: 'badge-grey',
    in_progress: 'badge-purple',
    under_review: 'badge-blue',
    revision_requested: 'badge-orange',
  };
  return `sd-badge ${map[status] || 'badge-grey'}`;
}

function statusLabel(status) {
  const map = {
    draft: 'Draft',
    submitted: 'Submitted',
    revision: 'Revision',
    completed: 'Completed',
    open: 'Open',
    in_progress: 'In Progress',
    submitted_for_review: 'Submitted',
    under_review: 'Under Review',
    revision_requested: 'Revision Requested',
  };
  return map[status] || status;
}

/* ─── Avatar component ─── */
function Avatar({ src, name, size = 40 }) {
  const [error, setError] = useState(false);

  const initials = (name || 'U')
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('');

  if (src && !error) {
    return (
      <img
        className="sd-avatar"
        src={src}
        alt={name || 'User'}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div
      className="sd-avatar sd-avatar-initials"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-label={name || 'User'}
    >
      {initials || '?'}
    </div>
  );
}

/* ─── Icon ─── */
function Icon({ name, size = 18 }) {
  const paths = {
    pen: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" /></>,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    trash: <><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
    download: <><path d="M12 16V4m-4 8 4 4 4-4M4 16v4h16v-4" /></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-7 8-7s8 3 8 7" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    chartBar: <><path d="M18 20V10M12 20V4M6 20v-6" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.pen}
    </svg>
  );
}

/* ─── Sidebar Navigation ─── */
function Sidebar({ activeSection, onNavigate, userName, userPicture }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sd-sidebar">
      <div className="sd-sidebar-brand">
        <span className="sd-brand-name">COLLAB<span>R</span>O</span>
        <span className="sd-brand-tag">THE CREATORS HUB</span>
      </div>

      <nav className="sd-nav" aria-label="Dashboard navigation">
        <button
          className={`sd-nav-item ${activeSection === 'studio' ? 'is-active' : ''}`}
          onClick={() => onNavigate('studio')}
        >
          <Icon name="pen" size={17} />
          My Writing Studio
        </button>
        <button
          className={`sd-nav-item ${activeSection === 'scripts' ? 'is-active' : ''}`}
          onClick={() => onNavigate('scripts')}
        >
          <Icon name="document" size={17} />
          My Scripts
        </button>
        <button
          className={`sd-nav-item ${activeSection === 'projects' ? 'is-active' : ''}`}
          onClick={() => onNavigate('projects')}
        >
          <Icon name="briefcase" size={17} />
          Client Projects
        </button>
        <button
          className={`sd-nav-item ${activeSection === 'profile' ? 'is-active' : ''}`}
          onClick={() => onNavigate('profile')}
        >
          <Icon name="user" size={17} />
          My Profile
        </button>
      </nav>

      <div className="sd-sidebar-footer">
        <div className="sd-sidebar-user">
          <Avatar src={userPicture} name={userName} size={32} />
          <span className="sd-sidebar-user-name">{userName?.split(' ')[0] || 'Writer'}</span>
        </div>
        <button className="sd-logout-btn" onClick={handleLogout} aria-label="Sign out">
          <Icon name="logout" size={16} />
        </button>
      </div>
    </aside>
  );
}

/* ─── Section: My Writing Studio ─── */
function StudioSection({ user, profile, scripts, onNewScript, onOpenScript }) {
  const navigate = useNavigate();
  const recentScripts = scripts.slice(0, 3);
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Writer';

  return (
    <section className="sd-section" aria-labelledby="studio-heading">
      <div className="sd-hero">
        <div className="sd-hero-copy">
          <div className="sd-eyebrow">YOUR WRITING STUDIO</div>
          <h1>
            WRITE.<br />
            <mark>CRAFT.</mark><br />
            <i>DELIVER</i> GREAT SCRIPTS.
          </h1>
          <p>
            Hey <strong>{firstName}</strong> — your private writing space is ready.
            Create scripts, track projects, and deliver your best work.
          </p>
          <button className="sd-btn sd-btn-primary" onClick={onNewScript}>
            <Icon name="plus" size={16} />
            New Script
          </button>
        </div>

        <div className="sd-hero-stats" aria-label="Writing stats">
          <div className="sd-stat-card">
            <span className="sd-stat-number">{scripts.length}</span>
            <span className="sd-stat-label">Total Scripts</span>
          </div>
          <div className="sd-stat-card">
            <span className="sd-stat-number">
              {scripts.filter((s) => s.status === 'draft').length}
            </span>
            <span className="sd-stat-label">In Draft</span>
          </div>
          <div className="sd-stat-card">
            <span className="sd-stat-number">
              {scripts.reduce((sum, s) => sum + (s.wordCount || 0), 0).toLocaleString()}
            </span>
            <span className="sd-stat-label">Total Words</span>
          </div>
        </div>
      </div>

      {recentScripts.length > 0 && (
        <div className="sd-section-block">
          <div className="sd-section-header">
            <h2>Recent Work</h2>
          </div>
          <div className="sd-script-grid">
            {recentScripts.map((script) => (
              <ScriptCard
                key={script._id}
                script={script}
                onOpen={() => onOpenScript(script._id)}
              />
            ))}
          </div>
        </div>
      )}

      {recentScripts.length === 0 && (
        <div className="sd-empty-state">
          <div className="sd-empty-icon"><Icon name="pen" size={32} /></div>
          <h3>Start your first script</h3>
          <p>Your writing studio is empty. Click "New Script" to begin your first screenplay, pilot, or short.</p>
          <button className="sd-btn sd-btn-primary" onClick={onNewScript}>
            <Icon name="plus" size={16} />
            Create Script
          </button>
        </div>
      )}
    </section>
  );
}

/* ─── Script Card ─── */
function ScriptCard({ script, onOpen, onDelete }) {
  return (
    <article className="sd-script-card">
      <div className="sd-script-card-header">
        <span className={statusBadgeClass(script.status)}>
          {statusLabel(script.status)}
        </span>
        {script.format && <span className="sd-format-tag">{script.format}</span>}
      </div>
      <h3 className="sd-script-title">{script.title}</h3>
      {script.synopsis && (
        <p className="sd-script-synopsis">{script.synopsis.slice(0, 100)}{script.synopsis.length > 100 ? '…' : ''}</p>
      )}
      <div className="sd-script-meta">
        <span><Icon name="chartBar" size={13} /> {(script.wordCount || 0).toLocaleString()} words</span>
        <span><Icon name="clock" size={13} /> {timeAgo(script.updatedAt || script.lastSavedAt)}</span>
      </div>
      <div className="sd-script-actions">
        <button className="sd-btn sd-btn-secondary sd-btn-sm" onClick={onOpen}>
          Open Editor <Icon name="arrow" size={14} />
        </button>
        {onDelete && (
          <button className="sd-btn sd-btn-ghost sd-btn-sm" onClick={onDelete} aria-label="Delete script">
            <Icon name="trash" size={14} />
          </button>
        )}
      </div>
    </article>
  );
}

/* ─── Section: My Scripts ─── */
function ScriptsSection({ scripts, loading, onNewScript, onOpenScript, onDeleteScript }) {
  return (
    <section className="sd-section" aria-labelledby="scripts-heading">
      <div className="sd-section-header">
        <h2 id="scripts-heading">My Scripts</h2>
        <button className="sd-btn sd-btn-primary sd-btn-sm" onClick={onNewScript}>
          <Icon name="plus" size={15} />
          New Script
        </button>
      </div>

      {loading ? (
        <div className="sd-loading-state"><div className="sd-spinner" /> Loading scripts…</div>
      ) : scripts.length === 0 ? (
        <div className="sd-empty-state">
          <div className="sd-empty-icon"><Icon name="document" size={28} /></div>
          <h3>No scripts yet</h3>
          <p>Create your first script to get started.</p>
          <button className="sd-btn sd-btn-primary" onClick={onNewScript}>
            <Icon name="plus" size={16} />
            New Script
          </button>
        </div>
      ) : (
        <div className="sd-script-grid">
          {scripts.map((script) => (
            <ScriptCard
              key={script._id}
              script={script}
              onOpen={() => onOpenScript(script._id)}
              onDelete={() => onDeleteScript(script._id, script.title)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Section: Client Projects ─── */
function ProjectsSection({ projects, loading, onOpenProject }) {
  const navigate = useNavigate();

  return (
    <section className="sd-section" aria-labelledby="projects-heading">
      <div className="sd-section-header">
        <h2 id="projects-heading">Client Projects</h2>
      </div>

      {loading ? (
        <div className="sd-loading-state"><div className="sd-spinner" /> Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="sd-empty-state">
          <div className="sd-empty-icon"><Icon name="briefcase" size={28} /></div>
          <h3>No client projects yet</h3>
          <p>
            When a client assigns a script-writing project to you on CollaBro,
            it will appear here.
          </p>
        </div>
      ) : (
        <div className="sd-project-list">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onOpen={() => onOpenProject(project._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Project Card ─── */
function ProjectCard({ project, onOpen }) {
  const clientName = project.client?.name || 'Unknown client';
  const script = project.linkedScript;

  return (
    <article className="sd-project-card">
      <div className="sd-project-card-top">
        <div className="sd-project-info">
          <span className={statusBadgeClass(project.status)}>{statusLabel(project.status)}</span>
          {project.format && <span className="sd-format-tag">{project.format}</span>}
        </div>
        {project.deadline && (
          <div className="sd-deadline">
            <Icon name="calendar" size={13} />
            Due {formatDate(project.deadline)}
          </div>
        )}
      </div>

      <h3 className="sd-project-title">{project.title}</h3>
      <p className="sd-project-client">
        <Avatar src={project.client?.profilePicture} name={clientName} size={22} />
        Client: {clientName}
      </p>

      {project.description && (
        <p className="sd-project-desc">{project.description.slice(0, 120)}{project.description.length > 120 ? '…' : ''}</p>
      )}

      <div className="sd-project-script-info">
        {script ? (
          <>
            <Icon name="document" size={14} />
            <span>Script: <strong>{script.title}</strong></span>
            <span>· {(script.wordCount || 0).toLocaleString()} words</span>
            {project.targetWordCount && (
              <span>/ {project.targetWordCount.toLocaleString()} target</span>
            )}
          </>
        ) : (
          <span className="sd-no-script">No script created yet</span>
        )}
      </div>

      {project.latestFeedback && (
        <div className="sd-feedback-preview">
          <strong>Client feedback:</strong> {project.latestFeedback.slice(0, 100)}{project.latestFeedback.length > 100 ? '…' : ''}
        </div>
      )}

      <button className="sd-btn sd-btn-secondary sd-btn-sm" onClick={onOpen}>
        Open Project <Icon name="arrow" size={14} />
      </button>
    </article>
  );
}

/* ─── Section: Profile ─── */
function ProfileSection({ user, profile, onEditProfile }) {
  const { refreshUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const displayName = profile?.displayName || user?.name || 'Script Writer';
  const profileTitle = profile?.profileTitle || 'Script Writer';
  const bio = profile?.bio || user?.bio || '';
  const skills = profile?.skills || [];
  const tools = profile?.tools || [];
  const experienceLevel = profile?.experienceLevel || '';
  const goals = profile?.goals || [];

  const goalLabels = {
    'find-collaborators': 'Find collaborators',
    'build-portfolio': 'Build portfolio',
    'learn-skills': 'Learn skills',
    'earn-income': 'Earn income',
    'network': 'Network',
    'get-discovered': 'Get discovered',
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('picture', file);
      const res = await fetch(`${API_URL}/api/auth/profile/picture`, {
        method: 'POST',
        credentials: 'include',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.message || 'Upload failed. Please try again.');
        return;
      }
      // Refresh the global user context so the new picture appears everywhere
      await refreshUser();
    } catch (err) {
      setUploadError('Network error. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input so selecting the same file again triggers onChange
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section className="sd-section" aria-labelledby="profile-heading">
      <div className="sd-section-header">
        <h2 id="profile-heading">My Profile &amp; Portfolio</h2>
        <button className="sd-btn sd-btn-secondary sd-btn-sm" onClick={onEditProfile}>
          <Icon name="edit" size={15} />
          Edit Profile
        </button>
      </div>

      <div className="sd-profile-card">
        <div className="sd-profile-header">
          {/* Clickable avatar triggers file picker */}
          <div className="sd-avatar-upload-wrap">
            <Avatar src={user?.profilePicture} name={displayName} size={80} />
            <button
              type="button"
              className="sd-avatar-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Change profile picture"
              title="Change profile picture"
            >
              {uploading ? '…' : '📷'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handlePictureChange}
            />
          </div>
          <div className="sd-profile-meta">
            <h3 className="sd-profile-name">{displayName}</h3>
            <p className="sd-profile-title">{profileTitle}</p>
            {experienceLevel && (
              <span className="sd-badge badge-grey" style={{ textTransform: 'capitalize' }}>
                {experienceLevel}
              </span>
            )}
          </div>
        </div>

        {uploadError && (
          <p className="sd-upload-error" role="alert">{uploadError}</p>
        )}

        {bio && (
          <div className="sd-profile-section">
            <h4>About</h4>
            <p>{bio}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div className="sd-profile-section">
            <h4>Skills</h4>
            <div className="sd-tag-list">
              {skills.map((skill) => (
                <span key={skill} className="sd-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {tools.length > 0 && (
          <div className="sd-profile-section">
            <h4>Tools &amp; Software</h4>
            <div className="sd-tag-list">
              {tools.map((tool) => (
                <span key={tool} className="sd-tag">{tool}</span>
              ))}
            </div>
          </div>
        )}

        {goals.length > 0 && (
          <div className="sd-profile-section">
            <h4>Goals</h4>
            <div className="sd-tag-list">
              {goals.map((goal) => (
                <span key={goal} className="sd-tag sd-tag-accent">{goalLabels[goal] || goal}</span>
              ))}
            </div>
          </div>
        )}

        {profile?.workPreferences?.categories?.length > 0 && (
          <div className="sd-profile-section">
            <h4>Work Categories</h4>
            <div className="sd-tag-list">
              {profile.workPreferences.categories.map((cat) => (
                <span key={cat} className="sd-tag">{cat}</span>
              ))}
            </div>
          </div>
        )}

        {!bio && skills.length === 0 && (
          <div className="sd-profile-incomplete">
            <p>Your profile is sparse. Complete your onboarding to help clients find you.</p>
            <button className="sd-btn sd-btn-primary sd-btn-sm" onClick={onEditProfile}>
              Complete Profile
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── New Script Modal ─── */
function NewScriptModal({ isOpen, onClose, onConfirm, creating }) {
  const [title, setTitle] = useState('');
  const [format, setFormat] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onConfirm({ title: title.trim(), format, genre, synopsis });
  };

  return (
    <div
      className="sd-modal-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <div className="sd-modal" role="dialog" aria-modal="true" aria-labelledby="new-script-modal-title">
        <div className="sd-modal-header">
          <h2 id="new-script-modal-title">New Script</h2>
          <button className="sd-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="sd-modal-body">
          <div className="sd-field">
            <label htmlFor="ns-title">Script Title *</label>
            <input
              id="ns-title"
              type="text"
              maxLength={200}
              placeholder="e.g. The Last Light"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="sd-field-row">
            <div className="sd-field">
              <label htmlFor="ns-format">Format</label>
              <select id="ns-format" value={format} onChange={(e) => setFormat(e.target.value)}>
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
              <label htmlFor="ns-genre">Genre</label>
              <input
                id="ns-genre"
                type="text"
                maxLength={100}
                placeholder="e.g. Thriller, Drama"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
          </div>

          <div className="sd-field">
            <label htmlFor="ns-synopsis">Synopsis / Logline</label>
            <textarea
              id="ns-synopsis"
              maxLength={2000}
              rows={3}
              placeholder="Briefly describe your script…"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
            />
          </div>

          <div className="sd-modal-actions">
            <button type="button" className="sd-btn sd-btn-ghost" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="sd-btn sd-btn-primary"
              disabled={!title.trim() || creating}
            >
              {creating ? 'Creating…' : 'Create & Open Editor'}
              {!creating && <Icon name="arrow" size={15} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete confirmation ─── */
function DeleteConfirmModal({ scriptTitle, onConfirm, onCancel, deleting }) {
  return (
    <div className="sd-modal-backdrop" role="presentation">
      <div className="sd-modal sd-modal-sm" role="dialog" aria-modal="true">
        <div className="sd-modal-header">
          <h2>Delete Script?</h2>
          <button className="sd-modal-close" onClick={onCancel} aria-label="Close">×</button>
        </div>
        <div className="sd-modal-body">
          <p>Are you sure you want to delete <strong>"{scriptTitle}"</strong>?<br />This action cannot be undone.</p>
          <div className="sd-modal-actions">
            <button className="sd-btn sd-btn-ghost" onClick={onCancel} disabled={deleting}>Cancel</button>
            <button className="sd-btn sd-btn-danger" onClick={onConfirm} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete Script'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function ScriptDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [activeSection, setActiveSection] = useState('studio');
  const [profile, setProfile] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [scriptsLoading, setScriptsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [newScriptOpen, setNewScriptOpen] = useState(false);
  const [creatingScript, setCreatingScript] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  }, []);

  /* Load profile */
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/onboarding/responses`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (e) {
        console.error('[Profile load error]', e);
      } finally {
        setProfileLoading(false);
      }
    };
    load();
  }, [user]);

  /* Load scripts */
  const loadScripts = useCallback(async () => {
    setScriptsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/scripts`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setScripts(data.scripts || []);
      } else if (res.status !== 401) {
        console.error('[Scripts load error]', res.status);
      }
    } catch (e) {
      console.error('[Scripts load error]', e);
    } finally {
      setScriptsLoading(false);
    }
  }, []);

  /* Load projects */
  const loadProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/script-projects`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else if (res.status !== 401) {
        console.error('[Projects load error]', res.status);
      }
    } catch (e) {
      console.error('[Projects load error]', e);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadScripts();
      loadProjects();
    }
  }, [user, loadScripts, loadProjects]);

  /* Redirect if not authenticated */
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  /* Create script */
  const handleCreateScript = async ({ title, format, genre, synopsis }) => {
    setCreatingScript(true);
    try {
      const res = await fetch(`${API_URL}/api/scripts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, format, genre, synopsis }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.message || 'Could not create script.');
        return;
      }
      setNewScriptOpen(false);
      navigate(`/script-dashboard/editor/${data.script._id}`);
    } catch (e) {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setCreatingScript(false);
    }
  };

  /* Delete script */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/scripts/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.message || 'Could not delete script.');
        return;
      }
      setScripts((prev) => prev.filter((s) => s._id !== deleteTarget.id));
      showToast('success', `"${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
    } catch (e) {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  /* Edit profile — navigate to onboarding in edit mode */
  const handleEditProfile = () => {
    navigate('/onboarding', { state: { editMode: true } });
  };

  /* Open a project — navigate to the editor if there's a script, or create one */
  const handleOpenProject = (projectId) => {
    navigate(`/script-dashboard/project/${projectId}`);
  };

  if (authLoading) {
    return (
      <>
        <CustomCursor />
        <div className="sd-loading-full">
          <div className="sd-spinner-large" />
          <p>Loading your studio…</p>
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
    <CustomCursor />
    <div className="sd-root">
      {/* Toast */}
      {toast && (
        <div className={`sd-toast sd-toast-${toast.type}`} key={toast.id} role="alert" aria-live="assertive">
          {toast.message}
        </div>
      )}

      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        userName={user.name}
        userPicture={user.profilePicture}
      />

      <main className="sd-main">
        {activeSection === 'studio' && (
          <StudioSection
            user={user}
            profile={profile}
            scripts={scripts}
            onNewScript={() => setNewScriptOpen(true)}
            onOpenScript={(id) => navigate(`/script-dashboard/editor/${id}`)}
          />
        )}

        {activeSection === 'scripts' && (
          <ScriptsSection
            scripts={scripts}
            loading={scriptsLoading}
            onNewScript={() => setNewScriptOpen(true)}
            onOpenScript={(id) => navigate(`/script-dashboard/editor/${id}`)}
            onDeleteScript={(id, title) => setDeleteTarget({ id, title })}
          />
        )}

        {activeSection === 'projects' && (
          <ProjectsSection
            projects={projects}
            loading={projectsLoading}
            onOpenProject={handleOpenProject}
          />
        )}

        {activeSection === 'profile' && (
          <ProfileSection
            user={user}
            profile={profile}
            onEditProfile={handleEditProfile}
          />
        )}
      </main>

      {/* Modals */}
      <NewScriptModal
        isOpen={newScriptOpen}
        onClose={() => setNewScriptOpen(false)}
        onConfirm={handleCreateScript}
        creating={creatingScript}
      />

      {deleteTarget && (
        <DeleteConfirmModal
          scriptTitle={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
    </>
  );
}
