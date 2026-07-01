import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiTruck, FiShield, FiEye, FiHeart, FiPlay, FiVolume2, FiVolumeX, FiSliders, FiDroplet, FiBox, FiLayers, FiTrendingUp } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../../hooks/api';
import ProductCard from '../../components/ui/ProductCard';

const Home = () => {
    const { t } = useTranslation();
    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    productAPI.getAll({ featured: true, limit: 6 }),
                    categoryAPI.getAll(),
                ]);
                setFeatured(prodRes.data.products);
                setCategories(catRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const categoryIcons = [
        <FiHeart size={24} className="text-bliss-rose" />, 
        <FiSliders size={24} className="text-bliss-rose" />, 
        <FiDroplet size={24} className="text-bliss-rose" />, 
        <FiBox size={24} className="text-bliss-rose" />, 
        <FiLayers size={24} className="text-bliss-rose" />, 
        <FiTrendingUp size={24} className="text-bliss-rose" />
    ];
    const features = [
        { icon: <FiEye size={20} />, title: 'Discreet Packaging', desc: 'Plain, unmarked packaging on all orders' },
        { icon: <FiShield size={20} />, title: 'Body-Safe Materials', desc: 'US FDA-approved medical-grade silicone' },
        { icon: <FiTruck size={20} />, title: 'Express Delivery', desc: 'Secure shipping across Nepal' },
        { icon: <FiHeart size={20} />, title: 'Intimate Wellness', desc: 'Crafted for pleasure, health, & comfort' },
    ];

    return (
        <div className="bg-bliss-bg">
            {/* Immersive Video Hero Section */}
            <section className="relative h-[85vh] lg:h-[90vh] w-full overflow-hidden bg-black flex items-center justify-center">
                {/* Background Video */}
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    src="https://assets.mixkit.co/videos/preview/mixkit-abstract-gold-and-black-3d-background-loop-42861-large.mp4"
                />

                {/* Dark Luxury Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/70" />

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white space-y-6">
                    <span className="text-xs uppercase tracking-[0.25em] font-medium text-bliss-pink/80">Premium Intimate Lifestyle</span>
                    <h1 className="font-luxury text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tight text-white max-w-4xl mx-auto">
                        Elevate Your Intimate Moments
                    </h1>
                    <p className="text-sm md:text-base lg:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover Bliss Nepal's curated collection of world-class, premium wellness devices. Sleek design meets high-end technology for unmatched pleasure.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <Link to="/shop" className="w-full sm:w-auto px-10 py-4 bg-white text-bliss-dark font-medium rounded-full hover:bg-bliss-pink/90 hover:scale-105 transition-all text-sm tracking-wide">
                            Explore Collection
                        </Link>
                        <Link to="/shop" className="w-full sm:w-auto px-10 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 hover:border-white transition-all text-sm tracking-wide">
                            View Bestsellers
                        </Link>
                    </div>
                </div>

                {/* Mute Button */}
                <button 
                    onClick={toggleMute} 
                    className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full border border-white/20 bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition"
                    title={isMuted ? "Unmute Video" : "Mute Video"}
                >
                    {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
                </button>
            </section>

            {/* Features strip */}
            <section className="bg-bliss-dark text-white border-y border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-bliss-pink group-hover:bg-bliss-pink group-hover:text-bliss-dark transition duration-300 flex-shrink-0">
                                    {f.icon}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium tracking-wide text-white">{f.title}</h3>
                                    <p className="text-xs text-white/50 mt-0.5">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quiz CTA Section */}
            <section className="py-20 bg-gradient-to-r from-bliss-dark via-bliss-dark to-bliss-dark border-b border-bliss-border/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6">
                        <span className="text-xs uppercase tracking-widest text-bliss-pink font-medium">Personalized</span>
                        <h2 className="font-luxury text-4xl lg:text-5xl text-white tracking-tight">Find Your Perfect Product</h2>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto font-light">
                            Not sure where to start? Answer a few quick questions and we'll recommend the perfect products tailored to your preferences.
                        </p>
                        <Link to="/quiz" className="inline-block px-12 py-4 bg-gradient-to-r from-bliss-pink to-bliss-rose text-white font-medium rounded-full hover:shadow-xl hover:scale-105 transition-all text-base tracking-wide">
                            Take the Quiz Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Shop by Category */}
            <section className="py-20 bg-bliss-bg border-b border-bliss-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-xl mx-auto mb-14">
                        <span className="text-xs uppercase tracking-widest text-bliss-rose font-medium">Collections</span>
                        <h2 className="font-luxury text-3xl lg:text-5xl text-bliss-dark mt-2 tracking-tight">Shop by Category</h2>
                        <p className="text-bliss-muted text-sm mt-3 font-light">Explore targeted intimate products built with state-of-the-art materials.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((cat, i) => (
                            <Link key={cat._id} to={`/shop?category=${cat._id}`}
                                className="group bg-bliss-white rounded-2xl p-6 text-center border border-bliss-border/60 hover:border-bliss-rose/40 hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bliss-cream flex items-center justify-center group-hover:bg-bliss-pink/40 group-hover:rotate-6 transition duration-500">
                                    {categoryIcons[i % 6]}
                                </div>
                                <span className="text-bliss-dark text-[15px] font-medium group-hover:text-bliss-rose transition">{cat.name.en}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 lg:py-28 bg-bliss-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12 border-b border-bliss-border pb-6">
                        <div>
                            <span className="text-xs uppercase tracking-widest text-bliss-rose font-medium">Bestsellers</span>
                            <h2 className="font-luxury text-3xl lg:text-5xl text-bliss-dark mt-1 tracking-tight">Featured Masterpieces</h2>
                        </div>
                        <Link to="/shop" className="text-bliss-rose hover:text-bliss-dark transition text-[15px] font-medium mt-2 sm:mt-0 flex items-center gap-1">
                            {t('home.viewAll')} <span className="text-xs">→</span>
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-bliss-cream rounded-2xl aspect-[3/4]" />
                                    <div className="mt-4 space-y-2">
                                        <div className="h-4 bg-bliss-cream rounded w-3/4" />
                                        <div className="h-3 bg-bliss-cream rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                            {featured.map((product) => <ProductCard key={product._id} product={product} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* Luxurious Editorial Banner */}
            <section className="relative py-28 overflow-hidden bg-black text-white">
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('/uploads/silk_touch_vibrator.png')` }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-xl space-y-6">
                        <span className="text-xs uppercase tracking-widest text-bliss-pink/80 font-medium">The Bliss Standard</span>
                        <h2 className="font-luxury text-4xl lg:text-6xl text-white leading-tight">Designed for Pleasure, Built for Wellness</h2>
                        <p className="text-white/70 text-sm md:text-base font-light leading-relaxed">
                            Every item is sourced directly from certified developers and tested for body safety, whisper-quiet performance, and premium comfort. Experience shipping discretion that respects your personal privacy.
                        </p>
                        <div className="pt-4">
                            <Link to="/shop" className="inline-block px-10 py-4 bg-white text-bliss-dark font-medium rounded-full hover:bg-bliss-pink/90 transition text-sm">
                                Shop Discreetly Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
