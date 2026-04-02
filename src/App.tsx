/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import UnifiedPromptManager from './lib/UnifiedPromptManager';
import PremiumLandingPage from './lib/PremiumLandingPage';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { 
  Flame, 
  Zap, 
  Image as ImageIcon, 
  Video, 
  BookOpen, 
  Link as LinkIcon, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  LogOut,
  User,
  Users,
  Plus,
  Trash2,
  Edit2,
  Star,
  AlertCircle,
  Copy,
  Clock,
  Play,
  Settings,
  Camera,
  UserCircle,
  Key,
  Save,
  ChevronRight,
  LayoutDashboard,
  Upload,
  Loader2,
  Image,
  Eye,
  Info,
  AlertTriangle,
  Activity,
  ExternalLink,
  Database,
  FileText,
  Home,
  FolderTree,
  DollarSign,
  Rocket
} from 'lucide-react';

// --- Components ---

const Logo = ({ className = "", branding }: { className?: string, branding: any }) => {
  const [imgError, setImgError] = React.useState(false);

  // Reset error when URL changes
  React.useEffect(() => {
    setImgError(false);
  }, [branding.logo_url]);

  if (branding.logo_url && !imgError) {
    return (
      <img 
        src={branding.logo_url} 
        alt="Logo" 
        style={{ width: `${branding.logo_width}px` }}
        className={`object-contain ${className}`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-orange-500 p-1.5 rounded-lg">
        <Flame className="text-black w-5 h-5" />
      </div>
      <span className="text-xl font-bold tracking-tighter text-white">
        HOT<span className="text-orange-500">UNCUT</span>
      </span>
    </div>
  );
};

const MemberArea = ({ 
  user, 
  profile, 
  branding,
  onLogout, 
  activeTab, 
  setActiveTab,
  prompts,
  categories,
  subcategories,
  selectedCategory,
  setSelectedCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  toggleFavorite,
  modules,
  lessons,
  selectedLesson,
  setSelectedLesson,
  tools,
  onUpdateProfile,
  onChangePassword
}: { 
  user: any, 
  profile: any, 
  onLogout: () => void, 
  activeTab: string, 
  setActiveTab: (tab: any) => void,
  prompts: any[],
  categories: any[],
  subcategories: any[],
  selectedCategory: string,
  setSelectedCategory: (cat: string) => void,
  showFavoritesOnly: boolean,
  setShowFavoritesOnly: (show: boolean) => void,
  toggleFavorite: (id: string, current: boolean) => void,
  modules: any[],
  lessons: any[],
  selectedLesson: any,
  setSelectedLesson: (lesson: any) => void,
  tools: any[],
  onUpdateProfile: (nick: string, avatar: string | null) => void,
  onChangePassword: (pass: string) => void,
  branding: any
}) => {
  const [newNickname, setNewNickname] = useState(profile.nickname || '');
  const [newAvatar, setNewAvatar] = useState(profile.avatar_url || '');
  const [newPassword, setNewPassword] = useState('');
  const [isAdultMode, setIsAdultMode] = useState(false);
  const [showAdultModal, setShowAdultModal] = useState(false);

  const [viewedUpdates, setViewedUpdates] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`viewed_updates_${user.id}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory('all');
  }, [selectedCategory]);

  useEffect(() => {
    if (activeTab === 'lessons') {
      const hasUnviewedUpdates = lessons.some(l => l.updated_at && (!viewedUpdates[l.id] || new Date(l.updated_at) > new Date(viewedUpdates[l.id])));
      if (hasUnviewedUpdates) {
        setShowUpdateToast(true);
        const timer = setTimeout(() => setShowUpdateToast(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [lessons, activeTab]);

  const handleLessonSelect = (lesson: any) => {
    setSelectedLesson(lesson);
    if (lesson.updated_at) {
      const newViewed = { ...viewedUpdates, [lesson.id]: lesson.updated_at };
      setViewedUpdates(newViewed);
      localStorage.setItem(`viewed_updates_${user.id}`, JSON.stringify(newViewed));
    }
  };

  const menuItems = [
    { id: 'home', label: 'Início', icon: <Home className="w-5 h-5" /> },
    { id: 'prompts', label: 'Prompts', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'lessons', label: 'Aulas', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'tools', label: 'Ferramentas', icon: <LinkIcon className="w-5 h-5" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Update Toast */}
      <AnimatePresence>
        {showUpdateToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-orange-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(255,79,0,0.5)] flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Novas aulas atualizadas!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedPrompt(null)}
                className="absolute top-6 right-6 p-2 bg-zinc-800 text-gray-400 rounded-full hover:text-white hover:bg-zinc-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 pr-12">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">{selectedPrompt.categories?.name}</span>
                  <span className="text-gray-600">&bull;</span>
                  <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">{selectedPrompt.subcategories?.name}</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedPrompt.title || selectedPrompt.subcategories?.name}</h2>
                {selectedPrompt.description && (
                  <p className="text-gray-400 text-sm">{selectedPrompt.description}</p>
                )}
              </div>

              {selectedPrompt.image_url && (
                <div className="w-full h-64 mb-8 rounded-3xl overflow-hidden border border-zinc-800 relative">
                  <img 
                    src={selectedPrompt.image_url} 
                    alt={selectedPrompt.title || "Prompt image"} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="relative group mb-8">
                <div className="absolute -top-3 left-4 px-2 bg-zinc-900 text-xs font-bold text-gray-500 uppercase tracking-widest">Prompt Completo</div>
                <code className="text-sm text-gray-300 block bg-black p-6 rounded-3xl border border-zinc-800 font-mono leading-relaxed min-h-[150px] whitespace-pre-wrap">
                  {selectedPrompt.content}
                </code>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPrompt.content);
                    alert('Prompt copiado!');
                  }}
                  className="flex-1 py-4 bg-orange-500 text-black font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" /> Copiar Prompt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Adult Content Modal */}
      <AnimatePresence>
        {showAdultModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full bg-zinc-900 border border-red-500/30 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Aviso de Conteúdo</h2>
              <p className="text-gray-400 mb-8">
                Esta seção contém material destinado apenas para maiores de 18 anos. 
                Você confirma que tem 18 anos ou mais e deseja prosseguir?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowAdultModal(false)}
                  className="flex-1 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all"
                >
                  Não, Voltar
                </button>
                <button 
                  onClick={() => {
                    setIsAdultMode(true);
                    setSelectedCategory('all');
                    setShowAdultModal(false);
                  }}
                  className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all"
                >
                  Sim, Sou Maior
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-zinc-950 border-r border-zinc-900 flex-col fixed h-full z-40">
        <div className="p-8">
          <Logo branding={branding} />
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-900">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserCircle className="w-full h-full text-gray-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{profile.nickname || user.email.split('@')[0]}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-0">
        {/* Banner / Header */}
        <header className="relative h-64 bg-zinc-900 overflow-hidden border-b border-zinc-800">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
          <img 
            src={branding?.landing_images?.hero || "https://picsum.photos/seed/vibrant/1920/1080?blur=4"} 
            alt="Banner" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 p-12 z-20">
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
              {activeTab === 'home' && 'Bem-vindo ao HotUncut'}
              {activeTab === 'prompts' && 'Biblioteca de Prompts'}
              {activeTab === 'lessons' && 'Treinamento Exclusivo'}
              {activeTab === 'tools' && 'Ferramentas de Elite'}
              {activeTab === 'settings' && 'Minha Conta'}
            </h1>
            <p className="text-gray-400 font-medium">
              {activeTab === 'home' && 'Novidades e anúncios importantes.'}
              {activeTab === 'prompts' && 'Os melhores comandos para gerar conteúdo sem limites.'}
              {activeTab === 'lessons' && 'Aprenda o passo a passo da engenharia de prompts.'}
              {activeTab === 'tools' && 'Acesse as plataformas mais poderosas do mercado.'}
              {activeTab === 'settings' && 'Gerencie seus dados e preferências de acesso.'}
            </p>
          </div>
        </header>

        <div className="p-12">
          {activeTab === 'home' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-zinc-900 rounded-[3rem] border border-orange-500/30 overflow-hidden shadow-[0_0_50px_rgba(255,79,0,0.2)]">
                {branding?.landing_images?.home_announcement_image && (
                  <div className="w-full h-64 md:h-96 relative">
                    <img 
                      src={branding.landing_images.home_announcement_image} 
                      alt="Anúncio" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  </div>
                )}
                <div className="p-8 md:p-12 relative z-10 -mt-20">
                  <div className="bg-orange-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full inline-flex items-center gap-2 mb-6">
                    <Sparkles className="w-4 h-4" /> Novidade
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                    {branding?.landing_images?.home_announcement_title || 'Em breve teremos uma ferramenta de rateio das IAs.'}
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                    {branding?.landing_images?.home_announcement_text || 'Fique ligado! Estamos preparando algo incrível para você.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prompts' && (
            <div className="space-y-12">
              {/* Filters */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${selectedCategory === 'all' ? 'bg-orange-500 text-black' : 'bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800'}`}
                  >
                    Todos
                  </button>
                  {categories
                    .filter(cat => {
                      // Only show categories that have prompts matching the current adult mode
                      return prompts.some(p => p.category_id === cat.id && !!p.is_special_18 === isAdultMode);
                    })
                    .map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-6 py-2 rounded-xl font-bold transition-all ${selectedCategory === cat.id ? 'bg-orange-500 text-black' : 'bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                  <button 
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${showFavoritesOnly ? 'bg-yellow-500 text-black' : 'bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800'}`}
                  >
                    <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} /> Favoritos
                  </button>
                  
                  {/* Adult Mode Toggle */}
                  {!isAdultMode ? (
                    <button 
                      onClick={() => setShowAdultModal(true)}
                      className="px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 ml-auto"
                    >
                      <AlertCircle className="w-4 h-4" /> Conteúdo +18
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsAdultMode(false);
                        setSelectedCategory('all');
                      }}
                      className="px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 ml-auto"
                    >
                      Voltar para Conteúdo Normal
                    </button>
                  )}
                </div>

                {/* Subcategories Filter Row */}
                {selectedCategory !== 'all' && (
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800">
                    <button 
                      onClick={() => setSelectedSubcategory('all')}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedSubcategory === 'all' ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-gray-500 hover:text-gray-300 border border-zinc-800'}`}
                    >
                      Todas as Subcategorias
                    </button>
                    {subcategories
                      .filter(sub => sub.category_id === selectedCategory)
                      .filter(sub => prompts.some(p => p.subcategory_id === sub.id && !!p.is_special_18 === isAdultMode))
                      .map(sub => (
                      <button 
                        key={sub.id}
                        onClick={() => setSelectedSubcategory(sub.id)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedSubcategory === sub.id ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-gray-500 hover:text-gray-300 border border-zinc-800'}`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {prompts
                  .filter(p => !!p.is_special_18 === isAdultMode)
                  .filter(p => selectedCategory === 'all' || p.category_id === selectedCategory)
                  .filter(p => selectedSubcategory === 'all' || p.subcategory_id === selectedSubcategory)
                  .filter(p => !showFavoritesOnly || p.is_favorite)
                  .map(prompt => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={prompt.id} 
                    className={`relative bg-zinc-900 p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${prompt.is_special_18 ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-zinc-800 hover:border-orange-500/30'}`}
                  >
                    {prompt.is_special_18 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-600 text-white text-[10px] font-black rounded-full shadow-lg flex items-center gap-1 animate-pulse z-10">
                        <AlertCircle className="w-3 h-3" /> CONTEÚDO +18
                      </div>
                    )}
                    
                    {prompt.image_url && (
                      <div className="w-full h-48 mb-6 rounded-3xl overflow-hidden border border-zinc-800 relative group">
                        <img 
                          src={prompt.image_url} 
                          alt={prompt.subcategories?.name || "Prompt image"} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">{prompt.categories?.name} &bull; {prompt.subcategories?.name}</span>
                        <h4 className="text-white font-bold text-xl">{prompt.title || prompt.subcategories?.name}</h4>
                      </div>
                      <button 
                        onClick={() => toggleFavorite(prompt.id, prompt.is_favorite)}
                        className={`p-2 rounded-xl transition-all ${prompt.is_favorite ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-500 hover:text-yellow-500 hover:bg-zinc-800'}`}
                      >
                        <Star className={`w-5 h-5 ${prompt.is_favorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {prompt.description && (
                      <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                        {prompt.description}
                      </p>
                    )}

                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => setSelectedPrompt(prompt)}
                        className="w-full py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                      >
                        Prompt Completo
                      </button>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" /> {new Date(prompt.created_at).toLocaleDateString()}
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(prompt.content);
                            alert('Prompt copiado!');
                          }}
                          className="text-sm text-orange-500 font-bold hover:underline flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" /> Copiar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            selectedLesson ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                  onClick={() => setSelectedLesson(null)}
                  className="px-6 py-3 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all flex items-center gap-2 border border-zinc-800 w-fit"
                >
                  <ArrowLeft className="w-5 h-5" /> Voltar para Aulas
                </button>
                
                <div className="bg-zinc-900 rounded-[3rem] border border-zinc-800 overflow-hidden">
                  {selectedLesson.video_url ? (
                    <div className="aspect-video bg-black shrink-0">
                      <iframe 
                        src={selectedLesson.video_url.replace('watch?v=', 'embed/').replace('vimeo.com/', 'player.vimeo.com/video/')}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ) : selectedLesson.pdf_url ? (
                    <div className="aspect-video bg-zinc-800 flex flex-col items-center justify-center text-center p-8 shrink-0">
                      <FileText className="w-20 h-20 text-orange-500 mb-4" />
                      <h4 className="text-2xl font-bold text-white mb-2">Material em PDF</h4>
                      <p className="text-gray-400 mb-6">Esta aula é composta por um material em PDF.</p>
                      <a 
                        href={selectedLesson.pdf_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-orange-500 text-black font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center gap-2"
                      >
                        <FileText className="w-5 h-5" /> Abrir PDF
                      </a>
                    </div>
                  ) : (
                    <div className="aspect-video bg-black flex items-center justify-center text-gray-500 shrink-0">
                      Conteúdo não disponível
                    </div>
                  )}
                  
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                      <div>
                        <h3 className="text-3xl font-black text-white mb-2 uppercase">{selectedLesson.title}</h3>
                        <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{selectedLesson.description || 'Sem descrição disponível para esta aula.'}</p>
                      </div>
                      {selectedLesson.pdf_url && selectedLesson.video_url && (
                        <a 
                          href={selectedLesson.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="shrink-0 px-6 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all flex items-center gap-2 border border-zinc-700"
                        >
                          <FileText className="w-5 h-5 text-orange-500" /> Baixar Material
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {modules.map((module, mIdx) => (
                  <div key={module.id} className="bg-zinc-900/50 rounded-[3rem] border border-zinc-800 p-8">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="w-12 h-12 bg-orange-500 text-black rounded-2xl flex items-center justify-center font-black text-xl shrink-0">
                        {mIdx + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight">{module.title}</h4>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">
                          {lessons.filter(l => l.module_id === module.id).length} AULAS
                        </p>
                        {module.description && (
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {module.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {lessons
                        .filter(l => l.module_id === module.id)
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((lesson, lIdx) => {
                          const isUpdated = lesson.updated_at && (!viewedUpdates[lesson.id] || new Date(lesson.updated_at) > new Date(viewedUpdates[lesson.id]));
                          return (
                          <button 
                            key={lesson.id} 
                            onClick={() => handleLessonSelect(lesson)}
                            className="w-full group flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800/50 hover:border-orange-500/50 transition-all text-left relative overflow-hidden"
                          >
                            {isUpdated && (
                              <div className="absolute top-0 right-0 bg-orange-500 text-black text-[8px] font-black uppercase px-2 py-1 rounded-bl-lg z-10">
                                Atualizado
                              </div>
                            )}
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-zinc-800 group-hover:bg-orange-500/20 flex items-center justify-center transition-all">
                                {lesson.video_url ? (
                                  <Play className="w-3 h-3 text-gray-500 group-hover:text-orange-500 fill-current" />
                                ) : lesson.pdf_url ? (
                                  <FileText className="w-3 h-3 text-gray-500 group-hover:text-orange-500" />
                                ) : (
                                  <BookOpen className="w-3 h-3 text-gray-500 group-hover:text-orange-500" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-all flex items-center gap-2">
                                  {lesson.title}
                                  {isUpdated && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                                </p>
                                {lesson.description && <p className="text-[10px] text-gray-600 line-clamp-1">{lesson.description}</p>}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-orange-500 transition-all" />
                          </button>
                        )})}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'tools' && (
            <div className="space-y-12">
              {Array.from(new Set(tools.map(t => t.category || 'Geral'))).map(category => (
                <div key={category} className="space-y-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center">
                      <LinkIcon className="w-4 h-4" />
                    </span>
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {tools.filter(t => (t.category || 'Geral') === category).map((tool) => (
                      <a 
                        key={tool.id}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 p-6 hover:border-orange-500/50 transition-all hover:scale-[1.02]"
                      >
                        {tool.image_url ? (
                          <div className="aspect-video mb-6 overflow-hidden rounded-2xl bg-black">
                            <img 
                              src={tool.image_url} 
                              alt={tool.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video mb-6 rounded-2xl bg-zinc-800 flex items-center justify-center">
                            <LinkIcon className="w-8 h-8 text-gray-600 group-hover:text-orange-500 transition-all" />
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <h4 className="text-xl font-bold text-white group-hover:text-orange-500 transition-all">{tool.name}</h4>
                          <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-orange-500 transition-all" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-8">
              <div className="bg-zinc-900 rounded-[3rem] border border-zinc-800 p-8 md:p-12">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <UserCircle className="w-6 h-6 text-orange-500" />
                  Perfil do Membro
                </h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-800 overflow-hidden border-2 border-zinc-800 group-hover:border-orange-500 transition-all relative">
                        {newAvatar ? (
                          <img src={newAvatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <UserCircle className="w-full h-full text-gray-700" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block">Nickname</label>
                        <input 
                          type="text" 
                          value={newNickname}
                          onChange={(e) => setNewNickname(e.target.value)}
                          placeholder="Seu nome de exibição"
                          className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-orange-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block">URL da Foto</label>
                        <input 
                          type="text" 
                          value={newAvatar}
                          onChange={(e) => setNewAvatar(e.target.value)}
                          placeholder="Link da sua imagem de perfil"
                          className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-orange-500 transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => onUpdateProfile(newNickname, newAvatar)}
                        className="w-full py-4 bg-orange-500 text-black font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" /> Salvar Alterações
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-[3rem] border border-zinc-800 p-8 md:p-12">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <Key className="w-6 h-6 text-orange-500" />
                  Segurança
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block">Nova Senha</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (newPassword.length < 6) {
                        alert('A senha deve ter pelo menos 6 caracteres.');
                        return;
                      }
                      onChangePassword(newPassword);
                      setNewPassword('');
                    }}
                    className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 border border-zinc-700"
                  >
                    <Key className="w-5 h-5" /> Alterar Senha
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
       <nav className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-900 z-50 px-2 py-2 pb-safe overflow-x-auto hide-scrollbar">
         <div className="flex items-center justify-start min-w-max gap-2 px-2">
           {menuItems.map(item => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all whitespace-nowrap ${activeTab === item.id ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
             >
               {item.icon}
               <span className="text-[10px] font-bold">{item.label}</span>
             </button>
           ))}
           {/* Logout button for mobile */}
           <div className="ml-auto pl-2 border-l border-zinc-700">
             <button 
               onClick={onLogout}
               className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-red-500 hover:bg-red-500/10"
               title="Sair da Conta"
             >
               <LogOut className="w-5 h-5" />
               <span className="text-[10px] font-bold">Sair</span>
             </button>
           </div>
         </div>
       </nav>
    </div>
  );
};

const Navbar = ({ user, onLogout, onLoginClick, branding }: { user: any, onLogout: () => void, onLoginClick: () => void, branding: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <Logo branding={branding} />
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-orange-500 transition-colors">Recursos</a>
            <a href="#gallery" className="text-gray-300 hover:text-orange-500 transition-colors">Exemplos</a>
            <a href="#pricing" className="text-gray-300 hover:text-orange-500 transition-colors">Preço</a>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-orange-500 text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> {user.email}
                </span>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 rounded-full border border-zinc-800 text-gray-400 hover:text-white transition-all text-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="px-6 py-2 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all font-medium"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-orange-500/20 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <a href="#features" className="block text-gray-300" onClick={() => setIsOpen(false)}>Recursos</a>
              <a href="#gallery" className="block text-gray-300" onClick={() => setIsOpen(false)}>Exemplos</a>
              <a href="#pricing" className="block text-gray-300" onClick={() => setIsOpen(false)}>Preço</a>
              
              {user ? (
                <div className="py-2 border-t border-zinc-800">
                  <p className="text-orange-500 text-sm mb-4">{user.email}</p>
                  <button 
                    onClick={() => { onLogout(); setIsOpen(false); }}
                    className="w-full px-6 py-3 rounded-xl border border-zinc-800 text-white font-bold"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { onLoginClick(); setIsOpen(false); }}
                  className="w-full px-6 py-3 rounded-xl bg-orange-500 text-black font-bold"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onBuy, branding }: { onBuy: () => void, branding: any }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,146,60,0.2),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(236,72,153,0.16),transparent_35%),radial-gradient(circle_at_55%_85%,rgba(250,204,21,0.14),transparent_35%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-orange-600/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-orange-500/10 rounded-full border border-orange-500/20">
              <Logo branding={branding} className="scale-75" />
              <span className="text-orange-500 text-sm font-semibold tracking-wide uppercase">Plataforma Premium para Conteudo +18</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
              Crie Conteudo com IA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-300 to-pink-400">
                com Prompts +18 de Alta Conversao
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
              Biblioteca atualizada com prompts prontos, aulas praticas e estrategia para gerar imagens e videos realistas.
              Entre hoje e tenha acesso imediato ao metodo usado por criadores que monetizam diariamente.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-700 rounded-full text-sm text-gray-300">+18 com aviso e filtro</div>
              <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-700 rounded-full text-sm text-gray-300">Novos prompts toda semana</div>
              <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-700 rounded-full text-sm text-gray-300">Acesso imediato apos pagamento</div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onBuy}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-400 to-pink-500 hover:brightness-110 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-[0_20px_60px_rgba(244,114,35,0.35)]"
              >
                Começar Agora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl border border-zinc-700 hover:bg-zinc-800 transition-all text-center">Ver Oferta</a>
            </div>
          </motion.div>
          
          {branding?.landing_images?.hero && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-16 relative max-w-5xl mx-auto"
            >
              <div className="aspect-video rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-orange-500/10">
                <img 
                  src={branding.landing_images.hero} 
                  alt="Hero Preview" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Prompts +18",
      description: "Biblioteca exclusiva de prompts otimizados para geração de conteúdo adulto realista e artístico."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Bypass de Censura",
      description: "Técnicas avançadas para contornar filtros de segurança e gerar conteúdo sem restrições."
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Vídeos Sem Filtros",
      description: "Como utilizar ferramentas de vídeo para criar cenas realistas e fluidas sem bloqueios."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Aulas de Engenharia",
      description: "Aprenda a lógica por trás dos prompts para criar qualquer tipo de conteúdo imaginável."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Atualizações Frequentes",
      description: "Receba novos packs de prompts, modelos e ajustes toda semana para manter seu conteúdo atual."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Foco em Conversão",
      description: "Estruturas de prompt pensadas para engajar, prender atenção e transformar visualização em assinante."
    }
  ];

  return (
    <section id="features" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">O que voce recebe ao assinar</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">Nao e apenas uma lista de prompts. E um sistema completo para produzir, escalar e vender conteudo com IA.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all group"
            >
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4 text-center">
            <p className="text-2xl font-black text-orange-400">+500</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Prompts prontos</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4 text-center">
            <p className="text-2xl font-black text-orange-400">+30</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Aulas praticas</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4 text-center">
            <p className="text-2xl font-black text-orange-400">24h</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Acesso apos compra</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ConversionSteps = ({ onBuy }: { onBuy: () => void }) => {
  const steps = [
    { title: 'Escolha seu nicho +18', text: 'Selecione packs de prompts para ensaios, POV, storytelling e conteudo premium.' },
    { title: 'Copie, ajuste e gere', text: 'Use os modelos com instrucoes claras para gerar imagens e videos em poucos minutos.' },
    { title: 'Publique e monetize', text: 'Aplique as tecnicas de entrega e narrativa para aumentar retenção e assinaturas.' }
  ];

  return (
    <section className="py-24 bg-black border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-orange-400 text-xs uppercase tracking-[0.25em] mb-4 font-bold">Metodo HotUncut</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight">Da ideia a venda em 3 passos</h2>
            <p className="text-gray-400 mb-8">Criamos uma jornada simples para acelerar sua produção e transformar criatividade em resultado financeiro.</p>
            <button onClick={onBuy} className="px-8 py-4 rounded-xl bg-orange-500 text-black font-bold hover:bg-orange-600 transition-all">
              Quero acessar agora
            </button>
          </div>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-orange-500 text-black flex items-center justify-center text-sm font-black">{index + 1}</span>
                  <h3 className="text-white text-xl font-bold">{step.title}</h3>
                </div>
                <p className="text-gray-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Gallery = ({ branding }: { branding: any }) => {
  const images = [
    { url: branding?.landing_images?.gallery1 || "https://picsum.photos/seed/ai1/800/800", prompt: branding?.landing_images?.gallery1_text || "Cyberpunk city at night, neon lights, cinematic lighting" },
    { url: branding?.landing_images?.gallery2 || "https://picsum.photos/seed/ai2/800/800", prompt: branding?.landing_images?.gallery2_text || "Hyper-realistic portrait of a futuristic robot, gold accents" },
    { url: branding?.landing_images?.gallery3 || "https://picsum.photos/seed/ai3/800/800", prompt: branding?.landing_images?.gallery3_text || "Surreal landscape with floating islands and purple sky" },
    { url: branding?.landing_images?.gallery4 || "https://picsum.photos/seed/ai4/800/800", prompt: branding?.landing_images?.gallery4_text || "Macro photography of a crystal butterfly, iridescent wings" },
  ];

  return (
    <section id="gallery" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Resultados Impressionantes</h2>
          <p className="text-gray-400">Veja o que você será capaz de criar com nossos prompts.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square rounded-2xl overflow-hidden group border border-zinc-800"
            >
              <img 
                src={img.url} 
                alt="AI Generated" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <p className="text-xs text-orange-500 font-mono mb-2 uppercase tracking-widest">Prompt</p>
                <p className="text-sm text-white italic">"{img.prompt}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ onBuy }: { onBuy: () => void }) => {
  return (
    <section id="pricing" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto bg-zinc-900 border-2 border-orange-500 rounded-3xl p-8 md:p-12 text-center shadow-[0_0_50px_rgba(255,79,0,0.2)]">
          <span className="px-4 py-1 bg-orange-500 text-black text-sm font-bold rounded-full uppercase mb-6 inline-block">
            Oferta Especial para Novos Membros
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Acesso Vitalício</h2>
          <p className="text-gray-400 mb-8">Assine hoje e tenha acesso vitalicio: pague uma vez e use para sempre.</p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-2xl text-gray-500 line-through">R$ 197,90</span>
            <span className="text-6xl font-black text-white">R$ 57,90</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-10">
            {[
              "Biblioteca Completa de Prompts",
              "Aulas em Vídeo Exclusivas",
              "Atualizações Vitalícias",
              "Lista de Ferramentas Premium",
              "Suporte Prioritário",
              "Comunidade de Criadores"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="text-orange-500 w-5 h-5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={onBuy}
            className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-black text-xl font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20"
          >
            Assinar e Entrar Agora
          </button>
          <p className="mt-4 text-sm text-gray-500">Garantia de 7 dias ou seu dinheiro de volta.</p>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Ricardo S.",
      role: "Criador de Conteúdo",
      text: "Os prompts são surreais. Finalmente consegui gerar imagens realistas sem os bloqueios chatos das ferramentas comuns. O bypass de censura funciona perfeitamente.",
      avatar: "https://picsum.photos/seed/user1/100/100"
    },
    {
      name: "Amanda L.",
      role: "Designer Digital",
      text: "As aulas de engenharia de prompt mudaram meu jogo. O acesso vitalício por esse preço é um presente. Recomendo muito para quem quer liberdade total.",
      avatar: "https://picsum.photos/seed/user2/100/100"
    },
    {
      name: "Marcos V.",
      role: "Afiliado",
      text: "Melhor investimento que fiz este ano. A biblioteca de prompts +18 é gigante e a qualidade dos vídeos que estou criando é de outro nível. Vale cada centavo.",
      avatar: "https://picsum.photos/seed/user3/100/100"
    }
  ];

  return (
    <section className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">O Que Dizem Nossos Alunos</h2>
          <p className="text-gray-400">Junte-se a centenas de criadores que já dominam a IA sem limites.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 relative"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-8 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full border-2 border-orange-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-white font-bold">{review.name}</h4>
                  <p className="text-orange-500 text-xs uppercase tracking-wider">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyHotUncut = ({ branding }: { branding: any }) => {
  const [activeTab, setActiveTab] = useState(0);

  const benefits = [
    {
      title: "Prompt Studio",
      subtitle: "Engenharia de Precisão",
      description: "Nossa interface exclusiva onde você encontra prompts prontos para copiar e colar. Filtre por estilo, iluminação e nível de realismo.",
      icon: <Sparkles className="w-6 h-6" />,
      image: branding?.landing_images?.benefit1 || "https://picsum.photos/seed/studio/600/400"
    },
    {
      title: "Video Lab",
      subtitle: "Movimento Sem Limites",
      description: "Aprenda a transformar imagens estáticas em vídeos fluidos. Simulamos o fluxo de trabalho das melhores ferramentas de animação por IA.",
      icon: <Video className="w-6 h-6" />,
      image: branding?.landing_images?.benefit2 || "https://picsum.photos/seed/videolab/600/400"
    },
    {
      title: "Bypass Academy",
      subtitle: "Liberdade Criativa",
      description: "O único lugar que ensina a lógica de 'jailbreak' de prompts para ignorar censuras comerciais e liberar todo o potencial da IA.",
      icon: <Zap className="w-6 h-6" />,
      image: branding?.landing_images?.benefit3 || "https://picsum.photos/seed/bypass/600/400"
    }
  ];

  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Por que escolher o HotUncut?</h2>
          <p className="text-gray-400">Uma experiência completa desenhada para quem não aceita restrições.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Tabs/Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                onClick={() => setActiveTab(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all border ${
                  activeTab === index 
                    ? "bg-orange-500/10 border-orange-500 shadow-[0_0_30px_rgba(255,79,0,0.2)]" 
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${activeTab === index ? "bg-orange-500 text-black" : "bg-zinc-800 text-gray-400"}`}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${activeTab === index ? "text-white" : "text-gray-300"}`}>{benefit.title}</h4>
                    <p className="text-orange-500 text-sm font-medium mb-2">{benefit.subtitle}</p>
                    {activeTab === index && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-gray-400 leading-relaxed"
                      >
                        {benefit.description}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* App Simulation Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full pointer-events-none" />
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative bg-zinc-900 rounded-3xl border border-zinc-800 p-4 shadow-2xl"
            >
              {/* Browser/App Mockup Header */}
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="ml-4 h-6 w-full bg-zinc-800 rounded-md flex items-center px-3">
                  <span className="text-[10px] text-gray-500">hotuncut.app/dashboard/{benefits[activeTab].title.toLowerCase()}</span>
                </div>
              </div>
              
              <div className="aspect-video rounded-xl overflow-hidden bg-black relative group">
                <img 
                  src={benefits[activeTab].image} 
                  alt={benefits[activeTab].title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                    <p className="text-orange-500 font-mono text-xs mb-2 tracking-tighter">PREVIEW_MODE</p>
                    <h5 className="text-white font-bold mb-1">{benefits[activeTab].title} Interface</h5>
                    <p className="text-gray-400 text-xs">Clique para explorar as ferramentas</p>
                  </div>
                </div>
              </div>

              {/* Stats/Micro-info */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-zinc-800/50 rounded-lg animate-pulse" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FinalCTA = ({ onBuy }: { onBuy: () => void }) => {
  const benefits = [
    "Acesso Vitalício (Sem Mensalidades)",
    "Biblioteca de Prompts +18 Exclusiva",
    "Métodos de Bypass de Censura",
    "Aulas de Geração de Vídeos Realistas",
    "Lista de Ferramentas Gratuitas e Pagas",
    "Suporte via Comunidade Privada",
    "Atualizações Semanais de Conteúdo",
    "Garantia Incondicional de 7 Dias"
  ];

  return (
    <section className="py-24 bg-zinc-950 border-t border-orange-500/20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-500 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            SUA JORNADA SEM LIMITES <br />
            <span className="text-orange-500">COMEÇA AQUI</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Não perca a oportunidade de dominar a IA e criar conteúdo que ninguém mais consegue. 
            O preço promocional pode subir a qualquer momento.
          </p>
        </div>

        <div className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-16 border border-zinc-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Benefits List */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <CheckCircle2 className="text-orange-500" /> Tudo o que você recebe:
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    <span className="text-lg font-medium">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Price Card */}
            <div className="bg-black/40 p-8 md:p-12 rounded-3xl border border-orange-500/30 text-center">
              <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">Acesso Imediato</p>
              <div className="mb-6">
                <span className="text-gray-500 line-through text-xl block mb-1">De R$ 197,90 por apenas</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold text-white">R$</span>
                  <span className="text-7xl font-black text-white tracking-tighter">57,90</span>
                </div>
                <p className="text-gray-400 mt-2 font-medium">Pagamento Único • Vitalício</p>
              </div>
              
              <button 
                onClick={onBuy}
                className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-black text-2xl font-black rounded-2xl transition-all shadow-[0_10px_40px_rgba(255,79,0,0.5)] hover:scale-[1.02] active:scale-[0.98]"
              >
                QUERO MEU ACESSO AGORA
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-4 text-gray-500 text-xs uppercase font-bold tracking-widest">
                <div className="flex items-center gap-1"><Zap className="w-3 h-3" /> Seguro</div>
                <div className="flex items-center gap-1"><Zap className="w-3 h-3" /> Instantâneo</div>
                <div className="flex items-center gap-1"><Zap className="w-3 h-3" /> 7 Dias</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustSeals = () => {
  return (
    <section className="py-12 bg-black border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          {/* Quality Seal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-24 h-24 mb-4 relative">
              <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-full h-full bg-zinc-900 border-4 border-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,79,0,0.4)]">
                <Sparkles className="w-10 h-10 text-orange-500" />
              </div>
            </div>
            <h4 className="text-white font-black text-xl tracking-tighter uppercase">Selo de Qualidade</h4>
            <p className="text-gray-500 text-sm mt-1">Conteúdo Premium & Testado</p>
          </motion.div>

          {/* Guarantee Seal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-24 h-24 mb-4 relative">
              <div className="absolute inset-0 bg-orange-500 rounded-full animate-pulse opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-full h-full bg-zinc-900 border-4 border-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,79,0,0.4)]">
                <div className="text-center">
                  <span className="block text-2xl font-black text-white leading-none">7</span>
                  <span className="block text-[10px] font-bold text-orange-500 uppercase leading-none">Dias</span>
                </div>
              </div>
            </div>
            <h4 className="text-white font-black text-xl tracking-tighter uppercase">Garantia Total</h4>
            <p className="text-gray-500 text-sm mt-1">Satisfação ou Reembolso</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Posso gerar conteúdo +18?",
      a: "Sim! O HotUncut é focado justamente em ensinar como utilizar a IA para criar conteúdo adulto realista, artístico e sem as restrições comuns das ferramentas comerciais."
    },
    {
      q: "Como funciona o bypass de censura?",
      a: "Ensinamos técnicas de engenharia de prompt e o uso de ferramentas específicas (Open Source e Locais) que não possuem filtros de segurança, permitindo total liberdade criativa."
    },
    {
      q: "O acesso é realmente vitalício?",
      a: "Sim! Ao adquirir o HotUncut hoje, você terá acesso a todo o conteúdo atual e futuras atualizações sem nunca precisar pagar novamente."
    },
    {
      q: "Preciso de um computador potente?",
      a: "Não necessariamente. Mostramos tanto opções para rodar localmente quanto ferramentas em nuvem que permitem gerar conteúdo de alta qualidade de qualquer dispositivo."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Perguntas Frequentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/30">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left text-white font-semibold"
              >
                <span>{faq.q}</span>
                {openIndex === index ? <ChevronUp className="text-orange-500" /> : <ChevronDown className="text-gray-500" />}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-400 border-t border-zinc-800/50 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onAdminClick, branding }: { onAdminClick: () => void, branding: any }) => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Logo branding={branding} className="scale-75" />
          </div>
          
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-orange-500 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Suporte</a>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2026 HotUncut. Todos os direitos reservados.
            </p>
            <button 
              onClick={onAdminClick}
              className="text-zinc-800 hover:text-orange-500 transition-colors p-2"
              title="Painel Administrativo"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!supabase) {
      setError('Supabase não configurado');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Verifique seu e-mail para confirmar o cadastro!');
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        
        if (signInData.user) {
          // Verifica se o usuário está bloqueado antes de permitir o acesso
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('blocked')
            .eq('id', signInData.user.id)
            .maybeSingle();
            
          if (profile?.blocked) {
            await supabase.auth.signOut();
            throw new Error('Sua conta está bloqueada. Entre em contato com o suporte.');
          }
        }
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-orange-500/30 p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="text-orange-500" /> {isSignUp ? 'Criar Conta' : 'Acessar Conta'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X />
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            {loading ? 'Processando...' : isSignUp ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-orange-500 font-bold hover:underline"
          >
            {isSignUp ? 'Fazer Login' : 'Criar Agora'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
const AdminLogin = ({ onLogin, onClose }: { onLogin: () => void, onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (normalizedUsername === 'admin' && normalizedPassword === 'admin123') {
      onLogin();
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-orange-500/30 p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lock className="text-orange-500" /> Admin Login
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit"
            className="w-full py-4 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all"
          >
            Acessar Painel
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminDashboard = ({ 
  onClose, 
  onSimulateMember, 
  onBrandingUpdate,
  settings,
  setSettings,
  savePaymentUrl,
  nexanoUrl,
  setNexanoUrl
}: { 
  onClose: () => void, 
  onSimulateMember: (email: string) => void, 
  onBrandingUpdate: () => void,
  settings: any,
  setSettings: React.Dispatch<React.SetStateAction<any>>,
  savePaymentUrl: (url: string) => Promise<void>,
  nexanoUrl: string,
  setNexanoUrl: (url: string) => void
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'unified-prompts' | 'lessons' | 'tools' | 'branding' | 'rateio' | 'webhooks'>('members');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<any[]>([]);
  const [webhookStatus, setWebhookStatus] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [expectedToken, setExpectedToken] = useState<string>('dsuxblan');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [simulatedEmail, setSimulatedEmail] = useState('teste@exemplo.com');
  const [lastWebhookUpdate, setLastWebhookUpdate] = useState<string>(new Date().toLocaleTimeString());
  const [serverConfig, setServerConfig] = useState<{supabaseUrl: boolean, supabaseServiceKey: boolean, nexanoToken: boolean, usingAnonAsFallback: boolean} | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState({ categoryId: '', name: '' });
  const [newPrompt, setNewPrompt] = useState({ 
    id: '',
    categoryId: '', 
    subcategoryId: '', 
    title: '',
    description: '',
    content: '', 
    isFavorite: false, 
    isSpecial18: false,
    imageUrl: ''
  });
  const [uploadingPromptImage, setUploadingPromptImage] = useState(false);
  const [newModule, setNewModule] = useState({ title: '', description: '' });
  const [newLesson, setNewLesson] = useState({
    moduleId: '',
    title: '',
    videoUrl: '',
    description: '',
    pdfUrl: ''
  });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [uploadingLessonPdf, setUploadingLessonPdf] = useState(false);
  const [newTool, setNewTool] = useState({
    name: '',
    url: '',
    imageUrl: '',
    category: 'Imagem'
  });

  const [branding, setBranding] = useState({
    logo_url: '',
    logo_width: 150,
    landing_images: {
      hero: 'https://picsum.photos/seed/vibrant/1920/1080?blur=4',
      gallery1: 'https://picsum.photos/seed/ai1/800/800',
      gallery2: 'https://picsum.photos/seed/ai2/800/800',
      gallery3: 'https://picsum.photos/seed/ai3/800/800',
      gallery4: 'https://picsum.photos/seed/ai4/800/800',
      benefit1: 'https://picsum.photos/seed/studio/600/400',
      benefit2: 'https://picsum.photos/seed/videolab/600/400',
      benefit3: 'https://picsum.photos/seed/bypass/600/400'
    },
    rateio_monthly_url: '',
    rateio_quarterly_url: '',
    rateio_annual_url: ''
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingLandingImage, setUploadingLandingImage] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const handleLandingImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('A imagem é muito grande. Por favor, escolha uma imagem com menos de 5MB.');
      return;
    }

    setUploadingLandingImage(key);
    setBrandingError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `landing-${key}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('BRANDING')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error(`Erro ao fazer upload da imagem ${key}:`, uploadError);
        if (uploadError.message.includes('Bucket not found')) {
          setBrandingError(`Erro ao fazer upload para o bucket BRANDING: ${uploadError.message}. Certifique-se de que o bucket existe e é público.`);
        } else {
          setBrandingError(`Erro no upload: ${uploadError.message}`);
        }
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('BRANDING')
        .getPublicUrl(filePath);

      setBranding(prev => ({ 
        ...prev, 
        landing_images: { 
          ...prev.landing_images, 
          [key]: publicUrl 
        } 
      }));
      setBrandingSuccess(`Imagem atualizada com sucesso!`);
      setTimeout(() => setBrandingSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro inesperado no upload:', err);
      setBrandingError(`Erro inesperado no upload: ${err.message || String(err)}`);
    } finally {
      setUploadingLandingImage(null);
    }
  };

  useEffect(() => {
    setPreviewError(false);
  }, [branding.logo_url]);

  const fetchWebhookEvents = async (silent = false) => {
    if (!supabase) {
      if (!silent) setWebhookStatus({ message: 'Supabase não configurado no cliente.', type: 'error' });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('webhook_events')
        .select('*')
        .order('processed_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setWebhookEvents(data || []);
      setLastWebhookUpdate(new Date().toLocaleTimeString());
      if (!silent && data && data.length > 0) {
        setWebhookStatus({ message: `${data.length} logs carregados.`, type: 'success' });
      } else if (!silent) {
        setWebhookStatus({ message: 'Nenhum log encontrado.', type: 'info' });
      }
    } catch (error: any) {
      if (!silent) {
        console.error('Erro ao buscar webhooks:', error.message);
        setWebhookStatus({ message: 'Erro ao buscar logs: ' + error.message, type: 'error' });
      }
    }
  };

  const clearWebhookLogs = async () => {
    if (!supabase) return;
    
    try {
      setWebhookStatus({ message: 'Limpando logs...', type: 'info' });
      const { error } = await supabase
        .from('webhook_events')
        .delete()
        .neq('id', '0'); // Deleta tudo
      
      if (error) throw error;
      setWebhookEvents([]);
      setWebhookStatus({ message: 'Logs limpos com sucesso!', type: 'success' });
      setShowConfirmClear(false);
    } catch (error: any) {
      setWebhookStatus({ message: 'Erro ao limpar logs: ' + error.message, type: 'error' });
    }
  };

  const testDbConnection = async () => {
    setWebhookStatus({ message: 'Testando conexão...', type: 'info' });
    try {
      const response = await fetch('/api/config-check');
      const data = await response.json();
      setServerConfig(data);
      if (data.supabaseUrl && data.supabaseServiceKey) {
        setWebhookStatus({ message: 'Conexão do servidor com Supabase OK!', type: 'success' });
      } else {
        setWebhookStatus({ message: 'Servidor com configuração incompleta.', type: 'error' });
      }
    } catch (error: any) {
      setWebhookStatus({ message: 'Erro ao testar servidor: ' + error.message, type: 'error' });
    }
  };

  const simulateWebhook = async (status: string) => {
    setWebhookStatus({ message: 'Enviando simulação...', type: 'info' });
    try {
      const eventId = `sim_${Math.random().toString(36).substr(2, 9)}`;
      
      // Se for aprovado, vamos usar o payload exato que o usuário mandou para testar
      const payload = status === 'approved' ? {
        event: "TRANSACTION_PAID",
        token: expectedToken,
        client: {
          id: "kskjd812s",
          cpf: "123.123.123-12",
          cnpj: null,
          name: "John Doe",
          email: simulatedEmail || "johndoe@gmail.com",
          phone: "(11) 98218-9217"
        }
      } : {
        id: eventId,
        type: 'purchase.declined',
        status: status,
        customer: {
          email: simulatedEmail,
          name: "Usuário de Teste",
          cpf: "123.456.789-00"
        },
        client: {
          email: simulatedEmail,
          name: "Usuário de Teste",
          cpf: "123.456.789-00"
        },
        data: {
          email: simulatedEmail
        }
      };

      const response = await fetch('/api/webhook/nexano', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-nexano-token': expectedToken
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok) {
        setWebhookStatus({ 
          message: `Simulação enviada! Status: ${result.status}. Evento: ${result.eventId || eventId}`, 
          type: 'success' 
        });
        fetchWebhookEvents();
        fetchProfiles(); // Atualiza lista de membros para ver o bloqueio
      } else {
        setWebhookStatus({ message: `Erro na simulação: ${result.error || response.statusText}`, type: 'error' });
      }
    } catch (error: any) {
      setWebhookStatus({ message: 'Erro ao simular: ' + error.message, type: 'error' });
    }
  };

  const fetchServerConfig = async () => {
    try {
      const response = await fetch('/api/config-check');
      const data = await response.json();
      setServerConfig(data);
    } catch (e) {
      console.error("Erro ao buscar config do servidor");
    }
  };

  useEffect(() => {
    if (activeTab === 'webhooks') {
      fetchWebhookEvents(true);
      fetchServerConfig();
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        fetchProfiles(),
        fetchCategories(),
        fetchSubcategories(),
        fetchPrompts(),
        fetchModules(),
        fetchLessons(),
        fetchTools(),
        fetchBranding(),
        fetchWebhookEvents(true),
        fetchServerConfig()
      ]);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

   const fetchBranding = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'global')
        .single();
      
      console.log('Branding Data from Supabase:', data);
      console.log('Branding Error:', error);
      
      if (data && !error) {
        const brandingData = {
          logo_url: data.logo_url || '',
          logo_width: data.logo_width || 150,
          landing_images: data.landing_images || {
            hero: 'https://picsum.photos/seed/vibrant/1920/1080?blur=4',
            gallery1: 'https://picsum.photos/seed/ai1/800/800',
            gallery2: 'https://picsum.photos/seed/ai2/800/800',
            gallery3: 'https://picsum.photos/seed/ai3/800/800',
            gallery4: 'https://picsum.photos/seed/ai4/800/800',
            benefit1: 'https://picsum.photos/seed/studio/600/400',
            benefit2: 'https://picsum.photos/seed/videolab/600/400',
            benefit3: 'https://picsum.photos/seed/bypass/600/400'
          },
          rateio_monthly_url: data.rateio_monthly_url || '',
          rateio_quarterly_url: data.rateio_quarterly_url || '',
          rateio_annual_url: data.rateio_annual_url || ''
        };
        console.log('Branding to set:', brandingData);
        setBranding(brandingData);
        if (data.nexano_payment_url) {
          setSettings(prev => ({ ...prev, nexano_payment_url: data.nexano_payment_url }));
          setNexanoUrl(data.nexano_payment_url);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar branding:', err);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('A imagem é muito grande. Por favor, escolha uma imagem com menos de 2MB.');
      return;
    }

    setUploadingLogo(true);
    setBrandingError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('BRANDING')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Erro ao fazer upload da logo:', uploadError);
        if (uploadError.message.includes('Bucket not found')) {
          setBrandingError('O bucket "BRANDING" não existe. Execute este código no SQL Editor do Supabase para criá-lo:\n\ninsert into storage.buckets (id, name, public) values (\'BRANDING\', \'BRANDING\', true);\ncreate policy "Public Access" on storage.objects for select using ( bucket_id = \'BRANDING\' );\ncreate policy "Auth Insert" on storage.objects for insert with check ( bucket_id = \'BRANDING\' );\ncreate policy "Auth Update" on storage.objects for update with check ( bucket_id = \'BRANDING\' );');
        } else {
          setBrandingError(`Erro ao fazer upload da logo para o bucket BRANDING: ${uploadError.message}. Certifique-se de que o bucket existe e é público.`);
        }
        setUploadingLogo(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('BRANDING')
        .getPublicUrl(filePath);

      setBranding(prev => ({ ...prev, logo_url: publicUrl }));
    } catch (err: any) {
      console.error('Erro inesperado no upload:', err);
      setBrandingError(`Erro inesperado no upload: ${err.message || String(err)}`);
    } finally {
      setUploadingLogo(false);
    }
  };

  const [brandingError, setBrandingError] = useState<string | null>(null);
  const [brandingSuccess, setBrandingSuccess] = useState<string | null>(null);

   const saveBranding = async () => {
    if (!supabase) return;
    setBrandingError(null);
    setBrandingSuccess(null);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'global',
          logo_url: branding.logo_url,
          logo_width: branding.logo_width,
          nexano_payment_url: settings.nexano_payment_url,
          landing_images: branding.landing_images,
          rateio_monthly_url: branding.rateio_monthly_url,
          rateio_quarterly_url: branding.rateio_quarterly_url,
          rateio_annual_url: branding.rateio_annual_url,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar branding:', error);
        if (error.message.includes('landing_images') && (error.message.includes('does not exist') || error.message.includes('schema cache'))) {
          setBrandingError('Erro: A coluna "landing_images" não existe na tabela "settings". Execute no SQL Editor do Supabase:\n\nALTER TABLE settings ADD COLUMN IF NOT EXISTS landing_images JSONB DEFAULT \'{}\'::jsonb;');
        } else if (error.message.includes('policy') || error.message.includes('row-level security')) {
          setBrandingError('Erro de permissão (RLS): A tabela "settings" não permite atualizações. Execute no SQL Editor do Supabase:\n\nCREATE TABLE IF NOT EXISTS settings (id text primary key, logo_url text, logo_width integer, nexano_payment_url text, landing_images jsonb, updated_at timestamp with time zone);\nALTER TABLE settings ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Permitir tudo para anon" ON settings;\nCREATE POLICY "Permitir tudo para anon" ON settings FOR ALL USING (true) WITH CHECK (true);');
        } else {
          setBrandingError('Erro ao salvar branding: ' + error.message);
        }
      } else {
        setBrandingSuccess('Configurações de branding salvas com sucesso!');
        await fetchBranding(); // Re-busca localmente para garantir sincronia
        onBrandingUpdate(); // Notifica o componente pai
        setTimeout(() => setBrandingSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Erro inesperado ao salvar branding:', err);
      setBrandingError('Erro inesperado ao salvar: ' + (err.message || String(err)));
    }
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Erro ao buscar perfis:', error);
    }
    if (data) {
      setProfiles(data);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) {
      console.error('Erro ao buscar categorias:', error);
    } else if (data) {
      setCategories(data);
    }
  };

  const fetchSubcategories = async () => {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*, categories(name)')
      .order('name');
    if (error) {
      console.error('Erro ao buscar subcategorias:', error);
    } else if (data) {
      setSubcategories(data);
    }
  };

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*, categories(name), subcategories(name)')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Erro ao buscar prompts:', error);
    } else if (data) {
      setPrompts(data);
    }
  };

  const togglePremium = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: !currentStatus })
      .eq('id', id);
    if (error) {
      console.error('Erro ao atualizar status premium:', error);
      alert('Erro ao atualizar status premium: ' + error.message);
    } else {
      fetchProfiles();
    }
  };

  const toggleBlocked = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ blocked: !currentStatus })
      .eq('id', id);
    if (error) {
      console.error('Erro ao atualizar status de bloqueio:', error);
      alert('Erro ao atualizar status de bloqueio: ' + error.message);
    } else {
      // Se estiver bloqueando, tentar deslogar o usuário (se for o admin logado, cuidado)
      if (!currentStatus) {
        // O admin pode deslogar outros usuários via service role no backend se necessário,
        // mas aqui estamos apenas atualizando o banco. O app vai deslogar o usuário
        // na próxima verificação de sessão.
      }
      fetchProfiles();
    }
  };

  const createTestMember = async () => {
    const testEmail = `teste_${Math.floor(Math.random() * 1000)}@membro.com`;
    const testId = crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-0000-0000-' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    
    const { error } = await supabase.from('profiles').insert([{ 
      id: testId,
      email: testEmail, 
      is_premium: true 
    }]);
    
    if (error) {
      console.error('Erro ao criar membro de teste:', error);
      alert('Erro ao criar membro de teste: ' + error.message);
    } else {
      fetchProfiles();
    }
  };

  // Category Actions
  const addCategory = async () => {
    if (!newCategory) return;
    const { error } = await supabase.from('categories').insert([{ name: newCategory }]);
    if (error) {
      console.error('Erro ao adicionar categoria:', error);
      alert('Erro ao adicionar categoria: ' + error.message);
    } else {
      setNewCategory('');
      fetchCategories();
    }
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) fetchCategories();
  };

  // Subcategory Actions
  const addSubcategory = async () => {
    if (!newSubcategory.name || !newSubcategory.categoryId) return;
    const { error } = await supabase.from('subcategories').insert([{ 
      name: newSubcategory.name, 
      category_id: newSubcategory.categoryId 
    }]);
    if (error) {
      console.error('Erro ao adicionar subcategoria:', error);
      alert('Erro ao adicionar subcategoria: ' + error.message);
    } else {
      setNewSubcategory({ ...newSubcategory, name: '' });
      fetchSubcategories();
    }
  };

  const deleteSubcategory = async (id: string) => {
    const { error } = await supabase.from('subcategories').delete().eq('id', id);
    if (!error) fetchSubcategories();
  };

  // Prompt Actions
  const handlePromptImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('A imagem é muito grande. Por favor, escolha uma imagem com menos de 2MB.');
      return;
    }

    setUploadingPromptImage(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `prompt-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('PROMPTS_IMAGES')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Erro ao fazer upload da imagem do prompt:', uploadError);
        if (uploadError.message.includes('Bucket not found')) {
          alert('O bucket "PROMPTS_IMAGES" não existe. Execute este código no SQL Editor do Supabase para criá-lo:\n\ninsert into storage.buckets (id, name, public) values (\'PROMPTS_IMAGES\', \'PROMPTS_IMAGES\', true) ON CONFLICT (id) DO NOTHING;\ncreate policy "Public Access PROMPTS_IMAGES" on storage.objects for select using ( bucket_id = \'PROMPTS_IMAGES\' );\ncreate policy "Auth Insert PROMPTS_IMAGES" on storage.objects for insert with check ( bucket_id = \'PROMPTS_IMAGES\' );\ncreate policy "Auth Update PROMPTS_IMAGES" on storage.objects for update with check ( bucket_id = \'PROMPTS_IMAGES\' );');
        } else {
          alert(`Erro ao fazer upload da imagem: ${uploadError.message}`);
        }
        setUploadingPromptImage(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('PROMPTS_IMAGES')
        .getPublicUrl(filePath);

      setNewPrompt(prev => ({ ...prev, imageUrl: publicUrl }));
    } catch (err: any) {
      console.error('Erro inesperado no upload:', err);
      alert(`Erro inesperado no upload: ${err.message || String(err)}`);
    } finally {
      setUploadingPromptImage(false);
    }
  };

  const addPrompt = async () => {
    if (!newPrompt.content || !newPrompt.categoryId || !newPrompt.subcategoryId || !newPrompt.title) return;
    
    const promptData = {
      title: newPrompt.title,
      description: newPrompt.description,
      content: newPrompt.content,
      category_id: newPrompt.categoryId,
      subcategory_id: newPrompt.subcategoryId,
      is_favorite: newPrompt.isFavorite,
      is_special_18: newPrompt.isSpecial18,
      image_url: newPrompt.imageUrl || null
    };

    if (newPrompt.id) {
      const { error } = await supabase.from('prompts').update(promptData).eq('id', newPrompt.id);
      if (error) {
        console.error('Erro ao atualizar prompt:', error);
        alert('Erro ao atualizar prompt: ' + error.message);
      } else {
        setNewPrompt({ id: '', categoryId: newPrompt.categoryId, subcategoryId: newPrompt.subcategoryId, title: '', description: '', content: '', isFavorite: false, isSpecial18: false, imageUrl: '' });
        fetchPrompts();
      }
    } else {
      const { error } = await supabase.from('prompts').insert([promptData]);
      if (error) {
        console.error('Erro ao adicionar prompt:', error);
        if (error.message.includes('image_url') || error.message.includes('title')) {
          alert('Erro: Colunas faltando na tabela "prompts". Execute no SQL Editor do Supabase:\n\nALTER TABLE prompts ADD COLUMN IF NOT EXISTS image_url TEXT;\nALTER TABLE prompts ADD COLUMN IF NOT EXISTS title TEXT;\nALTER TABLE prompts ADD COLUMN IF NOT EXISTS description TEXT;');
        } else {
          alert('Erro ao adicionar prompt: ' + error.message);
        }
      } else {
        setNewPrompt({ id: '', categoryId: newPrompt.categoryId, subcategoryId: newPrompt.subcategoryId, title: '', description: '', content: '', isFavorite: false, isSpecial18: false, imageUrl: '' });
        fetchPrompts();
      }
    }
  };

  const cancelEditPrompt = () => {
    setNewPrompt({ id: '', categoryId: newPrompt.categoryId, subcategoryId: newPrompt.subcategoryId, title: '', description: '', content: '', isFavorite: false, isSpecial18: false, imageUrl: '' });
  };

  const deletePrompt = async (id: string) => {
    const { error } = await supabase.from('prompts').delete().eq('id', id);
    if (!error) fetchPrompts();
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    const { error } = await supabase.from('prompts').update({ is_favorite: !current }).eq('id', id);
    if (!error) fetchPrompts();
  };

  // Module Actions
  const fetchModules = async () => {
    const { data, error } = await supabase.from('modules').select('*').order('order_index');
    if (data && !error) setModules(data);
  };

  const addModule = async () => {
    if (!newModule.title) return;
    const { error } = await supabase.from('modules').insert([{ 
      title: newModule.title, 
      description: newModule.description,
      order_index: modules.length 
    }]);
    if (error) {
      if (error.message.includes('description')) {
        alert('Erro: Coluna "description" faltando na tabela "modules". Execute no SQL Editor do Supabase:\n\nALTER TABLE modules ADD COLUMN IF NOT EXISTS description TEXT;');
      } else {
        alert('Erro ao adicionar módulo: ' + error.message);
      }
    } else {
      setNewModule({ title: '', description: '' });
      fetchModules();
    }
  };

  const updateModule = async (id: string, updates: any) => {
    const { error } = await supabase.from('modules').update(updates).eq('id', id);
    if (!error) {
      fetchModules();
    } else {
      alert('Erro ao atualizar módulo: ' + error.message);
    }
  };

  const deleteModule = async (id: string) => {
    const { error } = await supabase.from('modules').delete().eq('id', id);
    if (!error) fetchModules();
  };

  const moveModule = async (id: string, direction: 'up' | 'down') => {
    const index = modules.findIndex(m => m.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;

    const otherIndex = direction === 'up' ? index - 1 : index + 1;
    const otherModule = modules[otherIndex];
    const currentModule = modules[index];

    await Promise.all([
      supabase.from('modules').update({ order_index: otherModule.order_index }).eq('id', currentModule.id),
      supabase.from('modules').update({ order_index: currentModule.order_index }).eq('id', otherModule.id)
    ]);
    fetchModules();
  };

  // Lesson Actions
  const fetchLessons = async () => {
    const { data, error } = await supabase.from('lessons').select('*').order('order_index');
    if (data && !error) setLessons(data);
  };

  const handleLessonPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit for PDFs
      alert('O arquivo é muito grande. Por favor, escolha um arquivo com menos de 10MB.');
      return;
    }

    setUploadingLessonPdf(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `lesson-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('LESSON_FILES')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Erro ao fazer upload do PDF da aula:', uploadError);
        if (uploadError.message.includes('Bucket not found')) {
          alert('O bucket "LESSON_FILES" não existe. Execute este código no SQL Editor do Supabase para criá-lo:\n\ninsert into storage.buckets (id, name, public) values (\'LESSON_FILES\', \'LESSON_FILES\', true) ON CONFLICT (id) DO NOTHING;\ncreate policy "Public Access LESSON_FILES" on storage.objects for select using ( bucket_id = \'LESSON_FILES\' );\ncreate policy "Auth Insert LESSON_FILES" on storage.objects for insert with check ( bucket_id = \'LESSON_FILES\' );\ncreate policy "Auth Update LESSON_FILES" on storage.objects for update with check ( bucket_id = \'LESSON_FILES\' );');
        } else {
          alert(`Erro ao fazer upload do arquivo: ${uploadError.message}`);
        }
        setUploadingLessonPdf(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('LESSON_FILES')
        .getPublicUrl(filePath);

      setNewLesson(prev => ({ ...prev, pdfUrl: publicUrl }));
    } catch (err: any) {
      console.error('Erro inesperado no upload:', err);
      alert(`Erro inesperado no upload: ${err.message || String(err)}`);
    } finally {
      setUploadingLessonPdf(false);
    }
  };

  const addLesson = async () => {
    if (!newLesson.title || !newLesson.moduleId) {
      alert("Preencha o título e selecione um módulo.");
      return;
    }
    const moduleLessons = lessons.filter(l => l.module_id === newLesson.moduleId);
    try {
      let error;
      if (editingLessonId) {
        const { error: updateError } = await supabase.from('lessons').update({
          title: newLesson.title,
          module_id: newLesson.moduleId,
          video_url: newLesson.videoUrl,
          description: newLesson.description,
          pdf_url: newLesson.pdfUrl || null,
          updated_at: new Date().toISOString()
        }).eq('id', editingLessonId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('lessons').insert([{ 
          title: newLesson.title,
          module_id: newLesson.moduleId,
          video_url: newLesson.videoUrl,
          description: newLesson.description,
          pdf_url: newLesson.pdfUrl || null,
          order_index: moduleLessons.length
        }]);
        error = insertError;
      }

      if (!error) {
        setNewLesson({ ...newLesson, title: '', videoUrl: '', description: '', pdfUrl: '' });
        setEditingLessonId(null);
        fetchLessons();
        alert(editingLessonId ? "Aula atualizada com sucesso!" : "Aula salva com sucesso!");
      } else {
        console.error("Erro ao salvar aula:", error);
        if (error.message.includes('relation "lessons" does not exist')) {
          alert('Erro: A tabela "lessons" não existe. \n\nExecute no SQL Editor do Supabase:\n\nCREATE TABLE IF NOT EXISTS modules (id uuid default uuid_generate_v4() primary key, title text not null, order_index integer default 0, created_at timestamp with time zone default timezone(\'utc\'::text, now()) not null);\n\nCREATE TABLE IF NOT EXISTS lessons (id uuid default uuid_generate_v4() primary key, module_id uuid references modules(id) on delete cascade, title text not null, video_url text, description text, order_index integer default 0, created_at timestamp with time zone default timezone(\'utc\'::text, now()) not null);\n\nALTER TABLE modules ENABLE ROW LEVEL SECURITY;\nALTER TABLE lessons ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Permitir leitura para todos" ON modules FOR SELECT USING (true);\nCREATE POLICY "Permitir leitura para todos" ON lessons FOR SELECT USING (true);\nCREATE POLICY "Permitir tudo para anon" ON modules FOR ALL USING (true) WITH CHECK (true);\nCREATE POLICY "Permitir tudo para anon" ON lessons FOR ALL USING (true) WITH CHECK (true);');
        } else if (error.message.includes('pdf_url')) {
          alert('Erro: A coluna "pdf_url" não existe na tabela "lessons". \n\nExecute no SQL Editor do Supabase:\n\nALTER TABLE lessons ADD COLUMN IF NOT EXISTS pdf_url TEXT;');
        } else if (error.message.includes('column "updated_at" of relation "lessons" does not exist')) {
          alert('Erro: A coluna "updated_at" não existe na tabela "lessons". \n\nExecute no SQL Editor do Supabase:\n\nALTER TABLE lessons ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default timezone(\'utc\'::text, now()) not null;');
        } else if (error.message.includes('column "video_url" of relation "lessons" does not exist') || error.message.includes('column "description" of relation "lessons" does not exist')) {
          alert('Erro: Colunas faltando na tabela "lessons". \n\nExecute no SQL Editor do Supabase:\n\nALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_url text;\nALTER TABLE lessons ADD COLUMN IF NOT EXISTS description text;');
        } else {
          alert("Erro ao salvar aula: " + error.message);
        }
      }
    } catch (err: any) {
      console.error("Erro inesperado ao salvar aula:", err);
      alert("Erro inesperado: " + (err.message || String(err)));
    }
  };

  const handleEditLesson = (lesson: any) => {
    setNewLesson({
      moduleId: lesson.module_id,
      title: lesson.title,
      videoUrl: lesson.video_url || '',
      description: lesson.description || '',
      pdfUrl: lesson.pdf_url || ''
    });
    setEditingLessonId(lesson.id);
    
    // Scroll to top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteLesson = async (id: string) => {
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (!error) fetchLessons();
  };

  const moveLesson = async (id: string, direction: 'up' | 'down') => {
    const lesson = lessons.find(l => l.id === id);
    const moduleLessons = lessons.filter(l => l.module_id === lesson.module_id);
    const index = moduleLessons.findIndex(l => l.id === id);

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === moduleLessons.length - 1) return;

    const otherIndex = direction === 'up' ? index - 1 : index + 1;
    const otherLesson = moduleLessons[otherIndex];

    await Promise.all([
      supabase.from('lessons').update({ order_index: otherLesson.order_index }).eq('id', lesson.id),
      supabase.from('lessons').update({ order_index: lesson.order_index }).eq('id', otherLesson.id)
    ]);
    fetchLessons();
  };

  // Tool Actions
  const fetchTools = async () => {
    const { data, error } = await supabase.from('tools').select('*').order('order_index');
    if (data && !error) setTools(data);
  };

  const addTool = async () => {
    if (!newTool.name || !newTool.url) return;
    const { error } = await supabase.from('tools').insert([{ 
      name: newTool.name,
      url: newTool.url,
      image_url: newTool.imageUrl,
      category: newTool.category,
      order_index: tools.length
    }]);
    if (error) {
      if (error.message.includes('category')) {
        alert('Erro: Coluna "category" faltando na tabela "tools". Execute no SQL Editor do Supabase:\n\nALTER TABLE tools ADD COLUMN IF NOT EXISTS category TEXT DEFAULT \'Imagem\';');
      } else {
        alert('Erro ao adicionar ferramenta: ' + error.message);
      }
    } else {
      setNewTool({ name: '', url: '', imageUrl: '', category: 'Imagem' });
      fetchTools();
    }
  };

  const deleteTool = async (id: string) => {
    const { error } = await supabase.from('tools').delete().eq('id', id);
    if (!error) fetchTools();
  };

  const moveTool = async (id: string, direction: 'up' | 'down') => {
    const index = tools.findIndex(t => t.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === tools.length - 1) return;

    const otherIndex = direction === 'up' ? index - 1 : index + 1;
    const otherTool = tools[otherIndex];
    const currentTool = tools[index];

    await Promise.all([
      supabase.from('tools').update({ order_index: otherTool.order_index }).eq('id', currentTool.id),
      supabase.from('tools').update({ order_index: currentTool.order_index }).eq('id', otherTool.id)
    ]);
    fetchTools();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-y-auto">
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-black/20">
                <div>
                  <h3 className="text-xl font-bold text-white">Detalhes do Evento</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">{selectedEvent.id}</p>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="p-3 bg-zinc-800 text-white rounded-2xl hover:bg-zinc-700 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                      <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Tipo de Evento</p>
                      <p className="text-white font-bold">{selectedEvent.type}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                      <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Processado em</p>
                      <p className="text-white font-bold">{new Date(selectedEvent.processed_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-2">Payload Completo (JSON)</p>
                    <pre className="bg-black p-6 rounded-2xl border border-zinc-800 text-blue-400 text-xs overflow-x-auto font-mono leading-relaxed">
                      {JSON.stringify(selectedEvent.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-black/20 border-t border-zinc-800">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all"
                >
                  Fechar Detalhes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmação de Limpeza */}
      <AnimatePresence>
        {showConfirmClear && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 w-full max-w-md rounded-[2.5rem] border border-zinc-800 p-8 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Limpar todos os logs?</h3>
              <p className="text-gray-500 mb-8">Esta ação não pode ser desfeita. Todos os registros de webhooks serão removidos permanentemente.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={clearWebhookLogs}
                  className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all"
                >
                  Sim, Limpar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex justify-between items-center w-full md:w-auto">
            <div>
              <h1 className="text-4xl font-black text-white">PAINEL <span className="text-orange-500">ADMIN</span></h1>
              <p className="text-gray-500">Gerencie membros, categorias e prompts do sistema.</p>
            </div>
            <button 
              onClick={onClose}
              className="md:hidden flex-shrink-0 p-3 bg-zinc-900 text-white rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="hidden md:flex bg-zinc-900 rounded-xl p-1 border border-zinc-800 overflow-x-auto hide-scrollbar w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('members')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'members' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Membros
              </button>
              <button 
                onClick={() => setActiveTab('unified-prompts')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'unified-prompts' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Categorias & Prompts
              </button>
              <button 
                onClick={() => setActiveTab('lessons')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'lessons' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Aulas
              </button>
              <button 
                onClick={() => setActiveTab('tools')}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'tools' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Ferramentas
              </button>
               <button 
                 onClick={() => setActiveTab('branding')}
                 className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'branding' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
               >
                 Branding
               </button>
               <button 
                 onClick={() => setActiveTab('rateio')}
                 className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'rateio' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
               >
                 Rateio
               </button>
               <button 
                 onClick={() => setActiveTab('webhooks')}
                 className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'webhooks' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
               >
                 Webhooks
               </button>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:block flex-shrink-0 px-6 py-2 bg-zinc-900 text-white rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all w-full sm:w-auto"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Config */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
              <h3 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-widest">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-black text-white">{profiles.length}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Membros</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-orange-500">{prompts.length}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Prompts</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{lessons.length}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Aulas</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-orange-500">{tools.length}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Ferramentas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
              <h3 className="text-gray-500 text-[10px] font-bold uppercase mb-4 tracking-widest">Configurações</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase mb-1 block">Link Nexano</label>
                  <input 
                    type="text" 
                    value={settings.nexano_payment_url}
                    onChange={(e) => savePaymentUrl(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'branding' && (
              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
                <h3 className="text-xl font-bold text-white mb-8">Configurações de Branding</h3>
                
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl mb-8">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    <div>
                      <p className="text-sm text-orange-500 font-bold mb-1">Configuração do Supabase Necessária</p>
                      <p className="text-xs text-orange-500/80 leading-relaxed">
                        Para que a logo apareça corretamente, o bucket <strong>"BRANDING"</strong> no seu Supabase Storage deve estar configurado como <strong>PUBLIC</strong>. 
                        Vá em Storage {"->"} BRANDING {"->"} Edit Bucket {"->"} Ative "Public bucket".
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    {/* Logo Section */}
                    <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-3xl p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Logo do Sistema</h3>
                      </div>

                      {/* Logo Preview */}
                      {branding.logo_url && (
                        <div className="mb-6">
                          <p className="text-xs text-gray-400 uppercase font-bold mb-3">Preview Atual</p>
                          <div className="p-6 bg-gradient-to-br from-black to-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center min-h-[140px] relative group">
                            {previewError ? (
                              <div className="flex flex-col items-center gap-2 text-red-500">
                                <AlertCircle className="w-8 h-8" />
                                <p className="text-[10px] font-bold uppercase">Erro ao carregar imagem</p>
                                <p className="text-[8px] text-gray-500 text-center max-w-[150px]">Verifique se o bucket "BRANDING" está como PUBLIC no Supabase.</p>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(branding.logo_url);
                                    alert('URL da imagem copiada! Cole em uma nova aba para ver o erro exato do Supabase.');
                                  }}
                                  className="mt-2 text-[8px] underline text-orange-500 hover:text-orange-400 transition-all"
                                >
                                  Copiar Link para Testar
                                </button>
                              </div>
                            ) : (
                              <img 
                                src={branding.logo_url} 
                                alt="Preview Logo" 
                                style={{ width: `${branding.logo_width}px` }}
                                className="object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all"
                                referrerPolicy="no-referrer"
                                onError={() => setPreviewError(true)}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Upload Controls */}
                      <div className="space-y-3">
                        <p className="text-xs text-gray-400 uppercase font-bold">Fazer Upload</p>
                        <div className="flex gap-2">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden" 
                            id="logo-upload"
                          />
                          <label 
                            htmlFor="logo-upload"
                            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-orange-600 text-sm"
                          >
                            {uploadingLogo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            {branding.logo_url ? 'Trocar Logo' : 'Subir Logo'}
                          </label>
                          {branding.logo_url && (
                            <button 
                              onClick={() => setBranding(prev => ({ ...prev, logo_url: '' }))}
                              className="px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/30 font-bold"
                              title="Remover Logo"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* URL Input */}
                      <div className="pt-4 border-t border-zinc-800">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-2 block">Ou use uma URL externa</p>
                        <input 
                          type="text" 
                          placeholder="https://exemplo.com/logo.png"
                          value={branding.logo_url && !branding.logo_url.startsWith('blob:') ? branding.logo_url : ''}
                          onChange={(e) => setBranding(prev => ({ ...prev, logo_url: e.target.value }))}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 text-sm"
                        />
                      </div>

                      {/* Size Slider */}
                      <div className="pt-4 border-t border-zinc-800">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-3 block">
                          Tamanho: <span className="text-orange-400">{branding.logo_width}px</span>
                        </p>
                        <input 
                          type="range" 
                          min="50" 
                          max="400" 
                          step="5"
                          value={branding.logo_width}
                          onChange={(e) => setBranding(prev => ({ ...prev, logo_width: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                          <span>50px (Mínimo)</span>
                          <span>400px (Máximo)</span>
                        </div>
                      </div>

                      {/* Tip Box */}
                      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-xs text-blue-300 leading-relaxed">
                          💡 <strong>Dica:</strong> Use uma logo com fundo transparente (PNG) para melhor integração com o tema escuro. O slider ajusta o tamanho da logo em toda a plataforma.
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                      <h3 className="text-lg font-bold text-white mb-4">Imagens da Landing Page</h3>
                      <div className="space-y-6">
                        {(() => {
                          const renderImageUpload = (key: string, label: string, recommendedSize: string) => (
                            <div className="space-y-2">
                              <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest block truncate">
                                {label} <span className="text-orange-500 lowercase">({recommendedSize})</span>
                              </label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={branding.landing_images[key] || ''}
                                  onChange={(e) => setBranding(prev => ({ ...prev, landing_images: { ...prev.landing_images, [key]: e.target.value } }))}
                                  className="flex-1 min-w-0 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 text-sm"
                                  placeholder="URL da imagem"
                                />
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => handleLandingImageUpload(e, key)}
                                  className="hidden" 
                                  id={`upload-${key}`}
                                />
                                <label 
                                  htmlFor={`upload-${key}`}
                                  className="px-4 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center cursor-pointer border border-zinc-700 shrink-0"
                                  title="Fazer Upload do PC"
                                >
                                  {uploadingLandingImage === key ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                </label>
                              </div>
                            </div>
                          );

                          return (
                            <>
                              <div className="pt-4 border-t border-zinc-800/50 mb-6">
                                <h4 className="text-sm font-bold text-white mb-4">Anúncio da Página Inicial (Membros)</h4>
                                <div className="space-y-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                  {renderImageUpload('home_announcement_image', 'Imagem do Anúncio', '1920x1080')}
                                  <input 
                                    type="text" 
                                    value={branding.landing_images.home_announcement_title || ''}
                                    onChange={(e) => setBranding(prev => ({ ...prev, landing_images: { ...prev.landing_images, home_announcement_title: e.target.value } }))}
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 text-sm"
                                    placeholder="Título do Anúncio (ex: Em breve teremos uma ferramenta...)"
                                  />
                                  <textarea 
                                    value={branding.landing_images.home_announcement_text || ''}
                                    onChange={(e) => setBranding(prev => ({ ...prev, landing_images: { ...prev.landing_images, home_announcement_text: e.target.value } }))}
                                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 text-sm min-h-[100px]"
                                    placeholder="Descrição do anúncio..."
                                  />
                                </div>
                              </div>

                              {renderImageUpload('hero', 'Banner Principal (Hero)', '1920x1080')}
                              
                              <div className="pt-4 border-t border-zinc-800/50">
                                <h4 className="text-sm font-bold text-white mb-4">Galeria de Resultados</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                    {renderImageUpload('gallery1', 'Galeria 1', '800x800')}
                                    <input 
                                      type="text" 
                                      value={branding.landing_images.gallery1_text || ''}
                                      onChange={(e) => setBranding(prev => ({ ...prev, landing_images: { ...prev.landing_images, gallery1_text: e.target.value } }))}
                                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500 text-xs mt-2"
                                      placeholder="Texto do Prompt 1"
                                    />
                                  </div>
                                  <div className="space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                    {renderImageUpload('gallery2', 'Galeria 2', '800x800')}
                                    <input 
                                      type="text" 
                                      value={branding.landing_images.gallery2_text || ''}
                                      onChange={(e) => setBranding(prev => ({ ...prev, landing_images: { ...prev.landing_images, gallery2_text: e.target.value } }))}
                                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500 text-xs mt-2"
                                      placeholder="Texto do Prompt 2"
                                    />
                                  </div>
                                  <div className="space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                    {renderImageUpload('gallery3', 'Galeria 3', '800x800')}
                                    <input 
                                      type="text" 
                                      value={branding.landing_images.gallery3_text || ''}
                                      onChange={(e) => setBranding(prev => ({ ...prev, landing_images: { ...prev.landing_images, gallery3_text: e.target.value } }))}
                                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500 text-xs mt-2"
                                      placeholder="Texto do Prompt 3"
                                    />
                                  </div>
                                  <div className="space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                    {renderImageUpload('gallery4', 'Galeria 4', '800x800')}
                                    <input 
                                      type="text" 
                                      value={branding.landing_images.gallery4_text || ''}
                                      onChange={(e) => setBranding(prev => ({ ...prev, landing_images: { ...prev.landing_images, gallery4_text: e.target.value } }))}
                                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500 text-xs mt-2"
                                      placeholder="Texto do Prompt 4"
                                    />
                                  </div>
                                </div>
                              </div>

                               <div className="pt-4 border-t border-zinc-800/50">
                                 <h4 className="text-sm font-bold text-white mb-4">Benefícios</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   {renderImageUpload('benefit1', 'Benefício 1 (Prompt Studio)', '600x400')}
                                   {renderImageUpload('benefit2', 'Benefício 2 (Video Lab)', '600x400')}
                                   {renderImageUpload('benefit3', 'Benefício 3 (Bypass Academy)', '600x400')}
                                 </div>
                               </div>

                               <div className="pt-4 border-t border-zinc-800/50">
                                 <h4 className="text-sm font-bold text-white mb-4">Painel de Controle (Dashboard)</h4>
                                 <p className="text-xs text-gray-400 mb-3">Imagem que será exibida na seção de showcase do painel</p>
                                 <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                   {renderImageUpload('dashboard', 'Imagem do Dashboard', '1920x1080')}
                                 </div>
                               </div>

                                <div className="pt-4 border-t border-zinc-800/50">
                                  <h4 className="text-sm font-bold text-white mb-4">Rateio das IAs</h4>
                                  <p className="text-xs text-gray-400 mb-3">Imagem que será exibida na seção de pricing do Rateio</p>
                                  <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                    {renderImageUpload('rateio_image', 'Imagem do Rateio', '1920x1080')}
                                  </div>
                                </div>

                                <div className="pt-4 border-t border-zinc-800/50">
                                  <h4 className="text-sm font-bold text-white mb-4">Imagens Geradas com Prompts</h4>
                                 <p className="text-xs text-gray-400 mb-3">4 imagens para o showcase de conteúdos gerados</p>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                     {renderImageUpload('generated_1', 'Imagem Gerada 1', '600x400')}
                                   </div>
                                   <div className="space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                     {renderImageUpload('generated_2', 'Imagem Gerada 2', '600x400')}
                                   </div>
                                   <div className="space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                     {renderImageUpload('generated_3', 'Imagem Gerada 3', '600x400')}
                                   </div>
                                   <div className="space-y-2 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                     {renderImageUpload('generated_4', 'Imagem Gerada 4', '600x400')}
                                   </div>
                                 </div>
                               </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {brandingError && (
                      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm whitespace-pre-wrap">
                        {brandingError}
                      </div>
                    )}
                    {brandingSuccess && (
                      <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm">
                        {brandingSuccess}
                      </div>
                    )}

                    <button 
                      onClick={saveBranding}
                      className="w-full py-4 bg-orange-500 text-black font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 mt-6"
                    >
                      <Save className="w-5 h-5" /> Salvar Configurações
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto">
                        <Sparkles className="w-8 h-8 text-orange-400" />
                      </div>
                      <h4 className="text-white font-bold text-lg">Dica de Branding</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Todas as imagens da landing page são salvas em um banco de dados seguro. Você pode atualizar qualquer imagem a qualquer momento para testar diferentes visuais e estratégias de conversão.
                      </p>
                      <div className="mt-6 pt-6 border-t border-zinc-800">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Formatos Recomendados</p>
                        <p className="text-xs text-gray-400">PNG, JPG, WebP • Máx. 5MB • URLs diretas funcionam</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             )}

            {activeTab === 'rateio' && (
              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
                <h3 className="text-xl font-bold text-white mb-8">Configurações do Rateio das IAs</h3>
                
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl mb-8">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    <div>
                      <p className="text-sm text-orange-500 font-bold mb-1">Configuração de URLs de Compra</p>
                      <p className="text-xs text-orange-500/80 leading-relaxed">
                        Adicione as URLs de compra para cada plano do Rateio. Os botões de compra na landing page irão redirecionar para estas URLs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="max-w-2xl space-y-8">
                  {/* Monthly Plan */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Plano Mensal</h4>
                        <p className="text-xs text-gray-400">R$ 37/mês</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold block">URL de Compra - Mensal</label>
                      <input 
                        type="text" 
                        placeholder="https://exemplo.com/comprar/mensal"
                        value={branding.rateio_monthly_url}
                        onChange={(e) => setBranding(prev => ({ ...prev, rateio_monthly_url: e.target.value }))}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Quarterly Plan */}
                  <div className="bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/40 rounded-3xl p-8 ring-2 ring-orange-500/30">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Plano Trimestral</h4>
                        <p className="text-xs text-orange-400 font-semibold">MAIS POPULAR - R$ 97/3 meses</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold block">URL de Compra - Trimestral</label>
                      <input 
                        type="text" 
                        placeholder="https://exemplo.com/comprar/trimestral"
                        value={branding.rateio_quarterly_url}
                        onChange={(e) => setBranding(prev => ({ ...prev, rateio_quarterly_url: e.target.value }))}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Annual Plan */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Flame className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Plano Anual</h4>
                        <p className="text-xs text-gray-400">R$ 290/ano</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold block">URL de Compra - Anual</label>
                      <input 
                        type="text" 
                        placeholder="https://exemplo.com/comprar/anual"
                        value={branding.rateio_annual_url}
                        onChange={(e) => setBranding(prev => ({ ...prev, rateio_annual_url: e.target.value }))}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {brandingError && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm whitespace-pre-wrap">
                    {brandingError}
                  </div>
                )}
                {brandingSuccess && (
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm">
                    {brandingSuccess}
                  </div>
                )}

                <button 
                  onClick={saveBranding}
                  className="w-full mt-8 py-4 bg-orange-500 text-black font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> Salvar Configurações do Rateio
                </button>
              </div>
            )}

            {activeTab === 'webhooks' && (
              <div className="space-y-6">
                {/* Status do Servidor */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                        <Database className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Status da API</h4>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Conexão Backend</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Supabase URL</span>
                        {serverConfig?.supabaseUrl ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Service Role Key</span>
                        {serverConfig?.supabaseServiceKey ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Nexano Token</span>
                        {serverConfig?.nexanoToken ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                    <button 
                      onClick={testDbConnection}
                      className="w-full mt-4 py-2 bg-zinc-800 text-white text-[10px] font-bold rounded-lg hover:bg-zinc-700 transition-all uppercase"
                    >
                      Testar Conexão
                    </button>
                    <button 
                      onClick={async () => {
                        setWebhookStatus({ message: 'Enviando log de teste...', type: 'info' });
                        try {
                          const response = await fetch('/api/webhook-test');
                          const data = await response.json();
                          if (data.status === 'success') {
                            setWebhookStatus({ message: 'Log de teste criado com sucesso!', type: 'success' });
                            fetchWebhookEvents();
                          } else {
                            setWebhookStatus({ message: 'Erro: ' + data.message, type: 'error' });
                          }
                        } catch (e: any) {
                          setWebhookStatus({ message: 'Erro ao testar: ' + e.message, type: 'error' });
                        }
                      }}
                      className="w-full mt-2 py-2 bg-zinc-800/50 text-gray-400 text-[10px] font-bold rounded-lg hover:bg-zinc-700 transition-all uppercase"
                    >
                      Criar Log de Teste
                    </button>
                  </div>

                  <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Endpoint URL</h4>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Para o Gateway</p>
                      </div>
                    </div>
                    <div className="bg-black p-3 rounded-xl border border-zinc-800 mb-2">
                      <code className="text-[10px] text-blue-400 break-all">
                        {window.location.origin.includes('ais-dev-') 
                          ? 'https://smee.io/nexano-webhook-lucas-dev'
                          : window.location.origin + '/api/webhook/nexano'}
                      </code>
                    </div>
                    <button 
                      onClick={() => {
                        const url = window.location.origin.includes('ais-dev-') 
                          ? 'https://smee.io/nexano-webhook-lucas-dev'
                          : window.location.origin + '/api/webhook/nexano';
                        navigator.clipboard.writeText(url);
                        setWebhookStatus({ message: 'URL copiada!', type: 'success' });
                      }}
                      className="w-full py-2 bg-zinc-800 text-white text-[10px] font-bold rounded-lg hover:bg-zinc-700 transition-all uppercase flex items-center justify-center gap-2"
                    >
                      <Copy className="w-3 h-3" /> Copiar URL
                    </button>
                    <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-[9px] text-blue-400 leading-relaxed">
                        {window.location.origin.includes('ais-dev-') 
                          ? <><strong className="text-white">Túnel Ativo:</strong> Como você está no ambiente de desenvolvimento, geramos uma URL pública do <strong>Smee.io</strong>. Ela fura o bloqueio do Google e entrega os webhooks da Nexano diretamente aqui em tempo real!</>
                          : <><strong className="text-white">Produção:</strong> Esta é a URL oficial do seu servidor para receber webhooks.</>
                        }
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                        <Key className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Token de Segurança</h4>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Header: x-nexano-token</p>
                      </div>
                    </div>
                    <div className="bg-black p-3 rounded-xl border border-zinc-800 mb-2">
                      <code className="text-[10px] text-purple-400 break-all">{expectedToken}</code>
                    </div>
                    <p className="text-[8px] text-gray-500">Este token deve ser configurado no gateway Nexano.</p>
                    <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                      <p className="text-[10px] text-orange-500 font-bold mb-1 uppercase tracking-tighter">Atenção</p>
                      <p className="text-[9px] text-gray-400 leading-relaxed">
                        Para que o bloqueio automático funcione, você DEVE configurar o Secret <strong>NEXANO_WEBHOOK_TOKEN</strong> no AI Studio com o mesmo valor usado na Nexano.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulador */}
                <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Simulador de Eventos</h3>
                      <p className="text-sm text-gray-500">Teste a lógica de bloqueio sem precisar de uma venda real.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block">E-mail do Usuário para Teste</label>
                      <input 
                        type="email"
                        value={simulatedEmail}
                        onChange={(e) => setSimulatedEmail(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-orange-500"
                        placeholder="email@exemplo.com"
                      />
                      <p className="text-[10px] text-gray-500 mt-2 italic">* O usuário deve existir na lista de membros para o bloqueio funcionar.</p>
                    </div>
                    <div className="flex flex-col justify-end gap-3">
                      <button 
                        onClick={() => simulateWebhook('declined')}
                        className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl hover:bg-red-500/20 transition-all border border-red-500/20 flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-5 h-5" /> Simular Compra Recusada (Bloquear)
                      </button>
                      <button 
                        onClick={() => simulateWebhook('approved')}
                        className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Simular Compra Aprovada (Apenas Log)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Logs de Eventos */}
                <div className="bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden">
                  <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-black/20">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-white">Logs de Recebimento</h3>
                      <span className="px-3 py-1 bg-zinc-800 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-widest">
                        Última atualização: {lastWebhookUpdate}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => fetchWebhookEvents()}
                        className="text-orange-500 hover:text-orange-400 text-sm font-bold uppercase tracking-tighter flex items-center gap-2"
                      >
                        <Activity className="w-4 h-4" /> Atualizar Logs
                      </button>
                      <button 
                        onClick={() => setShowConfirmClear(true)}
                        className="text-gray-500 hover:text-red-500 text-sm font-bold uppercase tracking-tighter flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Limpar Tudo
                      </button>
                    </div>
                  </div>

                  {webhookStatus && (
                    <div className={`p-4 text-center text-xs font-bold uppercase tracking-widest ${
                      webhookStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 
                      webhookStatus.type === 'error' ? 'bg-red-500/10 text-red-500' : 
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {webhookStatus.message}
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-black/50 text-gray-500 text-[10px] uppercase font-black tracking-widest">
                          <th className="px-8 py-5">Data/Hora</th>
                          <th className="px-8 py-5">ID do Evento</th>
                          <th className="px-8 py-5">Tipo</th>
                          <th className="px-8 py-5">Usuário</th>
                          <th className="px-8 py-5">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {webhookEvents.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-8 py-12 text-center text-gray-500 italic">
                              Nenhum evento recebido ainda.
                            </td>
                          </tr>
                        ) : webhookEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-black/20 transition-all group">
                            <td className="px-8 py-5 text-gray-400 text-xs font-mono">
                              {new Date(event.processed_at).toLocaleString()}
                            </td>
                            <td className="px-8 py-5 text-white text-xs font-mono">
                              {event.id}
                            </td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                event.type.includes('declined') || event.type.includes('refused') || event.type.includes('recusada')
                                  ? 'bg-red-500/10 text-red-500' 
                                  : 'bg-green-500/10 text-green-500'
                              }`}>
                                {event.type}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-gray-300 text-xs">
                              {event.payload?.customer?.email || event.payload?.email || event.payload?.data?.email || 'N/A'}
                            </td>
                            <td className="px-8 py-5">
                              <button 
                                onClick={() => setSelectedEvent(event)}
                                className="text-orange-500 hover:text-orange-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" /> Detalhes
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Lista de Membros</h3>
                  <div className="flex gap-4">
                    <button onClick={createTestMember} className="px-4 py-2 bg-zinc-800 text-white text-xs font-bold rounded-lg hover:bg-zinc-700 transition-all">
                      + Criar Membro de Teste
                    </button>
                    <button onClick={fetchProfiles} className="text-orange-500 hover:text-orange-400 text-sm">Atualizar</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-black/50 text-gray-500 text-[10px] uppercase">
                        <th className="px-6 py-4">E-mail</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Acesso</th>
                        <th className="px-6 py-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {loading ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Carregando...</td></tr>
                      ) : profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-black/20">
                          <td className="px-6 py-4 text-white text-sm">{profile.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${profile.is_premium ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-800 text-gray-500'}`}>
                              {profile.is_premium ? 'PREMIUM' : 'FREE'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${profile.blocked ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                              {profile.blocked ? 'BLOQUEADO' : 'ATIVO'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                              <button onClick={() => togglePremium(profile.id, profile.is_premium)} className="text-[10px] font-bold uppercase text-orange-500 hover:underline">
                                {profile.is_premium ? "Remover" : "Liberar"}
                              </button>
                              <button onClick={() => toggleBlocked(profile.id, profile.blocked)} className={`text-[10px] font-bold uppercase hover:underline ${profile.blocked ? 'text-green-500' : 'text-red-500'}`}>
                                {profile.blocked ? "Desbloquear" : "Bloquear"}
                              </button>
                              <button onClick={() => onSimulateMember(profile.email)} className="text-[10px] font-bold uppercase text-gray-500 hover:text-white transition-all">
                                Simular Login
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'unified-prompts' && (
              <UnifiedPromptManager 
                categories={categories}
                subcategories={subcategories}
                prompts={prompts}
                onAddCategory={async (name: string) => {
                  await addCategory(name);
                }}
                onDeleteCategory={async (id: string) => {
                  await deleteCategory(id);
                }}
                onAddSubcategory={async (categoryId: string, name: string) => {
                  const { error } = await supabase.from('subcategories').insert([{ 
                    name: name, 
                    category_id: categoryId 
                  }]);
                  if (!error) await fetchSubcategories();
                }}
                onDeleteSubcategory={async (id: string) => {
                  await deleteSubcategory(id);
                }}
                onAddPrompt={async (promptData: any) => {
                  const { error } = await supabase.from('prompts').insert([{
                    title: promptData.title,
                    description: promptData.description,
                    content: promptData.content,
                    category_id: promptData.categoryId,
                    subcategory_id: promptData.subcategoryId,
                    is_favorite: promptData.isFavorite,
                    is_special_18: promptData.isSpecial18,
                    image_url: promptData.imageUrl || null
                  }]);
                  if (!error) await fetchPrompts();
                }}
                onDeletePrompt={async (id: string) => {
                  await deletePrompt(id);
                }}
                onUpdatePrompt={async (id: string, promptData: any) => {
                   const { error } = await supabase.from('prompts').update({
                     title: promptData.title,
                     description: promptData.description,
                     content: promptData.content,
                     category_id: promptData.categoryId,
                     subcategory_id: promptData.subcategoryId,
                     is_favorite: promptData.isFavorite,
                     is_special_18: promptData.isSpecial18,
                     image_url: promptData.imageUrl || null
                   }).eq('id', id);
                   if (!error) await fetchPrompts();
                 }}
                 onUploadImage={async (file: File) => {
                   if (file.size > 2 * 1024 * 1024) { // 2MB limit
                     throw new Error('A imagem é muito grande. Por favor, escolha uma imagem com menos de 2MB.');
                   }

                   const fileExt = file.name.split('.').pop();
                   const fileName = `prompt-${Date.now()}.${fileExt}`;
                   const filePath = `${fileName}`;

                   const { error: uploadError } = await supabase.storage
                     .from('PROMPTS_IMAGES')
                     .upload(filePath, file, { upsert: true });

                   if (uploadError) {
                     if (uploadError.message.includes('Bucket not found')) {
                       throw new Error('O bucket "PROMPTS_IMAGES" não existe. Execute este código no SQL Editor do Supabase para criá-lo:\n\ninsert into storage.buckets (id, name, public) values (\'PROMPTS_IMAGES\', \'PROMPTS_IMAGES\', true) ON CONFLICT (id) DO NOTHING;\ncreate policy "Public Access PROMPTS_IMAGES" on storage.objects for select using ( bucket_id = \'PROMPTS_IMAGES\' );\ncreate policy "Auth Insert PROMPTS_IMAGES" on storage.objects for insert with check ( bucket_id = \'PROMPTS_IMAGES\' );\ncreate policy "Auth Update PROMPTS_IMAGES" on storage.objects for update with check ( bucket_id = \'PROMPTS_IMAGES\' );');
                     }
                     throw new Error(uploadError.message);
                   }

                   const { data: { publicUrl } } = supabase.storage
                     .from('PROMPTS_IMAGES')
                     .getPublicUrl(filePath);

                   return publicUrl;
                 }}
               />
            )}
            {activeTab === 'lessons' && (
              <div className="space-y-8">
                {/* Modules Management */}
                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Módulos do Curso</h3>
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Título do Novo Módulo" 
                        value={newModule.title}
                        onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                        className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                      />
                      <button onClick={addModule} className="px-6 py-2 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Criar Módulo
                      </button>
                    </div>
                    <textarea 
                      placeholder="Descrição do Módulo (Opcional)" 
                      value={newModule.description}
                      onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                      className="w-full h-20 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500 resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    {modules.map((mod, idx) => (
                      <div key={mod.id} className="bg-black p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3 group">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 flex-1">
                            <span className="text-gray-600 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span>
                            <div className="relative flex-1 flex items-center">
                              <input 
                                type="text"
                                value={mod.title}
                                onChange={(e) => {
                                  const newModules = [...modules];
                                  newModules[idx].title = e.target.value;
                                  setModules(newModules);
                                }}
                                onBlur={(e) => updateModule(mod.id, { title: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.currentTarget.blur();
                                  }
                                }}
                                className="bg-zinc-900/50 text-white font-medium outline-none border border-zinc-800 focus:border-orange-500 rounded-lg px-3 py-1.5 flex-1 w-full transition-all"
                                title="Clique para editar o título"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
                            <button onClick={() => moveModule(mod.id, 'up')} className="p-1 text-gray-500 hover:text-orange-500"><ChevronUp className="w-4 h-4" /></button>
                            <button onClick={() => moveModule(mod.id, 'down')} className="p-1 text-gray-500 hover:text-orange-500"><ChevronDown className="w-4 h-4" /></button>
                            <button onClick={() => deleteModule(mod.id)} className="p-1 text-gray-500 hover:text-red-500 ml-2"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <textarea 
                          value={mod.description || ''}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[idx].description = e.target.value;
                            setModules(newModules);
                          }}
                          onBlur={(e) => updateModule(mod.id, { description: e.target.value })}
                          placeholder="Descrição do módulo (clique para editar)..."
                          className="w-full h-16 bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-gray-400 outline-none focus:border-orange-500 resize-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lessons Management */}
                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {editingLessonId ? 'Editar Aula' : 'Cadastrar Aula'}
                    </h3>
                    {editingLessonId && (
                      <button 
                        onClick={() => {
                          setEditingLessonId(null);
                          setNewLesson({ moduleId: '', title: '', videoUrl: '', description: '', pdfUrl: '' });
                        }}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Cancelar Edição
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select 
                      value={newLesson.moduleId}
                      onChange={(e) => setNewLesson({...newLesson, moduleId: e.target.value})}
                      className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    >
                      <option value="">Selecione o Módulo</option>
                      {modules.map(mod => <option key={mod.id} value={mod.id}>{mod.title}</option>)}
                    </select>
                    <input 
                      type="text" 
                      placeholder="Título da Aula" 
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                      className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="URL do Vídeo (YouTube/Vimeo) (Opcional)" 
                    value={newLesson.videoUrl}
                    onChange={(e) => setNewLesson({...newLesson, videoUrl: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500 mb-4"
                  />
                  
                  {/* Lesson PDF Upload */}
                  <div className="mb-4">
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block">Arquivo PDF / Slide (Opcional)</label>
                    <div className="flex items-center gap-4">
                      {newLesson.pdfUrl && (
                        <div className="w-16 h-16 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-red-500" />
                        </div>
                      )}
                      <label className="flex-1 cursor-pointer">
                        <input 
                          type="file" 
                          accept=".pdf,application/pdf"
                          onChange={handleLessonPdfUpload}
                          className="hidden"
                        />
                        <div className="w-full bg-black border border-zinc-800 border-dashed rounded-xl px-4 py-3 text-gray-400 hover:text-white hover:border-orange-500 transition-all flex items-center justify-center gap-2 text-sm">
                          {uploadingLessonPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                          {uploadingLessonPdf ? 'Enviando...' : 'Escolher PDF (Máx 10MB)'}
                        </div>
                      </label>
                    </div>
                  </div>

                  <textarea 
                    placeholder="Descrição da aula..." 
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                    className="w-full h-24 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 mb-4 resize-none"
                  />
                  <button onClick={addLesson} className="w-full py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                    {editingLessonId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {editingLessonId ? 'Salvar Alterações' : 'Salvar Aula'}
                  </button>

                  <div className="mt-12 space-y-8">
                    {modules.map(mod => (
                      <div key={mod.id} className="space-y-4">
                        <h4 className="text-orange-500 font-bold uppercase text-xs tracking-widest">{mod.title}</h4>
                        <div className="space-y-2">
                          {lessons.filter(l => l.module_id === mod.id).map((lesson, lIdx) => (
                            <div key={lesson.id} className="bg-black/40 p-4 rounded-xl border border-zinc-800 flex justify-between items-center group">
                              <div className="flex items-center gap-4">
                                <span className="text-gray-700 font-mono text-[10px]">{lIdx + 1}</span>
                                <div className="flex items-center gap-2">
                                  {lesson.video_url ? (
                                    <Play className="w-3 h-3 text-gray-500 fill-current" />
                                  ) : lesson.pdf_url ? (
                                    <FileText className="w-3 h-3 text-gray-500" />
                                  ) : (
                                    <BookOpen className="w-3 h-3 text-gray-500" />
                                  )}
                                  <span className="text-gray-300 text-sm">{lesson.title}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleEditLesson(lesson)} className="p-1 text-gray-500 hover:text-blue-500"><Edit2 className="w-3 h-3" /></button>
                                <button onClick={() => moveLesson(lesson.id, 'up')} className="p-1 text-gray-500 hover:text-orange-500"><ChevronUp className="w-3 h-3" /></button>
                                <button onClick={() => moveLesson(lesson.id, 'down')} className="p-1 text-gray-500 hover:text-orange-500"><ChevronDown className="w-3 h-3" /></button>
                                <button onClick={() => deleteLesson(lesson.id)} className="p-1 text-gray-500 hover:text-red-500 ml-2"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'tools' && (
              <div className="space-y-8">
                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Cadastrar Ferramenta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input 
                      type="text" 
                      placeholder="Nome da Ferramenta" 
                      value={newTool.name}
                      onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                      className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    />
                    <input 
                      type="text" 
                      placeholder="URL da Ferramenta" 
                      value={newTool.url}
                      onChange={(e) => setNewTool({...newTool, url: e.target.value})}
                      className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    />
                    <select 
                      value={newTool.category}
                      onChange={(e) => setNewTool({...newTool, category: e.target.value})}
                      className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    >
                      <option value="Imagem">Imagem</option>
                      <option value="Vídeos">Vídeos</option>
                      <option value="Ebook">Ebook</option>
                      <option value="Geral">Geral</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder="URL da Imagem (Opcional)" 
                    value={newTool.imageUrl}
                    onChange={(e) => setNewTool({...newTool, imageUrl: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500 mb-4"
                  />
                  <button onClick={addTool} className="w-full py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> Salvar Ferramenta
                  </button>

                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, idx) => (
                      <div key={tool.id} className="bg-black p-6 rounded-[2rem] border border-zinc-800 flex flex-col gap-4 group relative">
                        {tool.image_url && (
                          <img 
                            src={tool.image_url} 
                            alt={tool.name} 
                            className="w-full h-32 object-cover rounded-2xl"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest block mb-1">{tool.category || 'Geral'}</span>
                            <h4 className="text-white font-bold">{tool.name}</h4>
                            <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{tool.url}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => moveTool(tool.id, 'up')} className="p-1 text-gray-500 hover:text-orange-500"><ChevronUp className="w-3 h-3" /></button>
                            <button onClick={() => moveTool(tool.id, 'down')} className="p-1 text-gray-500 hover:text-orange-500"><ChevronDown className="w-3 h-3" /></button>
                            <button onClick={() => deleteTool(tool.id)} className="p-1 text-gray-500 hover:text-red-500 ml-1"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Webhook */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    selectedEvent.type.includes('declined') || selectedEvent.type.includes('refused') || selectedEvent.type.includes('recusada')
                      ? 'bg-red-500/10 text-red-500' 
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Detalhes do Evento</h3>
                    <p className="text-xs text-gray-500 font-mono">{selectedEvent.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-10 h-10 bg-zinc-800 text-gray-400 rounded-full flex items-center justify-center hover:bg-zinc-700 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Tipo de Evento</p>
                    <p className="text-white font-bold">{selectedEvent.type}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Data de Recebimento</p>
                    <p className="text-white font-bold">{new Date(selectedEvent.processed_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-4">Payload Completo (JSON)</p>
                  <pre className="text-[10px] text-blue-400 font-mono bg-black p-4 rounded-xl overflow-x-auto border border-zinc-800/50">
                    {JSON.stringify(selectedEvent.payload, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="p-8 bg-black/20 border-t border-zinc-800 flex justify-end">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="px-8 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all uppercase text-xs tracking-widest"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Confirmação para Limpar Logs */}
      <AnimatePresence>
        {showConfirmClear && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] p-8 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Limpar todos os logs?</h3>
              <p className="text-gray-500 mb-8">
                Esta ação é irreversível e apagará todo o histórico de recebimento de webhooks do banco de dados.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    clearWebhookLogs();
                    setShowConfirmClear(false);
                  }}
                  className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  Sim, Limpar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-900 z-50 px-2 py-2 pb-safe overflow-x-auto hide-scrollbar">
        <div className="flex items-center justify-start min-w-max gap-4 px-2">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'members' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold">Membros</span>
          </button>
          <button
            onClick={() => setActiveTab('unified-prompts')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'unified-prompts' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <FolderTree className="w-5 h-5" />
            <span className="text-[10px] font-bold">Categorias</span>
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'lessons' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold">Aulas</span>
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'tools' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <LinkIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">Ferramentas</span>
          </button>
           <button
             onClick={() => setActiveTab('branding')}
             className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'branding' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
           >
             <Image className="w-5 h-5" />
             <span className="text-[10px] font-bold">Branding</span>
           </button>
           <button
             onClick={() => setActiveTab('rateio')}
             className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'rateio' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
           >
             <DollarSign className="w-5 h-5" />
             <span className="text-[10px] font-bold">Rateio</span>
           </button>
            <button
              onClick={() => setActiveTab('webhooks')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'webhooks' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-[10px] font-bold">Webhooks</span>
            </button>
           {/* Logout button for admin mobile */}
           <div className="ml-auto pl-2 border-l border-zinc-700">
             <button
               onClick={() => {
                 supabase.auth.signOut().catch(console.error);
               }}
               className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-red-500 hover:bg-red-500/10`}
               title="Sair da Conta"
             >
               <LogOut className="w-5 h-5" />
               <span className="text-[10px] font-bold">Sair</span>
             </button>
           </div>
         </div>
       </nav>
    </div>
  );
};

const LandingPage = ({ 
  user, 
  onLogout, 
  onLoginClick, 
  onBuy, 
  onAdminClick,
  branding
}: { 
  user: any, 
  onLogout: () => void, 
  onLoginClick: () => void, 
  onBuy: () => void,
  onAdminClick: () => void,
  branding: any
}) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black">
      <Navbar 
        user={user} 
        onLogout={onLogout} 
        onLoginClick={onLoginClick}
        branding={branding}
      />
      
      <main>
        <PremiumLandingPage 
          onBuy={onBuy}
          branding={branding}
        />
      </main>
      <Footer onAdminClick={onAdminClick} branding={branding} />
    </div>
  );
};

const WaitingForPayment = ({ onLogout, onRefresh, branding }: { onLogout: () => void, onRefresh: () => void, branding: any }) => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-zinc-900 border border-orange-500/30 p-12 rounded-[3rem] text-center">
      <div className="flex justify-center mb-8">
        <Logo branding={branding} />
      </div>
      <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock className="w-8 h-8 text-orange-500 animate-pulse" />
      </div>
      <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Aguardando Aprovação</h2>
      <p className="text-gray-400 mb-8 leading-relaxed">
        Sua conta foi criada com sucesso! <br />
        Estamos aguardando a confirmação do pagamento pela <strong>Nexano</strong>. 
        Isso geralmente leva menos de 2 minutos.
      </p>
      <div className="space-y-4">
        <button 
          onClick={onRefresh}
          className="w-full py-4 bg-orange-500 text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(255,79,0,0.4)]"
        >
          <Loader2 className="w-5 h-5 animate-spin" /> Verificar Status Agora
        </button>
        <button 
          onClick={onLogout}
          className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all border border-zinc-700"
        >
          Sair da Conta
        </button>
      </div>
      <p className="mt-8 text-[10px] text-gray-600 uppercase font-bold tracking-widest">
        Dica: Se você é o administrador testando, use o Painel Admin para simular a aprovação.
      </p>
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [profile, setProfile] = useState<{ nickname: string | null, avatar_url: string | null }>({ nickname: null, avatar_url: null });
  const [prompts, setPrompts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [memberTab, setMemberTab] = useState<'home' | 'prompts' | 'lessons' | 'tools' | 'settings'>('home');

  const [settings, setSettings] = useState({
    supabase_url: import.meta.env.VITE_SUPABASE_URL || '',
    supabase_anon_key: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    nexano_payment_url: localStorage.getItem('nexano_payment_url') || 'https://pay.nexano.com.br/checkout/seu-produto'
  });

  // --- CONFIGURAÇÃO NEXANO ---
  const [nexanoUrl, setNexanoUrl] = useState(localStorage.getItem('nexano_payment_url') || "https://pay.nexano.com.br/checkout/seu-produto");

  useEffect(() => {
    const handleStorageChange = () => {
      setNexanoUrl(localStorage.getItem('nexano_payment_url') || "https://pay.nexano.com.br/checkout/seu-produto");
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const savePaymentUrl = async (url: string) => {
    localStorage.setItem('nexano_payment_url', url);
    setSettings(prev => ({ ...prev, nexano_payment_url: url }));
    setNexanoUrl(url);
    
    if (supabase) {
      await supabase.from('settings').upsert({
        id: 'global',
        nexano_payment_url: url,
        updated_at: new Date().toISOString()
      });
    }
  };

  const [brandingSettings, setBrandingSettings] = useState({
    logo_url: null as string | null,
    logo_width: 150,
    landing_images: null as any,
    rateio_monthly_url: '',
    rateio_quarterly_url: '',
    rateio_annual_url: ''
  });

  useEffect(() => {
    if (user) {
      fetchPremiumContent();
      fetchCourseContent();
      fetchToolsContent();
    }
  }, [user]);

  useEffect(() => {
    fetchBrandingSettings();
  }, []);

  const fetchBrandingSettings = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'global')
      .single();
    
    console.log('Fetching brandingSettings:', { data, error });
    
    if (data && !error) {
      setBrandingSettings({
        logo_url: data.logo_url,
        logo_width: data.logo_width,
        landing_images: data.landing_images,
        rateio_monthly_url: data.rateio_monthly_url || '',
        rateio_quarterly_url: data.rateio_quarterly_url || '',
        rateio_annual_url: data.rateio_annual_url || ''
      });
      console.log('brandingSettings updated:', { data });
    }
  };

  const fetchPremiumContent = async () => {
    if (!supabase) return;
    try {
      const [promptsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        supabase.from('prompts').select('*, categories(name), subcategories(name)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('subcategories').select('*').order('name')
      ]);

      if (promptsRes.error) console.error('Erro RLS/Supabase ao buscar prompts:', promptsRes.error);
      if (categoriesRes.error) console.error('Erro RLS/Supabase ao buscar categorias:', categoriesRes.error);
      if (subcategoriesRes.error) console.error('Erro RLS/Supabase ao buscar subcategorias:', subcategoriesRes.error);

      if (promptsRes.data) setPrompts(promptsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data);
    } catch (err) {
      console.error('Erro ao buscar prompts:', err);
    }
  };

  const fetchCourseContent = async () => {
    if (!supabase) return;
    try {
      const [modulesRes, lessonsRes] = await Promise.all([
        supabase.from('modules').select('*').order('order_index'),
        supabase.from('lessons').select('*').order('order_index')
      ]);

      if (modulesRes.error) console.error('Erro RLS/Supabase ao buscar módulos:', modulesRes.error);
      if (lessonsRes.error) console.error('Erro RLS/Supabase ao buscar aulas:', lessonsRes.error);

      if (modulesRes.data) setModules(modulesRes.data);
      if (lessonsRes.data) setLessons(lessonsRes.data);
    } catch (err) {
      console.error('Erro ao buscar aulas:', err);
    }
  };

  const fetchToolsContent = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('order_index');
      
      if (error) console.error('Erro RLS/Supabase ao buscar ferramentas:', error);
      if (data) setTools(data);
    } catch (err) {
      console.error('Erro ao buscar ferramentas:', err);
    }
  };
  const [loading, setLoading] = useState(true);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        if (error.message.includes('Refresh Token Not Found')) {
          // Clear invalid session
          supabase.auth.signOut().catch(console.error);
        }
      }
      setUser(session?.user ?? null);
      if (session?.user) checkPremiumStatus(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsPremium(false);
        setIsBlocked(false);
        return;
      }

      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus(session.user.id);
      } else {
        setIsPremium(false);
        setIsBlocked(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPremiumStatus = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, blocked, nickname, avatar_url')
        .eq('id', userId)
        .maybeSingle();
      
      if (data && !error) {
        if (data.blocked) {
          console.log('[Auth] Usuário bloqueado detectado. Deslogando...');
          setIsBlocked(true);
          setIsPremium(false);
          await supabase.auth.signOut();
          return;
        }
        setIsPremium(data.is_premium);
        setIsBlocked(false);
        setProfile({ nickname: data.nickname, avatar_url: data.avatar_url });
      }
    } catch (err) {
      console.error('[Auth] Erro ao verificar status do perfil:', err);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    if (!supabase) return;
    const { error } = await supabase.from('prompts').update({ is_favorite: !current }).eq('id', id);
    if (!error) fetchPremiumContent();
  };

  const updateProfile = async (nickname: string, avatarUrl: string | null) => {
    if (!user || !supabase) return;
    const { error } = await supabase
      .from('profiles')
      .update({ nickname, avatar_url: avatarUrl })
      .eq('id', user.id);
    
    if (!error) {
      setProfile({ nickname, avatar_url: avatarUrl });
      alert('Perfil atualizado com sucesso!');
    } else {
      alert('Erro ao atualizar perfil: ' + error.message);
    }
  };

  const handleBuy = () => {
    // Sempre redireciona para o checkout, conforme solicitado pelo usuário
    const checkoutUrl = user 
      ? (nexanoUrl.includes('?') ? `${nexanoUrl}&email=${encodeURIComponent(user.email)}` : `${nexanoUrl}?email=${encodeURIComponent(user.email)}`)
      : nexanoUrl;
    
    window.location.href = checkoutUrl;
  };

  const changePassword = async (newPassword: string) => {
    if (!supabase) return;
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      alert('Senha alterada com sucesso!');
    } else {
      alert('Erro ao alterar senha: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-orange-500/30 p-8 rounded-3xl text-center">
          <Lock className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Configuração Necessária</h2>
          <p className="text-gray-400 mb-6">
            Para ativar a área de membros, você precisa configurar as chaves do Supabase no painel <strong>Settings &gt; Secrets</strong>.
          </p>
          <div className="text-left bg-black p-4 rounded-xl text-xs font-mono text-orange-500 space-y-2">
            <p>VITE_SUPABASE_URL</p>
            <p>VITE_SUPABASE_ANON_KEY</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black">
      {isAdminLoggedIn && (
        <AdminDashboard 
          onClose={() => {
            setIsAdminLoggedIn(false);
            if (user) {
              fetchPremiumContent();
              fetchCourseContent();
              fetchToolsContent();
            }
          }} 
          onSimulateMember={(email) => {
            setUser({ email });
            setIsPremium(true);
            setIsAdminLoggedIn(false);
          }}
          onBrandingUpdate={fetchBrandingSettings}
          settings={settings}
          setSettings={setSettings}
          savePaymentUrl={savePaymentUrl}
          nexanoUrl={nexanoUrl}
          setNexanoUrl={setNexanoUrl}
        />
      )}
      {isAdminLoginOpen && (
        <AdminLogin 
          onLogin={() => {
            setIsAdminLoggedIn(true);
            setIsAdminLoginOpen(false);
          }} 
          onClose={() => setIsAdminLoginOpen(false)} 
        />
      )}

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}

      {isBlocked ? (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-900 border border-red-500/30 p-8 rounded-3xl text-center">
            <Lock className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Acesso Bloqueado</h2>
            <p className="text-gray-400 mb-8">
              Identificamos um problema com seu pagamento ou sua conta foi suspensa. 
              Por favor, entre em contato com o suporte para regularizar sua situação.
            </p>
            <button 
              onClick={handleLogout}
              className="w-full bg-zinc-800 text-white py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-all"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      ) : user ? (
        <MemberArea 
          user={user}
          profile={profile}
          branding={brandingSettings}
          onLogout={handleLogout}
          activeTab={memberTab}
          setActiveTab={setMemberTab}
          prompts={prompts}
          categories={categories}
          subcategories={subcategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          toggleFavorite={toggleFavorite}
          modules={modules}
          lessons={lessons}
          selectedLesson={selectedLesson}
          setSelectedLesson={setSelectedLesson}
          tools={tools}
          onUpdateProfile={updateProfile}
          onChangePassword={changePassword}
        />
      ) : (
        <LandingPage 
          user={user}
          onLogout={handleLogout}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onBuy={handleBuy}
          onAdminClick={() => setIsAdminLoginOpen(true)}
          branding={brandingSettings}
        />
      )}
    </div>
  );
}
