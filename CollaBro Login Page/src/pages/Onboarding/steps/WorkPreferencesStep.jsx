/**
 * WorkPreferencesStep Component
 * Step 5: Work preferences (optional)
 */

import React, { useState, useEffect } from 'react';
import { StepHeader } from '../components';
import './WorkPreferencesStep.css';

export const WorkPreferencesStep = ({ data, onChange }) => {
  const [categories, setCategories] = useState(
    data.workPreferences?.categories || []
  );
  const [categoryInput, setCategoryInput] = useState('');

  const [industries, setIndustries] = useState(
    data.workPreferences?.industries || []
  );
  const [industryInput, setIndustryInput] = useState('');

  const [styles, setStyles] = useState(data.workPreferences?.style || []);
  const [styleInput, setStyleInput] = useState('');

  const MAX_CATEGORIES = 10;
  const MAX_INDUSTRIES = 10;
  const MAX_STYLES = 8;

  /**
   * Handle adding a category
   */
  const handleAddCategory = (e) => {
    if (
      e.key === 'Enter' &&
      categoryInput.trim() !== '' &&
      categories.length < MAX_CATEGORIES
    ) {
      e.preventDefault();
      const newCategory = categoryInput.trim();
      if (!categories.includes(newCategory)) {
        setCategories([...categories, newCategory]);
      }
      setCategoryInput('');
    }
  };

  /**
   * Handle removing a category
   */
  const handleRemoveCategory = (categoryToRemove) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove));
  };

  /**
   * Handle adding an industry
   */
  const handleAddIndustry = (e) => {
    if (
      e.key === 'Enter' &&
      industryInput.trim() !== '' &&
      industries.length < MAX_INDUSTRIES
    ) {
      e.preventDefault();
      const newIndustry = industryInput.trim();
      if (!industries.includes(newIndustry)) {
        setIndustries([...industries, newIndustry]);
      }
      setIndustryInput('');
    }
  };

  /**
   * Handle removing an industry
   */
  const handleRemoveIndustry = (industryToRemove) => {
    setIndustries(industries.filter((ind) => ind !== industryToRemove));
  };

  /**
   * Handle adding a style
   */
  const handleAddStyle = (e) => {
    if (
      e.key === 'Enter' &&
      styleInput.trim() !== '' &&
      styles.length < MAX_STYLES
    ) {
      e.preventDefault();
      const newStyle = styleInput.trim();
      if (!styles.includes(newStyle)) {
        setStyles([...styles, newStyle]);
      }
      setStyleInput('');
    }
  };

  /**
   * Handle removing a style
   */
  const handleRemoveStyle = (styleToRemove) => {
    setStyles(styles.filter((s) => s !== styleToRemove));
  };

  /**
   * Sync changes to parent
   */
  useEffect(() => {
    onChange({
      workPreferences: {
        categories,
        industries,
        style: styles,
      },
    });
  }, [categories, industries, styles, onChange]);

  return (
    <div className="work-preferences-step">
      <StepHeader
        title="Work Preferences"
        subtitle="Tell us more about your creative preferences (optional)"
      />

      <div className="optional-notice">
        <p>This step is optional but helps us personalize your experience</p>
      </div>

      {/* Content Categories */}
      <div className="form-section">
        <h3 className="section-title">Content Categories</h3>
        <p className="section-help">
          What topics and niches do you create content about?
        </p>

        <div className="tag-input-wrapper">
          <input
            type="text"
            className="tag-input"
            placeholder="e.g., Gaming, Tech, Lifestyle, Education"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyDown={handleAddCategory}
            disabled={categories.length >= MAX_CATEGORIES}
          />
          <p className="tag-count">{categories.length} / {MAX_CATEGORIES}</p>
        </div>

        <div className="tag-list">
          {categories.map((category) => (
            <div key={category} className="tag tag-yellow">
              <span>{category}</span>
              <button
                type="button"
                className="tag-remove"
                onClick={() => handleRemoveCategory(category)}
                aria-label={`Remove ${category}`}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div className="form-section">
        <h3 className="section-title">Industries</h3>
        <p className="section-help">
          Which industries do you have experience in?
        </p>

        <div className="tag-input-wrapper">
          <input
            type="text"
            className="tag-input"
            placeholder="e.g., Entertainment, Fashion, Finance, Health"
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
            onKeyDown={handleAddIndustry}
            disabled={industries.length >= MAX_INDUSTRIES}
          />
          <p className="tag-count">{industries.length} / {MAX_INDUSTRIES}</p>
        </div>

        <div className="tag-list">
          {industries.map((industry) => (
            <div key={industry} className="tag tag-cyan">
              <span>{industry}</span>
              <button
                type="button"
                className="tag-remove"
                onClick={() => handleRemoveIndustry(industry)}
                aria-label={`Remove ${industry}`}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Creative Style */}
      <div className="form-section">
        <h3 className="section-title">Creative Style</h3>
        <p className="section-help">
          How would you describe your creative style?
        </p>

        <div className="tag-input-wrapper">
          <input
            type="text"
            className="tag-input"
            placeholder="e.g., Minimalist, Cinematic, Bold, Playful"
            value={styleInput}
            onChange={(e) => setStyleInput(e.target.value)}
            onKeyDown={handleAddStyle}
            disabled={styles.length >= MAX_STYLES}
          />
          <p className="tag-count">{styles.length} / {MAX_STYLES}</p>
        </div>

        <div className="tag-list">
          {styles.map((style) => (
            <div key={style} className="tag tag-magenta">
              <span>{style}</span>
              <button
                type="button"
                className="tag-remove"
                onClick={() => handleRemoveStyle(style)}
                aria-label={`Remove ${style}`}
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
