/**
 * App Component
 * 
 * Main application component with header and 2-column layout.
 * Left: Create Post panel, Right: Feed panel.
 */

import { useState } from 'react';
import { Feed } from '../modules/feed/components/Feed';
import { CreatePostForm } from '../modules/feed/components/CreatePostForm';
import { CreatePostInput } from '../modules/feed/types';
import { getVisualEncoding } from '../modules/visual-encoding/services/encodingEngine';
import { hashPin } from '../modules/feed/utils/pinHash';
import { addPost } from '../modules/feed/storage';
import '../styles/global.css';

export function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreatePost = async (input: CreatePostInput) => {
    // Generate encoding
    const encoding = getVisualEncoding(input.emotion);

    // Hash PIN if provided
    let pinHash: string | undefined;
    if (input.pin) {
      pinHash = await hashPin(input.pin);
    }

    // Create post object
    const newPost = {
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

    // Trigger feed refresh by updating key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>CipherFeed</h1>
        <p className="tagline">Speak without words through abstract visual patterns</p>
      </header>
      <main className="app-main">
        <div className="app-content-layout">
          <section className="create-post-panel">
            <h2 className="panel-title">Create Post</h2>
            <CreatePostForm onSubmit={handleCreatePost} />
          </section>
          <section className="feed-panel">
            <Feed key={refreshKey} hideCreateForm={true} />
          </section>
        </div>
      </main>
    </div>
  );
}
