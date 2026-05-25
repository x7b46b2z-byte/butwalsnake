'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Camera, AlertTriangle, ShieldCheck, Zap, Loader2, ChevronRight, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import Link from 'next/link';

type DangerLevel = 'HIGHLY VENOMOUS' | 'MILDLY VENOMOUS' | 'NON-VENOMOUS' | 'UNKNOWN';

type SnakeResult = {
  identified: boolean;
  name: string;
  scientificName: string;
  dangerLevel: DangerLevel;
  dangerScore: number; // 0-10
  description: string;
  firstAidSteps: string[];
  doNots: string[];
  localPresence: string;
  confidence: string;
};

const dangerConfig: Record<DangerLevel, { color: string; bg: string; border: string; icon: typeof AlertTriangle }> = {
  'HIGHLY VENOMOUS': { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40', icon: AlertTriangle },
  'MILDLY VENOMOUS': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40', icon: Zap },
  'NON-VENOMOUS': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', icon: ShieldCheck },
  'UNKNOWN': { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/40', icon: ShieldCheck },
};

export default function AIIdentifierPage() {
  const [dragOver, setDragOver] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SnakeResult | null>(null);
  const [error, setError] = useState('');
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [aiConfigMessage, setAiConfigMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/ai-identify')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.enabled === 'boolean') {
          setAiConfigured(data.enabled);
          if (!data.enabled) {
            setAiConfigMessage('AI identifier is not configured. Set GEMINI_API_KEY in your environment.');
          }
        } else {
          setAiConfigured(false);
          setAiConfigMessage('Unable to verify AI configuration.');
        }
      })
      .catch(() => {
        setAiConfigured(false);
        setAiConfigMessage('Unable to verify AI configuration.');
      });
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please upload an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB.'); return; }
    setError('');
    setResult(null);
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile) return;
    if (aiConfigured === false) {
      setError('AI identifier is not configured. Set GEMINI_API_KEY in your environment.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const base64 = await fileToBase64(imageFile);
      const res = await fetch('/api/ai-identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: imageFile.type }),
      });
      const data = await res.json();
      if (data.success) setResult(data.result);
      else setError(data.error || 'Analysis failed.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImageFile(null); setImagePreview(null); setResult(null); setError(''); };

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });

  return (
    <div className="min-h-screen bg-[#0a1512]">
      <Navbar />

      {/* Hero */}
      <div className="py-20 px-4 text-center border-b border-white/5 bg-gradient-to-b from-emerald-950/30 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(46,204,113,0.08),transparent_60%)]" />
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-5 py-2 mb-5">
            <span className="text-emerald-400 text-xl">🤖</span>
            <span className="text-emerald-400 text-sm font-bold tracking-wider uppercase">AI-Powered</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 font-poppins">
            Snake <span className="text-emerald-400">Identifier</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Upload a clear photo of a snake. Our AI will instantly identify the species, assess the danger level, and provide life-saving first aid steps.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Powered by Google Gemini</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-500" /> Results in ~5 seconds</span>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left: Upload */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              Upload Snake Photo
            </h2>

            {!imagePreview ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                  dragOver
                    ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]'
                    : 'border-white/10 bg-white/3 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                }`}
              >
                <div className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/30">
                  <Camera className="w-9 h-9 text-emerald-400" />
                </div>
                <p className="text-white font-semibold text-lg mb-2">Drop your photo here</p>
                <p className="text-gray-500 text-sm mb-4">or click to browse — JPG, PNG, WEBP up to 10MB</p>
                <div className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                  <Upload className="w-4 h-4" /> Choose Photo
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-white/10 group">
                <img src={imagePreview} alt="Snake preview" className="w-full max-h-96 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={reset} className="bg-red-500/80 text-white rounded-full p-3 hover:bg-red-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-mono">
                  {imageFile?.name}
                </div>
              </div>
            )}

            {(error || aiConfigMessage) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 bg-red-500/15 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                {error || aiConfigMessage}
              </motion.div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!imageFile || loading || aiConfigured === false}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-base"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><span>🔍</span> Identify Snake</>}
              </button>
              {imagePreview && (
                <button onClick={reset} className="bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-2xl px-5 transition-colors">
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-white/3 border border-white/5 rounded-2xl space-y-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">📸 Tips for best results</p>
              {['Take a clear, well-lit photo', 'Capture the full body if possible', 'Include distinctive markings', 'Keep a safe distance — never approach'].map(tip => (
                <div key={tip} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🧬</span> Analysis Results
            </h2>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-12 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                  <p className="text-white font-semibold">AI is analyzing your image...</p>
                  <p className="text-gray-500 text-sm">Powered by Google Gemini Vision</p>
                  <div className="flex justify-center gap-2 pt-2">
                    {['Detecting species...', 'Assessing venom...', 'Preparing first aid...'].map((s, i) => (
                      <motion.span key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.8 }}
                        className="text-xs text-emerald-400/60 bg-emerald-500/10 px-2 py-1 rounded-full">
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  {/* Species Header */}
                  <div className={`rounded-2xl border p-5 ${dangerConfig[result.dangerLevel].bg} ${dangerConfig[result.dangerLevel].border}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{result.name}</h3>
                        <p className="text-gray-400 text-sm italic">{result.scientificName}</p>
                      </div>
                      <span className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border ${dangerConfig[result.dangerLevel].bg} ${dangerConfig[result.dangerLevel].color} ${dangerConfig[result.dangerLevel].border}`}>
                        {result.dangerLevel}
                      </span>
                    </div>

                    {/* Danger bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>Danger Level</span>
                        <span className={dangerConfig[result.dangerLevel].color}>{result.dangerScore}/10</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.dangerScore * 10}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${result.dangerScore >= 7 ? 'bg-red-500' : result.dangerScore >= 4 ? 'bg-orange-400' : 'bg-emerald-500'}`}
                        />
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed">{result.description}</p>
                    <p className="text-xs text-gray-500 mt-2">AI Confidence: <span className="text-gray-300 font-medium">{result.confidence}</span> · Local Presence: <span className="text-gray-300 font-medium">{result.localPresence}</span></p>
                  </div>

                  {/* First Aid Steps */}
                  {result.firstAidSteps.length > 0 && (
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                      <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> First Aid Steps</h4>
                      <ol className="space-y-2">
                        {result.firstAidSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Do NOTs */}
                  {result.doNots.length > 0 && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                      <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Do NOT</h4>
                      <ul className="space-y-2">
                        {result.doNots.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                            <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Emergency CTA */}
                  {(result.dangerLevel === 'HIGHLY VENOMOUS' || result.dangerLevel === 'MILDLY VENOMOUS') && (
                    <Link href="/emergency" className="flex items-center justify-between bg-red-600 hover:bg-red-700 text-white px-5 py-4 rounded-2xl transition-colors group">
                      <span className="font-bold">🚨 Report Emergency Sighting</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-3xl border border-white/5 bg-white/2 p-12 text-center space-y-4">
                  <div className="text-6xl">🐍</div>
                  <p className="text-gray-400">Upload a snake photo and click <span className="text-emerald-400 font-semibold">Identify Snake</span> to see results here.</p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {['Indian Cobra', 'Common Krait', 'Rat Snake'].map(s => (
                      <div key={s} className="bg-white/5 rounded-xl p-3 text-xs text-gray-500 text-center border border-white/5">{s}</div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">Common snakes found in Rupandehi District</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-semibold text-sm mb-1">⚠️ Important Disclaimer</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              This AI tool is for educational purposes and initial guidance only. <strong className="text-white">Always treat any snakebite as a medical emergency.</strong> Call our 24/7 rescue team immediately and proceed to the nearest hospital. Do not rely solely on AI identification for life-threatening situations.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}
