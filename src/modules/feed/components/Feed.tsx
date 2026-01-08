/**
 * Feed Component
 * 
 * Main feed view displaying all posts in reverse chronological order.
 * Includes create post form and clear all functionality.
 */

import { useState, useEffect } from 'react';
import { Post, CreatePostInput } from '../types';
import { loadPosts, addPost, clearAllPosts } from '../storage';
import { getVisualEncoding } from '../../visual-encoding/services/encodingEngine';
import { hashPin } from '../utils/pinHash';
import { CreatePostForm } from './CreatePostForm';
import { PostCard } from './PostCard';

interface FeedProps {
  hideCreateForm?: boolean;
}

export function Feed({ hideCreateForm = false }: FeedProps = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load posts on mount
  useEffect(() => {
    const loadedPosts = loadPosts();
    setPosts(loadedPosts);
    setIsLoading(false);
  }, []);

  const handleCreatePost = async (input: CreatePostInput) => {
    // Generate encoding
    const encoding = getVisualEncoding(input.emotion);

    // Hash PIN if provided
    let pinHash: string | undefined;
    if (input.pin) {
      pinHash = await hashPin(input.pin);
    }

    // Create post object
    const newPost: Post = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      authorMode: input.authorMode,
      caption: input.caption,
      encoding,
      emotion: input.emotion,
      pinHash,
      hasPin: !!input.pin,
    };

    // Save to storage
    const success = addPost(newPost);
    if (!success) {
      throw new Error('Failed to save post');
    }

    // Update state
    setPosts((prev) => [newPost, ...prev]);
    setShowCreateForm(false);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all posts? This cannot be undone.')) {
      const success = clearAllPosts();
      if (success) {
        setPosts([]);
      } else {
        alert('Failed to clear posts');
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Loading feed...</div>;
  }

  return (
    <div className="feed">
      {!hideCreateForm && (
        <>
          <div className="feed-header">
            <button
              className="create-post-button"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : '+ Create Post'}
            </button>
            {posts.length > 0 && (
              <button className="clear-all-button" onClick={handleClearAll}>
                Clear All Posts
              </button>
            )}
          </div>

          {showCreateForm && (
            <div className="create-post-section">
              <CreatePostForm
                onSubmit={handleCreatePost}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}
        </>
      )}
      {hideCreateForm && posts.length > 0 && (
        <div className="feed-header">
          <button className="clear-all-button" onClick={handleClearAll}>
            Clear All Posts
          </button>
        </div>
      )}

      {/* How it works info box */}
      <div className="feed-info-box">
        <h3 className="feed-info-title">How it works</h3>
        <ul className="feed-info-list">
          <li>Posts are abstract visual patterns encoding emotions</li>
          <li>Meaning is hidden by default—reveal to see the emotion</li>
          <li>PIN-protected posts require the correct PIN to reveal</li>
        </ul>
      </div>

      {posts.length === 0 ? (
        <div className="empty-feed">
          <p>No posts yet. Create your first post to get started!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
