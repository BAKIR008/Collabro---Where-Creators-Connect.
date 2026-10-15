/**
 * ExpertiseStep Component
 * Step 3 (Freelancer): Single primary role selection + skills + experience level
 *
 * Role selection is SINGLE-SELECT (radio card behaviour):
 *  - Clicking a role selects it and deselects any previous selection.
 *  - The selected role is stored as `primaryRole` (a plain string).
 *  - `roles` is kept as a single-element array for backward-compat with the
 *    backend which may still read it, but primaryRole is the canonical field.
 */

import React from 'react';
import { StepHeader } from '../components';
import { CREATOR_ROLES, ROLE_SKILLS } from '../../../config/creatorRoles';

export const ExpertiseStep = ({ data, onChange }) => {
  const primaryRole = data.primaryRole || null;
  const selectedSkills = data.skills || [];
  const experienceLevel = data.experienceLevel || null;

  // ── Single-select role handler ──────────────────────────────────────────
  const selectRole = (roleId) => {
    // If clicking the already-selected role, do nothing (keep it selected)
    if (primaryRole === roleId) return;

    onChange({
      primaryRole: roleId,
      // Clear skills when role changes so user picks relevant ones
      skills: [],
    });
  };

  // ── Skill toggle ────────────────────────────────────────────────────────
  const toggleSkill = (skill) => {
    let newSkills = [...selectedSkills];
    if (newSkills.includes(skill)) {
      newSkills = newSkills.filter((s) => s !== skill);
    } else {
      if (newSkills.length >= 15) return;
      newSkills.push(skill);
    }
    onChange({ skills: newSkills });
  };

  // Skills pool derived from the selected single role
  const availableSkills = primaryRole ? (ROLE_SKILLS[primaryRole] || []) : [];

  return (
    <div className="expertise-step fade-in">
      <StepHeader
        eyebrow="Step 3"
        title="Your Expertise"
        subtitle="Select your primary creative role and tell us about your skills."
      />

      <div className="ob-card">
        {/* ── Role Selection (Single-Select) ─────────────────────────── */}
        <div className="ob-section">
          <div className="ob-section-title">
            Your Primary Role
            <span className="ob-section-required">*</span>
          </div>
          <div className="ob-section-desc" style={{ marginBottom: '16px', color: '#6b6560', fontSize: '0.875rem' }}>
            Choose the one role that best defines your creative work. You can only select one.
          </div>

          <div className="ob-role-grid">
            {CREATOR_ROLES.map((role) => {
              const isSelected = primaryRole === role.id;

              return (
                <div
                  key={role.id}
                  className={`ob-role-card ${isSelected ? 'selected primary-role' : ''}`}
                  onClick={() => selectRole(role.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectRole(role.id);
                    }
                  }}
                  role="radio"
                  tabIndex={0}
                  aria-checked={isSelected}
                  aria-label={`${role.label}: ${role.description}`}
                >
                  <span className="ob-role-card-icon" aria-hidden="true">{role.icon}</span>
                  <h3 className="ob-role-card-label">{role.label}</h3>
                  <p className="ob-role-card-desc">{role.description}</p>

                  {isSelected && (
                    <div
                      className="ob-role-badge ob-role-badge-primary"
                      aria-label={`${role.label} is your primary role`}
                    >
                      ★ PRIMARY
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="ob-field-hint" style={{ marginTop: '12px' }}>
            Select exactly one role. Click another role to switch your selection.
          </div>
        </div>

        {/* ── Skills (shown after role is selected) ───────────────────── */}
        {primaryRole && availableSkills.length > 0 && (
          <div className="ob-section">
            <div className="ob-section-title">
              Your Skills
              <span className="ob-section-required">*</span>
            </div>
            <div className="ob-skills-count">
              {selectedSkills.length}/15 skills selected
            </div>
            <div className="ob-skills-pool">
              {availableSkills.map((skill) => (
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
              Select up to 15 skills. These help match you with relevant projects.
            </div>
          </div>
        )}

        {/* ── Experience Level ────────────────────────────────────────── */}
        <div className="ob-section">
          <div className="ob-section-title">
            Experience Level
            <span className="ob-section-required">*</span>
          </div>
          <div className="ob-level-grid">
            {[
              { id: 'beginner',     icon: '🌱', label: 'Beginner',     years: '0-1 years' },
              { id: 'intermediate', icon: '🚀', label: 'Intermediate', years: '1-3 years' },
              { id: 'advanced',     icon: '⭐', label: 'Advanced',     years: '3-5 years' },
              { id: 'expert',       icon: '🏆', label: 'Expert',       years: '5+ years' },
            ].map((level) => (
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

        {/* ── Professional Links (optional) ───────────────────────────── */}
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
      </div>
    </div>
  );
};
