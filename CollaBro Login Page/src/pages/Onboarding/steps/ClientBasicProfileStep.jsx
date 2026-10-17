import React, { useState, useEffect } from 'react';
import { StepHeader } from '../components';
import './ClientBasicProfileStep.css';

export const ClientBasicProfileStep = ({ data, onChange }) => {
  const [displayName, setDisplayName] = useState(data.displayName || '');
  const [profileTitle, setProfileTitle] = useState(data.profileTitle || '');
  const [company, setCompany] = useState(data.company || '');
  const [bio, setBio] = useState(data.bio || '');

  useEffect(() => {
    onChange({ displayName, profileTitle, company, bio });
  }, [displayName, profileTitle, company, bio, onChange]);

  return (
    <div className="client-basic-profile-step">
      <StepHeader
        icon="👤"
        title="Basic Profile"
        subtitle="Tell us a bit about yourself or your company"
      />

      <div className="basic-info-section">
        <div className="input-group">
          <label htmlFor="displayName" className="input-label">Display Name / Company Name *</label>
          <input
            id="displayName"
            type="text"
            className="text-input"
            placeholder="e.g., Acme Corp or John Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="company" className="input-label">Company (Optional)</label>
          <input
            id="company"
            type="text"
            className="text-input"
            placeholder="e.g., Acme Corporation"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="input-group">
          <label htmlFor="profileTitle" className="input-label">Your Role / Title (Optional)</label>
          <input
            id="profileTitle"
            type="text"
            className="text-input"
            placeholder="e.g., Creative Director, Producer"
            value={profileTitle}
            onChange={(e) => setProfileTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="input-group">
          <label htmlFor="bio" className="input-label">About You / Your Company</label>
          <textarea
            id="bio"
            className="text-input textarea-input"
            placeholder="Tell creators about your background and the kind of projects you work on..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={4}
          />
          <p className="input-help">{bio.length}/500 characters</p>
        </div>
      </div>
    </div>
  );
};
