import React, { useRef, useEffect, useState } from 'react';
import { TimelineData, VideoClip, AudioClip, TextClip, StickerClip } from '../types';

interface PreviewEngineProps {
  timeline: TimelineData;
  currentTime: number;
  playing: boolean;
  onEnded: () => void;
  format: '9:16' | '16:9' | '1:1' | '4:5';
}

export function PreviewEngine({ timeline, currentTime, playing, format }: PreviewEngineProps) {
  // Collect all visible/active clips at the current time
  const activeVideoClips = timeline.tracks
     .filter(t => !t.hidden && t.type === 'video')
     .flatMap(t => t.clips as VideoClip[])
     .filter(c => currentTime >= c.timelineStartMs && currentTime < c.timelineEndMs);

  const activeAudioClips = timeline.tracks
     .filter(t => !t.muted && (t.type === 'audio' || t.type === 'video'))
     .flatMap(t => t.clips as (AudioClip | VideoClip)[])
     .filter(c => currentTime >= c.timelineStartMs && currentTime < c.timelineEndMs && !c.muted && c.volume > 0);

  const activeTextClips = timeline.tracks
     .filter(t => !t.hidden && t.type === 'text')
     .flatMap(t => t.clips as TextClip[])
     .filter(c => currentTime >= c.timelineStartMs && currentTime < c.timelineEndMs);

  const activeStickerClips = timeline.tracks
     .filter(t => !t.hidden && t.type === 'sticker')
     .flatMap(t => t.clips as StickerClip[])
     .filter(c => currentTime >= c.timelineStartMs && currentTime < c.timelineEndMs);

  const [mediaDataUrls, setMediaDataUrls] = useState<Record<string, string>>({});
  const api = typeof window !== 'undefined' ? window.electronAPI : undefined;

  // Load media files into ObjectURLs
  useEffect(() => {
     if (!api) return;
     const newPaths = new Set<string>();
     timeline.tracks.forEach(t => t.clips.forEach(c => {
        if (c.sourcePath && !mediaDataUrls[c.sourcePath]) {
           newPaths.add(c.sourcePath);
        }
     }));

     newPaths.forEach(path => {
        api.readVideoAsDataUrl(path).then((res: {success: boolean, dataUrl?: string}) => {
           if (res.success && res.dataUrl) {
              setMediaDataUrls(prev => ({...prev, [path]: res.dataUrl!}));
           }
        });
     });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline, api]);

  const aspectRatio = format === '9:16' ? '9/16' :
                      format === '1:1'  ? '1/1' :
                      format === '4:5'  ? '4/5' : '16/9';

  return (
    <div className="w-full h-full relative bg-black shadow-2xl overflow-hidden" style={{ aspectRatio }}>

       {/* Render Videos */}
       {activeVideoClips.map(clip => {
           // Calculate current time within the clip
           const offsetMs = currentTime - clip.timelineStartMs;
           const mediaTimeMs = (clip.mediaStartMs || 0) + (offsetMs * clip.speed);
           const mediaTimeSec = mediaTimeMs / 1000;

           const filter = `brightness(${1 + (clip.colorFilter?.brightness || 0)}) ` +
                          `contrast(${1 + (clip.colorFilter?.contrast || 0)}) ` +
                          `saturate(${1 + (clip.colorFilter?.saturation || 0)}) ` +
                          `hue-rotate(${clip.colorFilter?.hue || 0}deg)`;

           const transform = `translate(-50%, -50%) ` +
                             `scale(${clip.scale || 1}) ` +
                             `rotate(${clip.rotation || 0}deg) ` +
                             (clip.flipH ? 'scaleX(-1) ' : '') +
                             (clip.flipV ? 'scaleY(-1) ' : '');

           return (
             <VideoElement
                key={clip.id}
                src={mediaDataUrls[clip.sourcePath || '']}
                time={mediaTimeSec}
                playing={playing}
                speed={clip.speed}
                volume={clip.muted ? 0 : clip.volume}
                style={{
                   position: 'absolute',
                   left: `${clip.x ?? 50}%`,
                   top: `${clip.y ?? 50}%`,
                   transform,
                   filter,
                   width: '100%',
                   height: '100%',
                   objectFit: 'cover'
                }}
             />
           );
       })}

       {/* Invisible Audio Elements */}
       {activeAudioClips.map(clip => {
           const offsetMs = currentTime - clip.timelineStartMs;
           const mediaTimeMs = (clip.mediaStartMs || 0) + (offsetMs * clip.speed);
           return (
              <AudioElement
                 key={clip.id}
                 src={mediaDataUrls[clip.sourcePath || '']}
                 time={mediaTimeMs / 1000}
                 playing={playing}
                 speed={clip.speed}
                 volume={clip.volume}
              />
           );
       })}

       {/* Text Overlays */}
       {activeTextClips.map(l => (
          <div
            key={l.id}
            className="absolute pointer-events-none"
            style={{
              left: `${l.x}%`, top: `${l.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${l.fontSize / 10}cqw`,
              color: l.color,
              backgroundColor: l.bgColor === 'transparent' ? 'transparent' : l.bgColor,
              fontFamily: l.fontFamily,
              fontWeight: l.bold ? 'bold' : 'normal',
              fontStyle: l.italic ? 'italic' : 'normal',
              textAlign: l.align,
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              maxWidth: '90%',
              whiteSpace: 'pre-wrap',
              padding: l.bgColor !== 'transparent' ? '4px 8px' : '0',
              borderRadius: l.bgColor !== 'transparent' ? '4px' : '0',
              zIndex: 50
            }}
          >
            {l.text}
          </div>
        ))}

        {/* Sticker Overlays */}
        {activeStickerClips.map(stk => (
          <div
            key={stk.id}
            className="absolute pointer-events-none"
            style={{
              left: `${stk.x}%`, top: `${stk.y}%`,
              transform: `translate(-50%, -50%) scale(${stk.scale})`,
              width: '30%',
              zIndex: 40
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={stk.src} alt="Sticker" className="w-full h-auto object-contain drop-shadow-2xl" />
          </div>
        ))}

    </div>
  );
}

interface MediaProps {
    src: string;
    time: number;
    playing: boolean;
    speed: number;
    volume: number;
    style?: React.CSSProperties;
}

// Separate component to manage video playback safely
function VideoElement({ src, time, playing, speed, volume, style }: MediaProps) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!ref.current || !src) return;
        ref.current.src = src;
    }, [src]);

    useEffect(() => {
        if (!ref.current) return;
        if (Math.abs(ref.current.currentTime - time) > 0.3) {
            ref.current.currentTime = time;
        }
        ref.current.playbackRate = speed;
        ref.current.volume = volume;

        if (playing) {
            ref.current.play().catch(() => {});
        } else {
            ref.current.pause();
        }
    }, [time, playing, speed, volume]);

    return <video ref={ref} style={style} muted={volume === 0} playsInline />;
}

// Separate component for Audio
function AudioElement({ src, time, playing, speed, volume }: MediaProps) {
    const ref = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!ref.current || !src) return;
        ref.current.src = src;
    }, [src]);

    useEffect(() => {
        if (!ref.current) return;
        if (Math.abs(ref.current.currentTime - time) > 0.3) {
            ref.current.currentTime = time;
        }
        ref.current.playbackRate = speed;
        ref.current.volume = volume;

        if (playing) {
            ref.current.play().catch(() => {});
        } else {
            ref.current.pause();
        }
    }, [time, playing, speed, volume]);

    return <audio ref={ref} />;
}
