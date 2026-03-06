"use client";

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ImageAnalysisUploadProps {
  onUpload: (file: File) => Promise<void>;
  type: 'disease' | 'pest';
}

export function ImageAnalysisUpload({ onUpload, type }: ImageAnalysisUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t('upload.error.invalidType'));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('upload.error.tooLarge'));
      return;
    }

    setIsLoading(true);
    try {
      await onUpload(file);
      toast.success(t(`upload.success.${type}`));
    } catch (error) {
      toast.error(t(`upload.error.${type}`));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg">
      <div className="flex flex-col items-center gap-2 text-center">
        <Upload className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {t(`upload.instruction.${type}`)}
        </p>
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`${type}-upload`}
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <Button
        variant="outline"
        disabled={isLoading}
        onClick={() => document.getElementById(`${type}-upload`)?.click()}
      >
        {isLoading ? t('upload.loading') : t(`upload.button.${type}`)}
      </Button>
    </div>
  );
}