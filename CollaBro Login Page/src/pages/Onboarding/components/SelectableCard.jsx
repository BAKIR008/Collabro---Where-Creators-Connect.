import React from 'react';
import './SelectableCard.css';

/**
 * SelectableCard - Reusable card component for selectable options
 * Meets WCAG 2.1 AA accessibility standards
 * 
 * @param {Object} props
 * @param {boolean} props.selected - Whether the card is selected
 * @param {Function} props.onSelect - Callback when card is selected
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.ariaLabel - Accessible label for screen readers
 * @param {React.ReactNode} props.icon - Icon element or SVG
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {React.ReactNode} props.children - Additional content
 * @param {boolean} props.disabled - Whether the card is disabled
 */
export const SelectableCard = ({
  selected = false,
  onSelect,
  className = '',
  ariaLabel,
  icon,
  title,
  description,
  children,
  disabled = false,
  variant = 'default', // 'default', 'primary', 'accent'
  showCheckbox = true,
  ...props
}) => {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.();
    }
  };

  const variantClass = variant !== 'default' ? `selectable-card--${variant}` : '';

  return (
    <div
      className={`selectable-card ${selected ? 'selected' : ''} ${variantClass} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && onSelect?.()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel || title}
      aria-pressed={selected}
      aria-disabled={disabled}
      {...props}
    >
      {icon && <div className="selectable-card__icon">{icon}</div>}
      
      <div className="selectable-card__body">
        {title && <h3 className="selectable-card__title">{title}</h3>}
        {description && <p className="selectable-card__description">{description}</p>}
        {children}
      </div>

      {showCheckbox && (
        <div className="selectable-card__checkbox" aria-hidden="true">
          <div className="selectable-card__checkbox-inner"></div>
        </div>
      )}
    </div>
  );
};
