import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, Tag, Folder, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Note } from '../../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id' | 'noteId' | 'createdAt' | 'updatedAt'>) => void;
  note?: Note;
  viewMode?: boolean;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, note, viewMode = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('general');
  const [isPreview, setIsPreview] = useState(viewMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setCategory(note.category);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
      setCategory('general');
    }
    setIsPreview(viewMode);
  }, [note, isOpen, viewMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    const noteData = {
      title,
      content,
      tags,
      category,
    };

    try {
      onSave({
        ...noteData, owner: 'current-user',
        _id: ''
      });
      onClose();
    } catch (err: any) {
      console.error('Failed to save note:', err);
      setError(err.message || 'Failed to save note. Please try again.');
      // Keep modal open so user can try again
    } finally {
      setSaving(false);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] sm:h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-base sm:text-xl font-semibold text-gray-900">
              {viewMode ? 'View Note' : note ? 'Edit Note' : 'Create New Note'}
            </h2>
            {!viewMode && (
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                {isPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {viewMode || (!viewMode && isPreview) ? (
            /* Preview Mode */
            <div className="flex-1 overflow-auto p-3 sm:p-6">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-6">{title}</h1>
              
              {tags.length > 0 && (
                <div className="flex items-center space-x-2 mb-3 sm:mb-6">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="prose prose-sm sm:prose-lg max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              {/* Title and Meta */}
              <div className="p-3 sm:p-6 border-b border-gray-200">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-bold text-gray-900 border-none outline-none bg-transparent placeholder-gray-400"
                    placeholder="Note title..."
                    required
                  />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    {/* Category */}
                    <div className="flex items-center space-x-2">
                      <Folder className="w-4 h-4 text-gray-400" />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="general">General</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="brainstorm">Brainstorm</option>
                        <option value="meeting">Meeting</option>
                      </select>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center space-x-2 flex-1">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                        className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add tags (press Enter)"
                      />
                    </div>
                  </div>

                  {/* Display Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div className="flex-1 overflow-hidden">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full p-3 sm:p-6 border-none outline-none resize-none font-mono text-xs sm:text-sm leading-relaxed"
                  placeholder="Start writing your note... (Markdown supported)"
                  required
                />
              </div>

              {/* Actions */}
              <div className="p-3 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="text-xs sm:text-sm text-gray-500">
                  Tip: Use Markdown for formatting (# Headers, **bold**, *italic*, etc.)
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {error && (
                    <div className="text-red-500 text-sm mr-4">
                      {error}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center space-x-2"
                  >
                    {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : (note ? 'Update Note' : 'Save Note')}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteModal;