import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiPackage, FiStar, FiHeart, FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

// ─── Uploaded assets ───
import confidentialImg from '../../assets/images/img_girl.png';
import homepageBlock5 from '../../assets/images/next gen.png';
import quizImg from '../../assets/images/er.png';

// ─── LELO-style color palette ───
const ROSE = '#ffffff';
const DARK = '#000000';
const WHITE = '#ffffff';

// ─── Mock products (shown while API loads / fallback) ───
const MOCK_PRODUCTS = [
    { _id: 'm1', slug: 'silk-touch-vibrator', name: 'Silk Touch Vibrator', price: 8900, comparePrice: 12900, images: [], category: 'For Her', badge: 'Best Seller' },
    { _id: 'm2', slug: 'couples-remote-toy', name: 'Couples Remote Toy', price: 11900, comparePrice: 15900, images: [], category: 'For Couples', badge: 'New' },
    { _id: 'm3', slug: 'g-spot-massager', name: 'G-Spot Massager', price: 13900, comparePrice: 18000, images: [], category: 'For Her', badge: null },
    { _id: 'm4', slug: 'smart-wand', name: 'Smart Wand Massager', price: 9500, comparePrice: 13500, images: [], category: 'Wellness', badge: null },
    { _id: 'm5', slug: 'bullet-vibe', name: 'Bullet Vibrator', price: 5900, comparePrice: 7900, images: [], category: 'For Her', badge: 'Top Pick' },
    { _id: 'm6', slug: 'prostate-massager', name: 'Prostate Massager Pro', price: 16900, comparePrice: 22000, images: [], category: 'For Him', badge: 'New' },
    { _id: 'm7', slug: 'wearable-vibrator', name: 'Wearable Vibrator', price: 10900, comparePrice: 14900, images: [], category: 'For Couples', badge: null },
    { _id: 'm8', slug: 'clitoral-stimulator', name: 'Clitoral Stimulator', price: 12500, comparePrice: 16500, images: [], category: 'For Her', badge: 'Best Seller' },
];

// Card dark backgrounds — moody LELO aesthetic
const CARD_BG = [
    '#1c1a1a', '#1a1a20', '#201a1e', '#1a1e1b',
    '#1e1c18', '#181b22', '#1e1820', '#1c1e1a',
];

// ─── Product images — adult product photos ───
const PRODUCT_IMGS = [
    '/uploads/silk_touch_vibrator.png',
    '/uploads/rose_petal_massager.png',
    '/uploads/velvet_dreams_vibrator.png',
    '/uploads/aqua_glide_lubricant.png',
    '/uploads/satin_bliss_massage_oil.png',
    '/uploads/silk_touch_vibrator.png',
    '/uploads/rose_petal_massager.png',
    '/uploads/velvet_dreams_vibrator.png',
];

// Editorial lifestyle images — using uploaded assets
const LIFESTYLE_IMGS = [
    quizImg,
    confidentialImg,
    homepageBlock5,
];

const CATEGORIES = [
    { label: 'For Her', sub: 'Vibrators & Stimulators', to: '/shop?category=for-her', img: '/uploads/rose_petal_massager.png', color: '#999999' },
    { label: 'For Him', sub: 'Prostate & More', to: '/shop?category=for-him', img: '/uploads/velvet_dreams_vibrator.png', color: '#6b7fc4' },
    { label: 'For Couples', sub: 'Remote & Wearable', to: '/shop?category=couples', img: '/uploads/silk_touch_vibrator.png', color: '#9b7ac4' },
    { label: 'Bestsellers', sub: 'Fan Favourites', to: '/shop?sort=bestseller', img: '/uploads/aqua_glide_lubricant.png', color: '#c4a96b' },
];

const TRUST = [
    { icon: FiPackage, label: 'Discreet Packaging', desc: 'Plain, unbranded boxes — always' },
    { icon: FiShield, label: '100% Authentic', desc: 'Direct from certified distributors' },
    { icon: FiStar, label: 'Medical-Grade', desc: 'Body-safe, certified materials' },
    { icon: FiHeart, label: 'Pleasure-First Design', desc: 'Made to ignite your wildest desires' },
];

