/**
 * ClientNeedsStep Component
 * Step 3 (Client): What the client is looking for in creators
 */

import React from 'react';
import { StepHeader } from '../components';
import { CREATOR_ROLES } from '../../../config/creatorRoles';

const CLIENT_NEEDS_OPTIONS = [
  { value: 'video-production', label: 'Video Production',      abbr: 'VP', description: 'Need video editing or filming'  },
  { value: 'content-strategy', label: 'Content Strategy',      abbr: 'CS', description: 'Plan and strategize content'    },
  { value: 'thumbnail-design', label: 'Thumbnail Design',      abbr: 'TD', description: 'Eye-catching thumbnails'        },
  { value: 'script-writing',   label: 'Script Writing',        abbr: 'SW', description: 'Scripts for videos or podcasts' },
  { value: 'photography',      label: 'Photography',           abbr: 'PH', description: 'Professional photo sessions'    },
  { value: 'social-media',     label: 'Social Media Content',  abbr: 'SM', description: 'Posts, reels, stories'         },
  { value: 'branding',         label: 'Branding & Identity',   abbr: 'BR', description: 'Visual brand assets'           },
  { value: 'other',            label: 'Other',                 abbr: '+ ', description: 'Something else entirely'        },
];

export const ClientNeedsStep = ({ data, onChange }) => {
  const clientNeeds = data.clientNeeds || [];
  const collabRoles = data.collaborationPreferences?.creatorRoles || [];

  const toggleNeed = (value) => {
    const updated = clientNeeds.includes(value)
      ? clientNeeds.filter((n) => n !== value)
      : [...clientNeeds, value];
    onChange({ clientNeeds: updated });
  };

  const toggleRole = (roleId) => {
    const updated = collabRoles.includes(roleId)
      ? collabRoles.filter((r) => r !== roleId)
      : [...collabRoles, roleId];
    onChange({
      collaborationPreferences: {
        ...(data.collaborationPreferences || {}),
        creatorRoles: updated,
      },
    });
  };

  return (
    <div className="about-you-step fade-in">
      <StepHeader
        eyebrow="Step 3"
        title="What Do You Need?"
        subtitle="Tell us what type of creative help you're looking for."
      />

      <div className="ob-card">
        {/* What you're looking for */}
        <div className="ob-section">
          <div className="ob-section-title">
            What Are You Looking For?
            <span className="ob-section-required">*</span>
          </div>
          <div className="ob-role-grid">
            {CLIENT_NEEDS_OPTIONS.map((option) => {
              const isSelected = clientNeeds.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`ob-role-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleNeed(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNeed(option.value); }
                  }}
                  role="checkbox"
                  tabIndex={0}
                  aria-checked={isSelected}
                  aria-label={option.label}
                >
                  <span className="ob-role-card-icon" aria-hidden="true">{option.abbr}</span>
                  <h3 className="ob-role-card-label">{option.label}</h3>
                  <p className="ob-role-card-desc">{option.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Which creator roles do you need */}
        <div className="ob-section">
          <div className="ob-section-title">
            Creator Roles You Need
            <span className="ob-section-required">*</span>
          </div>
          <div className="ob-section-desc">
            Which types of creators do you want to hire?
          </div>
          <div className="ob-skills-pool">
            {CREATOR_ROLES.map((role) => {
              const isSelected = collabRoles.includes(role.id);
              return (
                <button
                  key={role.id}
                  type="button"
                  className={`ob-chip ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleRole(role.id)}
                  aria-pressed={isSelected}
                >
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget range (optional) */}
        <div className="ob-section">
          <div className="ob-section-title">
            Budget Range
            <span className="ob-section-optional">(Optional)</span>
          </div>
          <div className="ob-level-grid">
            {[
              { id: 'flexible', label: 'Flexible',    desc: 'Discuss case by case' },
              { id: 'small',    label: '$100–$500',   desc: 'Small projects'       },
              { id: 'medium',   label: '$500–$2K',    desc: 'Medium projects'      },
              { id: 'large',    label: '$2K+',        desc: 'Large projects'       },
            ].map((b) => (
              <div
                key={b.id}
                className={`ob-level-card ${data.budgetRange === b.id ? 'selected' : ''}`}
                onClick={() => onChange({ budgetRange: b.id })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange({ budgetRange: b.id }); }
                }}
                role="radio"
                tabIndex={0}
                aria-checked={data.budgetRange === b.id}
                aria-label={`${b.label}: ${b.desc}`}
              >
                <div className="ob-level-name">{b.label}</div>
                <div className="ob-level-years">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
