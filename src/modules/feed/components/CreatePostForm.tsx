/**
 * CreatePostForm Component
 * 
 * Form for creating a new post with emotion selection,
 * caption, author mode, and optional PIN.
 */

import { useState, FormEvent, useMemo } from 'react';
import { EmotionKey, getVisualEncoding, getAllEmotions } from '../../visual-encoding/services/encodingEngine';
import { CreatePostInput } from '../types';
import { hashPin } from '../utils/pinHash';
import { PatternCanvas } from '../../pattern-renderer/components/PatternCanvas';

interface CreatePostFormProps {
  onSubmit: (input: CreatePostInput) => Promise<void>;
  onCancel?: () => void;
}

export function CreatePostForm({ onSubmit, onCancel }: CreatePostFormProps) {
  const [authorMode, setAuthorMode] = useState<'anonymous' | 'named'>('anonymous');
  const [caption, setCaption] = useState('');
  const [emotion, setEmotion] = useState<EmotionKey>('calm');
  const [pin, setPin] = useState('');
  const [hasPin, setHasPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emotions = getAllEmotions();

  // Generate encoding for live preview
  const previewEncoding = useMemo(() => {
    return getVisualEncoding(emotion);
  }, [emotion]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (caption.length > 80) {
      setError('Caption must be 80 characters or less');
      return;
    }

    if (hasPin && pin.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    if (hasPin && !/^\d{4}$/.test(pin)) {
      setError('PIN must contain only digits');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        authorMode,
        caption: caption.trim() || undefined,
        emotion,
        pin: hasPin ? pin : undefined,
      });

      // Reset form
      setCaption('');
      setPin('');
      setHasPin(false);
      setEmotion('calm');
      setAuthorMode('anonymous');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-form">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Display Mode</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="anonymous"
                checked={authorMode === 'anonymous'}
                onChange={(e) => setAuthorMode(e.target.value as 'anonymous' | 'named')}
              />
              Anonymous
            </label>
            <label>
              <input
                type="radio"
                value="named"
                checked={authorMode === 'named'}
                onChange={(e) => setAuthorMode(e.target.value as 'anonymous' | 'named')}
              />
              Named
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="caption">Caption (optional, max 80 chars)</label>
          <input
            id="caption"
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={80}
            placeholder="Add a short caption..."
          />
          <div className="char-count">{caption.length}/80</div>
        </div>

        <div className="form-group">
          <label htmlFor="emotion">Emotion</label>
          <select
            id="emotion"
            value={emotion}
            onChange={(e) => setEmotion(e.target.value as EmotionKey)}
          >
            {emotions.map((em) => (
              <option key={em} value={em}>
                {em.charAt(0).toUpperCase() + em.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group preview-group">
          <label className="preview-label">Live Preview</label>
          <div className="preview-card">
            <PatternCanvas encoding={previewEncoding} width={250} height={250} />
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={hasPin}
              onChange={(e) => {
                setHasPin(e.target.checked);
                if (!e.target.checked) {
                  setPin('');
                }
              }}
            />
            Protect with PIN (4 digits)
          </label>
          {hasPin && (
            <input
              type="text"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPin(value);
              }}
              placeholder="0000"
              maxLength={4}
              pattern="\d{4}"
            />
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
          )}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