const TESTIMONIALS = [
    { name: 'Priya K.', rating: 5, text: 'Absolutely love the quality. The discreet packaging was perfect — couldn\'t even tell what was inside! Fast delivery too.' },
    { name: 'Roshan M.', rating: 5, text: 'Finally a trusted store in Nepal. Great customer service and 100% authentic products. Highly recommended!' },
    { name: 'Deepika S.', rating: 5, text: 'The quiz helped me find exactly what I needed. The whole experience felt luxurious from start to finish.' },
    { name: 'Anish T.', rating: 5, text: 'Fast delivery, discreet packaging, and the quality exceeded my expectations. Will definitely order again.' },
];

// ── Sub-components ──────────────────────────────────────────────────

const ProductCard = ({ product, index }) => {
    const { addItem } = useCart();
    const [hovered, setHovered] = useState(false);
    const [added, setAdded] = useState(false);

    const bg = CARD_BG[index % CARD_BG.length];
    const imgSrc = (product.images && product.images[0]) ? product.images[0] : PRODUCT_IMGS[index % PRODUCT_IMGS.length];
    const discount = product.comparePrice > product.price
        ? Math.round((1 - product.price / product.comparePrice) * 100) : null;

    const tags = Array.isArray(product.tags) ? product.tags : [];
    const badge = product.badge || (tags.includes('new') && 'New') || (tags.includes('bestseller') && 'Bestseller') || null;

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({ ...product, quantity: 1 });
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <Link
            to={`/product/${product.slug}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
            {/* Image */}
            <div style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                background: bg,
                aspectRatio: '3/4',
                transition: 'box-shadow 0.35s ease',
                boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.5)' : '0 2px 12px rgba(0,0,0,0.3)',
            }}>
                <img
                    src={imgSrc}
                    alt={product.name}
                    style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.25,1,0.5,1)',
                        transform: hovered ? 'scale(1.07)' : 'scale(1)',
                    }}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                />

                {/* Badges */}
                {badge && (
                    <span style={{
                        position: 'absolute', top: '12px', left: '12px',
                        background: badge === 'New' ? '#1a1a1a' : ROSE,
                        color: '#fff', fontSize: '10px', fontWeight: 700,
                        padding: '4px 10px', borderRadius: '20px',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>{badge}</span>
                )}
                {discount && (
                    <span style={{
                        position: 'absolute', top: badge ? '38px' : '12px', left: '12px',
                        background: 'rgba(255,255,255,0.9)', color: ROSE,
                        fontSize: '10px', fontWeight: 700,
                        padding: '4px 10px', borderRadius: '20px',
                        letterSpacing: '0.04em',
                    }}>−{discount}%</span>
                )}

                {/* Quick Add button */}
                <div style={{
                    position: 'absolute', bottom: '12px', left: '12px', right: '12px',
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.25s ease',
                }}>
                    <button
                        onClick={handleAdd}
                        style={{
                            width: '100%', padding: '11px',
                            background: added ? '#25a35a' : DARK,
                            color: '#fff', border: 'none',
                            borderRadius: '8px', fontSize: '12px',
                            fontWeight: 600, letterSpacing: '0.06em',
                            textTransform: 'uppercase', cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'background 0.25s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                    >
                        <FiShoppingBag size={13} />
                        {added ? 'Added!' : 'Quick Add'}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div style={{ padding: '14px 4px 0' }}>
                <span style={{
                    fontSize: '10px', color: '#aaa',
                    textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
                }}>
                    {typeof product.category === 'object' ? (product.category?.name?.en || 'Collection') : product.category}
                </span>
                <h3 style={{
                    margin: '4px 0 8px', fontSize: '14.5px', fontWeight: 500,
                    color: hovered ? ROSE : '#e0e0e0',
                    transition: 'color 0.2s', lineHeight: 1.3,
                }}>
                    {product.name?.en || product.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                        Rs. {product.price?.toLocaleString()}
                    </span>
                    {product.comparePrice > product.price && (
                        <span style={{ fontSize: '12px', color: '#bbb', textDecoration: 'line-through' }}>
                            Rs. {product.comparePrice?.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

// ── Main Home Component ────────────────────────────────────────────
export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [testimonialIdx, setTestimonialIdx] = useState(0);

    // Fetch products
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/products?limit=8');
                const data = await res.json();
                const p = data.products || [];
                setProducts(p.length >= 4 ? p : MOCK_PRODUCTS);
            } catch {
                setProducts(MOCK_PRODUCTS);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Testimonial carousel
    useEffect(() => {
        const iv = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
        return () => clearInterval(iv);
    }, []);

    return (
        <div style={{ background: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

            {/* ══════════════════════════════════════
                HERO — rotating image carousel
            ══════════════════════════════════════ */}
            <section style={{
                position: 'relative',
                height: '100vh',
                minHeight: '600px',
                overflow: 'hidden',
                background: DARK,
                display: 'flex',
                alignItems: 'flex-end',
            }}>
                {/* Background image */}
                <img
                    src={homepageBlock5}
                    alt=""
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                    }}
                />

                {/* Subtle bottom gradient for text readability */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 60%)',
                    zIndex: 1,
                }} />

                {/* Content — Left aligned */}
                <div style={{
                    position: 'relative', zIndex: 2,
                    maxWidth: '1400px', margin: '0 auto',
                    padding: '0 40px 100px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                }}>
                    <div style={{
                        maxWidth: '500px',
                        animation: 'heroFadeUp 1.1s cubic-bezier(0.16,1,0.3,1) both',
                    }}>
                        {/* Eyebrow */}
                        <div style={{
                            marginBottom: '14px',
                        }}>
                            <span style={{
                                fontSize: '10px', fontWeight: 600,
                                letterSpacing: '0.2em', textTransform: 'uppercase',
                                color: '#fff',
                            }}>
                                Bliss Intimate Wellness
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(22px, 3vw, 36px)',
                            fontWeight: 300,
                            lineHeight: 1.3,
                            letterSpacing: '0.06em',
                            color: '#fff',
                            textTransform: 'uppercase',
                            margin: '0 0 24px',
                        }}>
                            Intimacy, Reimagined.
                        </h1>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Link
                                to="/shop"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '12px 28px',
                                    background: 'transparent', color: '#fff',
                                    border: '1.5px solid rgba(255,255,255,0.6)',
                                    borderRadius: '40px', textDecoration: 'none',
                                    fontSize: '10px', fontWeight: 700,
                                    letterSpacing: '0.15em', textTransform: 'uppercase',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                            >
                                Discover Shop <FiArrowRight size={11} />
                            </Link>
                            <Link
                                to="/quiz"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '12px 28px',
                                    background: 'rgba(255,255,255,0.15)', color: '#fff',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '40px', textDecoration: 'none',
                                    fontSize: '10px', fontWeight: 700,
                                    letterSpacing: '0.15em', textTransform: 'uppercase',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = ROSE; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                            >
                                Take the Quiz
                            </Link>
                        </div>
                    </div>
                </div>


            </section>

            {/* ══════════════════════════════════════
                TRUST STRIP — WHITE BLOCK
            ══════════════════════════════════════ */}
            <section style={{
                background: '#000000', color: '#ffffff',
                padding: '28px 40px',
                borderBottom: '1px solid #222',
            }}>
                <div style={{
                    maxWidth: '1200px', margin: '0 auto',
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '24px', textAlign: 'center',
                }} className="trust-grid">
                    {TRUST.map(({ icon: Icon, label, desc }) => (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <Icon size={16} color={ROSE} />
                            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', color: '#ffffff' }}>{label}</span>
                            <span style={{ fontSize: '11px', color: '#888', lineHeight: 1.4 }}>{desc}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════
                EDITORIAL — CATEGORY IMAGE GRID — WHITE BLOCK
            ══════════════════════════════════════ */}
            <section style={{ padding: '80px 40px', background: '#000000', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#888', fontWeight: 600, marginBottom: '10px' }}>
                        Shop by Category
                    </p>
                    <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', margin: 0 }}>
                        Find Your Perfect Match
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.3fr 1fr 1fr 1.3fr',
                    gap: '16px',
                    height: '520px',
                }} className="cat-grid">
                    {CATEGORIES.map((cat, i) => (
                        <CategoryImageCard key={cat.label} cat={cat} index={i} />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════
                FEATURED PRODUCTS GRID
            ══════════════════════════════════════ */}
            <section style={{ padding: '80px 40px', background: '#000000' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                        marginBottom: '48px', flexWrap: 'wrap', gap: '14px',
                    }}>
                        <div>
                            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#666', fontWeight: 600, marginBottom: '10px', margin: '0 0 8px' }}>
                                Hand-picked for You
                            </p>
                            <h2 style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>
                                Bestselling Products
                            </h2>
                        </div>
                        <Link
                            to="/shop"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                fontSize: '12px', fontWeight: 700, color: ROSE,
                                textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase',
                                transition: 'gap 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.gap = '12px'}
                            onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                        >
                            Shop All <FiArrowRight size={13} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '28px' }}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i}>
                                    <div style={{ aspectRatio: '3/4', borderRadius: '12px', background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                                    <div style={{ height: '12px', background: '#1a1a1a', borderRadius: '4px', marginTop: '14px', width: '65%', animation: 'shimmer 1.5s infinite' }} />
                                    <div style={{ height: '10px', background: '#1a1a1a', borderRadius: '4px', marginTop: '8px', width: '40%', animation: 'shimmer 1.5s infinite' }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '28px' }}>
                            {products.map((product, i) => (
                                <ProductCard key={product._id} product={product} index={i} />
                            ))}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '56px' }}>
                        <Link
                            to="/shop"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                padding: '15px 48px',
                                background: 'transparent',
                                border: `1.5px solid #fff`,
                                color: '#fff', borderRadius: '4px',
                                textDecoration: 'none',
                                fontSize: '12px', fontWeight: 700,
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                transition: 'all 0.25s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                        >
                            View All Products <FiArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                EDITORIAL LIFESTYLE SECTION (LELO-style)
            ══════════════════════════════════════ */}
            <section style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    minHeight: '560px',
                }} className="editorial-grid">
                    {/* Image */}
                    <div style={{
                        position: 'relative',
                        overflow: 'hidden',
                        background: '#1a1210',
                    }}>
                        <img
                            src={LIFESTYLE_IMGS[0]}
                            alt="Premium wellness"
                            style={{
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                opacity: 0.75,
                                display: 'block',
                            }}
                        />
                    </div>
                    {/* Text */}
                    <div style={{
                        background: DARK,
                        display: 'flex', alignItems: 'center',
                        padding: '80px 72px',
                        color: '#fff',
                    }}>
                        <div>
                            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.16em', color: ROSE, fontWeight: 600, marginBottom: '20px' }}>
                                The Bliss Promise
                            </p>
                            <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 24px' }}>
                                Your privacy is<br />our sacred promise.
                            </h2>
                            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: '0 0 40px', fontWeight: 300 }}>
                                Every order is shipped in plain, unbranded packaging with no reference to Bliss Nepal or the product contents. Delivered discreetly — always.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
                                {['Plain, unbranded outer packaging', 'No product details on labels', 'Discreet billing name on invoices', 'COD available — pay on delivery'].map(item => (
                                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: `1.5px solid ${ROSE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ROSE, display: 'block' }} />
                                        </span>
                                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                to="/about"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    fontSize: '12px', fontWeight: 700, color: '#fff',
                                    textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
                                    borderBottom: '1.5px solid rgba(255,255,255,0.3)',
                                    paddingBottom: '3px',
                                    transition: 'border-color 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = ROSE}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                            >
                                Learn About Us <FiArrowRight size={12} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                QUIZ CTA
            ══════════════════════════════════════ */}
            <section style={{
                padding: '100px 40px',
                textAlign: 'center',
                background: '#000000',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-80px', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${ROSE}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '8%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.16em', color: ROSE, fontWeight: 600, marginBottom: '16px' }}>
                        Personalised For You
                    </p>
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 20px', lineHeight: 1.1 }}>
                        Not sure where to start?
                    </h2>
                    <p style={{ fontSize: '17px', color: '#888', margin: '0 0 40px', lineHeight: 1.7, fontWeight: 300 }}>
                        Answer 4 quick questions and we'll find the perfect product for your needs — curated just for you.
                    </p>
                    <Link
                        to="/quiz"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            padding: '16px 48px',
                            background: '#ffffff', color: '#000000',
                            borderRadius: '4px', textDecoration: 'none',
                            fontSize: '12px', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            transition: 'all 0.25s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#cccccc'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 36px ${ROSE}55`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        Take the Quiz <FiArrowRight size={14} />
                    </Link>
                    <p style={{ fontSize: '12px', color: '#888', marginTop: '16px' }}>
                        2 minutes · 4 questions · Personalised results
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECOND EDITORIAL — WHITE BLOCK
            ══════════════════════════════════════ */}
            <section style={{ overflow: 'hidden' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    minHeight: '500px',
                }} className="editorial-grid">
                    {/* Text */}
                    <div style={{
                        background: '#000000',
                        display: 'flex', alignItems: 'center',
                        padding: '80px 72px',
                    }}>
                        <div>
                            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.16em', color: ROSE, fontWeight: 600, marginBottom: '20px' }}>
                                Certified Quality
                            </p>
                            <h2 style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', lineHeight: 1.1, margin: '0 0 24px' }}>
                                Medical-grade.<br />100% authentic.
                            </h2>
                            <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.75, margin: '0 0 36px', fontWeight: 300 }}>
                                Every product we sell is sourced directly from authorised distributors. Body-safe, medical-grade materials with full manufacturer warranty.
                            </p>
                            <Link
                                to="/shop"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '14px 36px',
                                    background: '#ffffff', color: '#000000',
                                    borderRadius: '4px', textDecoration: 'none',
                                    fontSize: '12px', fontWeight: 700,
                                    letterSpacing: '0.1em', textTransform: 'uppercase',
                                    transition: 'all 0.25s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#cccccc'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
                            >
                                Explore Products <FiArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                    {/* Image */}
                    <div style={{ position: 'relative', overflow: 'hidden', background: '#000000' }}>
                        <img
                            src={LIFESTYLE_IMGS[1]}
                            alt="Authentic wellness"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                TESTIMONIALS
            ══════════════════════════════════════ */}
            <section style={{ padding: '100px 40px', background: DARK, color: '#fff' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.16em', color: ROSE, fontWeight: 600, marginBottom: '16px' }}>
                        Customer Stories
                    </p>
                    <h2 style={{ fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 56px', lineHeight: 1.1 }}>
                        Loved across Nepal
                    </h2>

                    <div style={{ position: 'relative', minHeight: '200px' }}>
                        {TESTIMONIALS.map((t, i) => (
                            <div
                                key={i}
                                style={{
                                    position: i === testimonialIdx ? 'relative' : 'absolute',
                                    opacity: i === testimonialIdx ? 1 : 0,
                                    transform: i === testimonialIdx ? 'translateY(0)' : 'translateY(16px)',
                                    transition: 'all 0.6s ease',
                                    top: 0, left: 0, right: 0,
                                    pointerEvents: i === testimonialIdx ? 'auto' : 'none',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '20px' }}>
                                    {[...Array(t.rating)].map((_, j) => (
                                        <span key={j} style={{ color: '#cccccc', fontSize: '16px' }}>★</span>
                                    ))}
                                </div>
                                <p style={{ fontSize: 'clamp(17px, 2vw, 22px)', fontWeight: 300, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', margin: '0 0 24px' }}>
                                    "{t.text}"
                                </p>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: ROSE, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                    — {t.name}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                        {TESTIMONIALS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setTestimonialIdx(i)}
                                style={{
                                    width: i === testimonialIdx ? '28px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: i === testimonialIdx ? ROSE : 'rgba(255,255,255,0.2)',
                                    border: 'none', cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    padding: 0,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                NEWSLETTER
            ══════════════════════════════════════ */}
            <NewsletterSection />

            {/* ══════════════════════════════════════
                GLOBAL ANIMATIONS
            ══════════════════════════════════════ */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,700&display=swap');

                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(32px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }

                .cat-grid, .editorial-grid, .trust-grid {
                    /* handled inline */
                }

                @media (max-width: 900px) {
                    .cat-grid {
                        grid-template-columns: 1fr 1fr !important;
                        height: auto !important;
                    }
                    .editorial-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .trust-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 600px) {
                    .cat-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .trust-grid {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}

// ─── Category Image Card (LELO-style hover overlay) ──────────────
function CategoryImageCard({ cat, index }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Link
            to={cat.to}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative', display: 'block',
                textDecoration: 'none', borderRadius: '10px',
                overflow: 'hidden', background: '#1a1a1a',
            }}
        >
            <img
                src={cat.img}
                alt={cat.label}
                style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s cubic-bezier(0.25,1,0.5,1), opacity 0.4s',
                    transform: hovered ? 'scale(1.08)' : 'scale(1)',
                    opacity: hovered ? 0.7 : 0.85,
                    display: 'block',
                }}
            />
            {/* Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: hovered
                    ? `linear-gradient(to top, ${cat.color}cc 0%, rgba(0,0,0,0.3) 100%)`
                    : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)',
                transition: 'background 0.4s ease',
            }} />
            <div style={{
                position: 'absolute', bottom: '24px', left: '20px', right: '20px',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'transform 0.35s ease',
            }}>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, margin: '0 0 4px' }}>
                    {cat.sub}
                </p>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                    {cat.label}
                </h3>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '11px', fontWeight: 600, color: '#fff',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    opacity: hovered ? 1 : 0.6,
                    transition: 'opacity 0.3s',
                }}>
                    Shop Now <FiArrowRight size={10} />
                </span>
            </div>
        </Link>
    );
}

// ─── Newsletter ───────────────────────────────────────────────────────
function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handle = (e) => {
        e.preventDefault();
        if (email.trim()) { setSent(true); setEmail(''); }
    };

    return (
        <section style={{
            padding: '80px 40px',
            background: '#000000',
            textAlign: 'center',
        }}>
            <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#888', fontWeight: 600, marginBottom: '14px' }}>
                    Stay in the loop
                </p>
                <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 14px' }}>
                    Get exclusive offers
                </h2>
                <p style={{ fontSize: '14px', color: '#888', margin: '0 0 32px', lineHeight: 1.6 }}>
                    Subscribe for new arrivals, discreet wellness tips and members-only discounts.
                </p>
                {sent ? (
                    <div style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px' }}>
                        Thank you! You're on the list.
                    </div>
                ) : (
                    <form onSubmit={handle} style={{ display: 'flex', gap: '10px', maxWidth: '420px', margin: '0 auto' }}>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Your email address"
                            required
                            style={{
                                flex: 1, padding: '13px 18px',
                                border: '1.5px solid #333',
                                borderRadius: '4px', fontSize: '13px',
                                color: '#ffffff', outline: 'none',
                                fontFamily: 'inherit',
                                background: '#1a1a1a',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '13px 24px',
                                background: '#ffffff', color: '#000000',
                                border: 'none', borderRadius: '4px',
                                fontSize: '12px', fontWeight: 700,
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                cursor: 'pointer', fontFamily: 'inherit',
                                whiteSpace: 'nowrap',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#cccccc'}
                            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                        >
                            Subscribe
                        </button>
                    </form>
                )}
                <p style={{ fontSize: '11px', color: '#888', marginTop: '14px' }}>
                    No spam. Unsubscribe anytime. Discreet sender name.
                </p>
            </div>
        </section>
    );
}
