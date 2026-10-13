import React, { useRef, useState } from 'react';
import './FileUpload.css';

/**
 * FileUpload - Reusable file upload component with preview
 * Supports images (profile photos) and documents (resumes)
 * 
 * @param {Object} props
 * @param {string} props.type - 'image' or 'document'
 * @param {string[]} props.accept - Accepted file types (MIME types)
 * @param {number} props.maxSizeMB - Maximum file size in MB
 * @param {File|string} props.value - Current file or preview URL
 * @param {Function} props.onChange - Callback with file object
 * @param {Function} props.onRemove - Callback when file is removed
 * @param {string} props.title - Upload title
 * @param {string} props.subtitle - Upload subtitle/description
 * @param {boolean} props.disabled - Whether upload is disabled
 * @param {string} props.error - Error message to display
 */
export const FileUpload = ({
  type = 'image', // 'image' or 'document'
  accept = [],
  maxSizeMB = 5,
  value = null,
  onChange,
  onRemove,
  title,
  subtitle,
  disabled = false,
  error = null,
  className = '',
}) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [localError, setLocalError] = useState(null);

  const displayError = error || localError;

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file) => {
    setLocalError(null);

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setLocalError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    // Check file type
    if (accept.length > 0 && !accept.includes(file.type)) {
      const extensions = accept.map(mime => {
        const parts = mime.split('/');
        return parts[parts.length - 1];
      }).join(', ');
      setLocalError(`Please upload a valid file type: ${extensions}`);
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    // Generate preview for images
    if (type === 'image' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    onChange?.(file);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    // Generate preview for images
    if (type === 'image' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    onChange?.(file);
  };

  // Handle remove
  const handleRemove = () => {
    setPreview(null);
    setFileName('');
    setFileSize('');
    setLocalError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onRemove?.();
  };

  // Render upload zone
  const renderUploadZone = () => (
    <div
      className={`file-upload__zone ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''} ${displayError ? 'error' : ''}`}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="file-upload__icon">
        {type === 'image' ? '📸' : '📄'}
      </div>
      <div className="file-upload__title">
        {title || (type === 'image' ? 'Upload Profile Photo' : 'Upload Document')}
      </div>
      <div className="file-upload__subtitle">
        {subtitle || `Drag and drop or click to browse • Max ${maxSizeMB}MB`}
      </div>
      <button
        type="button"
        className="file-upload__button"
        onClick={(e) => {
          e.stopPropagation();
          !disabled && inputRef.current?.click();
        }}
        disabled={disabled}
      >
        Choose File
      </button>
      <input
        ref={inputRef}
        type="file"
        className="file-upload__input"
        accept={accept.join(',')}
        onChange={handleFileChange}
        disabled={disabled}
        aria-label={title || 'Upload file'}
      />
    </div>
  );

  // Render image preview
  const renderImagePreview = () => (
    <div className="file-upload__preview-container">
      <div className="file-upload__preview-image">
        {preview || (typeof value === 'string' && value) ? (
          <img src={preview || value} alt="Preview" />
        ) : (
          '👤'
        )}
      </div>
      <div className="file-upload__preview-info">
        <div className="file-upload__preview-name">{fileName || 'Profile Photo'}</div>
        {fileSize && <div className="file-upload__preview-meta">{fileSize}</div>}
        <div className="file-upload__preview-actions">
          <button
            type="button"
            className="file-upload__preview-button file-upload__preview-button--change"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            Change
          </button>
          <button
            type="button"
            className="file-upload__preview-button file-upload__preview-button--remove"
            onClick={handleRemove}
            disabled={disabled}
          >
            Remove
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="file-upload__input"
        accept={accept.join(',')}
        onChange={handleFileChange}
        disabled={disabled}
        aria-label="Change profile photo"
      />
    </div>
  );

  // Render document preview
  const renderDocumentPreview = () => (
    <div className="file-upload__file-preview">
      <div className="file-upload__file-icon">📎</div>
      <div className="file-upload__file-info">
        <div className="file-upload__file-name">{fileName}</div>
        {fileSize && <div className="file-upload__file-size">{fileSize}</div>}
      </div>
      <div className="file-upload__preview-actions">
        <button
          type="button"
          className="file-upload__preview-button file-upload__preview-button--change"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          Change
        </button>
        <button
          type="button"
          className="file-upload__preview-button file-upload__preview-button--remove"
          onClick={handleRemove}
          disabled={disabled}
        >
          Remove
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="file-upload__input"
        accept={accept.join(',')}
        onChange={handleFileChange}
        disabled={disabled}
        aria-label="Change document"
      />
    </div>
  );

  const hasFile = value || preview || fileName;

  return (
    <div className={`file-upload ${className}`}>
      {!hasFile && renderUploadZone()}
      {hasFile && type === 'image' && renderImagePreview()}
      {hasFile && type === 'document' && renderDocumentPreview()}
      
      {displayError && (
        <div className="file-upload__error" role="alert">
          <span className="file-upload__error-icon" aria-hidden="true">⚠️</span>
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
};
