import { useState } from 'react';
import { Download, Instagram, Lock, Share2, Copy, Check, Star } from 'lucide-react';
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
  shareToInstagramStory,
  SUGGESTED_CAPTION,
  SUGGESTED_HASHTAGS,
  type StoryData,
} from '@/lib/instagramStory';
import { getPlayerProfile } from '@/data/gameData';

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

export default function ShareToInstagram({ storyData }: ShareToInstagramProps) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);

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
    setOpen(true);
  };

  const handleDownload = () => {
    if (imageUrl) {
      downloadStoryImage(imageUrl, `secondnature-story-${Date.now()}.png`);
    }
  };

  const handleInstagramShare = () => {
    if (imageUrl) {
      shareToInstagramStory(imageUrl);
      // Always download as fallback
      handleDownload();
    }
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

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

      {/* Story Preview + Download Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Your Instagram Story</DialogTitle>
            <DialogDescription>
              Download the image and post it to your Instagram story.
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

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button onClick={handleDownload} className="flex-1 gap-2 font-display">
                  <Download className="h-4 w-4" />
                  Download Story
                </Button>
                {isMobile && (
                  <Button
                    onClick={handleInstagramShare}
                    variant="secondary"
                    className="flex-1 gap-2 font-display"
                  >
                    <Instagram className="h-4 w-4" />
                    Open Instagram
                  </Button>
                )}
              </div>

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

              {/* Tappable link reminder */}
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
