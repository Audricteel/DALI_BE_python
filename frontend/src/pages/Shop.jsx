import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services';
import { ProductGrid } from '../components';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [availableQuantities, setAvailableQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    searchParams.get('subcategory') || ''
  );

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        // Backend returns { categories: [...] }
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const loadSubcategories = async () => {
        try {
          const data = await productService.getSubcategories(selectedCategory);
          // Backend returns { subcategories: [...] }
          setSubcategories(data.subcategories || []);
        } catch (error) {
          console.error('Error loading subcategories:', error);
        }
      };
      loadSubcategories();
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.search = query;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedSubcategory) params.subcategory = selectedSubcategory;
      
      const response = await productService.getProducts(params);
      // Backend returns array of products directly
      setProducts(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory, selectedSubcategory]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchProducts, 200);
    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
    setSearchParams(params);
  }, [query, selectedCategory, selectedSubcategory, setSearchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
  };

  const handleReset = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedSubcategory('');
  };

  return (
    <div className="shop-container container">
      {/* Filter Sidebar */}
      <aside className="filter-sidebar">
        <h4>Filters</h4>
        <div className="filter-group">
          <h5>CATEGORY</h5>
          <button
            onClick={handleReset}
            className="reset-link"
            style={{
              background: 'none',
              border: 'none',
              color: '#b21984',
              textDecoration: 'none',
              display: 'block',
              marginBottom: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
            }}
          >
            All Categories
          </button>

          <ul id="category-list">
            {categories.map((cat) => (
              <li key={cat} className="category-item">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  id={`cat-${cat}`}
                  checked={selectedCategory === cat}
                  onChange={() => handleCategoryChange(cat)}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor={`cat-${cat}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 5px',
                    fontWeight: selectedCategory === cat ? 700 : 600,
                    cursor: 'pointer',
                    position: 'relative',
                    borderBottom: '1px solid #f0f0f0',
                    color: selectedCategory === cat ? '#b21984' : 'inherit',
                  }}
                >
                  {cat}
                </label>
                {/* Subcategories */}
                {selectedCategory === cat && subcategories.length > 0 && (
                  <div
                    className="subcategory-container"
                    style={{ backgroundColor: '#fafafa', padding: '5px 0 10px 25px' }}
                  >
                    <ul className="subcategory-list" style={{ listStyle: 'none', padding: 0 }}>
                      {subcategories.map((subcat) => (
                        <li key={subcat} style={{ padding: '5px 0' }}>
                          <input
                            type="radio"
                            name="subcategory"
                            value={subcat}
                            id={`subcat-${subcat}`}
                            checked={selectedSubcategory === subcat}
                            onChange={() => setSelectedSubcategory(subcat)}
                            style={{ marginRight: '8px' }}
                          />
                          <label htmlFor={`subcat-${subcat}`}>{subcat}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="product-grid-container">
        <section className="search-banner">
          <input
            type="search"
            id="search-input"
            name="query"
            className="main-search-input"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </section>

        {/* Product Grid Results */}
        <div id="product-grid-results">
          {loading ? (
            <p style={{ padding: '20px' }}>Loading products...</p>
          ) : (
            <ProductGrid products={products} availableQuantities={availableQuantities} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Shop;
