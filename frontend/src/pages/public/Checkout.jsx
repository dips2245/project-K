import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiCheck, FiArrowRight, FiArrowLeft, FiShield, FiLock, FiPackage, FiInfo } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useWhatsApp } from '../../hooks/useWhatsApp';

const DARK = '#0f0f0f';
const LIGHT = '#f5f5f5';
const ROSE = '#999999';

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #333',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '14px',
    background: '#1a1a1a',
    fontFamily: 'inherit',
    color: '#e0e0e0',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

const labelStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#888',
    display: 'block',
    marginBottom: '6px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
};

const STEPS = [
    { n: 1, label: 'Delivery' },
    { n: 2, label: 'Review' },
    { n: 3, label: 'Confirmed' },
];

export default function Checkout() {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const { number } = useWhatsApp();
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        district: '',
        notes: '',
        paymentMethod: 'cod',
    });

    useEffect(() => {
        if (items.length === 0 && !submitted) {
            navigate('/cart');
        }
    }, [items, submitted, navigate]);

    if (items.length === 0 && !submitted) return null;

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Step 1 → Step 2
    const goToReview = (e) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Step 2 → WhatsApp + Confirmation
    const handlePlaceOrder = (e) => {
        e.preventDefault();
        const orderNum = `BN-${Date.now().toString().slice(-6)}`;

        // Build WhatsApp message
        const itemLines = items
            .map(item => {
                const name = item.name?.en || item.name;
                return `  • ${name} × ${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}`;
            })
            .join('\n');

        const message =
            `🛍️ *New Order — Bliss Nepal*

*Order ID:* ${orderNum}
*Date:* ${new Date().toLocaleDateString('en-NP')}

━━━━━━━━━━━━━━━━━━━━
*ITEMS ORDERED:*
${itemLines}

*Total:* Rs. ${totalPrice.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━

*DELIVERY DETAILS:*
Name: ${form.fullName}
Phone: ${form.phone}
Email: ${form.email || 'N/A'}
Address: ${form.address}
District: ${form.district}
Notes: ${form.notes || 'None'}

*Payment:* ${form.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'To be confirmed'}

Please confirm this order. Thank you! 🙏`;

        // Open WhatsApp
        window.open(
            `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
            '_blank'
        );

        // Clear cart & show confirmation
        clearCart();
        setSubmitted(true);
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const subtotal = totalPrice;
    const shipping = subtotal >= 5000 ? 0 : 200;
    const grandTotal = subtotal + shipping;

    return (
        <div style={{
            background: '#000000',
            minHeight: '90vh',
            padding: '48px 0 96px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

                {/* ── Step Indicator ── */}
                <div style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    gap: '8px', marginBottom: '52px', flexWrap: 'wrap',
                }}>
                    {STEPS.map((s, idx) => (
                        <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '13px', fontWeight: 700,
                                background: step > s.n ? DARK : step === s.n ? ROSE : '#222',
                                color: step >= s.n ? '#fff' : '#666',
                                transition: 'all 0.3s',
                                boxShadow: step === s.n ? `0 4px 16px ${ROSE}55` : 'none',
                            }}>
                                {step > s.n ? <FiCheck size={15} /> : s.n}
                            </div>
                            <span style={{
                                fontSize: '13px', fontWeight: step >= s.n ? 600 : 400,
                                color: step >= s.n ? '#fff' : '#9a9a9a',
                            }}>{s.label}</span>
                            {idx < STEPS.length - 1 && (
                                <div style={{
                                    width: '48px', height: '2px', margin: '0 4px',
                                    background: step > s.n ? '#fff' : '#333',
                                    transition: 'background 0.3s',
                                }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Main Grid ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: step === 3 ? '1fr' : '1.6fr 1fr',
                    gap: '28px',
                    alignItems: 'start',
                }} className="checkout-grid">

                    {/* ─ LEFT PANEL ─ */}
                    <div style={{
                        background: '#111',
                        border: '1px solid #222',
                        borderRadius: '16px',
                        padding: '36px',
                        boxShadow: '0 2px 24px rgba(0,0,0,0.04)',
                    }}>

                        {/* ══ STEP 1: Delivery Info ══ */}
                        {step === 1 && (
                            <form onSubmit={goToReview}>
                                <h2 style={{ fontSize: '22px', fontWeight: 700, color: LIGHT, margin: '0 0 28px', letterSpacing: '-0.02em' }}>
                                    Delivery Information
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {/* Full Name */}
                                    <div>
                                        <label style={labelStyle}>Full Name *</label>
                                        <input name="fullName" type="text" value={form.fullName} onChange={handleChange}
                                            required placeholder="Your full name" style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = ROSE}
                                            onBlur={e => e.target.style.borderColor = '#333'}
                                        />
                                    </div>

                                    {/* Phone + Email */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2col">
                                        <div>
                                            <label style={labelStyle}>Phone Number *</label>
                                            <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                                                required placeholder="98XXXXXXXX" style={inputStyle}
                                                onFocus={e => e.target.style.borderColor = ROSE}
                                                onBlur={e => e.target.style.borderColor = '#333'}
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Email (Optional)</label>
                                            <input name="email" type="email" value={form.email} onChange={handleChange}
                                                placeholder="your@email.com" style={inputStyle}
                                                onFocus={e => e.target.style.borderColor = ROSE}
                                                onBlur={e => e.target.style.borderColor = '#333'}
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label style={labelStyle}>Street Address *</label>
                                        <input name="address" type="text" value={form.address} onChange={handleChange}
                                            required placeholder="House no., street name, area" style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = ROSE}
                                            onBlur={e => e.target.style.borderColor = '#333'}
                                        />
                                    </div>
                                    {/* District */}
                                    <div>
                                        <label style={labelStyle}>District *</label>
                                        <input name="district" type="text" value={form.district} onChange={handleChange}
                                            required placeholder="e.g. Lalitpur" style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = ROSE}
                                            onBlur={e => e.target.style.borderColor = '#333'}
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label style={labelStyle}>Delivery Notes (Optional)</label>
                                        <textarea name="notes" value={form.notes} onChange={handleChange}
                                            rows={3} placeholder="E.g. Call before delivery, leave at gate…"
                                            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                                            onFocus={e => e.target.style.borderColor = ROSE}
                                            onBlur={e => e.target.style.borderColor = '#333'}
                                        />
                                    </div>

                                    {/* Privacy note */}
                                    <div style={{
                                        padding: '14px 16px', background: '#1a1a1a',
                                        borderRadius: '10px', display: 'flex', gap: '10px',
                                    }}>
                                        <FiPackage size={16} color={ROSE} style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <p style={{ margin: 0, fontSize: '12.5px', color: '#aaa', lineHeight: 1.55 }}>
                                            <strong>100% Discreet Delivery:</strong> All orders are shipped in plain, unbranded packaging with no mention of Bliss Nepal or product contents on the outside.
                                        </p>
                                    </div>
                                </div>

                                <button type="submit" style={{
                                    marginTop: '28px', width: '100%', padding: '15px',
                                    background: DARK, color: '#fff', border: 'none',
                                    borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                                    letterSpacing: '0.08em', textTransform: 'uppercase',
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    transition: 'background 0.2s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = ROSE}
                                    onMouseLeave={e => e.currentTarget.style.background = DARK}
                                >
                                    Continue to Review <FiArrowRight size={15} />
                                </button>
                            </form>
                        )}

                        {/* ══ STEP 2: Review & Pay ══ */}
                        {step === 2 && (
                            <form onSubmit={handlePlaceOrder}>
                                <h2 style={{ fontSize: '22px', fontWeight: 700, color: LIGHT, margin: '0 0 28px', letterSpacing: '-0.02em' }}>
                                    Review & Confirm Order
                                </h2>

                                {/* Delivery Summary */}
                                <div style={{
                                    background: '#1a1a1a', border: '1px solid #222',
                                    borderRadius: '12px', padding: '20px', marginBottom: '24px',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            Delivering To
                                        </span>
                                        <button type="button" onClick={() => setStep(1)} style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            fontSize: '12px', fontWeight: 600, color: ROSE, fontFamily: 'inherit',
                                        }}>Edit</button>
                                    </div>
                                    <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#e0e0e0' }}>{form.fullName}</p>
                                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#aaa' }}>{form.address}, {form.district}</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>📞 {form.phone}</p>
                                </div>

                                {/* Payment Method */}
                                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#e0e0e0', margin: '0 0 14px' }}>Payment Method</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                    {[
                                        { value: 'cod', icon: '💵', title: 'Cash on Delivery (COD)', desc: 'Pay when your discreet package arrives at your door — no upfront payment needed.' },
                                        { value: 'whatsapp', icon: '💬', title: 'Confirm via WhatsApp', desc: 'Coordinate payment method (bank transfer, e-wallet) directly on WhatsApp after placing.' },
                                    ].map(opt => (
                                        <label key={opt.value} style={{
                                            display: 'flex', alignItems: 'flex-start', gap: '14px',
                                            padding: '16px 18px', borderRadius: '10px',
                                            border: `1.5px solid ${form.paymentMethod === opt.value ? ROSE : '#333'}`,
                                            background: form.paymentMethod === opt.value ? '#1a1a1a' : '#111',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                        }}>
                                            <input type="radio" name="paymentMethod" value={opt.value}
                                                checked={form.paymentMethod === opt.value}
                                                onChange={handleChange}
                                                style={{ marginTop: '3px', accentColor: ROSE, width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#e0e0e0', display: 'block', marginBottom: '3px' }}>
                                                    {opt.icon} {opt.title}
                                                </span>
                                                <span style={{ fontSize: '12.5px', color: '#7a7a7a', lineHeight: 1.5 }}>{opt.desc}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {/* WhatsApp notice */}
                                <div style={{
                                    padding: '14px 16px', background: '#0d2818',
                                    border: '1px solid #1a4d2e', borderRadius: '10px',
                                    display: 'flex', gap: '10px', marginBottom: '28px',
                                }}>
                                    <FaWhatsapp size={18} color="#1a1a1a" style={{ flexShrink: 0, marginTop: '1px' }} />
                                    <p style={{ margin: 0, fontSize: '12.5px', color: '#68d391', lineHeight: 1.55 }}>
                                        <strong>Placing this order will open WhatsApp</strong> with your complete order details pre-filled. Simply send the message to confirm with our team instantly.
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div style={{ display: 'flex', gap: '14px' }}>
                                    <button type="button" onClick={() => setStep(1)} style={{
                                        flex: 1, padding: '14px',
                                        background: '#111', color: '#e0e0e0',
                                        border: '1.5px solid #333', borderRadius: '8px',
                                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        fontFamily: 'inherit', transition: 'border-color 0.2s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = '#666'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
                                    >
                                        <FiArrowLeft size={14} /> Back
                                    </button>
                                    <button type="submit" style={{
                                        flex: 2.5, padding: '14px',
                                        background: '#666666', color: '#fff',
                                        border: 'none', borderRadius: '8px',
                                        fontSize: '13px', fontWeight: 700,
                                        letterSpacing: '0.06em', textTransform: 'uppercase',
                                        cursor: 'pointer', fontFamily: 'inherit',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        transition: 'background 0.2s, transform 0.15s',
                                        boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#555555'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#666666'; e.currentTarget.style.transform = 'none'; }}
                                    >
                                        <FaWhatsapp size={16} /> Place Order via WhatsApp
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ══ STEP 3: Confirmation ══ */}
                        {step === 3 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                {/* Success icon */}
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    background: '#0d2818', border: '2px solid #1a4d2e',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 28px', animation: 'popIn 0.4s cubic-bezier(0.16,1,0.3,1)',
                                }}>
                                    <FiCheck size={38} color="#666666" strokeWidth={2.5} />
                                </div>

                                <h2 style={{ fontSize: '28px', fontWeight: 700, color: LIGHT, margin: '0 0 12px', letterSpacing: '-0.03em' }}>
                                    Order Sent! 🎉
                                </h2>
                                <p style={{ fontSize: '15px', color: '#aaa', margin: '0 0 8px', lineHeight: 1.6 }}>
                                    Your order details have been sent to our WhatsApp team.
                                </p>
                                <p style={{ fontSize: '14px', color: '#888', margin: '0 0 40px', lineHeight: 1.6 }}>
                                    We'll confirm your order and delivery timeline shortly. <br />
                                    <strong>Expected delivery: 3–5 business days.</strong>
                                </p>

                                {/* What's next cards */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '14px', marginBottom: '40px', textAlign: 'left',
                                }} className="confirm-grid">
                                    {[
                                        { icon: '💬', title: 'WhatsApp Confirmation', desc: 'Our team will reply within 30 minutes to confirm your order.' },
                                        { icon: '📦', title: 'Discreet Packaging', desc: 'Your order is packed in a plain, unbranded box for full privacy.' },
                                        { icon: '🚚', title: 'Fast Delivery', desc: 'Delivered to your door in 3–5 days. Kathmandu: 1–2 days.' },
                                    ].map(card => (
                                        <div key={card.title} style={{
                                            padding: '18px', background: '#1a1a1a',
                                            border: '1px solid #222', borderRadius: '12px',
                                        }}>
                                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{card.icon}</div>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: LIGHT, marginBottom: '6px' }}>{card.title}</div>
                                            <div style={{ fontSize: '12px', color: '#7a7a7a', lineHeight: 1.5 }}>{card.desc}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <a
                                        href={`https://wa.me/${number}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            padding: '13px 28px',
                                            background: '#666666', color: '#fff',
                                            borderRadius: '8px', textDecoration: 'none',
                                            fontSize: '13px', fontWeight: 700,
                                            boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
                                            transition: 'background 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#555555'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#666666'}
                                    >
                                        <FaWhatsapp size={16} /> Open WhatsApp Chat
                                    </a>
                                    <Link to="/shop" style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '13px 28px',
                                        background: '#111', color: '#e0e0e0',
                                        border: '1.5px solid #333',
                                        borderRadius: '8px', textDecoration: 'none',
                                        fontSize: '13px', fontWeight: 600,
                                        transition: 'border-color 0.2s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = '#666'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
                                    >
                                        Continue Shopping <FiArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ─ RIGHT PANEL: Order Summary (only steps 1–2) ─ */}
                    {step < 3 && (
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <div style={{
                                background: '#111',
                                border: '1px solid #222',
                                borderRadius: '16px', padding: '28px',
                                boxShadow: '0 2px 24px rgba(0,0,0,0.2)',
                            }}>
                                <h3 style={{ fontSize: '17px', fontWeight: 700, color: LIGHT, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
                                    Order Summary
                                </h3>

                                {/* Items */}
                                <div style={{
                                    display: 'flex', flexDirection: 'column', gap: '14px',
                                    maxHeight: '300px', overflowY: 'auto',
                                    paddingBottom: '18px', marginBottom: '18px',
                                    borderBottom: '1px solid #222',
                                }}>
                                    {items.map(item => {
                                        const name = item.name?.en || item.name;
                                        return (
                                            <div key={item._id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '52px', height: '64px', borderRadius: '8px',
                                                    overflow: 'hidden', background: '#1a1a1a', flexShrink: 0,
                                                    border: '1px solid #222',
                                                }}>
                                                    {item.image ? (
                                                        <img src={item.image} alt={name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✦</div>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e0e0e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {name}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#9a9a9a', marginTop: '2px' }}>
                                                        Qty: {item.quantity}
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#e0e0e0', flexShrink: 0 }}>
                                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Totals */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#7a7a7a' }}>
                                        <span>Subtotal</span>
                                        <span>Rs. {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#7a7a7a' }}>
                                        <span>Shipping</span>
                                        <span style={{ color: shipping === 0 ? '#25a35a' : DARK, fontWeight: 600 }}>
                                            {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '-6px' }}>
                                            Free shipping on orders over Rs. 5,000
                                        </div>
                                    )}
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        paddingTop: '14px', marginTop: '4px',
                                        borderTop: '1.5px solid #222',
                                    }}>
                                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#e0e0e0' }}>Total</span>
                                        <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                                            Rs. {grandTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Trust badges */}
                                <div style={{
                                    marginTop: '22px', paddingTop: '18px',
                                    borderTop: '1px dashed #333',
                                    display: 'flex', flexDirection: 'column', gap: '10px',
                                }}>
                                    {[
                                        { icon: FiLock, text: 'Secure & Private Checkout' },
                                        { icon: FiShield, text: '100% Authentic Products' },
                                        { icon: FiPackage, text: 'Discreet Packaging Guaranteed' },
                                    ].map(({ icon: Icon, text }) => (
                                        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#aaa' }}>
                                            <Icon size={13} color={ROSE} />
                                            <span>{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @media (max-width: 860px) {
                    .checkout-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                @media (max-width: 560px) {
                    .grid-2col {
                        grid-template-columns: 1fr !important;
                    }
                    .confirm-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                @keyframes popIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to   { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
