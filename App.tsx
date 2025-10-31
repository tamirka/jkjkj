
import React, { useState, useCallback } from 'react';
import { AVAILABLE_VOICES, DEFAULT_VOICE, DEFAULT_TEXT } from './constants';
import { Voice } from './types';
import { generateSpeech } from './services/geminiService';
import AudioPlayer from './components/AudioPlayer';

const Header = () => (
    <header className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-brand-secondary text-white w-16 h-16 rounded-full mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" /><path d="M12 7a.997.997 0 0 0-1 1v8a.997.997 0 0 0 1 1c.553 0 1-.447 1-1V8c0-.553-.447-1-1-1zm5 4h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2zm-8 0H7a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2z" />
            </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-content-100 tracking-tight">AI Voice Generator</h1>
        <p className="mt-2 text-lg text-content-200 max-w-2xl mx-auto">
            Transform text into lifelike speech. Select a voice, type your message, and hit generate.
        </p>
    </header>
);

const Loader = () => (
    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
        <div className="flex items-center space-x-3">
            <svg className="animate-spin h-6 w-6 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-content-100 font-medium">Generating Audio...</span>
        </div>
    </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fade-in" role="alert">
        <p className="font-bold">Error</p>
        <p>{message}</p>
    </div>
);

const App: React.FC = () => {
    const [text, setText] = useState<string>(DEFAULT_TEXT);
    const [selectedVoice, setSelectedVoice] = useState<string>(DEFAULT_VOICE);
    const [base64Audio, setBase64Audio] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateSpeech = useCallback(async () => {
        if (!text.trim()) {
            setError("Please enter some text to generate speech.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setBase64Audio(null);

        try {
            const audioData = await generateSpeech(text, selectedVoice);
            setBase64Audio(audioData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [text, selectedVoice]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (error) setError(null);
    }
    
    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVoice(e.target.value);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-light to-base-100">
            <main className="w-full max-w-3xl mx-auto">
                <Header />
                <div className="bg-base-100 p-6 md:p-8 rounded-2xl shadow-2xl relative">
                    {isLoading && <Loader />}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                            <label htmlFor="text-input" className="block text-sm font-medium text-content-200 mb-2">Your Text</label>
                            <textarea
                                id="text-input"
                                value={text}
                                onChange={handleTextChange}
                                placeholder="Enter text to synthesize..."
                                className="w-full h-40 p-4 border border-base-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition duration-150 resize-none shadow-sm"
                                rows={6}
                            />
                        </div>

                        <div className="md:col-span-2">
                             <label htmlFor="voice-select" className="block text-sm font-medium text-content-200 mb-2">Choose a Voice</label>
                            <select 
                                id="voice-select"
                                value={selectedVoice} 
                                onChange={handleVoiceChange}
                                className="w-full h-12 px-4 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition duration-150 shadow-sm appearance-none bg-no-repeat bg-right-4"
                                style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em'}}
                            >
                                {AVAILABLE_VOICES.map((voice: Voice) => (
                                    <option key={voice.name} value={voice.name}>
                                        {voice.displayName} ({voice.gender})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-1 self-end">
                            <button
                                onClick={handleGenerateSpeech}
                                disabled={isLoading || !text.trim()}
                                className="w-full h-12 flex items-center justify-center px-6 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-200 disabled:bg-base-300 disabled:cursor-not-allowed disabled:text-content-200 disabled:shadow-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 3.5a1.5 1.5 0 011.5 1.5v3.25a3.75 3.75 0 01-7.5 0V5A1.5 1.5 0 0110 3.5z" />
                                    <path d="M4 10a1 1 0 00-1 1v1.5a6 6 0 0012 0V11a1 1 0 10-2 0v1.5a4 4 0 11-8 0V11a1 1 0 00-1-1z" />
                                </svg>
                                Generate
                            </button>
                        </div>
                    </div>

                    {error && <ErrorMessage message={error} />}

                    {base64Audio && <AudioPlayer base64AudioData={base64Audio} />}
                </div>
                <footer className="text-center mt-8 text-sm text-content-200">
                    <p>Powered by Google Gemini</p>
                </footer>
            </main>
        </div>
    );
};

export default App;
