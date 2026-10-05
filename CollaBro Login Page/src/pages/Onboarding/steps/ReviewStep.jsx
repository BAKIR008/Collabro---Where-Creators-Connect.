/**
 * ReviewStep Component
 * Step 6: Review and confirm all responses
 */

import React from 'react';
import { getRoleById } from '../../../config/creatorRoles.js';
import { StepHeader } from '../components';
import './ReviewStep.css';

export const ReviewStep = ({ data }) => {
  const primaryRoleObj = getRoleById(data.primaryRole);

  return (
    <div className="review-step">
      <StepHeader
        icon="✅"
        title="Review & Confirm"
        subtitle="Take a moment to review your responses"
      />

      <div className="review-container">
        {/* Creator Identity */}
        <div className="review-section">
          <h3 className="review-section-title">👤 Creator Identity</h3>

          <div className="review-item">
            <span className="review-label">Primary Role:</span>
            <span className="review-value primary-role">
              {primaryRoleObj?.icon} {primaryRoleObj?.label || 'Not specified'}
            </span>
          </div>

          {data.roles && data.roles.length > 0 && (
            <div className="review-item">
              <span className="review-label">All Roles:</span>
              <div className="review-tags">
                {data.roles.map((roleId) => {
                  const role = getRoleById(roleId);
                  return (
                    <span key={roleId} className="review-tag">
                      {role?.icon} {role?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {data.customRole && (
            <div className="review-item">
              <span className="review-label">Custom Role:</span>
              <span className="review-value">{data.customRole}</span>
            </div>
          )}
        </div>

        {/* Skills & Experience */}
        <div className="review-section">
          <h3 className="review-section-title">⚡ Skills & Experience</h3>

          <div className="review-item">
            <span className="review-label">Experience Level:</span>
            <span className="review-value capitalize">{data.experienceLevel || 'Not specified'}</span>
          </div>

          {data.skills && data.skills.length > 0 && (
            <div className="review-item">
              <span className="review-label">Core Skills:</span>
              <div className="review-tags">
                {data.skills.map((skill) => (
                  <span key={skill} className="review-tag tag-cyan">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.tools && data.tools.length > 0 && (
            <div className="review-item">
              <span className="review-label">Tools & Software:</span>
              <div className="review-tags">
                {data.tools.map((tool) => (
                  <span key={tool} className="review-tag tag-cyan">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Goals */}
        {data.goals && data.goals.length > 0 && (
          <div className="review-section">
            <h3 className="review-section-title">🎯 Goals</h3>
            <div className="review-item">
              <div className="review-tags">
                {data.goals.map((goal) => (
                  <span key={goal} className="review-tag tag-magenta">
                    {goal.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collaboration Preferences */}
        {data.collaborationPreferences && (
          <div className="review-section">
            <h3 className="review-section-title">🤝 Collaboration Preferences</h3>

            {data.collaborationPreferences.creatorRoles &&
              data.collaborationPreferences.creatorRoles.length > 0 && (
                <div className="review-item">
                  <span className="review-label">Want to collaborate with:</span>
                  <div className="review-tags">
                    {data.collaborationPreferences.creatorRoles.map((roleId) => {
                      const role = getRoleById(roleId);
                      return (
                        <span key={roleId} className="review-tag tag-purple">
                          {role?.icon} {role?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

            {data.collaborationPreferences.projectTypes &&
              data.collaborationPreferences.projectTypes.length > 0 && (
                <div className="review-item">
                  <span className="review-label">Project Types:</span>
                  <div className="review-tags">
                    {data.collaborationPreferences.projectTypes.map((type) => (
                      <span key={type} className="review-tag tag-purple">
                        {type.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {data.collaborationPreferences.duration && (
              <div className="review-item">
                <span className="review-label">Duration:</span>
                <span className="review-value capitalize">
                  {data.collaborationPreferences.duration.replace(/-/g, ' ')}
                </span>
              </div>
            )}

            {data.collaborationPreferences.workMode && (
              <div className="review-item">
                <span className="review-label">Work Mode:</span>
                <span className="review-value capitalize">
                  {data.collaborationPreferences.workMode}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Work Preferences */}
        {data.workPreferences &&
          (data.workPreferences.categories?.length > 0 ||
            data.workPreferences.industries?.length > 0 ||
            data.workPreferences.style?.length > 0) && (
            <div className="review-section">
              <h3 className="review-section-title">⚙️ Work Preferences</h3>

              {data.workPreferences.categories &&
                data.workPreferences.categories.length > 0 && (
                  <div className="review-item">
                    <span className="review-label">Categories:</span>
                    <div className="review-tags">
                      {data.workPreferences.categories.map((cat) => (
                        <span key={cat} className="review-tag tag-yellow">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {data.workPreferences.industries &&
                data.workPreferences.industries.length > 0 && (
                  <div className="review-item">
                    <span className="review-label">Industries:</span>
                    <div className="review-tags">
                      {data.workPreferences.industries.map((ind) => (
                        <span key={ind} className="review-tag tag-yellow">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {data.workPreferences.style &&
                data.workPreferences.style.length > 0 && (
                  <div className="review-item">
                    <span className="review-label">Creative Style:</span>
                    <div className="review-tags">
                      {data.workPreferences.style.map((style) => (
                        <span key={style} className="review-tag tag-yellow">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
      </div>

      <div className="review-footer">
        <p className="review-footer-text">
          Everything look good? Click "Complete Onboarding" to get started!
        </p>
      </div>
    </div>
  );
};
