/**
 * Feed Types
 * 
 * Type definitions for posts and feed data structures.
 */

import { EmotionKey, VisualEncoding } from '../visual-encoding/services/encodingEngine';

export interface Post {
  id: string;
  createdAt: number;
  authorMode: 'anonymous' | 'named';
  caption?: string;
  encoding: VisualEncoding;
  emotion: EmotionKey;
  pinHash?: string; // Hashed PIN (SHA-256)
  hasPin: boolean;
}

export interface CreatePostInput {
  authorMode: 'anonymous' | 'named';
  caption?: string;
  emotion: EmotionKey;
  pin?: string; // Plain PIN (will be hashed before storage)
}
