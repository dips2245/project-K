import { useState, useEffect } from 'react';
import { adminAPI } from '../../hooks/api';
import { FiSave, FiMessageCircle } from 'react-icons/fi';

const AdminSettings = () => {
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        adminAPI.getWhatsappNumber()
            .then(({ data }) => setNumber(data.number))
            .catch(() => setMessage({ type: 'error', text: 'Failed to load settings' }))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const cleaned = number.replace(/[^0-9]/g, '');
        if (cleaned.length < 10) {
            setMessage({ type: 'error', text: 'Number must be at least 10 digits' });
            return;
        }
        setSaving(true);
        setMessage(null);
        try {
            await adminAPI.updateWhatsappNumber(cleaned);
            setNumber(cleaned);
            setMessage({ type: 'success', text: 'WhatsApp number updated!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-bliss-rose border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-bliss-dark">Settings</h1>
                <p className="text-sm text-bliss-muted mt-1">Manage your store configuration</p>
            </div>

            <div className="bg-bliss-white border border-bliss-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-bliss-rose/10 flex items-center justify-center">
                        <FiMessageCircle className="text-bliss-rose" size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-bliss-dark">WhatsApp Number</h2>
                        <p className="text-xs text-bliss-muted">Customers reach you on this number</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-bliss-muted mb-1.5">
                            Phone Number (with country code, no +)
                        </label>
                        <input
                            type="tel"
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                            placeholder="9779800000000"
                            className="w-full px-3.5 py-2.5 bg-bliss-bg border border-bliss-border rounded-lg text-sm text-bliss-dark placeholder-bliss-muted/50 focus:outline-none focus:border-bliss-rose transition font-mono"
                        />
                        <p className="text-[11px] text-bliss-muted mt-1.5">
                            Example: 9779800000000 (Nepal +977)
                        </p>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-xs font-medium ${
                            message.type === 'success'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-bliss-rose text-black rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                        ) : (
                            <FiSave size={15} />
                        )}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;
