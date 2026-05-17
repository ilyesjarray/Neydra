'use client';

import React from 'react';
import NeuralModelChat from '@/components/ai/NeuralModelChat';
import { Coffee } from 'lucide-react';

export default function FriendModelPage() {
    return (
        <NeuralModelChat 
            modeId="casual"
            modeLabel="PERSONAL"
            modeDesc="Casual companion — cheerful, honest, keeps it simple."
            modeIcon={Coffee}
            modeColor="text-red-500"
            modeBg="bg-red-600/10"
            modeBorder="border-red-600/30"
            initialMessage="**FRIEND BOT — ONLINE**\n\nI am Friend, your casual companion powered by **Llama-3.3-70B**.\n\nI am here for:\n• Daily life advice & relationship guidance\n• Creative ideas, jokes, stories\n• General conversation & brainstorming\n\nHow can I help you today?"
            botName="FRIEND"
        />
    );
}
