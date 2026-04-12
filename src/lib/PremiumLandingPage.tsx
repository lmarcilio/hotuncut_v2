import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  Sparkles, Zap, Video, TrendingUp, Users, Clock, CheckCircle2, ArrowRight, 
  Star, Shield, Flame, Lock, Rocket, Award, AlertCircle, ChevronDown,
  Play, Crown, Gem, Target, Eye, Gift, Infinity, BadgeCheck, 
  ArrowDown, MousePointer, Layers, Wand2, MessageCircle, Heart, X
} from 'lucide-react';

/* ─────────────────── Animated Counter ─────────────────── */
const AnimatedCounter = ({ target, duration = 2000, suffix = '', prefix = '' }: { target: number; duration?: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return <span ref={ref}>{prefix}{count.toLocaleString('pt-BR')}{suffix}</span>;
};

/* ─────────────────── Floating particles ─────────────────── */
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`, 
            width: p.size, 
            height: p.size,
            background: `radial-gradient(circle, rgba(255,${120 + Math.random() * 80},0,0.6), transparent)`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────── Glowing Orb ─────────────────── */
const GlowingOrb = ({ className = '', color = 'orange' }: { className?: string; color?: string }) => {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500/20',
    pink: 'bg-pink-500/15',
    amber: 'bg-amber-400/15',
    purple: 'bg-purple-500/10',
    blue: 'bg-blue-500/10',
  };
  return (
    <motion.div 
      className={`absolute rounded-full blur-[150px] pointer-events-none ${colorMap[color] || colorMap.orange} ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

/* ─────────────────── Countdown Timer ─────────────────── */
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });
  
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('hotuncut_countdown_end') : null;
    let endTime: number;
    
    if (saved) {
      endTime = parseInt(saved);
    } else {
      endTime = Date.now() + 48 * 60 * 60 * 1000;
      if (typeof window !== 'undefined') localStorage.setItem('hotuncut_countdown_end', endTime.toString());
    }
    
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };
    
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-orange-500/20 to-transparent pointer-events-none" />
      </div>
      <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <TimeBlock value={timeLeft.hours} label="Horas" />
      <span className="text-2xl md:text-3xl font-bold text-orange-500/50 mt-[-20px]">:</span>
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <span className="text-2xl md:text-3xl font-bold text-orange-500/50 mt-[-20px]">:</span>
      <TimeBlock value={timeLeft.seconds} label="Seg" />
    </div>
  );
};

/* ─────────────────── Magnetic Button ─────────────────── */
const MagneticButton = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};

/* ─────────────────── Section Header ─────────────────── */
const SectionHeader = ({ badge, title, highlight, description }: { badge: string; title: string; highlight: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.7 }}
    className="text-center mb-16 md:mb-20"
  >
    <span className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-bold text-orange-400 uppercase tracking-[0.2em] bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full border border-orange-500/20 backdrop-blur-sm">
      <Sparkles className="w-3.5 h-3.5" />
      {badge}
    </span>
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.1]">
      {title}{' '}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-pink-500">{highlight}</span>
    </h2>
    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
      {description}
    </p>
  </motion.div>
);

