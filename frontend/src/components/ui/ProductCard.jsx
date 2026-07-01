import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';

const CARD_COLORS = [
    '#1c1a1a', '#1a1a20', '#201a1e', '#1e1c1a', '#1a1e1c', '#1e1a1e',
    '#1c1a20', '#1e1c1a', '#1a1e1c', '#1e1e1a', '#1e1a1a', '#1a1e1e',
];

const StarRating = ({ rating }) => {
    const r = Math.round(rating * 2) / 2;
    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(i => {
                let fill = '#333';
                if (i <= Math.floor(r)) fill = '#f5a623';
                else if (i - 0.5 <= r) fill = '#f5a623';
                return (
                    <svg key={i} width="10" height="10" viewBox="0 0 10 10">
                        <polygon
                            points="5,0.5 6.5,3.5 10,4 7.5,6.5 8,10 5,8.5 2,10 2.5,6.5 0,4 3.5,3.5"
                            fill={fill}
                        />
                    </svg>
                );
            })}
        </div>
    );
};

const ProductCard = ({ product, cardIndex = 0 }) => {
    const { t, i18n } = useTranslation();
    const { addItem } = useCart();
    const [hovered, setHovered] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const lang = i18n.language === 'ne' ? 'ne' : 'en';

    const name = product.name?.[lang] || product.name?.en || product.name;
    const image = product.images?.[0];
    const rating = product.ratings?.average || 4.2;
    const reviewCount = product.ratings?.count || Math.floor(Math.random() * 120) + 10;
    const isNew = product.tags?.includes('new');
    const isBestseller = product.tags?.includes('bestseller') || product.featured;
    const badgeText = isNew ? (lang === 'ne' ? 'नयाँ' : 'New') : isBestseller ? (lang === 'ne' ? 'बेस्टसेलर' : 'Bestseller') : null;
    const discount = product.comparePrice > product.price
        ? Math.round((1 - product.price / product.comparePrice) * 100)
        : null;
    const bg = CARD_COLORS[cardIndex % CARD_COLORS.length];

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ position: 'relative', fontFamily: "'Plus Jakarta Sans', 'PolySans', sans-serif" }}
        >
            {/* Image Container */}
            <Link to={`/product/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: bg,
                    aspectRatio: '3 / 4',
                    boxShadow: hovered
                        ? '0 12px 40px rgba(0,0,0,0.4)'
                        : '0 2px 8px rgba(0,0,0,0.2)',
                    transition: 'box-shadow 0.3s ease',
                }}>
                    {/* Product image */}
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            style={{
                                width: '100%', height: '100%', objectFit: 'cover',
                                transition: 'transform 0.5s cubic-bezier(0.25,1,0.5,1)',
                                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '64px', opacity: 0.25,
                            transition: 'transform 0.5s cubic-bezier(0.25,1,0.5,1)',
                            transform: hovered ? 'scale(1.06)' : 'scale(1)',
                        }}>
                            ✦
                        </div>
                    )}

                    {/* Badge */}
                    {badgeText && (
                        <span style={{
                            position: 'absolute', top: '10px', left: '10px',
                            background: isNew ? '#0c0c0c' : '#c97b6e', color: '#fff',
                            fontSize: '9px', fontWeight: 700,
                            padding: '3px 8px', borderRadius: '20px',
                            letterSpacing: '0.04em', textTransform: 'uppercase',
                            zIndex: 2,
                        }}>
                            {badgeText}
                        </span>
                    )}

                    {/* Discount badge */}
                    {discount && (
                        <span style={{
                            position: 'absolute',
                            top: badgeText ? '36px' : '10px',
                            left: '10px',
                            background: '#d4736e', color: '#fff',
                            fontSize: '9.5px', fontWeight: 700,
                            padding: '3px 8px', borderRadius: '20px',
                            letterSpacing: '0.04em',
                            zIndex: 2,
                        }}>
                            -{discount}%
                        </span>
                    )}

                    {/* Wishlist */}
                    <button
                        onClick={e => { e.preventDefault(); setWishlisted(v => !v); }}
                        style={{
                            position: 'absolute', top: '10px', right: '10px',
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'rgba(0,0,0,0.6)',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: hovered || wishlisted ? 1 : 0,
                            transition: 'opacity 0.2s, transform 0.2s',
                            transform: hovered ? 'scale(1)' : 'scale(0.85)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                        aria-label="Wishlist"
                    >
                        <FiHeart
                            size={14}
                            fill={wishlisted ? '#d4736e' : 'none'}
                            color={wishlisted ? '#d4736e' : '#555'}
                        />
                    </button>

                    {/* Quick Add button */}
                    <div style={{
                        position: 'absolute', bottom: '10px', left: '10px', right: '10px',
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.25s ease',
                    }}>
                        <button
                            onClick={e => { e.preventDefault(); addItem(product); }}
                            style={{
                                width: '100%', padding: '10px',
                                background: '#0c0c0c', color: '#fff',
                                border: 'none', borderRadius: '6px',
                                fontSize: '11.5px', fontWeight: 700,
                                letterSpacing: '0.06em', textTransform: 'uppercase',
                                cursor: 'pointer', fontFamily: 'inherit',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#d4736e'}
                            onMouseLeave={e => e.currentTarget.style.background = '#0c0c0c'}
                        >
                            <FiShoppingBag size={13} />
                            {t('product.addToCart') || 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div style={{ padding: '12px 2px 0' }}>
                <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{
                        margin: '0 0 5px',
                        fontSize: '13.5px', fontWeight: 500,
                        color: hovered ? '#d4736e' : '#e0e0e0',
                        transition: 'color 0.2s',
                        lineHeight: 1.35,
                        fontFamily: 'inherit',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}>
                        {name}
                    </h3>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <StarRating rating={rating} />
                    <span style={{ fontSize: '11px', color: '#9a9a9a' }}>({reviewCount})</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                        Rs. {product.price?.toLocaleString()}
                    </span>
                    {product.comparePrice > product.price && (
                        <span style={{ fontSize: '12px', color: '#b0b0b0', textDecoration: 'line-through' }}>
                            Rs. {product.comparePrice?.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export { StarRating };
export default ProductCard;
