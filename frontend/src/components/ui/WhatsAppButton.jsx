import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import { useWhatsApp } from '../../hooks/useWhatsApp';

const WhatsAppButton = () => {
    const { t } = useTranslation();
    const { number } = useWhatsApp();
    const message = t('whatsapp.defaultMessage') || 'Hi! I have a question about Bliss Nepal.';
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 999,
                width: '56px',
                height: '56px',
                backgroundColor: '#1a1a1a',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                cursor: 'pointer',
                transition: 'transform 0.2s, background-color 0.2s',
                textDecoration: 'none',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                e.currentTarget.style.backgroundColor = '#333';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
            }}
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp size={28} style={{ color: '#ffffff' }} />
        </a>
    );
};

export default WhatsAppButton;
