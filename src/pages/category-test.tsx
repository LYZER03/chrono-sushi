import React, { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/api/use-categories';
import type { Category } from '../types/supabase';

const CategoryTest = () => {
  const { data: categories, isLoading, isError, error, refetch } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  
  // State for new category
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    slug: '',
    parent_id: null as string | null
  });
  
  // State for editing
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    slug: '',
    parent_id: null as string | null
  });
  
  // Handle input change for new category
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value === '' && name === 'parent_id' ? null : value
    }));
  };
  
  // Handle input change for edit form
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value === '' && name === 'parent_id' ? null : value
    }));
  };
  
  // Handle create category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate slug if not provided
      const categoryData = {
        ...newCategory,
        slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Attempting to create category with data:', categoryData);
      const result = await createCategoryMutation.mutateAsync(categoryData);
      console.log('Category created successfully:', result);
      
      // Reset form
      setNewCategory({
        name: '',
        description: '',
        slug: '',
        parent_id: null
      });
      
      // Refresh categories list
      refetch();
      
    } catch (err) {
      console.error('Error creating category:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      alert(`Failed to create category: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  // Start editing a category
  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      parent_id: category.parent_id
    });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCategory(null);
  };
  
  // Save edited category
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategory) return;
    
    try {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory.id,
        data: {
          ...editForm,
          updated_at: new Date().toISOString()
        }
      });
      
      setEditingCategory(null);
      refetch();
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };
  
  // Delete category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await deleteCategoryMutation.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      
      {/* Add New Category Form */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleCreateCategory}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="slug">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={newCategory.slug}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Generated from name if empty"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="parent_id">
                Parent Category
              </label>
              <select
                id="parent_id"
                name="parent_id"
                value={newCategory.parent_id || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">None</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={createCategoryMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {createCategoryMutation.isPending ? 'Creating...' : 'Add Category'}
          </button>
        </form>
      </div>
      
      {/* Categories List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        
        {isLoading ? (
          <p>Loading categories...</p>
        ) : isError ? (
          <p className="text-red-500">Error: {error?.message || 'Failed to load categories'}</p>
        ) : !categories?.length ? (
          <p>No categories found. Add your first category above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Slug</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Parent</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id} className="border-t">
                    {editingCategory?.id === category.id ? (
                      // Edit mode
                      <>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            className="w-full p-1 border rounded"
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            name="slug"
                            value={editForm.slug}
                            onChange={handleEditChange}
                            className="w-full p-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            className="w-full p-1 border rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            name="parent_id"
                            value={editForm.parent_id || ''}
                            onChange={handleEditChange}
                            className="w-full p-1 border rounded"
                          >
                            <option value="">None</option>
                            {categories.filter(c => c.id !== category.id).map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                              disabled={updateCategoryMutation.isPending}
                            >
                              {updateCategoryMutation.isPending ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td className="px-4 py-2">{category.name}</td>
                        <td className="px-4 py-2">{category.slug}</td>
                        <td className="px-4 py-2">{category.description || '-'}</td>
                        <td className="px-4 py-2">
                          {category.parent_id 
                            ? categories.find(c => c.id === category.parent_id)?.name || '-' 
                            : '-'}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStartEdit(category)}
                              className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                              disabled={deleteCategoryMutation.isPending}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTest;
