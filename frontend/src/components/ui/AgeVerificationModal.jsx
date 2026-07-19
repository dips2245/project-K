import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock } from 'react-icons/fi';

const AgeVerificationModal = () => {
    const { t } = useTranslation();
    const [show, setShow] = useState(false);
    const [denied, setDenied] = useState(false);

    useEffect(() => {
        const verified = localStorage.getItem('blissAgeVerified');
        if (!verified) setShow(true);
    }, []);

    const handleConfirm = () => { localStorage.setItem('blissAgeVerified', 'true'); setShow(false); };
    const handleDeny = () => setDenied(true);

    return (
        <AnimatePresence>
            {show && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#111] rounded-3xl p-8 lg:p-12 max-w-md w-full text-center shadow-2xl border border-white/10"
                    >
                        {!denied ? (
                            <>
                                <span className="text-4xl font-semibold text-white lowercase tracking-[0.15em]">bliss</span>
                                <div className="w-12 h-0.5 bg-bliss-rose mx-auto my-6 rounded-full" />
                                <h3 className="text-xl font-semibold text-white mb-3">{t('ageVerification.title')}</h3>
                                <p className="text-bliss-muted mb-8 leading-relaxed text-[15px]">{t('ageVerification.message')}</p>
                                <div className="space-y-3">
                                    <button onClick={handleConfirm} className="w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition text-[15px]">
                                        {t('ageVerification.confirm')}
                                    </button>
                                    <button onClick={handleDeny} className="w-full py-3 bg-transparent border border-bliss-border text-bliss-muted rounded-xl hover:border-bliss-rose hover:text-bliss-rose transition text-[15px]">
                                        {t('ageVerification.deny')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-center text-red-500 mb-2">
                                    <FiLock size={48} />
                                </div>
                                <p className="text-gray-300 text-lg leading-relaxed">{t('ageVerification.denyMessage')}</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AgeVerificationModal;
