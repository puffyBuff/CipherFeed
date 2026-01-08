/**
 * Visual Encoding Engine
 * 
 * Maps emotions to deterministic visual patterns.
 * Each emotion has a unique combination of:
 * - colorPalette: array of colors
 * - shape: primary shape type
 * - symmetryLevel: 0-4 (0=none, 4=high symmetry)
 * - movementSpeed: animation speed multiplier
 */

export type EmotionKey = 'calm' | 'joy' | 'fear' | 'urgency' | 'trust';

export interface VisualEncoding {
  colorPalette: string[];
  shape: 'circle' | 'square' | 'triangle' | 'mixed';
  symmetryLevel: number; // 0-4
  movementSpeed: number; // multiplier for animation
}

/**
 * Deterministic mapping from emotion to visual encoding.
 * Each emotion has a unique visual signature.
 */
const EMOTION_ENCODINGS: Record<EmotionKey, VisualEncoding> = {
  calm: {
    colorPalette: ['#E8F4F8', '#B8D4E3', '#7FB3D3', '#4A90A4'],
    shape: 'circle',
    symmetryLevel: 4,
    movementSpeed: 0.3,
  },
  joy: {
    colorPalette: ['#FFE66D', '#FF6B6B', '#FF8E53', '#FFA07A'],
    shape: 'circle',
    symmetryLevel: 3,
    movementSpeed: 0.8,
  },
  fear: {
    colorPalette: ['#2C1810', '#4A3728', '#6B4423', '#8B4513'],
    shape: 'triangle',
    symmetryLevel: 1,
    movementSpeed: 1.5,
  },
  urgency: {
    colorPalette: ['#FF1744', '#FF6F00', '#FFC400', '#FF3D00'],
    shape: 'square',
    symmetryLevel: 2,
    movementSpeed: 2.0,
  },
  trust: {
    colorPalette: ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'],
    shape: 'mixed',
    symmetryLevel: 4,
    movementSpeed: 0.5,
  },
};

/**
 * Get visual encoding for a given emotion.
 * @param emotion - The emotion key
 * @returns Visual encoding configuration
 */
export function getVisualEncoding(emotion: EmotionKey): VisualEncoding {
  return EMOTION_ENCODINGS[emotion];
}

/**
 * Get all available emotion keys.
 */
export function getAllEmotions(): EmotionKey[] {
  return Object.keys(EMOTION_ENCODINGS) as EmotionKey[];
}
