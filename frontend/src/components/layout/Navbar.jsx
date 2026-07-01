import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiShoppingBag, FiUser, FiSearch, FiMenu, FiX, FiHeart } from 'react-icons/fi';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'ne' ? 'en' : 'ne');
    };

    const NAV_LINKS = [
        { label: t('nav.shop'), to: '/shop' },
        { label: t('nav.categories'), to: '/shop' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
            {/* Main bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-18">

                    {/* ── LEFT: hamburger ── */}
                    <div className="flex items-center flex-1">
                        <button
                            className="text-white/70 hover:text-white transition"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>

                    {/* ── CENTER: logo ── */}
                    <Link to="/" className="flex-shrink-0 absolute left-1/2 -translate-x-1/2">
                        <span className="text-2xl lg:text-[28px] font-semibold tracking-tight text-white lowercase">bliss</span>
                    </Link>

                    {/* ── RIGHT: icons ── */}
                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <button onClick={() => setSearchOpen(!searchOpen)} className="text-white/40 hover:text-white transition">
                            <FiSearch size={18} />
                        </button>

                        <button onClick={toggleLanguage} className="text-white/40 hover:text-white transition text-xs font-semibold uppercase tracking-wider hidden sm:block">
                            {i18n.language === 'ne' ? 'EN' : 'ने'}
                        </button>

                        <FiHeart size={18} className="text-white/40 hidden sm:block" />

                        {user ? (
                            <div className="relative group">
                                <button className="text-white/40 hover:text-white transition">
                                    <FiUser size={18} />
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#111]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="block px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 rounded-t-xl">{t('nav.admin')}</Link>
                                    )}
                                    <Link to="/orders" className="block px-4 py-2.5 text-sm text-white/80 hover:bg-white/5">{t('admin.orders')}</Link>
                                    <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-bliss-rose hover:bg-white/5 rounded-b-xl">{t('nav.logout')}</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-white/40 hover:text-white transition">
                                <FiUser size={18} />
                            </Link>
                        )}

                        <Link to="/cart" className="relative text-white/40 hover:text-white transition">
                            <FiShoppingBag size={18} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-bliss-rose text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-medium">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Search bar dropdown ── */}
            {searchOpen && (
                <div className="border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`; }} className="flex gap-2">
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('nav.search')}
                                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-bliss-rose text-sm" autoFocus />
                            <button type="submit" className="px-5 py-2.5 bg-white text-black rounded-xl hover:bg-white/90 transition text-sm font-medium">{t('common.search')}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Slide-in menu (all screen sizes) ── */}
            {mobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 z-40"
                        onClick={() => setMobileOpen(false)}
                    />
                    {/* Menu panel */}
                    <div className="fixed top-0 left-0 bottom-0 w-72 bg-[#0d0d0d] z-50 shadow-2xl border-r border-white/5 overflow-y-auto">
                        {/* Close button */}
                        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
                            <span className="text-xl font-semibold text-white lowercase tracking-tight">bliss</span>
                            <button
                                className="text-white/60 hover:text-white transition"
                                onClick={() => setMobileOpen(false)}
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Nav links */}
                        <div className="px-5 py-6 space-y-1">
                            {[
                                { label: t('nav.home'), to: '/' },
                                ...NAV_LINKS,
                            ].map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-white/70 hover:text-white hover:bg-white/5 transition text-[15px] py-3 px-3 rounded-lg"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Bottom section */}
                        <div className="px-5 py-4 border-t border-white/5 space-y-2">
                            {!user && (
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-bliss-rose py-2.5 text-[15px] hover:underline">{t('nav.login')}</Link>
                            )}
                            <button onClick={() => { toggleLanguage(); }} className="text-white/50 hover:text-white transition text-xs font-semibold uppercase tracking-wider">
                                Language: {i18n.language === 'ne' ? 'नेपाली' : 'English'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default Navbar;
