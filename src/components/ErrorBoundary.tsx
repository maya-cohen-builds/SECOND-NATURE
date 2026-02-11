import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  onError?: (message: string) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error.message);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20 max-w-lg mx-auto my-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-display font-bold text-foreground text-lg mb-1">Something went wrong</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                If this keeps happening, try resetting the flow or reporting the issue.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset this flow
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(this.state.error?.stack || this.state.error?.message || 'Unknown error')}
                >
                  Report issue (copy)
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
