/**
 * GoalsPreferencesStep Component
 * Step 4: Goals and work preferences (for both freelancers and clients)
 *
 * For freelancers: goals + work mode + work style
 * For clients: project types + expected duration
 */

import React from 'react';
import { StepHeader } from '../components';

/* SVG check used in goal-card checkbox */
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const GOAL_OPTIONS = [
  { value: 'find-collaborators', label: 'Find Collaborators', abbr: 'FC', description: 'Connect with other creators' },
  { value: 'build-portfolio',    label: 'Build Portfolio',    abbr: 'BP', description: 'Showcase my work' },
  { value: 'learn-skills',      label: 'Learn New Skills',   abbr: 'LS', description: 'Expand my abilities' },
  { value: 'earn-income',       label: 'Earn Income',        abbr: 'EI', description: 'Monetize my work' },
  { value: 'network',           label: 'Network',            abbr: 'NW', description: 'Connect with creators' },
  { value: 'get-discovered',    label: 'Get Discovered',     abbr: 'GD', description: 'Increase visibility' },
];

const PROJECT_TYPES = [
  { value: 'short-form-video',       label: 'Short-Form Video'     },
  { value: 'long-form-video',        label: 'Long-Form Video'      },
  { value: 'social-media-content',   label: 'Social Media Content' },
  { value: 'brand-collaborations',   label: 'Brand Collaborations' },
  { value: 'personal-projects',      label: 'Personal Projects'    },
  { value: 'commercial-work',        label: 'Commercial Work'      },
  { value: 'educational-content',    label: 'Educational Content'  },
  { value: 'creative-experiments',   label: 'Creative Experiments' },
];

const WORK_MODES = [
  { value: 'remote',    label: 'Remote',    description: 'Work from anywhere'     },
  { value: 'in-person', label: 'In-Person', description: 'Local collaborations'   },
  { value: 'hybrid',    label: 'Hybrid',    description: 'Flexible approach'      },
];

const WORK_STYLES = [
  { value: 'flexible',   label: 'Flexible',    description: 'Adapt to project needs' },
  { value: 'structured', label: 'Structured',  description: 'Clear milestones'       },
  { value: 'fast-paced', label: 'Fast-Paced',  description: 'Quick turnarounds'      },
  { value: 'long-term',  label: 'Long-Term',   description: 'Deep relationships'     },
];

const DURATIONS = [
  { value: 'one-time',   label: 'One-Time',   description: 'Single projects' },
  { value: 'short-term', label: 'Short-Term', description: '1-3 months'      },
  { value: 'long-term',  label: 'Long-Term',  description: '3+ months'       },
  { value: 'ongoing',    label: 'Ongoing',    description: 'Continuous'       },
];

