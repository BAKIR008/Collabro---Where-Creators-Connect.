import React from 'react';
import { StepHeader, FileUpload } from '../components';
import { CREATOR_ROLES, ROLE_SKILLS } from '../../../config/creatorRoles';

export const ExpertiseStep = ({ data, onChange }) => {
  const selectedRoles = data.roles || [];
  const primaryRole = data.primaryRole || null;
  const selectedSkills = data.skills || [];
  const experienceLevel = data.experienceLevel || null;

  // Toggle role selection
  const toggleRole = (roleId) => {
    let newRoles = [...selectedRoles];
    let newPrimary = primaryRole;

    if (newRoles.includes(roleId)) {
      // Deselect role
      newRoles = newRoles.filter(r => r !== roleId);
      // If it was primary, set first remaining role as primary
      if (newPrimary === roleId) {
        newPrimary = newRoles.length > 0 ? newRoles[0] : null;
      }
    } else {
      // Select role (max 5)
      if (newRoles.length >= 5) return;
      newRoles.push(roleId);
      // If no primary, make this the primary
      if (!newPrimary) {
        newPrimary = roleId;
      }
    }

    onChange({
      roles: newRoles,
      primaryRole: newPrimary
    });
  };

  // Set primary role
  const setPrimary = (e, roleId) => {
    e.stopPropagation();
    if (selectedRoles.includes(roleId)) {
      onChange({ primaryRole: roleId });
    }
  };

  // Toggle skill selection
  const toggleSkill = (skill) => {
    let newSkills = [...selectedSkills];
    if (newSkills.includes(skill)) {
      newSkills = newSkills.filter(s => s !== skill);
    } else {
      if (newSkills.length >= 15) return; // Max 15 skills
      newSkills.push(skill);
    }
    onChange({ skills: newSkills });
  };

  // Get available skills based on selected roles
  const availableSkills = Array.from(new Set(
    selectedRoles.flatMap(roleId => ROLE_SKILLS[roleId] || [])
  ));

  const handleResumeUpload = (file) => {
    onChange({
      resumeFile: file,
      resume: {
        originalName: file.name,
        size: file.size,
        mimeType: file.type
      }
    });
  };

  const handleResumeRemove = () => {
    onChange({
      resumeFile: null,
      resume: null
    });
  };

  return (
    <div className="expertise-step fade-in">
      <StepHeader
        eyebrow="Step 3"
        title="Your Expertise"
        subtitle="Tell us about your creative skills and experience so we can match you with the right opportunities."
      />

      <div className="ob-card">
        {/* Role Selection */}
        <div className="ob-section">
          <div className="ob-section-title">
            Your Creative Roles
            <span className="ob-section-required">*</span>
          </div>
          {selectedRoles.length > 0 && (
            <div className="ob-primary-hint">
              ⭐ Click the star on your most important role to set it as your <strong>primary role</strong>
            </div>
          )}
          <div className="ob-role-grid">
            {CREATOR_ROLES.map(role => {
              const isSelected = selectedRoles.includes(role.id);
              const isPrimary = primaryRole === role.id;
              
              return (
                <div
                  key={role.id}
                  className={`ob-role-card ${isSelected ? 'selected' : ''} ${isPrimary ? 'primary-role' : ''}`}
                  onClick={() => toggleRole(role.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleRole(role.id);
                    }
                  }}
                  role="checkbox"
                  tabIndex={0}
                  aria-checked={isSelected}
                  aria-label={`${role.label}: ${role.description}`}
                >
                  <span className="ob-role-card-icon" aria-hidden="true">{role.icon}</span>
                  <h3 className="ob-role-card-label">{role.label}</h3>
                  <p className="ob-role-card-desc">{role.description}</p>
                  
                  {isSelected && (
                    <button
                      type="button"
                      className={`ob-role-badge ${isPrimary ? 'ob-role-badge-primary' : 'ob-role-badge-selected'}`}
                      onClick={(e) => setPrimary(e, role.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setPrimary(e, role.id);
                        }
                      }}
                      tabIndex={0}
                      aria-label={isPrimary ? `${role.label} is your primary role` : `Set ${role.label} as primary role`}
                      aria-pressed={isPrimary}
                    >
                      {isPrimary ? '★ PRIMARY' : '☆'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="ob-field-hint" style={{ marginTop: '12px' }}>
            Select 1-5 roles that best describe what you do. Your primary role will be featured prominently on your profile.
          </div>
        </div>

        {/* Skills */}
        {selectedRoles.length > 0 && (
          <div className="ob-section">
            <div className="ob-section-title">
              Your Skills
              <span className="ob-section-required">*</span>
            </div>
            <div className="ob-skills-count">
              {selectedSkills.length}/15 skills selected
            </div>
            <div className="ob-skills-pool">
              {availableSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  className={`ob-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                  onClick={() => toggleSkill(skill)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleSkill(skill);
                    }
                  }}
                  disabled={!selectedSkills.includes(skill) && selectedSkills.length >= 15}
                  tabIndex={0}
                  aria-pressed={selectedSkills.includes(skill)}
                  aria-label={skill}
                >
                  {skill}
                </button>
              ))}
            </div>
            <div className="ob-field-hint" style={{ marginTop: '12px' }}>
              Select up to 15 skills based on your chosen roles. These help us match you with relevant projects.
            </div>
          </div>
        )}

        {/* Experience Level */}
        <div className="ob-section">
          <div className="ob-section-title">
            Experience Level
            <span className="ob-section-required">*</span>
          </div>
          <div className="ob-level-grid">
            {[
              { id: 'beginner', icon: '🌱', label: 'Beginner', years: '0-1 years' },
              { id: 'intermediate', icon: '🚀', label: 'Intermediate', years: '1-3 years' },
              { id: 'advanced', icon: '⭐', label: 'Advanced', years: '3-5 years' },
              { id: 'professional', icon: '🏆', label: 'Professional', years: '5+ years' }
            ].map(level => (
              <div
                key={level.id}
                className={`ob-level-card ${experienceLevel === level.id ? 'selected' : ''}`}
                onClick={() => onChange({ experienceLevel: level.id })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange({ experienceLevel: level.id });
                  }
                }}
                role="radio"
                tabIndex={0}
                aria-checked={experienceLevel === level.id}
                aria-label={`${level.label}: ${level.years}`}
              >
                <div className="ob-level-icon" aria-hidden="true">{level.icon}</div>
                <div className="ob-level-name">{level.label}</div>
                <div className="ob-level-years">{level.years}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="ob-section">
          <div className="ob-section-title">
            Professional Links
            <span className="ob-section-optional">(Optional)</span>
          </div>
          <div className="ob-two-col">
            <div className="ob-field">
              <label htmlFor="github" className="ob-label">GitHub</label>
              <div className="ob-link-field">
                <div className="ob-link-prefix">github.com/</div>
                <input
                  id="github"
                  type="text"
                  className="ob-link-input"
                  value={data.github ? data.github.replace(/^https?:\/\/(www\.)?github\.com\//, '') : ''}
                  onChange={(e) => onChange({ github: `https://github.com/${e.target.value}` })}
                  placeholder="username"
                  aria-label="GitHub username"
                />
              </div>
            </div>
            <div className="ob-field">
              <label htmlFor="linkedin" className="ob-label">LinkedIn</label>
              <div className="ob-link-field">
                <div className="ob-link-prefix">linkedin.com/in/</div>
                <input
                  id="linkedin"
                  type="text"
                  className="ob-link-input"
                  value={data.linkedin ? data.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/, '') : ''}
                  onChange={(e) => onChange({ linkedin: `https://linkedin.com/in/${e.target.value}` })}
                  placeholder="username"
                  aria-label="LinkedIn profile"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resume Upload */}
        <div className="ob-section">
          <div className="ob-section-title">
            Resume / CV
            <span className="ob-section-optional">(Optional)</span>
          </div>
          <FileUpload
            type="document"
            accept={[
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]}
            maxSizeMB={10}
            value={data.resumeFile}
            onChange={handleResumeUpload}
            onRemove={handleResumeRemove}
            title="Upload Your Resume"
            subtitle="Share your professional experience. PDF, DOC, or DOCX • Max 10MB"
          />
          <div className="ob-field-hint" style={{ marginTop: '12px' }}>
            A resume helps clients understand your background and increases trust.
          </div>
        </div>
      </div>
    </div>
  );
};
