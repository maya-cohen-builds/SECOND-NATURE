import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useQA, canAccess, requiredTier } from '@/contexts/QAContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  inline?: boolean;
}

export default function FeatureGate({ feature, children, fallback, inline = false }: FeatureGateProps) {
  const { planTier } = useQA();
  const navigate = useNavigate();

  if (canAccess(feature, planTier)) {
    return <>{children}</>;
  }

  const needed = requiredTier(feature);
  const label = needed === 'team' ? 'Team' : 'Pro';

  const handleClick = () => {
    navigate(`/pricing?plan=${needed}`);
  };

  if (fallback) return <>{fallback}</>;

  if (inline) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={handleClick} className="inline-flex items-center gap-1 text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors">
            <Lock className="h-3 w-3" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Requires {label} plan. Click to upgrade.</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-40 select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-lg">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm font-display font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <Lock className="h-4 w-4 text-muted-foreground" />
          Upgrade to {label}
        </button>
      </div>
    </div>
  );
}
