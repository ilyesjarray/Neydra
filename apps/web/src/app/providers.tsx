'use client';

import * as React from 'react';
import { NeydraThemeProvider } from '@/context/NeydraThemeContext';
import { Toaster } from 'sonner';

export interface ProvidersProps {
    children: React.ReactNode;
}

import { SoundProvider } from '@/providers/SoundProvider';

export function Providers({ children }: ProvidersProps) {
    return (
        <SoundProvider>
            <NeydraThemeProvider>
                {children}
                <Toaster position="top-right" expand={false} richColors />
            </NeydraThemeProvider>
        </SoundProvider>
    );
}
