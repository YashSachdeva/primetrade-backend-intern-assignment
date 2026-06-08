import { FormEvent, useEffect, useMemo, useState } from "react";
import { Boxes, Lock, LogOut, Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { apiRequest, Product, User } from "./api";

type AuthResponse = {
  user: User;
  token: string;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  stock: string;
};

const emptyProduct: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: ""
};

export function App() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@primetrade.ai");
  const [password, setPassword] = useState("Admin@12345");
  const [token, setToken] = useState(() => localStorage.getItem("token") ?? "");
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const totalStock = useMemo(
    () => products.reduce((total, product) => total + product.stock, 0),
    [products]
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    apiRequest<{ user: User }>("/auth/me", { token })
      .then((response) => setUser(response.user))
      .then(() => loadProducts(token))
      .catch(() => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
      });
  }, [token]);

  async function loadProducts(authToken = token) {
    const response = await apiRequest<{ products: Product[] }>("/products", { token: authToken });
    setProducts(response.products);
  }

  async function handleAuth(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login" ? { email, password } : { name, email, password };
      const response = await apiRequest<AuthResponse>(path, { method: "POST", body });

      setToken(response.token);
      setUser(response.user);
      localStorage.setItem("token", response.token);
      await loadProducts(response.token);
      setMessage(`${mode === "login" ? "Logged in" : "Registered"} successfully`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveProduct(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    try {
      await apiRequest<{ product: Product }>(editingProductId ? `/products/${editingProductId}` : "/products", {
        method: editingProductId ? "PATCH" : "POST",
        token,
        body: {
          name: productForm.name,
          description: productForm.description,
          price: Number(productForm.price),
          stock: Number(productForm.stock)
        }
      });
      setProductForm(emptyProduct);
      setEditingProductId(null);
      await loadProducts();
      setMessage(editingProductId ? "Product updated successfully" : "Product created successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save product");
    }
  }

  function startEditingProduct(product: Product) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: String(product.stock)
    });
  }

  function cancelEditingProduct() {
    setEditingProductId(null);
    setProductForm(emptyProduct);
  }

  async function handleDeleteProduct(productId: string) {
    setMessage("");

    try {
      await apiRequest(`/products/${productId}`, { method: "DELETE", token });
      await loadProducts();
      setMessage("Product deleted successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete product");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setProducts([]);
    setMessage("Logged out");
  }

  return (
    <main className="shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Primetrade.ai assignment</p>
          <h1>Secure API Console</h1>
        </div>
        {user ? (
          <button className="ghost-button" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        ) : null}
      </section>

      {message ? <div className="notice">{message}</div> : null}

      {!user ? (
        <section className="auth-panel">
          <div className="auth-copy">
            <Lock size={24} />
            <h2>JWT auth and role checks</h2>
            <p>Use the seeded admin account or register a standard user to test protected access.</p>
          </div>

          <form className="form" onSubmit={handleAuth}>
            <div className="segmented">
              <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
                Login
              </button>
              <button
                type="button"
                className={mode === "register" ? "active" : ""}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>

            {mode === "register" ? (
              <label>
                Name
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
              </label>
            ) : null}

            <label>
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
            </label>

            <label>
              Password
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
            </label>

            <button className="primary-button" disabled={isLoading}>
              <ShieldCheck size={18} />
              {isLoading ? "Working..." : mode === "login" ? "Login" : "Create account"}
            </button>
          </form>
        </section>
      ) : (
        <section className="dashboard">
          <div className="metrics">
            <article>
              <span>User</span>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </article>
            <article>
              <span>Products</span>
              <strong>{products.length}</strong>
              <small>Protected records</small>
            </article>
            <article>
              <span>Stock</span>
              <strong>{totalStock}</strong>
              <small>Units available</small>
            </article>
          </div>

          <div className="workspace">
            <section className="product-list">
              <div className="section-title">
                <Boxes size={20} />
                <h2>Products</h2>
              </div>

              <div className="table">
                {products.map((product) => (
                  <article className="product-row" key={product.id}>
                    <div>
                      <strong>{product.name}</strong>
                      <p>{product.description}</p>
                    </div>
                    <span>${product.price}</span>
                    <span>{product.stock} in stock</span>
                    {isAdmin ? (
                      <div className="row-actions">
                        <button className="icon-button" onClick={() => startEditingProduct(product)} title="Edit">
                          <Pencil size={18} />
                        </button>
                        <button className="icon-button danger" onClick={() => handleDeleteProduct(product.id)} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="side-panel">
              <div className="panel-heading">
                <h2>{editingProductId ? "Edit Product" : "Create Product"}</h2>
                {editingProductId ? (
                  <button className="ghost-icon-button" onClick={cancelEditingProduct} type="button" title="Cancel edit">
                    <X size={18} />
                  </button>
                ) : null}
              </div>
              <form className="form" onSubmit={handleSaveProduct}>
                <label>
                  Name
                  <input
                    disabled={!isAdmin}
                    value={productForm.name}
                    onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                  />
                </label>
                <label>
                  Description
                  <textarea
                    disabled={!isAdmin}
                    value={productForm.description}
                    onChange={(event) => setProductForm({ ...productForm, description: event.target.value })}
                  />
                </label>
                <label>
                  Price
                  <input
                    disabled={!isAdmin}
                    value={productForm.price}
                    onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                    type="number"
                    step="0.01"
                  />
                </label>
                <label>
                  Stock
                  <input
                    disabled={!isAdmin}
                    value={productForm.stock}
                    onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                    type="number"
                  />
                </label>
                <button className="primary-button" disabled={!isAdmin}>
                  {editingProductId ? <Pencil size={18} /> : <Plus size={18} />}
                  {editingProductId ? "Update product" : "Add product"}
                </button>
              </form>
              {!isAdmin ? <p className="helper">Only admins can create or delete products.</p> : null}
            </section>
          </div>
        </section>
      )}
    </main>
  );
}