/* ─────────────────── Main Component ─────────────────── */
const PremiumLandingPage = ({ 
  onBuy, 
  onLoginClick,
  onAdminClick,
  branding 
}: { 
  onBuy: () => void, 
  onLoginClick?: () => void,
  onAdminClick?: () => void,
  branding: any 
}) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerHeight = Math.min(420, Math.max(80, Math.round((branding?.logo_width || 150) * 0.9)));
  const landingVideoUrl = branding?.landing_images?.generated_video_url || '';
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';
    const trimmedUrl = url.trim();
    if (trimmedUrl.includes('youtube.com/embed/')) return trimmedUrl;
    const youtubeMatch = trimmedUrl.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?/]+)/);
    if (youtubeMatch?.[1]) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    const vimeoMatch = trimmedUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch?.[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return '';
  };

  const isDirectVideoUrl = (url: string) => {
    if (!url) return false;
    const cleaned = url.split('?')[0].toLowerCase();
    return ['.mp4', '.webm', '.ogg', '.mov', '.m4v'].some(ext => cleaned.endsWith(ext));
  };

  const landingVideoEmbedUrl = getVideoEmbedUrl(landingVideoUrl);

  // Scroll detection for sticky nav
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 50);
      
      const isGoingDown = currentY > lastY;
      if (currentY < 40) {
        setIsNavbarVisible(true);
      } else if (isGoingDown && !mobileMenuOpen) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      lastY = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    console.log('PremiumLandingPage Branding:', branding);
    console.log('Rateio URLs:', {
      monthly: branding?.rateio_monthly_url,
      quarterly: branding?.rateio_quarterly_url,
      annual: branding?.rateio_annual_url
    });
  }, [branding]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const testimonials = [
    {
      name: "Marina Silva",
      result: "+R$ 12.500/mês",
      testimonial: "Comecei sem saber nada. Em 2 meses já estava faturando consistente. Os prompts são incríveis e a comunidade te puxa pra cima!",
      avatar: "👩‍💼",
      role: "Criadora de Conteúdo",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      result: "+R$ 18.300/mês",
      testimonial: "A comunidade é incrível. Aprendo algo novo todo dia. Melhor investimento que fiz na minha carreira digital.",
      avatar: "👨‍💼",
      role: "Empreendedor Digital",
      rating: 5
    },
    {
      name: "Ana Costa",
      result: "+R$ 8.900/mês",
      testimonial: "Dei início ao meu negócio completamente do zero. Agora tenho múltiplas fontes de renda graças aos prompts.",
      avatar: "👱‍♀️",
      role: "Freelancer",
      rating: 5
    }
  ];

  const navItems = [
    { label: 'Recursos', id: 'features' },
    { label: 'Galeria', id: 'gallery' },
    { label: 'Depoimentos', id: 'testimonials' },
    { label: 'Preços', id: 'pricing' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 selection:text-white overflow-hidden">
      
      {/* ═══════════════ STICKY NAVIGATION ═══════════════ */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {branding?.logo_url ? (
                <img 
                  src={branding.logo_url}
                  alt="Logo"
                  style={{ width: `${Math.min(branding.logo_width || 120, 140)}px` }}
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-2 rounded-xl shadow-lg shadow-orange-500/30">
                    <Flame className="text-white w-5 h-5" />
                  </div>
                  <span className="text-xl font-black tracking-tighter text-white">
                    HOT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">UNCUT</span>
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium rounded-lg hover:bg-white/[0.04]"
                >
                  {item.label}
                </button>
              ))}
              {onLoginClick && (
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors font-medium rounded-lg hover:bg-white/[0.04]"
                >
                  Login
                </button>
              )}
              <button
                onClick={onBuy}
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-black font-bold text-sm rounded-xl hover:brightness-110 transition-all shadow-lg shadow-orange-500/25"
              >
                Começar Agora
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/[0.06] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all font-medium"
                  >
                    {item.label}
                  </button>
                ))}
                {onLoginClick && (
                  <button
                    onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-3 text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all font-medium"
                  >
                    Login
                  </button>
                )}
                <button
                  onClick={() => { onBuy(); setMobileMenuOpen(false); }}
                  className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-black font-bold rounded-xl"
                >
                  🔥 Começar Agora
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20 lg:pb-32">
        {/* Layered Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(251,146,60,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(236,72,153,0.12),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(250,204,21,0.08),transparent_50%)]" />
        </div>
        
        <GlowingOrb className="w-[700px] h-[500px] top-0 left-1/2 -translate-x-1/2" color="orange" />
        <GlowingOrb className="w-[400px] h-[400px] top-40 right-0" color="pink" />
        <GlowingOrb className="w-[300px] h-[300px] bottom-20 left-0" color="purple" />
        <FloatingParticles />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Animated gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 mb-8 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-pink-500/10 rounded-full border border-orange-500/20 backdrop-blur-xl"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
              </span>
              <span className="text-orange-300/90 text-sm font-semibold tracking-wider uppercase">🔥 Vagas Limitadas — Oferta Especial</span>
            </motion.div>

            {/* Hero Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] mb-6 leading-[1.05]"
            >
              <span className="block text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">Sistemas completos para</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-pink-500 hero-shimmer">
                ajudar a sua criatividade
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 font-light leading-relaxed max-w-3xl mx-auto"
            >
              <span className="font-bold text-white">Prompts prontos</span> &nbsp;•&nbsp; <span className="font-bold text-white">Ferramentas</span> &nbsp;•&nbsp; <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Bônus</span>
            </motion.p>



            {/* Main CTA */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col items-center gap-6 mb-16"
            >
              <MagneticButton
                onClick={onBuy}
                className="relative px-12 py-5 bg-gradient-to-r from-orange-500 via-amber-400 to-pink-500 text-black font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-[0_25px_80px_rgba(244,114,35,0.35)] hover:shadow-[0_35px_120px_rgba(244,114,35,0.5)] overflow-hidden cta-pulse"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Rocket className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Liberar Acesso Agora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </MagneticButton>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                {[
                  { icon: Shield, text: 'Garantia 7 dias', color: 'text-emerald-500' },
                  { icon: Lock, text: 'Pagamento seguro', color: 'text-emerald-500' },
                  { icon: Zap, text: 'Acesso imediato', color: 'text-emerald-500' },
                ].map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    {item.text}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Hero Image */}
            {branding?.landing_images?.hero && (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="mt-4 relative max-w-5xl mx-auto group"
              >
                <div className="absolute -inset-6 bg-gradient-to-r from-orange-500/15 via-pink-500/10 to-amber-500/15 blur-3xl rounded-3xl pointer-events-none opacity-60 group-hover:opacity-80 transition-all duration-700" />
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-500/15 group-hover:shadow-orange-500/25 transition-all duration-700">
                  <img 
                    src={branding.landing_images.hero} 
                    alt="Plataforma Preview" 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-3xl border border-orange-500/10 group-hover:border-orange-500/30 transition-colors duration-700" />
                  {/* Play hint overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-20 h-20 rounded-full bg-orange-500/20 backdrop-blur-sm flex items-center justify-center border border-orange-500/30">
                      <Eye className="w-8 h-8 text-orange-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Scroll indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mt-16 flex flex-col items-center gap-2"
            >
              <span className="text-xs text-gray-600 uppercase tracking-widest">Saiba mais</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown className="w-5 h-5 text-gray-600" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF BAR ═══════════════ */}
      <section className="py-5 bg-white/[0.02] border-y border-white/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-pink-500/5" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-14 text-gray-500">
            {[
              { emoji: '🔒', text: 'SSL Seguro' },
              { emoji: '⚡', text: 'Pagamento Instantâneo' },
              { emoji: '🛡️', text: 'Proteção de Dados' },
              { emoji: '💎', text: 'Conteúdo Exclusivo' },
              { emoji: '🔄', text: 'Atualizações Semanais' }
            ].map((item, idx) => (
              <motion.span 
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="text-sm font-medium whitespace-nowrap flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <span className="text-base">{item.emoji}</span>
                {item.text}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-24 lg:py-36 relative overflow-hidden" id="how-it-works">
        <GlowingOrb className="w-[400px] h-[400px] top-1/3 left-10" color="purple" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            badge="Como Funciona"
            title="3 Passos para"
            highlight="Começar a Faturar"
            description="Processo simples e direto. Sem enrolação, sem complicação."
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                icon: Lock,
                title: 'Acesse a Plataforma',
                desc: 'Faça seu cadastro e libere o acesso imediato a todos os prompts e recursos exclusivos da comunidade',
                gradient: 'from-orange-500 to-amber-500',
              },
              {
                step: '02',
                icon: Wand2,
                title: 'Use os Prompts',
                desc: 'Copie e cole os prompts prontos nas ferramentas de IA. Resultados profissionais em segundos',
                gradient: 'from-pink-500 to-rose-500',
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Monetize',
                desc: 'Venda o conteúdo gerado nas plataformas certas usando nossas estratégias comprovadas de conversão',
                gradient: 'from-violet-500 to-purple-500',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative group"
              >
                {/* Connector line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
                
                <div className="relative p-8 bg-white/[0.02] border border-white/[0.06] rounded-3xl hover:border-orange-500/30 transition-all duration-500 group-hover:bg-white/[0.04] group-hover:shadow-[0_20px_60px_rgba(244,114,35,0.1)]">
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center text-xs font-black text-orange-500">
                    {item.step}
                  </div>
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-3 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <item.icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-[15px]">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PAIN POINTS & SOLUTIONS ═══════════════ */}
      <section className="py-24 lg:py-36 relative overflow-hidden">
        <GlowingOrb className="w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="orange" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            badge="O Problema"
            title="O Problema de"
            highlight="Todo Criador"
            description="Você gasta horas tentando criar conteúdo que venda, mas os resultados não vêm..."
          />

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Pain Points */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-red-500/[0.04] to-transparent border border-red-500/10 hover:border-red-500/20 transition-all duration-500"
            >
              <h3 className="text-xl font-bold text-red-400 flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-6 h-6" />
                </div>
                Sem a HotUncut
              </h3>
              <div className="space-y-5">
                {[
                  "Não sabe por onde começar",
                  "Prompts genéricos que não convertem",
                  "Perde horas pesquisando técnicas",
                  "Concorrência acirrada sem diferencial",
                  "Sem direcionamento claro de monetização"
                ].map((problem, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="flex items-center gap-4 text-gray-400"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/10">
                      <X className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <span className="text-[15px]">{problem}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-emerald-500/[0.04] to-transparent border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-500"
            >
              <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                Com a HotUncut
              </h3>
              <div className="space-y-5">
                {[
                  "Estratégia pronta e testada para usar",
                  "Prompts otimizados para conversão máxima",
                  "Aulas passo a passo + comunidade exclusiva",
                  "Vantagem competitiva comprovada",
                  "Suporte 24/7 dedicado e personalizado"
                ].map((solution, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="flex items-center gap-4 text-gray-300"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-[15px] font-medium">{solution}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES SHOWCASE ═══════════════ */}
      <section className="py-24 lg:py-36 relative" id="features">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            badge="Recursos"
            title="O Que Você"
            highlight="Recebe"
            description="Tudo que você precisa para começar a faturar HOJE"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Sparkles,
                title: "Grande Variedade de Prompts",
                desc: "Biblioteca completa com categorias diversas de prompts testados e otimizados para máxima conversão",
                gradient: "from-orange-500 to-amber-500",
              },
              {
                icon: Video,
                title: "Aulas Práticas",
                desc: "Treinamento em vídeo com estratégias reais usadas por top creators do mercado",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: Target,
                title: "Links das Ferramentas",
                desc: "Acesso direto às melhores ferramentas e plataformas de IA para potencializar seus resultados",
                gradient: "from-purple-500 to-indigo-500",
              },
              {
                icon: TrendingUp,
                title: "Estratégias de Conversão",
                desc: "Métodos comprovados para transformar conteúdo em lucro real e consistente",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Rocket,
                title: "Templates Prontos",
                desc: "Estruturas testadas que geram conversão automática sem esforço",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: Crown,
                title: "Comunidade VIP",
                desc: "Networking com criadores de sucesso e suporte prioritário direto",
                gradient: "from-yellow-500 to-amber-500",
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-orange-500/30 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(244,114,35,0.1)] hover:bg-white/[0.04]"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-2xl`} />
                
                <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                
                <h3 className="text-lg font-bold mb-3 text-white group-hover:text-orange-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  {feature.desc}
                </p>

                {/* Arrow hint */}
                <div className="mt-4 flex items-center gap-1 text-sm text-orange-500/0 group-hover:text-orange-500/70 transition-all duration-500">
                  <span className="font-medium">Saber mais</span>
                  <ArrowRight className="w-3.5 h-3.5 -translate-x-2 group-hover:translate-x-0 transition-transform duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ GALLERY / SHOWCASE ═══════════════ */}
      <section className="py-24 lg:py-36 relative overflow-hidden" id="gallery">
        <GlowingOrb className="w-[500px] h-[400px] top-20 left-0" color="pink" />
        <GlowingOrb className="w-[400px] h-[300px] bottom-20 right-0" color="orange" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            badge="Galeria"
            title="Imagens Geradas Com Nossos"
            highlight="Prompts"
            description="Veja a qualidade e criatividade dos conteúdos gerados por nossos criadores"
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { img: branding?.landing_images?.gallery1 || "https://images.unsplash.com/photo-1618983479302-1461b3b67f1e?w=600&h=400&fit=crop", title: branding?.landing_images?.gallery1_text || "Design Criativo" },
              { img: branding?.landing_images?.gallery2 || "https://images.unsplash.com/photo-1611339555312-e607c04352fa?w=600&h=400&fit=crop", title: branding?.landing_images?.gallery2_text || "Arte Digital" },
              { img: branding?.landing_images?.gallery3 || "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop", title: branding?.landing_images?.gallery3_text || "Conteúdo Visual" },
              { img: branding?.landing_images?.gallery4 || "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop", title: branding?.landing_images?.gallery4_text || "Produção Premium" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative"
              >
                <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.06] shadow-xl group-hover:shadow-orange-500/20 transition-all duration-700`}>
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-[10px] text-orange-400 uppercase tracking-widest font-bold">Gerado por IA</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Video Section */}
          {(landingVideoEmbedUrl || isDirectVideoUrl(landingVideoUrl)) && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Play className="w-5 h-5 text-orange-400" />
                  </div>
                  Vídeo de Exemplo
                </h3>
              </div>
              {landingVideoEmbedUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-orange-500/10">
                  <iframe
                    src={landingVideoEmbedUrl}
                    title="Video de exemplo dos prompts"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-orange-500/10 bg-black">
                  <video
                    src={landingVideoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full max-h-[70vh]"
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════ DASHBOARD SHOWCASE ═══════════════ */}
      {branding?.landing_images?.dashboard && (
        <section className="py-24 lg:py-36 relative overflow-hidden">
          <GlowingOrb className="w-[600px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="orange" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeader
              badge="Plataforma"
              title="Seu Painel de"
              highlight="Controle"
              description="Interface intuitiva e poderosa para gerenciar seus prompts e acompanhar seus resultados"
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-6 bg-gradient-to-r from-orange-500/15 via-pink-500/8 to-amber-500/15 blur-3xl rounded-3xl pointer-events-none opacity-40 group-hover:opacity-60 transition-all duration-700" />
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-500/15 group-hover:shadow-orange-500/25 transition-all duration-700">
                <img 
                  src={branding.landing_images.dashboard} 
                  alt="Dashboard da Plataforma" 
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-24 lg:py-36 relative overflow-hidden" id="testimonials">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-transparent" />
        <GlowingOrb className="w-[400px] h-[300px] bottom-0 right-10" color="amber" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            badge="Depoimentos"
            title="Clientes Conquistando"
            highlight="Resultados"
            description="Veja o que os criadores estão ganhando com a HotUncut"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative p-8 rounded-2xl border transition-all duration-500 ${
                  activeTestimonial === idx 
                    ? 'bg-gradient-to-br from-orange-500/10 to-pink-500/5 border-orange-500/30 shadow-[0_20px_60px_rgba(244,114,35,0.15)]' 
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-orange-500/20'
                }`}
                onMouseEnter={() => setActiveTestimonial(idx)}
              >
                {/* Quote mark */}
                <div className="absolute top-6 right-6 text-6xl text-orange-500/10 font-serif leading-none select-none">"</div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-500/10 flex items-center justify-center border border-orange-500/10">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-gray-400 leading-relaxed mb-6 text-[15px]">
                  "{testimonial.testimonial}"
                </p>

                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 font-black text-2xl">
                    {testimonial.result}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">Resultado mensal</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonial indicator */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  activeTestimonial === idx ? 'w-8 bg-orange-500' : 'w-1.5 bg-gray-700 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ URGENCY SECTION WITH COUNTDOWN ═══════════════ */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/[0.06] via-pink-600/[0.06] to-orange-600/[0.06]" />
        <div className="absolute inset-0 border-y border-orange-500/10" />
        <GlowingOrb className="w-[400px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="orange" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-red-500/10 rounded-full border border-red-500/20">
              <Clock className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Oferta Por Tempo Limitado</span>
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black mb-4">
              Promoção Acaba Em
            </h3>
            <p className="text-gray-400 mb-10 text-lg">
              Apenas <span className="font-bold text-orange-400">3 vagas</span> restantes com <span className="font-bold text-white">50% de desconto</span> + bônus exclusivos
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center mb-12">
              <CountdownTimer />
            </div>
            
            <MagneticButton
              onClick={onBuy}
              className="relative px-12 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-black font-bold text-lg rounded-2xl transition-all shadow-[0_20px_60px_rgba(244,114,35,0.35)] hover:shadow-[0_30px_80px_rgba(244,114,35,0.5)] overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-3">
                <Flame className="w-5 h-5" />
                PEGAR OFERTA AGORA
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ RATEIO PRICING ═══════════════ */}
      <section className="py-24 lg:py-36 relative overflow-hidden" id="pricing">
        <GlowingOrb className="w-[500px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="orange" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Rateio Image */}
          {branding?.landing_images?.rateio_image && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20 relative group max-w-5xl mx-auto"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/15 to-pink-500/15 blur-3xl rounded-3xl pointer-events-none opacity-40 group-hover:opacity-60 transition-all" />
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src={branding.landing_images.rateio_image} 
                  alt="Rateio das IAs" 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>
          )}

          <SectionHeader
            badge="Parceiro HotUncut"
            title="Rateio das"
            highlight="IAs"
            description="Ganhe renda passiva compartilhando os lucros das IAs. Escolha o plano ideal"
          />

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Mensal",
                price: "R$ 37",
                period: "/mês",
                features: [
                  "Acesso ao programa Rateio",
                  "Receba comissões mensais",
                  "Dashboard de monitoramento",
                  "Suporte por email",
                  "Relatórios básicos"
                ],
                highlight: false,
                urlKey: "rateio_monthly_url",
                icon: Zap
              },
              {
                name: "Trimestral",
                price: "R$ 97",
                period: "/3 meses",
                originalPrice: "R$ 111",
                features: [
                  "Tudo do plano Mensal",
                  "10% economia no total",
                  "Prioridade no suporte",
                  "Relatórios avançados",
                  "Acesso a webinars exclusivos"
                ],
                highlight: true,
                urlKey: "rateio_quarterly_url",
                icon: Crown
              },
              {
                name: "Anual",
                price: "R$ 290",
                period: "/ano",
                originalPrice: "R$ 444",
                features: [
                  "Tudo do plano Trimestral",
                  "34% economia no total",
                  "Suporte prioritário 24/7",
                  "Consultoria mensal 1:1",
                  "Bônus exclusivos trimestrais"
                ],
                highlight: false,
                urlKey: "rateio_annual_url",
                icon: Gem
              }
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: plan.highlight ? -8 : -4 }}
                className={`relative p-8 rounded-3xl transition-all duration-500 ${
                  plan.highlight
                    ? "bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-transparent border-2 border-orange-500/40 shadow-[0_25px_80px_rgba(244,114,35,0.2)]"
                    : "bg-white/[0.02] border border-white/[0.06] hover:border-orange-500/30 hover:shadow-[0_20px_60px_rgba(244,114,35,0.1)]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-5 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-current" />
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    plan.highlight ? 'bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-500/30' : 'bg-white/[0.05] border border-white/[0.08]'
                  }`}>
                    <plan.icon className={`w-5 h-5 ${plan.highlight ? 'text-white' : 'text-orange-500'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>
                
                <div className="mb-8">
                  {'originalPrice' in plan && plan.originalPrice && (
                    <span className="text-sm text-gray-600 line-through mr-2">{plan.originalPrice}</span>
                  )}
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 ml-2 text-sm">{plan.period}</span>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3 text-gray-400 text-[15px]">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-orange-500' : 'text-gray-600'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => {
                    const url = branding?.[plan.urlKey];
                    console.log('Plan URL Key:', plan.urlKey, 'URL:', url, 'Branding:', branding);
                    if (url && url.trim()) {
                      window.open(url, '_blank');
                    } else {
                      alert('URL não configurada para este plano. Entre em contato com o administrador.');
                    }
                  }}
                  className={`w-full py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group overflow-hidden relative ${
                    plan.highlight
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-black hover:brightness-110 shadow-[0_15px_40px_rgba(244,114,35,0.3)]"
                      : "bg-white/[0.04] text-orange-400 border border-orange-500/30 hover:bg-orange-500/10"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  )}
                  <Rocket className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Começar Agora</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Money back guarantee */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/5 rounded-full border border-emerald-500/20">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-emerald-400 font-semibold">Garantia de 7 dias — Seu dinheiro de volta, sem perguntas</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-24 lg:py-36 relative" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="FAQ"
            title="Dúvidas"
            highlight="Frequentes"
            description="Tudo que você precisa saber antes de começar"
          />

          <div className="space-y-3">
            {[
              {
                q: "Como começo a faturar imediatamente?",
                a: "Você recebe acesso imediato após o pagamento. Os prompts já estão prontos para usar. É só copiar, colar na ferramenta de IA e começar a gerar conteúdo que vende!"
              },
              {
                q: "E se não gostar? Há garantia?",
                a: "100% garantia! Se não ficar satisfeito em 7 dias, devolvemos seu dinheiro integralmente. Sem perguntas, sem burocracia."
              },
              {
                q: "Preciso de conhecimento técnico?",
                a: "Não! Os prompts funcionam com qualquer ferramenta de IA. Temos aulas passo a passo que explicam tudo em detalhes, do zero ao avançado."
              },
              {
                q: "Quanto tempo leva para ver resultados?",
                a: "Muitos membros ganham na primeira semana! Tudo depende do seu esforço e dedicação. A estrutura já está pronta e comprovada — você só precisa executar."
              },
              {
                q: "O conteúdo é atualizado com frequência?",
                a: "Sim! Novos prompts e estratégias são adicionados toda semana. Você sempre terá acesso ao que há de mais recente e eficaz no mercado."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                  expandedFAQ === idx 
                    ? 'bg-white/[0.03] border-orange-500/20 shadow-[0_8px_32px_rgba(244,114,35,0.08)]' 
                    : 'bg-white/[0.01] border-white/[0.04] hover:border-white/[0.1]'
                }`}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between transition-all group"
                >
                  <span className={`text-left text-[15px] font-semibold pr-4 transition-colors ${
                    expandedFAQ === idx ? 'text-orange-400' : 'text-white group-hover:text-orange-400'
                  }`}>
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFAQ === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors ${expandedFAQ === idx ? 'text-orange-500' : 'text-gray-600'}`} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedFAQ === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-400 text-[15px] leading-relaxed border-t border-white/[0.04] pt-4">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="py-12 border-t border-white/[0.04] bg-black/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              {branding?.logo_url ? (
                <img 
                  src={branding.logo_url}
                  alt="Logo"
                  style={{ width: `${Math.min(branding.logo_width || 100, 100)}px` }}
                  className="object-contain opacity-60"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center gap-2 opacity-60">
                  <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-1.5 rounded-lg">
                    <Flame className="text-white w-4 h-4" />
                  </div>
                  <span className="text-lg font-black tracking-tighter text-white">
                    HOT<span className="text-orange-500">UNCUT</span>
                  </span>
                </div>
              )}
            </div>

            {/* Footer Links */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-400 transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Suporte</a>
            </div>

            {/* Copyright & Admin Log */}
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-700">
                © {new Date().getFullYear()} HotUncut. Todos os direitos reservados.
              </p>
              {onAdminClick && (
                <button 
                  onClick={onAdminClick}
                  className="text-zinc-900 hover:text-orange-500/50 transition-colors p-1"
                  title="Painel Administrativo"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .hero-shimmer {
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
        
        .cta-pulse {
          animation: ctaPulse 3s ease-in-out infinite;
        }
        
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 25px 80px rgba(244,114,35,0.35); }
          50% { box-shadow: 0 25px 100px rgba(244,114,35,0.5); }
        }
      `}</style>
    </div>
  );
};

export default PremiumLandingPage;
