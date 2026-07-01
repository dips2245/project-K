import { useState, useEffect } from 'react';
import { categoryAPI } from '../../hooks/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiFolder, FiPackage } from 'react-icons/fi';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ 'name.en': '', 'name.ne': '', 'description.en': '', 'description.ne': '' });

    useEffect(() => { fetchCategories(); }, []);
    const fetchCategories = async () => {
        try {
            const { data } = await categoryAPI.getAll();
            setCategories(data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ 'name.en': '', 'name.ne': '', 'description.en': '', 'description.ne': '' });
        setShowModal(true);
    };

    const openEdit = (c) => {
        setEditing(c);
        setForm({
            'name.en': c.name.en, 'name.ne': c.name.ne || '',
            'description.en': c.description?.en || '',
            'description.ne': c.description?.ne || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: { en: form['name.en'], ne: form['name.ne'] },
            description: { en: form['description.en'], ne: form['description.ne'] }
        };
        try {
            if (editing) await categoryAPI.update(editing._id, data);
            else await categoryAPI.create(data);
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category?')) {
            try {
                await categoryAPI.delete(id);
                fetchCategories();
            } catch (e) { alert('Delete failed'); }
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-bliss-dark">Categories</h1>
                    <p className="text-sm text-bliss-muted">{categories.length} total categories</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-1.5 px-4 py-2 bg-bliss-rose text-white rounded-xl text-sm font-medium hover:bg-bliss-rose/90 transition shadow-lg shadow-bliss-rose/20"
                >
                    <FiPlus size={14} /> Add Category
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-32 bg-bliss-cream rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-16">
                    <FiFolder className="mx-auto text-bliss-muted/40 mb-3" size={40} />
                    <p className="text-bliss-muted text-sm">No categories yet</p>
                    <button onClick={openCreate} className="text-bliss-rose text-xs hover:underline mt-2">
                        Create your first category
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((c) => (
                        <div
                            key={c._id}
                            className="bg-bliss-white rounded-2xl border border-bliss-border p-5 hover:border-bliss-rose/30 hover:shadow-lg hover:shadow-bliss-rose/5 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-bliss-rose/10 flex items-center justify-center group-hover:bg-bliss-rose/20 transition-colors">
                                    <FiFolder className="text-bliss-rose" size={18} />
                                </div>
                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(c)}
                                        className="text-bliss-muted hover:text-bliss-rose p-1.5 bg-bliss-cream rounded-lg hover:bg-bliss-rose/10 transition"
                                    >
                                        <FiEdit2 size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(c._id)}
                                        className="text-bliss-muted hover:text-red-400 p-1.5 bg-bliss-cream rounded-lg hover:bg-red-500/10 transition"
                                    >
                                        <FiTrash2 size={12} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-bliss-dark">{c.name.en}</h3>
                            <p className="text-xs text-bliss-muted mt-0.5">{c.name.ne || '—'}</p>
                            <p className="text-xs text-bliss-muted mt-1.5 leading-relaxed">
                                {c.description?.en || 'No description'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Category Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
                    <div className="bg-bliss-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-bliss-border">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-semibold text-bliss-dark">
                                {editing ? 'Edit Category' : 'New Category'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-bliss-muted hover:text-bliss-dark p-1 rounded-lg hover:bg-bliss-cream"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {[
                                { name: 'name.en', label: 'Name (English)', required: true },
                                { name: 'name.ne', label: 'Name (Nepali)', required: false },
                                { name: 'description.en', label: 'Description (English)', required: false },
                                { name: 'description.ne', label: 'Description (Nepali)', required: false },
                            ].map((f) => (
                                <div key={f.name}>
                                    <label className="text-bliss-dark text-xs font-medium mb-1 block">{f.label}</label>
                                    <input
                                        type="text"
                                        value={form[f.name]}
                                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                                        required={f.required}
                                        className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10"
                                    />
                                </div>
                            ))}
                            <button
                                type="submit"
                                className="w-full py-2.5 bg-bliss-rose text-white rounded-xl font-medium hover:bg-bliss-rose/90 transition text-sm mt-2"
                            >
                                {editing ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
