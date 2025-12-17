import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import productService from '../../services/productService';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const product = {
        product_name: name,
        product_description: desc,
        product_price: Number(price),
        product_category: category,
        product_subcategory: subcategory,
        product_quantity: Number(quantity),
        imageFile,
      };
      const res = await adminService.addProduct(product);
      // navigate to inventory or show success
      navigate('/admin/inventory');
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getCategories();
        // backend may return { categories: [...] } or an array
        setCategories(data.categories || data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
        setCategories([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!category) {
      setSubcategories([]);
      return;
    }
    const loadSub = async () => {
      try {
        const data = await productService.getSubcategories(category);
        setSubcategories(data.subcategories || data || []);
      } catch (err) {
        console.error('Failed to load subcategories', err);
        setSubcategories([]);
      }
    };
    loadSub();
  }, [category]);

  return (
    <main className="container">
      <h2>Add Product (Super Admin)</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Product Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label>Price</label>
            <input type="number" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Quantity</label>
            <input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} required />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label>Category</label>
            <select value={category} onChange={e=>{ setCategory(e.target.value); setSubcategory(''); }}>
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Subcategory</label>
            <select value={subcategory} onChange={e=>setSubcategory(e.target.value)} disabled={!category || subcategories.length===0}>
              <option value="">Select subcategory</option>
              {subcategories.map(sc => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Image (optional)</label>
          <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files[0])} />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <div>
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Create Product'}</button>
          <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={()=>navigate('/admin/inventory')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default AddProduct;
