import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiAlertTriangle } from 'react-icons/fi';
import { FaPinterest, FaTiktok } from 'react-icons/fa';

const FOOTER_LINKS = (t) => ({
    [t('footer.quickLinks')]: [
        { label: 'All Products', to: '/shop' },
        { label: 'Bestsellers', to: '/shop?sort=bestseller' },
        { label: 'New Arrivals', to: '/shop?sort=newest' },
    ],
    [t('footer.customerService')]: [
        { label: 'FAQ', to: '#' },
        { label: t('footer.shipping'), to: '#' },
        { label: t('footer.returns'), to: '#' },
        { label: 'Contact Us', to: '#' },
    ],
    [t('footer.about')]: [
        { label: t('footer.privacy'), to: '/terms' },
        { label: t('footer.terms'), to: '/terms' },
    ],
});

const SOCIAL = [
    { Icon: FiInstagram, href: '#', label: 'Instagram' },
    { Icon: FiFacebook, href: '#', label: 'Facebook' },
    { Icon: FaPinterest, href: '#', label: 'Pinterest' },
    { Icon: FiTwitter, href: '#', label: 'Twitter' },
    { Icon: FiYoutube, href: '#', label: 'YouTube' },
    { Icon: FaTiktok, href: '#', label: 'TikTok' },
];

const PAYMENT_METHODS = ['Khalti', 'eSewa', 'Visa', 'Mastercard', 'Bank Transfer'];

const FooterLink = ({ label, to }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <li>
            <Link
                to={to}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    textDecoration: 'none',
                    fontSize: '13px',
                    color: hovered ? '#fff' : 'rgba(255,255,255,0.45)',
                    transition: 'color 0.2s',
                    lineHeight: '2',
                    display: 'inline-block',
                }}
            >
                {label}
            </Link>
        </li>
    );
};

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer style={{
            background: '#0c0c0c',
            color: '#fff',
            fontFamily: "'Plus Jakarta Sans', 'PolySans', sans-serif",
        }}>
            {/* ── Main footer grid ── */}
            <div style={{ padding: '64px 40px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                    gap: '40px',
                }} className="footer-grid">

                    {/* Brand column */}
                    <div>
                        <span style={{
                            fontSize: '28px', fontWeight: 700,
                            letterSpacing: '-0.04em', color: '#fff',
                            display: 'block', marginBottom: '14px',
                        }}>
                            bliss
                        </span>
                        <p style={{
                            fontSize: '13px', color: 'rgba(255,255,255,0.4)',
                            lineHeight: 1.75, margin: '0 0 24px',
                            maxWidth: '240px',
                        }}>
                            {t('site.description')}
                        </p>

                        {/* Social icons */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {SOCIAL.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    style={{
                                        width: '34px', height: '34px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.4)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#d4736e';
                                        e.currentTarget.style.color = '#d4736e';
                                        e.currentTarget.style.background = 'rgba(212,115,110,0.08)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(FOOTER_LINKS(t)).map(([heading, links]) => (
                        <div key={heading}>
                            <h4 style={{
                                fontSize: '10.5px', fontWeight: 700,
                                letterSpacing: '0.12em', textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.55)',
                                margin: '0 0 16px',
                            }}>
                                {heading}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {links.map(link => (
                                    <FooterLink key={link.label} label={link.label} to={link.to} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.07)',
                padding: '20px 40px',
            }}>
                <div style={{
                    maxWidth: '1200px', margin: '0 auto',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '12px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                            © {new Date().getFullYear()} {t('site.name')}. {t('footer.rights')}
                        </p>
                        <span style={{
                            fontSize: '10px', color: '#d4736e',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontWeight: 600, letterSpacing: '0.04em',
                        }}>
                            <FiAlertTriangle size={11} />
                            {t('site.ageNotice')}
                        </span>
                        <span style={{
                            fontSize: '10px', color: 'rgba(255,255,255,0.3)',
                            letterSpacing: '0.02em',
                        }}>
                            🔒 {t('footer.discreetPromise')}
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
                @media (max-width: 520px) {
                    .footer-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
