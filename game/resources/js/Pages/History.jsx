import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, gameHistory }) {
    const history = gameHistory;

    console.log(gameHistory)
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="">History</h2>}
        >
            <Head title="History" />

            <div className="">
                <div className="">
                    <div className="">
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
