import mascotImage from '@/assets/mascot-warrior.png';
import Mascot3D from './Mascot3D';

export default function MascotComparison() {
  return (
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-md flex items-center justify-center">
      <div className="max-w-lg w-full mx-4">
        <h2 className="font-display text-lg font-bold text-foreground text-center mb-1">
          Mascot Translation — Side by Side
        </h2>
        <p className="text-xs text-muted-foreground text-center mb-6">
          Same character, different dimension. Hover the 3D version to see parallax.
        </p>

        <div className="flex items-center justify-center gap-10">
          {/* 2D Current */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full border-2 border-accent/60 overflow-hidden bg-card shadow-lg">
              <img
                src={mascotImage}
                alt="2D mascot (current)"
                className="w-full h-full object-cover object-top scale-125"
              />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              2D — Current
            </span>
          </div>

          {/* Divider */}
          <div className="h-24 w-px bg-border" />

          {/* 3D Proposed */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full border-2 border-accent/60 overflow-hidden bg-card shadow-lg">
              <Mascot3D size={80} />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              3D — Proposed
            </span>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-8">
          The 3D version uses the identical source image rendered on a lit plane with subtle breathing and mouse-driven parallax. No silhouette, color, or proportion changes.
        </p>
      </div>
    </div>
  );
}
