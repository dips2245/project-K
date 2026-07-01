import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
    const { t } = useTranslation();
    const number = '9779800000000';
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
                backgroundColor: '#25D366',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s, background-color 0.2s',
                textDecoration: 'none',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                e.currentTarget.style.backgroundColor = '#20ba5a';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.backgroundColor = '#25D366';
            }}
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp size={28} style={{ color: '#ffffff' }} />
        </a>
    );
};

export default WhatsAppButton;
