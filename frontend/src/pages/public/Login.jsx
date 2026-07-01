import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try { await login(form.email, form.password); navigate(searchParams.get('redirect') || '/'); }
        catch (err) { setError(err.response?.data?.message || t('login.error')); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="text-3xl font-semibold text-bliss-dark lowercase">bliss</span>
                    <h2 className="text-xl font-semibold text-bliss-dark mt-4">{t('login.title')}</h2>
                    <p className="text-bliss-muted text-sm mt-1">{t('login.subtitle')}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
                    <div><label className="text-bliss-text text-sm mb-1 block">{t('login.email')}</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full bg-bliss-white border border-bliss-border rounded-xl px-4 py-2.5 text-bliss-text focus:outline-none focus:border-bliss-rose text-sm" /></div>
                    <div><label className="text-bliss-text text-sm mb-1 block">{t('login.password')}</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full bg-bliss-white border border-bliss-border rounded-xl px-4 py-2.5 text-bliss-text focus:outline-none focus:border-bliss-rose text-sm" /></div>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition disabled:opacity-50">{loading ? '...' : t('login.title')}</button>
                </form>
                <p className="text-center text-sm text-bliss-muted mt-6">{t('login.noAccount')} <Link to="/register" className="text-bliss-rose hover:underline">{t('login.register')}</Link></p>
            </div>
        </div>
    );
};

export default Login;
