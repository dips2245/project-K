import { useState, useEffect } from 'react';
import { adminAPI } from '../../hooks/api';
import { FiSearch, FiTrash2, FiEdit2, FiChevronLeft, FiChevronRight, FiShield } from 'react-icons/fi';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchUsers = async (p = 1) => {
        setLoading(true);
        try {
            const { data } = await adminAPI.getUsers({ page: p, search, limit: 20 });
            setUsers(data.users || []);
            setTotalPages(data.totalPages || 1);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers(1);
    };

    const openDetail = async (user) => {
        setSelectedUser(user);
        setDetailLoading(true);
        try {
            const { data } = await adminAPI.getUser(user._id);
            setUserDetail(data);
        } catch (e) {
            console.error(e);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return;
        try {
            await adminAPI.deleteUser(id);
            if (selectedUser?._id === id) { setSelectedUser(null); setUserDetail(null); }
            fetchUsers(page);
        } catch (e) {
            alert(e.response?.data?.message || 'Delete failed');
        }
    };

    const handleRoleToggle = async (user) => {
        const newRole = user.role === 'admin' ? 'customer' : 'admin';
        try {
            await adminAPI.updateUser(user._id, { role: newRole });
            fetchUsers(page);
            if (selectedUser?._id === user._id) openDetail(user);
        } catch (e) {
            alert(e.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-bliss-dark">Users</h1>
                    <p className="text-xs text-bliss-muted mt-0.5">Manage registered users</p>
                </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                    <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-bliss-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full bg-bliss-white border border-bliss-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-bliss-dark focus:outline-none focus:border-bliss-rose"
                    />
                </div>
                <button type="submit" className="px-4 py-2.5 bg-bliss-rose text-white rounded-xl text-sm font-medium hover:bg-bliss-rose/90 transition">Search</button>
            </form>

            {selectedUser && userDetail ? (
                /* ── User Detail View ── */
                <div className="bg-bliss-white rounded-xl border border-bliss-border overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-bliss-border">
                        <button onClick={() => { setSelectedUser(null); setUserDetail(null); }} className="flex items-center gap-1 text-sm text-bliss-rose hover:underline">
                            <FiChevronLeft size={16} /> Back
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => handleRoleToggle(userDetail)} className="px-3 py-1.5 text-xs rounded-lg border border-bliss-border text-bliss-text hover:bg-bliss-cream transition flex items-center gap-1">
                                <FiShield size={12} /> Toggle Role
                            </button>
                            <button onClick={() => handleDelete(userDetail._id)} className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center gap-1">
                                <FiTrash2 size={12} /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-6">
                        {/* User Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Name', value: userDetail.name },
                                { label: 'Email', value: userDetail.email },
                                { label: 'Role', value: <span className={`capitalize ${userDetail.role === 'admin' ? 'text-bliss-rose font-semibold' : ''}`}>{userDetail.role}</span> },
                                { label: 'Phone', value: userDetail.phone || '—' },
                                { label: 'Verified', value: userDetail.isVerified ? 'Yes' : 'No' },
                                { label: 'Terms Accepted', value: userDetail.termsAccepted ? 'Yes' : 'No' },
                                { label: 'Joined', value: new Date(userDetail.createdAt).toLocaleDateString() },
                            ].map(f => (
                                <div key={f.label}>
                                    <p className="text-[11px] text-bliss-muted uppercase tracking-wider font-medium">{f.label}</p>
                                    <p className="text-sm text-bliss-dark mt-0.5">{f.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Favorites */}
                        <div>
                            <h3 className="text-sm font-semibold text-bliss-dark mb-2">Favorites ({userDetail.favoriteProducts?.length || 0})</h3>
                            {userDetail.favoriteProducts?.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {userDetail.favoriteProducts.map(p => (
                                        <div key={p.id} className="bg-bliss-cream rounded-xl p-3 flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-bliss-white overflow-hidden flex-shrink-0">
                                                <img src={p.images?.[0] || '/uploads/rose_petal_massager.png'} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-bliss-dark font-medium truncate">{p.nameEn}</p>
                                                <p className="text-[11px] text-bliss-muted">Rs. {p.price?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-bliss-muted">No favorites yet</p>
                            )}
                        </div>

                        {/* Orders */}
                        <div>
                            <h3 className="text-sm font-semibold text-bliss-dark mb-2">Orders ({userDetail.orders?.length || 0})</h3>
                            {userDetail.orders?.length > 0 ? (
                                <div className="space-y-2">
                                    {userDetail.orders.map(o => (
                                        <div key={o._id} className="bg-bliss-cream rounded-xl p-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-bliss-dark font-medium">{o.orderNumber}</p>
                                                <p className="text-[11px] text-bliss-muted">{new Date(o.createdAt).toLocaleDateString()} · {o.items?.length || 0} items</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-bliss-dark font-semibold">Rs. {o.totalAmount?.toLocaleString()}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-bliss-muted">No orders yet</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* ── Users List ── */
                <div className="bg-bliss-white rounded-xl border border-bliss-border overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-sm text-bliss-muted">Loading...</div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-sm text-bliss-muted">No users found</div>
                    ) : (
                        <div className="divide-y divide-bliss-border">
                            {users.map(u => (
                                <div key={u._id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-bliss-cream transition cursor-pointer" onClick={() => openDetail(u)}>
                                    <div className="w-9 h-9 rounded-full bg-bliss-rose/10 flex items-center justify-center text-bliss-rose text-xs font-semibold flex-shrink-0">
                                        {u.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-bliss-dark font-medium truncate">{u.name}</p>
                                            {u.role === 'admin' && <span className="text-[10px] text-bliss-rose bg-bliss-rose/10 px-1.5 py-0.5 rounded font-medium">Admin</span>}
                                        </div>
                                        <p className="text-xs text-bliss-muted truncate">{u.email}</p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-bliss-text">{u.orderCount} orders</p>
                                        <p className="text-[11px] text-bliss-muted">{new Date(u.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {u.isVerified ? 'Verified' : 'Pending'}
                                        </span>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(u._id); }} className="p-1.5 text-bliss-muted hover:text-red-500 transition">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-bliss-border">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="flex items-center gap-1 text-sm text-bliss-muted hover:text-bliss-dark disabled:opacity-30 disabled:cursor-not-allowed">
                                <FiChevronLeft size={15} /> Previous
                            </button>
                            <span className="text-xs text-bliss-muted">Page {page} of {totalPages}</span>
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="flex items-center gap-1 text-sm text-bliss-muted hover:text-bliss-dark disabled:opacity-30 disabled:cursor-not-allowed">
                                Next <FiChevronRight size={15} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
