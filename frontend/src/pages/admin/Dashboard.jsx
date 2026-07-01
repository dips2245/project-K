import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, productAPI } from '../../hooks/api';
import {
    FiPackage, FiDollarSign, FiClock, FiShoppingBag,
    FiArrowUp, FiArrowDown, FiTruck, FiCheckCircle,
    FiAlertCircle, FiStar, FiEye, FiPlus, FiSettings,
    FiChevronRight, FiTrendingUp, FiUsers
} from 'react-icons/fi';

const statusColors = {
    pending: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Pending' },
    confirmed: { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400', label: 'Confirmed' },
    shipped: { bg: 'bg-purple-500/15', text: 'text-purple-400', dot: 'bg-purple-400', label: 'Shipped' },
    delivered: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Delivered' },
    cancelled: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400', label: 'Cancelled' },
};

const statsCardConfig = [
    {
        key: 'orders',
        label: 'Total Orders',
        icon: FiShoppingBag,
        gradient: 'from-bliss-rose/20 to-bliss-rose/5',
        iconBg: 'bg-bliss-rose/20',
        iconColor: 'text-bliss-rose',
        borderGlow: 'shadow-rose-500/5',
    },
    {
        key: 'revenue',
        label: 'Revenue',
        icon: FiDollarSign,
        gradient: 'from-emerald-500/20 to-emerald-500/5',
        iconBg: 'bg-emerald-500/20',
        iconColor: 'text-emerald-400',
        borderGlow: 'shadow-emerald-500/5',
        prefix: 'Rs. ',
    },
    {
        key: 'products',
        label: 'Products',
        icon: FiPackage,
        gradient: 'from-bliss-lavender/20 to-bliss-lavender/5',
        iconBg: 'bg-bliss-lavender/20',
        iconColor: 'text-bliss-lavender',
        borderGlow: 'shadow-bliss-lavender/5',
    },
    {
        key: 'pending',
        label: 'Pending Orders',
        icon: FiClock,
        gradient: 'from-amber-500/20 to-amber-500/5',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-400',
        borderGlow: 'shadow-amber-500/5',
    },
];

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
    }
    return days;
}

function groupOrdersByDay(orders) {
    const days = getLast7Days();
    const map = {};
    days.forEach((d) => { map[d] = 0; });
    orders.forEach((o) => {
        const day = o.createdAt?.slice(0, 10);
        if (map[day] !== undefined) map[day]++;
    });
    return days.map((d) => ({ date: d, count: map[d] || 0 }));
}

function getTopProducts(orders) {
    const count = {};
    orders.forEach((o) => {
        (o.items || []).forEach((item) => {
            const name = item.name?.en || item.name || 'Unknown';
            count[name] = (count[name] || 0) + (item.quantity || 1);
        });
    });
    return Object.entries(count)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 4);
}

