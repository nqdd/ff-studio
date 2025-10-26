import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';

const IMAGE_FORMATS = ['JPEG', 'PNG', 'WebP', 'GIF', 'BMP', 'TIFF'];
const VIDEO_FORMATS = ['MP4', 'WebM', 'MKV', 'AVI', 'MOV', 'FLV'];
const QUALITY_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Maximum', value: 'maximum' },
];

export function ConversionSettings() {
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [outputFormat, setOutputFormat] = useState('JPEG');
  const [quality, setQuality] = useState('high');

  const formats = mediaType === 'image' ? IMAGE_FORMATS : VIDEO_FORMATS;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Settings</CardTitle>
        <CardDescription>Configure output format and quality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Media Type Selection */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">Media Type</div>
          <div className="flex gap-3">
            {(['image', 'video'] as const).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => {
                  setMediaType(type);
                  setOutputFormat(type === 'image' ? 'JPEG' : 'MP4');
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  mediaType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {type === 'image' ? '🖼️ Image' : '🎬 Video'}
              </button>
            ))}
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">
            Output Format
          </div>
          <div className="grid grid-cols-3 gap-2">
            {formats.map((format) => (
              <button
                type="button"
                key={format}
                onClick={() => setOutputFormat(format)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  outputFormat === format
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Settings */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">Quality</div>
          <div className="grid grid-cols-4 gap-2">
            {QUALITY_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setQuality(option.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  quality === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-3 pt-4 border-t border-border">
          <label
            htmlFor="keep-original-aspect-ratio"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              id="keep-original-aspect-ratio"
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-foreground">
              Keep original aspect ratio
            </span>
          </label>
          <label
            htmlFor="remove-metadata"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              id="remove-metadata"
              type="checkbox"
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-foreground">
              Remove metadata
            </span>
          </label>
        </div>

        {/* Convert Button */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Start Conversion
        </Button>
      </CardContent>
    </Card>
  );
}
