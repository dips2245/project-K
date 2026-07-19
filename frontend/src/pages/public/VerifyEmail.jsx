import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../../hooks/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) { setStatus('invalid'); return; }
        authAPI.verifyEmail(token)
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'));
    }, [searchParams]);

    if (status === 'loading') return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <p className="text-bliss-text">Verifying your email...</p>
        </div>
    );

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-sm text-center">
                {status === 'success' ? (
                    <>
                        <div className="text-5xl mb-4 text-green-500">&#10003;</div>
                        <h2 className="text-xl font-semibold text-bliss-dark mb-2">Email Verified!</h2>
                        <p className="text-bliss-muted text-sm mb-6">Your email has been verified. You can now log in.</p>
                        <Link to="/login" className="inline-block py-3 px-6 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition">Go to Login</Link>
                    </>
                ) : (
                    <>
                        <div className="text-5xl mb-4">&#10007;</div>
                        <h2 className="text-xl font-semibold text-bliss-dark mb-2">Verification Failed</h2>
                        <p className="text-bliss-muted text-sm mb-6">The verification link is invalid or expired.</p>
                        <Link to="/" className="inline-block py-3 px-6 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition">Go Home</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
