import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
  Sparkles,
  FileCheck,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { convertImagesToPdf, downloadUint8Array } from '../../utils/pdfEngine';
import { ProcessedHistoryItem } from '../../types';

interface ImageToPdfToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes: number) => void;
}

export const ImageToPdfTool: React.FC<ImageToPdfToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [images, setImages] = useState<{ id: string; name: string; dataUrl: string }[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'auto'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              name: file.name,
              dataUrl: event.target!.result as string,
            },
          ]);
        }
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setImages(newImages);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfBytes = await convertImagesToPdf(images, {
        pageSize,
        orientation,
        margin,
      });

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const dataUrl = URL.createObjectURL(blob);
      const fileName = `images_converted_${Date.now()}.pdf`;

      // Trigger Celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      // Save History
      onAddHistory({
        id: Math.random().toString(36).substring(2, 9),
        title: 'Image to PDF',
        toolId: 'image-to-pdf',
        timestamp: Date.now(),
        sizeBytes: pdfBytes.length,
        dataUrl,
        fileName,
      });

      // Open Preview Modal directly
      onOpenPreview(dataUrl, fileName, pdfBytes.length);
    } catch (err) {
      console.error('Failed to convert images to PDF', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Image to PDF Converter</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Upload & Reorder Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Dropzone */}
          <div className="relative border-2 border-dashed border-red-300 dark:border-red-900/60 hover:border-red-500 rounded-2xl p-8 text-center bg-red-50/40 dark:bg-red-950/20 transition-all cursor-pointer group">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white dark:bg-slate-800 text-red-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <p className="mt-4 font-bold text-slate-900 dark:text-white">
              Drag & Drop Images here or <span className="text-red-600 underline">Browse Files</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports JPG, PNG, WEBP, GIF. Reorder or remove images anytime.
            </p>
          </div>

          {/* Uploaded Images List */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Selected Images ({images.length})</span>
                <button
                  onClick={() => setImages([])}
                  className="text-red-600 hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-2 shadow-sm flex flex-col justify-between"
                  >
                    <div className="h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative">
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                        #{index + 1}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                      {img.name}
                    </p>

                    {/* Actions Overlay */}
                    <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveImage(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                          title="Move Left/Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveImage(index, 'down')}
                          disabled={index === images.length - 1}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                          title="Move Right/Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeImage(img.id)}
                        className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950 text-red-600 transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Page Layout Settings Panel */}
        <div className="space-y-5 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-800 shadow-lg h-fit">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
            <Settings className="w-5 h-5 text-red-600" />
            <span>PDF Page Settings</span>
          </div>

          {/* Page Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Page Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['a4', 'letter', 'auto'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSize(size)}
                  className={`py-2 rounded-xl text-xs font-semibold uppercase border transition-all ${
                    pageSize === size
                      ? 'bg-red-600 text-white border-red-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Page Orientation
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['portrait', 'landscape'] as const).map((orient) => (
                <button
                  key={orient}
                  onClick={() => setOrientation(orient)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    orientation === orient
                      ? 'bg-red-600 text-white border-red-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {orient}
                </button>
              ))}
            </div>
          </div>

          {/* Margin */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Page Margin
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'None', val: 0 },
                { label: 'Small', val: 10 },
                { label: 'Big', val: 25 },
              ].map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMargin(m.val)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    margin === m.val
                      ? 'bg-red-600 text-white border-red-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            id="btn-convert-images-to-pdf"
            onClick={handleConvert}
            disabled={images.length === 0 || isProcessing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm transition-all shadow-lg shadow-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isProcessing ? (
              <span>Converting PDF...</span>
            ) : (
              <>
                <FileCheck className="w-5 h-5" />
                <span>Convert {images.length} Image{images.length === 1 ? '' : 's'} to PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
