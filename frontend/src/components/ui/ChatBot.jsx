import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiChevronRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const WA_NUMBER = '9779800000000';

const QUICK_REPLIES = [
    { label: '📦 Delivery info', text: 'How long does delivery take?' },
    { label: '🔒 Packaging', text: 'Is packaging discreet?' },
    { label: '💳 Payment', text: 'What payment methods do you accept?' },
    { label: '↩ Returns', text: 'What is your return policy?' },
    { label: '🛒 Products', text: 'What products do you sell?' },
    { label: '💬 Talk to us', text: 'WHATSAPP' },
];

const getBotResponse = (msg) => {
    const l = msg.toLowerCase();

    if (l === 'whatsapp') {
        return { text: null, whatsapp: true };
    }
    if (l.includes('ship') || l.includes('deliver') || l.includes('how long') || l.includes('days')) {
        return {
            text: '🚚 We deliver across all of Nepal within **3–5 business days**. Orders placed before 2 PM are dispatched the same day. Kathmandu Valley gets same-day or next-day delivery!'
        };
    }
    if (l.includes('packag') || l.includes('discreet') || l.includes('secret') || l.includes('privacy') || l.includes('box')) {
        return {
            text: '🔒 Absolutely! All our orders are shipped in **plain, unbranded packaging** with no mention of the product or Bliss Nepal on the outside. Your privacy is our top priority.'
        };
    }
    if (l.includes('return') || l.includes('refund')) {
        return {
            text: '↩ Due to the intimate nature of our products, we do not accept returns. However, if your product is defective or not working, we support full replacements or refunds. Contact us on WhatsApp for instant assistance.'
        };
    }
    if (l.includes('pay') || l.includes('cod') || l.includes('cash') || l.includes('method')) {
        return {
            text: '💳 We accept **Cash on Delivery (COD)** across Nepal — no upfront payment needed! You pay only when you receive your order. We also accept bank transfers via WhatsApp coordination.'
        };
    }
    if (l.includes('product') || l.includes('sell') || l.includes('vibrat') || l.includes('toy') || l.includes('what do')) {
        return {
            text: '🌸 We offer a curated range of **premium intimate wellness products** — vibrators, couples toys, massagers, lubricants, and more. All 100% authentic, medical-grade certified. Browse our Shop!'
        };
    }
    if (l.includes('price') || l.includes('cost') || l.includes('how much') || l.includes('expensive')) {
        return {
            text: '💰 Our products range from **Rs. 3,500 to Rs. 25,000+**, all genuine and certified. We offer competitive Nepal pricing with free delivery on orders above Rs. 5,000!'
        };
    }
    if (l.includes('authentic') || l.includes('original') || l.includes('fake') || l.includes('genuine')) {
        return {
            text: '✅ We guarantee **100% authentic, original products** sourced directly from authorized distributors. Each product comes with manufacturer certification and full warranty support.'
        };
    }
    if (l.includes('hi') || l.includes('hello') || l.includes('hey') || l.includes('namaste')) {
        return {
            text: '🌸 Namaste! Welcome to **Bliss Nepal**! I\'m here to help you with any questions about our products, delivery, packaging, or payments. What can I help you with?'
        };
    }
    if (l.includes('contact') || l.includes('phone') || l.includes('call') || l.includes('support') || l.includes('help')) {
        return { text: null, whatsapp: true };
    }

    return { text: null, whatsapp: true };
};

