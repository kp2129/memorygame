import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="">
                <div className="">
                    <div className="">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className=""
                        />
                    </div>

                    <div className="">
                        <UpdatePasswordForm className="" />
                    </div>

                    <div className="">
                        <DeleteUserForm className="" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
