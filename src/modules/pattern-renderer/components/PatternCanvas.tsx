/**
 * PatternCanvas Component
 * 
 * Animated canvas component that renders abstract patterns.
 * Uses requestAnimationFrame for smooth animation.
 */

import { useEffect, useRef } from 'react';
import { VisualEncoding } from '../../visual-encoding/services/encodingEngine';
import { renderPatternFrame } from '../services/coreCanvasRenderer';

interface PatternCanvasProps {
  encoding: VisualEncoding;
  width?: number;
  height?: number;
}

export function PatternCanvas({
  encoding,
  width = 300,
  height = 300,
}: PatternCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Animation loop
    let frameIndex = 0;
    const animate = () => {
      renderPatternFrame(ctx, width, height, {
        encoding,
        frameIndex,
      });
      frameIndex++;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [encoding, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        maxWidth: `${width}px`,
        maxHeight: `${height}px`,
      }}
    />
  );
}
