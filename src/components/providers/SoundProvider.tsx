'use client';

import React, { createContext, useContext } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playHoverSound: () => void;
  playClickSound: () => void;
  playSuccessSound: () => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: false,
  toggleSound: () => {},
  playHoverSound: () => {},
  playClickSound: () => {},
  playSuccessSound: () => {},
});

export const useSound = () => useContext(SoundContext);

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  // Disabled Audio API completely to fix system hang issue
  return (
    <SoundContext.Provider
      value={{
        soundEnabled: false,
        toggleSound: () => {},
        playHoverSound: () => {},
        playClickSound: () => {},
        playSuccessSound: () => {},
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

