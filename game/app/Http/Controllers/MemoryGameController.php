<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MemoryGameController extends Controller
{
    public function getView(): Response
    {
        $userId = Auth::id();
        $bestScore = DB::table('History')
        ->select(DB::raw('MAX(points) as best_score'))
        ->where('user_id', $userId)
        ->first();
    
        return Inertia::render('Game/MemoryGame', [
            'bestScore' => $bestScore,
        ]);
    }

    public function getHistory(): Response
    {
        $userId = Auth::id();
        $history = History::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $bestScores = DB::table('History')
            ->select('level', DB::raw('MAX(points) as best_score'))
            ->where('user_id', $userId)
            ->groupBy('level')
            ->get();

        return Inertia::render('History', [
            'newestGames' => $history,
            'bestScores' => $bestScores,
        ]);
    }

    public function postScore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'level' => ['required'],
            'points' => ['required', 'nullable'],
            'time' => ['required'],
            'gaveUp' => ['required', 'boolean' ],
            'lost' => ['required', 'boolean' ],
        ]);

        $userId = Auth::id();

        History::create([
            'user_id' => $userId,
            'level' => (int)$validated['level'],
            'points' => $validated['points'],
            'time' => $validated['time'],
            'lost' => $validated['lost'], 
            'gaveUp' => $validated['gaveUp'],
        ]);

        return back();
    }
}
