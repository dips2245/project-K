import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { userAPI, adminAPI } from '../../hooks/api';
import { FiPackage, FiUser, FiLock, FiTrash2, FiShield, FiEye, FiEyeOff, FiSave } from 'react-icons/fi';

const Account = () => {
    const { t } = useTranslation();
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';
    const [tab, setTab] = useState(isAdmin ? 'profile' : 'orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (isAdmin) {
            setProfile({ name: user.name || '', email: user.email || '' });
            setLoading(false);
        } else {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const { data } = await userAPI.getOrders();
            setOrders(data);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load orders' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setMessage(null);
        try {
            await userAPI.changePassword(passwordData);
            setMessage({ type: 'success', text: 'Password changed successfully' });
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setMessage(null);
        try {
            const { data } = await adminAPI.updateProfile(profile);
            setProfile({ name: data.name, email: data.email });
            updateUser({ name: data.name, email: data.email });
            setMessage({ type: 'success', text: 'Profile updated' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to permanently delete your account? All your data will be lost.')) return;
        setDeleting(true);
        try {
            await userAPI.deleteAccount();
            logout();
            navigate('/');
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete account' });
            setDeleting(false);
        }
    };

    const tabs = [
        ...(!isAdmin ? [{ key: 'orders', label: 'Order History', icon: FiPackage }] : []),
        { key: 'profile', label: 'Profile', icon: FiUser },
        { key: 'security', label: 'Security', icon: FiLock },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#000000] pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-6">
                    <h1 className="text-2xl font-bold text-white">
                        {isAdmin ? 'Admin Account' : 'My Account'}
                    </h1>
                    {isAdmin && (
                        <span className="flex items-center gap-1 text-[11px] text-bliss-rose bg-bliss-rose/10 px-2.5 py-1 rounded-full font-medium">
                            <FiShield size={11} /> Admin
                        </span>
                    )}
                </div>

                {message && (
                    <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mb-8">
                    {tabs.map(tabItem => (
                        <button
                            key={tabItem.key}
                            onClick={() => setTab(tabItem.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${tab === tabItem.key ? 'bg-white text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                        >
                            <tabItem.icon size={16} />
                            {tabItem.label}
                        </button>
                    ))}
                </div>

                {tab === 'orders' && (
                    <div>
                        {loading ? (
                            <p className="text-white/50 text-sm">Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-16">
                                <FiPackage size={48} className="mx-auto text-white/20 mb-4" />
                                <p className="text-white/50">No orders yet</p>
                                <button onClick={() => navigate('/shop')} className="mt-4 px-6 py-2.5 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order._id} className="bg-white/5 rounded-xl p-5 border border-white/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-white font-semibold text-sm">
                                                {order.orderNumber}
                                            </span>
                                            <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${order.status === 'delivered' ? 'bg-green-900/50 text-green-300' : order.status === 'cancelled' ? 'bg-red-900/50 text-red-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-white/40 text-xs mb-2">
                                            {new Date(order.createdAt).toLocaleDateString()} — {order.items.length} item(s)
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {order.items.slice(0, 4).map((item, idx) => (
                                                <span key={idx} className="text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-lg">{item.name}</span>
                                            ))}
                                            {order.items.length > 4 && (
                                                <span className="text-xs text-white/40">+{order.items.length - 4} more</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                            <span className={`text-sm font-semibold ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-white'}`}>
                                                Rs. {order.totalAmount.toLocaleString()}
                                            </span>
                                            <span className="text-[11px] text-white/40">{order.paymentMethod}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {tab === 'profile' && (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                        <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
                        {isAdmin ? (
                            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                                <div>
                                    <label className="text-xs text-white/40 block mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-bliss-rose"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 block mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-bliss-rose"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={profileLoading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition disabled:opacity-50"
                                >
                                    <FiSave size={15} />
                                    {profileLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-white/40 block mb-1">Name</label>
                                    <p className="text-white">{user.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 block mb-1">Email</label>
                                    <p className="text-white">{user.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 block mb-1">Role</label>
                                    <p className="text-white capitalize">{user.role}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {tab === 'security' && (
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                            <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>
                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                <div className="relative">
                                    <input
                                        type={showCurrent ? 'text' : 'password'}
                                        placeholder="Current password"
                                        value={passwordData.currentPassword}
                                        onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-bliss-rose"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition">
                                        {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        placeholder="New password (8+ chars, uppercase, lowercase, number)"
                                        value={passwordData.newPassword}
                                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-bliss-rose"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition">
                                        {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition disabled:opacity-50"
                                >
                                    {passwordLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>

                        {!isAdmin && (
                            <div className="bg-white/5 rounded-xl p-6 border border-red-900/30">
                                <h2 className="text-lg font-semibold text-red-400 mb-2">Delete Account</h2>
                                <p className="text-white/50 text-sm mb-4">This permanently deletes your account and all associated data (orders, quiz responses). This cannot be undone.</p>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleting}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-900/50 text-red-300 rounded-xl text-sm font-medium hover:bg-red-900/70 transition disabled:opacity-50"
                                >
                                    <FiTrash2 size={16} />
                                    {deleting ? 'Deleting...' : 'Delete My Account'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
