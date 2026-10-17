import React from 'react';
import { StepHeader } from '../components';
import { CREATOR_ROLES } from '../../../config/creatorRoles';

export const ClientNeedsStep = ({ data, onChange }) => {
  const selectedNeeds = data.clientNeeds || [];
  const selectedRoles = data.collaborationPreferences?.creatorRoles || [];

  const toggleNeed = (needId) => {
    let newNeeds = [...selectedNeeds];
    if (newNeeds.includes(needId)) {
      newNeeds = newNeeds.filter(n => n !== needId);
    } else {
      newNeeds.push(needId);
    }
    onChange({ clientNeeds: newNeeds });
  };

  const toggleRole = (roleId) => {
    let newRoles = [...selectedRoles];
    if (newRoles.includes(roleId)) {
      newRoles = newRoles.filter(r => r !== roleId);
    } else {
      newRoles.push(roleId);
    }
    onChange({
      collaborationPreferences: {
        ...data.collaborationPreferences,
        creatorRoles: newRoles
      }
    });
  };

  const needsOptions = [
    { id: 'find-freelancers', label: 'Hire Freelancers', icon: '👤' },
    { id: 'build-team', label: 'Build a Team', icon: '👥' },
    { id: 'hire-for-project', label: 'Hire for a specific project', icon: '🎯' },
    { id: 'explore-creators', label: 'Just exploring creators', icon: '🔍' }
  ];

  return (
    <div className="client-needs-step fade-in">
      <StepHeader
        icon="🎯"
        title="Your Needs"
        subtitle="What are you looking for on CollaBro?"
      />

      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label>I want to... <span className="required">*</span></label>
        <div className="option-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {needsOptions.map(need => (
            <div
              key={need.id}
              className={`option-card ${selectedNeeds.includes(need.id) ? 'selected' : ''}`}
              onClick={() => toggleNeed(need.id)}
              style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <span style={{ fontSize: '1.5rem' }}>{need.icon}</span>
              <span style={{ fontWeight: '500' }}>{need.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Who are you looking to hire? <span className="required">*</span></label>
        <div className="option-cards">
          {CREATOR_ROLES.map(role => (
            <div
              key={role.id}
              className={`option-card ${selectedRoles.includes(role.id) ? 'selected' : ''}`}
              onClick={() => toggleRole(role.id)}
              style={{ padding: '1rem' }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{role.icon}</div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>{role.label}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
