import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2, Save, X, Upload, Loader2 } from 'lucide-react';
import { supabase } from './supabase';

interface Category {
  id: string;
  name: string;
  is_censored?: boolean;
  audience?: 'normal' | 'plus18';
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  audience?: 'normal' | 'plus18';
  image_url?: string;
}

interface Prompt {
  id: string;
  category_id: string;
  subcategory_id: string;
  title: string;
  description: string;
  content: string;
  is_favorite: boolean;
  is_special_18: boolean;
  audience?: 'normal' | 'plus18';
  image_url: string;
  created_at: string;
}

interface UnifiedPromptManagerProps {
  categories: Category[];
  subcategories: Subcategory[];
  prompts: Prompt[];
  onAddCategory: (name: string, isCensored?: boolean, audience?: 'normal' | 'plus18') => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onAddSubcategory: (categoryId: string, name: string, audience?: 'normal' | 'plus18', imageUrl?: string) => Promise<void>;
  onDeleteSubcategory: (id: string) => Promise<void>;
  onAddPrompt: (prompt: any) => Promise<void>;
  onDeletePrompt: (id: string) => Promise<void>;
  onUpdatePrompt: (id: string, prompt: any) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
}

const UnifiedPromptManager: React.FC<UnifiedPromptManagerProps> = ({
  categories,
  subcategories,
  prompts,
  onAddCategory,
  onDeleteCategory,
  onAddSubcategory,
  onDeleteSubcategory,
  onAddPrompt,
  onDeletePrompt,
  onUpdatePrompt,
  onUploadImage
}) => {
  // State
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<{ type: string; id: string } | null>(null);
  const [editingNode, setEditingNode] = useState<{ type: string; id: string } | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIsCensored, setNewCategoryIsCensored] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryImageUrl, setNewSubcategoryImageUrl] = useState('');
  const [showNewSubcategoryForm, setShowNewSubcategoryForm] = useState(false);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState('');
  const [activeTab, setActiveTab] = useState<'normal' | 'plus18'>('normal');
  const [uploadingSubcategoryImage, setUploadingSubcategoryImage] = useState(false);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState('');
  const [editingSubcategoryImage, setEditingSubcategoryImage] = useState('');
  
  // Prompt form state
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [promptForm, setPromptForm] = useState({
    audience: 'normal' as 'normal' | 'plus18',
    categoryId: '',
    subcategoryId: '',
    title: '',
    description: '',
    content: '',
    isFavorite: false,
    imageUrl: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const normalizeAudience = (value: any, fallbackPlus18 = false): 'normal' | 'plus18' => {
    if (fallbackPlus18) return 'plus18'; const normalized = String(value || '').toLowerCase().trim();
    if (['plus18', 'plus_18', 'adult', 'nsfw', '18+', '+18', 'censored'].includes(normalized)) return 'plus18';
    if (['normal', 'safe', 'default', 'all-ages', 'all_ages'].includes(normalized)) return 'normal';
    return fallbackPlus18 ? 'plus18' : 'normal';
  };

  const isCategoryPlus18 = (category: Category) => {
    return normalizeAudience(category.audience, !!category.is_censored) === 'plus18';
  };

  const getPromptAudience = (prompt: Prompt): 'normal' | 'plus18' => {
    return normalizeAudience(prompt.audience, !!prompt.is_special_18);
  };

  // Toggle expand/collapse
  const toggleCategory = (catId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(catId)) {
      newExpanded.delete(catId);
    } else {
      newExpanded.add(catId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubcategory = (subId: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subId)) {
      newExpanded.delete(subId);
    } else {
      newExpanded.add(subId);
    }
    setExpandedSubcategories(newExpanded);
  };

  // Handle category operations
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const isPlus18 = activeTab === 'plus18';
      await onAddCategory(newCategoryName, isPlus18, isPlus18 ? 'plus18' : 'normal');
      setNewCategoryName('');
      setNewCategoryIsCensored(false);
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await onDeleteCategory(id);
      } catch (error) {
        console.error('Erro ao deletar categoria:', error);
      }
    }
  };

  // Handle subcategory operations
  const handleAddSubcategory = async () => {
    if (!selectedCategoryForSubcategory || !newSubcategoryName.trim()) return;
    try {
      const selectedCategory = categories.find(cat => cat.id === selectedCategoryForSubcategory);
      const audience = selectedCategory && isCategoryPlus18(selectedCategory) ? 'plus18' : 'normal';
      await onAddSubcategory(selectedCategoryForSubcategory, newSubcategoryName, audience, newSubcategoryImageUrl.trim() || undefined);
      setNewSubcategoryName('');
      setNewSubcategoryImageUrl('');
      setSelectedCategoryForSubcategory('');
      setShowNewSubcategoryForm(false);
    } catch (error) {
      console.error('Erro ao adicionar subcategoria:', error);
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta subcategoria?')) {
      try {
        await onDeleteSubcategory(id);
      } catch (error) {
        console.error('Erro ao deletar subcategoria:', error);
      }
    }
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategoryId(subcategory.id);
    setEditingSubcategoryName(subcategory.name);
    setEditingSubcategoryImage(subcategory.image_url || '');
  };

  const handleSaveSubcategory = async () => {
    if (!editingSubcategoryId || !editingSubcategoryName.trim()) return;
    try {
      // Update the subcategory in the database
      const { error } = await supabase
        .from('subcategories')
        .update({
          name: editingSubcategoryName.trim(),
          image_url: editingSubcategoryImage.trim() || null
        })
        .eq('id', editingSubcategoryId);

      if (error) {
        console.error('Erro ao atualizar subcategoria:', error);
        alert('Erro ao atualizar subcategoria: ' + error.message);
      } else {
        setEditingSubcategoryId(null);
        setEditingSubcategoryName('');
        setEditingSubcategoryImage('');
        // Trigger refresh
        if (onAddSubcategory) {
          // Call any callback to refresh if available
        }
      }
    } catch (error) {
      console.error('Erro ao salvar subcategoria:', error);
      alert('Erro ao salvar subcategoria');
    }
  };

  const handleCancelEditSubcategory = () => {
    setEditingSubcategoryId(null);
    setEditingSubcategoryName('');
    setEditingSubcategoryImage('');
  };

  const handleSubcategoryImageEditUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('A imagem é muito grande. Por favor, escolha uma imagem com menos de 2MB.');
      return;
    }

    setUploadingSubcategoryImage(true);
    try {
      const publicUrl = await onUploadImage(file);
      setEditingSubcategoryImage(publicUrl);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao fazer upload da imagem. Por favor, tente novamente.');
    } finally {
      setUploadingSubcategoryImage(false);
    }
  };

  // Handle prompt operations
  const handleShowPromptForm = (categoryId: string, subcategoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    const audience = selectedCategory && isCategoryPlus18(selectedCategory) ? 'plus18' : 'normal';
    setPromptForm({
      audience,
      categoryId,
      subcategoryId,
      title: '',
      description: '',
      content: '',
      isFavorite: false,
      imageUrl: ''
    });
    setSelectedPrompt(null);
    setShowPromptForm(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setPromptForm({
      audience: getPromptAudience(prompt),
      categoryId: prompt.category_id,
      subcategoryId: prompt.subcategory_id,
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      isFavorite: prompt.is_favorite,
      imageUrl: prompt.image_url
    });
    setSelectedPrompt(prompt);
    setShowPromptForm(true);
  };

  const handleSavePrompt = async () => {
    if (!promptForm.categoryId || !promptForm.subcategoryId || !promptForm.title || !promptForm.content) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    try {
      if (selectedPrompt) {
        await onUpdatePrompt(selectedPrompt.id, {
          ...promptForm,
          isSpecial18: promptForm.audience === 'plus18'
        });
      } else {
        await onAddPrompt({
          ...promptForm,
          isSpecial18: promptForm.audience === 'plus18'
        });
      }
      setShowPromptForm(false);
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este prompt?')) {
      try {
        await onDeletePrompt(id);
      } catch (error) {
        console.error('Erro ao deletar prompt:', error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('A imagem é muito grande. Por favor, escolha uma imagem com menos de 2MB.');
      return;
    }

    setUploadingImage(true);
    try {
      const publicUrl = await onUploadImage(file);
      setPromptForm(prev => ({ ...prev, imageUrl: publicUrl }));
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao fazer upload da imagem. Por favor, tente novamente.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubcategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('A imagem é muito grande. Por favor, escolha uma imagem com menos de 2MB.');
      return;
    }

    setUploadingSubcategoryImage(true);
    try {
      const publicUrl = await onUploadImage(file);
      setNewSubcategoryImageUrl(publicUrl);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem da subcategoria:', error);
      alert('Erro ao fazer upload da imagem. Por favor, tente novamente.');
    } finally {
      setUploadingSubcategoryImage(false);
    }
  };

  // Get subcategories for a category
  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(s => s.category_id === categoryId);
  };

  // Get prompts for a subcategory
  const getPromptsForSubcategory = (subcategoryId: string) => {
    return prompts
      .filter(p => p.subcategory_id === subcategoryId)
      .sort((a, b) => {
        if (!!a.image_url === !!b.image_url) return 0;
        return a.image_url ? -1 : 1;
      });
  };

  // Get orphaned prompts (prompts without subcategory_id)
  const getOrphanedPrompts = () => {
    return prompts
      .filter(p => !p.subcategory_id || p.subcategory_id === '')
      .sort((a, b) => {
        if (!!a.image_url === !!b.image_url) return 0;
        return a.image_url ? -1 : 1;
      });
  };

  // Get filtered categories by tab
  const getFilteredCategories = () => {
    return categories.filter(cat => {
      const isPlus18 = isCategoryPlus18(cat);
      return activeTab === 'plus18' ? isPlus18 : !isPlus18;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Tree View - Left Panel */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Hierarquia</h3>
          </div>

          {/* Tabs for Safe/Censored */}
          <div className="flex gap-2 mb-4 border-b border-zinc-700">
            <button
              onClick={() => setActiveTab('normal')}
              className={`px-4 py-2 font-semibold text-sm transition-all ${
                activeTab === 'normal'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🔓 Conteúdo Normal
            </button>
            <button
              onClick={() => setActiveTab('plus18')}
              className={`px-4 py-2 font-semibold text-sm transition-all ${
                activeTab === 'plus18'
                  ? 'text-red-400 border-b-2 border-red-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🔒 Conteúdo +18
            </button>
          </div>

          {/* Add Category */}
          <div className="mb-6 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nova categoria..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
              />
              <button
                onClick={handleAddCategory}
                className="px-3 py-2 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-600 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={newCategoryIsCensored}
                onChange={(e) => setNewCategoryIsCensored(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className={`text-sm ${newCategoryIsCensored ? 'text-red-400' : 'text-gray-400'}`}>
                Compatibilidade legada (is_censored)
              </span>
            </label>
          </div>

          {/* Tree of Categories and Subcategories */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {getFilteredCategories().map(category => (
              <div key={category.id}>
                {/* Category Node */}
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all group ${
                    selectedNode?.type === 'category' && selectedNode?.id === category.id
                      ? 'bg-orange-500/20 border border-orange-500'
                      : 'hover:bg-zinc-800'
                  }`}
                  onClick={() => {
                    setSelectedNode({ type: 'category', id: category.id });
                    toggleCategory(category.id);
                  }}
                >
                  {getSubcategoriesForCategory(category.id).length > 0 ? (
                    expandedCategories.has(category.id) ? (
                      <ChevronDown className="w-4 h-4 text-orange-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                  <span className="flex-1 text-white font-medium text-sm flex items-center gap-2">
                    {category.name}
                    {category.is_censored && <span className="text-red-400 text-xs font-bold">[CENSURADO]</span>}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Subcategories */}
                {expandedCategories.has(category.id) && (
                  <div className="ml-6 space-y-2">
                    {getSubcategoriesForCategory(category.id).map(subcategory => (
                      <div key={subcategory.id}>
                        {/* Subcategory Node */}
                        <div
                          className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all group ${
                            selectedNode?.type === 'subcategory' && selectedNode?.id === subcategory.id
                              ? 'bg-blue-500/20 border border-blue-500'
                              : 'hover:bg-zinc-800'
                          }`}
                          onClick={() => {
                            setSelectedNode({ type: 'subcategory', id: subcategory.id });
                            toggleSubcategory(subcategory.id);
                          }}
                        >
                          {getPromptsForSubcategory(subcategory.id).length > 0 ? (
                            expandedSubcategories.has(subcategory.id) ? (
                              <ChevronDown className="w-4 h-4 text-blue-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-500" />
                            )
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                           <span className="flex-1 text-white font-medium text-sm flex items-center gap-2">
                             {subcategory.image_url ? (
                               <img
                                 src={subcategory.image_url}
                                 alt={subcategory.name}
                                 className="w-6 h-6 rounded-md object-cover border border-zinc-700"
                                 referrerPolicy="no-referrer"
                               />
                             ) : (
                               <span className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700" />
                             )}
                             {subcategory.name}
                           </span>
                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleEditSubcategory(subcategory);
                               }}
                               className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-all"
                               title="Editar subcategoria"
                             >
                               <Edit2 className="w-3.5 h-3.5" />
                             </button>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleDeleteSubcategory(subcategory.id);
                               }}
                               className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                               title="Deletar subcategoria"
                             >
                               <Trash2 className="w-3.5 h-3.5" />
                             </button>
                           </div>
                        </div>

                        {/* Prompts in Subcategory */}
                        {expandedSubcategories.has(subcategory.id) && (
                          <div className="ml-6 space-y-1">
                            {getPromptsForSubcategory(subcategory.id).map(prompt => (
                               <div
                                 key={prompt.id}
                                 className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group text-xs ${
                                   selectedPrompt?.id === prompt.id
                                     ? 'bg-green-500/20 border border-green-500'
                                     : 'hover:bg-zinc-800'
                                 } ${getPromptAudience(prompt) === 'plus18' ? 'border border-red-500/30' : ''}`}
                                  onClick={() => handleEditPrompt(prompt)}
                                >
                                <div className="w-3 h-3 flex items-center justify-center">
                                  {getPromptAudience(prompt) === 'plus18' ? <span className="text-red-500 text-[10px] font-bold">🔞</span> : ''}
                                </div>
                                <span className="flex-1 text-gray-300 truncate">{prompt.title}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePrompt(prompt.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                                >
                                  <Trash2 className="w-2 h-2" />
                                </button>
                              </div>
                            ))}
                            
                            {/* Add Prompt Button */}
                            <button
                              onClick={() => handleShowPromptForm(category.id, subcategory.id)}
                              className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-orange-500 hover:bg-orange-500/10 transition-all"
                            >
                              <Plus className="w-3 h-3" /> Novo Prompt
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add Subcategory Button */}
                    <button
                      onClick={() => {
                        setSelectedCategoryForSubcategory(category.id);
                        setShowNewSubcategoryForm(true);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-blue-500 hover:bg-blue-500/10 transition-all ml-2"
                    >
                      <Plus className="w-3 h-3" /> Nova Subcategoria
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Orphaned Prompts Section */}
            {getOrphanedPrompts().length > 0 && (
              <div className="mt-6 pt-6 border-t border-zinc-700">
                <div className="px-3 py-2 mb-2 bg-red-500/10 border border-red-500 rounded-lg">
                  <h4 className="text-xs font-bold text-red-500 uppercase">⚠️ Prompts sem Categoria</h4>
                  <p className="text-[10px] text-red-400 mt-1">Estes prompts precisam ser atribuídos a uma subcategoria</p>
                </div>
                <div className="space-y-2">
                  {getOrphanedPrompts().map(prompt => (
                    <div
                      key={prompt.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group text-xs ${
                        selectedPrompt?.id === prompt.id
                          ? 'bg-red-500/20 border border-red-500'
                          : 'hover:bg-zinc-800 bg-red-500/5 border border-red-500/20'
                      }`}
                      onClick={() => handleEditPrompt(prompt)}
                    >
                      <div className="w-3 h-3 text-red-500">⚠️</div>
                      <span className="flex-1 text-gray-300 truncate">{prompt.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePrompt(prompt.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="w-2 h-2" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

       {/* Right Panel - Form */}
       <div className="flex-1 min-w-0">
         {showPromptForm ? (
            // Prompt Form
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-4 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">
                      {selectedPrompt ? 'Editar Prompt' : 'Novo Prompt'}
                    </h3>
                    {selectedPrompt && getPromptAudience(selectedPrompt) === 'plus18' && (
                      <span className="px-2 py-1 bg-red-500/20 border border-red-500 rounded text-red-400 text-xs font-bold">
                        🔞 CONTEÚDO +18
                      </span>
                    )}
                  </div>
                  {selectedPrompt && (!selectedPrompt.subcategory_id || selectedPrompt.subcategory_id === '') && (
                    <p className="text-xs text-red-400 mt-2">⚠️ Este prompt não tem uma subcategoria atribuída. Atribua uma abaixo.</p>
                  )}
                </div>
                <button
                  onClick={() => setShowPromptForm(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            <div className="space-y-4">
              <div className="bg-black/40 border border-zinc-700 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-bold text-gray-300">Tipo do Prompt (primeiro passo)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPromptForm({ ...promptForm, audience: 'normal', categoryId: '', subcategoryId: '' })}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      promptForm.audience === 'normal'
                        ? 'bg-green-500/20 border border-green-500 text-green-300'
                        : 'bg-zinc-800 border border-zinc-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    🔓 Prompt Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromptForm({ ...promptForm, audience: 'plus18', categoryId: '', subcategoryId: '' })}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      promptForm.audience === 'plus18'
                        ? 'bg-red-500/20 border border-red-500 text-red-300'
                        : 'bg-zinc-800 border border-zinc-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    🔞 Prompt +18
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={promptForm.categoryId}
                  onChange={(e) => {
                    const selectedCategory = categories.find(cat => cat.id === e.target.value);
                    const audience = selectedCategory && isCategoryPlus18(selectedCategory) ? 'plus18' : 'normal';
                    setPromptForm({ ...promptForm, audience, categoryId: e.target.value, subcategoryId: '' });
                  }}
                  className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                >
                  <option value="">Categoria</option>
                  {categories
                    .filter(cat => {
                      const isPlus18 = isCategoryPlus18(cat);
                      return promptForm.audience === 'plus18' ? isPlus18 : !isPlus18;
                    })
                    .map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                <select
                  value={promptForm.subcategoryId}
                  onChange={(e) => setPromptForm({ ...promptForm, subcategoryId: e.target.value })}
                  className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                >
                  <option value="">Subcategoria</option>
                  {subcategories
                    .filter(s => s.category_id === promptForm.categoryId)
                    .map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>
              </div>

              {/* Category Management */}
              <div className="bg-black/40 border border-zinc-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-300">Gerenciar Categorias</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nova categoria..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="px-3 py-2 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-600 transition-all text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories
                      .filter(cat => {
                        const isPlus18 = isCategoryPlus18(cat);
                        return promptForm.audience === 'plus18' ? isPlus18 : !isPlus18;
                      })
                      .map(cat => (
                      <div
                        key={cat.id}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          promptForm.categoryId === cat.id
                            ? 'bg-orange-500/30 border border-orange-500 text-orange-300'
                            : 'bg-zinc-800 border border-zinc-700 text-gray-400 hover:border-orange-500'
                        }`}
                        onClick={() => setPromptForm({ ...promptForm, categoryId: cat.id, subcategoryId: '' })}
                      >
                        {cat.name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(cat.id);
                          }}
                          className="opacity-0 hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subcategory Management */}
              {promptForm.categoryId && (
                <div className="bg-black/40 border border-zinc-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-300">Subcategorias de "{categories.find(c => c.id === promptForm.categoryId)?.name}"</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nova subcategoria..."
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                      />
                      <input
                        type="text"
                        placeholder="URL da imagem da subcategoria"
                        value={newSubcategoryImageUrl}
                        onChange={(e) => setNewSubcategoryImageUrl(e.target.value)}
                        className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                      />
                      <button
                        onClick={async () => {
                          if (newSubcategoryName.trim() && promptForm.categoryId) {
                            await onAddSubcategory(promptForm.categoryId, newSubcategoryName, promptForm.audience, newSubcategoryImageUrl.trim() || undefined);
                            setNewSubcategoryName('');
                            setNewSubcategoryImageUrl('');
                          }
                        }}
                        className="px-3 py-2 bg-blue-500 text-black font-bold rounded-lg hover:bg-blue-600 transition-all text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subcategories
                        .filter(s => s.category_id === promptForm.categoryId)
                        .map(sub => (
                          <div
                            key={sub.id}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              promptForm.subcategoryId === sub.id
                                ? 'bg-blue-500/30 border border-blue-500 text-blue-300'
                                : 'bg-zinc-800 border border-zinc-700 text-gray-400 hover:border-blue-500'
                            }`}
                            onClick={() => setPromptForm({ ...promptForm, subcategoryId: sub.id })}
                          >
                            {sub.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubcategory(sub.id);
                              }}
                              className="opacity-0 hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                            >
                              <X className="w-2 h-2" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              <input
                type="text"
                placeholder="Título do Prompt"
                value={promptForm.title}
                onChange={(e) => setPromptForm({ ...promptForm, title: e.target.value })}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Descrição Curta"
                value={promptForm.description}
                onChange={(e) => setPromptForm({ ...promptForm, description: e.target.value })}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
              />

               <textarea
                 placeholder="Conteúdo do Prompt"
                 value={promptForm.content}
                 onChange={(e) => setPromptForm({ ...promptForm, content: e.target.value })}
                 className="w-full h-48 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 resize-none"
               />

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Imagem do Prompt (opcional) - Proporção 1:1 (Quadrado)</label>
                  <input
                    type="text"
                    placeholder="URL da imagem (opcional)"
                    value={promptForm.imageUrl}
                    onChange={(e) => setPromptForm({ ...promptForm, imageUrl: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                  />
                  {promptForm.imageUrl && (
                    <div className="relative w-full aspect-square bg-black rounded-xl border border-zinc-800 overflow-hidden">
                      <img 
                        src={promptForm.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => setPromptForm({ ...promptForm, imageUrl: '' })}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                 <div className="flex gap-2">
                   <input
                     type="file"
                     accept="image/*"
                     onChange={handleImageUpload}
                     disabled={uploadingImage}
                     className="hidden"
                     id="prompt-image-upload"
                   />
                   <label
                     htmlFor="prompt-image-upload"
                     className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-xl border border-zinc-700 cursor-pointer hover:border-orange-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {uploadingImage ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin" />
                         Enviando...
                       </>
                     ) : (
                       <>
                         <Upload className="w-4 h-4" />
                         Escolher Imagem
                       </>
                     )}
                   </label>
                 </div>
               </div>

               <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promptForm.isFavorite}
                    onChange={(e) => setPromptForm({ ...promptForm, isFavorite: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm">Favorito</span>
                </label>

                <span className={`px-3 py-2 rounded-lg border text-sm font-bold ${
                  promptForm.audience === 'plus18'
                    ? 'bg-red-500/20 border-red-500 text-red-300'
                    : 'bg-green-500/20 border-green-500 text-green-300'
                }`}>
                  {promptForm.audience === 'plus18' ? '🔞 Tipo: +18' : '🔓 Tipo: Normal'}
                </span>
              </div>

               <button
                 onClick={handleSavePrompt}
                 className="w-full py-4 bg-orange-500 text-black font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
               >
                 <Save className="w-5 h-5" />
                 {selectedPrompt ? 'Atualizar' : 'Criar'} Prompt
               </button>
             </div>
           </div>
         ) : editingSubcategoryId ? (
           // Edit Subcategory Form
           <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white">Editar Subcategoria</h3>
               <button
                 onClick={handleCancelEditSubcategory}
                 className="text-gray-500 hover:text-white"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="text-sm text-gray-400 block mb-2">Nome da Subcategoria</label>
                 <input
                   type="text"
                   value={editingSubcategoryName}
                   onChange={(e) => setEditingSubcategoryName(e.target.value)}
                   className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-sm text-gray-400">Imagem da Subcategoria (opcional) - Proporção 4:3</label>
                 <input
                   type="text"
                   placeholder="URL da Imagem"
                   value={editingSubcategoryImage}
                   onChange={(e) => setEditingSubcategoryImage(e.target.value)}
                   className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                 />
                 {editingSubcategoryImage && (
                   <div className="w-full aspect-video rounded-xl border border-zinc-800 overflow-hidden bg-black">
                     <img
                       src={editingSubcategoryImage}
                       alt="Preview"
                       className="w-full h-full object-cover"
                       referrerPolicy="no-referrer"
                     />
                   </div>
                 )}
                 <div className="flex gap-2">
                   <input
                     type="file"
                     accept="image/*"
                     onChange={handleSubcategoryImageEditUpload}
                     disabled={uploadingSubcategoryImage}
                     className="hidden"
                     id="subcategory-edit-image-upload"
                   />
                   <label
                     htmlFor="subcategory-edit-image-upload"
                     className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-xl border border-zinc-700 cursor-pointer hover:border-orange-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {uploadingSubcategoryImage ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin" />
                         Enviando...
                       </>
                     ) : (
                       <>
                         <Upload className="w-4 h-4" />
                         Escolher Imagem
                       </>
                     )}
                   </label>
                   {editingSubcategoryImage && (
                     <button
                       onClick={() => setEditingSubcategoryImage('')}
                       className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
                     >
                       <X className="w-4 h-4" />
                     </button>
                   )}
                 </div>
               </div>

               <div className="flex gap-3 pt-4">
                 <button
                   onClick={handleSaveSubcategory}
                   className="flex-1 py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                 >
                   <Save className="w-4 h-4" />
                   Salvar Subcategoria
                 </button>
                 <button
                   onClick={handleCancelEditSubcategory}
                   className="flex-1 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all"
                 >
                   Cancelar
                 </button>
               </div>
             </div>
           </div>
         ) : showNewSubcategoryForm ? (
           // New Subcategory Form
           <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
             <h3 className="text-xl font-bold text-white mb-6">Nova Subcategoria</h3>
             <div className="space-y-4">
               <input
                 type="text"
                 placeholder="Nome da Subcategoria"
                 value={newSubcategoryName}
                 onChange={(e) => setNewSubcategoryName(e.target.value)}
                 className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
               />
               <div className="space-y-2">
                 <label className="text-sm text-gray-400">Imagem da Subcategoria (opcional) - Proporção 4:3</label>
                 <input
                   type="text"
                   placeholder="URL da Imagem da Subcategoria (opcional)"
                   value={newSubcategoryImageUrl}
                   onChange={(e) => setNewSubcategoryImageUrl(e.target.value)}
                   className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                 />
                 {newSubcategoryImageUrl && (
                   <div className="w-full aspect-video rounded-xl border border-zinc-800 overflow-hidden bg-black">
                     <img
                       src={newSubcategoryImageUrl}
                       alt="Preview da subcategoria"
                       className="w-full h-full object-cover"
                       referrerPolicy="no-referrer"
                     />
                   </div>
                 )}
                 <div className="flex gap-2">
                   <input
                     type="file"
                     accept="image/*"
                     onChange={handleSubcategoryImageUpload}
                     disabled={uploadingSubcategoryImage}
                     className="hidden"
                     id="subcategory-image-upload"
                   />
                   <label
                     htmlFor="subcategory-image-upload"
                     className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-xl border border-zinc-700 cursor-pointer hover:border-orange-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {uploadingSubcategoryImage ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin" />
                         Enviando...
                       </>
                     ) : (
                       <>
                         <Upload className="w-4 h-4" />
                         Escolher Imagem
                       </>
                     )}
                   </label>
                   {newSubcategoryImageUrl && (
                     <button
                       onClick={() => setNewSubcategoryImageUrl('')}
                       className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
                     >
                       <X className="w-4 h-4" />
                     </button>
                   )}
                 </div>
               </div>
               <div className="flex gap-3">
                 <button
                   onClick={handleAddSubcategory}
                   className="flex-1 py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 transition-all"
                 >
                   Criar Subcategoria
                 </button>
                 <button
                   onClick={() => setShowNewSubcategoryForm(false)}
                   className="flex-1 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all"
                 >
                   Cancelar
                 </button>
               </div>
             </div>
           </div>
        ) : (
          // Empty State
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12 flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Selecione uma categoria, subcategoria ou prompt para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedPromptManager;
