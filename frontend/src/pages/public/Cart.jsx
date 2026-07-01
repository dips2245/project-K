import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const { t, i18n } = useTranslation();
    const { items, removeItem, updateQuantity, totalPrice } = useCart();
    const lang = i18n.language === 'ne' ? 'ne' : 'en';

    if (items.length === 0) {
        return (
            <div style={{
                maxWidth: '800px',
                margin: '80px auto',
                padding: '0 24px',
                textAlign: 'center',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 28px',
                    color: '#d4736e',
                }}>
                    <FiShoppingBag size={40} />
                </div>
                <h2 style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: '#fff',
                    marginBottom: '12px',
                }}>
                    {t('cart.emptyTitle') || 'Your Bag is Empty'}
                </h2>
                <p style={{
                    fontSize: '15px',
                    color: '#7a7a7a',
                    maxWidth: '480px',
                    margin: '0 auto 32px',
                    lineHeight: '1.6',
                }}>
                    {t('cart.emptySubtitle') || 'Discover our premium wellness collection and experience absolute pleasure.'}
                </p>
                <Link
                    to="/shop"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '16px 36px',
                        background: '#1a1a1a',
                        color: '#fff',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        transition: 'transform 0.2s, background 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#d4736e';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = '#1a1a1a';
                        e.currentTarget.style.transform = 'none';
                    }}
                >
                    {t('cart.continueShopping') || 'Shop the Collection'} <FiArrowRight size={15} />
                </Link>
            </div>
        );
    }

    return (
        <div style={{
            background: '#0a0a0a',
            minHeight: '80vh',
            padding: '60px 0 100px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    borderBottom: '1.5px solid #222',
                    paddingBottom: '20px',
                    marginBottom: '40px',
                }}>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        color: '#fff',
                        margin: 0,
                    }}>
                        {t('cart.title') || 'Shopping Bag'}
                    </h1>
                    <span style={{ fontSize: '14px', color: '#7a7a7a' }}>
                        ({items.reduce((acc, curr) => acc + curr.quantity, 0)} {items.reduce((acc, curr) => acc + curr.quantity, 0) === 1 ? 'item' : 'items'})
                    </span>
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '40px',
                }} className="cart-grid-container">
                    {/* Left: Items list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {items.map((item) => {
                            const name = item.name?.[lang] || item.name?.en || item.name;
                            return (
                                <div
                                    key={item._id}
                                    style={{
                                        display: 'flex',
                                        gap: '24px',
                                        background: '#111',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        border: '1px solid #222',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        position: 'relative',
                                    }}
                                    className="cart-item-card"
                                >
                                    {/* Product Image */}
                                    <Link to={`/product/${item.slug}`} style={{ flexShrink: 0 }}>
                                        <div style={{
                                            width: '120px',
                                            height: '144px',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: '#1a1a1a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <img
                                                src={item.image || '/uploads/rose_petal_massager.png'}
                                                alt={name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </div>
                                    </Link>

                                    {/* Item Details */}
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                                <Link
                                                    to={`/product/${item.slug}`}
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: '#e0e0e0',
                                                    }}
                                                >
                                                    <h3 style={{
                                                        fontSize: '16px',
                                                        fontWeight: 600,
                                                        margin: '0 0 6px',
                                                        lineHeight: '1.4',
                                                        transition: 'color 0.2s',
                                                        color: '#e0e0e0',
                                                    }}
                                                        onMouseEnter={e => e.currentTarget.style.color = '#d4736e'}
                                                        onMouseLeave={e => e.currentTarget.style.color = '#e0e0e0'}
                                                    >
                                                        {name}
                                                    </h3>
                                                </Link>
                                                <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                                                    Rs. {item.price.toLocaleString()}
                                                </div>
                                            </div>

                                            {item.color && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                                    <span style={{ fontSize: '12px', color: '#7a7a7a' }}>Color:</span>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        color: '#e0e0e0',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {item.color}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions: Quantity + Remove */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: '16px',
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: '1.5px solid #333',
                                                borderRadius: '30px',
                                                background: '#1a1a1a',
                                                padding: '2px',
                                            }}>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: '#e0e0e0',
                                                        padding: '8px 12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '50%',
                                                    }}
                                                >
                                                    <FiMinus size={13} />
                                                </button>
                                                <span style={{
                                                    padding: '0 12px',
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: '#fff',
                                                    minWidth: '24px',
                                                    textAlign: 'center',
                                                }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: '#e0e0e0',
                                                        padding: '8px 12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '50%',
                                                    }}
                                                >
                                                    <FiPlus size={13} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item._id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#7a7a7a',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    transition: 'color 0.2s',
                                                    padding: '6px 12px',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#e53e3e'}
                                                onMouseLeave={e => e.currentTarget.style.color = '#7a7a7a'}
                                            >
                                                <FiTrash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Summary sidebar */}
                    <div className="cart-summary-sidebar">
                        <div style={{
                            background: '#111',
                            borderRadius: '16px',
                            padding: '32px',
                            border: '1px solid #222',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            position: 'sticky',
                            top: '100px',
                        }}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#fff',
                                margin: '0 0 24px',
                                letterSpacing: '-0.02em',
                            }}>
                                Summary
                            </h3>

                            {/* Subtotal lines */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                borderBottom: '1.5px solid #222',
                                paddingBottom: '20px',
                                marginBottom: '20px',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', color: '#7a7a7a' }}>
                                    <span>Subtotal</span>
                                    <span style={{ color: '#e0e0e0', fontWeight: 600 }}>Rs. {totalPrice.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', color: '#7a7a7a' }}>
                                    <span>Discreet Shipping</span>
                                    <span style={{ color: '#2f855a', fontWeight: 600 }}>FREE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', color: '#7a7a7a' }}>
                                    <span>Packaging</span>
                                    <span style={{ color: '#2f855a', fontWeight: 600 }}>FREE (Unbranded)</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                marginBottom: '32px',
                            }}>
                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#e0e0e0' }}>Total</span>
                                <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>
                                    Rs. {totalPrice.toLocaleString()}
                                </span>
                            </div>

                            {/* Checkout Actions */}
                            <Link
                                to="/checkout"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    padding: '18px',
                                    background: '#fff',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '30px',
                                    fontSize: '13.5px',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s, transform 0.15s',
                                    marginBottom: '16px',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = '#d4736e';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = '#fff';
                                }}
                            >
                                {t('cart.checkout') || 'Secure Checkout'} <FiArrowRight size={15} />
                            </Link>

                            <Link
                                to="/shop"
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    fontSize: '13.5px',
                                    fontWeight: 600,
                                    color: '#7a7a7a',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                onMouseLeave={e => e.currentTarget.style.color = '#7a7a7a'}
                            >
                                Continue Shopping
                            </Link>

                            {/* Trust Badges */}
                            <div style={{
                                marginTop: '32px',
                                paddingTop: '24px',
                                borderTop: '1px dashed #222',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FiShield style={{ color: '#d4736e' }} size={16} />
                                    <span style={{ fontSize: '12.5px', color: '#5a5a5a' }}>100% Privacy Guaranteed</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FiTruck style={{ color: '#d4736e' }} size={16} />
                                    <span style={{ fontSize: '12.5px', color: '#5a5a5a' }}>Double-Boxed Plain Packaging</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FiRefreshCw style={{ color: '#d4736e' }} size={16} />
                                    <span style={{ fontSize: '12.5px', color: '#5a5a5a' }}>1 Year Warranty Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Query / Grid styles */}
            <style>{`
                @media (min-width: 992px) {
                    .cart-grid-container {
                        grid-template-columns: 1.6fr 1fr !important;
                    }
                }
                .cart-item-card, .cart-summary-sidebar {
                    transition: transform 0.2s, box-shadow 0.2s;
                }
            `}</style>
        </div>
    );
};

export default Cart;
