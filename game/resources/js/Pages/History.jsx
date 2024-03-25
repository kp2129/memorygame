import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js/auto';

export default function Dashboard({ auth, newestGames, bestScores }) {
    const history = newestGames;
    const historyBestScore = bestScores;

    // Register necessary components and scales
    Chart.register(CategoryScale, LinearScale, BarElement, Title);

    let data;
    if (historyBestScore.length > 0) {
        // Constructing data for the bar chart
        const labels = historyBestScore.map(item => `Level ${item.level}`);
        const pointsData = historyBestScore.map(item => item.best_score);

        data = {
            labels: labels,
            datasets: [
                {
                    label: 'Best Score',
                    backgroundColor: 'rgba(255,0,0,0.6)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,0,0,0.4)',
                    hoverBorderColor: 'rgba(75,192,192,1)',
                    data: pointsData
                }
            ]
        };
    } 

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="">Game Performance</h2>}
        >
            <Head title="Game Performance" />

            <div className="flex flex-col game-history">
                <h3 className="text-lg font-bold mb-2">Recent Games:</h3>
                <div className="overflow-x-auto">
                    {historyBestScore.length > 0 && (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                    <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Points</th>
                                    <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Time (seconds)</th>
                                    <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Lost</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {history.map((game, index) => (
                                    <tr key={index}>
                                        <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{game.level}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{game.points}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{game.time}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{new Date(game.created_at).toLocaleString()}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap">{game.gaveUp ? 'true' : 'false'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {historyBestScore.length > 0 ? (
                        <div className="mt-4 md:mt-6">
                            <Bar
                                data={data}
                                options={{
                                    maintainAspectRatio: false, // Do not maintain aspect ratio
                                    responsive: true // Make the chart responsive
                                }}
                            />
                        </div>
                    ) : (
                        <div className="mt-4 md:mt-6">No game scores available.</div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
