'use client';

import React from 'react';
import NeuralModelChat from '@/components/ai/NeuralModelChat';
import { BookOpen } from 'lucide-react';

export default function ProfessorModelPage() {
    return (
        <NeuralModelChat 
            modeId="academic"
            modeLabel="ACADEMIC"
            modeDesc="Country-aware scholar — adapts to your curriculum."
            modeIcon={BookOpen}
            modeColor="text-red-500"
            modeBg="bg-red-600/10"
            modeBorder="border-red-600/30"
            initialMessage="**PROFESSOR BOT — ONLINE**\n\nI am Professor, your academic scholar powered by **Llama-3.3-70B**.\n\nI am engineered for:\n• Deep academic research & complex concept explanation\n• Paper analysis & citation guidance\n• Advanced mathematics & scientific analysis\n\nWhat topic shall we explore?"
            botName="PROFESSOR"
        />
    );
}
