/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Sparkles,
  Lock,
  LogOut,
  User,
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
  Image
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

  const menuItems = [
    { id: 'prompts', label: 'Prompts', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'lessons', label: 'Aulas', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'tools', label: 'Ferramentas', icon: <LinkIcon className="w-5 h-5" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col fixed h-full z-40">
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
      <main className="flex-1 ml-64">
        {/* Banner / Header */}
        <header className="relative h-64 bg-zinc-900 overflow-hidden border-b border-zinc-800">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
          <img 
            src="https://picsum.photos/seed/vibrant/1920/1080?blur=4" 
            alt="Banner" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 p-12 z-20">
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
              {activeTab === 'prompts' && 'Biblioteca de Prompts'}
              {activeTab === 'lessons' && 'Treinamento Exclusivo'}
              {activeTab === 'tools' && 'Ferramentas de Elite'}
              {activeTab === 'settings' && 'Minha Conta'}
            </h1>
            <p className="text-gray-400 font-medium">
              {activeTab === 'prompts' && 'Os melhores comandos para gerar conteúdo sem limites.'}
              {activeTab === 'lessons' && 'Aprenda o passo a passo da engenharia de prompts.'}
              {activeTab === 'tools' && 'Acesse as plataformas mais poderosas do mercado.'}
              {activeTab === 'settings' && 'Gerencie seus dados e preferências de acesso.'}
            </p>
          </div>
        </header>

        <div className="p-12">
          {activeTab === 'prompts' && (
            <div className="space-y-12">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${selectedCategory === 'all' ? 'bg-orange-500 text-black' : 'bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800'}`}
                >
                  Todos
                </button>
                {categories.map(cat => (
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {prompts
                  .filter(p => selectedCategory === 'all' || p.category_id === selectedCategory)
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
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-600 text-white text-[10px] font-black rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                        <AlertCircle className="w-3 h-3" /> CONTEÚDO +18
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">{prompt.categories?.name}</span>
                        <h4 className="text-white font-bold text-xl">{prompt.subcategories?.name}</h4>
                      </div>
                      <button 
                        onClick={() => toggleFavorite(prompt.id, prompt.is_favorite)}
                        className={`p-2 rounded-xl transition-all ${prompt.is_favorite ? 'text-yellow-500 bg-yellow-500/10' : 'text-gray-500 hover:text-yellow-500 hover:bg-zinc-800'}`}
                      >
                        <Star className={`w-5 h-5 ${prompt.is_favorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="relative group">
                      <code className="text-sm text-gray-300 block bg-black/50 p-6 rounded-3xl border border-zinc-800 mb-6 font-mono leading-relaxed min-h-[120px]">
                        {prompt.content}
                      </code>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(prompt.content);
                          alert('Prompt copiado!');
                        }}
                        className="absolute top-4 right-4 p-2 bg-zinc-800 text-gray-400 rounded-lg hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Copiar Prompt"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" /> {new Date(prompt.created_at).toLocaleDateString()}
                      </div>
                      <button className="text-sm text-orange-500 font-bold hover:underline flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Ver Exemplo
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {modules.map((module, mIdx) => (
                <div key={module.id} className="bg-zinc-900/50 rounded-[3rem] border border-zinc-800 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-orange-500 text-black rounded-2xl flex items-center justify-center font-black text-xl">
                      {mIdx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white uppercase tracking-tight">{module.title}</h4>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">
                        {lessons.filter(l => l.module_id === module.id).length} AULAS
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {lessons
                      .filter(l => l.module_id === module.id)
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((lesson, lIdx) => (
                      <button 
                        key={lesson.id} 
                        onClick={() => setSelectedLesson(lesson)}
                        className="w-full group flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-zinc-800/50 hover:border-orange-500/50 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 group-hover:bg-orange-500/20 flex items-center justify-center transition-all">
                            <Play className="w-3 h-3 text-gray-500 group-hover:text-orange-500 fill-current" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-all">{lesson.title}</p>
                            {lesson.description && <p className="text-[10px] text-gray-600 line-clamp-1">{lesson.description}</p>}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-orange-500 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tools.map((tool) => (
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

      {/* Video Player Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 md:p-12">
          <div className="max-w-5xl w-full bg-zinc-900 rounded-[3rem] border border-zinc-800 overflow-hidden relative">
            <button 
              onClick={() => setSelectedLesson(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-orange-500 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="aspect-video bg-black">
              {selectedLesson.video_url ? (
                <iframe 
                  src={selectedLesson.video_url.replace('watch?v=', 'embed/').replace('vimeo.com/', 'player.vimeo.com/video/')}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Vídeo não disponível
                </div>
              )}
            </div>
            
            <div className="p-8 md:p-12">
              <h3 className="text-3xl font-black text-white mb-4 uppercase">{selectedLesson.title}</h3>
              <p className="text-gray-400 leading-relaxed">{selectedLesson.description || 'Sem descrição disponível para esta aula.'}</p>
            </div>
          </div>
        </div>
      )}
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
      {/* Background Glow */}
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
              <span className="text-orange-500 text-sm font-semibold tracking-wide uppercase">Acesso Vitalício Disponível</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
              Domine a IA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Sem Restrições
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
              Aprenda a gerar imagens e vídeos realistas +18 utilizando prompts avançados. 
              Descubra como contornar censuras e utilizar as ferramentas mais poderosas do mercado sem limites.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onBuy}
                className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                Começar Agora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all">
                Ver Exemplos
              </button>
            </div>
          </motion.div>
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
    }
  ];

  return (
    <section id="features" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    { url: "https://picsum.photos/seed/ai1/800/800", prompt: "Cyberpunk city at night, neon lights, cinematic lighting" },
    { url: "https://picsum.photos/seed/ai2/800/800", prompt: "Hyper-realistic portrait of a futuristic robot, gold accents" },
    { url: "https://picsum.photos/seed/ai3/800/800", prompt: "Surreal landscape with floating islands and purple sky" },
    { url: "https://picsum.photos/seed/ai4/800/800", prompt: "Macro photography of a crystal butterfly, iridescent wings" },
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
        <div className="max-w-3xl mx-auto bg-zinc-900 border-2 border-orange-500 rounded-3xl p-8 md:p-12 text-center shadow-[0_0_50px_rgba(249,115,22,0.1)]">
          <span className="px-4 py-1 bg-orange-500 text-black text-sm font-bold rounded-full uppercase mb-6 inline-block">
            Oferta Especial de Lançamento
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Acesso Vitalício</h2>
          <p className="text-gray-400 mb-8">Pague uma vez, use para sempre. Sem assinaturas mensais.</p>
          
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
            Garantir Meu Acesso Agora
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

const WhyHotUncut = () => {
  const [activeTab, setActiveTab] = useState(0);

  const benefits = [
    {
      title: "Prompt Studio",
      subtitle: "Engenharia de Precisão",
      description: "Nossa interface exclusiva onde você encontra prompts prontos para copiar e colar. Filtre por estilo, iluminação e nível de realismo.",
      icon: <Sparkles className="w-6 h-6" />,
      image: "https://picsum.photos/seed/studio/600/400"
    },
    {
      title: "Video Lab",
      subtitle: "Movimento Sem Limites",
      description: "Aprenda a transformar imagens estáticas em vídeos fluidos. Simulamos o fluxo de trabalho das melhores ferramentas de animação por IA.",
      icon: <Video className="w-6 h-6" />,
      image: "https://picsum.photos/seed/videolab/600/400"
    },
    {
      title: "Bypass Academy",
      subtitle: "Liberdade Criativa",
      description: "O único lugar que ensina a lógica de 'jailbreak' de prompts para ignorar censuras comerciais e liberar todo o potencial da IA.",
      icon: <Zap className="w-6 h-6" />,
      image: "https://picsum.photos/seed/bypass/600/400"
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
                    ? "bg-orange-500/10 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.1)]" 
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
                className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-black text-2xl font-black rounded-2xl transition-all shadow-[0_10px_40px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-[0.98]"
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
              <div className="relative w-full h-full bg-zinc-900 border-4 border-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.2)]">
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
              <div className="relative w-full h-full bg-zinc-900 border-4 border-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.2)]">
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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
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
    if (username === 'admin' && password === 'admin123') {
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

const AdminDashboard = ({ onClose, onSimulateMember, onBrandingUpdate }: { onClose: () => void, onSimulateMember: (email: string) => void, onBrandingUpdate: () => void }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'categories' | 'prompts' | 'lessons' | 'tools' | 'branding'>('members');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState({ categoryId: '', name: '' });
  const [newPrompt, setNewPrompt] = useState({ 
    categoryId: '', 
    subcategoryId: '', 
    content: '', 
    isFavorite: false, 
    isSpecial18: false 
  });
  const [newModule, setNewModule] = useState('');
  const [newLesson, setNewLesson] = useState({
    moduleId: '',
    title: '',
    videoUrl: '',
    description: ''
  });
  const [newTool, setNewTool] = useState({
    name: '',
    url: '',
    imageUrl: ''
  });

  const [branding, setBranding] = useState({
    logo_url: '',
    logo_width: 150
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    setPreviewError(false);
  }, [branding.logo_url]);

  const [settings, setSettings] = useState({
    supabase_url: import.meta.env.VITE_SUPABASE_URL || '',
    supabase_anon_key: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    nexano_webhook: '/api/webhook/nexano',
    nexano_payment_url: localStorage.getItem('nexano_payment_url') || 'https://pay.nexano.com.br/checkout/seu-produto'
  });

  const savePaymentUrl = (url: string) => {
    localStorage.setItem('nexano_payment_url', url);
    setSettings(prev => ({ ...prev, nexano_payment_url: url }));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProfiles(),
      fetchCategories(),
      fetchSubcategories(),
      fetchPrompts(),
      fetchModules(),
      fetchLessons(),
      fetchTools(),
      fetchBranding()
    ]);
    setLoading(false);
  };

  const fetchBranding = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'global')
        .single();
      
      if (data && !error) {
        setBranding({
          logo_url: data.logo_url || '',
          logo_width: data.logo_width || 150
        });
      }
    } catch (err) {
      console.error('Erro ao buscar branding:', err);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview imediato local (base64)
    const previewUrl = URL.createObjectURL(file);
    setBranding(prev => ({ ...prev, logo_url: previewUrl }));

    if (!supabase) {
      alert('Supabase não configurado. A logo será exibida apenas nesta sessão.');
      return;
    }

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      const bucketName = 'BRANDING'; // Alterado para maiúsculas conforme print
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        const errMsg = (uploadError as any).message || '';
        if (errMsg.includes('not found')) {
          throw new Error('O "Bucket" de armazenamento chamado "BRANDING" não foi encontrado. Verifique se o nome está exatamente igual no Supabase (maiúsculas/minúsculas).');
        }
        if (errMsg.includes('policy') || errMsg.includes('row-level security')) {
          throw new Error('Erro de permissão (RLS): O Supabase bloqueou o upload. Execute o comando SQL de DROP/CREATE POLICY novamente.');
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Atualiza com a URL real do Supabase
      setBranding(prev => ({ ...prev, logo_url: publicUrl }));
      
      // Limpa o objeto URL com um pequeno atraso para garantir que a nova imagem carregou
      setTimeout(() => {
        URL.revokeObjectURL(previewUrl);
      }, 2000);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      // Se falhar o upload, mantém o preview local mas avisa o usuário
      if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
        alert('Erro de Permissão (RLS): O upload falhou. \n\nExecute este comando no SQL Editor do Supabase:\n\nDROP POLICY IF EXISTS "Permitir upload anon" ON storage.objects;\nDROP POLICY IF EXISTS "Permitir update anon" ON storage.objects;\nDROP POLICY IF EXISTS "Permitir select anon" ON storage.objects;\nCREATE POLICY "Permitir upload anon" ON storage.objects FOR INSERT WITH CHECK (bucket_id = \'branding\');\nCREATE POLICY "Permitir update anon" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = \'branding\');\nCREATE POLICY "Permitir select anon" ON storage.objects FOR SELECT USING (bucket_id = \'branding\');');
      } else {
        alert('Erro ao processar upload: ' + error.message);
      }
    } finally {
      setUploadingLogo(false);
    }
  };

  const saveBranding = async () => {
    if (!supabase) return;
    
    // Se a logo for um blob local (preview), avisa que não foi salva no storage
    if (branding.logo_url?.startsWith('blob:')) {
      alert('A imagem ainda está em processo de upload ou o upload falhou. Por favor, aguarde ou tente subir a imagem novamente antes de salvar.');
      return;
    }

    const { error } = await supabase
      .from('settings')
      .upsert({
        id: 'global',
        logo_url: branding.logo_url,
        logo_width: branding.logo_width,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Erro ao salvar branding:', error);
      if (error.message.includes('policy') || error.message.includes('row-level security')) {
        alert('Erro de permissão (RLS): A tabela "settings" não permite atualizações. \n\nExecute no SQL Editor do Supabase:\n\nCREATE TABLE IF NOT EXISTS settings (id text primary key, logo_url text, logo_width integer, nexano_payment_url text, updated_at timestamp with time zone);\nALTER TABLE settings ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Permitir tudo para anon" ON settings;\nCREATE POLICY "Permitir tudo para anon" ON settings FOR ALL USING (true) WITH CHECK (true);');
      } else {
        alert('Erro ao salvar branding: ' + error.message);
      }
    } else {
      alert('Configurações de branding salvas com sucesso!');
      await fetchBranding(); // Re-busca localmente para garantir sincronia
      onBrandingUpdate(); // Notifica o componente pai
    }
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data && !error) setProfiles(data);
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
  const addPrompt = async () => {
    if (!newPrompt.content || !newPrompt.categoryId || !newPrompt.subcategoryId) return;
    const { error } = await supabase.from('prompts').insert([{ 
      content: newPrompt.content,
      category_id: newPrompt.categoryId,
      subcategory_id: newPrompt.subcategoryId,
      is_favorite: newPrompt.isFavorite,
      is_special_18: newPrompt.isSpecial18
    }]);
    if (error) {
      console.error('Erro ao adicionar prompt:', error);
      alert('Erro ao adicionar prompt: ' + error.message);
    } else {
      setNewPrompt({ ...newPrompt, content: '', isFavorite: false, isSpecial18: false });
      fetchPrompts();
    }
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
    if (!newModule) return;
    const { error } = await supabase.from('modules').insert([{ 
      title: newModule, 
      order_index: modules.length 
    }]);
    if (!error) {
      setNewModule('');
      fetchModules();
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

  const addLesson = async () => {
    if (!newLesson.title || !newLesson.moduleId) return;
    const moduleLessons = lessons.filter(l => l.module_id === newLesson.moduleId);
    const { error } = await supabase.from('lessons').insert([{ 
      title: newLesson.title,
      module_id: newLesson.moduleId,
      video_url: newLesson.videoUrl,
      description: newLesson.description,
      order_index: moduleLessons.length
    }]);
    if (!error) {
      setNewLesson({ ...newLesson, title: '', videoUrl: '', description: '' });
      fetchLessons();
    }
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
      order_index: tools.length
    }]);
    if (!error) {
      setNewTool({ name: '', url: '', imageUrl: '' });
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-white">PAINEL <span className="text-orange-500">ADMIN</span></h1>
            <p className="text-gray-500">Gerencie membros, categorias e prompts do sistema.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
              <button 
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'members' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Membros
              </button>
              <button 
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Categorias
              </button>
              <button 
                onClick={() => setActiveTab('prompts')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'prompts' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Prompts
              </button>
              <button 
                onClick={() => setActiveTab('lessons')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'lessons' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Aulas
              </button>
              <button 
                onClick={() => setActiveTab('tools')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'tools' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Ferramentas
              </button>
              <button 
                onClick={() => setActiveTab('branding')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'branding' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Branding
              </button>
            </div>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-zinc-900 text-white rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Config */}
          <div className="lg:col-span-1 space-y-6">
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
          <div className="lg:col-span-3">
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
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block">Logo do Sistema</label>
                      <div className="flex flex-col gap-4">
                        {branding.logo_url && (
                          <div className="p-4 bg-black rounded-2xl border border-zinc-800 flex items-center justify-center min-h-[150px] relative">
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
                                className="object-contain"
                                referrerPolicy="no-referrer"
                                onError={() => setPreviewError(true)}
                              />
                            )}
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden" 
                          id="logo-upload"
                        />
                        <div className="flex gap-2">
                          <label 
                            htmlFor="logo-upload"
                            className="flex-1 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer border border-zinc-700"
                          >
                            {uploadingLogo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            {branding.logo_url ? 'Trocar Logo' : 'Subir Logo'}
                          </label>
                          {branding.logo_url && (
                            <button 
                              onClick={() => setBranding(prev => ({ ...prev, logo_url: '' }))}
                              className="px-4 py-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-all border border-red-500/20"
                              title="Remover Logo"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        <div className="mt-4">
                          <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block">Ou use uma URL externa</label>
                          <input 
                            type="text" 
                            placeholder="https://exemplo.com/logo.png"
                            value={branding.logo_url && !branding.logo_url.startsWith('blob:') ? branding.logo_url : ''}
                            onChange={(e) => setBranding(prev => ({ ...prev, logo_url: e.target.value }))}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block">
                        Tamanho da Logo ({branding.logo_width}px)
                      </label>
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
                        <span>50px</span>
                        <span>400px</span>
                      </div>
                    </div>

                    <button 
                      onClick={saveBranding}
                      className="w-full py-4 bg-orange-500 text-black font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" /> Salvar Configurações
                    </button>
                  </div>

                  <div className="bg-black/50 p-8 rounded-[2.5rem] border border-zinc-800 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-orange-500" />
                    </div>
                    <h4 className="text-white font-bold mb-2">Dica de Proporção</h4>
                    <p className="text-sm text-gray-500">
                      Use uma logo com fundo transparente (PNG ou SVG) para melhor integração com o tema escuro. Ajuste o slider para encontrar o equilíbrio visual perfeito.
                    </p>
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
                        <th className="px-6 py-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {loading ? (
                        <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Carregando...</td></tr>
                      ) : profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-black/20">
                          <td className="px-6 py-4 text-white text-sm">{profile.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${profile.is_premium ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-800 text-gray-500'}`}>
                              {profile.is_premium ? 'PREMIUM' : 'FREE'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <button onClick={() => togglePremium(profile.id, profile.is_premium)} className="text-[10px] font-bold uppercase text-orange-500 hover:underline">
                                {profile.is_premium ? "Remover" : "Liberar"}
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

            {activeTab === 'categories' && (
              <div className="space-y-8">
                {/* Categories Management */}
                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Categorias Principais</h3>
                  <div className="flex gap-4 mb-6">
                    <input 
                      type="text" 
                      placeholder="Nova Categoria (ex: Imagem, Vídeo)" 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    />
                    <button onClick={addCategory} className="px-6 py-2 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Adicionar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(cat => (
                      <div key={cat.id} className="bg-black p-4 rounded-2xl border border-zinc-800 flex justify-between items-center group">
                        <span className="text-white font-medium">{cat.name}</span>
                        <button onClick={() => deleteCategory(cat.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subcategories Management */}
                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Subcategorias</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <select 
                      value={newSubcategory.categoryId}
                      onChange={(e) => setNewSubcategory({...newSubcategory, categoryId: e.target.value})}
                      className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    >
                      <option value="">Selecione a Categoria</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <input 
                      type="text" 
                      placeholder="Nome da Subcategoria" 
                      value={newSubcategory.name}
                      onChange={(e) => setNewSubcategory({...newSubcategory, name: e.target.value})}
                      className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    />
                    <button onClick={addSubcategory} className="px-6 py-2 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Adicionar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subcategories.map(sub => (
                      <div key={sub.id} className="bg-black p-4 rounded-2xl border border-zinc-800 flex flex-col gap-1 group relative">
                        <span className="text-[10px] text-orange-500 uppercase font-bold">{(sub as any).categories?.name}</span>
                        <span className="text-white font-medium">{sub.name}</span>
                        <button onClick={() => deleteSubcategory(sub.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prompts' && (
              <div className="space-y-8">
                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Novo Prompt</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select 
                      value={newPrompt.categoryId}
                      onChange={(e) => setNewPrompt({...newPrompt, categoryId: e.target.value, subcategoryId: ''})}
                      className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    >
                      <option value="">Categoria</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <select 
                      value={newPrompt.subcategoryId}
                      onChange={(e) => setNewPrompt({...newPrompt, subcategoryId: e.target.value})}
                      className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    >
                      <option value="">Subcategoria</option>
                      {subcategories.filter(s => s.category_id === newPrompt.categoryId).map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                  <textarea 
                    placeholder="Insira o prompt aqui..." 
                    value={newPrompt.content}
                    onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})}
                    className="w-full h-32 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 mb-4 resize-none"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={newPrompt.isFavorite}
                          onChange={(e) => setNewPrompt({...newPrompt, isFavorite: e.target.checked})}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${newPrompt.isFavorite ? 'bg-orange-500 border-orange-500' : 'border-zinc-700 group-hover:border-orange-500'}`}>
                          {newPrompt.isFavorite && <Star className="w-3 h-3 text-black fill-current" />}
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-white">Favorito</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={newPrompt.isSpecial18}
                          onChange={(e) => setNewPrompt({...newPrompt, isSpecial18: e.target.checked})}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${newPrompt.isSpecial18 ? 'bg-red-500 border-red-500' : 'border-zinc-700 group-hover:border-red-500'}`}>
                          {newPrompt.isSpecial18 && <AlertCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-white">Destaque +18</span>
                      </label>
                    </div>
                    <button onClick={addPrompt} className="px-8 py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Salvar Prompt
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
                  <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Prompts Cadastrados</h3>
                    <button onClick={fetchPrompts} className="text-orange-500 hover:text-orange-400 text-sm">Atualizar</button>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {prompts.map(p => (
                      <div key={p.id} className="p-6 hover:bg-black/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-zinc-800 text-gray-400 text-[10px] font-bold rounded uppercase">{(p as any).categories?.name}</span>
                            <span className="px-2 py-1 bg-zinc-800 text-orange-500 text-[10px] font-bold rounded uppercase">{(p as any).subcategories?.name}</span>
                            {p.is_favorite && <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold rounded flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> FAVORITO</span>}
                            {p.is_special_18 && <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded flex items-center gap-1"><AlertCircle className="w-3 h-3" /> +18 DESTAQUE</span>}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => toggleFavorite(p.id, p.is_favorite)} className={`p-2 rounded-lg hover:bg-zinc-800 ${p.is_favorite ? 'text-orange-500' : 'text-gray-500'}`}>
                              <Star className={`w-4 h-4 ${p.is_favorite ? 'fill-current' : ''}`} />
                            </button>
                            <button onClick={() => deletePrompt(p.id)} className="p-2 rounded-lg hover:bg-zinc-800 text-gray-500 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm font-mono bg-black/40 p-4 rounded-xl border border-zinc-800/50">{p.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'lessons' && (
              <div className="space-y-8">
                {/* Modules Management */}
                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Módulos do Curso</h3>
                  <div className="flex gap-4 mb-6">
                    <input 
                      type="text" 
                      placeholder="Título do Novo Módulo" 
                      value={newModule}
                      onChange={(e) => setNewModule(e.target.value)}
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                    />
                    <button onClick={addModule} className="px-6 py-2 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Criar Módulo
                    </button>
                  </div>
                  <div className="space-y-3">
                    {modules.map((mod, idx) => (
                      <div key={mod.id} className="bg-black p-4 rounded-2xl border border-zinc-800 flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</span>
                          <span className="text-white font-medium">{mod.title}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => moveModule(mod.id, 'up')} className="p-1 text-gray-500 hover:text-orange-500"><ChevronUp className="w-4 h-4" /></button>
                          <button onClick={() => moveModule(mod.id, 'down')} className="p-1 text-gray-500 hover:text-orange-500"><ChevronDown className="w-4 h-4" /></button>
                          <button onClick={() => deleteModule(mod.id)} className="p-1 text-gray-500 hover:text-red-500 ml-2"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lessons Management */}
                <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Cadastrar Aula</h3>
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
                    placeholder="URL do Vídeo (YouTube/Vimeo)" 
                    value={newLesson.videoUrl}
                    onChange={(e) => setNewLesson({...newLesson, videoUrl: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500 mb-4"
                  />
                  <textarea 
                    placeholder="Descrição da aula..." 
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                    className="w-full h-24 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 mb-4 resize-none"
                  />
                  <button onClick={addLesson} className="w-full py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> Salvar Aula
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
                                <span className="text-gray-300 text-sm">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        <Hero onBuy={onBuy} branding={branding} />
        <Features />
        <Gallery />
        <Pricing onBuy={onBuy} />
        <Testimonials />
        <WhyHotUncut />
        <FinalCTA onBuy={onBuy} />
        <TrustSeals />
        <FAQ />
      </main>
      <Footer onAdminClick={onAdminClick} branding={branding} />
    </div>
  );
};

const WaitingForPayment = ({ onLogout, branding }: { onLogout: () => void, branding: any }) => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-zinc-900 border border-orange-500/30 p-12 rounded-[3rem] text-center">
      <div className="flex justify-center mb-8">
        <Logo branding={branding} />
      </div>
      <Lock className="w-12 h-12 text-orange-500 mx-auto mb-6 opacity-50" />
      <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Aguardando Pagamento</h2>
      <p className="text-gray-400 mb-8 leading-relaxed">
        Sua conta foi criada, mas o acesso premium ainda não foi liberado. 
        Se você já pagou via Nexano, aguarde alguns minutos para a ativação automática.
      </p>
      <div className="space-y-4">
        <a href="#pricing" className="w-full py-4 bg-orange-500 text-black font-bold rounded-2xl inline-block hover:bg-orange-600 transition-all">
          Ver Planos
        </a>
        <button 
          onClick={onLogout}
          className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all border border-zinc-700"
        >
          Sair da Conta
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [profile, setProfile] = useState<{ nickname: string | null, avatar_url: string | null }>({ nickname: null, avatar_url: null });
  const [prompts, setPrompts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [memberTab, setMemberTab] = useState<'prompts' | 'lessons' | 'tools' | 'settings'>('prompts');

  const [brandingSettings, setBrandingSettings] = useState({
    logo_url: null as string | null,
    logo_width: 150
  });

  useEffect(() => {
    if (isPremium) {
      fetchPremiumContent();
      fetchCourseContent();
      fetchToolsContent();
    }
  }, [isPremium]);

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
    
    if (data && !error) {
      setBrandingSettings({
        logo_url: data.logo_url,
        logo_width: data.logo_width
      });
    }
  };

  const fetchPremiumContent = async () => {
    const [promptsRes, categoriesRes] = await Promise.all([
      supabase.from('prompts').select('*, categories(name), subcategories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ]);

    if (promptsRes.data) setPrompts(promptsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
  };

  const fetchCourseContent = async () => {
    const [modulesRes, lessonsRes] = await Promise.all([
      supabase.from('modules').select('*').order('order_index'),
      supabase.from('lessons').select('*').order('order_index')
    ]);

    if (modulesRes.data) setModules(modulesRes.data);
    if (lessonsRes.data) setLessons(lessonsRes.data);
  };

  const fetchToolsContent = async () => {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('order_index');
    if (data && !error) setTools(data);
  };
  const [loading, setLoading] = useState(true);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // --- CONFIGURAÇÃO NEXANO ---
  const [nexanoUrl, setNexanoUrl] = useState(localStorage.getItem('nexano_payment_url') || "https://checkout.nexano.com.br/checkout/cmn3uf0tr0d6z1yrx96zexfop?offer=1VADSS5");

  useEffect(() => {
    const handleStorageChange = () => {
      setNexanoUrl(localStorage.getItem('nexano_payment_url') || "https://checkout.nexano.com.br/checkout/cmn3uf0tr0d6z1yrx96zexfop?offer=1VADSS5");
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkPremiumStatus(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) checkPremiumStatus(session.user.id);
      else setIsPremium(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkPremiumStatus = async (userId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('is_premium, nickname, avatar_url')
      .eq('id', userId)
      .single();
    
    if (data && !error) {
      setIsPremium(data.is_premium);
      setProfile({ nickname: data.nickname, avatar_url: data.avatar_url });
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
          onClose={() => setIsAdminLoggedIn(false)} 
          onSimulateMember={(email) => {
            setUser({ email });
            setIsPremium(true);
            setIsAdminLoggedIn(false);
          }}
          onBrandingUpdate={fetchBrandingSettings}
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

      {isPremium ? (
        <MemberArea 
          user={user}
          profile={profile}
          branding={brandingSettings}
          onLogout={handleLogout}
          activeTab={memberTab}
          setActiveTab={setMemberTab}
          prompts={prompts}
          categories={categories}
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
      ) : user ? (
        <WaitingForPayment onLogout={handleLogout} branding={brandingSettings} />
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
