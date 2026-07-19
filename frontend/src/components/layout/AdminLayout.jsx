import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../hooks/api';
import {
    FiGrid, FiPackage, FiList, FiShoppingBag,
    FiLogOut, FiMenu, FiX, FiExternalLink,
    FiChevronRight, FiAlertTriangle, FiUsers, FiSettings
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

const navLinks = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard', exact: true },
    { to: '/admin/products', icon: FiPackage, label: 'Products' },
    { to: '/admin/categories', icon: FiList, label: 'Categories' },
    { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
    { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

const AdminLayout = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [serverVerified, setServerVerified] = useState(null);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            navigate('/login?redirect=/admin');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user && user.role === 'admin') {
            authAPI.getMe()
                .then(({ data }) => {
                    if (data.role === 'admin') {
                        setServerVerified(true);
                    } else {
                        setServerVerified(false);
                        logout();
                        navigate('/login?redirect=/admin');
                    }
                })
                .catch(() => {
                    setServerVerified(false);
                    logout();
                    navigate('/login?redirect=/admin');
                });
        }
    }, []);

    if (loading || serverVerified === null) {
        return (
            <div className="min-h-screen bg-bliss-bg flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-bliss-rose border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user || user.role !== 'admin' || !serverVerified) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch { }
        logout();
        navigate('/');
    };

    const isActive = (link) =>
        link.exact
            ? location.pathname === link.to
            : location.pathname.startsWith(link.to);

    const currentPage = navLinks.find((l) => isActive(l));

    return (
        <div className="min-h-screen bg-bliss-bg flex">
            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-bliss-white border-r border-bliss-border 
                    transform transition-all duration-300 ease-in-out
                    lg:translate-x-0 lg:static
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Brand */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-bliss-border">
                    <Link to="/admin" className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-bliss-rose flex items-center justify-center text-white text-xs font-bold">
                            b
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-bliss-dark tracking-[0.12em] lowercase">bliss</span>
                            <span className="text-[10px] text-bliss-muted block leading-tight -mt-0.5">Admin Panel</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-bliss-muted hover:text-bliss-dark p-1 rounded-lg hover:bg-bliss-cream"
                    >
                        <FiX size={16} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-0.5">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link);
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group
                                    ${active
                                        ? 'bg-bliss-rose/10 text-bliss-rose font-medium'
                                        : 'text-bliss-text hover:bg-bliss-cream hover:text-bliss-dark'
                                    }`}
                            >
                                <Icon size={16} className={active ? 'text-bliss-rose' : 'text-bliss-muted group-hover:text-bliss-dark'} />
                                <span>{link.label}</span>
                                {active && (
                                    <FiChevronRight size={12} className="ml-auto text-bliss-rose" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-bliss-border space-y-0.5">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-bliss-muted hover:text-bliss-rose rounded-xl hover:bg-bliss-cream transition w-full"
                    >
                        <FiExternalLink size={14} />
                        <span>View Site</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-bliss-muted hover:text-red-400 rounded-xl hover:bg-bliss-cream transition w-full"
                    >
                        <FiLogOut size={14} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 lg:ml-0">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-bliss-bg/90 backdrop-blur-md border-b border-bliss-border">
                    <div className="flex items-center justify-between px-4 lg:px-6 h-14">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-bliss-muted hover:text-bliss-dark p-1.5 rounded-lg hover:bg-bliss-cream"
                            >
                                <FiMenu size={18} />
                            </button>
                            <div>
                                <h2 className="text-sm font-medium text-bliss-dark">
                                    {currentPage?.label || 'Admin'}
                                </h2>
                                <p className="text-[10px] text-bliss-muted hidden sm:block">
                                    {location.pathname === '/admin'
                                        ? 'Overview of your store'
                                        : `Manage ${currentPage?.label?.toLowerCase() || ''}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-bliss-dark font-medium">{user.name}</p>
                                <p className="text-[10px] text-bliss-muted">Administrator</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-bliss-rose/20 flex items-center justify-center text-bliss-rose text-xs font-semibold">
                                {user.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
