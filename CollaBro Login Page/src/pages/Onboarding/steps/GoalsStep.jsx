/**
 * GoalsStep Component
 * Step 3: User goals and objectives
 */

import React, { useState, useEffect } from 'react';
import { StepHeader } from '../components';
import './GoalsStep.css';

/* SVG check mark used in the valid-indicator and checkbox */
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const GOAL_OPTIONS = [
  {
    value: 'find-collaborators',
    label: 'Find Collaborators',
    description: 'Connect with other creators for projects',
    abbr: 'FC',
  },
  {
    value: 'build-portfolio',
    label: 'Build Portfolio',
    description: 'Showcase my work and grow my presence',
    abbr: 'BP',
  },
  {
    value: 'learn-skills',
    label: 'Learn New Skills',
    description: 'Expand my creative abilities',
    abbr: 'LS',
  },
  {
    value: 'earn-income',
    label: 'Earn Income',
    description: 'Monetize my creative work',
    abbr: 'EI',
  },
  {
    value: 'network',
    label: 'Network',
    description: 'Connect with like-minded creators',
    abbr: 'NW',
  },
  {
    value: 'get-discovered',
    label: 'Get Discovered',
    description: 'Increase visibility and opportunities',
    abbr: 'GD',
  },
];

export const GoalsStep = ({ data, onChange }) => {
  const [selectedGoals, setSelectedGoals] = useState(data.goals || []);

  /**
   * Handle goal selection toggle
   */
  const handleGoalToggle = (goalValue) => {
    let newGoals;

    if (selectedGoals.includes(goalValue)) {
      // Deselect
      newGoals = selectedGoals.filter((g) => g !== goalValue);
    } else {
      // Select
      newGoals = [...selectedGoals, goalValue];
    }

    setSelectedGoals(newGoals);
  };

  /**
   * Sync changes to parent
   */
  useEffect(() => {
    onChange({
      goals: selectedGoals,
    });
  }, [selectedGoals, onChange]);

  return (
    <div className="goals-step">
      <StepHeader
        title="Your Goals"
        subtitle="What are you looking to achieve on CollaBro?"
      />

      <div className="goals-info">
        <p className="info-text">Select all that apply</p>
        <p className="selection-count">
          {selectedGoals.length} selected
          {selectedGoals.length >= 1 && (
            <span className="valid-indicator" aria-hidden="true">
              <CheckIcon />
            </span>
          )}
        </p>
      </div>

      <div className="goals-grid">
        {GOAL_OPTIONS.map((goal) => (
          <div
            key={goal.value}
            className={`goal-card ${
              selectedGoals.includes(goal.value) ? 'selected' : ''
            }`}
            onClick={() => handleGoalToggle(goal.value)}
            role="checkbox"
            tabIndex={0}
            aria-checked={selectedGoals.includes(goal.value)}
            aria-label={goal.label}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleGoalToggle(goal.value);
              }
            }}
          >
            <div className="goal-abbr" aria-hidden="true">{goal.abbr}</div>
            <h3 className="goal-label">{goal.label}</h3>
            <p className="goal-description">{goal.description}</p>
            <div className="goal-checkbox" aria-hidden="true">
              {selectedGoals.includes(goal.value) && <CheckIcon />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
