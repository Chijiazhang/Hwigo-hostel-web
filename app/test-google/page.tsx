"use client";

import { getGoogleAuthUrl } from "../../lib/googleAuth";
import { useEffect, useState } from "react";

export default function TestGooglePage() {
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    setAuthUrl(getGoogleAuthUrl());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Google OAuth Test Page</h1>
      <p className="mb-4">Client ID: {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'Not set'}</p>
      {authUrl ? (
        <a href={authUrl} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login with Google
        </a>
      ) : (
        <p>Loading Google Auth URL...</p>
      )}
      <p className="mt-4 text-sm text-gray-600">
        After logging in, you should be redirected to /register with user info in URL params.
      </p>
    </div>
  );
}
