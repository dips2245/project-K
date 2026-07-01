import { useState, useEffect } from 'react';
import { orderAPI } from '../../hooks/api';
import {
    FiChevronDown, FiChevronUp, FiMapPin, FiPhone,
    FiUser, FiDollarSign, FiShoppingBag, FiTruck,
    FiSearch, FiRefreshCw
} from 'react-icons/fi';

const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400', border: 'border-l-amber-400' },
    confirmed: { label: 'Confirmed', bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400', border: 'border-l-blue-400' },
    shipped: { label: 'Shipped', bg: 'bg-purple-500/15', text: 'text-purple-400', dot: 'bg-purple-400', border: 'border-l-purple-400' },
    delivered: { label: 'Delivered', bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-l-emerald-400' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400', border: 'border-l-red-400' },
};

const statusFlow = ['pending', 'confirmed', 'shipped', 'delivered'];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await orderAPI.getAll();
            setOrders(data?.orders || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await orderAPI.updateStatus(id, status);
            fetchOrders();
        } catch (e) {
            alert('Failed to update status');
        }
    };

    const statuses = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    const filtered = orders.filter((o) => {
        const matchFilter = filter === 'all' || o.status === filter;
        const matchSearch = !search ||
            (o.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
            (o.user?.name || '').toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-bliss-dark">Orders</h1>
                    <p className="text-sm text-bliss-muted">{orders.length} total orders</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-bliss-muted" size={14} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search orders..."
                            className="pl-8 pr-3 py-2 bg-bliss-white border border-bliss-border rounded-xl text-sm text-bliss-text focus:outline-none focus:border-bliss-rose w-full sm:w-48"
                        />
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="p-2 bg-bliss-cream text-bliss-muted hover:text-bliss-dark rounded-xl hover:bg-bliss-white border border-bliss-border transition"
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1.5 flex-wrap pb-1">
                {statuses.map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 
                            ${filter === s
                                ? 'bg-bliss-rose/15 text-bliss-rose border border-bliss-rose/30'
                                : 'bg-bliss-white text-bliss-muted border border-bliss-border hover:border-bliss-muted hover:text-bliss-text'
                            }`}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                        {s !== 'all' && (
                            <span className="ml-1.5 text-[10px] opacity-70">
                                ({orders.filter((o) => o.status === s).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-bliss-cream rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <FiShoppingBag className="mx-auto text-bliss-muted/40 mb-3" size={36} />
                    <p className="text-bliss-muted text-sm">No orders found</p>
                    {filter !== 'all' && (
                        <button
                            onClick={() => setFilter('all')}
                            className="text-bliss-rose text-xs hover:underline mt-2"
                        >
                            Clear filter
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-2.5">
                    {filtered.map((o) => {
                        const sc = statusConfig[o.status] || statusConfig.pending;
                        const isExpanded = expandedId === o._id;
                        const progress = statusFlow.indexOf(o.status) + 1;
                        const progressPct = statusFlow.indexOf(o.status) >= 0
                            ? ((statusFlow.indexOf(o.status) + 1) / statusFlow.length) * 100
                            : o.status === 'cancelled' ? 0 : 100;

                        return (
                            <div
                                key={o._id}
                                className={`bg-bliss-white rounded-2xl border border-bliss-border border-l-2 ${sc.border} overflow-hidden transition-all duration-200 hover:border-bliss-rose/30`}
                            >
                                {/* Order Header */}
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer select-none"
                                    onClick={() => toggleExpand(o._id)}
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className={`w-9 h-9 rounded-xl ${sc.bg} flex items-center justify-center shrink-0`}>
                                            <FiShoppingBag className={sc.text} size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-bliss-dark">
                                                    #{o.orderNumber}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}`}>
                                                    {sc.label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-bliss-muted mt-0.5">
                                                {o.user?.name || 'Guest'} — {new Date(o.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-semibold text-bliss-dark">
                                                Rs. {o.totalAmount?.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-bliss-muted">{o.items?.length || 0} items</p>
                                        </div>
                                        {isExpanded ? (
                                            <FiChevronUp className="text-bliss-muted" size={16} />
                                        ) : (
                                            <FiChevronDown className="text-bliss-muted" size={16} />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-bliss-border px-4 py-4 space-y-4 bg-bliss-cream/20">
                                        {/* Status Progress */}
                                        {o.status !== 'cancelled' && (
                                            <div className="bg-bliss-cream/50 rounded-xl p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    {statusFlow.map((s, idx) => {
                                                        const cfg = statusConfig[s];
                                                        const isReached = statusFlow.indexOf(o.status) >= idx;
                                                        return (
                                                            <div key={s} className="flex items-center gap-1.5">
                                                                <span className={`w-2 h-2 rounded-full ${isReached ? cfg.dot : 'bg-bliss-border'}`} />
                                                                <span className={`text-[10px] ${isReached ? cfg.text : 'text-bliss-muted'}`}>
                                                                    {cfg.label}
                                                                </span>
                                                                {idx < statusFlow.length - 1 && (
                                                                    <span className="text-bliss-border mx-1">—</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="w-full h-1 bg-bliss-border rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${sc.dot.replace('bg-', 'bg-')}`}
                                                        style={{ width: `${Math.max(progressPct, 25)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Order Details Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                            {/* Customer */}
                                            <div className="bg-bliss-cream/30 rounded-xl p-3">
                                                <p className="text-[10px] text-bliss-muted uppercase font-semibold tracking-wider flex items-center gap-1.5 mb-1.5">
                                                    <FiUser size={11} /> Customer
                                                </p>
                                                <p className="text-sm text-bliss-dark font-medium">{o.user?.name || 'Guest'}</p>
                                                <p className="text-xs text-bliss-muted">{o.user?.email || '—'}</p>
                                            </div>

                                            {/* Shipping */}
                                            <div className="bg-bliss-cream/30 rounded-xl p-3">
                                                <p className="text-[10px] text-bliss-muted uppercase font-semibold tracking-wider flex items-center gap-1.5 mb-1.5">
                                                    <FiMapPin size={11} /> Shipping
                                                </p>
                                                <p className="text-xs text-bliss-text">
                                                    {o.shippingAddress?.address || '—'}
                                                </p>
                                                <p className="text-xs text-bliss-muted">
                                                    {o.shippingAddress?.city || ''}{o.shippingAddress?.city && ', '}{o.shippingAddress?.country || ''}
                                                </p>
                                            </div>

                                            {/* Contact */}
                                            <div className="bg-bliss-cream/30 rounded-xl p-3">
                                                <p className="text-[10px] text-bliss-muted uppercase font-semibold tracking-wider flex items-center gap-1.5 mb-1.5">
                                                    <FiPhone size={11} /> Contact
                                                </p>
                                                <p className="text-xs text-bliss-text">{o.shippingAddress?.phone || '—'}</p>
                                                <p className="text-xs text-bliss-muted">{o.user?.email || ''}</p>
                                            </div>

                                            {/* Payment */}
                                            <div className="bg-bliss-cream/30 rounded-xl p-3">
                                                <p className="text-[10px] text-bliss-muted uppercase font-semibold tracking-wider flex items-center gap-1.5 mb-1.5">
                                                    <FiDollarSign size={11} /> Payment
                                                </p>
                                                <p className="text-sm text-bliss-dark font-semibold">Rs. {o.totalAmount?.toLocaleString()}</p>
                                                <p className="text-xs text-bliss-muted">{o.paymentMethod?.toUpperCase() || '—'}</p>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        {o.items && o.items.length > 0 && (
                                            <div className="bg-bliss-cream/30 rounded-xl p-3">
                                                <p className="text-[10px] text-bliss-muted uppercase font-semibold tracking-wider flex items-center gap-1.5 mb-2">
                                                    <FiShoppingBag size={11} /> Items ({o.items.length})
                                                </p>
                                                <div className="space-y-1.5">
                                                    {o.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between text-xs">
                                                            <span className="text-bliss-text">
                                                                {item.name?.en || item.name || 'Product'} <span className="text-bliss-muted">×{item.quantity}</span>
                                                            </span>
                                                            <span className="text-bliss-dark font-medium">
                                                            Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {o.shippingCost ? (
                                                        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-bliss-border">
                                                            <span className="text-bliss-muted">Shipping</span>
                                                            <span className="text-bliss-text">Rs. {o.shippingCost}</span>
                                                        </div>
                                                    ) : null}
                                                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-bliss-border font-medium">
                                                        <span className="text-bliss-dark">Total</span>
                                                        <span className="text-bliss-rose font-semibold">Rs. {o.totalAmount?.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Status Update */}
                                        <div className="flex items-center gap-3 pt-1">
                                            <span className="text-[11px] text-bliss-muted uppercase tracking-wider font-semibold">Update Status:</span>
                                            <select
                                                value={o.status}
                                                onChange={(e) => updateStatus(o._id, e.target.value)}
                                                className="bg-bliss-white border border-bliss-border rounded-xl px-3 py-1.5 text-xs text-bliss-text focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10"
                                            >
                                                {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => {
                                                    const cfg = statusConfig[s];
                                                    return (
                                                        <option key={s} value={s}>
                                                            {cfg.label}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
