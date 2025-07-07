import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  title: string;
  message: string;
  type?: 'error' | 'validation';
}

export function ErrorDisplay({ title, message }: ErrorDisplayProps) {
  return (
    <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <span className="font-medium text-destructive">{title}</span>
      </div>
      <p className="text-sm text-destructive">
        {message}
      </p>
    </div>
  );
} 