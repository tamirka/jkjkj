
import { Voice } from './types';

export const AVAILABLE_VOICES: Voice[] = [
  { name: 'Zephyr', displayName: 'Zephyr', gender: 'Female' },
  { name: 'Kore', displayName: 'Kore', gender: 'Male' },
  { name: 'Puck', displayName: 'Puck', gender: 'Male' },
  { name: 'Charon', displayName: 'Charon', gender: 'Male' },
  { name: 'Fenrir', displayName: 'Fenrir', gender: 'Male' },
];

export const DEFAULT_VOICE = AVAILABLE_VOICES[0].name;

export const DEFAULT_TEXT = 'Hello! I am an AI-powered voice. You can type any text here and I will read it aloud for you.';