export const GoalsPreferencesStep = ({ data, onChange }) => {
  const isFreelancer = data.accountType !== 'client';
  const goals = data.goals || [];
  
  // For freelancers, these are stored in collaborationPreferences
  const workMode = isFreelancer 
    ? (data.collaborationPreferences?.workMode || null)
    : (data.workMode || null);
  const workStyle = data.workStyle || null;
  const projectTypes = data.collaborationPreferences?.projectTypes || [];
  const duration = data.collaborationPreferences?.duration || null;

  const toggleGoal = (value) => {
    const updated = goals.includes(value)
      ? goals.filter((g) => g !== value)
      : [...goals, value];
    onChange({ goals: updated });
  };

  const toggleProjectType = (value) => {
    const updated = projectTypes.includes(value)
      ? projectTypes.filter((t) => t !== value)
      : [...projectTypes, value];
    onChange({
      collaborationPreferences: {
        ...(data.collaborationPreferences || {}),
        projectTypes: updated,
      },
    });
  };

  const setDuration = (value) => {
    onChange({
      collaborationPreferences: {
        ...(data.collaborationPreferences || {}),
        duration: value,
      },
    });
  };

  return (
    <div className="goals-step fade-in">
      <StepHeader
        title={isFreelancer ? 'Your Goals & Preferences' : 'Project Preferences'}
        subtitle={isFreelancer
          ? 'What are you looking to achieve on CollaBro?'
          : 'Tell us about the types of projects you have in mind.'}
      />

      {isFreelancer ? (
        <>
          {/* Goals */}
          <div className="ob-card" style={{ marginBottom: '24px' }}>
            <div className="ob-section">
              <div className="ob-section-title">
                Your Goals
                <span className="ob-section-required">*</span>
              </div>
              <div className="ob-section-desc">Select all that apply</div>
              <div className="goals-grid">
                {GOAL_OPTIONS.map((goal) => (
                  <div
                    key={goal.value}
                    className={`goal-card ${goals.includes(goal.value) ? 'selected' : ''}`}
                    onClick={() => toggleGoal(goal.value)}
                    role="checkbox"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGoal(goal.value); }
                    }}
                    aria-checked={goals.includes(goal.value)}
                    aria-label={goal.label}
                  >
                    <div className="goal-abbr" aria-hidden="true">{goal.abbr}</div>
                    <h3 className="goal-label">{goal.label}</h3>
                    <p className="goal-description">{goal.description}</p>
                    <div className="goal-checkbox" aria-hidden="true">
                      {goals.includes(goal.value) && <CheckIcon />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Types - FREELANCERS NEED THIS TOO */}
          <div className="ob-card" style={{ marginBottom: '24px' }}>
            <div className="ob-section">
              <div className="ob-section-title">
                Project Types You're Interested In
                <span className="ob-section-required">*</span>
              </div>
              <div className="ob-section-desc">What types of projects do you want to work on?</div>
              <div className="ob-skills-pool">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`ob-chip ${projectTypes.includes(type.value) ? 'selected' : ''}`}
                    onClick={() => toggleProjectType(type.value)}
                    aria-pressed={projectTypes.includes(type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Duration - FREELANCERS NEED THIS TOO */}
          <div className="ob-card" style={{ marginBottom: '24px' }}>
            <div className="ob-section">
              <div className="ob-section-title">
                Preferred Project Duration
                <span className="ob-section-required">*</span>
              </div>
              <div className="ob-level-grid">
                {DURATIONS.map((d) => (
                  <div
                    key={d.value}
                    className={`ob-level-card ${duration === d.value ? 'selected' : ''}`}
                    onClick={() => setDuration(d.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDuration(d.value); }
                    }}
                    role="radio"
                    tabIndex={0}
                    aria-checked={duration === d.value}
                    aria-label={`${d.label}: ${d.description}`}
                  >
                    <div className="ob-level-name">{d.label}</div>
                    <div className="ob-level-years">{d.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work Mode */}
          <div className="ob-card" style={{ marginBottom: '24px' }}>
            <div className="ob-section">
              <div className="ob-section-title">
                Work Mode
                <span className="ob-section-required">*</span>
              </div>
              <div className="ob-level-grid">
                {WORK_MODES.map((mode) => (
                  <div
                    key={mode.value}
                    className={`ob-level-card ${workMode === mode.value ? 'selected' : ''}`}
                    onClick={() => onChange({
                      collaborationPreferences: {
                        ...(data.collaborationPreferences || {}),
                        workMode: mode.value,
                      },
                    })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onChange({
                          collaborationPreferences: {
                            ...(data.collaborationPreferences || {}),
                            workMode: mode.value,
                          },
                        });
                      }
                    }}
                    role="radio"
                    tabIndex={0}
                    aria-checked={workMode === mode.value}
                    aria-label={`${mode.label}: ${mode.description}`}
                  >
                    <div className="ob-level-name">{mode.label}</div>
                    <div className="ob-level-years">{mode.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work Style */}
          <div className="ob-card">
            <div className="ob-section">
              <div className="ob-section-title">
                Work Style
                <span className="ob-section-required">*</span>
              </div>
              <div className="ob-level-grid">
                {WORK_STYLES.map((style) => (
                  <div
                    key={style.value}
                    className={`ob-level-card ${workStyle === style.value ? 'selected' : ''}`}
                    onClick={() => onChange({ workStyle: style.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange({ workStyle: style.value }); }
                    }}
                    role="radio"
                    tabIndex={0}
                    aria-checked={workStyle === style.value}
                    aria-label={`${style.label}: ${style.description}`}
                  >
                    <div className="ob-level-name">{style.label}</div>
                    <div className="ob-level-years">{style.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Project Types */}
          <div className="ob-card" style={{ marginBottom: '24px' }}>
            <div className="ob-section">
              <div className="ob-section-title">
                Project Types
                <span className="ob-section-required">*</span>
              </div>
              <div className="ob-section-desc">What kinds of projects do you have in mind?</div>
              <div className="ob-skills-pool">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`ob-chip ${projectTypes.includes(type.value) ? 'selected' : ''}`}
                    onClick={() => toggleProjectType(type.value)}
                    aria-pressed={projectTypes.includes(type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="ob-card">
            <div className="ob-section">
              <div className="ob-section-title">
                Expected Duration
                <span className="ob-section-required">*</span>
              </div>
              <div className="ob-level-grid">
                {DURATIONS.map((d) => (
                  <div
                    key={d.value}
                    className={`ob-level-card ${duration === d.value ? 'selected' : ''}`}
                    onClick={() => setDuration(d.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDuration(d.value); }
                    }}
                    role="radio"
                    tabIndex={0}
                    aria-checked={duration === d.value}
                    aria-label={`${d.label}: ${d.description}`}
                  >
                    <div className="ob-level-name">{d.label}</div>
                    <div className="ob-level-years">{d.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
