/**
 * PostCard Component
 * 
 * Modern feed post card displaying pattern, metadata, caption,
 * and reveal/hide functionality with PIN protection.
 */

import { useState } from 'react';
import { Post } from '../types';
import { PatternCanvas } from '../../pattern-renderer/components/PatternCanvas';
import { verifyPin } from '../utils/pinHash';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleReveal = async () => {
    if (!post.hasPin) {
      setIsRevealed(true);
      return;
    }

    // PIN required
    if (!pinInput || pinInput.length !== 4) {
      setPinError('Please enter a 4-digit PIN');
      return;
    }

    setIsVerifying(true);
    setPinError(null);

    try {
      if (post.pinHash) {
        const isValid = await verifyPin(pinInput, post.pinHash);
        if (isValid) {
          setIsRevealed(true);
          setPinInput('');
        } else {
          setPinError('Incorrect PIN');
          setPinInput('');
        }
      } else {
        setIsRevealed(true);
        setPinInput('');
      }
    } catch (error) {
      setPinError('Error verifying PIN');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleHide = () => {
    setIsRevealed(false);
    setPinInput('');
    setPinError(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="post-card">
      {/* Pattern Canvas - Fixed height, full width */}
      <div className="post-card-pattern">
        <PatternCanvas encoding={post.encoding} width={600} height={400} />
      </div>

      {/* Card Content */}
      <div className="post-card-content">
        {/* Meta Row */}
        <div className="post-card-meta">
          <span className="post-card-author">
            {post.authorMode === 'anonymous' ? 'Anonymous' : 'User'}
          </span>
          <span className="post-card-time">{formatDate(post.createdAt)}</span>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="post-card-caption">{post.caption}</div>
        )}

        {/* Reveal Section */}
        <div className="post-card-reveal">
          {!isRevealed ? (
            <div className="post-card-reveal-hidden">
              {post.hasPin ? (
                <div className="post-card-pin-section">
                  <div className="post-card-pin-input-wrapper">
                    <input
                      type="text"
                      className="post-card-pin-input"
                      value={pinInput}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setPinInput(value);
                        setPinError(null);
                      }}
                      placeholder="0000"
                      maxLength={4}
                      pattern="\d{4}"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleReveal();
                        }
                      }}
                    />
                  </div>
                  {pinError && (
                    <div className="post-card-pin-error">{pinError}</div>
                  )}
                  <button
                    className="post-card-reveal-button"
                    onClick={handleReveal}
                    disabled={isVerifying || pinInput.length !== 4}
                  >
                    {isVerifying ? 'Verifying...' : 'Reveal Meaning'}
                  </button>
                </div>
              ) : (
                <button
                  className="post-card-reveal-button"
                  onClick={handleReveal}
                >
                  Reveal Meaning
                </button>
              )}
            </div>
          ) : (
            <div className="post-card-reveal-shown">
              <div className="post-card-emotion-badge">
                {post.emotion.charAt(0).toUpperCase() + post.emotion.slice(1)}
              </div>
              <button
                className="post-card-hide-button"
                onClick={handleHide}
              >
                Hide Meaning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
