import React, { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/api/use-products';
import { useCategories } from '../hooks/api/use-categories';
import type { Product } from '../types/supabase';

const ProductTest = () => {
  const { data: products, isLoading, isError, error, refetch } = useProducts();
  const { data: categories } = useCategories();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  
  // State for new product
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    slug: '',
    category_id: '',
    image_url: '',
    is_available: true
  });
  
  // State for editing
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    slug: '',
    category_id: '',
    image_url: '',
    is_available: true
  });
  
  // Handle input change for new product
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setNewProduct(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (name === 'price') {
      // Allow only numbers and a single decimal point
      const priceRegex = /^(\d*\.?\d{0,2})?$/;
      if (priceRegex.test(value)) {
        setNewProduct(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle input change for edit form
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setEditForm(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (name === 'price') {
      // Allow only numbers and a single decimal point
      const priceRegex = /^(\d*\.?\d{0,2})?$/;
      if (priceRegex.test(value)) {
        setEditForm(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle create product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate slug if not provided
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0,
        slug: newProduct.slug || newProduct.title.toLowerCase().replace(/\s+/g, '-'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await createProductMutation.mutateAsync(productData);
      
      // Reset form
      setNewProduct({
        title: '',
        description: '',
        price: '',
        slug: '',
        category_id: '',
        image_url: '',
        is_available: true
      });
      
      // Refresh products list
      refetch();
      
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };
  
  // Start editing a product
  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      slug: product.slug,
      category_id: product.category_id || '',
      image_url: typeof product.image_url === 'string' ? product.image_url : '',
      is_available: product.is_available
    });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };
  
  // Save edited product
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct) return;
    
    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        data: {
          ...editForm,
          price: parseFloat(editForm.price),
          updated_at: new Date().toISOString()
        }
      });
      
      setEditingProduct(null);
      refetch();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };
  
  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProductMutation.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      
      {/* Add New Product Form */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleCreateProduct}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="title">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newProduct.title}
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
                value={newProduct.slug}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Generated from title if empty"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="price">
                Price *
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="0.00"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="category_id">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={newProduct.category_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a category</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="image_url">
                Image URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={newProduct.image_url}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_available"
                name="is_available"
                checked={newProduct.is_available}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="is_available">Available for sale</label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={createProductMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {createProductMutation.isPending ? 'Creating...' : 'Add Product'}
          </button>
        </form>
      </div>
      
      {/* Products List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        
        {isLoading ? (
          <p>Loading products...</p>
        ) : isError ? (
          <p className="text-red-500">Error: {error?.message || 'Failed to load products'}</p>
        ) : !products?.length ? (
          <p>No products found. Add your first product above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Available</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-t">
                    {editingProduct?.id === product.id ? (
                      // Edit mode
                      <>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            className="w-full p-1 border rounded"
                            required
                          />
                          <input
                            type="text"
                            name="slug"
                            value={editForm.slug}
                            onChange={handleEditChange}
                            className="w-full p-1 border rounded mt-1 text-xs"
                            placeholder="Slug"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            name="price"
                            value={editForm.price}
                            onChange={handleEditChange}
                            className="w-full p-1 border rounded"
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            name="category_id"
                            value={editForm.category_id}
                            onChange={handleEditChange}
                            className="w-full p-1 border rounded"
                            required
                          >
                            {categories?.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            name="is_available"
                            checked={editForm.is_available}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                              disabled={updateProductMutation.isPending}
                            >
                              {updateProductMutation.isPending ? 'Saving...' : 'Save'}
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
                        <td className="px-4 py-2">
                          <div>{product.title}</div>
                          <div className="text-xs text-gray-500">{product.slug}</div>
                        </td>
                        <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          {categories?.find(c => c.id === product.category_id)?.name || '-'}
                        </td>
                        <td className="px-4 py-2">
                          {product.is_available ? (
                            <span className="text-green-500">Yes</span>
                          ) : (
                            <span className="text-red-500">No</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                              disabled={deleteProductMutation.isPending}
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

export default ProductTest;
