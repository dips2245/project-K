import { useState, useEffect } from 'react';
import { settingsAPI } from './api';

let cachedNumber = null;

export function useWhatsApp() {
    const [number, setNumber] = useState(cachedNumber || '9779800000000');
    const [loading, setLoading] = useState(!cachedNumber);

    useEffect(() => {
        if (cachedNumber) return;
        settingsAPI.getWhatsappNumber()
            .then(({ data }) => {
                cachedNumber = data.number;
                setNumber(data.number);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { number, loading };
}
