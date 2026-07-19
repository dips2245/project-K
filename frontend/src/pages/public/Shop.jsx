import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productAPI, categoryAPI } from '../../hooks/api';
import ProductCard from '../../components/ui/ProductCard';
import { FiSliders, FiX, FiChevronDown, FiSearch, FiTrendingUp } from 'react-icons/fi';

const PRICE_RANGES = [
    { value: '', labelKey: 'shop.priceAll' },
    { value: '0-5000', labelKey: 'shop.priceUnder' },
    { value: '5000-15000', labelKey: 'shop.priceMid' },
    { value: '15000-30000', labelKey: 'shop.priceHigh' },
    { value: '30000-999999', labelKey: 'shop.priceLuxury' },
];

const SORT_OPTIONS = [
    { value: '', labelKey: 'shop.sortFeatured' },
    { value: 'newest', labelKey: 'shop.sortNewest' },
    { value: 'bestseller', labelKey: 'shop.sortBestseller' },
    { value: 'price_asc', labelKey: 'shop.sortPriceLow' },
    { value: 'price_desc', labelKey: 'shop.sortPriceHigh' },
];

const Shop = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language === 'ne' ? 'ne' : 'en';
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);
    const debounceRef = useRef(null);

    const fetchSuggestions = useCallback(async (query) => {
        if (!query.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
        setSuggestionsLoading(true);
        try {
            const { data } = await productAPI.getAll({ search: query, limit: 5 });
            setSuggestions(data.products || []);
            setShowSuggestions(true);
        } catch { setSuggestions([]); }
        finally { setSuggestionsLoading(false); }
    }, []);

    const handleSearchInput = (e) => {
        const val = e.target.value;
        setSearchInput(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
    };

    const currentPage = Number(searchParams.get('page')) || 1;
    const currentCategory = searchParams.get('category') || '';
    const currentSearch = searchParams.get('search') || '';
    const currentSort = searchParams.get('sort') || '';
    const currentPrice = searchParams.get('price') || '';

    useEffect(() => {
        categoryAPI.getAll().then(r => setCategories(r.data || [])).catch(() => { });
    }, []);

    useEffect(() => {
        setSearchInput(currentSearch);
    }, [currentSearch]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = { page: currentPage, limit: 12 };
                if (currentCategory) params.category = currentCategory;
                if (currentSearch) params.search = currentSearch;
                if (currentSort) params.sort = currentSort;
                if (currentPrice) {
                    const [min, max] = currentPrice.split('-');
                    params.minPrice = min;
                    params.maxPrice = max;
                }
                const { data } = await productAPI.getAll(params);
                setProducts(data.products || []);
                setTotalPages(data.totalPages || 1);
                setTotalProducts(data.total || data.products?.length || 0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage, currentCategory, currentSearch, currentSort, currentPrice]);

    const setFilter = (key, value) => {
        const p = new URLSearchParams(searchParams);
        if (value) p.set(key, value); else p.delete(key);
        p.set('page', '1');
        setSearchParams(p);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setFilter('search', searchInput.trim());
        setShowSuggestions(false);
        searchInputRef.current?.blur();
    };

    useEffect(() => {
        const handleClick = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const clearAll = () => {
        setSearchParams(new URLSearchParams());
        setSearchInput('');
    };

    const getCategoryName = (cat) => {
        if (!cat) return '';
        return cat.name?.[lang] || cat.name?.en || cat.name || '';
    };

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === currentSort);
    const activeSortLabel = currentSortLabel ? t(currentSortLabel.labelKey) : t('shop.sortFeatured');

    const currentPriceLabel = PRICE_RANGES.find(r => r.value === currentPrice);
    const activePriceLabel = currentPriceLabel ? t(currentPriceLabel.labelKey) : t('shop.priceAll');

    return (
        <div style={{
            minHeight: '100vh',
            background: '#000000',
            fontFamily: "'Plus Jakarta Sans', 'PolySans', sans-serif",
        }}>
            {/* ── Page Header ── */}
            <div style={{
                borderBottom: '1px solid #222',
                background: '#0d0d0d',
                padding: '40px 40px 32px',
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: 'clamp(28px, 3.5vw, 44px)',
                        fontWeight: 700, letterSpacing: '-0.03em',
                        color: '#f5f5f5', margin: '0 0 6px',
                        fontFamily: 'inherit',
                    }}>
                        {currentSearch
                            ? `${t('shop.searchResults')} "${currentSearch}"`
                            : currentCategory
                                ? getCategoryName(categories.find(c => c._id === currentCategory))
                                : t('shop.title')}
                    </h1>
                    <p style={{ fontSize: '13px', color: '#9a9a9a', margin: 0 }}>
                        {loading ? t('common.loading') : `${totalProducts} ${t('shop.productsCount')}`}
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
                {/* ── Search Bar with Suggestions ── */}
                <form onSubmit={handleSearchSubmit} style={{
                    display: 'flex', gap: '10px', marginBottom: '24px', position: 'relative',
                }}>
                    <div ref={searchContainerRef} style={{ flex: 1, position: 'relative' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            background: '#111', border: '1.5px solid #333',
                            borderRadius: '8px', padding: '0 16px',
                            transition: 'border-color 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#888888'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
                        >
                            <FiSearch size={16} color="#666" style={{ flexShrink: 0 }} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchInput}
                                onChange={handleSearchInput}
                                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                placeholder={t('shop.searchPlaceholder')}
                                autoComplete="off"
                                style={{
                                    flex: 1, background: 'none', border: 'none',
                                    padding: '12px 12px', color: '#e0e0e0',
                                    fontSize: '14px', outline: 'none',
                                    fontFamily: 'inherit',
                                }}
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchInput(''); setSuggestions([]); setShowSuggestions(false); setFilter('search', ''); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' }}
                                >
                                    <FiX size={14} />
                                </button>
                            )}
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                                background: '#1a1a1a', border: '1px solid #2a2a2a',
                                borderRadius: '10px', boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
                                padding: '6px', zIndex: 200, maxHeight: '320px', overflow: 'auto',
                                animation: 'dropdownIn 0.12s ease',
                            }}>
                                {suggestionsLoading ? (
                                    <div style={{ padding: '16px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
                                        {t('common.loading')}
                                    </div>
                                ) : suggestions.length === 0 ? (
                                    <div style={{ padding: '16px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
                                        {searchInput ? t('shop.noResults') : t('nav.search')}
                                    </div>
                                ) : (
                                    suggestions.map((p) => {
                                        const name = p.name?.[lang] || p.name?.en || p.name;
                                        return (
                                            <Link
                                                key={p._id}
                                                to={`/product/${p.slug}`}
                                                onClick={() => setShowSuggestions(false)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px',
                                                    padding: '10px 12px', borderRadius: '8px',
                                                    textDecoration: 'none', color: '#e0e0e0',
                                                    transition: 'background 0.12s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#222'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                            >
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '6px',
                                                    background: '#111', overflow: 'hidden', flexShrink: 0,
                                                }}>
                                                    <img
                                                        src={p.images?.[0] || '/uploads/rose_petal_massager.png'}
                                                        alt=""
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', truncate: true, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {name}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>
                                                        Rs. {p.price?.toLocaleString()}
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: '10px', color: '#555', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                                    {t('shop.viewDetails')}
                                                </span>
                                            </Link>
                                        );
                                    })
                                )}
                                {suggestions.length > 0 && (
                                    <div style={{ borderTop: '1px solid #222', padding: '8px 12px', textAlign: 'center' }}>
                                        <button
                                            type="submit"
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                fontSize: '12px', color: '#888888', fontWeight: 600,
                                                fontFamily: 'inherit',
                                            }}
                                            onClick={() => handleSearchSubmit(new Event('submit'))}
                                        >
                                            {t('common.search')} "{searchInput}"
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '12px 24px', background: '#888888', color: '#fff',
                            border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '12.5px', fontWeight: 600, letterSpacing: '0.04em',
                            textTransform: 'uppercase', fontFamily: 'inherit',
                            whiteSpace: 'nowrap', transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#c05f5a'}
                        onMouseLeave={e => e.currentTarget.style.background = '#888888'}
                    >
                        {t('common.search')}
                    </button>
                </form>

                {/* ── Filter / Sort Bar ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '32px', gap: '16px', flexWrap: 'wrap',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setFilterOpen(v => !v)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '7px',
                                padding: '9px 18px',
                                border: '1.5px solid #333',
                                borderRadius: '6px', background: filterOpen ? '#000000' : '#111',
                                color: filterOpen ? '#fff' : '#e0e0e0',
                                fontSize: '12.5px', fontWeight: 600,
                                letterSpacing: '0.04em', textTransform: 'uppercase',
                                cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'all 0.2s',
                            }}
                        >
                            <FiSliders size={14} /> {t('common.filter')}
                        </button>

                        {currentCategory && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 12px', background: '#1a1a1a', borderRadius: '20px',
                                fontSize: '12px', color: '#ccc', fontWeight: 500,
                            }}>
                                {getCategoryName(categories.find(c => c._id === currentCategory))}
                                <button onClick={() => setFilter('category', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', color: '#888' }}><FiX size={12} /></button>
                            </div>
                        )}

                        {currentSearch && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 12px', background: '#1a1a1a', borderRadius: '20px',
                                fontSize: '12px', color: '#ccc', fontWeight: 500,
                            }}>
                                "{currentSearch}"
                                <button onClick={() => { setFilter('search', ''); setSearchInput(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', color: '#888' }}><FiX size={12} /></button>
                            </div>
                        )}

                        {currentPrice && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 12px', background: '#1a1a1a', borderRadius: '20px',
                                fontSize: '12px', color: '#ccc', fontWeight: 500,
                            }}>
                                {activePriceLabel}
                                <button onClick={() => setFilter('price', '')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', color: '#888' }}><FiX size={12} /></button>
                            </div>
                        )}

                        {(currentCategory || currentSearch || currentSort || currentPrice) && (
                            <button onClick={clearAll} style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: '12px', color: '#888888', fontWeight: 600,
                                letterSpacing: '0.04em', textTransform: 'uppercase',
                                textDecoration: 'underline', fontFamily: 'inherit',
                            }}>
                                {t('shop.clearFilters')}
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setSortOpen(v => !v)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '9px 18px', border: '1.5px solid #333',
                                borderRadius: '6px', background: '#111', color: '#e0e0e0',
                                fontSize: '12.5px', fontWeight: 500,
                                cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'border-color 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#888888'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
                        >
                            <span style={{ color: '#9a9a9a', fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                {t('common.sort')}:
                            </span>
                            {activeSortLabel}
                            <FiChevronDown size={14} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                        {sortOpen && (
                            <div style={{
                                position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                                background: '#1a1a1a', border: '1px solid #2a2a2a',
                                borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                padding: '6px 4px', minWidth: '220px', zIndex: 100,
                                animation: 'dropdownIn 0.15s ease',
                            }}>
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setFilter('sort', opt.value); setSortOpen(false); }}
                                        style={{
                                            display: 'block', width: '100%', textAlign: 'left',
                                            padding: '9px 14px',
                                            background: currentSort === opt.value ? '#222' : 'none',
                                            border: 'none', cursor: 'pointer',
                                            fontSize: '13px',
                                            color: currentSort === opt.value ? '#888888' : '#e0e0e0',
                                            fontWeight: currentSort === opt.value ? 600 : 400,
                                            borderRadius: '5px', fontFamily: 'inherit',
                                            transition: 'background 0.12s',
                                        }}
                                        onMouseEnter={e => { if (currentSort !== opt.value) e.currentTarget.style.background = '#222'; }}
                                        onMouseLeave={e => { if (currentSort !== opt.value) e.currentTarget.style.background = 'none'; }}
                                    >
                                        {t(opt.labelKey)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Filter Panel ── */}
                {filterOpen && (
                    <div style={{
                        background: '#111', borderRadius: '10px',
                        padding: '24px', marginBottom: '32px',
                        border: '1px solid #222', animation: 'dropdownIn 0.2s ease',
                    }}>
                        {/* Category Filter */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e0e0e0', fontFamily: 'inherit' }}>
                                    {t('shop.filterByCategory')}
                                </h3>
                                <button onClick={() => setFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><FiX size={16} /></button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                <button
                                    onClick={() => setFilter('category', '')}
                                    style={{
                                        padding: '7px 16px', borderRadius: '20px',
                                        border: '1.5px solid',
                                        borderColor: !currentCategory ? '#fff' : '#333',
                                        background: !currentCategory ? '#000000' : '#111',
                                        color: !currentCategory ? '#fff' : '#ccc',
                                        fontSize: '12.5px', fontWeight: 500,
                                        cursor: 'pointer', fontFamily: 'inherit',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {t('shop.allCategories')}
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setFilter('category', cat._id)}
                                        style={{
                                            padding: '7px 16px', borderRadius: '20px',
                                            border: '1.5px solid',
                                            borderColor: currentCategory === cat._id ? '#ffffff' : '#333',
                                            background: currentCategory === cat._id ? '#ffffff' : '#111',
                                            color: currentCategory === cat._id ? '#000' : '#ccc',
                                            fontSize: '12.5px', fontWeight: 500,
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {getCategoryName(cat)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <h3 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e0e0e0', fontFamily: 'inherit' }}>
                                {t('shop.filterPrice')}
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {PRICE_RANGES.map(range => (
                                    <button
                                        key={range.value}
                                        onClick={() => setFilter('price', range.value)}
                                        style={{
                                            padding: '7px 16px', borderRadius: '20px',
                                            border: '1.5px solid',
                                            borderColor: currentPrice === range.value ? '#888888' : '#333',
                                            background: currentPrice === range.value ? '#888888' : '#111',
                                            color: currentPrice === range.value ? '#fff' : '#ccc',
                                            fontSize: '12.5px', fontWeight: 500,
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {t(range.labelKey)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Product Grid ── */}
                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '24px',
                    }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i}>
                                <div style={{
                                    aspectRatio: '3/4', borderRadius: '10px',
                                    background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite',
                                }} />
                                <div style={{ height: '13px', background: '#1a1a1a', borderRadius: '4px', marginTop: '12px', width: '75%', animation: 'shimmer 1.5s infinite' }} />
                                <div style={{ height: '11px', background: '#1a1a1a', borderRadius: '4px', marginTop: '6px', width: '40%', animation: 'shimmer 1.5s infinite' }} />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9a9a9a' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>💋</div>
                        <p style={{ fontSize: '16px', fontWeight: 500, color: '#e0e0e0', margin: '0 0 8px' }}>
                            {t('shop.noResults')}
                        </p>
                        <p style={{ fontSize: '13px', margin: '0 0 24px' }}>
                            {t('shop.noResultsHint')}
                        </p>
                        <button onClick={clearAll} style={{
                            padding: '10px 24px', background: '#000000', color: '#fff',
                            border: 'none', borderRadius: '6px', cursor: 'pointer',
                            fontSize: '12.5px', fontWeight: 600, letterSpacing: '0.06em',
                            textTransform: 'uppercase', fontFamily: 'inherit',
                        }}>
                            {t('shop.clearFilters')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: '24px',
                        }}>
                            {products.map((p, i) => (
                                <ProductCard key={p._id} product={p} cardIndex={i} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex', justifyContent: 'center',
                                gap: '6px', marginTop: '60px', alignItems: 'center',
                            }}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setFilter('page', String(page))}
                                        style={{
                                            width: '38px', height: '38px',
                                            borderRadius: '6px', border: '1.5px solid',
                                            borderColor: currentPage === page ? '#fff' : '#333',
                                            background: currentPage === page ? '#000000' : '#111',
                                            color: currentPage === page ? '#fff' : '#e0e0e0',
                                            fontSize: '13px', fontWeight: 500,
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { if (currentPage !== page) { e.currentTarget.style.borderColor = '#888888'; e.currentTarget.style.color = '#888888'; } }}
                                        onMouseLeave={e => { if (currentPage !== page) { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#e0e0e0'; } }}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {sortOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setSortOpen(false)} />
            )}

            <style>{`
                @keyframes dropdownIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% 0; }
                    100% { background-position:  200% 0; }
                }
            `}</style>
        </div>
    );
};

export default Shop;
