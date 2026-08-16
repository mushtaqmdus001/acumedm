import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Music,
  Captions,
  Calendar,
  MessageSquare,
  Sparkles,
  X,
  Mic,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CLINIC_TOUR_SCENES, IMAGES, TourScene } from '../constants';
import { cn } from '../lib/utils';

interface ClinicVideoTourProps {
  isModal?: boolean;
  onClose?: () => void;
  onOpenAiChat?: () => void;
  initialAutoPlay?: boolean;
}

// In-memory client cache for human voice audio
const clientVoiceCache: Record<string, { audioBase64: string; mimeType: string }> = {};

export interface VoiceProfile {
  id: 'zephyr' | 'charon' | 'fenrir' | 'puck' | 'kore';
  name: string;
  desc: string;
}

export const VOICE_PROFILES: VoiceProfile[] = [
  { id: 'zephyr', name: 'Dr. Medhati (Warm & Natural)', desc: 'Friendly, relaxed doctor bedside tone' },
  { id: 'charon', name: 'Dr. Medhati (Deep & Calm)', desc: 'Soothing, grounded acoustic resonance' },
  { id: 'fenrir', name: 'Dr. Medhati (Smooth & Clear)', desc: 'Crisp, articulate clinical guidance' },
  { id: 'puck', name: 'Dr. Medhati (Engaging & Upbeat)', desc: 'Conversational, welcoming tempo' },
  { id: 'kore', name: 'Care Specialist (Gentle & Soft)', desc: 'Melodic, holistic clinic practitioner' },
];

