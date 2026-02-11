import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DrillErrorCardProps {
  message?: string;
}

export default function DrillErrorCard({ message }: DrillErrorCardProps) {
  const navigate = useNavigate();

  return (
    <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20 max-w-lg mx-auto">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
        <div>
          <h3 className="font-display font-bold text-foreground mb-1">Drill payload is invalid</h3>
          <p className="text-sm text-muted-foreground mb-1">
            {message || 'The drill configuration is missing or contains invalid data.'}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            This may be a bug. You can copy this info and report it, or reset the flow.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                localStorage.removeItem('stg-last-result');
                navigate('/training-hub');
              }}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset this flow
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigator.clipboard.writeText(`Drill Error: ${message || 'Invalid payload'}\nRoute: ${window.location.pathname}\nTime: ${new Date().toISOString()}`)}
            >
              Report issue (copy)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
