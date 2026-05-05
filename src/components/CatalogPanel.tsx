import type { Product } from "../types";

interface CatalogPanelProps {
  products: Product[];
  searchTerm: string;
  selectedCategory: string;
  onSearchTermChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAddProduct: (product: Product) => void;
}

export function CatalogPanel({
  products,
  searchTerm,
  selectedCategory,
  onSearchTermChange,
  onCategoryChange,
  onAddProduct
}: CatalogPanelProps) {
  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const filtered = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesName && matchesCategory;
  });

  return (
    <section className="panel">
      <h2>Product Catalog</h2>
      <div className="catalog-controls">
        <input
          placeholder="Search by name"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
        />
        <select value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? <p className="empty-state">No products found for current filters.</p> : null}

      <ul className="product-list">
        {filtered.map((product) => (
          <li key={product.id} className="product-row">
            <div>
              <strong>{product.name}</strong>
              <small>
                {product.category} | Stock: {product.stock}
              </small>
            </div>
            <div className="product-actions">
              <span>${product.unitPrice.toFixed(2)}</span>
              <button onClick={() => onAddProduct(product)}>Add</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
