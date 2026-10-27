/**
 * CreatorIdentityStep Component
 * Step 1: Creator role selection
 */

import React, { useState, useEffect } from 'react';
import { CREATOR_ROLES } from '../../../config/creatorRoles.js';
import { StepHeader, RoleCard } from '../components';
import './CreatorIdentityStep.css';

export const CreatorIdentityStep = ({ data, onChange }) => {
  const [displayName, setDisplayName] = useState(data.displayName || '');
  const [profileTitle, setProfileTitle] = useState(data.profileTitle || '');
  const [bio, setBio] = useState(data.bio || '');
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
      displayName,
      profileTitle,
      bio,
      roles: selectedRoles,
      primaryRole: primaryRole,
      customRole: hasOtherRole ? customRole : '',
    });
  }, [displayName, profileTitle, bio, selectedRoles, primaryRole, customRole, hasOtherRole, onChange]);

  return (
    <div className="creator-identity-step">
      <StepHeader
        icon="👤"
        title="Who Are You?"
        subtitle="Tell us about yourself and your creative identity"
      />

      {/* Basic Info */}
      <div className="basic-info-section">
        <div className="input-group">
          <label htmlFor="displayName" className="input-label">Display Name *</label>
          <input
            id="displayName"
            type="text"
            className="text-input"
            placeholder="e.g., Jane Doe or Creative Studio"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="profileTitle" className="input-label">Profile Title</label>
          <input
            id="profileTitle"
            type="text"
            className="text-input"
            placeholder="e.g., Award-winning Filmmaker & Photographer"
            value={profileTitle}
            onChange={(e) => setProfileTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="input-group">
          <label htmlFor="bio" className="input-label">Bio</label>
          <textarea
            id="bio"
            className="text-input textarea-input"
            placeholder="Tell us about your background, what you create, and what you're passionate about..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={4}
          />
          <p className="input-help">{bio.length}/500 characters</p>
        </div>
      </div>

      <div className="section-divider" style={{margin: '2rem 0', borderBottom: '1px solid var(--border-light)'}}></div>

      {/* Selection info */}
      <div className="selection-info">
        <p className="info-text">
          Select <strong>1-5 roles</strong>. Choose one as your <strong>primary role</strong>.
        </p>
        <p className="selection-count">
          {selectedRoles.length} / {MAX_ROLES} selected
          {selectedRoles.length >= MIN_ROLES && primaryRole && (
            <span className="valid-indicator"> ✓</span>
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
