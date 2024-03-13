<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class MemoryGameController extends Controller
{
    public function getView(): Response
    {
        return Inertia::render('Game/MemoryGame', [
            
        ]);
    }

    public function getHistory(): Response
    {

        $userId = Auth::id();
        $history = History::where('user_id', $userId)->get();
        return Inertia::render('History', [
            'gameHistory' => $history
        ]);
    }

    public function postScore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'level' => ['required'],
            'points' => ['required'],
            'time' => ['required'],
        ]);

        $userId = Auth::id();

        History::create([
            'user_id' => $userId,
            'level' => $validated['level'],
            'points' => $validated['points'],
            'time' => $validated['time'],
        ]);

        return back();
    }
}
