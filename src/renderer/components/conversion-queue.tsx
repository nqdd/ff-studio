import { cn } from '../lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

const MOCK_CONVERSIONS = [
  {
    id: 1,
    name: 'vacation-photo.jpg',
    format: 'PNG',
    progress: 100,
    status: 'completed',
    time: '2s',
  },
  {
    id: 2,
    name: 'presentation.mp4',
    format: 'WebM',
    progress: 65,
    status: 'converting',
    time: '1m 23s',
  },
  {
    id: 3,
    name: 'screenshot.png',
    format: 'JPEG',
    progress: 0,
    status: 'queued',
    time: '-',
  },
];

export function ConversionQueue() {
  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle>Conversion Queue</CardTitle>
        <CardDescription>3 files in queue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {MOCK_CONVERSIONS.map((item) => (
          <div
            key={item.id}
            className="space-y-2 p-3 bg-secondary/50 rounded-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">→ {item.format}</p>
              </div>
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-1 rounded whitespace-nowrap',
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                  item.status === 'completed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                    : '',
                  item.status === 'converting'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : '',
                )}
              >
                {item.status === 'completed' ? '✓ Done' : ''}
                {item.status === 'converting' ? '⟳ Converting' : ''}
                {item.status === 'queued' ? '⏳ Queued' : ''}
              </span>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.progress}%</span>
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-3 border-t border-border space-y-2">
          <button
            type="button"
            className="w-full py-2 px-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            Clear Completed
          </button>
          <button
            type="button"
            className="w-full py-2 px-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            Cancel All
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