const Dashboard = () => {
    const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0, pending: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [orderRes, prodRes] = await Promise.all([
                    orderAPI.getAll(),
                    productAPI.getAll({ limit: 100 }),
                ]);
                const orders = orderRes.data?.orders || [];
                const products = prodRes.data?.products || [];
                setAllOrders(orders);
                setAllProducts(products);
                setStats({
                    orders: orders.length,
                    products: products.length,
                    revenue: orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
                    pending: orders.filter((o) => o.status === 'pending').length,
                });
                setRecentOrders(orders.slice(0, 5));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const chartData = groupOrdersByDay(allOrders);
    const maxCount = Math.max(...chartData.map((d) => d.count), 1);
    const topProducts = getTopProducts(allOrders);
    const lowStockProducts = allProducts.filter((p) => p.stock > 0 && p.stock <= 10);
    const totalCustomers = new Set(allOrders.map((o) => o.user?._id).filter(Boolean)).size;
    const deliveredOrders = allOrders.filter((o) => o.status === 'delivered').length;

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-bliss-cream rounded-2xl animate-pulse" />
                    ))}
                </div>
                <div className="h-64 bg-bliss-cream rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="h-48 bg-bliss-cream rounded-2xl animate-pulse" />
                    <div className="h-48 bg-bliss-cream rounded-2xl animate-pulse" />
                </div>
            </div>
        );
    }

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    })();

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-semibold text-bliss-dark tracking-tight">
                        {greeting}, <span className="text-bliss-rose">Admin</span>
                    </h1>
                    <p className="text-bliss-muted text-sm mt-0.5">{today}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/admin/products" className="flex items-center gap-1.5 px-3.5 py-2 bg-bliss-rose/15 text-bliss-rose rounded-xl text-xs font-medium hover:bg-bliss-rose/25 transition">
                        <FiPlus size={13} /> New Product
                    </Link>
                    <Link to="/admin/orders" className="flex items-center gap-1.5 px-3.5 py-2 bg-bliss-cream text-bliss-text rounded-xl text-xs font-medium hover:bg-bliss-white transition border border-bliss-border">
                        <FiEye size={13} /> View Orders
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCardConfig.map((cfg) => {
                    const Icon = cfg.icon;
                    const rawValue = stats[cfg.key];
                    const displayValue = cfg.prefix
                        ? `${cfg.prefix}${rawValue.toLocaleString()}`
                        : rawValue.toLocaleString();
                    return (
                        <div
                            key={cfg.key}
                            className="relative group bg-bliss-white rounded-2xl border border-bliss-border p-5 hover:border-bliss-rose/30 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cfg.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            <div className="relative z-10">
                                <div className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center mb-3`}>
                                    <Icon className={cfg.iconColor} size={18} />
                                </div>
                                <p className="text-bliss-muted text-xs font-medium tracking-wide">{cfg.label}</p>
                                <p className="text-2xl font-semibold text-bliss-dark mt-0.5 tracking-tight">
                                    {displayValue}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Secondary Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-bliss-white/60 rounded-xl border border-bliss-border px-4 py-3 flex items-center gap-3">
                    <FiUsers className="text-bliss-rose shrink-0" size={16} />
                    <div>
                        <p className="text-[11px] text-bliss-muted font-medium uppercase tracking-wider">Customers</p>
                        <p className="text-bliss-dark font-semibold text-sm">{totalCustomers}</p>
                    </div>
                </div>
                <div className="bg-bliss-white/60 rounded-xl border border-bliss-border px-4 py-3 flex items-center gap-3">
                    <FiCheckCircle className="text-emerald-400 shrink-0" size={16} />
                    <div>
                        <p className="text-[11px] text-bliss-muted font-medium uppercase tracking-wider">Delivered</p>
                        <p className="text-bliss-dark font-semibold text-sm">{deliveredOrders}</p>
                    </div>
                </div>
                <div className="bg-bliss-white/60 rounded-xl border border-bliss-border px-4 py-3 flex items-center gap-3">
                    <FiAlertCircle className="text-amber-400 shrink-0" size={16} />
                    <div>
                        <p className="text-[11px] text-bliss-muted font-medium uppercase tracking-wider">Low Stock</p>
                        <p className="text-bliss-dark font-semibold text-sm">{lowStockProducts.length}</p>
                    </div>
                </div>
                <div className="bg-bliss-white/60 rounded-xl border border-bliss-border px-4 py-3 flex items-center gap-3">
                    <FiTrendingUp className="text-bliss-lavender shrink-0" size={16} />
                    <div>
                        <p className="text-[11px] text-bliss-muted font-medium uppercase tracking-wider">Avg Order</p>
                        <p className="text-bliss-dark font-semibold text-sm">
                            Rs. {allOrders.length > 0
                                ? (stats.revenue / allOrders.length).toFixed(0)
                                : '0'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sales Chart + Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Sales Overview Chart */}
                <div className="lg:col-span-2 bg-bliss-white rounded-2xl border border-bliss-border p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-bliss-dark font-medium text-sm">Sales Overview</h3>
                        <span className="text-[11px] text-bliss-muted">Last 7 days</span>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-40">
                        {chartData.map((day, idx) => {
                            const height = day.count > 0 ? Math.max((day.count / maxCount) * 100, 8) : 4;
                            return (
                                <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 group/chart">
                                    <span className="text-[10px] text-bliss-muted opacity-0 group-hover/chart:opacity-100 transition-opacity">
                                        {day.count}
                                    </span>
                                    <div className="w-full flex justify-center" style={{ height: '100%' }}>
                                        <div
                                            className="w-[70%] max-w-[32px] rounded-lg bg-gradient-to-t from-bliss-rose/80 to-bliss-rose/30 relative group-hover/chart:from-bliss-rose transition-all duration-300"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/chart:opacity-100 transition-opacity bg-bliss-dark text-bliss-bg text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap">
                                                {day.count} order{day.count !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-bliss-muted mt-1">{dayNames[idx]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="bg-bliss-white rounded-2xl border border-bliss-border p-5">
                    <h3 className="text-bliss-dark font-medium text-sm mb-4">Order Status</h3>
                    <div className="space-y-2.5">
                        {Object.entries(statusColors).map(([key, cfg]) => {
                            const count = allOrders.filter((o) => o.status === key).length;
                            const percentage = allOrders.length > 0
                                ? Math.round((count / allOrders.length) * 100)
                                : 0;
                            return (
                                <div key={key} className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
                                    <span className="text-xs text-bliss-text flex-1">{cfg.label}</span>
                                    <span className="text-xs text-bliss-muted w-8 text-right">{count}</span>
                                    <div className="w-16 h-1.5 bg-bliss-cream rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${cfg.dot}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {allOrders.length === 0 && (
                        <p className="text-center text-bliss-muted text-xs mt-6">No orders yet</p>
                    )}
                </div>
            </div>

            {/* Low Stock + Top Products + Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Low Stock Alerts */}
                <div className="bg-bliss-white rounded-2xl border border-bliss-border p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-bliss-dark font-medium text-sm flex items-center gap-2">
                            <FiAlertCircle className="text-amber-400" size={14} />
                            Low Stock Alerts
                        </h3>
                        <span className="text-[11px] text-bliss-muted">{lowStockProducts.length} items</span>
                    </div>
                    <div className="space-y-2">
                        {lowStockProducts.length === 0 ? (
                            <p className="text-bliss-muted text-xs text-center py-6">All products are well-stocked</p>
                        ) : (
                            lowStockProducts.slice(0, 4).map((p) => (
                                <div key={p._id} className="flex items-center gap-3 bg-bliss-cream/50 rounded-xl px-3 py-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-bliss-bg overflow-hidden shrink-0">
                                        <img
                                            src={p.images?.[0] || '/placeholder.png'}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-bliss-dark truncate">{p.name?.en || p.name}</p>
                                        <p className="text-[11px] text-bliss-muted">Stock: {p.stock}</p>
                                    </div>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.stock <= 3 ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                        {p.stock <= 3 ? 'Critical' : 'Low'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    {lowStockProducts.length > 4 && (
                        <Link to="/admin/products" className="block text-center text-[11px] text-bliss-rose hover:underline mt-3">
                            View all {lowStockProducts.length} low stock items
                        </Link>
                    )}
                </div>

                {/* Top Selling Products */}
                <div className="bg-bliss-white rounded-2xl border border-bliss-border p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-bliss-dark font-medium text-sm flex items-center gap-2">
                            <FiStar className="text-bliss-star" size={14} />
                            Top Products
                        </h3>
                        <span className="text-[11px] text-bliss-muted">By orders</span>
                    </div>
                    <div className="space-y-2">
                        {topProducts.length === 0 ? (
                            <p className="text-bliss-muted text-xs text-center py-6">No products sold yet</p>
                        ) : (
                            topProducts.map((item, idx) => {
                                const rankColors = [
                                    'text-amber-400',
                                    'text-gray-300',
                                    'text-amber-600',
                                    'text-bliss-muted',
                                ];
                                return (
                                    <div key={item.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bliss-cream/50 transition">
                                        <span className={`w-5 text-center text-xs font-bold ${rankColors[idx] || 'text-bliss-muted'}`}>
                                            #{idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-bliss-dark truncate">{item.name}</p>
                                        </div>
                                        <span className="text-[10px] text-bliss-muted font-medium">{item.qty} sold</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-bliss-white rounded-2xl border border-bliss-border p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-bliss-dark font-medium text-sm flex items-center gap-2">
                            <FiTruck className="text-bliss-rose" size={14} />
                            Recent Orders
                        </h3>
                        <Link to="/admin/orders" className="text-[11px] text-bliss-rose hover:underline flex items-center gap-0.5">
                            View all <FiChevronRight size={11} />
                        </Link>
                    </div>
                    <div className="space-y-1.5">
                        {recentOrders.length === 0 ? (
                            <p className="text-bliss-muted text-xs text-center py-6">No orders placed yet</p>
                        ) : (
                            recentOrders.map((o) => {
                                const sc = statusColors[o.status] || statusColors.pending;
                                return (
                                    <div key={o._id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bliss-cream/50 transition">
                                        <div className="w-8 h-8 rounded-lg bg-bliss-cream flex items-center justify-center shrink-0">
                                            <FiShoppingBag className="text-bliss-muted" size={13} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-bliss-dark font-medium">#{o.orderNumber}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                                                    {sc.label}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-bliss-muted truncate mt-0.5">
                                                {o.user?.name || 'Guest'} — Rs. {o.totalAmount?.toLocaleString()}
                                            </p>
                                        </div>
                                        <span className="text-[10px] text-bliss-muted shrink-0">
                                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
