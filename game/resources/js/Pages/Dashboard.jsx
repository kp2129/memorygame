import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="">
                <div className="">
                    <div className="">
                      
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
