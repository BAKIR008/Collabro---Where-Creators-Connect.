import React from 'react';
import { StepHeader } from '../components';

export const ReviewStep = ({ data }) => {
  const isFreelancer = data.accountType === 'freelancer';

  return (
    <div className="review-step fade-in">
      <StepHeader
        icon="📝"
        title="Review & Confirm"
        subtitle="Let's make sure everything looks good."
      />

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>About You</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem' }}>
            <span style={{ color: '#888' }}>Name:</span>
            <span>{data.displayName || 'Not provided'}</span>
            
            {!isFreelancer && (
              <>
                <span style={{ color: '#888' }}>Company:</span>
                <span>{data.company || 'Not provided'}</span>
              </>
            )}
            
            <span style={{ color: '#888' }}>Title:</span>
            <span>{data.profileTitle || 'Not provided'}</span>
            
            <span style={{ color: '#888' }}>Bio:</span>
            <span>{data.bio || 'Not provided'}</span>
          </div>
        </div>

        {isFreelancer ? (
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Expertise</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem' }}>
              <span style={{ color: '#888' }}>Roles:</span>
              <span>{(data.roles || []).join(', ')}</span>
              
              <span style={{ color: '#888' }}>Primary:</span>
              <span>{data.primaryRole}</span>
              
              <span style={{ color: '#888' }}>Experience:</span>
              <span>{data.experienceLevel}</span>
              
              <span style={{ color: '#888' }}>Skills:</span>
              <span>{(data.skills || []).join(', ')}</span>
            </div>
          </div>
        ) : (
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Needs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem' }}>
              <span style={{ color: '#888' }}>Looking for:</span>
              <span>{(data.collaborationPreferences?.creatorRoles || []).join(', ')}</span>
              
              <span style={{ color: '#888' }}>Needs:</span>
              <span>{(data.clientNeeds || []).join(', ')}</span>
            </div>
          </div>
        )}

        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Preferences</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem' }}>
            {isFreelancer ? (
              <>
                <span style={{ color: '#888' }}>Goals:</span>
                <span>{(data.goals || []).join(', ')}</span>
                
                <span style={{ color: '#888' }}>Work Mode:</span>
                <span>{data.workMode}</span>
                
                <span style={{ color: '#888' }}>Work Style:</span>
                <span>{data.workStyle}</span>
              </>
            ) : (
              <>
                <span style={{ color: '#888' }}>Projects:</span>
                <span>{(data.collaborationPreferences?.projectTypes || []).join(', ')}</span>
                
                <span style={{ color: '#888' }}>Duration:</span>
                <span>{data.collaborationPreferences?.duration}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
