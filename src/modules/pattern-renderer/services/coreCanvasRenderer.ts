/**
 * Core Canvas Renderer
 * 
 * Deterministic rendering of abstract patterns based on visual encoding.
 * Uses grid-based layout with symmetry and shape variations.
 */

import { VisualEncoding } from '../../visual-encoding/services/encodingEngine';

export interface RenderParams {
  encoding: VisualEncoding;
  frameIndex: number; // Current animation frame
}

/**
 * Render a single frame of the pattern animation.
 * 
 * @param ctx - Canvas 2D context
 * @param width - Canvas width
 * @param height - Canvas height
 * @param params - Rendering parameters including encoding and frame index
 */
export function renderPatternFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: RenderParams
): void {
  const { encoding, frameIndex } = params;
  const { colorPalette, shape, symmetryLevel, movementSpeed } = encoding;

  // Clear canvas
  ctx.fillStyle = '#0A0A0A';
  ctx.fillRect(0, 0, width, height);

  // Grid configuration
  const gridSize = 8; // 8x8 grid
  const cellWidth = width / gridSize;
  const cellHeight = height / gridSize;

  // Animation phase based on frame index and movement speed
  const phase = (frameIndex * movementSpeed * 0.01) % (Math.PI * 2);

  // Draw grid cells with symmetry
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Calculate symmetry coordinates
      const symCol = symmetryLevel >= 2 ? gridSize - 1 - col : col;
      const symRow = symmetryLevel >= 3 ? gridSize - 1 - row : row;

      // Use symmetry for color selection
      const useSymmetry = symmetryLevel >= 1;
      const finalCol = useSymmetry && col >= gridSize / 2 ? symCol : col;
      const finalRow = useSymmetry && row >= gridSize / 2 ? symRow : row;

      // Calculate position
      const x = finalCol * cellWidth + cellWidth / 2;
      const y = finalRow * cellHeight + cellHeight / 2;

      // Size varies with animation
      const baseSize = Math.min(cellWidth, cellHeight) * 0.3;
      const sizeVariation = Math.sin(phase + (row + col) * 0.5) * 0.3 + 1;
      const size = baseSize * sizeVariation;

      // Color selection based on position and phase
      const colorIndex = Math.floor(
        ((row + col + phase * 10) % (colorPalette.length * 2)) / 2
      ) % colorPalette.length;
      const color = colorPalette[colorIndex];

      // Draw shape
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7 + Math.sin(phase + row + col) * 0.2;

      drawShape(ctx, x, y, size, shape, phase, row, col);
    }
  }

  ctx.globalAlpha = 1.0;
}

/**
 * Draw a shape at the given position.
 * 
 * @param ctx - Canvas context
 * @param x - Center X
 * @param y - Center Y
 * @param size - Base size
 * @param shape - Shape type
 * @param phase - Animation phase
 * @param row - Grid row (for variation)
 * @param col - Grid column (for variation)
 */
function drawShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: 'circle' | 'square' | 'triangle' | 'mixed',
  phase: number,
  row: number,
  col: number
): void {
  ctx.save();
  ctx.translate(x, y);

  // Rotation for animation
  const rotation = phase * 0.5 + (row + col) * 0.1;
  ctx.rotate(rotation);

  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'square') {
    ctx.fillRect(-size / 2, -size / 2, size, size);
  } else if (shape === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(0, -size / 2);
    ctx.lineTo(-size / 2, size / 2);
    ctx.lineTo(size / 2, size / 2);
    ctx.closePath();
    ctx.fill();
  } else if (shape === 'mixed') {
    // Mixed: alternate between shapes based on position
    const shapeType = (row + col) % 3;
    if (shapeType === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shapeType === 1) {
      ctx.fillRect(-size / 2, -size / 2, size, size);
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}
