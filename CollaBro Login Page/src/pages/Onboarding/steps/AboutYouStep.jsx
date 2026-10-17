import React, { useRef } from 'react';
import { StepHeader } from '../components';

export const AboutYouStep = ({ data, onChange }) => {
  const isFreelancer = data.accountType === 'freelancer';
  const imageInputRef = useRef(null);

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onChange({
        profilePicture: {
          file,
          previewUrl,
          name: file.name,
          size: file.size,
          type: file.type
        }
      });
    }
  };

  const removeImage = () => {
    onChange({ profilePicture: null });
  };

  return (
    <div className="about-you-step fade-in">
      <StepHeader
        icon="👤"
        title="About You"
        subtitle="Let's set up your basic profile"
      />

      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label>Profile Picture</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          {data.profilePicture?.previewUrl ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={data.profilePicture.previewUrl} 
                alt="Profile Preview" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <button 
                type="button" 
                onClick={removeImage}
                style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              👤
            </div>
          )}
          
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
            ref={imageInputRef}
          />
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => imageInputRef.current.click()}
          >
            Upload Photo
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Display Name <span className="required">*</span></label>
        <input
          type="text"
          className="form-input"
          value={data.displayName || ''}
          onChange={(e) => handleChange('displayName', e.target.value)}
          placeholder="Your full name or brand name"
        />
      </div>

      {!isFreelancer && (
        <div className="form-group">
          <label>Company / Organization</label>
          <input
            type="text"
            className="form-input"
            value={data.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="Where do you work?"
          />
        </div>
      )}

      <div className="form-group">
        <label>{isFreelancer ? 'Profile Title' : 'Your Role / Title'}</label>
        <input
          type="text"
          className="form-input"
          value={data.profileTitle || ''}
          onChange={(e) => handleChange('profileTitle', e.target.value)}
          placeholder={isFreelancer ? "e.g., Senior Video Editor" : "e.g., Marketing Director"}
        />
      </div>

      <div className="form-group">
        <label>{isFreelancer ? 'Short Bio' : 'About You'}</label>
        <textarea
          className="form-input"
          value={data.bio || ''}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Tell us a little bit about yourself..."
          rows={4}
          maxLength={500}
        />
        <div className="char-count" style={{ fontSize: '0.8rem', color: '#888', textAlign: 'right' }}>
          {(data.bio || '').length}/500
        </div>
      </div>

      {isFreelancer && (
        <div className="form-group">
          <label>Education (optional)</label>
          <input
            type="text"
            className="form-input"
            value={data.education || ''}
            onChange={(e) => handleChange('education', e.target.value)}
            placeholder="Where did you study?"
          />
        </div>
      )}
    </div>
  );
};
