/**
 * Feed Storage
 * 
 * LocalStorage helpers for persisting posts.
 * Includes error handling and validation.
 */

import { Post } from './types';

const STORAGE_KEY = 'cipherfeed_posts_v1';

/**
 * Load posts from LocalStorage.
 * Returns empty array if storage is empty or corrupted.
 */
export function loadPosts(): Post[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    
    // Validate it's an array
    if (!Array.isArray(parsed)) {
      console.warn('Invalid posts data in storage, resetting');
      return [];
    }

    // Basic validation: check each post has required fields
    const validPosts = parsed.filter((post: any) => {
      return (
        post &&
        typeof post.id === 'string' &&
        typeof post.createdAt === 'number' &&
        typeof post.authorMode === 'string' &&
        typeof post.emotion === 'string' &&
        typeof post.hasPin === 'boolean' &&
        post.encoding &&
        Array.isArray(post.encoding.colorPalette)
      );
    });

    return validPosts as Post[];
  } catch (error) {
    console.error('Error loading posts from storage:', error);
    return [];
  }
}

/**
 * Save posts to LocalStorage.
 * Returns true on success, false on error.
 */
export function savePosts(posts: Post[]): boolean {
  try {
    const serialized = JSON.stringify(posts);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Error saving posts to storage:', error);
    return false;
  }
}

/**
 * Add a new post to storage.
 */
export function addPost(post: Post): boolean {
  const posts = loadPosts();
  posts.unshift(post); // Add to beginning (newest first)
  return savePosts(posts);
}

/**
 * Clear all posts from storage.
 */
export function clearAllPosts(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing posts from storage:', error);
    return false;
  }
}
