import { useState } from 'react';
import { Download, Lock, Share2, Copy, Check, Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  generateStoryImage,
  downloadStoryImage,
  SUGGESTED_CAPTION,
  SUGGESTED_HASHTAGS,
  type StoryData,
} from '@/lib/instagramStory';
import { getPlayerProfile } from '@/data/gameData';
import { trackEvent } from '@/lib/eventTracker';

interface ShareToInstagramProps {
  storyData: StoryData;
}

const UNLOCK_DRILLS_THRESHOLD = 10;
const TOKEN_COST = 5;
const ADVANCED_UNLOCK_KEY = 'sn-advanced-share-unlocked';

function isAdvancedUnlocked(): boolean {
  try {
    return localStorage.getItem(ADVANCED_UNLOCK_KEY) === 'true';
  } catch {
    return false;
  }
}

function unlockAdvanced() {
  localStorage.setItem(ADVANCED_UNLOCK_KEY, 'true');
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

export default function ShareToInstagram({ storyData }: ShareToInstagramProps) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [shareState, setShareState] = useState<'idle' | 'shared' | 'confirmed'>('idle');

  const profile = getPlayerProfile();
  const advancedUnlocked = isAdvancedUnlocked();
  const canUnlockByDrills = profile.completedScenarios >= UNLOCK_DRILLS_THRESHOLD;

  const handleShare = (useAdvanced: boolean) => {
    const data: StoryData = {
      ...storyData,
      isAdvanced: useAdvanced && advancedUnlocked,
    };
    const url = generateStoryImage(data);
    setImageUrl(url);
    setShareState('idle');
    setOpen(true);
  };

  const handleDownload = () => {
    if (imageUrl) {
      downloadStoryImage(imageUrl, `secondnature-story-${Date.now()}.png`);
    }
  };

  const handleShareToInstagram = async () => {
    if (!imageUrl) return;

    trackEvent('share_intent_started', { page: storyData.headline });

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Try Web Share API with file first (best mobile experience)
    if (navigator.share && isMobile) {
      try {
        const blob = await dataUrlToBlob(imageUrl);
        const file = new File([blob], 'secondnature-story.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Second Nature Training Stats',
            text: `${SUGGESTED_CAPTION}\n${SUGGESTED_HASHTAGS}`,
          });
          setShareState('shared');
          return;
        }
      } catch (err: unknown) {
        // User cancelled or share failed
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    // Fallback: try Instagram Stories deep link on mobile
    if (isMobile) {
      try {
        window.location.href = 'instagram-stories://share?source_application=secondnature';
        // Also download the image so they can attach it
        handleDownload();
        setShareState('shared');
        return;
      } catch {
        // Deep link failed
      }
    }

    // Final fallback: download + open Instagram web
    trackEvent('share_failed', { reason: 'no_native_share', page: storyData.headline });
    handleDownload();
    window.open('https://www.instagram.com/', '_blank');
    setShareState('shared');
  };

  const handleConfirmPosted = () => {
    trackEvent('share_confirmed', { page: storyData.headline });
    setShareState('confirmed');
    setTimeout(() => {
      setOpen(false);
      setShareState('idle');
    }, 1500);
  };

  const handleCopy = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleUnlockWithTokens = () => {
    try {
      const raw = localStorage.getItem('sn-squad-tokens');
      const tokens = raw ? JSON.parse(raw) : 0;
      if (tokens >= TOKEN_COST) {
        localStorage.setItem('sn-squad-tokens', JSON.stringify(tokens - TOKEN_COST));
        unlockAdvanced();
        setShowUnlockPrompt(false);
        handleShare(true);
      }
    } catch {}
  };

  const handleUnlockByDrills = () => {
    if (canUnlockByDrills) {
      unlockAdvanced();
      setShowUnlockPrompt(false);
      handleShare(true);
    }
  };

  const currentTokens = (() => {
    try {
      const raw = localStorage.getItem('sn-squad-tokens');
      return raw ? JSON.parse(raw) : 0;
    } catch {
      return 0;
    }
  })();

  return (
    <>
      {/* Share buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleShare(false)}
          className="gap-1.5 font-display"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share Story
        </Button>

        {advancedUnlocked ? (
          <Button
            size="sm"
            onClick={() => handleShare(true)}
            className="gap-1.5 font-display bg-gradient-to-r from-primary to-[hsl(200,80%,40%)]"
          >
            <Star className="h-3.5 w-3.5" />
            Advanced Story
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUnlockPrompt(true)}
            className="gap-1.5 font-display text-muted-foreground"
          >
            <Lock className="h-3 w-3" />
            Advanced
          </Button>
        )}
      </div>

      {/* Unlock Dialog */}
      <Dialog open={showUnlockPrompt} onOpenChange={setShowUnlockPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Unlock Advanced Story</DialogTitle>
            <DialogDescription>
              Advanced stories include animated badge overlay, extra metrics, and premium branding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <button
              onClick={handleUnlockByDrills}
              disabled={!canUnlockByDrills}
              className={`w-full p-4 rounded-lg border text-left transition-colors ${
                canUnlockByDrills
                  ? 'bg-primary/5 border-primary/30 hover:bg-primary/10 cursor-pointer'
                  : 'bg-secondary border-border opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-display font-semibold text-sm text-foreground">Complete 10 Drills</p>
                {canUnlockByDrills ? (
                  <span className="text-xs text-primary font-medium">✓ Ready</span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {profile.completedScenarios}/{UNLOCK_DRILLS_THRESHOLD}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {canUnlockByDrills
                  ? 'Click to unlock permanently.'
                  : `Complete ${UNLOCK_DRILLS_THRESHOLD - profile.completedScenarios} more drills to unlock.`}
              </p>
            </button>

            <button
              onClick={handleUnlockWithTokens}
              disabled={currentTokens < TOKEN_COST}
              className={`w-full p-4 rounded-lg border text-left transition-colors ${
                currentTokens >= TOKEN_COST
                  ? 'bg-accent/5 border-accent/30 hover:bg-accent/10 cursor-pointer'
                  : 'bg-secondary border-border opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-display font-semibold text-sm text-foreground">Spend {TOKEN_COST} Tokens</p>
                <span className={`text-xs font-medium ${currentTokens >= TOKEN_COST ? 'text-accent' : 'text-muted-foreground'}`}>
                  {currentTokens} available
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentTokens >= TOKEN_COST
                  ? 'Click to unlock permanently.'
                  : `Earn ${TOKEN_COST - currentTokens} more tokens through training.`}
              </p>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Story Preview + Share Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Your Instagram Story</DialogTitle>
            <DialogDescription>
              Share your training stats directly to Instagram.
            </DialogDescription>
          </DialogHeader>

          {imageUrl && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="rounded-lg overflow-hidden border border-border bg-card">
                <img
                  src={imageUrl}
                  alt="Instagram Story Preview"
                  className="w-full h-auto"
                />
              </div>

              {/* Confirmation state */}
              {shareState === 'shared' && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center space-y-2">
                  <p className="text-sm text-foreground font-medium">
                    Opened Instagram. Tap "Your Story" to post.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleConfirmPosted}
                    className="gap-1.5 font-display"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    I posted it
                  </Button>
                </div>
              )}

              {shareState === 'confirmed' && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
                  <p className="text-sm text-primary font-semibold flex items-center justify-center gap-1.5">
                    <Check className="h-4 w-4" /> Shared successfully!
                  </p>
                </div>
              )}

              {/* Action buttons */}
              {shareState === 'idle' && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleShareToInstagram}
                    className="flex-1 gap-2 font-display"
                  >
                    <Share2 className="h-4 w-4" />
                    Share to Instagram
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    size="icon"
                    title="Download image"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Caption */}
              <div className="p-3 rounded-lg bg-secondary border border-border">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground font-medium">Suggested Caption</p>
                  <button
                    onClick={() => handleCopy(SUGGESTED_CAPTION, setCopiedCaption)}
                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                  >
                    {copiedCaption ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedCaption ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-foreground">{SUGGESTED_CAPTION}</p>
              </div>

              {/* Hashtags */}
              <div className="p-3 rounded-lg bg-secondary border border-border">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground font-medium">Suggested Hashtags</p>
                  <button
                    onClick={() => handleCopy(SUGGESTED_HASHTAGS, setCopiedTags)}
                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                  >
                    {copiedTags ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedTags ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-foreground">{SUGGESTED_HASHTAGS}</p>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Add a "Train here" link sticker pointing to your Second Nature profile.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
