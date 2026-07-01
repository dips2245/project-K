import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../hooks/api';
import {
    FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUpload,
    FiChevronLeft, FiChevronRight, FiPackage, FiAlertCircle
} from 'react-icons/fi';

const ITEMS_PER_PAGE = 12;

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const [form, setForm] = useState({
        'name.en': '', 'name.ne': '',
        'description.en': '', 'description.ne': '',
        price: '', comparePrice: '', category: '',
        tags: '', stock: '', featured: false, theme: 'default',
    });

    const [specs, setSpecs] = useState({
        materials: '', finish: '', frequency: '', battery: '',
        charging: '', userTime: '', noiseLevel: '', size: '', weight: ''
    });

    const [colors, setColors] = useState([]);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#D4736E');
    const [existingImages, setExistingImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);

    useEffect(() => {
        fetchProducts();
        categoryAPI.getAll()
            .then((r) => setCategories(r.data))
            .catch(() => { });
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await productAPI.getAll({ limit: 200 });
            setProducts(data.products || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            'name.en': '', 'name.ne': '',
            'description.en': '', 'description.ne': '',
            price: '', comparePrice: '', category: '',
            tags: '', stock: '', featured: false, theme: 'default',
        });
        setSpecs({
            materials: '', finish: '', frequency: '', battery: '',
            charging: '', userTime: '', noiseLevel: '', size: '', weight: ''
        });
        setColors([]);
        setNewColorName('');
        setNewColorHex('#D4736E');
        setExistingImages([]);
        setSelectedFiles([]);
        setFilePreviews([]);
    };

    const openCreate = () => { resetForm(); setEditing(null); setShowModal(true); };

    const openEdit = (p) => {
        resetForm();
        setEditing(p);
        setForm({
            'name.en': p.name.en, 'name.ne': p.name.ne || '',
            'description.en': p.description?.en || '', 'description.ne': p.description?.ne || '',
            price: p.price, comparePrice: p.comparePrice || '',
            category: p.category?._id || p.category || '',
            tags: (p.tags || []).join(', '), stock: p.stock,
            featured: p.featured || false, theme: p.theme || 'default',
        });
        setSpecs({
            materials: p.specifications?.materials || '', finish: p.specifications?.finish || '',
            frequency: p.specifications?.frequency || '', battery: p.specifications?.battery || '',
            charging: p.specifications?.charging || '', userTime: p.specifications?.userTime || '',
            noiseLevel: p.specifications?.noiseLevel || '', size: p.specifications?.size || '',
            weight: p.specifications?.weight || ''
        });
        setColors(p.colors || []);
        setExistingImages(p.images || []);
        setShowModal(true);
    };

    const addColor = () => {
        if (!newColorName.trim()) return;
        setColors([...colors, { name: newColorName, hex: newColorHex }]);
        setNewColorName('');
    };

    const removeColor = (index) => setColors(colors.filter((_, i) => i !== index));

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles([...selectedFiles, ...files]);
        setFilePreviews([...filePreviews, ...files.map((f) => URL.createObjectURL(f))]);
    };

    const removeNewFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
        setFilePreviews(filePreviews.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => setExistingImages(existingImages.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            name: { en: form['name.en'], ne: form['name.ne'] },
            description: { en: form['description.en'], ne: form['description.ne'] },
            price: Number(form.price),
            comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
            category: form.category || undefined,
            tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
            stock: Number(form.stock),
            featured: form.featured,
            theme: form.theme,
            specifications: specs,
            colors: colors,
            existingImages: existingImages
        };
        const formData = new FormData();
        formData.append('productData', JSON.stringify(productData));
        selectedFiles.forEach((file) => formData.append('images', file));
        try {
            if (editing) await productAPI.update(editing._id, formData);
            else await productAPI.create(formData);
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            try {
                await productAPI.delete(id);
                fetchProducts();
            } catch (e) { alert('Delete failed'); }
        }
    };

    const filtered = products.filter((p) =>
        p.name.en.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    useEffect(() => { setPage(1); }, [search]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-bliss-dark">Products</h1>
                    <p className="text-sm text-bliss-muted">{products.length} total products</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-bliss-muted" size={14} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="pl-8 pr-3 py-2 bg-bliss-white border border-bliss-border rounded-xl text-sm text-bliss-text focus:outline-none focus:border-bliss-rose w-full sm:w-48"
                        />
                    </div>
                    <button onClick={openCreate} className="flex items-center justify-center gap-1.5 px-4 py-2 bg-bliss-rose text-white rounded-xl text-sm font-medium hover:bg-bliss-rose/90 transition shadow-lg shadow-bliss-rose/20">
                        <FiPlus size={14} /> Add Product
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-48 bg-bliss-cream rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <FiPackage className="mx-auto text-bliss-muted/40 mb-3" size={40} />
                    <p className="text-bliss-muted text-sm">No products found</p>
                    {search && <p className="text-xs text-bliss-muted mt-1">Try a different search term</p>}
                    {!search && (
                        <button onClick={openCreate} className="text-bliss-rose text-xs hover:underline mt-2">
                            Add your first product
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {paginated.map((p) => {
                            const isLowStock = p.stock > 0 && p.stock <= 10;
                            const outOfStock = p.stock <= 0;
                            return (
                                <div
                                    key={p._id}
                                    className="group bg-bliss-white rounded-2xl border border-bliss-border overflow-hidden hover:border-bliss-rose/30 hover:shadow-lg hover:shadow-bliss-rose/5 transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative h-40 bg-bliss-cream overflow-hidden">
                                        <img
                                            src={p.images?.[0] || 'https://placehold.co/200x160/1a1a1a/888888?text=No+Image'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            alt=""
                                        />
                                        {p.featured && (
                                            <span className="absolute top-2 left-2 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-bliss-star/90 text-black">
                                                Featured
                                            </span>
                                        )}
                                        {outOfStock && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-xs font-semibold text-white bg-red-500/80 px-3 py-1 rounded-full">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                        {isLowStock && !outOfStock && (
                                            <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 backdrop-blur-xs">
                                                <FiAlertCircle size={9} /> {p.stock} left
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-3.5 space-y-2">
                                        <div>
                                            <h3 className="text-sm font-medium text-bliss-dark truncate">{p.name.en}</h3>
                                            <p className="text-[10px] text-bliss-muted truncate">{p.name.ne || ''}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-semibold text-bliss-dark">
                                                    Rs. {(p.price || 0).toLocaleString()}
                                                </span>
                                                {p.comparePrice && (
                                                    <span className="text-[10px] text-bliss-muted line-through ml-1.5">
                                                        Rs. {(p.comparePrice || 0).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {p.stock > 0 ? `${p.stock} in stock` : 'Out'}
                                            </span>
                                        </div>

                                        {/* Theme Tag */}
                                        <div className="flex items-center gap-2 pt-1">
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-bliss-cream text-bliss-muted">
                                                {p.theme || 'default'}
                                            </span>
                                            {p.tags?.slice(0, 2).map((tag) => (
                                                <span key={tag} className="text-[10px] text-bliss-rose">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1.5 pt-1">
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="flex-1 flex items-center justify-center gap-1 py-2 bg-bliss-cream hover:bg-bliss-rose/10 text-bliss-text hover:text-bliss-rose rounded-xl text-xs transition"
                                            >
                                                <FiEdit2 size={12} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="flex items-center justify-center gap-1 py-2 px-3 bg-bliss-cream hover:bg-red-500/10 text-bliss-muted hover:text-red-400 rounded-xl text-xs transition"
                                            >
                                                <FiTrash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-bliss-muted">
                                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-xl bg-bliss-white border border-bliss-border text-bliss-muted hover:text-bliss-dark hover:border-bliss-rose/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                >
                                    <FiChevronLeft size={14} />
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-8 h-8 rounded-xl text-xs font-medium transition ${page === pageNum
                                                ? 'bg-bliss-rose/15 text-bliss-rose border border-bliss-rose/30'
                                                : 'bg-bliss-white border border-bliss-border text-bliss-muted hover:text-bliss-dark hover:border-bliss-muted'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-xl bg-bliss-white border border-bliss-border text-bliss-muted hover:text-bliss-dark hover:border-bliss-rose/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                >
                                    <FiChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
                    <div className="bg-bliss-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-bliss-border">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-bliss-border">
                            <h3 className="text-lg font-semibold text-bliss-dark">{editing ? 'Edit Product' : 'New Product'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-bliss-muted hover:text-bliss-dark p-1 rounded-lg hover:bg-bliss-cream"><FiX size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-bliss-dark font-medium text-xs uppercase mb-1.5 block">Name (English)</label>
                                    <input type="text" value={form['name.en']} onChange={(e) => setForm({ ...form, 'name.en': e.target.value })} required className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10" />
                                </div>
                                <div>
                                    <label className="text-bliss-dark font-medium text-xs uppercase mb-1.5 block">Name (Nepali)</label>
                                    <input type="text" value={form['name.ne']} onChange={(e) => setForm({ ...form, 'name.ne': e.target.value })} className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-bliss-dark font-medium text-xs uppercase mb-1.5 block">Description (English)</label>
                                    <textarea value={form['description.en']} onChange={(e) => setForm({ ...form, 'description.en': e.target.value })} required rows={3} className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10" />
                                </div>
                                <div>
                                    <label className="text-bliss-dark font-medium text-xs uppercase mb-1.5 block">Description (Nepali)</label>
                                    <textarea value={form['description.ne']} onChange={(e) => setForm({ ...form, 'description.ne': e.target.value })} rows={3} className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-bliss-dark font-medium text-xs uppercase mb-1.5 block">Price (Rs.)</label>
                                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10" />
                                </div>
                                <div>
                                    <label className="text-bliss-dark font-medium text-xs uppercase mb-1.5 block">Compare Price</label>
                                    <input type="number" step="0.01" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10" />
                                </div>
                                <div>
                                    <label className="text-bliss-dark font-medium text-xs uppercase mb-1.5 block">Stock Quantity</label>
                                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-bliss-dark font-medium text-xs uppercase mb-1.5 block">Category</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10"><option value="">None</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name.en}</option>)}</select>
                                </div>
                                <div>
                                    <label className="text-bliss-dark font-medium text-xs uppercase mb-1.5 block">Tags (comma separated)</label>
                                    <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10" />
                                </div>
                                <div>
                                    <label className="text-bliss-dark font-medium text-xs uppercase mb-1.5 block">Product Theme Look</label>
                                    <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose focus:ring-2 focus:ring-bliss-rose/10">
                                        <option value="default">Default White Theme</option>
                                        <option value="dark">Luxury Charcoal Dark</option>
                                        <option value="gold">Royal Dark Gold</option>
                                        <option value="champagne">Creamy Champagne Gold</option>
                                        <option value="rose-gold">Warm Rose Gold</option>
                                        <option value="midnight">Deep Midnight Blue</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border border-dashed border-bliss-border rounded-xl p-4 space-y-3 bg-bliss-cream/10">
                                <span className="text-bliss-dark font-medium text-xs uppercase block">Product Media (Up to 5 images)</span>
                                {existingImages.length > 0 && (
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] text-bliss-muted">Active product images:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {existingImages.map((imgUrl, i) => (
                                                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-bliss-border">
                                                    <img src={imgUrl} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0.5 right-0.5 w-4.5 h-4.5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500"><FiX size={10} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {filePreviews.length > 0 && (
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] text-bliss-muted">New files to upload:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {filePreviews.map((preview, i) => (
                                                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-bliss-border bg-bliss-cream">
                                                    <img src={preview} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeNewFile(i)} className="absolute top-0.5 right-0.5 w-4.5 h-4.5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500"><FiX size={10} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-bliss-border border-dashed rounded-xl cursor-pointer bg-bliss-white hover:bg-bliss-cream/30 transition">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FiUpload className="text-bliss-muted mb-2" size={20} />
                                            <p className="text-xs text-bliss-muted"><span className="font-semibold text-bliss-rose">Click to upload</span> or drag and drop</p>
                                            <p className="text-[10px] text-bliss-muted/70 mt-0.5">PNG, JPG, WEBP (Max 5MB)</p>
                                        </div>
                                        <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <div className="border border-bliss-border rounded-xl p-4 bg-bliss-cream/10 space-y-3">
                                <span className="text-bliss-dark font-medium text-xs uppercase block">Product Color Swatches</span>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Color name (e.g. Blush Pink)" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} className="flex-1 bg-bliss-white border border-bliss-border rounded-xl px-3 py-2 text-bliss-text text-sm focus:outline-none focus:border-bliss-rose" />
                                    <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className="w-10 h-9 rounded-xl border border-bliss-border p-1 bg-white cursor-pointer" />
                                    <button type="button" onClick={addColor} className="px-4 bg-bliss-dark text-bliss-bg rounded-xl hover:bg-bliss-dark/95 text-xs font-semibold">Add</button>
                                </div>
                                {colors.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {colors.map((c, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-bliss-bg border border-bliss-border rounded-full text-xs font-medium text-bliss-text shadow-sm">
                                                <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: c.hex }} />
                                                {c.name}
                                                <button type="button" onClick={() => removeColor(idx)} className="text-bliss-muted hover:text-red-500 ml-1 p-0.5 rounded-full"><FiX size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border border-bliss-border rounded-xl p-4 bg-bliss-cream/10 space-y-4">
                                <span className="text-bliss-dark font-medium text-xs uppercase block">Technical Specifications</span>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.keys(specs).map((specKey) => (
                                        <div key={specKey}>
                                            <label className="text-bliss-muted text-[10px] uppercase font-semibold mb-1 block">
                                                {specKey.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                                            </label>
                                            <input type="text" value={specs[specKey]} onChange={(e) => setSpecs({ ...specs, [specKey]: e.target.value })} placeholder="e.g. Body-safe silicone" className="w-full bg-bliss-white border border-bliss-border rounded-xl px-3 py-1.5 text-bliss-text text-xs focus:outline-none focus:border-bliss-rose" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <label className="flex items-center gap-2 pt-2">
                                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-bliss-rose w-4 h-4 rounded-sm" />
                                <span className="text-bliss-text text-sm">Feature this product on the Landing Page</span>
                            </label>

                            <button type="submit" className="w-full py-3.5 bg-bliss-rose text-white rounded-xl font-medium hover:bg-bliss-rose/90 transition text-sm tracking-wide shadow-lg shadow-bliss-rose/20">
                                {editing ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
