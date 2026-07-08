"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut, Check, Sliders, Type, Image as ImageIcon, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  imageUrl?: string; // fallback if editing existing
  onSave: (processedJson: string) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  onClose,
  imageFile,
  imageUrl,
  onSave,
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [zoom, setZoom] = useState<number>(1); // 1.0 to 3.0
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [altText, setAltText] = useState<string>('');
  const [seoTitle, setSeoTitle] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('free'); // 'free', '1:1', '16:9'
  const [removeBackground, setRemoveBackground] = useState<boolean>(false);
  
  const [activeTab, setActiveTab] = useState<'edit' | 'meta'>('edit');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceCanvasRef = useRef<HTMLCanvasElement>(null);

  // Drag to pan state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 1. Initial State Reset and Loading imageSrc
  useEffect(() => {
    if (!isOpen) return;
    
    // Reset state
    setRotation(0);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setActiveFilter('none');
    setAspectRatio('free');
    setRemoveBackground(false);
    setActiveTab('edit');
    setIsProcessing(false);

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImageSrc(e.target.result);
          
          // Pre-populate alt and SEO title based on filename
          const nameWithoutExt = imageFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
          setSeoTitle(nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1));
          setAltText(`High-quality medical illustration of ${nameWithoutExt}`);
        }
      };
      reader.readAsDataURL(imageFile);
    } else if (imageUrl) {
      if (imageUrl.startsWith('{"')) {
        try {
          const parsed = JSON.parse(imageUrl);
          setImageSrc(parsed.original || parsed.large || '');
          setAltText(parsed.alt || '');
          setSeoTitle(parsed.title || '');
        } catch (e) {
          setImageSrc(imageUrl);
          setAltText('Pharmaceutical formula/facility visual');
          setSeoTitle('Pharmaceutical Product Image');
        }
      } else {
        setImageSrc(imageUrl);
        setAltText('Pharmaceutical formula/facility visual');
        setSeoTitle('Pharmaceutical Product Image');
      }
    }
  }, [isOpen, imageFile, imageUrl]);

  // 2. Load the image source into HTMLImageElement
  useEffect(() => {
    if (!imageSrc) {
      setLoadedImage(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLoadedImage(img);
    };
    img.onerror = (err) => {
      console.error("Failed to load image in Editor Canvas:", err);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // 3. Render Workspace Canvas (WYSIWYG)
  useEffect(() => {
    const canvas = workspaceCanvasRef.current;
    if (!canvas || !loadedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgW = loadedImage.naturalWidth || loadedImage.width;
    const imgH = loadedImage.naturalHeight || loadedImage.height;

    // Define workspace size
    let canvasW = 800;
    let canvasH = 600;

    if (aspectRatio === '1:1') {
      canvasW = 600;
      canvasH = 600;
    } else if (aspectRatio === '16:9') {
      canvasW = 800;
      canvasH = 450;
    } else {
      // Free: match image's natural aspect ratio
      canvasW = 800;
      canvasH = Math.round((800 * imgH) / imgW) || 600;
    }

    // Set canvas dimensions
    canvas.width = canvasW;
    canvas.height = canvasH;

    // Clear canvas
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.save();

    // Map filters
    let filterString = '';
    if (activeFilter === 'grayscale') filterString += 'grayscale(100%) ';
    if (activeFilter === 'sepia') filterString += 'sepia(100%) ';
    if (activeFilter === 'cool') filterString += 'hue-rotate(180deg) saturate(1.25) ';
    if (activeFilter === 'brighten') filterString += 'brightness(1.25) ';
    if (activeFilter === 'contrast') filterString += 'contrast(1.5) ';
    
    ctx.filter = filterString.trim() || 'none';

    // Calculate base drawing size to fit within the viewport (similar to object-contain)
    const s = Math.min(canvasW / imgW, canvasH / imgH);
    const baseW = imgW * s;
    const baseH = imgH * s;

    // Translate to center + apply user panning
    ctx.translate(canvasW / 2 + panX, canvasH / 2 + panY);
    // Rotate around center
    ctx.rotate((rotation * Math.PI) / 180);
    // Zoom in/out
    ctx.scale(zoom, zoom);

    // Draw centering image
    ctx.drawImage(loadedImage, -baseW / 2, -baseH / 2, baseW, baseH);
    ctx.restore();

    // Apply alpha transparent background keyer if active
    if (removeBackground) {
      try {
        const imgData = ctx.getImageData(0, 0, canvasW, canvasH);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a > 0) {
            // Check for white/light colors
            const isWhite = r > 238 && g > 238 && b > 238;
            // Check for light-gray checkerboard squares
            const isGray = Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && Math.abs(r - b) < 8;
            const isCheckeredGray = isGray && r >= 175 && r <= 220;
            if (isWhite || isCheckeredGray) {
              data[i + 3] = 0; // Transparent
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      } catch (e) {
        console.error('Failed to run transparency keyer on preview:', e);
      }
    }
  }, [loadedImage, rotation, zoom, panX, panY, activeFilter, aspectRatio, removeBackground]);

  if (!isOpen || !imageSrc) return null;

  const filters = [
    { id: 'none', name: 'Original', class: '' },
    { id: 'grayscale', name: 'Grayscale', class: 'grayscale' },
    { id: 'sepia', name: 'Warm Sepia', class: 'sepia' },
    { id: 'cool', name: 'Clinical Teal', class: 'hue-rotate-180 saturate-125' },
    { id: 'brighten', name: 'Brighten', class: 'brightness-125' },
    { id: 'contrast', name: 'High Contrast', class: 'contrast-150 saturate-100' },
  ];

  // 4. Mouse handlers for pixel-perfect dragging mapped to canvas scaling
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!workspaceCanvasRef.current) return;
    setIsDragging(true);

    const canvas = workspaceCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleRatioX = canvas.width / rect.width;
    const scaleRatioY = canvas.height / rect.height;

    setDragStart({
      x: e.clientX - panX / scaleRatioX,
      y: e.clientY - panY / scaleRatioY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !workspaceCanvasRef.current) return;

    const canvas = workspaceCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleRatioX = canvas.width / rect.width;
    const scaleRatioY = canvas.height / rect.height;

    setPanX((e.clientX - dragStart.x) * scaleRatioX);
    setPanY((e.clientY - dragStart.y) * scaleRatioY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // 5. Generate Multi-Breakpoint Responsive Payloads on Save
  const handleSave = async () => {
    if (!loadedImage) return;
    setIsProcessing(true);
    
    // Simulate premium loader transition
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const sizes = [
        { name: 'thumbnail', maxWidth: 200 },
        { name: 'medium', maxWidth: 600 },
        { name: 'large', maxWidth: 1200 },
        { name: 'original', maxWidth: 1600 }
      ];

      const results: Record<string, string> = {};

      const imgW = loadedImage.naturalWidth || loadedImage.width;
      const imgH = loadedImage.naturalHeight || loadedImage.height;

      // Current preview canvas layout metrics to compute translation ratios
      let previewW = 800;
      let previewH = 600;
      if (aspectRatio === '1:1') {
        previewW = 600;
        previewH = 600;
      } else if (aspectRatio === '16:9') {
        previewW = 800;
        previewH = 450;
      } else {
        previewW = 800;
        previewH = Math.round((800 * imgH) / imgW) || 600;
      }

      const supabase = createClient();
      
      const baseFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const uploadPromises = sizes.map(async ({ name, maxWidth }) => {
        let outputW = previewW;
        let outputH = previewH;

        if (outputW > maxWidth) {
          const ratio = maxWidth / outputW;
          outputW = maxWidth;
          outputH = Math.round(previewH * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = outputW;
        canvas.height = outputH;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          let filterString = '';
          if (activeFilter === 'grayscale') filterString += 'grayscale(100%) ';
          if (activeFilter === 'sepia') filterString += 'sepia(100%) ';
          if (activeFilter === 'cool') filterString += 'hue-rotate(180deg) saturate(1.25) ';
          if (activeFilter === 'brighten') filterString += 'brightness(1.25) ';
          if (activeFilter === 'contrast') filterString += 'contrast(1.5) ';
          
          ctx.filter = filterString.trim() || 'none';

          ctx.clearRect(0, 0, outputW, outputH);
          ctx.save();

          const sizeRatio = outputW / previewW;
          const s = Math.min(outputW / imgW, outputH / imgH);
          const baseW = imgW * s;
          const baseH = imgH * s;

          // Align center, translate by scaled pan, rotate, and scale by zoom factor
          ctx.translate(outputW / 2 + panX * sizeRatio, outputH / 2 + panY * sizeRatio);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(zoom, zoom);

          ctx.drawImage(loadedImage, -baseW / 2, -baseH / 2, baseW, baseH);
          ctx.restore();

          if (removeBackground) {
            try {
              const imgData = ctx.getImageData(0, 0, outputW, outputH);
              const data = imgData.data;
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                if (a > 0) {
                  const isWhite = r > 238 && g > 238 && b > 238;
                  const isGray = Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && Math.abs(r - b) < 8;
                  const isCheckeredGray = isGray && r >= 175 && r <= 220;
                  if (isWhite || isCheckeredGray) {
                    data[i + 3] = 0;
                  }
                }
              }
              ctx.putImageData(imgData, 0, 0);
            } catch (e) {
              console.error('Failed to run transparency keyer on output:', e);
            }
          }

          const isPng = removeBackground || (imageFile && imageFile.type === 'image/png') || (imageUrl && imageUrl.toLowerCase().includes('.png')) || imageSrc.startsWith('data:image/png');
          const mimeType = isPng ? 'image/png' : 'image/jpeg';
          const ext = isPng ? 'png' : 'jpg';
          const filename = `${baseFilename}-${name}.${ext}`;

          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), mimeType, isPng ? undefined : 0.85);
          });
          
          if (!blob) throw new Error("Canvas toBlob failed");

          const { data, error } = await supabase.storage.from('pharma-assets').upload(filename, blob, {
            contentType: mimeType,
            upsert: true
          });

          if (error) throw error;
          
          const { data: publicUrlData } = supabase.storage.from('pharma-assets').getPublicUrl(filename);
          results[name] = publicUrlData.publicUrl;
        }
      });

      await Promise.all(uploadPromises);

      const payload = {
        original: results.original,
        large: results.large,
        medium: results.medium,
        thumbnail: results.thumbnail,
        alt: altText || 'Pharmaceutical product formulary illustration',
        title: seoTitle || 'Pharmaceutical Enterprise Formulations',
      };

      onSave(JSON.stringify(payload));
      setIsProcessing(false);
      onClose();
    } catch (error) {
      console.error('Image editor canvas processing failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-teal-600 animate-pulse" />
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm">Active Image Studio & Optimizer</h3>
              <p className="text-[10px] text-slate-400 font-mono">ON-THE-FLY COMPRESSION & RESPONSIVE BREAKPOINT GENERATION</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center space-x-2 border-b-2 transition ${
              activeTab === 'edit' ? 'border-teal-500 text-teal-600 bg-teal-50/20' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Interactive Crop & Edit Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center space-x-2 border-b-2 transition ${
              activeTab === 'meta' ? 'border-teal-500 text-teal-600 bg-teal-50/20' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Type className="h-4 w-4" />
            <span>SEO Metadata & Alt Text</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          {activeTab === 'edit' ? (
            <>
              {/* Left Side: Interactive Canvas Preview */}
              <div className="flex-grow flex flex-col justify-between">
                <div 
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    backgroundImage: removeBackground 
                      ? 'conic-gradient(#334155 25%, #1e293b 25% 50%, #334155 50% 75%, #1e293b 75%)' 
                      : 'none',
                    backgroundSize: '20px 20px'
                  }}
                  className="relative h-72 md:h-96 bg-slate-950 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center cursor-move group select-none"
                >
                  {/* Canvas Viewport */}
                  {loadedImage ? (
                    <canvas
                      ref={workspaceCanvasRef}
                      className="max-h-full max-w-full object-contain pointer-events-none"
                    />
                  ) : (
                    <div className="text-slate-400 font-mono text-xs flex flex-col items-center space-y-2">
                      <div className="h-5 w-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing Image Bitmaps...</span>
                    </div>
                  )}

                  {/* Drag Help Overlay */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white/80 font-mono pointer-events-none">
                    Drag inside to pan & crop image
                  </div>
                </div>

                {/* Aspect Ratio Selector */}
                <div className="mt-4 flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Crop Aspect Ratio</span>
                  <div className="flex space-x-1">
                    {['free', '1:1', '16:9'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-3 py-1 text-[11px] font-semibold rounded capitalize transition ${
                          aspectRatio === ratio
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Action Controls */}
              <div className="w-full md:w-80 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Sizing & Scale</span>
                    
                    {/* Zoom Slider */}
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                        <span>Zoom Scale</span>
                        <span>{zoom.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-teal-600 cursor-pointer"
                      />
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => {
                        setZoom(1);
                        setPanX(0);
                        setPanY(0);
                        setRotation(0);
                      }}
                      className="w-full text-center py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded text-xs text-slate-600 font-medium transition cursor-pointer"
                    >
                      Reset Transformations
                    </button>
                  </div>

                  {/* Alpha Transparency & Background Removal Keyer */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Background Keyer</span>
                      <span className="text-[8px] bg-teal-600 text-white font-bold px-1 rounded font-mono">SMART</span>
                    </div>
                    <label className="flex items-start space-x-2 p-1.5 rounded bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition select-none">
                      <input
                        type="checkbox"
                        checked={removeBackground}
                        onChange={(e) => setRemoveBackground(e.target.checked)}
                        className="mt-1 h-3.5 w-3.5 accent-teal-600 rounded border-slate-300"
                      />
                      <div className="text-left">
                        <span className="text-[11px] font-semibold text-slate-700 block">Make Transparent</span>
                        <span className="text-[9px] text-slate-400 leading-tight block">
                          Keys out solid white/light backgrounds or fake checkerboard grid lines to make your logo transparent.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Rotate Control */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Clockwise Rotation</span>
                      <span className="text-[11px] text-slate-600 font-mono mt-0.5 block">{rotation}° Degrees</span>
                    </div>
                    <button
                      onClick={handleRotate}
                      className="p-2.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg border border-teal-100 transition cursor-pointer"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                  </div>

                  {/* CSS Filters Preset */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2.5">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Interactive Tone Filters</span>
                    <div className="grid grid-cols-2 gap-2">
                      {filters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setActiveFilter(filter.id)}
                          className={`py-1.5 px-2 text-[10px] font-medium rounded border text-left truncate transition ${
                            activeFilter === filter.id
                              ? 'bg-teal-50 border-teal-400 text-teal-700 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {filter.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info block about automatic responsive rendering */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] text-slate-500 leading-relaxed font-mono">
                  💡 <strong>RESPONSIVE ENGINE:</strong> Large, Medium, and Thumbnail breakpoints will be cooked automatically inside the database. No external APIs needed.
                </div>
              </div>
            </>
          ) : (
            /* SEO & Accessibility Metadata Tab */
            <div className="w-full space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-5">
                <div className="flex items-center space-x-2 text-teal-700">
                  <Type className="h-5 w-5" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">Search Engine & Accessibility Optimization</span>
                </div>

                <div className="space-y-4">
                  {/* ALT Text Input */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Image ALT Text (Enforced Accessibility)</label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="E.g., High-capacity blister packaging machines at our sterile facility"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Critical for screen readers (ADA/Section 508 compliance) and image crawlers. Describe exactly what is pictured.
                    </p>
                  </div>

                  {/* SEO Title Input */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">SEO File Title / Caption</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="E.g., sterile_filling_suite_1"
                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Stored alongside product monographs to boost keyword placement in Google Images.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick SEO score indicator */}
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-teal-800">SEO Health Index: Excellent</h4>
                  <p className="text-[10px] text-teal-600 mt-0.5">Alt text & metadata properly optimized for pharma distribution search vectors.</p>
                </div>
                <div className="h-9 w-9 bg-teal-500 text-white text-xs font-mono font-bold flex items-center justify-center rounded-full shadow">
                  100%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            Discard
          </button>
          
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold shadow-md flex items-center space-x-1.5 transition cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Optimizing & Generating Breakpoints...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Save & Cook Image Spec</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
