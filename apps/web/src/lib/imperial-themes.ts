import {
    Shield, Globe, Brain, Heart, Landmark,
    Gavel, Ghost, Ship, Coins, Castle,
    GraduationCap, Hammer, Telescope, Sprout,
    Users, LucideIcon
} from 'lucide-react';

export interface SectorTheme {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    secondaryColor: string;
    atmosphere: 'cyber' | 'organic' | 'industrial' | 'void' | 'royal';
    accentGlow: string;
}

export const SECTOR_THEMES: Record<string, SectorTheme> = {
    vault: {
        id: 'vault',
        name: 'The Vault',
        icon: Shield,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'cyber',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    command: {
        id: 'command',
        name: 'Global Command',
        icon: Globe,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'void',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    nexus: {
        id: 'nexus',
        name: 'Neural Nexus',
        icon: Brain,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'cyber',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    bio: {
        id: 'bio',
        name: 'Bio-Sentinel',
        icon: Heart,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'organic',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    projects: {
        id: 'projects',
        name: 'Imperial Projects',
        icon: Landmark,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'royal',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    council: {
        id: 'council',
        name: 'High Council',
        icon: Gavel,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'royal',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    shadow: {
        id: 'shadow',
        name: 'Shadow Sentinel',
        icon: Ghost,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'void',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    fleet: {
        id: 'fleet',
        name: 'The Fleet',
        icon: Ship,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'industrial',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    mint: {
        id: 'mint',
        name: 'The Mint',
        icon: Coins,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'royal',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    citadel: {
        id: 'citadel',
        name: 'The Citadel',
        icon: Castle,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'industrial',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    academy: {
        id: 'academy',
        name: 'The Academy',
        icon: GraduationCap,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'royal',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    forge: {
        id: 'forge',
        name: 'The Forge',
        icon: Hammer,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'industrial',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    observatory: {
        id: 'observatory',
        name: 'The Observatory',
        icon: Telescope,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'void',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    greenhouse: {
        id: 'greenhouse',
        name: 'The Greenhouse',
        icon: Sprout,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'organic',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    },
    agora: {
        id: 'agora',
        name: 'The Agora',
        icon: Users,
        color: '#ff0000',
        secondaryColor: '#ff0000',
        atmosphere: 'organic',
        accentGlow: 'rgba(255, 0, 0, 0.2)'
    }
};
