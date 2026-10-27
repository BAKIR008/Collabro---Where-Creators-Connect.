/**
 * CollaborationStep Component
 * Step 4: Collaboration preferences
 * (Legacy step — kept for backward compatibility but not used in active flow)
 */

import React, { useState, useEffect } from 'react';
import { CREATOR_ROLES } from '../../../config/creatorRoles.js';
import { StepHeader } from '../components';
import './CollaborationStep.css';

const PROJECT_TYPES = [
  { value: 'short-form-video',     label: 'Short-Form Video'     },
  { value: 'long-form-video',      label: 'Long-Form Video'      },
  { value: 'social-media-content', label: 'Social Media Content' },
  { value: 'brand-collaborations', label: 'Brand Collaborations' },
  { value: 'personal-projects',    label: 'Personal Projects'    },
  { value: 'commercial-work',      label: 'Commercial Work'      },
  { value: 'educational-content',  label: 'Educational Content'  },
  { value: 'creative-experiments', label: 'Creative Experiments' },
];

const DURATIONS = [
  { value: 'one-time',   label: 'One-Time',   description: 'Single projects'         },
  { value: 'short-term', label: 'Short-Term', description: '1-3 months'              },
  { value: 'long-term',  label: 'Long-Term',  description: '3+ months'               },
  { value: 'ongoing',    label: 'Ongoing',    description: 'Continuous collaboration' },
];

const WORK_MODES = [
  { value: 'remote',    label: 'Remote',    description: 'Work from anywhere'   },
  { value: 'in-person', label: 'In-Person', description: 'Local collaborations' },
  { value: 'hybrid',    label: 'Hybrid',    description: 'Flexible approach'    },
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

  const handleRoleToggle = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleProjectTypeToggle = (type) => {
    setSelectedProjectTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

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
        title="Collaboration Style"
        subtitle="How do you like to work with others?"
      />

      {/* Roles to collaborate with */}
      <div className="form-section">
        <h3 className="section-title">Roles You Want to Collaborate With</h3>
        <p className="section-help">Select the types of creators you want to work with</p>
        <div className="role-selector-compact">
          {CREATOR_ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              className={`role-chip ${selectedRoles.includes(role.id) ? 'selected' : ''}`}
              onClick={() => handleRoleToggle(role.id)}
            >
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
              className={`project-type-card ${selectedProjectTypes.includes(type.value) ? 'selected' : ''}`}
              onClick={() => handleProjectTypeToggle(type.value)}
              role="checkbox"
              tabIndex={0}
              aria-checked={selectedProjectTypes.includes(type.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProjectTypeToggle(type.value);
                }
              }}
            >
              <span className="project-type-label">{type.label}</span>
              <div className="project-type-checkbox" aria-hidden="true">
                {selectedProjectTypes.includes(type.value) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
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
              role="radio"
              tabIndex={0}
              aria-checked={duration === dur.value}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setDuration(dur.value);
                }
              }}
            >
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
              role="radio"
              tabIndex={0}
              aria-checked={workMode === mode.value}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setWorkMode(mode.value);
                }
              }}
            >
              <h4 className="option-label">{mode.label}</h4>
              <p className="option-description">{mode.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
