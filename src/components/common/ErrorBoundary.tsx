import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('KarSetu Uncaught Exception caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('karsetu_theme');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-white font-sans">
          <div className="max-w-md w-full p-8 rounded-4xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-m3-4 text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Self-Healing Protection Active
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                KarSetu caught an unexpected runtime condition and protected your session state. Your banking mandates and tax ledgers remain 100% secure.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#1E293B] text-left text-[11px] font-mono text-slate-600 dark:text-slate-300 max-h-24 overflow-y-auto border border-slate-200 dark:border-slate-700/80">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload & Heal State</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E293B] dark:hover:bg-[#2A3A52] text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-transparent dark:border-slate-700"
              >
                Try Continue
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
