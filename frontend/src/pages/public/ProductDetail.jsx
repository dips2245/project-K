import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShoppingBag, FiMinus, FiPlus, FiChevronDown, FiChevronUp, FiShield, FiHeart, FiSettings, FiTruck } from 'react-icons/fi';
import { productAPI } from '../../hooks/api';
import { useCart } from '../../context/CartContext';
import ProductCard, { StarRating } from '../../components/ui/ProductCard';

const ProductDetail = () => {
    const { slug } = useParams();
    const { t, i18n } = useTranslation();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeColor, setActiveColor] = useState(null);
    const [specsOpen, setSpecsOpen] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [descOpen, setDescOpen] = useState(true);
    const lang = i18n.language === 'ne' ? 'ne' : 'en';

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await productAPI.getOne(slug);
                setProduct(data);
                setActiveImageIndex(0);
                setQuantity(1);
                if (data.colors && data.colors.length > 0) {
                    setActiveColor(data.colors[0]);
                } else {
                    setActiveColor(null);
                }
                if (data.category) {
                    const rel = await productAPI.getAll({ category: data.category, limit: 5 });
                    setRelated(rel.data.products.filter((p) => p._id !== data._id).slice(0, 4));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    const handleAdd = () => {
        const itemToAdd = {
            ...product,
            selectedColor: activeColor ? activeColor.name : undefined
        };
        addItem(itemToAdd, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '60px 40px', fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#0a0a0a', minHeight: '100vh' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }} className="pdp-grid">
                    <div style={{ aspectRatio: '4/5', borderRadius: '14px', background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                    <div>
                        {[40, 70, 20, 100].map((w, i) => (
                            <div key={i} style={{ height: i === 1 ? '50px' : i === 3 ? '120px' : '20px', background: '#1a1a1a', borderRadius: '6px', width: `${w}%`, marginBottom: '18px', animation: 'shimmer 1.5s infinite' }} />
                        ))}
                    </div>
                </div>
                <style>{`
                    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                    @media (max-width: 768px) { .pdp-grid { grid-template-columns: 1fr !important; } }
                `}</style>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#0a0a0a', minHeight: '100vh' }}>
                <div style={{ fontSize: '48px', opacity: 0.3, marginBottom: '16px' }}>✦</div>
                <p style={{ fontSize: '16px', color: '#e0e0e0', marginBottom: '8px' }}>Product not found</p>
                <Link to="/shop" style={{ color: '#d4736e', fontSize: '14px' }}>← Back to Shop</Link>
            </div>
        );
    }

    const name = product.name?.[lang] || product.name?.en;
    const desc = product.description?.[lang] || product.description?.en;
    const rating = product.ratings?.average || 4.5;
    const reviewCount = product.ratings?.count || 24;
    const images = product.images && product.images.length > 0 ? product.images : [];
    const activeImage = images[activeImageIndex] || null;
    const specs = product.specifications || {};
    const hasSpecs = Object.values(specs).some(val => val && val.trim() !== '');

    return (
        <div style={{
            minHeight: '100vh', background: '#0a0a0a',
            fontFamily: "'Plus Jakarta Sans', 'PolySans', sans-serif",
        }}>
            {/* Breadcrumb */}
            <div style={{
                maxWidth: '1300px', margin: '0 auto', padding: '20px 40px 0',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', color: '#888',
            }}>
                <Link to="/" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#d4736e'}
                    onMouseLeave={e => e.currentTarget.style.color = '#888'}
                >Home</Link>
                <span>/</span>
                <Link to="/shop" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#d4736e'}
                    onMouseLeave={e => e.currentTarget.style.color = '#888'}
                >Shop</Link>
                <span>/</span>
                <span style={{ color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{name}</span>
            </div>

            {/* Main PDP Grid */}
            <div style={{
                maxWidth: '1300px', margin: '0 auto', padding: '32px 40px 60px',
                display: 'grid', gridTemplateColumns: '1.2fr 1fr',
                gap: '60px', alignItems: 'start',
            }} className="pdp-grid">

                {/* ── Left: Image Gallery ── */}
                <div>
                    {/* Main Image */}
                    <div style={{
                        position: 'relative', aspectRatio: '4/5',
                        borderRadius: '14px', overflow: 'hidden',
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                        marginBottom: '12px',
                    }}>
                        {activeImage ? (
                            <img
                                src={activeImage}
                                alt={name}
                                style={{
                                    width: '100%', height: '100%', objectFit: 'cover',
                                    transition: 'transform 0.6s cubic-bezier(0.25,1,0.5,1)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px', opacity: 0.15 }}>✦</div>
                        )}

                        {/* Discount badge */}
                        {product.comparePrice > product.price && (
                            <span style={{
                                position: 'absolute', top: '16px', left: '16px',
                                background: '#d4736e', color: '#fff',
                                fontSize: '11px', fontWeight: 700,
                                padding: '5px 12px', borderRadius: '20px',
                                letterSpacing: '0.04em',
                            }}>
                                -{Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                            </span>
                        )}

                        {/* Wishlist */}
                        <button
                            onClick={() => setWishlisted(v => !v)}
                            style={{
                                position: 'absolute', top: '16px', right: '16px',
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'rgba(0,0,0,0.6)', border: 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <FiHeart size={18} fill={wishlisted ? '#d4736e' : 'none'} color={wishlisted ? '#d4736e' : '#aaa'} />
                        </button>
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {images.map((im, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImageIndex(i)}
                                    style={{
                                        width: '72px', height: '72px',
                                        borderRadius: '8px', overflow: 'hidden',
                                        border: `2px solid ${activeImageIndex === i ? '#d4736e' : '#e8e6e3'}`,
                                        cursor: 'pointer', padding: 0,
                                        opacity: activeImageIndex === i ? 1 : 0.65,
                                        transition: 'all 0.2s',
                                        background: '#1a1a1a',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={e => { if (activeImageIndex !== i) e.currentTarget.style.opacity = '0.65'; }}
                                >
                                    <img src={im} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Right: Product Info ── */}
                <div>
                    {/* Category tag */}
                    {product.category && (
                        <span style={{
                            fontSize: '10.5px', fontWeight: 700,
                            letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: '#d4736e',
                            display: 'inline-block', marginBottom: '8px',
                        }}>
                            {product.category.name?.[lang] || product.category.name?.en || 'Collection'}
                        </span>
                    )}

                    {/* Product name */}
                    <h1 style={{
                        fontSize: 'clamp(28px, 3.5vw, 42px)',
                        fontWeight: 700, letterSpacing: '-0.03em',
                        color: '#fff', margin: '0 0 12px',
                        lineHeight: 1.15, fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}>
                        {name}
                    </h1>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <StarRating rating={rating} />
                        <span style={{ fontSize: '12px', color: '#9a9a9a' }}>({reviewCount} reviews)</span>
                    </div>

                    {/* Price */}
                    <div style={{
                        display: 'flex', alignItems: 'baseline', gap: '12px',
                        padding: '16px 0',
                        borderTop: '1px solid #222',
                        borderBottom: '1px solid #222',
                        marginBottom: '24px',
                    }}>
                        <span style={{ fontSize: '28px', fontWeight: 700, color: '#0c0c0c', letterSpacing: '-0.02em' }}>
                            Rs. {product.price.toLocaleString()}
                        </span>
                        {product.comparePrice > product.price && (
                            <span style={{ fontSize: '16px', color: '#b0b0b0', textDecoration: 'line-through' }}>
                                Rs. {product.comparePrice.toLocaleString()}
                            </span>
                        )}
                        {product.comparePrice > product.price && (
                            <span style={{
                                fontSize: '12px', fontWeight: 600, color: '#d4736e',
                                background: 'rgba(212,115,110,0.08)',
                                padding: '3px 10px', borderRadius: '12px',
                            }}>
                                Save Rs. {(product.comparePrice - product.price).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Color swatches */}
                    {product.colors && product.colors.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b6b6b', display: 'block', marginBottom: '10px' }}>
                                Color: <span style={{ color: '#e0e0e0', fontWeight: 500, textTransform: 'capitalize' }}>{activeColor?.name || ''}</span>
                            </span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {product.colors.map((col, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveColor(col)}
                                        style={{
                                            width: '36px', height: '36px',
                                            borderRadius: '50%',
                                            background: col.hex,
                                            border: `2.5px solid ${activeColor && activeColor.name === col.name ? '#fff' : '#333'}`,
                                            cursor: 'pointer', padding: 0,
                                            transition: 'all 0.2s',
                                            boxShadow: activeColor && activeColor.name === col.name ? '0 0 0 3px rgba(12,12,12,0.12)' : 'none',
                                        }}
                                        title={col.name}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description accordion */}
                    <div style={{ marginBottom: '24px' }}>
                        <button
                            onClick={() => setDescOpen(v => !v)}
                            style={{
                                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 0', background: 'none', border: 'none', borderBottom: '1px solid #e8e6e3',
                                cursor: 'pointer', fontSize: '11px', fontWeight: 700,
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                color: '#fff', fontFamily: 'inherit',
                            }}
                        >
                            Description
                            {descOpen ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
                        </button>
                        {descOpen && (
                            <p style={{
                                fontSize: '14px', lineHeight: 1.75, color: '#aaa',
                                padding: '16px 0', margin: 0, fontWeight: 300,
                            }}>
                                {desc}
                            </p>
                        )}
                    </div>

                    {/* Specs accordion */}
                    {hasSpecs && (
                        <div style={{ marginBottom: '24px' }}>
                            <button
                                onClick={() => setSpecsOpen(v => !v)}
                                style={{
                                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px 0', background: 'none', border: 'none', borderBottom: '1px solid #e8e6e3',
                                    cursor: 'pointer', fontSize: '11px', fontWeight: 700,
                                    letterSpacing: '0.1em', textTransform: 'uppercase',
                                    color: '#fff', fontFamily: 'inherit',
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FiSettings size={13} /> Specifications
                                </span>
                                {specsOpen ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
                            </button>
                            {specsOpen && (
                                <div style={{ padding: '16px 0' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
                                        {Object.entries(specs).map(([key, val]) => {
                                            if (!val || val.trim() === 'N/A' || val.trim() === '') return null;
                                            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                            return (
                                                <div key={key} style={{ borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                                                    <span style={{ fontSize: '10.5px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '3px' }}>{label}</span>
                                                    <span style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: 500 }}>{val}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quantity + Add to Cart */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b6b6b' }}>Quantity</span>
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                border: '1.5px solid #333', borderRadius: '6px',
                                overflow: 'hidden',
                            }}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{
                                    width: '40px', height: '40px', background: 'none', border: 'none',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#5a5a5a', transition: 'color 0.15s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#d4736e'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#5a5a5a'}
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span style={{
                                    width: '40px', textAlign: 'center',
                                    fontSize: '14px', fontWeight: 600, color: '#e0e0e0',
                                    borderLeft: '1px solid #333', borderRight: '1px solid #333',
                                    lineHeight: '40px',
                                }}>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} style={{
                                    width: '40px', height: '40px', background: 'none', border: 'none',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#5a5a5a', transition: 'color 0.15s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#d4736e'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#5a5a5a'}
                                >
                                    <FiPlus size={14} />
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleAdd}
                                disabled={product.stock === 0}
                                style={{
                                    flex: 1, padding: '15px 24px',
                                    background: added ? '#4caf50' : product.stock > 0 ? '#fff' : '#333',
                                    color: added || product.stock > 0 ? (added ? '#fff' : '#000') : '#666',
                                    border: 'none', borderRadius: '6px',
                                    fontSize: '13px', fontWeight: 700,
                                    letterSpacing: '0.06em', textTransform: 'uppercase',
                                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                    fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    transition: 'all 0.25s',
                                }}
                                onMouseEnter={e => { if (product.stock > 0 && !added) { e.currentTarget.style.background = '#d4736e'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,115,110,0.3)'; } }}
                                onMouseLeave={e => { if (product.stock > 0 && !added) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = 'none'; } }}
                            >
                                <FiShoppingBag size={15} />
                                {added ? '✓ Added!' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>

                            {product.stock > 0 && (
                                <a
                                    href={`https://wa.me/9779800000000?text=${encodeURIComponent(`Hi! I'd like to order: ${name}${activeColor ? ` (${activeColor.name})` : ''} - Rs. ${product.price.toLocaleString()} x ${quantity}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: '15px 20px',
                                        border: '1.5px solid #25d366',
                                        borderRadius: '6px',
                                        color: '#25d366',
                                        textDecoration: 'none',
                                        fontSize: '12px', fontWeight: 700,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.06)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                        padding: '20px 0',
                        borderTop: '1px solid #222',
                    }}>
                        {[
                            { icon: FiShield, label: 'Authentic & Certified' },
                            { icon: FiTruck, label: 'Discreet Delivery' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                gap: '6px', textAlign: 'center',
                            }}>
                                <Icon size={18} color="#d4736e" />
                                <span style={{ fontSize: '10.5px', color: '#7a7a7a', lineHeight: 1.3, fontWeight: 500 }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Related Products ── */}
            {related.length > 0 && (
                <section style={{
                    borderTop: '1px solid #222',
                    padding: '60px 40px',
                    background: '#0d0d0d',
                }}>
                    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#d4736e', fontWeight: 600, marginBottom: '8px' }}>You May Also Like</p>
                            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#0c0c0c', margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                                Related Products
                            </h2>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: '24px',
                        }}>
                            {related.map((p, i) => <ProductCard key={p._id} product={p} cardIndex={i} />)}
                        </div>
                    </div>
                </section>
            )}

            <style>{`
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                @media (max-width: 768px) {
                    .pdp-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
                }
            `}</style>
        </div>
    );
};

export default ProductDetail;
