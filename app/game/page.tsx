"use client";

import { useConfettiStore } from '@/hooks/use-confetti-store';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const FLAG_COUNTRIES = [
    'France', 'Germany', 'Italy', 'Spain', 'Portugal', 'Belgium', 'Sweden', 'Norway', 
    'Austria', 'Switzerland', 'Greece', 'Turkey', 'Russia', 'Republic of Ireland', 'United Kingdom',
    'Malta', 'Croatia', 'Albania', 'Jamaica', 'Republic of India', 'Canada', 'United States of America',
    'Argentina', 'Peru', 'Chile', 'Japan', 'Syria', 'Saudi Arabia', 'Korea', 'North Korea', 'Brazil',
    'South Africa', 'Algeria', 'Morocco', 'Tunisia', 'China', 'Colombia', 'Ecuador', 'Paraguay', 
    'Vietnam', 'Mexico', 'Egypt', 'Sri Lanka', 'Cambodia', 'Thailand'  
];

const fetchFlag = async (countryName: string) => {
    const response = await fetch(`/api/flags?countryName=${countryName}`);
    if (response.ok) {
        return response.url;
    }
    throw new Error('Failed to fetch flag');
};

const FlagGame = () => {
    const [currentFlag, setCurrentFlag] = useState<string | null>(null);
    const [currentCountry, setCurrentCountry] = useState<string | null>(null);
    const [usedFlags, setUsedFlags] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [timeTaken, setTimeTaken] = useState<number | null>(null);
    
    const confetti = useConfettiStore();

    useEffect(() => {
        if (usedFlags.length === FLAG_COUNTRIES.length) {
            setEndTime(new Date());
        }
    }, [usedFlags]);

    useEffect(() => {
        if (startTime && endTime) {
            setTimeTaken((endTime.getTime() - startTime.getTime()) / 1000);
            confetti.onOpen(); 
            toast.success("BRAVO ALIXE !", {
                duration: 3000,
                position: 'bottom-center'
            });
        }
    }, [endTime]);

    const generateRandomFlag = async () => {
        if (usedFlags.length === FLAG_COUNTRIES.length) return;

        const availableFlags = FLAG_COUNTRIES.filter(flag => !usedFlags.includes(flag));
        const randomFlag = availableFlags[Math.floor(Math.random() * availableFlags.length)];

        try {
            const flagUrl = await fetchFlag(randomFlag);
            setCurrentFlag(flagUrl);
            setCurrentCountry(randomFlag.toUpperCase());
            setUsedFlags([...usedFlags, randomFlag]);
            if (!startTime) {
                setStartTime(new Date());
            }
        } catch (error) {
            console.error('Error fetching flag:', error);
        }
    };

    const restartGame = () => {
        setCurrentFlag(null);
        setCurrentCountry(null);
        setUsedFlags([]);
        setStartTime(null);
        setEndTime(null);
        setTimeTaken(null);
        confetti.onClose();
    };

    return (
        <div className="flex flex-col text-center items-center min-h-screen py-2 px-3 bg-slate-800 pt-20">
            <h1 className="text-4xl uppercase font-bold mb-4 text-white">Jeu des drapeaux</h1>
            {currentFlag ? (
                <>
                    <p className="text-lg text-white">
                        {currentCountry}
                    </p>
                    <p className="text-lg text-white">
                        {usedFlags.length} / {FLAG_COUNTRIES.length}
                    </p>
                    <button 
                        onClick={generateRandomFlag} 
                        className="px-4 py-2 mt-10 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:scale-125 duration-500 mb-4"
                    >
                        Drapeau suivant
                    </button>
                    <div className="flex flex-col items-center">
                        <div className='w-full px-4 sm:w-[350px] h-auto mt-10'>
                            <img 
                                src={currentFlag} 
                                alt="Current Flag"
                                className="w-full h-full mb-4 shadow-md rounded-lg object-cover" 
                            />
                        </div>
                    </div>
                </>
            ) : (
                <button 
                    onClick={generateRandomFlag} 
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-4"
                >
                    Démarrer le jeu
                </button>
            )}
            {timeTaken !== null && (
                <div className="text-center">
                    <p className="text-lg font-semibold text-green-700">Jeu terminé !</p>
                    <p className="text-lg text-green-700">Temps : {timeTaken.toFixed(2)} secondes</p>
                </div>
            )}
            <button 
                onClick={restartGame} 
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-4"
            >
                Rejouer
            </button>
        </div>
    );
};

export default FlagGame;