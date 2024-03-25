import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Logo from '../Components/ApplicationLogo';

export default function Leaderboard({ auth, bestScores }) {
    // Sorting bestScores based on best_score
    const sortedBestScores = bestScores.sort((a, b) => b.best_score - a.best_score);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="leaderboard-header">Leaderboard</h2>}
        >
            <div className='leaderboard'>
                <div id="header">
                    <h1>Ranking</h1>
                    <Logo/>
                </div>
                <div id="leaderboard">
                    <div className="ribbon"></div>
                    <table id='table'>
                        <tbody>
                            {sortedBestScores.map((score, index) => (
                                <tr id='tr' key={score.user_id}>
                                    <td id='td' className="number">{index + 1}</td>
                                    <td id='td' className="name">{score.name}</td>
                                    <td id='td' className="level">Level: {score.level}</td>
                                    <td id='td' className="points">{score.best_score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
