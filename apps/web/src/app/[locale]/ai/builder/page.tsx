'use client';

import React from 'react';
import NeuralModelChat from '@/components/ai/NeuralModelChat';
import { Code2 } from 'lucide-react';

export default function BuilderModelPage() {
    return (
        <NeuralModelChat 
            modeId="code"
            modeLabel="ELITE"
            modeDesc="Agent swarm — builds complete projects from scratch."
            modeIcon={Code2}
            modeColor="text-red-500"
            modeBg="bg-red-600/10"
            modeBorder="border-red-600/30"
            initialMessage="**BUILDER BOT — ONLINE**\n\nI am Builder, your elite software engineering AI powered by **Llama-3.3-70B**.\n\nI am specialized in:\n• Full-stack architecture & system design\n• Complex problem solving & algorithmic optimization\n• Code generation, debugging & refactoring\n\nWhat are we building today?"
            botName="BUILDER"
        />
    );
}
