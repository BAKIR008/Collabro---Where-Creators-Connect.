/**
 * CreatorIdentityStep Component
 * Step 1: Creator role selection
 */

import React, { useState, useEffect } from 'react';
import { CREATOR_ROLES } from '../../../config/creatorRoles.js';
import { StepHeader, RoleCard } from '../components';
import './CreatorIdentityStep.css';

export const CreatorIdentityStep = ({ data, onChange }) => {
  const [selectedRoles, setSelectedRoles] = useState(data.roles || []);
  const [primaryRole, setPrimaryRole] = useState(data.primaryRole || null);
  const [customRole, setCustomRole] = useState(data.customRole || '');

  const MIN_ROLES = 1;
  const MAX_ROLES = 5;

  const canSelectMore = selectedRoles.length < MAX_ROLES;
  const hasOtherRole = selectedRoles.includes('other');

  /**
   * Handle role selection toggle
   */
  const handleRoleSelect = (roleId) => {
    let newSelectedRoles;

    if (selectedRoles.includes(roleId)) {
      // Deselecting - remove from array
      newSelectedRoles = selectedRoles.filter((id) => id !== roleId);

      // If deselecting the primary role, clear it
      if (primaryRole === roleId) {
        const newPrimary = newSelectedRoles.length > 0 ? newSelectedRoles[0] : null;
        setPrimaryRole(newPrimary);
      }
    } else {
      // Selecting - add to array if under limit
      if (canSelectMore) {
        newSelectedRoles = [...selectedRoles, roleId];

        // Auto-set as primary if it's the first selection
        if (newSelectedRoles.length === 1) {
          setPrimaryRole(roleId);
        }
      } else {
        return; // Don't allow selection beyond MAX_ROLES
      }
    }

    setSelectedRoles(newSelectedRoles);
  };

  /**
   * Handle setting primary role
   */
  const handleSetPrimary = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setPrimaryRole(roleId);
    }
  };

  /**
   * Sync changes to parent
   */
  useEffect(() => {
    onChange({
      roles: selectedRoles,
      primaryRole: primaryRole,
      customRole: hasOtherRole ? customRole : '',
    });
  }, [selectedRoles, primaryRole, customRole, hasOtherRole, onChange]);

  return (
    <div className="creator-identity-step">
      <StepHeader
        title="Who Are You?"
        subtitle="Select the roles that define your creative identity"
      />

      {/* Selection info */}
      <div className="selection-info">
        <p className="info-text">
          Select <strong>1-5 roles</strong>. Choose one as your <strong>primary role</strong>.
        </p>
        <p className="selection-count">
          {selectedRoles.length} / {MAX_ROLES} selected
          {selectedRoles.length >= MIN_ROLES && primaryRole && (
            <span className="valid-indicator" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </p>
      </div>

      {/* Role grid */}
      <div className="role-grid">
        {CREATOR_ROLES.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            isSelected={selectedRoles.includes(role.id)}
            isPrimary={primaryRole === role.id}
            onSelect={handleRoleSelect}
            onSetPrimary={handleSetPrimary}
            disabled={!selectedRoles.includes(role.id) && !canSelectMore}
          />
        ))}
      </div>

      {/* Custom role input (show if "Other" is selected) */}
      {hasOtherRole && (
        <div className="custom-role-input">
          <label htmlFor="customRole" className="input-label">
            Specify Your Role
          </label>
          <input
            id="customRole"
            type="text"
            className="text-input"
            placeholder="e.g., Podcast Producer, 3D Artist"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            maxLength={50}
          />
          <p className="input-help">Tell us what makes you unique</p>
        </div>
      )}
    </div>
  );
};
