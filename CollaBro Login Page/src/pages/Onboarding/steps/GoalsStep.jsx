/**
 * GoalsStep Component
 * Step 3: User goals and objectives
 */

import React, { useState, useEffect } from 'react';
import { StepHeader } from '../components';
import './GoalsStep.css';

const GOAL_OPTIONS = [
  {
    value: 'find-collaborators',
    label: 'Find Collaborators',
    description: 'Connect with other creators for projects',
    icon: '🤝',
  },
  {
    value: 'build-portfolio',
    label: 'Build Portfolio',
    description: 'Showcase my work and grow my presence',
    icon: '📁',
  },
  {
    value: 'learn-skills',
    label: 'Learn New Skills',
    description: 'Expand my creative abilities',
    icon: '📚',
  },
  {
    value: 'earn-income',
    label: 'Earn Income',
    description: 'Monetize my creative work',
    icon: '💰',
  },
  {
    value: 'network',
    label: 'Network',
    description: 'Connect with like-minded creators',
    icon: '🌐',
  },
  {
    value: 'get-discovered',
    label: 'Get Discovered',
    description: 'Increase visibility and opportunities',
    icon: '⭐',
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
        icon="🎯"
        title="Your Goals"
        subtitle="What are you looking to achieve on CollaBro?"
      />

      <div className="goals-info">
        <p className="info-text">Select all that apply</p>
        <p className="selection-count">
          {selectedGoals.length} selected
          {selectedGoals.length >= 1 && (
            <span className="valid-indicator"> ✓</span>
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
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleGoalToggle(goal.value);
              }
            }}
          >
            <div className="goal-icon">{goal.icon}</div>
            <h3 className="goal-label">{goal.label}</h3>
            <p className="goal-description">{goal.description}</p>
            <div className="goal-checkbox">
              {selectedGoals.includes(goal.value) ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
