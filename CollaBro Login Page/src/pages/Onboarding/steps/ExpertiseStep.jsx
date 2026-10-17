import React, { useRef } from 'react';
import { StepHeader } from '../components';
import { CREATOR_ROLES, ROLE_SKILLS } from '../../../config/creatorRoles';

export const ExpertiseStep = ({ data, onChange }) => {
  const resumeInputRef = useRef(null);

  const selectedRoles = data.roles || [];
  const primaryRole = data.primaryRole || null;
  const selectedSkills = data.skills || [];
  const experienceLevel = data.experienceLevel || null;

  const toggleRole = (roleId) => {
    let newRoles = [...selectedRoles];
    let newPrimary = primaryRole;

    if (newRoles.includes(roleId)) {
      newRoles = newRoles.filter(r => r !== roleId);
      if (newPrimary === roleId) {
        newPrimary = newRoles.length > 0 ? newRoles[0] : null;
      }
    } else {
      if (newRoles.length >= 5) return; // Max 5 roles
      newRoles.push(roleId);
      if (!newPrimary) {
        newPrimary = roleId;
      }
    }

    onChange({
      roles: newRoles,
      primaryRole: newPrimary
    });
  };

  const setPrimary = (e, roleId) => {
    e.stopPropagation();
    if (selectedRoles.includes(roleId)) {
      onChange({ primaryRole: roleId });
    }
  };

  const toggleSkill = (skill) => {
    let newSkills = [...selectedSkills];
    if (newSkills.includes(skill)) {
      newSkills = newSkills.filter(s => s !== skill);
    } else {
      if (newSkills.length >= 15) return;
      newSkills.push(skill);
    }
    onChange({ skills: newSkills });
  };

  const availableSkills = Array.from(new Set(
    selectedRoles.flatMap(roleId => ROLE_SKILLS[roleId] || [])
  ));

  const handleResumeSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange({
        resume: {
          originalName: file.name,
          size: file.size,
          mimeType: file.type
        }
      });
    }
  };

  return (
    <div className="expertise-step fade-in">
      <StepHeader
        icon="⭐"
        title="Your Expertise"
        subtitle="Tell us about your creative skills"
      />

      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label>Select Your Roles (1-5) <span className="required">*</span></label>
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Click a role to select it. Click the star to set as Primary Role.</p>
        
        <div className="option-cards">
          {CREATOR_ROLES.map(role => {
            const isSelected = selectedRoles.includes(role.id);
            const isPrimary = primaryRole === role.id;
            return (
              <div 
                key={role.id}
                className={`option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleRole(role.id)}
                style={{ position: 'relative', padding: '1rem', border: isPrimary ? '2px solid #a855f7' : '' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{role.icon}</div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{role.label}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>{role.description}</p>
                
                {isSelected && (
                  <button
                    type="button"
                    onClick={(e) => setPrimary(e, role.id)}
                    style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '1.2rem',
                      opacity: isPrimary ? 1 : 0.3
                    }}
                    title={isPrimary ? "Primary Role" : "Set as Primary"}
                  >
                    ⭐
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedRoles.length > 0 && (
        <div className="form-group">
          <label>Skills <span className="required">*</span></label>
          <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Select up to 15 skills</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {availableSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid #333',
                  background: selectedSkills.includes(skill) ? '#a855f7' : 'transparent',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Experience Level <span className="required">*</span></label>
        <div className="option-cards">
          {[
            { id: 'beginner', label: 'Beginner', desc: '0-1 years' },
            { id: 'intermediate', label: 'Intermediate', desc: '1-3 years' },
            { id: 'advanced', label: 'Advanced', desc: '3-5 years' },
            { id: 'professional', label: 'Professional', desc: '5+ years' }
          ].map(level => (
            <div
              key={level.id}
              className={`option-card ${experienceLevel === level.id ? 'selected' : ''}`}
              onClick={() => onChange({ experienceLevel: level.id })}
              style={{ padding: '1rem' }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{level.label}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>{level.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Links</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          <input
            type="text"
            className="form-input"
            value={data.github || ''}
            onChange={e => onChange({ github: e.target.value })}
            placeholder="https://github.com/username"
          />
          <input
            type="text"
            className="form-input"
            value={data.linkedin || ''}
            onChange={e => onChange({ linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Resume</label>
        <div style={{ marginTop: '0.5rem' }}>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword"
            onChange={handleResumeSelect}
            style={{ display: 'none' }}
            ref={resumeInputRef}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => resumeInputRef.current.click()}
            >
              Upload Resume
            </button>
            {data.resume && (
              <div style={{ fontSize: '0.9rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📄 {data.resume.originalName}
                <button
                  type="button"
                  onClick={() => onChange({ resume: null })}
                  style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
