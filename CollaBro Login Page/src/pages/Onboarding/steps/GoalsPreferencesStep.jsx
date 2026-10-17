import React from 'react';
import { StepHeader } from '../components';

export const GoalsPreferencesStep = ({ data, onChange }) => {
  const isFreelancer = data.accountType === 'freelancer';

  const selectedGoals = data.goals || [];
  const workMode = data.workMode || null;
  const workStyle = data.workStyle || null;
  const projectTypes = data.collaborationPreferences?.projectTypes || [];
  const duration = data.collaborationPreferences?.duration || null;

  const toggleGoal = (goalId) => {
    let newGoals = [...selectedGoals];
    if (newGoals.includes(goalId)) {
      newGoals = newGoals.filter(g => g !== goalId);
    } else {
      newGoals.push(goalId);
    }
    onChange({ goals: newGoals });
  };

  const toggleProjectType = (type) => {
    let newTypes = [...projectTypes];
    if (newTypes.includes(type)) {
      newTypes = newTypes.filter(t => t !== type);
    } else {
      newTypes.push(type);
    }
    onChange({
      collaborationPreferences: {
        ...data.collaborationPreferences,
        projectTypes: newTypes
      }
    });
  };

  const freelancerGoals = [
    { id: 'find-collaborators', label: 'Find Collaborators', icon: '🤝' },
    { id: 'find-projects', label: 'Find Projects', icon: '🎯' },
    { id: 'find-clients', label: 'Find Clients', icon: '💼' },
    { id: 'build-portfolio', label: 'Build Portfolio', icon: '📁' },
    { id: 'showcase-work', label: 'Showcase Work', icon: '✨' },
    { id: 'get-discovered', label: 'Get Discovered', icon: '⭐' },
    { id: 'grow-network', label: 'Grow Network', icon: '🌐' },
    { id: 'find-teams', label: 'Find Teams', icon: '👥' },
    { id: 'learn-skills', label: 'Learn Skills', icon: '📚' },
    { id: 'earn-income', label: 'Earn Income', icon: '💰' }
  ];

  return (
    <div className="goals-preferences-step fade-in">
      <StepHeader
        icon="🎯"
        title="Goals & Preferences"
        subtitle="How do you like to work?"
      />

      {isFreelancer ? (
        <>
          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label>Your Goals <span className="required">*</span></label>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Select all that apply</p>
            <div className="option-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
              {freelancerGoals.map(goal => (
                <div
                  key={goal.id}
                  className={`option-card ${selectedGoals.includes(goal.id) ? 'selected' : ''}`}
                  onClick={() => toggleGoal(goal.id)}
                  style={{ padding: '0.75rem' }}
                >
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{goal.icon}</div>
                  <h4 style={{ margin: '0', fontSize: '0.85rem' }}>{goal.label}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Work Mode <span className="required">*</span></label>
            <div className="option-cards" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              {[
                { id: 'remote', label: 'Remote', icon: '🌍' },
                { id: 'hybrid', label: 'Hybrid', icon: '🔀' },
                { id: 'on-site', label: 'On-site', icon: '🏢' }
              ].map(mode => (
                <div
                  key={mode.id}
                  className={`option-card ${workMode === mode.id ? 'selected' : ''}`}
                  onClick={() => onChange({ workMode: mode.id })}
                  style={{ padding: '1rem' }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{mode.icon}</div>
                  <h4 style={{ margin: '0', fontSize: '0.9rem' }}>{mode.label}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Work Style <span className="required">*</span></label>
            <div className="option-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
              {[
                { id: 'flexible', label: 'Flexible', icon: '🌊' },
                { id: 'structured', label: 'Structured', icon: '📐' },
                { id: 'fast-paced', label: 'Fast-paced', icon: '⚡' },
                { id: 'long-term', label: 'Long-term', icon: '📆' },
                { id: 'short-term', label: 'Short-term', icon: '⏱️' }
              ].map(style => (
                <div
                  key={style.id}
                  className={`option-card ${workStyle === style.id ? 'selected' : ''}`}
                  onClick={() => onChange({ workStyle: style.id })}
                  style={{ padding: '1rem' }}
                >
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{style.icon}</div>
                  <h4 style={{ margin: '0', fontSize: '0.85rem' }}>{style.label}</h4>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label>Project Types <span className="required">*</span></label>
            <div className="option-cards">
              {[
                { id: 'short-form-video', label: 'Short-Form Video', icon: '📱' },
                { id: 'long-form-video', label: 'Long-Form Video', icon: '🎬' },
                { id: 'social-media-content', label: 'Social Media Content', icon: '📲' },
                { id: 'brand-collaborations', label: 'Brand Collaborations', icon: '🏢' },
                { id: 'commercial-work', label: 'Commercial Work', icon: '💼' }
              ].map(type => (
                <div
                  key={type.id}
                  className={`option-card ${projectTypes.includes(type.id) ? 'selected' : ''}`}
                  onClick={() => toggleProjectType(type.id)}
                  style={{ padding: '1rem' }}
                >
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{type.icon}</div>
                  <h4 style={{ margin: '0', fontSize: '0.85rem' }}>{type.label}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Expected Duration <span className="required">*</span></label>
            <div className="option-cards">
              {[
                { id: 'one-time', label: 'One-time Project', icon: '⚡' },
                { id: 'short-term', label: 'Short-term (1-3 mos)', icon: '📅' },
                { id: 'long-term', label: 'Long-term (3+ mos)', icon: '📆' },
                { id: 'ongoing', label: 'Ongoing Work', icon: '🔄' },
                { id: 'flexible', label: 'Flexible/Not sure yet', icon: '🤷' }
              ].map(dur => (
                <div
                  key={dur.id}
                  className={`option-card ${duration === dur.id ? 'selected' : ''}`}
                  onClick={() => onChange({
                    collaborationPreferences: {
                      ...data.collaborationPreferences,
                      duration: dur.id
                    }
                  })}
                  style={{ padding: '1rem' }}
                >
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{dur.icon}</div>
                  <h4 style={{ margin: '0', fontSize: '0.85rem' }}>{dur.label}</h4>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
