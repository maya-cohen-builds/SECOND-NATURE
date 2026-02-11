import { cn } from '@/lib/utils';

interface TerrainCardProps {
  image: string;
  title: string;
  subtitle?: string;
  description: string;
  detail?: string;
  index?: number;
  className?: string;
}

export function TerrainCard({ image, title, subtitle, description, detail, index = 0, className }: TerrainCardProps) {
  const delay = index * 0.4;

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-glow",
        className
      )}
      style={{
        animation: `terrainFloat 4s ease-in-out ${delay}s infinite`,
      }}
    >
      {/* Terrain image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        {subtitle && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-display font-bold uppercase tracking-wider bg-primary/20 text-primary backdrop-blur-sm border border-primary/20">
            {subtitle}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 relative">
        <h3 className="font-display font-bold text-foreground text-sm mb-1.5">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        {detail && (
          <p className="text-[11px] text-primary/70 mt-2 leading-relaxed">{detail}</p>
        )}
      </div>

      {/* Glass edge glow */}
      <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: 'inset 0 0 30px hsl(185 72% 48% / 0.08)',
        }}
      />
    </div>
  );
}

export function TerrainStatCard({ image, stat, label, description, index = 0 }: {
  image: string;
  stat: string;
  label: string;
  description: string;
  index?: number;
}) {
  const delay = index * 0.5;

  return (
    <div
      className="group relative rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm text-center transition-all duration-500 hover:border-primary/40 hover:shadow-glow"
      style={{
        animation: `terrainFloat 4.5s ease-in-out ${delay}s infinite`,
      }}
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={image}
          alt={label}
          className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-card/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-4xl font-bold text-primary drop-shadow-lg">{stat}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="font-display font-semibold text-foreground text-sm">{label}</p>
        <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
      </div>
    </div>
  );
}

export function TerrainStepCard({ image, step, title, description, index = 0 }: {
  image: string;
  step: string;
  title: string;
  description: string;
  index?: number;
}) {
  const delay = index * 0.6;

  return (
    <div
      className="group relative rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-glow"
      style={{
        animation: `terrainFloat 5s ease-in-out ${delay}s infinite`,
      }}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className="font-display text-3xl font-bold text-primary/80">{step}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
