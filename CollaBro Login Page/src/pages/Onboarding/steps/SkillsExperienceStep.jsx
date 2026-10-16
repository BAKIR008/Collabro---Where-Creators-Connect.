/**
 * SkillsExperienceStep Component
 * Step 2: Skills, tools, and experience level
 * (Legacy step — kept for backward compatibility but not used in active flow)
 */

import React, { useState, useEffect } from 'react';
import { StepHeader } from '../components';
import './SkillsExperienceStep.css';

const EXPERIENCE_LEVELS = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'Just starting out (0-1 year)',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Building my portfolio (1-3 years)',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Established creator (3-5 years)',
  },
  {
    value: 'expert',
    label: 'Expert',
    description: 'Industry professional (5+ years)',
  },
];

export const SkillsExperienceStep = ({ data, onChange }) => {
  const [experienceLevel, setExperienceLevel] = useState(data.experienceLevel || '');
  const [skills, setSkills] = useState(data.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [tools, setTools] = useState(data.tools || []);
  const [toolInput, setToolInput] = useState('');

  const MAX_SKILLS = 15;
  const MAX_TOOLS = 15;

  const handleExperienceSelect = (value) => setExperienceLevel(value);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim() !== '' && skills.length < MAX_SKILLS) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!skills.includes(newSkill)) setSkills([...skills, newSkill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleAddTool = (e) => {
    if (e.key === 'Enter' && toolInput.trim() !== '' && tools.length < MAX_TOOLS) {
      e.preventDefault();
      const newTool = toolInput.trim();
      if (!tools.includes(newTool)) setTools([...tools, newTool]);
      setToolInput('');
    }
  };

  const handleRemoveTool = (toolToRemove) => {
    setTools(tools.filter((tool) => tool !== toolToRemove));
  };

  useEffect(() => {
    onChange({ experienceLevel, skills, tools });
  }, [experienceLevel, skills, tools, onChange]);

  return (
    <div className="skills-experience-step">
      <StepHeader
        title="Your Expertise"
        subtitle="Tell us about your skills and experience"
      />

      {/* Experience Level */}
      <div className="form-section">
        <h3 className="section-title">Experience Level</h3>
        <p className="section-help">How long have you been creating content?</p>
        <div className="experience-grid">
          {EXPERIENCE_LEVELS.map((level) => (
            <div
              key={level.value}
              className={`experience-card ${experienceLevel === level.value ? 'selected' : ''}`}
              onClick={() => handleExperienceSelect(level.value)}
              role="radio"
              tabIndex={0}
              aria-checked={experienceLevel === level.value}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleExperienceSelect(level.value);
                }
              }}
            >
              <h4 className="experience-label">{level.label}</h4>
              <p className="experience-description">{level.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Skills */}
      <div className="form-section">
        <h3 className="section-title">Core Skills</h3>
        <p className="section-help">Add the tools and skills you excel at (press Enter after each)</p>
        <div className="tag-input-wrapper">
          <input
            type="text"
            className="tag-input"
            placeholder="e.g., Adobe Premiere, Final Cut Pro, DaVinci Resolve"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            disabled={skills.length >= MAX_SKILLS}
          />
          <p className="tag-count">
            {skills.length} / {MAX_SKILLS}
            {skills.length >= 1 && (
              <span className="valid-indicator" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </p>
        </div>
        <div className="tag-list">
          {skills.map((skill) => (
            <div key={skill} className="tag">
              <span>{skill}</span>
              <button
                type="button"
                className="tag-remove"
                onClick={() => handleRemoveSkill(skill)}
                aria-label={`Remove ${skill}`}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tools & Software */}
      <div className="form-section">
        <h3 className="section-title">Tools &amp; Software</h3>
        <p className="section-help">List the software and tools you use regularly</p>
        <div className="tag-input-wrapper">
          <input
            type="text"
            className="tag-input"
            placeholder="e.g., Figma, After Effects, Photoshop"
            value={toolInput}
            onChange={(e) => setToolInput(e.target.value)}
            onKeyDown={handleAddTool}
            disabled={tools.length >= MAX_TOOLS}
          />
          <p className="tag-count">{tools.length} / {MAX_TOOLS}</p>
        </div>
        <div className="tag-list">
          {tools.map((tool) => (
            <div key={tool} className="tag">
              <span>{tool}</span>
              <button
                type="button"
                className="tag-remove"
                onClick={() => handleRemoveTool(tool)}
                aria-label={`Remove ${tool}`}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
