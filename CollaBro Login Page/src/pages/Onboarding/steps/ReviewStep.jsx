import React from 'react';
import { StepHeader } from '../components';
import { CREATOR_ROLES, getRoleById } from '../../../config/creatorRoles';
import './ReviewStep.css';

export const ReviewStep = ({ data, onNavigateToStep }) => {
  const isFreelancer = data.accountType === 'freelancer';

  // Label mapping functions
  const formatLabel = (value) => {
    if (!value) return '';
    return value.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getGoalLabel = (goalId) => {
    const goals = {
      'find-collaborators': 'Find Collaborators',
      'find-projects': 'Find Projects',
      'find-clients': 'Find Clients',
      'build-portfolio': 'Build Portfolio',
      'showcase-work': 'Showcase Work',
      'get-discovered': 'Get Discovered',
      'grow-network': 'Grow Network',
      'find-teams': 'Find Teams',
      'learn-skills': 'Learn Skills',
      'earn-income': 'Earn Income'
    };
    return goals[goalId] || formatLabel(goalId);
  };

  const getWorkModeLabel = (mode) => {
    const modes = {
      'remote': 'Remote',
      'hybrid': 'Hybrid',
      'on-site': 'On-site'
    };
    return modes[mode] || formatLabel(mode);
  };

  const getWorkStyleLabel = (style) => {
    const styles = {
      'flexible': 'Flexible',
      'structured': 'Structured',
      'fast-paced': 'Fast-paced',
      'long-term': 'Long-term',
      'short-term': 'Short-term'
    };
    return styles[style] || formatLabel(style);
  };

  const getProjectTypeLabel = (type) => {
    const types = {
      'short-form-video': 'Short-Form Video',
      'long-form-video': 'Long-Form Video',
      'social-media-content': 'Social Media Content',
      'brand-collaborations': 'Brand Collaborations',
      'commercial-work': 'Commercial Work'
    };
    return types[type] || formatLabel(type);
  };

  const getDurationLabel = (duration) => {
    const durations = {
      'one-time': 'One-time Project',
      'short-term': 'Short-term (1-3 months)',
      'long-term': 'Long-term (3+ months)',
      'ongoing': 'Ongoing Work',
      'flexible': 'Flexible / Not sure yet'
    };
    return durations[duration] || formatLabel(duration);
  };

  const getExperienceLevelLabel = (level) => {
    const levels = {
      'beginner': 'Beginner (0-1 years)',
      'intermediate': 'Intermediate (1-3 years)',
      'advanced': 'Advanced (3-5 years)',
      'professional': 'Professional (5+ years)',
      'expert': 'Expert'
    };
    return levels[level] || formatLabel(level);
  };

  const getRoleLabel = (roleId) => {
    const role = getRoleById(roleId);
    return role ? role.label : formatLabel(roleId);
  };

  const handleEdit = (stepId) => {
    if (onNavigateToStep) {
      onNavigateToStep(stepId);
    }
  };

  return (
    <div className="review-step">
      <StepHeader
        eyebrow="Step 4"
        title="Review Your Profile"
        subtitle="Take a final look at your information before joining CollaBro. You can edit any section before completing your profile."
      />

      <div className="review-content">
        {/* Profile Preview Header */}
        <div className="review-profile-header">
          <div className="review-profile-avatar">
            {data.profileImagePreview ? (
              <img src={data.profileImagePreview} alt={data.displayName || 'Profile'} />
            ) : (
              <div className="review-profile-avatar-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
          </div>
          
          <div className="review-profile-info">
            <h2 className="review-profile-name">{data.displayName || 'Your Name'}</h2>
            {data.profileTitle && (
              <p className="review-profile-title">{data.profileTitle}</p>
            )}
            <div className="review-profile-meta">
              <span className="review-profile-badge">
                {isFreelancer ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Freelancer
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    Client
                  </>
                )}
              </span>
              {isFreelancer && data.primaryRole && (
                <span className="review-profile-badge review-profile-badge-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  {getRoleLabel(data.primaryRole)}
                </span>
              )}
            </div>
            {data.bio && (
              <p className="review-profile-bio">{data.bio}</p>
            )}
          </div>
        </div>

        {/* About You Section */}
        <div className="review-section">
          <div className="review-section-header">
            <h3 className="review-section-title">About You</h3>
            <button 
              type="button"
              className="review-edit-btn"
              onClick={() => handleEdit('about-you')}
              aria-label="Edit About You section"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </button>
          </div>
          <div className="review-section-body">
            <div className="review-field">
              <div className="review-field-label">Display Name</div>
              <div className="review-field-value">{data.displayName || '—'}</div>
            </div>
            {!isFreelancer && data.company && (
              <div className="review-field">
                <div className="review-field-label">Company</div>
                <div className="review-field-value">{data.company}</div>
              </div>
            )}
            {data.profileTitle && (
              <div className="review-field">
                <div className="review-field-label">{isFreelancer ? 'Professional Title' : 'Your Role'}</div>
                <div className="review-field-value">{data.profileTitle}</div>
              </div>
            )}
            {data.bio && (
              <div className="review-field">
                <div className="review-field-label">Bio</div>
                <div className="review-field-value">{data.bio}</div>
              </div>
            )}
            {isFreelancer && data.education && (
              <div className="review-field">
                <div className="review-field-label">Education</div>
                <div className="review-field-value">{data.education}</div>
              </div>
            )}
          </div>
        </div>

        {/* Expertise Section (Freelancer) or Needs Section (Client) */}
        {isFreelancer ? (
          <div className="review-section">
            <div className="review-section-header">
              <h3 className="review-section-title">Expertise</h3>
              <button 
                type="button"
                className="review-edit-btn"
                onClick={() => handleEdit('expertise')}
                aria-label="Edit Expertise section"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
            </div>
            <div className="review-section-body">
              {data.roles && data.roles.length > 0 && (
                <div className="review-field">
                  <div className="review-field-label">Creative Roles</div>
                  <div className="review-field-chips">
                    {data.roles.map(roleId => (
                      <span 
                        key={roleId} 
                        className={`review-chip ${roleId === data.primaryRole ? 'review-chip-primary' : ''}`}
                      >
                        {roleId === data.primaryRole && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}>
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        )}
                        {getRoleLabel(roleId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.experienceLevel && (
                <div className="review-field">
                  <div className="review-field-label">Experience Level</div>
                  <div className="review-field-value">{getExperienceLevelLabel(data.experienceLevel)}</div>
                </div>
              )}
              {data.skills && data.skills.length > 0 && (
                <div className="review-field">
                  <div className="review-field-label">Skills</div>
                  <div className="review-field-chips">
                    {data.skills.map(skill => (
                      <span key={skill} className="review-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {(data.github || data.linkedin) && (
                <div className="review-field">
                  <div className="review-field-label">Professional Links</div>
                  <div className="review-field-links">
                    {data.github && (
                      <a href={data.github} target="_blank" rel="noopener noreferrer" className="review-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                    {data.linkedin && (
                      <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="review-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
              {data.resume && (
                <div className="review-field">
                  <div className="review-field-label">Resume</div>
                  <div className="review-field-value">
                    <span className="review-file-indicator">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      {data.resume.originalName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="review-section">
            <div className="review-section-header">
              <h3 className="review-section-title">Your Needs</h3>
              <button 
                type="button"
                className="review-edit-btn"
                onClick={() => handleEdit('client-needs')}
                aria-label="Edit Your Needs section"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
            </div>
            <div className="review-section-body">
              {data.clientNeeds && data.clientNeeds.length > 0 && (
                <div className="review-field">
                  <div className="review-field-label">What You're Looking For</div>
                  <div className="review-field-chips">
                    {data.clientNeeds.map(need => (
                      <span key={need} className="review-chip">{formatLabel(need)}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.collaborationPreferences?.creatorRoles && data.collaborationPreferences.creatorRoles.length > 0 && (
                <div className="review-field">
                  <div className="review-field-label">Creator Roles You Need</div>
                  <div className="review-field-chips">
                    {data.collaborationPreferences.creatorRoles.map(roleId => (
                      <span key={roleId} className="review-chip">{getRoleLabel(roleId)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Goals & Preferences Section */}
        <div className="review-section">
          <div className="review-section-header">
            <h3 className="review-section-title">Goals & Preferences</h3>
            <button 
              type="button"
              className="review-edit-btn"
              onClick={() => handleEdit('goals-preferences')}
              aria-label="Edit Goals & Preferences section"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </button>
          </div>
          <div className="review-section-body">
            {isFreelancer ? (
              <>
                {data.goals && data.goals.length > 0 && (
                  <div className="review-field">
                    <div className="review-field-label">Your Goals</div>
                    <div className="review-field-chips">
                      {data.goals.map(goal => (
                        <span key={goal} className="review-chip">{getGoalLabel(goal)}</span>
                      ))}
                    </div>
                  </div>
                )}
                {data.workMode && (
                  <div className="review-field">
                    <div className="review-field-label">Work Mode</div>
                    <div className="review-field-value">{getWorkModeLabel(data.workMode)}</div>
                  </div>
                )}
                {data.workStyle && (
                  <div className="review-field">
                    <div className="review-field-label">Work Style</div>
                    <div className="review-field-value">{getWorkStyleLabel(data.workStyle)}</div>
                  </div>
                )}
              </>
            ) : (
              <>
                {data.collaborationPreferences?.projectTypes && data.collaborationPreferences.projectTypes.length > 0 && (
                  <div className="review-field">
                    <div className="review-field-label">Project Types</div>
                    <div className="review-field-chips">
                      {data.collaborationPreferences.projectTypes.map(type => (
                        <span key={type} className="review-chip">{getProjectTypeLabel(type)}</span>
                      ))}
                    </div>
                  </div>
                )}
                {data.collaborationPreferences?.duration && (
                  <div className="review-field">
                    <div className="review-field-label">Expected Duration</div>
                    <div className="review-field-value">{getDurationLabel(data.collaborationPreferences.duration)}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Completion Message */}
        <div className="review-completion-message">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <div>
            <h4>Ready to join CollaBro?</h4>
            <p>Your profile looks great! Click Complete My Profile below to save your information and start {isFreelancer ? 'collaborating with clients and other creators' : 'finding talented creators for your projects'}.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