const openWhatsApp = (msg = 'Hi! I need help with Bliss Nepal.') => {
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
};

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const chatRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{
                from: 'bot',
                text: '🌸 Hello! Welcome to **Bliss Nepal**. How can I help you today? Pick a topic below or type your question!',
            }]);
        }
    }, [open]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, typing]);

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    const addMessage = (from, text) => {
        setMessages(p => [...p, { from, text }]);
    };

    const handleSend = (rawText) => {
        const userMsg = (rawText || input).trim();
        if (!userMsg) return;
        setInput('');
        addMessage('user', userMsg);

        if (userMsg === 'WHATSAPP') {
            openWhatsApp();
            return;
        }

        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            const response = getBotResponse(userMsg);
            if (response.whatsapp) {
                addMessage('bot', '💬 Let me connect you directly with our team on WhatsApp for instant help!');
                setTimeout(() => openWhatsApp(`Hi! I have a question: ${userMsg === 'WHATSAPP' ? 'I need help' : userMsg}`), 600);
            } else {
                addMessage('bot', response.text);
            }
        }, 700);
    };

    const renderText = (text) => {
        if (!text) return null;
        const parts = text.split(/\*\*(.*?)\*\*/g);
        return parts.map((part, i) =>
            i % 2 === 1
                ? <strong key={i}>{part}</strong>
                : part
        );
    };

    return (
        <>
            {/* Chat Window */}
            {open && (
                <div style={{
                    position: 'fixed',
                    bottom: '96px',
                    left: '24px',
                    zIndex: 1001,
                    width: '360px',
                    maxWidth: 'calc(100vw - 48px)',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    animation: 'chatSlideUp 0.25s cubic-bezier(0.16,1,0.3,1)',
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2020 100%)',
                        color: '#ffffff',
                        padding: '16px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'rgba(212,115,110,0.2)',
                            border: '2px solid rgba(212,115,110,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', flexShrink: 0,
                        }}>🌸</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: 700 }}>Bliss Assistant</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#48bb78', display: 'inline-block' }} />
                                Online now
                            </div>
                        </div>
                        <button
                            onClick={() => openWhatsApp()}
                            style={{
                                background: '#25D366', border: 'none', borderRadius: '8px',
                                padding: '6px 10px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '5px',
                                fontSize: '11px', fontWeight: 600, color: '#fff',
                                fontFamily: 'inherit',
                            }}
                        >
                            <FaWhatsapp size={13} /> WhatsApp
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={chatRef} style={{
                        height: '300px',
                        overflowY: 'auto',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        background: '#111',
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                            }}>
                                <div style={{
                                    maxWidth: '82%',
                                    padding: '10px 14px',
                                    borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    fontSize: '13px',
                                    lineHeight: '1.5',
                                    backgroundColor: msg.from === 'user' ? '#c97b6e' : '#222',
                                    color: msg.from === 'user' ? '#ffffff' : '#e0e0e0',
                                    border: msg.from === 'bot' ? '1px solid #333' : 'none',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                }}>
                                    {renderText(msg.text)}
                                </div>
                            </div>
                        ))}
                        {typing && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{
                                    padding: '10px 16px', borderRadius: '18px 18px 18px 4px',
                                    background: '#222', border: '1px solid #333',
                                    display: 'flex', gap: '4px', alignItems: 'center',
                                }}>
                                    {[0, 1, 2].map(i => (
                                        <span key={i} style={{
                                            width: '6px', height: '6px', borderRadius: '50%',
                                            background: '#d4736e',
                                            animation: `typingDot 1.2s ${i * 0.2}s infinite`,
                                            display: 'inline-block',
                                        }} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Replies */}
                    <div style={{
                        padding: '8px 12px',
                        background: '#1a1a1a',
                        borderTop: '1px solid #2a2a2a',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                    }}>
                        {QUICK_REPLIES.map(qr => (
                            <button
                                key={qr.label}
                                onClick={() => handleSend(qr.text)}
                                style={{
                                    padding: '5px 10px',
                                    background: '#2a2a2a',
                                    border: '1px solid #333',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    color: '#ccc',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#d4736e'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#d4736e'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = '#ccc'; e.currentTarget.style.borderColor = '#333'; }}
                            >
                                {qr.label}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '10px 12px',
                        background: '#1a1a1a',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                    }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message…"
                            style={{
                                flex: 1,
                                background: '#2a2a2a',
                                border: '1px solid #333',
                                borderRadius: '24px',
                                padding: '9px 16px',
                                fontSize: '13px',
                                outline: 'none',
                                color: '#e0e0e0',
                                fontFamily: 'inherit',
                            }}
                        />
                        <button
                            onClick={() => handleSend()}
                            style={{
                                width: '38px', height: '38px',
                                background: '#c97b6e',
                                border: 'none', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', flexShrink: 0,
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#d4736e'}
                            onMouseLeave={e => e.currentTarget.style.background = '#c97b6e'}
                        >
                            <FiSend size={14} color="#fff" />
                        </button>
                    </div>

                    {/* WhatsApp CTA */}
                    <div style={{
                        padding: '10px 16px 14px',
                        background: '#1a1a1a',
                        borderTop: '1px solid #2a2a2a',
                        textAlign: 'center',
                    }}>
                        <button
                            onClick={() => openWhatsApp()}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '8px 18px',
                                background: '#25D366',
                                border: 'none', borderRadius: '24px',
                                color: '#fff', fontSize: '12px', fontWeight: 600,
                                cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'background 0.2s, transform 0.15s',
                                boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#20ba5a'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            <FaWhatsapp size={14} />
                            Chat on WhatsApp for instant help
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setOpen(v => !v)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '24px',
                    zIndex: 1001,
                    width: '56px', height: '56px',
                    backgroundColor: open ? '#d4736e' : '#1a1a1a',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: open ? '0 4px 20px rgba(212,115,110,0.4)' : '0 4px 20px rgba(0,0,0,0.2)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                aria-label="Open chat"
            >
                {open ? <FiX size={22} color="#fff" /> : <FiMessageSquare size={22} color="#fff" />}
            </button>

            <style>{`
                @keyframes chatSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-6px); opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default ChatBot;
