import type { Product } from "../types";
import { formatCurrency } from "../utils/money";

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
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesName && matchesCategory;
  });

  return (
    <section className="panel">
      <h2>📦 Catálogo de Productos</h2>

      <div className="catalog-controls" style={{ marginTop: "0.75rem" }}>
        <input
          placeholder="🔍  Buscar producto..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          autoFocus
        />
        <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "Todas las categorías" : cat}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No se encontraron productos.</p>
      ) : (
        <ul className="product-list">
          {filtered.map((product) => (
            <li key={product.id} className="product-row">
              <div>
                <strong>{product.name}</strong>
                <small>
                  {product.category} · Stock: {product.stock}
                  {product.taxable ? " · IVA" : ""}
                </small>
              </div>
              <div className="product-actions">
                <span>{formatCurrency(product.unitPrice)}</span>
                <button onClick={() => onAddProduct(product)}>+ Agregar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
