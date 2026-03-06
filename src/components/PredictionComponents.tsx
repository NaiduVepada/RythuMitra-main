"use client";

import { useState } from 'react';
import { Card } from './ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImageAnalysisUpload } from './ImageAnalysisUpload';

interface Prediction {
  label: string;
  confidence: number;
  description?: string;
  treatment?: string;
}

interface AnalysisResult {
  predictions: Prediction[];
  imageUrl: string;
}

export function DiseasePrediction() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { t } = useLanguage();

  const handleImageUpload = async (file: File) => {
    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    // Send to your API endpoint
    const response = await fetch('/api/predict/disease', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="space-y-4">
      <ImageAnalysisUpload onUpload={handleImageUpload} type="disease" />
      
      {result && (
        <Card className="p-4">
          <div className="flex gap-4">
            <img
              src={result.imageUrl}
              alt="Analyzed plant"
              className="w-32 h-32 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{result.predictions[0]?.label}</h3>
              <p className="text-sm text-muted-foreground">
                {t('analysis.confidence')}: {(result.predictions[0]?.confidence * 100).toFixed(1)}%
              </p>
              {result.predictions[0]?.description && (
                <p className="mt-2 text-sm">{result.predictions[0].description}</p>
              )}
              {result.predictions[0]?.treatment && (
                <div className="mt-2">
                  <h4 className="text-sm font-semibold">{t('analysis.treatment')}:</h4>
                  <p className="text-sm">{result.predictions[0].treatment}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export function PestPrediction() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { t } = useLanguage();

  const handleImageUpload = async (file: File) => {
    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    // Send to your API endpoint
    const response = await fetch('/api/predict/pest', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="space-y-4">
      <ImageAnalysisUpload onUpload={handleImageUpload} type="pest" />
      
      {result && (
        <Card className="p-4">
          <div className="flex gap-4">
            <img
              src={result.imageUrl}
              alt="Analyzed pest"
              className="w-32 h-32 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{result.predictions[0]?.label}</h3>
              <p className="text-sm text-muted-foreground">
                {t('analysis.confidence')}: {(result.predictions[0]?.confidence * 100).toFixed(1)}%
              </p>
              {result.predictions[0]?.description && (
                <p className="mt-2 text-sm">{result.predictions[0].description}</p>
              )}
              {result.predictions[0]?.treatment && (
                <div className="mt-2">
                  <h4 className="text-sm font-semibold">{t('analysis.treatment')}:</h4>
                  <p className="text-sm">{result.predictions[0].treatment}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}