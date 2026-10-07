import React, { useState, useEffect, useRef } from 'react';
import {
  X, Camera, RefreshCw, Sparkles, Sliders, Check, Download,
  Volume2, ShieldCheck, ShoppingBag, ArrowLeft, FlipHorizontal,
  RotateCcw, Eye, AlertCircle, User
} from 'lucide-react';
import type { Product } from '../types/index.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  allProducts?: Product[];
  onSelectProduct?: (prod: Product) => void;
  onOpenCheckoutWithItem?: (prod: Product, qty: number) => void;
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  isOpen,
  onClose,
  product: initialProduct,
  allProducts = [],
  onSelectProduct,
  onOpenCheckoutWithItem,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const [activeProduct, setActiveProduct] = useState<Product>(initialProduct);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState(true);
  const [useSamplePortrait, setUseSamplePortrait] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);

  // AR Overlay Transformation States
  // Necklaces default: Y ~ 68%, scale ~ 100%
  // Earrings default: Y ~ 42%, spacing ~ 28%
  const [scale, setScale] = useState(100);
  const [posY, setPosY] = useState(68);
  const [posX, setPosX] = useState(50);
  const [earringSpacing, setEarringSpacing] = useState(26);
  const [earringPosY, setEarringPosY] = useState(42);
  const [opacity, setOpacity] = useState(95);

  // Snapshot capture state
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [addedToCartNotice, setAddedToCartNotice] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);

  // Update active product when modal opens or initialProduct changes
  useEffect(() => {
    setActiveProduct(initialProduct);
  }, [initialProduct]);

  // Adjust default positions when switching category
  useEffect(() => {
    const cat = activeProduct.category.toLowerCase();
    if (cat.includes('earring') || cat.includes('jhumka')) {
      setScale(95);
      setPosY(42);
    } else if (cat.includes('rani') || cat.includes('long')) {
      setScale(110);
      setPosY(72);
    } else {
      setScale(100);
      setPosY(67);
      setPosX(50);
    }
  }, [activeProduct]);

  // Start or Stop Camera when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPhotoUrl(null);
      return;
    }

    if (!useSamplePortrait) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, useSamplePortrait]);

  const startCamera = async () => {
    setIsLoadingCamera(true);
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera video capture is not supported in this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      let message = 'Unable to access your device camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Camera permission was denied. Please allow camera access in your browser settings to try on jewellery.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'No video camera detected on your system.';
      }
      setCameraError(message);
      // Fallback automatically to studio mannequin portrait so user isn't stuck
      setUseSamplePortrait(true);
    } finally {
      setIsLoadingCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  if (!isOpen) return null;

  const categoryLower = activeProduct.category.toLowerCase();
  const isEarringsOnly = (categoryLower.includes('earring') || categoryLower.includes('jhumka')) && !categoryLower.includes('set');
  const isNecklaceOnly = (categoryLower.includes('necklace') || categoryLower.includes('choker') || categoryLower.includes('rani')) && !categoryLower.includes('set');
  const isBridalSet = categoryLower.includes('set');

  // Handle Dragging overlay directly on screen
  const handleDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!overlayContainerRef.current) return;
    const rect = overlayContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setPosX(Math.max(15, Math.min(85, x)));
    setPosY(Math.max(20, Math.min(90, y)));
  };

  const handleCaptureSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 720;
    canvas.height = 720;

    // Draw background (either video frame or sample portrait)
    if (!useSamplePortrait && video && video.readyState >= 2) {
      ctx.save();
      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else {
      // Draw rich luxury portrait background
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient backdrop
      const grad = ctx.createRadialGradient(360, 360, 50, 360, 360, 400);
      grad.addColorStop(0, '#3A332A');
      grad.addColorStop(1, '#1A1815');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stylized silhouette guide
      ctx.fillStyle = '#E2D5C0';
      ctx.beginPath();
      ctx.arc(360, 240, 110, 0, Math.PI * 2);
      ctx.fill();

      // Neck and shoulders
      ctx.beginPath();
      ctx.moveTo(310, 340);
      ctx.lineTo(220, 560);
      ctx.lineTo(500, 560);
      ctx.lineTo(410, 340);
      ctx.closePath();
      ctx.fill();
    }

    // Now draw jewellery overlay onto canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeProduct.images[0];
    img.onload = () => {
      ctx.save();
      ctx.globalAlpha = opacity / 100;

      const baseWidth = (canvas.width * 0.52 * scale) / 100;
      const aspect = img.height / (img.width || 1);
      const baseHeight = baseWidth * aspect;

      const drawX = (canvas.width * posX) / 100 - baseWidth / 2;
      const drawY = (canvas.height * posY) / 100 - baseHeight / 2;

      ctx.drawImage(img, drawX, drawY, baseWidth, baseHeight);

      // Draw watermark and details
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px "Cormorant Garamond", Georgia, serif';
      ctx.fillText('MEGHNA JEWELLERY', 30, canvas.height - 45);
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#D6C7A8';
      ctx.fillText(`${activeProduct.name} · BIS 916 Laser Hallmarked`, 30, canvas.height - 25);

      ctx.restore();
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedPhotoUrl(dataUrl);
    };
  };

  const handleDownloadSnapshot = () => {
    if (!capturedPhotoUrl) return;
    const a = document.createElement('a');
    a.href = capturedPhotoUrl;
    a.download = `Meghna-Jewellery-TryOn-${activeProduct.id}.jpg`;
    a.click();
  };

  const handleAddToCart = () => {
    addToCart(activeProduct, 1);
    setAddedToCartNotice(true);
    setTimeout(() => setAddedToCartNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#171513] text-[#FAF8F5] w-full max-w-4xl rounded-sm shadow-2xl border border-[#3D352B] overflow-hidden my-4 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 py-4 bg-[#211E1A] border-b border-[#363026] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2C2720] border border-[#524634] flex items-center justify-center text-[#C9A24D]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-medium text-[#F5EFE6]">
                  Virtual Vanity Mirror
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#3A3326] text-[#D6C49E] px-2 py-0.5 rounded border border-[#544834]">
                  AR Preview
                </span>
              </div>
              <p className="text-xs text-[#9E907B]">
                Inspect real-time scale, collar drape, and heirloom aesthetic on your frame
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMirrored(!isMirrored)}
              className={`p-2 rounded transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                isMirrored ? 'bg-[#3A3326] text-[#C9A24D]' : 'bg-[#29241E] text-[#8C7D6B] hover:text-[#F5EFE6]'
              }`}
              title="Flip camera mirror"
            >
              <FlipHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Mirror View</span>
            </button>

            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-1.5 text-[#9E907B] hover:text-[#FAF8F5] hover:bg-[#2C2720] rounded transition-colors cursor-pointer"
              aria-label="Close mirror"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Grid: Mirror Camera Viewport (Left) & AR Fine-Tuning Controls (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          {/* Viewport Area */}
          <div className="md:col-span-7 bg-black p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[460px]">
            {/* Live Camera Video / Mannequin Container */}
            <div
              ref={overlayContainerRef}
              onMouseDown={handleDrag}
              onTouchMove={handleDrag}
              className="relative w-full max-w-[420px] aspect-square bg-[#1E1B18] rounded-sm overflow-hidden border border-[#42392D] shadow-2xl select-none"
            >
              {capturedPhotoUrl ? (
                /* Snapshot Preview */
                <div className="relative w-full h-full">
                  <img
                    src={capturedPhotoUrl}
                    alt="Captured look"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-[#FAF8F5] px-2.5 py-1 rounded text-xs flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#C9A24D]" />
                    <span>Portrait Saved</span>
                  </div>
                </div>
              ) : useSamplePortrait ? (
                /* Studio Mannequin Silhouette Background */
                <div className="w-full h-full bg-gradient-to-b from-[#2A241D] to-[#141210] flex flex-col items-center justify-center relative">
                  {/* Subtle portrait bust contour */}
                  <div className="w-40 h-48 rounded-full bg-[#3B3328]/40 border border-[#544837]/30 flex items-center justify-center -mt-10">
                    <User className="w-20 h-20 text-[#6B5C47]/40" />
                  </div>
                  <div className="w-64 h-36 bg-[#3B3328]/30 rounded-t-full -mt-6 border-t border-[#544837]/30" />

                  <div className="absolute top-3 left-3 bg-black/75 px-2.5 py-1 rounded text-[11px] text-[#C9A24D] border border-[#524430] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Studio Silhouette Mode</span>
                  </div>
                </div>
              ) : (
                /* Live Camera Feed */
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''}`}
                  />
                  {isLoadingCamera && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 text-xs text-[#C9A24D]">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span>Opening camera feed...</span>
                    </div>
                  )}
                </>
              )}

              {/* OVERLAY: The Jewellery Piece (Necklace / Earrings) */}
              {!capturedPhotoUrl && (
                <>
                  {/* 1. Necklace / Choker Overlay */}
                  {(isNecklaceOnly || isBridalSet) && (
                    <div
                      className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 select-none"
                      style={{
                        left: `${posX}%`,
                        top: `${posY}%`,
                        width: `${(scale * 0.58).toFixed(1)}%`,
                        opacity: opacity / 100,
                        filter: 'drop-shadow(0 8px 14px rgba(0, 0, 0, 0.65))',
                      }}
                    >
                      <img
                        src={activeProduct.images[0] || '/images/product_temple_choker.jpg'}
                        alt={activeProduct.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/product_temple_choker.jpg';
                        }}
                        className="w-full h-auto object-contain pointer-events-none"
                      />
                    </div>
                  )}

                  {/* 2. Earrings / Jhumkas Overlays (Paired symmetrically) */}
                  {(isEarringsOnly || isBridalSet) && (
                    <>
                      {/* Left Earring */}
                      <div
                        className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                        style={{
                          left: `${50 - earringSpacing}%`,
                          top: `${earringPosY}%`,
                          width: `${(scale * 0.18).toFixed(1)}%`,
                          opacity: opacity / 100,
                          filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.7))',
                        }}
                      >
                        <img
                          src={activeProduct.images[0] || '/images/product_emerald_jhumkas.jpg'}
                          alt={`${activeProduct.name} Left`}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/product_emerald_jhumkas.jpg';
                          }}
                          className="w-full h-auto object-contain pointer-events-none scale-x-[-1]"
                        />
                      </div>

                      {/* Right Earring */}
                      <div
                        className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                        style={{
                          left: `${50 + earringSpacing}%`,
                          top: `${earringPosY}%`,
                          width: `${(scale * 0.18).toFixed(1)}%`,
                          opacity: opacity / 100,
                          filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.7))',
                        }}
                      >
                        <img
                          src={activeProduct.images[0] || '/images/product_emerald_jhumkas.jpg'}
                          alt={`${activeProduct.name} Right`}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/product_emerald_jhumkas.jpg';
                          }}
                          className="w-full h-auto object-contain pointer-events-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Positioning Guidance Box / Drag helper indicator */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-[#A69986] bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded border border-[#3D3529] pointer-events-none">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-[#C9A24D]" />
                      <span>Drag anywhere to position</span>
                    </span>
                    <span className="font-mono text-[10px] text-[#D4C3A3]">{scale}% Scale</span>
                  </div>
                </>
              )}
            </div>

            {/* Hidden canvas for capturing composited snapshots */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Viewport Action Bar */}
            <div className="flex items-center gap-3 mt-4">
              {capturedPhotoUrl ? (
                <>
                  <button
                    onClick={() => setCapturedPhotoUrl(null)}
                    className="px-4 py-2 bg-[#2E2821] hover:bg-[#3D352C] text-[#FAF8F5] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#4A3F31]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Photo</span>
                  </button>

                  <button
                    onClick={handleDownloadSnapshot}
                    className="px-5 py-2 bg-[#98702B] hover:bg-[#AD8133] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Look</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCaptureSnapshot}
                    className="px-5 py-2 bg-[#98702B] hover:bg-[#AD8133] text-white rounded text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md tracking-wider uppercase"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Snapshot</span>
                  </button>

                  <button
                    onClick={() => {
                      if (useSamplePortrait) {
                        setUseSamplePortrait(false);
                        startCamera();
                      } else {
                        stopCamera();
                        setUseSamplePortrait(true);
                      }
                    }}
                    className="px-3.5 py-2 bg-[#29241E] hover:bg-[#363028] text-[#C4B59D] rounded text-xs font-medium border border-[#42392D] transition-colors cursor-pointer"
                  >
                    {useSamplePortrait ? 'Switch to Live Camera' : 'Use Studio Bust'}
                  </button>
                </>
              )}
            </div>

            {cameraError && !capturedPhotoUrl && (
              <div className="mt-3 text-[11px] text-[#E0A96D] max-w-sm text-center flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#C9A24D]" />
                <span>Camera unavailable: Previewing with Studio Mannequin</span>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Fit Controls & Catalog Quick-Switcher */}
          <div className="md:col-span-5 p-5 sm:p-6 bg-[#1C1916] border-t md:border-t-0 md:border-l border-[#363028] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Product Info Banner */}
              <div className="border-b border-[#302B24] pb-4">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#C9A24D]">
                  {activeProduct.category} · {activeProduct.purity.split(' ')[0]}
                </div>
                <h4 className="font-serif text-lg text-[#F5EFE6] font-medium leading-snug mt-0.5">
                  {activeProduct.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="font-mono text-base font-bold text-[#E6D5B8]">
                    {formatPrice(activeProduct.price)}
                  </span>
                  {activeProduct.originalPrice && (
                    <span className="font-mono text-xs text-[#7D705E] line-through">
                      {formatPrice(activeProduct.originalPrice)}
                    </span>
                  )}
                  {activeProduct.offerBadge && (
                    <span className="text-[10px] text-[#55A874] font-semibold bg-[#1C3324] px-1.5 py-0.2 rounded border border-[#2B5439]">
                      {activeProduct.offerBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* AR Position & Scale Sliders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#D1C2A5] font-medium">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#C9A24D]" />
                    <span>Fit & Size Adjustment</span>
                  </span>
                  <button
                    onClick={() => {
                      setScale(100);
                      setPosY(isEarringsOnly ? 42 : 68);
                      setPosX(50);
                      setEarringSpacing(26);
                      setOpacity(95);
                    }}
                    className="text-[11px] text-[#A69986] hover:text-[#FAF8F5] underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                {/* Scale Slider */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#8C7E6C] mb-1">
                    <span>Jewellery Scale</span>
                    <span className="font-mono text-[#D6C49E]">{scale}%</span>
                  </div>
                  <input
                    type="range"
                    min="55"
                    max="150"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full accent-[#C9A24D] cursor-pointer"
                  />
                </div>

                {/* Vertical Position */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#8C7E6C] mb-1">
                    <span>Vertical Neckline Height</span>
                    <span className="font-mono text-[#D6C49E]">{posY}%</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="85"
                    value={posY}
                    onChange={(e) => setPosY(Number(e.target.value))}
                    className="w-full accent-[#C9A24D] cursor-pointer"
                  />
                </div>

                {/* Horizontal Position */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#8C7E6C] mb-1">
                    <span>Horizontal Center</span>
                    <span className="font-mono text-[#D6C49E]">{posX}%</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="75"
                    value={posX}
                    onChange={(e) => setPosX(Number(e.target.value))}
                    className="w-full accent-[#C9A24D] cursor-pointer"
                  />
                </div>

                {/* Earring Spacing (if earrings or set) */}
                {(isEarringsOnly || isBridalSet) && (
                  <div>
                    <div className="flex justify-between text-[11px] text-[#8C7E6C] mb-1">
                      <span>Ear Lobe Spacing</span>
                      <span className="font-mono text-[#D6C49E]">{earringSpacing}%</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="40"
                      value={earringSpacing}
                      onChange={(e) => setEarringSpacing(Number(e.target.value))}
                      className="w-full accent-[#C9A24D] cursor-pointer"
                    />
                  </div>
                )}

                {/* Opacity / Lighting blend */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#8C7E6C] mb-1">
                    <span>Lighting Blend (Opacity)</span>
                    <span className="font-mono text-[#D6C49E]">{opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-[#C9A24D] cursor-pointer"
                  />
                </div>
              </div>

              {/* Try other pieces carousel */}
              {allProducts.length > 1 && (
                <div className="pt-3 border-t border-[#302B24]">
                  <div className="text-[11px] uppercase tracking-wider text-[#A69986] font-semibold mb-2">
                    Try on other vault heirlooms:
                  </div>
                  <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                    {allProducts
                      .filter((p) => p.id !== activeProduct.id)
                      .slice(0, 6)
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActiveProduct(p);
                            onSelectProduct?.(p);
                          }}
                          className="shrink-0 w-16 h-16 rounded bg-[#241F1A] border border-[#3E362A] hover:border-[#C9A24D] overflow-hidden transition-colors cursor-pointer relative group"
                          title={p.name}
                        >
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-3.5 h-3.5 text-white" />
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Add to Bag & Buy Now */}
            <div className="space-y-2.5 pt-4 border-t border-[#302B24]">
              <div className="flex items-center gap-2 text-[11px] text-[#9E907B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24D]" />
                <span>Complimentary Insured Armored Courier Delivery</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="py-2.5 px-3 bg-[#26211C] hover:bg-[#342D26] border border-[#4A3E2F] text-[#FAF8F5] rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {addedToCartNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C9A24D]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    stopCamera();
                    onClose();
                    onOpenCheckoutWithItem?.(activeProduct, 1);
                  }}
                  className="py-2.5 px-3 bg-[#98702B] hover:bg-[#AD8133] text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
