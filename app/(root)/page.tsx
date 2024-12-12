'use client'
import { signOut, useSession } from "next-auth/react";

const UserProfile = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>;
    }
    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/log-in' }); // Redirect to homepage after sign-out
      };
   

   

    return (
        <div  className="px-5" >
            <h1>Welcome, {session?.user?.name}</h1>
            <p>Email: {session?.user?.email}</p>
            {session ? (
            <button onClick={handleSignOut} className="text-sm font-semibold p-2 bg-zinc-800 text-white rounded-lg" >
                SignOut
            </button>

            ) : <>
            
            </> }
        </div>
    );
};

export default UserProfile;
