'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Sector = 'hub' | 'intel' | 'vault' | 'ops' | 'bios' | 'council' | 'system' | 'neural' | 'chronos' | 'nexus';

interface ThemeConfig {
    accent: string;
    glow: string;
    bg: string;
    label: string;
}

const sectorThemes: Record<Sector, ThemeConfig> = {
    hub: {
        accent: '#00F3FF',
        glow: 'rgba(212, 175, 55, 0.2)',
        bg: '#000000',
        label: 'NEYDRA_COMMAND'
    },
    intel: {
        accent: '#00F3FF',
        glow: 'rgba(212, 175, 55, 0.2)',
        bg: '#000000',
        label: 'INTELLIGENCE_CENTER'
    },
    vault: {
        accent: '#00F3FF',
        glow: 'rgba(212, 175, 55, 0.2)',
        bg: '#000000',
        label: 'ASSET_VAULT_DECRYPTED'
    },
    ops: {
        accent: '#0074D9',
        glow: 'rgba(80, 200, 120, 0.2)',
        bg: '#000000',
        label: 'OPERATIONAL_CONTROL'
    },
    bios: {
        accent: '#00F3FF',
        glow: 'rgba(212, 175, 55, 0.2)',
        bg: '#000000',
        label: 'ELITE_BIOS_DECRYPT'
    },
    council: {
        accent: '#00F3FF',
        glow: 'rgba(212, 175, 55, 0.2)',
        bg: '#000000',
        label: 'HIGH_COUNCIL'
    },
    system: {
        accent: '#0074D9',
        glow: 'rgba(80, 200, 120, 0.2)',
        bg: '#000000',
        label: 'SYSTEM_CENTER'
    },
    neural: {
        accent: '#0074D9',
        glow: 'rgba(80, 200, 120, 0.2)',
        bg: '#000000',
        label: 'NEURAL_NEXUS'
    },
    chronos: {
        accent: '#00F3FF',
        glow: 'rgba(212, 175, 55, 0.2)',
        bg: '#000000',
        label: 'CHRONOS_COMMAND'
    },
    nexus: {
        accent: '#0074D9',
        glow: 'rgba(80, 200, 120, 0.2)',
        bg: '#000000',
        label: 'POWER_NEXUS'
    }
};

interface NeydraThemeContextType {
    sector: Sector;
    setSector: (sector: Sector) => void;
    theme: ThemeConfig;
}

const NeydraThemeContext = createContext<NeydraThemeContextType | undefined>(undefined);

export function NeydraThemeProvider({ children }: { children: React.ReactNode }) {
    const [sector, setSector] = useState<Sector>('hub');
    const [theme, setTheme] = useState<ThemeConfig>(sectorThemes.hub);

    useEffect(() => {
        setTheme(sectorThemes[sector]);

        // Update CSS Variables for global styling
        const root = document.documentElement;
        root.style.setProperty('--neydra-accent', sectorThemes[sector].accent);
        root.style.setProperty('--neydra-glow', sectorThemes[sector].glow);
    }, [sector]);

    return (
        <NeydraThemeContext.Provider value={{ sector, setSector, theme }}>
            {children}
        </NeydraThemeContext.Provider>
    );
}

export const useNeydraTheme = () => {
    const context = useContext(NeydraThemeContext);
    if (!context) throw new Error('useNeydraTheme must be used within NeydraThemeProvider');
    return context;
};
