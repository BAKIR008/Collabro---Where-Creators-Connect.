/**
 * CollaborationStep Component
 * Step 4: Collaboration preferences
 */

import React, { useState, useEffect } from 'react';
import { CREATOR_ROLES } from '../../../config/creatorRoles.js';
import { StepHeader } from '../components';
import './CollaborationStep.css';

const PROJECT_TYPES = [
  { value: 'short-form-video', label: 'Short-Form Video', icon: '📱' },
  { value: 'long-form-video', label: 'Long-Form Video', icon: '🎬' },
  { value: 'social-media-content', label: 'Social Media Content', icon: '📲' },
  { value: 'brand-collaborations', label: 'Brand Collaborations', icon: '🏢' },
  { value: 'personal-projects', label: 'Personal Projects', icon: '💡' },
  { value: 'commercial-work', label: 'Commercial Work', icon: '💼' },
  { value: 'educational-content', label: 'Educational Content', icon: '🎓' },
  { value: 'creative-experiments', label: 'Creative Experiments', icon: '🔬' },
];

const DURATIONS = [
  { value: 'one-time', label: 'One-Time', description: 'Single projects', icon: '⚡' },
  { value: 'short-term', label: 'Short-Term', description: '1-3 months', icon: '📅' },
  { value: 'long-term', label: 'Long-Term', description: '3+ months', icon: '📆' },
  { value: 'ongoing', label: 'Ongoing', description: 'Continuous collaboration', icon: '🔄' },
];

const WORK_MODES = [
  { value: 'remote', label: 'Remote', description: 'Work from anywhere', icon: '🌍' },
  { value: 'in-person', label: 'In-Person', description: 'Local collaborations', icon: '🏙️' },
  { value: 'hybrid', label: 'Hybrid', description: 'Flexible approach', icon: '🔀' },
];

export const CollaborationStep = ({ data, onChange }) => {
  const [selectedRoles, setSelectedRoles] = useState(
    data.collaborationPreferences?.creatorRoles || []
  );
  const [selectedProjectTypes, setSelectedProjectTypes] = useState(
    data.collaborationPreferences?.projectTypes || []
  );
  const [duration, setDuration] = useState(
    data.collaborationPreferences?.duration || ''
  );
  const [workMode, setWorkMode] = useState(
    data.collaborationPreferences?.workMode || ''
  );

  /**
   * Handle creator role toggle
   */
  const handleRoleToggle = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  /**
   * Handle project type toggle
   */
  const handleProjectTypeToggle = (type) => {
    setSelectedProjectTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  /**
   * Sync changes to parent
   */
  useEffect(() => {
    onChange({
      collaborationPreferences: {
        creatorRoles: selectedRoles,
        projectTypes: selectedProjectTypes,
        duration,
        workMode,
      },
    });
  }, [selectedRoles, selectedProjectTypes, duration, workMode, onChange]);

  return (
    <div className="collaboration-step">
      <StepHeader
        icon="🤝"
        title="Collaboration Style"
        subtitle="How do you like to work with others?"
      />

      {/* Roles to collaborate with */}
      <div className="form-section">
        <h3 className="section-title">Roles You Want to Collaborate With</h3>
        <p className="section-help">
          Select the types of creators you want to work with
        </p>

        <div className="role-selector-compact">
          {CREATOR_ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              className={`role-chip ${
                selectedRoles.includes(role.id) ? 'selected' : ''
              }`}
              onClick={() => handleRoleToggle(role.id)}
            >
              <span className="role-chip-icon">{role.icon}</span>
              <span className="role-chip-label">{role.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Project types */}
      <div className="form-section">
        <h3 className="section-title">Project Types</h3>
        <p className="section-help">What kinds of projects interest you?</p>

        <div className="project-types-grid">
          {PROJECT_TYPES.map((type) => (
            <div
              key={type.value}
              className={`project-type-card ${
                selectedProjectTypes.includes(type.value) ? 'selected' : ''
              }`}
              onClick={() => handleProjectTypeToggle(type.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProjectTypeToggle(type.value);
                }
              }}
            >
              <div className="project-type-icon">{type.icon}</div>
              <span className="project-type-label">{type.label}</span>
              <div className="project-type-checkbox">
                {selectedProjectTypes.includes(type.value) ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="form-section">
        <h3 className="section-title">Preferred Project Duration</h3>

        <div className="option-cards">
          {DURATIONS.map((dur) => (
            <div
              key={dur.value}
              className={`option-card ${duration === dur.value ? 'selected' : ''}`}
              onClick={() => setDuration(dur.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setDuration(dur.value);
                }
              }}
            >
              <div className="option-icon">{dur.icon}</div>
              <h4 className="option-label">{dur.label}</h4>
              <p className="option-description">{dur.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Work mode */}
      <div className="form-section">
        <h3 className="section-title">Work Mode</h3>

        <div className="option-cards">
          {WORK_MODES.map((mode) => (
            <div
              key={mode.value}
              className={`option-card ${workMode === mode.value ? 'selected' : ''}`}
              onClick={() => setWorkMode(mode.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setWorkMode(mode.value);
                }
              }}
            >
              <div className="option-icon">{mode.icon}</div>
              <h4 className="option-label">{mode.label}</h4>
              <p className="option-description">{mode.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
