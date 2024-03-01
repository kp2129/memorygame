<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemoryGameController extends Controller
{
    public function get(){
        return Inertia::render('Game/MemoryGame', [
            'mustVerifyEmail' => 1
        ]);
    }
}
