/**
 * Instagram Story Image Generator (1080x1920)
 * Renders a branded story card using HTML Canvas API
 */

export interface StoryData {
  username: string;
  game: string;
  headline: string;
  headlineValue: string;
  metrics: { label: string; value: string }[];
  tier: string;
  badges?: string[];
  isAdvanced?: boolean;
}

const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;

// Colors matching the design system
const COLORS = {
  bg: '#0d1117',
  bgGradientTop: '#111821',
  bgGradientBottom: '#0a0e14',
  primary: '#1ec8d9',
  primaryDim: 'rgba(30, 200, 217, 0.15)',
  accent: '#e69a1a',
  text: '#dce3ea',
  textMuted: '#6b7a8d',
  cardBg: '#161d27',
  border: '#1f2937',
  success: '#2cb67d',
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function generateStoryImage(data: StoryData): string {
  const canvas = document.createElement('canvas');
  canvas.width = STORY_WIDTH;
  canvas.height = STORY_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, STORY_HEIGHT);
  bgGrad.addColorStop(0, COLORS.bgGradientTop);
  bgGrad.addColorStop(0.5, COLORS.bg);
  bgGrad.addColorStop(1, COLORS.bgGradientBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  // Subtle grid pattern
  ctx.strokeStyle = 'rgba(30, 200, 217, 0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < STORY_WIDTH; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, STORY_HEIGHT);
    ctx.stroke();
  }
  for (let i = 0; i < STORY_HEIGHT; i += 60) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(STORY_WIDTH, i);
    ctx.stroke();
  }

  // Top glow accent
  const topGlow = ctx.createRadialGradient(540, 200, 50, 540, 200, 500);
  topGlow.addColorStop(0, 'rgba(30, 200, 217, 0.08)');
  topGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, STORY_WIDTH, 700);

  let y = 120;

  // SN Logo badge
  roundRect(ctx, 80, y, 72, 72, 16);
  ctx.fillStyle = COLORS.primaryDim;
  ctx.fill();
  ctx.strokeStyle = 'rgba(30, 200, 217, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = COLORS.primary;
  ctx.font = 'bold 28px Rajdhani, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SN', 116, y + 48);

  // Brand text
  ctx.textAlign = 'left';
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 32px Rajdhani, sans-serif';
  ctx.fillText('SECOND NATURE', 172, y + 32);
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '500 20px Rajdhani, sans-serif';
  ctx.fillText('CROSS-GAME COORDINATION SYSTEM', 172, y + 60);

  y += 130;

  // Username + Game badge
  ctx.fillStyle = COLORS.primary;
  ctx.font = 'bold 24px Rajdhani, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText(`@${data.username.toUpperCase()}`, 80, y);

  // Game pill
  const gameText = data.game.toUpperCase();
  ctx.font = 'bold 20px Rajdhani, sans-serif';
  const gameWidth = ctx.measureText(gameText).width + 32;
  roundRect(ctx, 80, y + 16, gameWidth, 36, 8);
  ctx.fillStyle = COLORS.primaryDim;
  ctx.fill();
  ctx.strokeStyle = 'rgba(30, 200, 217, 0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = COLORS.primary;
  ctx.fillText(gameText, 96, y + 42);

  y += 100;

  // Divider line
  const divGrad = ctx.createLinearGradient(80, y, STORY_WIDTH - 80, y);
  divGrad.addColorStop(0, COLORS.primary);
  divGrad.addColorStop(0.5, 'rgba(30, 200, 217, 0.3)');
  divGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, y);
  ctx.lineTo(STORY_WIDTH - 80, y);
  ctx.stroke();

  y += 60;

  // Headline label
  ctx.fillStyle = COLORS.primary;
  ctx.font = 'bold 22px Rajdhani, sans-serif';
  ctx.fillText(data.headline.toUpperCase(), 80, y);

  y += 20;

  // Headline value (BIG)
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 120px Rajdhani, sans-serif';
  ctx.fillText(data.headlineValue, 80, y + 100);

  y += 150;

  // Tier badge
  if (data.tier) {
    roundRect(ctx, 80, y, 300, 56, 12);
    ctx.fillStyle = 'rgba(230, 154, 26, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(230, 154, 26, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = COLORS.accent;
    ctx.font = 'bold 24px Rajdhani, sans-serif';
    ctx.fillText(`⚡ ${data.tier.toUpperCase()}`, 104, y + 38);
    y += 90;
  }

  // Metrics cards
  const cardWidth = (STORY_WIDTH - 200) / Math.min(data.metrics.length, 3);
  data.metrics.forEach((metric, i) => {
    const cx = 80 + i * (cardWidth + 20);
    roundRect(ctx, cx, y, cardWidth, 160, 16);
    ctx.fillStyle = COLORS.cardBg;
    ctx.fill();
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Metric value
    ctx.fillStyle = COLORS.primary;
    ctx.font = 'bold 48px Rajdhani, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(metric.value, cx + cardWidth / 2, y + 75);

    // Metric label
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = '500 18px Inter, sans-serif';
    ctx.fillText(metric.label, cx + cardWidth / 2, y + 110);

    ctx.textAlign = 'left';
  });

  y += 200;

  // Badges (if advanced and available)
  if (data.isAdvanced && data.badges && data.badges.length > 0) {
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = 'bold 18px Rajdhani, sans-serif';
    ctx.fillText('EARNED BADGES', 80, y);
    y += 30;

    data.badges.slice(0, 4).forEach((badge, i) => {
      const bx = 80 + i * 220;
      roundRect(ctx, bx, y, 200, 44, 10);
      ctx.fillStyle = COLORS.primaryDim;
      ctx.fill();
      ctx.fillStyle = COLORS.primary;
      ctx.font = '600 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badge, bx + 100, y + 28);
      ctx.textAlign = 'left';
    });

    y += 80;
  }

  // Animated badge overlay indicator (advanced only)
  if (data.isAdvanced) {
    const glowGrad = ctx.createRadialGradient(STORY_WIDTH - 160, y - 40, 10, STORY_WIDTH - 160, y - 40, 80);
    glowGrad.addColorStop(0, 'rgba(30, 200, 217, 0.2)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(STORY_WIDTH - 240, y - 120, 160, 160);

    ctx.fillStyle = COLORS.primary;
    ctx.font = 'bold 16px Rajdhani, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('★ ADVANCED STATS', STORY_WIDTH - 80, y - 40);
    ctx.textAlign = 'left';
  }

  // Bottom section - Footer
  const footerY = STORY_HEIGHT - 280;

  // Divider
  const footDivGrad = ctx.createLinearGradient(80, footerY, STORY_WIDTH - 80, footerY);
  footDivGrad.addColorStop(0, 'transparent');
  footDivGrad.addColorStop(0.5, 'rgba(30, 200, 217, 0.2)');
  footDivGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = footDivGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, footerY);
  ctx.lineTo(STORY_WIDTH - 80, footerY);
  ctx.stroke();

  // Caption suggestion
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '400 20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Training execution across games', STORY_WIDTH / 2, footerY + 50);

  // Link
  roundRect(ctx, STORY_WIDTH / 2 - 160, footerY + 80, 320, 52, 12);
  ctx.fillStyle = 'rgba(30, 200, 217, 0.08)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(30, 200, 217, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = COLORS.primary;
  ctx.font = 'bold 22px Rajdhani, sans-serif';
  ctx.fillText('Train here →', STORY_WIDTH / 2, footerY + 114);

  // Built in Second Nature footer
  ctx.fillStyle = COLORS.textMuted;
  ctx.font = '400 18px Inter, sans-serif';
  ctx.fillText('Built in Second Nature', STORY_WIDTH / 2, footerY + 180);

  // Hashtag
  ctx.fillStyle = 'rgba(30, 200, 217, 0.4)';
  ctx.font = '400 16px Inter, sans-serif';
  ctx.fillText('#SecondNatureTraining  #EsportsPractice  #ExecutionOverLuck', STORY_WIDTH / 2, footerY + 210);

  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

export function downloadStoryImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function shareToInstagramStory(dataUrl: string) {
  // On mobile, try Instagram deep link
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    // Instagram Stories deep link
    window.open(
      `instagram-stories://share?source_application=secondnature`,
      '_blank'
    );
  }
}

export const SUGGESTED_CAPTION =
  'Training execution across games with @SecondNature. Reps build patterns.';

export const SUGGESTED_HASHTAGS =
  '#SecondNatureTraining #EsportsPractice #ExecutionOverLuck';
