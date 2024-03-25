<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class LeaderboardController extends Controller
{
    public function getLeaderboard(): Response
    {
        $bestScores = DB::table('users')
            ->select('users.name', 'History.user_id', 'History.level', 'History.points as best_score')
            ->join('History', function ($join) {
                $join->on('users.id', '=', 'History.user_id')
                    ->whereRaw('History.points = (select max(points) from History as h where h.user_id = History.user_id)');
            })
            ->orderByDesc('best_score')
            ->limit(10)
            ->get();



        return Inertia::render('Leaderboard', [
            'bestScores' => $bestScores,
        ]);
    }
}
