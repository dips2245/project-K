import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('blissCart');
        if (stored) setItems(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem('blissCart', JSON.stringify(items));
    }, [items]);

    const addItem = (product, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            if (existing) {
                return prev.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [
                ...prev,
                {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || '',
                    slug: product.slug,
                    quantity,
                },
            ];
        });
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((item) => item._id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) return removeItem(id);
        setItems((prev) =>
            prev.map((item) => (item._id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
        >
            {children}
        </CartContext.Provider>
    );
};
