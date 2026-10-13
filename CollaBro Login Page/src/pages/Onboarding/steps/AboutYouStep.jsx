import React from 'react';
import { StepHeader, FileUpload } from '../components';

export const AboutYouStep = ({ data, onChange }) => {
  const isFreelancer = data.accountType === 'freelancer';

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleImageUpload = (file) => {
    onChange({
      profileImage: file,
      profileImagePreview: URL.createObjectURL(file)
    });
  };

  const handleImageRemove = () => {
    onChange({
      profileImage: null,
      profileImagePreview: null
    });
  };

  return (
    <div className="about-you-step fade-in">
      <StepHeader
        eyebrow="Step 2"
        title="Tell Us About Yourself"
        subtitle="Help others get to know you better with a profile photo and some basic information."
      />

      <div className="ob-card">
        {/* Profile Photo Upload */}
        <div className="ob-section">
          <div className="ob-section-title">
            Profile Photo
            <span className="ob-section-optional">(Optional)</span>
          </div>
          <FileUpload
            type="image"
            accept={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
            maxSizeMB={5}
            value={data.profileImagePreview}
            onChange={handleImageUpload}
            onRemove={handleImageRemove}
            title="Upload Your Photo"
            subtitle="Show your face! Photos help build trust. JPG, PNG, or WebP • Max 5MB"
          />
        </div>

        {/* Display Name */}
        <div className="ob-section">
          <div className="ob-field">
            <label htmlFor="displayName" className="ob-label">
              Display Name
              <span className="ob-section-required">*</span>
            </label>
            <input
              id="displayName"
              type="text"
              className="ob-input"
              value={data.displayName || ''}
              onChange={(e) => handleChange('displayName', e.target.value)}
              placeholder={isFreelancer ? "Your name or creative alias" : "Your full name"}
              maxLength={100}
              aria-required="true"
              aria-invalid={!data.displayName}
            />
            <div className="ob-field-hint">
              {isFreelancer
                ? "This is how you'll appear to potential collaborators"
                : "The name clients will see on your profile"}
            </div>
            {data.displayName && (
              <div className="ob-char-count">{data.displayName.length}/100</div>
            )}
          </div>
        </div>

        {/* Company (Client only) */}
        {!isFreelancer && (
          <div className="ob-section">
            <div className="ob-field">
              <label htmlFor="company" className="ob-label">
                Company / Organization
                <span className="ob-label-optional">(Optional)</span>
              </label>
              <input
                id="company"
                type="text"
                className="ob-input"
                value={data.company || ''}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company name or organization"
                maxLength={100}
              />
            </div>
          </div>
        )}

        {/* Profile Title */}
        <div className="ob-section">
          <div className="ob-field">
            <label htmlFor="profileTitle" className="ob-label">
              {isFreelancer ? 'Professional Title' : 'Your Role'}
              <span className="ob-label-optional">(Optional)</span>
            </label>
            <input
              id="profileTitle"
              type="text"
              className="ob-input"
              value={data.profileTitle || ''}
              onChange={(e) => handleChange('profileTitle', e.target.value)}
              placeholder={isFreelancer ? "e.g., Senior Video Editor & Motion Designer" : "e.g., Creative Director, Marketing Manager"}
              maxLength={100}
            />
            <div className="ob-field-hint">
              {isFreelancer
                ? "Your specialty or what you're best known for"
                : "Your position or title"}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="ob-section">
          <div className="ob-field">
            <label htmlFor="bio" className="ob-label">
              {isFreelancer ? 'Bio' : 'About You'}
              <span className="ob-label-optional">(Optional)</span>
            </label>
            <textarea
              id="bio"
              className="ob-input ob-textarea"
              value={data.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder={isFreelancer 
                ? "Share your creative journey, what drives you, and what makes your work unique..." 
                : "Tell us about your goals, what you're looking for, and your creative vision..."}
              rows={5}
              maxLength={500}
            />
            <div className="ob-char-count">{(data.bio || '').length}/500</div>
            <div className="ob-field-hint">
              {isFreelancer
                ? "This appears on your public profile. Make it engaging!"
                : "Help creators understand what you're looking for"}
            </div>
          </div>
        </div>

        {/* Education (Freelancer only) */}
        {isFreelancer && (
          <div className="ob-section">
            <div className="ob-field">
              <label htmlFor="education" className="ob-label">
                Education
                <span className="ob-label-optional">(Optional)</span>
              </label>
              <input
                id="education"
                type="text"
                className="ob-input"
                value={data.education || ''}
                onChange={(e) => handleChange('education', e.target.value)}
                placeholder="e.g., BA in Film Production, Self-taught"
                maxLength={150}
              />
              <div className="ob-field-hint">
                Your degree, certifications, or learning background
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