export function ClinicVideoTour({
  isModal = false,
  onClose,
  onOpenAiChat,
  initialAutoPlay = true
}: ClinicVideoTourProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(initialAutoPlay);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [studioVoice, setStudioVoice] = useState<'zephyr' | 'charon' | 'fenrir' | 'puck' | 'kore'>('zephyr');
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthFrame, setMouthFrame] = useState<'neutral' | 'open' | 'smile'>('smile');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicOscillatorsRef = useRef<OscillatorNode[]>([]);
  const musicGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mouthIntervalRef = useRef<number | null>(null);

  const currentScene: TourScene = CLINIC_TOUR_SCENES[currentSceneIndex] || CLINIC_TOUR_SCENES[0];
  const sceneProgressPercent = Math.min(100, (elapsedTime / currentScene.duration) * 100);

  // Active subtitle text
  const activeCaption =
    currentScene.captions.slice().reverse().find((c) => elapsedTime >= c.start)?.text ||
    currentScene.captions[0]?.text ||
    '';

  // --- 1. Pre-fetch Studio Human Voice from Server API ---
  useEffect(() => {
    const prefetchVoices = async () => {
      for (const scene of CLINIC_TOUR_SCENES) {
        const cacheKey = `${scene.id}_${studioVoice}`;
        if (!clientVoiceCache[cacheKey]) {
          try {
            const res = await fetch('/api/tour-voice', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sceneId: scene.id,
                text: scene.narration,
                voiceName: studioVoice
              })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.audioBase64) {
                clientVoiceCache[cacheKey] = {
                  audioBase64: data.audioBase64,
                  mimeType: data.mimeType || 'audio/wav'
                };
              }
            }
          } catch {
            // Silently continue, Web Speech fallback is available
          }
        }
      }
    };

    prefetchVoices();
  }, [studioVoice]);

  // When voice option is changed by the user, immediately re-narrate current scene if playing
  const handleVoiceChange = (newVoice: 'zephyr' | 'charon' | 'fenrir' | 'puck' | 'kore') => {
    setStudioVoice(newVoice);
    setShowVoiceMenu(false);
    if (isPlaying && isVoiceEnabled) {
      stopVoiceNarration();
      setTimeout(() => {
        playSceneVoiceWithVoice(currentSceneIndex, newVoice);
      }, 100);
    }
  };

  // --- 2. Fallback Natural Voice Selection ---
  useEffect(() => {
    const updateVoices = () => {
      if (!('speechSynthesis' in window)) return;
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const naturalMaleVoice =
        voices.find((v) => {
          const name = v.name.toLowerCase();
          const lang = v.lang.toLowerCase();
          return (
            lang.startsWith('en') &&
            (name.includes('guy') ||
              name.includes('david') ||
              name.includes('daniel') ||
              name.includes('oliver') ||
              name.includes('arthur') ||
              name.includes('alex') ||
              name.includes('natural') ||
              name.includes('google us english'))
          );
        }) ||
        voices.find((v) => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) ||
        voices[0];

      if (naturalMaleVoice) {
        setSelectedVoice(naturalMaleVoice);
      }
    };

    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // --- 3. Calming 432Hz Zen Ambience Synthesizer ---
  const initZenAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (!musicGainRef.current && audioCtxRef.current) {
        const gain = audioCtxRef.current.createGain();
        gain.gain.setValueAtTime(0.02, audioCtxRef.current.currentTime);
        gain.connect(audioCtxRef.current.destination);
        musicGainRef.current = gain;

        const freqs = [216, 270, 324];
        musicOscillatorsRef.current = freqs.map((f) => {
          const osc = audioCtxRef.current!.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, audioCtxRef.current!.currentTime);
          osc.connect(gain);
          osc.start();
          return osc;
        });
      }
    } catch {
      // AudioContext fallback
    }
  };

  const playSoftChime = () => {
    try {
      if (!audioCtxRef.current) return;
      const chimeOsc = audioCtxRef.current.createOscillator();
      const chimeGain = audioCtxRef.current.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(528, audioCtxRef.current.currentTime);
      chimeGain.gain.setValueAtTime(0.03, audioCtxRef.current.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1.5);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(audioCtxRef.current.destination);
      chimeOsc.start();
      chimeOsc.stop(audioCtxRef.current.currentTime + 1.5);
    } catch {
      // ignore
    }
  };

  const stopZenAudio = () => {
    if (musicGainRef.current && audioCtxRef.current) {
      musicGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.2);
    }
    musicOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // ignore
      }
    });
    musicOscillatorsRef.current = [];
    musicGainRef.current = null;
  };

  // --- 4. Voice Narration System (Real Human Audio with Fallback) ---
  const stopVoiceNarration = () => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setMouthFrame('smile');
    if (mouthIntervalRef.current) {
      window.clearInterval(mouthIntervalRef.current);
      mouthIntervalRef.current = null;
    }
  };

  const startLipSyncAnimation = () => {
    if (mouthIntervalRef.current) window.clearInterval(mouthIntervalRef.current);
    const frames: ('neutral' | 'open' | 'smile')[] = [
      'open',
      'smile',
      'open',
      'neutral',
      'smile',
      'open',
      'smile'
    ];
    let frameIdx = 0;
    mouthIntervalRef.current = window.setInterval(() => {
      frameIdx = (frameIdx + 1) % frames.length;
      setMouthFrame(frames[frameIdx]);
    }, 160);
  };

  const playSceneVoiceWithVoice = async (
    sceneIndex: number,
    voiceToUse: 'zephyr' | 'charon' | 'fenrir' | 'puck' | 'kore' = studioVoice
  ) => {
    stopVoiceNarration();

    if (!isVoiceEnabled || !isPlaying) return;

    const scene = CLINIC_TOUR_SCENES[sceneIndex];
    if (!scene) return;

    const cacheKey = `${scene.id}_${voiceToUse}`;
    let audioData = clientVoiceCache[cacheKey];

    if (!audioData) {
      try {
        const res = await fetch('/api/tour-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sceneId: scene.id,
            text: scene.narration,
            voiceName: voiceToUse
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.audioBase64) {
            audioData = {
              audioBase64: data.audioBase64,
              mimeType: data.mimeType || 'audio/wav'
            };
            clientVoiceCache[cacheKey] = audioData;
          }
        }
      } catch {
        // network fallback
      }
    }

    // A. Play High-Fidelity Studio Human Audio
    if (audioData?.audioBase64) {
      try {
        const audio = new Audio(`data:${audioData.mimeType};base64,${audioData.audioBase64}`);
        currentAudioElementRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          startLipSyncAnimation();
        };

        audio.onended = () => {
          setIsSpeaking(false);
          setMouthFrame('smile');
          if (mouthIntervalRef.current) {
            window.clearInterval(mouthIntervalRef.current);
            mouthIntervalRef.current = null;
          }
        };

        audio.onerror = () => {
          fallbackSpeechSynthesis(scene.narration);
        };

        await audio.play();
        return;
      } catch {
        // Fallback to synthesis
      }
    }

    // B. Fallback to Natural Client Speech Synthesis
    fallbackSpeechSynthesis(scene.narration);
  };

  const playSceneVoice = (sceneIndex: number) => {
    return playSceneVoiceWithVoice(sceneIndex, studioVoice);
  };

  const fallbackSpeechSynthesis = (text: string) => {
    if (!('speechSynthesis' in window) || !isVoiceEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    speechUtteranceRef.current = utterance;

    utterance.rate = 0.90; // Natural, unhurried cadence
    utterance.pitch = 0.98; // Grounded doctor pitch

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      startLipSyncAnimation();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setMouthFrame('smile');
      if (mouthIntervalRef.current) {
        window.clearInterval(mouthIntervalRef.current);
        mouthIntervalRef.current = null;
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setMouthFrame('smile');
      if (mouthIntervalRef.current) {
        window.clearInterval(mouthIntervalRef.current);
        mouthIntervalRef.current = null;
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // --- 5. Main Timer Progression ---
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      stopVoiceNarration();
      return;
    }

    if (isMusicEnabled) {
      initZenAudio();
    } else {
      stopZenAudio();
    }

    playSceneVoice(currentSceneIndex);
    playSoftChime();

    const interval = window.setInterval(() => {
      setElapsedTime((prev) => {
        const next = prev + 0.1;
        if (next >= currentScene.duration) {
          setCurrentSceneIndex((prevIdx) => (prevIdx + 1) % CLINIC_TOUR_SCENES.length);
          return 0;
        }
        return next;
      });
    }, 100);

    timerRef.current = interval;

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isPlaying, currentSceneIndex, isVoiceEnabled, isMusicEnabled, selectedVoice]);

  // Clean up
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      stopVoiceNarration();
      stopZenAudio();
    };
  }, []);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (!next) {
        stopVoiceNarration();
        stopZenAudio();
      }
      return next;
    });
  };

  const handleToggleVoice = () => {
    setIsVoiceEnabled((prev) => {
      const next = !prev;
      if (!next) {
        stopVoiceNarration();
      } else if (isPlaying) {
        playSceneVoice(currentSceneIndex);
      }
      return next;
    });
  };

  const handleToggleMusic = () => {
    setIsMusicEnabled((prev) => {
      const next = !prev;
      if (next && isPlaying) {
        initZenAudio();
      } else {
        stopZenAudio();
      }
      return next;
    });
  };

  const handleSelectScene = (index: number) => {
    stopVoiceNarration();
    setCurrentSceneIndex(index);
    setElapsedTime(0);
    if (isPlaying) {
      playSceneVoice(index);
      playSoftChime();
    }
  };

  const handlePrevScene = () => {
    const prev = (currentSceneIndex - 1 + CLINIC_TOUR_SCENES.length) % CLINIC_TOUR_SCENES.length;
    handleSelectScene(prev);
  };

  const handleNextScene = () => {
    const next = (currentSceneIndex + 1) % CLINIC_TOUR_SCENES.length;
    handleSelectScene(next);
  };

  const currentAvatarSrc =
    mouthFrame === 'open'
      ? IMAGES.avatarOpen
      : mouthFrame === 'smile'
      ? IMAGES.avatarSmile
      : IMAGES.aiAvatar;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-slate-950 text-white select-none overflow-hidden font-sans',
        isModal
          ? 'w-full h-full rounded-3xl'
          : 'w-full h-full rounded-[2rem] sm:rounded-[2.5rem]'
      )}
    >
      {/* 1. Cinematic Background Stage with Gentle Ken Burns Pan */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.9, ease: 'easeOut' }
          }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.6 } }}
          className="absolute inset-0 w-full h-full"
        >
          <motion.img
            src={currentScene.image}
            alt={currentScene.title}
            referrerPolicy="no-referrer"
            animate={{
              scale: isPlaying ? [1, 1.04, 1.02] : 1,
              x: isPlaying ? [0, currentSceneIndex % 2 === 0 ? 5 : -5, 0] : 0
            }}
            transition={{
              duration: currentScene.duration,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-full h-full object-cover"
          />

          {/* Clean Cinematic Gradient (Keeps Imagery Bright & Natural) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-black/30 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* 2. Top Header - Simple Badge */}
      <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 z-20 flex items-center justify-between pointer-events-auto">
        <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-medium">{currentScene.badge}</span>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 hover:bg-black/75 border border-white/15 text-white transition-all cursor-pointer"
            title="Close Tour"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Speaking Guide: Dr. Mostafa Medhati */}
      <div
        className={cn(
          'absolute z-20 pointer-events-auto transition-all',
          isModal ? 'bottom-20 sm:bottom-24 right-4 sm:right-6' : 'bottom-16 sm:bottom-20 right-3 sm:right-5'
        )}
      >
        <div className="relative group/guide flex items-center gap-2">
          {/* Subtle Name Tag */}
          <div className="hidden sm:flex flex-col items-end bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 shadow-lg">
            <span className="text-[11px] font-bold text-white leading-tight">Dr. Medhati</span>
            <span className="text-[9px] text-teal-300 font-medium leading-tight">Clinic Director</span>
          </div>

          <div className="relative flex flex-col items-center">
            {isSpeaking && (
              <span className="absolute -inset-1.5 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />
            )}

            <div
              className={cn(
                'rounded-full overflow-hidden border-2 shadow-2xl bg-teal-950 transition-all duration-300',
                isSpeaking
                  ? 'border-emerald-400 ring-2 ring-emerald-400/50 w-12 h-12 sm:w-14 sm:h-14 scale-105 shadow-emerald-500/20'
                  : 'border-white/90 w-11 h-11 sm:w-12 sm:h-12'
              )}
            >
              <img
                src={IMAGES.drMedhati}
                alt="Dr. Mostafa Medhati, L.Ac"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-sm" />
          </div>
        </div>
      </div>

      {/* 4. Center Play Button on Pause */}
      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto cursor-pointer bg-black/20 backdrop-blur-[2px]"
          onClick={handleTogglePlay}
        >
          <div className="p-4 sm:p-5 rounded-full bg-teal-600/90 hover:bg-teal-500 text-white shadow-2xl border border-white/30 backdrop-blur-md transform transition-transform hover:scale-105 active:scale-95 flex items-center justify-center">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-0.5" />
          </div>
        </motion.div>
      )}

      {/* 5. Minimalist Subtitles */}
      {showCaptions && (
        <div className="absolute bottom-16 sm:bottom-20 left-4 right-16 sm:left-6 sm:right-24 z-20 pointer-events-none flex justify-center">
          <motion.div
            key={activeCaption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="max-w-xl bg-slate-950/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-lg text-center"
          >
            <p className="text-xs sm:text-sm font-medium text-emerald-50 leading-relaxed drop-shadow-sm">
              {activeCaption}
            </p>
          </motion.div>
        </div>
      )}

      {/* 6. Unobstructed Floating Player Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-2.5 sm:p-3 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent pt-6 pointer-events-auto">
        {/* Progress Bars */}
        <div className="grid grid-cols-4 gap-1.5 mb-2.5">
          {CLINIC_TOUR_SCENES.map((scene, idx) => {
            const isPassed = idx < currentSceneIndex;
            const isCurrent = idx === currentSceneIndex;
            return (
              <button
                key={scene.id}
                onClick={() => handleSelectScene(idx)}
                className="group/track cursor-pointer py-1"
                title={scene.title}
              >
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden transition-colors group-hover/track:bg-white/40">
                  <div
                    className={cn(
                      'h-full transition-all duration-100 rounded-full',
                      isPassed ? 'w-full bg-teal-400' : isCurrent ? 'bg-emerald-400' : 'w-0'
                    )}
                    style={{
                      width: isCurrent ? `${sceneProgressPercent}%` : isPassed ? '100%' : '0%'
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleTogglePlay}
              className="w-8 h-8 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-md"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={handlePrevScene}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              title="Previous Room"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNextScene}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              title="Next Room"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Voice Toggle */}
            <button
              onClick={handleToggleVoice}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border',
                isVoiceEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              )}
              title={isVoiceEnabled ? 'Human Voice Narration On' : 'Voice Muted'}
            >
              {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px] font-medium">
                {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
              </span>
            </button>

            {/* Voice Persona Selector */}
            {isVoiceEnabled && (
              <div className="relative">
                <button
                  onClick={() => setShowVoiceMenu((p) => !p)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-teal-200 border border-white/15 transition-all cursor-pointer shadow-sm"
                  title="Switch Voice Persona"
                >
                  <Mic className="w-3 h-3 text-emerald-400" />
                  <span className="hidden md:inline text-[11px] font-medium text-emerald-100">
                    {studioVoice === 'zephyr'
                      ? 'Dr. Medhati (Warm)'
                      : studioVoice === 'charon'
                      ? 'Dr. Medhati (Deep)'
                      : studioVoice === 'fenrir'
                      ? 'Dr. Medhati (Clear)'
                      : studioVoice === 'puck'
                      ? 'Dr. Medhati (Upbeat)'
                      : 'Care Guide (Gentle)'}
                  </span>
                  <ChevronUp
                    className={cn(
                      'w-3 h-3 transition-transform duration-200 text-teal-300',
                      showVoiceMenu ? 'rotate-180' : ''
                    )}
                  />
                </button>

                {/* Voice Selection Dropdown Popover */}
                {showVoiceMenu && (
                  <div className="absolute bottom-full mb-2 left-0 w-72 bg-slate-950/95 backdrop-blur-xl border border-teal-500/30 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                    <div className="px-2 py-1 mb-1.5 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                          Doctor Voice Persona
                        </span>
                      </div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-medium border border-emerald-400/20">
                        HD Studio
                      </span>
                    </div>

                    <div className="space-y-1">
                      {VOICE_PROFILES.map((vp) => {
                        const isSel = vp.id === studioVoice;
                        return (
                          <button
                            key={vp.id}
                            onClick={() => handleVoiceChange(vp.id)}
                            className={cn(
                              'w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-all flex items-start justify-between cursor-pointer',
                              isSel
                                ? 'bg-emerald-500/20 text-white border border-emerald-400/40 shadow-sm'
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            )}
                          >
                            <div className="pr-2">
                              <div className="font-semibold text-[11px] text-white flex items-center gap-1">
                                {vp.name}
                              </div>
                              <div className="text-[10px] text-teal-300/80 leading-tight mt-0.5">
                                {vp.desc}
                              </div>
                            </div>
                            {isSel && <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Zen Music */}
            <button
              onClick={handleToggleMusic}
              className={cn(
                'p-1.5 rounded-full text-xs transition-all cursor-pointer border',
                isMusicEnabled
                  ? 'bg-teal-500/20 text-teal-300 border-teal-400/40'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              )}
              title={isMusicEnabled ? 'Zen Ambience On' : 'Zen Ambience Off'}
            >
              <Music className="w-3.5 h-3.5" />
            </button>

            {/* Captions */}
            <button
              onClick={() => setShowCaptions((p) => !p)}
              className={cn(
                'p-1.5 rounded-full text-xs transition-all cursor-pointer border',
                showCaptions
                  ? 'bg-teal-500/20 text-teal-300 border-teal-400/40'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              )}
              title={showCaptions ? 'Captions On' : 'Captions Off'}
            >
              <Captions className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenAiChat && (
              <button
                onClick={onOpenAiChat}
                className="hidden sm:inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/15 text-white px-2.5 py-1 rounded-full text-xs font-medium transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-3 h-3 text-teal-300" />
                <span>Ask Guide</span>
              </button>
            )}

            <Link
              to="/book"
              onClick={onClose}
              className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              <Calendar className="w-3 h-3" />
              <span>Book Visit</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
