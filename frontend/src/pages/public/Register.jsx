import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
    const { t } = useTranslation();
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', termsAccepted: false });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [devUrl, setDevUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const data = await register(form.name, form.email, form.password, form.phone, form.termsAccepted);
            setSuccess(data.message || 'Account created. Please check your email to verify.');
            if (data.devVerifyUrl) setDevUrl(data.devVerifyUrl);
        } catch (err) {
            setError(err.response?.data?.message || t('common.error'));
        } finally { setLoading(false); }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="w-full max-w-sm text-center">
                    <div className="text-5xl mb-4">&#9993;</div>
                    <h2 className="text-xl font-semibold text-bliss-dark mb-2">Verify your email</h2>
                    <p className="text-bliss-muted text-sm mb-6">{success}</p>
                    {devUrl && (
                        <a href={devUrl} className="inline-block py-3 px-6 mb-3 bg-bliss-rose/10 text-bliss-rose rounded-xl font-medium text-sm hover:bg-bliss-rose/20 transition">Click to Verify (Dev)</a>
                    )}
                    <Link to="/login" className="inline-block py-3 px-6 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition">Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="text-3xl font-semibold text-bliss-dark lowercase tracking-[0.12em]">bliss</span>
                    <h2 className="text-xl font-semibold text-bliss-dark mt-4">{t('register.title')}</h2>
                    <p className="text-bliss-muted text-sm mt-1">{t('register.subtitle')}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
                    {[
                        { name: 'name', label: t('register.name'), type: 'text' },
                        { name: 'email', label: t('register.email'), type: 'email' },
                        { name: 'phone', label: t('register.phone'), type: 'tel' },
                    ].map((f) => (
                        <div key={f.name}><label className="text-bliss-text text-sm mb-1 block">{f.label}</label><input type={f.type} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} required className="w-full bg-bliss-white border border-bliss-border rounded-xl px-4 py-2.5 text-bliss-text focus:outline-none focus:border-bliss-rose text-sm" /></div>
                    ))}
                    <div><label className="text-bliss-text text-sm mb-1 block">{t('register.password')}</label><div className="relative"><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full bg-bliss-white border border-bliss-border rounded-xl px-4 py-2.5 pr-10 text-bliss-text focus:outline-none focus:border-bliss-rose text-sm" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-bliss-muted hover:text-bliss-text transition">{showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}</button></div></div>
                    <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.termsAccepted} onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })} required className="mt-1 accent-bliss-rose" />
                        <span className="text-bliss-text text-sm">I accept the <Link to="/terms" className="text-bliss-rose hover:underline" target="_blank">Terms & Conditions</Link> and <Link to="/terms" className="text-bliss-rose hover:underline" target="_blank">Privacy Policy</Link></span>
                    </label>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition disabled:opacity-50">{loading ? '...' : t('register.title')}</button>
                </form>
                <p className="text-center text-sm text-bliss-muted mt-6">{t('register.hasAccount')} <Link to="/login" className="text-bliss-rose hover:underline">{t('register.login')}</Link></p>
            </div>
        </div>
    );
};

export default Register;
