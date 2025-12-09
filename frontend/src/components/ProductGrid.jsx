import ProductCard from './ProductCard';

const ProductGrid = ({ products, availableQuantities = {} }) => {
  if (!products || products.length === 0) {
    return (
      <div className="product-grid">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          availableToAdd={availableQuantities[product.product_id]}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
