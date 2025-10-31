
import React, { useState, useEffect } from 'react';
import { createWavBlob, decode } from '../utils/audioUtils';

interface AudioPlayerProps {
  base64AudioData: string | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ base64AudioData }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    if (base64AudioData) {
      try {
        const pcmData = decode(base64AudioData);
        // The API returns 24kHz mono audio.
        const wavBlob = createWavBlob(pcmData, 24000, 1);
        objectUrl = URL.createObjectURL(wavBlob);
        setAudioUrl(objectUrl);
      } catch (error) {
        console.error("Failed to process audio data:", error);
        setAudioUrl(null);
      }
    } else {
      setAudioUrl(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [base64AudioData]);

  if (!audioUrl) {
    return null;
  }

  return (
    <div className="w-full mt-6 animate-fade-in">
        <audio controls src={audioUrl} className="w-full h-12 rounded-lg bg-base-100 shadow-inner">
            Your browser does not support the audio element.
        </audio>
    </div>
  );
};

export default AudioPlayer;
