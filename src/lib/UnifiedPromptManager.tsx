import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2, Save, X, Upload, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
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
  image_url: string;
  created_at: string;
}

interface UnifiedPromptManagerProps {
  categories: Category[];
  subcategories: Subcategory[];
  prompts: Prompt[];
  onAddCategory: (name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onAddSubcategory: (categoryId: string, name: string) => Promise<void>;
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
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [showNewSubcategoryForm, setShowNewSubcategoryForm] = useState(false);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState('');
  
  // Prompt form state
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [promptForm, setPromptForm] = useState({
    categoryId: '',
    subcategoryId: '',
    title: '',
    description: '',
    content: '',
    isFavorite: false,
    isSpecial18: false,
    imageUrl: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

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
      await onAddCategory(newCategoryName);
      setNewCategoryName('');
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
      await onAddSubcategory(selectedCategoryForSubcategory, newSubcategoryName);
      setNewSubcategoryName('');
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

  // Handle prompt operations
  const handleShowPromptForm = (categoryId: string, subcategoryId: string) => {
    setPromptForm({
      categoryId,
      subcategoryId,
      title: '',
      description: '',
      content: '',
      isFavorite: false,
      isSpecial18: false,
      imageUrl: ''
    });
    setSelectedPrompt(null);
    setShowPromptForm(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setPromptForm({
      categoryId: prompt.category_id,
      subcategoryId: prompt.subcategory_id,
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      isFavorite: prompt.is_favorite,
      isSpecial18: prompt.is_special_18,
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
        await onUpdatePrompt(selectedPrompt.id, promptForm);
      } else {
        await onAddPrompt(promptForm);
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

  // Get subcategories for a category
  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(s => s.category_id === categoryId);
  };

  // Get prompts for a subcategory
  const getPromptsForSubcategory = (subcategoryId: string) => {
    return prompts.filter(p => p.subcategory_id === subcategoryId);
  };

  // Get orphaned prompts (prompts without subcategory_id)
  const getOrphanedPrompts = () => {
    return prompts.filter(p => !p.subcategory_id || p.subcategory_id === '');
  };

  return (
    <div className="flex gap-8">
      {/* Tree View - Left Panel */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Hierarquia</h3>
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
          </div>

          {/* Tree of Categories and Subcategories */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {categories.map(category => (
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
                  <span className="flex-1 text-white font-medium text-sm">{category.name}</span>
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
                          <span className="flex-1 text-white font-medium text-sm">{subcategory.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubcategory(subcategory.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
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
                                }`}
                                onClick={() => setSelectedPrompt(prompt)}
                              >
                                <div className="w-3 h-3" />
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
                      onClick={() => setSelectedPrompt(prompt)}
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
      <div className="flex-1">
        {showPromptForm ? (
           // Prompt Form
           <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
             <div className="flex justify-between items-center mb-6">
               <div>
                 <h3 className="text-xl font-bold text-white">
                   {selectedPrompt ? 'Editar Prompt' : 'Novo Prompt'}
                 </h3>
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
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={promptForm.categoryId}
                  onChange={(e) => setPromptForm({ ...promptForm, categoryId: e.target.value, subcategoryId: '' })}
                  className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-orange-500"
                >
                  <option value="">Categoria</option>
                  {categories.map(cat => (
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
                 <label className="text-sm text-gray-400">Imagem do Prompt (opcional)</label>
                 {promptForm.imageUrl && (
                   <div className="relative w-full h-40 bg-black rounded-xl border border-zinc-800 overflow-hidden">
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

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promptForm.isSpecial18}
                    onChange={(e) => setPromptForm({ ...promptForm, isSpecial18: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm">Conteúdo +18</span>
                </label>
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
