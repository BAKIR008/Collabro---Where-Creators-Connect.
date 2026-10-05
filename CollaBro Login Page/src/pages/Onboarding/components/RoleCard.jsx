/**
 * RoleCard Component
 * Interactive card for selecting creator roles
 */

import React from 'react';
import './RoleCard.css';

export const RoleCard = ({
  role,
  isSelected,
  isPrimary,
  onSelect,
  onSetPrimary,
  disabled = false,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onSelect(role.id);
  };

  const handleSetPrimary = (e) => {
    e.stopPropagation();
    if (isSelected && !isPrimary) {
      onSetPrimary(role.id);
    }
  };

  return (
    <div
      className={`role-card ${isSelected ? 'selected' : ''} ${
        isPrimary ? 'primary' : ''
      } ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Primary badge */}
      {isPrimary && (
        <div className="primary-badge">
          <span>PRIMARY</span>
        </div>
      )}

      {/* Icon */}
      <div className="role-icon">{role.icon}</div>

      {/* Label */}
      <h3 className="role-label">{role.label}</h3>

      {/* Description */}
      <p className="role-description">{role.description}</p>

      {/* Set as primary button (only show if selected but not primary) */}
      {isSelected && !isPrimary && (
        <button
          type="button"
          className="set-primary-btn"
          onClick={handleSetPrimary}
        >
          Set as Primary
        </button>
      )}

      {/* Selection indicator */}
      <div className="selection-indicator">
        {isSelected ? '✓' : ''}
      </div>
    </div>
  );
};
