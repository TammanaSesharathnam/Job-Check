import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Pie, Bar, Line, Radar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminAnalytics = ({ activities }) => {
    // 1. Process Data for Pie Chart (Real vs Fake)
    const totalReal = activities.filter(a => a.result === "Real Job").length;
    const totalFake = activities.filter(a => a.result === "Fake Job").length;
    const total = totalReal + totalFake;

    const realPercentage = total > 0 ? ((totalReal / total) * 100).toFixed(1) : 0;
    const fakePercentage = total > 0 ? ((totalFake / total) * 100).toFixed(1) : 0;

    const pieData = {
        labels: [`Real Jobs (${totalReal})`, `Fake Jobs (${totalFake})`],
        datasets: [
            {
                data: [totalReal, totalFake],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.6)', // Green
                    'rgba(239, 68, 68, 0.6)',  // Red
                ],
                borderColor: [
                    '#22c55e',
                    '#ef4444',
                ],
                borderWidth: 2,
            },
        ],
    };

    // 2. Process Data for Trend Chart
    const trendData = activities.reduce((acc, act) => {
        const date = act.timestamp.split(' ')[0];
        if (!acc[date]) {
            acc[date] = { real: 0, fake: 0 };
        }
        if (act.result === "Real Job") acc[date].real++;
        else acc[date].fake++;
        return acc;
    }, {});

    const sortedDates = Object.keys(trendData).sort();

    const lineData = {
        labels: sortedDates.map(d => d.split('-').slice(1).join('/')), // MM/DD format
        datasets: [
            {
                label: 'Real Jobs',
                data: sortedDates.map(d => trendData[d].real),
                borderColor: '#D4AF37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#D4AF37',
            },
            {
                label: 'Fake Jobs',
                data: sortedDates.map(d => trendData[d].fake),
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(255, 255, 255, 0.4)',
            },
        ],
    };

    // 3. System Health Radar Data (Mocked based on stats or fixed parameters)
    const radarData = {
        labels: ['AI Precision', 'DB Latency', 'API Speed', 'Security', 'Uptime', 'Load'],
        datasets: [{
            label: 'System Performance',
            data: [92, 88, 95, 98, 99.9, 15],
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
            borderColor: '#D4AF37',
            pointBackgroundColor: '#D4AF37',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#D4AF37'
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#9ca3af',
                    font: { size: 10, weight: 'bold' },
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: '#1a1a1a',
                titleColor: '#D4AF37',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 12,
            }
        },
        scales: {
            y: {
                ticks: { color: '#6b7280', font: { size: 10 } },
                grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
                ticks: { color: '#6b7280', font: { size: 10 } },
                grid: { display: false }
            }
        }
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.1)' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: '#9ca3af', font: { size: 10, weight: 'bold' } },
                ticks: { display: false }
            }
        },
        plugins: {
            legend: { display: false }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#9ca3af',
                    font: { size: 10, weight: 'bold' },
                    usePointStyle: true
                }
            }
        }
    };

    return (
        <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Detection Ratio (Pie) */}
                <div className="bg-dark-surface border border-white/10 p-8 rounded-[40px] flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-xl font-serif font-bold">Detection <span className="text-gold">Ratio</span></h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Real vs Fake Analysis</p>
                    </div>
                    <div className="h-[240px] w-full relative">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] text-gray-500 font-bold mb-1">REAL</p>
                            <p className="text-lg font-serif font-bold text-green-500">{realPercentage}%</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] text-gray-500 font-bold mb-1">FAKE</p>
                            <p className="text-lg font-serif font-bold text-red-500">{fakePercentage}%</p>
                        </div>
                    </div>
                </div>

                {/* System Health (Radar) */}
                <div className="bg-dark-surface border border-white/10 p-8 rounded-[40px] flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-xl font-serif font-bold">System <span className="text-gold">Health</span></h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Performance Metrics</p>
                    </div>
                    <div className="h-[240px] w-full">
                        <Radar data={radarData} options={radarOptions} />
                    </div>
                    <p className="text-center text-[10px] text-gray-500 font-bold uppercase mt-4 tracking-tighter">Operational Efficiency: <span className="text-gold">Sublime</span></p>
                </div>

                {/* Detection Timeline (Line) */}
                <div className="bg-dark-surface border border-white/10 p-8 rounded-[40px] flex flex-col lg:col-span-1">
                    <div className="mb-6">
                        <h3 className="text-xl font-serif font-bold">Activity <span className="text-gold">Trend</span></h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Daily Analysis Flow</p>
                    </div>
                    <div className="h-[240px] w-full">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
