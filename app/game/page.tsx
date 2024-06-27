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
] as const;

type Country = (typeof FLAG_COUNTRIES)[number];

const COUNTRY_TRANSLATIONS: Record<Country, string> = {
    'France': 'France',
    'Germany': 'Allemagne',
    'Italy': 'Italie',
    'Spain': 'Espagne',
    'Portugal': 'Portugal',
    'Belgium': 'Belgique',
    'Sweden': 'Suède',
    'Norway': 'Norvège',
    'Austria': 'Autriche',
    'Switzerland': 'Suisse',
    'Greece': 'Grèce',
    'Turkey': 'Turquie',
    'Russia': 'Russie',
    'Republic of Ireland': 'Irlande',
    'United Kingdom': 'Royaume-Uni',
    'Malta': 'Malte',
    'Croatia': 'Croatie',
    'Albania': 'Albanie',
    'Jamaica': 'Jamaïque',
    'Republic of India': 'Inde',
    'Canada': 'Canada',
    'United States of America': 'États-Unis d\'Amérique',
    'Argentina': 'Argentine',
    'Peru': 'Pérou',
    'Chile': 'Chili',
    'Japan': 'Japon',
    'Syria': 'Syrie',
    'Saudi Arabia': 'Arabie Saoudite',
    'Korea': 'Corée du Sud',
    'North Korea': 'Corée du Nord',
    'Brazil': 'Brésil',
    'South Africa': 'Afrique du Sud',
    'Algeria': 'Algérie',
    'Morocco': 'Maroc',
    'Tunisia': 'Tunisie',
    'China': 'Chine',
    'Colombia': 'Colombie',
    'Ecuador': 'Équateur',
    'Paraguay': 'Paraguay',
    'Vietnam': 'Vietnam',
    'Mexico': 'Mexique',
    'Egypt': 'Égypte',
    'Sri Lanka': 'Sri Lanka',
    'Cambodia': 'Cambodge',
    'Thailand': 'Thaïlande'
};

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
    const [showCountry, setShowCountry] = useState<boolean>(false);
    const [showNotice, setShowNotice] = useState<boolean>(true);
    
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
            setCurrentCountry(COUNTRY_TRANSLATIONS[randomFlag]);
            setUsedFlags([...usedFlags, randomFlag]);
            setShowCountry(false);

            if (!startTime) {
                setStartTime(new Date());
            }
        } catch (error) {
            console.error('Error fetching flag:', error);
        }
    };

    const handleRevealCountry = () => {
        setShowCountry(true);
        setTimeout(() => {
            generateRandomFlag();
        }, 2000); // Adjust the timeout to control how long the country name is shown before changing the flag
    };

    const restartGame = () => {
        setCurrentFlag(null);
        setCurrentCountry(null);
        setUsedFlags([]);
        setStartTime(null);
        setEndTime(null);
        setTimeTaken(null);
        setShowCountry(false);
        setShowNotice(true);
        confetti.onClose();
    };

    const startGame = () => {
        setShowNotice(false);
        generateRandomFlag();
    };

    return (
        <div className="flex flex-col text-center items-center min-h-screen py-2 px-3 bg-slate-800 pt-20">
            <h1 className="text-4xl uppercase font-bold mb-4 text-white">Jeu des drapeaux</h1>
            {showNotice && (
                <p className="text-lg max-w-5xl my-10">
                    Bienvenue au jeu des drapeaux !<br/>Le but du jeu est de deviner oralement le pays correspondant au drapeau affiché. 
                    Cliquez sur "Drapeau suivant" pour commencer et utilisez le bouton "REPONSE" pour révéler le nom du pays (quand vous cliquez sur le bouton "REPONSE", le jeu passe automatiquement au drapeau suivant !)
                </p>
            )}
            {currentFlag ? (
                <>
                    <div className="relative text-lg text-white cursor-pointer" onClick={handleRevealCountry}>
                        <div
                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-white bg-opacity-75 flex items-center justify-center transition-opacity duration-500 ${
                                showCountry ? 'opacity-0' : 'opacity-100'
                            }`}
                            style={{ pointerEvents: showCountry ? 'none' : 'auto', width: '200px', height: '50px' }}
                        >
                            <p className="text-white">REPONSE</p>
                        </div>
                        <p className={`${showCountry ? 'visible' : 'invisible'} uppercase transition-opacity duration-500 mt-3`}>
                            {currentCountry}
                        </p>
                    </div>
                    <p className="text-lg text-white mt-[50px]">
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
                        onClick={startGame} 
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Démarrer le jeu
                </button>
            )}
            {timeTaken !== null && (
                <div className="text-center">
                    <p className="text-lg font-semibold text-white">Jeu terminé !</p>
                    <p className="text-lg text-white">Temps : {timeTaken.toFixed(2)} secondes</p>
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