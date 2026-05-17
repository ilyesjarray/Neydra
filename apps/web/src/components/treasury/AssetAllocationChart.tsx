'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import { FinanceService, MarketGlobal } from '@/lib/services/finance-service';

export function AssetAllocationChart() {
    const [mounted, setMounted] = useState(false);
    const [globalData, setGlobalData] = useState<MarketGlobal | null>(null);

    useEffect(() => {
        setMounted(true);
        FinanceService.getGlobalStats().then(setGlobalData);
    }, []);

    if (!mounted || !globalData) return (
        <div className="hud-border p-8 border-red-500/10 aspect-square flex flex-col items-center justify-center bg-black/40">
            <div className="w-10 h-10 border-2 border-red-500/10 border-t-red-500 animate-spin" />
            <span className="mt-4 text-[9px] font-black text-red-500/40 tracking-widest animate-pulse">MATRIX_RENDER...</span>
        </div>
    );

    // Calculate market cap distribution from global data
    const btcPct = globalData.market_cap_percentage.btc;
    const ethPct = globalData.market_cap_percentage.eth;
    const othersPct = 100 - btcPct - ethPct;

    const data = [
        { name: 'Bitcoin', value: btcPct, color: '#ff0000' },
        { name: 'Ethereum', value: ethPct, color: '#ff0000' },
        { name: 'Altcoins', value: othersPct, color: '#ff0000' },
    ];

    return (
        <div className="flex flex-col h-full font-mono">
            <div className="flex-1 w-full h-[300px] min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    style={{ filter: `drop-shadow(0 0 10px ${entry.color}60)` }}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#000000',
                                border: '1px solid rgba(255, 0, 0, 0.2)',
                                borderRadius: '0px',
                                fontFamily: 'monospace',
                                fontSize: '10px'
                            }}
                            itemStyle={{ color: '#ff0000' }}
                            formatter={(val: any) => `${val?.toFixed(1) ?? 0}%`}
                        />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="rect"
                            formatter={(value: string) => <span className="text-[9px] font-black text-red-500/60 uppercase tracking-widest">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 border-t border-red-500/10 pt-6">
                <div>
                    <div className="text-[9px] text-red-500/40 uppercase tracking-widest mb-1">Global Market Cap</div>
                    <div className="text-xl font-black text-red-500 tracking-tighter shadow-neon-red/20">
                        {FinanceService.formatLarge(globalData.total_market_cap.usd)}
                    </div>
                </div>
                <div>
                    <div className="text-[9px] text-red-500/40 uppercase tracking-widest mb-1">24h Volatility</div>
                    <div className={`text-xl font-black tracking-tighter ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-red-500' : 'text-red-600'}`}>
                        {globalData.market_cap_change_percentage_24h_usd > 0 ? '+' : ''}
                        {globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%
                    </div>
                </div>
            </div>
        </div>
    );
}
