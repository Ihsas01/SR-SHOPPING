import React, { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import type { Admin, Product, Category } from './data';
import { defaultAdmins, defaultCategories, defaultProducts } from './data';
import Header from './components/Header';
import Footer from './components/Footer';

type View = 'landing' | 'adminLogin' | 'adminDashboard';

const STORAGE_KEYS = {
  products: 'sr-shopping-products',
  admins: 'sr-shopping-admins',
  session: 'sr-shopping-session',
  categories: 'sr-shopping-categories',
  discounts: 'sr-shopping-discounts',
};

const WHATSAPP_NUMBER = '0763913526';
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const cardHover = {
  rest: { y: 0, boxShadow: '0 10px 25px rgba(15,23,42,0.05)' },
  hover: { y: -6, boxShadow: '0 20px 45px rgba(15,23,42,0.12)' },
};

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

const persistToStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors
  }
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage<Product[]>(STORAGE_KEYS.products, defaultProducts),
  );
  const [admins, setAdmins] = useState<Admin[]>(() => loadFromStorage<Admin[]>(STORAGE_KEYS.admins, defaultAdmins));
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(() =>
    loadFromStorage<Admin | null>(STORAGE_KEYS.session, null),
  );
  const [view, setView] = useState<View>(() => (loadFromStorage<Admin | null>(STORAGE_KEYS.session, null) ? 'adminDashboard' : 'landing'));
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [orderItem, setOrderItem] = useState<Product | null>(null);
  const [orderForm, setOrderForm] = useState({ customer: '', phone: '', quantity: 1 });
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [categoryModal, setCategoryModal] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage<Category[]>(STORAGE_KEYS.categories, defaultCategories),
  );
  const [discounts, setDiscounts] = useState<Record<string, number>>(() =>
    loadFromStorage<Record<string, number>>(STORAGE_KEYS.discounts ?? 'sr-shopping-discounts', {}),
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    price: '',
    quantity: '',
    category: categories[0]?.name ?? 'All',
    image: '',
  });
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', quantity: '', category: '', image: '' });
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [draftEdits, setDraftEdits] = useState<Record<string, { price: string; quantity: string }>>({});
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [authMessage, setAuthMessage] = useState('');
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  const formatLKR = (value: number) =>
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 2 }).format(value);

  useEffect(() => {
    persistToStorage(STORAGE_KEYS.products, products);
  }, [products]);

  useEffect(() => {
    persistToStorage(STORAGE_KEYS.admins, admins);
  }, [admins]);

  useEffect(() => {
    persistToStorage(STORAGE_KEYS.session, currentAdmin);
  }, [currentAdmin]);

  useEffect(() => {
    // seed admins in storage on first load if none exist
    if (!loadFromStorage<Admin[]>(STORAGE_KEYS.admins, []).length) {
      persistToStorage(STORAGE_KEYS.admins, defaultAdmins);
      setAdmins(defaultAdmins);
    }
  }, []);

  useEffect(() => {
    persistToStorage(STORAGE_KEYS.categories, categories);
  }, [categories]);

  useEffect(() => {
    persistToStorage(STORAGE_KEYS.discounts ?? 'sr-shopping-discounts', discounts);
  }, [discounts]);

  const featuredProducts = useMemo(() => products.filter((p) => p.featured), [products]);
  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = products.filter((p) => {
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      if (!q) return matchesCategory;
      const name = p.name.toLowerCase();
      const category = p.category.toLowerCase();
      const catDesc = (categories.find((c) => c.name === p.category)?.description || '').toLowerCase();
      const priceStr = String(p.price).toLowerCase();
      const matchesSearch = name.includes(q) || category.includes(q) || catDesc.includes(q) || priceStr.includes(q);
      return matchesCategory && matchesSearch;
    });
    return showAllProducts ? filtered : filtered.slice(0, 8);
  }, [products, showAllProducts, search, filterCategory, categories]);
  const totalInventoryValue = useMemo(
    () => products.reduce((acc, p) => acc + p.price * p.quantity, 0),
    [products],
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // open confirmation modal to ask admin to confirm category, name, price, quantity
    if (!addForm.name.trim() || !addForm.price || !addForm.quantity) return;
    if (addForm.category === '__new__' && !newCategory.name.trim()) return;
    setShowAddConfirm(true);
  };

  const confirmAddProduct = () => {
    let finalCategory = addForm.category;
    if (addForm.category === '__new__') {
      finalCategory = newCategory.name.trim();
      const cat: Category = {
        name: finalCategory,
        image: newCategory.image || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
        description: '',
      };
      setCategories((prev) => [cat, ...prev]);
    }

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: addForm.name.trim(),
      price: Number(addForm.price),
      quantity: Number(addForm.quantity),
      category: finalCategory,
      image: addForm.image || 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
      featured: products.length % 2 === 0,
    };
    setProducts([newProduct, ...products]);
    setAddForm({ name: '', price: '', quantity: '', category: categories[0]?.name ?? '', image: '' });
    setNewCategory({ name: '', image: '' });
    setShowAddConfirm(false);
  };

  const cancelAddProduct = () => setShowAddConfirm(false);

  const handleUpdateProduct = (id: string) => {
    const draft = draftEdits[id];
    if (!draft) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              price: Number(draft.price || p.price),
              quantity: Number(draft.quantity || p.quantity),
            }
          : p,
      ),
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeleteCategory = (name: string) => {
    const ok = window.confirm(
      `Delete category "${name}"? Products in this category will become uncategorized.`,
    );
    if (!ok) return;
    setCategories((prev) => prev.filter((c) => c.name !== name));
    setOpenCategories((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSetDiscount = (productId: string) => {
    const current = discounts[productId] ?? 0;
    const input = window.prompt('Enter discount percentage (0-100). Use 0 to remove.', String(current));
    if (input === null) return;
    const n = Number(input);
    if (Number.isNaN(n) || n < 0 || n > 100) {
      alert('Please enter a valid percentage between 0 and 100.');
      return;
    }
    setDiscounts((prev) => {
      const next = { ...prev };
      if (n === 0) delete next[productId];
      else next[productId] = n;
      return next;
    });
  };

  const openEditProduct = (product: Product) => {
    setEditProductId(product.id);
    setEditForm({ name: product.name, price: String(product.price), quantity: String(product.quantity), category: product.category, image: product.image });
  };

  const closeEditProduct = () => {
    setEditProductId(null);
    setEditForm({ name: '', price: '', quantity: '', category: '', image: '' });
  };

  const saveEditProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editProductId) return;
    if (!editForm.name.trim() || !editForm.price || !editForm.quantity) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editProductId
          ? {
              ...p,
              name: editForm.name.trim(),
              price: Number(editForm.price),
              quantity: Number(editForm.quantity),
              category: editForm.category,
              image: editForm.image,
            }
          : p,
      ),
    );
    closeEditProduct();
  };

  const handleDeleteAdmin = (email: string) => {
    setAdmins((prev) => {
      const next = prev.filter((a) => a.email !== email);
      if (currentAdmin && currentAdmin.email === email) {
        setCurrentAdmin(null);
        setView('landing');
      }
      return next;
    });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const match = admins.find(
      (a) =>
        a.email.toLowerCase() === loginForm.email.trim().toLowerCase() &&
        a.password === loginForm.password,
    );
    if (match) {
      setCurrentAdmin(match);
      setView('adminDashboard');
      setAuthMessage('');
      setLoginForm({ email: '', password: '' });
      setShowRegister(false);
    } else {
      setAuthMessage('Invalid admin email or password. Use an existing account or register.');
    }
  };

  const handleAdminRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const email = registerForm.email.trim().toLowerCase();
    if (!registerForm.name.trim() || !email || !registerForm.password.trim()) {
      setAuthMessage('Please fill name, email, and password.');
      return;
    }
    if (admins.some((a) => a.email.toLowerCase() === email)) {
      setAuthMessage('That email is already registered.');
      return;
    }
    const newAdmin: Admin = {
      name: registerForm.name.trim(),
      email,
      password: registerForm.password.trim(),
      phone: registerForm.phone.trim(),
    };
    const nextAdmins = [newAdmin, ...admins].slice(0, 3);
    setAdmins(nextAdmins);
    setCurrentAdmin(newAdmin);
    setView('adminDashboard');
    setAuthMessage('Registration successful. You are logged in.');
    setRegisterForm({ name: '', email: '', password: '', phone: '' });
    setShowRegister(false);
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    setView('landing');
  };

  const startOrder = (product: Product) => {
    setOrderItem(product);
    setOrderForm({ customer: '', phone: '', quantity: 1 });
  };

  

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderItem) return;
    const message = `Hello SR SHOPPING, I would like to order:
- Customer: ${orderForm.customer}
- WhatsApp: ${orderForm.phone}
- Product: ${orderItem.name}
- Quantity: ${orderForm.quantity}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
    setOrderItem(null);
  };

  

  useEffect(() => {
    const onScroll = () => {
      const sections = ['hero', 'about', 'categories', 'featured', 'contact'];
      const scrollPos = window.scrollY + 120;
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        return scrollPos >= top && scrollPos < bottom;
      });
      if (current) setActiveSection(current);
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setView('landing');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const heroCTA = () => scrollTo('featured');

  return (
    <div className="page">
      <motion.div className="progress-bar" style={{ scaleX: scrollProgress }} />
      <Header
        active={activeSection}
        search={search}
        onSearchChange={setSearch}
        onNavigate={scrollTo}
        onAdmin={() => setView('adminLogin')}
        onDashboard={() => setView('adminDashboard')}
        onLogout={handleLogout}
        isAuthed={!!currentAdmin}
      />

      {view === 'landing' && (
        <>
          <motion.section
            className="hero"
            id="hero"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="content-width hero-shell">
              <motion.div className="hero-content" variants={fadeInUp}>
                <p className="badge">Fresh deals daily</p>
                <h1>
                  SR SHOPPING brings curated home & lifestyle picks right to your door.
                </h1>
                <p className="lead">
                  Discover quality household essentials, fashion, beauty, and more. Cash on delivery with fast local support via WhatsApp.
                </p>
                <div className="hero-actions">
                  <motion.button className="primary" onClick={heroCTA} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Explore products
                  </motion.button>
                  <motion.button className="ghost" onClick={() => setView('adminLogin')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Admin access
                  </motion.button>
                </div>
                <div className="hero-stats">
                  <div>
                    <div className="stat-number">{products.length}</div>
                    <div className="stat-label">Products</div>
                  </div>
                  <div>
                    <div className="stat-number">{categories.length}</div>
                    <div className="stat-label">Categories</div>
                  </div>
                  <div>
                    <div className="stat-number">Cash</div>
                    <div className="stat-label">On Delivery</div>
                  </div>
                </div>
              </motion.div>
              <motion.div className="hero-card" variants={fadeInUp} whileHover={cardHover.hover} initial="rest" whileTap={{ scale: 0.995 }}>
                <motion.div className="hero-image" whileHover={{ scale: 1.02 }} transition={{ duration: 0.45 }} />
                <div className="hero-card-body">
                  <p className="muted">Handpicked for you</p>
                  <h3>{featuredProducts[0]?.name ?? 'Essential Picks'}</h3>
                  <p className="muted">
                    Stylish finds, practical home tools, and daily comfort items selected by SR SHOPPING.
                  </p>
                  <motion.button className="secondary" onClick={heroCTA} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    See featured
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            id="special-offers"
            className="section"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="content-width">
              <div className="section-header">
                <div>
                  <p className="badge">Special Offers</p>
                  <h2>Special Offers</h2>
                  <p className="muted">Discounted items are listed first. Use the search to filter.</p>
                </div>
                <div className="section-actions">
                  <button className="ghost" onClick={() => setShowAllProducts((s) => !s)}>
                    {showAllProducts ? 'Show less' : 'More products'}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <h3>Discounted items</h3>
                <div className="grid products">
                  {visibleProducts.filter((p) => discounts[p.id]).map((p) => {
                    const percent = discounts[p.id] ?? 0;
                    const discounted = p.price * (1 - percent / 100);
                    return (
                      <motion.article key={p.id} className="card product-card fade" variants={fadeInUp} whileHover={{ y: -4, scale: 1.01 }}>
                        <img src={p.image} alt={p.name} loading="lazy" />
                        <div className="product-body">
                          <div className="product-top">
                            <h3>{p.name}</h3>
                            <div>
                              <div className="price" style={{ textDecoration: 'line-through', opacity: 0.7 }}>{formatLKR(p.price)}</div>
                              <div className="price">{formatLKR(discounted)}</div>
                            </div>
                          </div>
                          <div className="muted small">{p.category} • In stock: {p.quantity}</div>
                          <div className="product-footer">
                            <span className="pill light">-{percent}%</span>
                            <button className="primary" onClick={() => startOrder(p)} disabled={p.quantity <= 0}>
                              Order
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>

                <h3 style={{ marginTop: 18 }}>Other products</h3>
                <div className="grid products">
                  {visibleProducts.filter((p) => !discounts[p.id]).map((p) => (
                    <motion.article key={p.id} className="card product-card fade" variants={fadeInUp} whileHover={{ y: -4, scale: 1.01 }}>
                      <img src={p.image} alt={p.name} loading="lazy" />
                      <div className="product-body">
                        <div className="product-top">
                          <h3>{p.name}</h3>
                          <div className="price">{formatLKR(p.price)}</div>
                        </div>
                        <div className="muted small">{p.category} • In stock: {p.quantity}</div>
                        <div className="product-footer">
                          <button className="ghost" onClick={() => { setFilterCategory(p.category); window.scrollTo({ top: document.getElementById('categories')?.offsetTop ?? 0, behavior: 'smooth' }); }}>
                            View
                          </button>
                          <button className="primary" onClick={() => startOrder(p)} disabled={p.quantity <= 0}>
                            Order
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                  {visibleProducts.length === 0 && <div className="muted">No products match your search.</div>}
                </div>
              </div>
            </div>
          </motion.section>
          <motion.section
            id="about"
            className="section"
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="content-width">
              <div className="section-header">
                <div>
                  <p className="badge">About us</p>
                  <h2>Who we are</h2>
                  <p className="muted">SR SHOPPING is a local-curated store bringing carefully selected home, fashion, and lifestyle products. We focus on quality, friendly service, and fast communication via WhatsApp.</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            id="categories"
            className="section"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="content-width">
              <div className="section-header">
                <div>
                  <p className="badge">Categories</p>
                  <h2>Shop by lifestyle</h2>
                  <p className="muted">Browse essentials across home, fashion, beauty, school, and more.</p>
                </div>
                <div className="section-actions">
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFilterCategory(val);
                      if (val && val !== 'All') setCategoryModal(val);
                    }}
                    className="filter"
                  >
                    <option value="All">All categories</option>
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button className="ghost" onClick={() => setShowAllProducts((s) => !s)}>
                    {showAllProducts ? 'Show less' : 'More products'}
                  </button>
                </div>
              </div>
              <div className="grid categories">
                {categories.map((cat) => (
                  <motion.article
                    key={cat.name}
                    className="card category-card fade"
                    variants={fadeInUp}
                    whileHover={{ y: -4, scale: 1.01 }}
                    onClick={() => { setFilterCategory(cat.name); setCategoryModal(cat.name); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setFilterCategory(cat.name); setCategoryModal(cat.name); } }}
                  >
                    <img src={cat.image} alt={cat.name} loading="lazy" />
                    <div>
                      <h3>{cat.name}</h3>
                      <p className="muted">{cat.description}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.section>

          

          <motion.section
            className="section contact-section"
            id="contact"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="content-width">
              <div className="section-header">
                <div>
                  <p className="badge">Contact</p>
                  <h2>We’re here to help</h2>
                  <p className="muted">Reach us on WhatsApp or send a quick note.</p>
                </div>
                <motion.a
                  className="primary"
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Chat on WhatsApp
                </motion.a>
              </div>
              <div className="contact-grid">
                <motion.div className="card" variants={fadeInUp}>
                  <h3>Visit or call</h3>
                  <p className="muted">Colombo, Sri Lanka</p>
                  <p className="muted">Phone: {WHATSAPP_NUMBER}</p>
                  <p className="muted">Email: support@srshopping.com</p>
                </motion.div>
                <motion.div className="card" variants={fadeInUp}>
                  <h3>Store hours</h3>
                  <p className="muted">Mon - Sat: 9:00 - 20:00</p>
                  <p className="muted">Sun: 10:00 - 18:00</p>
                  <p className="muted">Fast responses on WhatsApp.</p>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </>
      )}

      {view === 'adminLogin' && (
        <section className="auth">
          <div className="card auth-card">
            <p className="badge">Admin</p>
            <h2>SR SHOPPING Admin {showRegister ? 'Registration' : 'Login'}</h2>
            <p className="muted">
              Register the first admin with name, email, and password. Emails must be unique; existing admins can simply log in.
            </p>
            {authMessage && <div className="error">{authMessage}</div>}
            {!showRegister ? (
              <form className="form" onSubmit={handleAdminLogin}>
                <label>
                  Admin Email
                  <input
                    required
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((s) => ({ ...s, email: e.target.value }))}
                    placeholder="admin@srshopping.com"
                  />
                </label>
                <label>
                  Password
                  <input
                    required
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((s) => ({ ...s, password: e.target.value }))}
                    placeholder="********"
                  />
                </label>
                <button className="primary" type="submit">
                  Login
                </button>
              </form>
            ) : (
              <form className="form" onSubmit={handleAdminRegister}>
                <label>
                  Full Name
                  <input
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Jane Doe"
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm((s) => ({ ...s, email: e.target.value }))}
                    placeholder="you@srshopping.com"
                  />
                </label>
                <label>
                  Password
                  <input
                    required
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm((s) => ({ ...s, password: e.target.value }))}
                    placeholder="Create a password"
                  />
                </label>
                <label>
                  Phone (optional)
                  <input
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm((s) => ({ ...s, phone: e.target.value }))}
                    placeholder="0763913526"
                  />
                </label>
                <button className="primary" type="submit">
                  Register & Login
                </button>
              </form>
            )}
            <div className="auth-switch">
              <button className="ghost" type="button" onClick={() => setShowRegister((s) => !s)}>
                {showRegister ? 'Have an account? Login' : 'Need an account? Register'}
              </button>
              <button className="ghost" type="button" onClick={() => setView('landing')}>
                Back to site
              </button>
            </div>
            <div className="muted small">
              Existing admins: {admins.map((a) => a.email).join(', ')}
            </div>
          </div>
        </section>
      )}

      {view === 'adminDashboard' && currentAdmin && (
        <section className="dashboard">
          <div className="dashboard-header">
            <div>
              <p className="badge">Dashboard</p>
              <h2>Welcome back, {currentAdmin.email}</h2>
              <p className="muted">Manage products, pricing, and availability.</p>
            </div>
            <div className="dashboard-actions">
              <button className="ghost" onClick={() => setView('landing')}>
                View site
              </button>
              <button className="secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="card stat-card">
              <div className="stat-number">{products.length}</div>
              <div className="stat-label">Products live</div>
            </div>
            <div className="card stat-card">
              <div className="stat-number">{formatLKR(totalInventoryValue)}</div>
              <div className="stat-label">Inventory value</div>
            </div>
            <div className="card stat-card">
              <div className="stat-number">{admins.length}</div>
              <div className="stat-label">Admin accounts</div>
            </div>
          </div>

          <div className="card">
            <h3>Admin accounts</h3>
            <div className="table admins">
              <div className="table-head">
                <span>Name</span>
                <span>Email</span>
                <span>Phone</span>
                <span />
              </div>
              {admins.map((admin) => (
                <div key={admin.email} className="table-row">
                  <span className="table-title">{admin.name}</span>
                  <span className="muted small">{admin.email}</span>
                  <span className="muted small">{admin.phone ?? '—'}</span>
                  <div className="table-actions">
                    <button
                      className="ghost danger"
                      onClick={() => handleDeleteAdmin(admin.email)}
                      disabled={admins.length <= 1}
                      title={admins.length <= 1 ? 'At least one admin required' : 'Delete admin'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="muted small">Email must be unique. Deleting the signed-in admin will log them out.</p>
          </div>

          <div className="card">
            <h3>Add a new product</h3>
            <form className="form grid-2" onSubmit={handleAddProduct}>
              <label>
                Name
                <input
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Product name"
                />
              </label>
              <label>
                Category
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm((s) => ({ ...s, category: e.target.value }))}
                >
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="__new__">Add new category</option>
                </select>
              </label>
              {addForm.category === '__new__' && (
                <div style={{ display: 'contents' }}>
                  <label>
                    New category name
                    <input
                      required
                      value={newCategory.name}
                      onChange={(e) => setNewCategory((s) => ({ ...s, name: e.target.value }))}
                      placeholder="Category name"
                    />
                  </label>
                  <label className="full">
                    Image URL (optional)
                    <input
                      value={newCategory.image}
                      onChange={(e) => setNewCategory((s) => ({ ...s, image: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </label>
                </div>
              )}
              <label>
                Price (LKR)
                <input
                  required
                  type="number"
                  min={0}
                  step={0.01}
                  value={addForm.price}
                  onChange={(e) => setAddForm((s) => ({ ...s, price: e.target.value }))}
                  placeholder="25.00"
                />
              </label>
              <label>
                Quantity
                <input
                  required
                  type="number"
                  min={0}
                  step={1}
                  value={addForm.quantity}
                  onChange={(e) => setAddForm((s) => ({ ...s, quantity: e.target.value }))}
                  placeholder="10"
                />
              </label>
              <label className="full">
                Image URL
                <input
                  value={addForm.image}
                  onChange={(e) => setAddForm((s) => ({ ...s, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                />
              </label>
              <div className="full">
                <button className="primary" type="submit">
                  Add product
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <h3>Inventory</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {categories.map((cat) => {
                const items = products.filter((p) => p.category === cat.name);
                const open = Object.prototype.hasOwnProperty.call(openCategories, cat.name) ? !!openCategories[cat.name] : true;
                return (
                  <div key={cat.name} className="card" style={{ padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{cat.name}</div>
                        <div className="muted small">{items.length} items</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="ghost" onClick={() => setOpenCategories((s) => ({ ...s, [cat.name]: !open }))}>
                          {open ? 'Hide' : 'Show'}
                        </button>
                        <button className="ghost" onClick={() => { setFilterCategory(cat.name); setCategoryModal(cat.name); }}>
                          View
                        </button>
                        <button className="ghost danger" onClick={() => handleDeleteCategory(cat.name)} title="Delete category">
                          Delete
                        </button>
                      </div>
                    </div>
                    {open && (
                      <div style={{ marginTop: 12 }}>
                        {items.length === 0 && <div className="muted">No items in this category.</div>}
                        {items.map((product) => (
                          <div key={product.id} className="table-row" style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
                            <div className="table-product" style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                              <img src={product.image} alt={product.name} style={{ width: 64, height: 64, objectFit: 'cover' }} />
                              <div>
                                <div className="table-title">{product.name}</div>
                                <div className="muted small">In stock: {product.quantity}</div>
                              </div>
                            </div>
                            <div style={{ width: 120 }}>
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={draftEdits[product.id]?.price ?? product.price}
                                onChange={(e) =>
                                  setDraftEdits((s) => ({
                                    ...s,
                                    [product.id]: { price: e.target.value, quantity: s[product.id]?.quantity ?? String(product.quantity) },
                                  }))
                                }
                              />
                            </div>
                            <div style={{ width: 100 }}>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={draftEdits[product.id]?.quantity ?? product.quantity}
                                onChange={(e) =>
                                  setDraftEdits((s) => ({
                                    ...s,
                                    [product.id]: { price: s[product.id]?.price ?? String(product.price), quantity: e.target.value },
                                  }))
                                }
                              />
                            </div>
                            <div className="table-actions" style={{ display: 'flex', gap: 8 }}>
                              <button className="secondary" onClick={() => handleUpdateProduct(product.id)}>
                                Save
                              </button>
                              <button className="ghost" onClick={() => openEditProduct(product)}>
                                Edit
                              </button>
                              <button className="ghost" onClick={() => handleSetDiscount(product.id)}>
                                Discount
                              </button>
                              <button className="ghost danger" onClick={() => handleDeleteProduct(product.id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* orphan products (categories not in list) */}
              {products.filter((p) => !categories.some((c) => c.name === p.category)).length > 0 && (
                <div className="card" style={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>Uncategorized</div>
                      <div className="muted small">{products.filter((p) => !categories.some((c) => c.name === p.category)).length} items</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    {products.filter((p) => !categories.some((c) => c.name === p.category)).map((product) => (
                      <div key={product.id} className="table-row" style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
                        <div className="table-product" style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                          <img src={product.image} alt={product.name} style={{ width: 64, height: 64, objectFit: 'cover' }} />
                          <div>
                            <div className="table-title">{product.name}</div>
                            <div className="muted small">In stock: {product.quantity}</div>
                          </div>
                        </div>
                        <div style={{ width: 120 }}>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={draftEdits[product.id]?.price ?? product.price}
                            onChange={(e) =>
                              setDraftEdits((s) => ({
                                ...s,
                                [product.id]: { price: e.target.value, quantity: s[product.id]?.quantity ?? String(product.quantity) },
                              }))
                            }
                          />
                        </div>
                        <div style={{ width: 100 }}>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={draftEdits[product.id]?.quantity ?? product.quantity}
                            onChange={(e) =>
                              setDraftEdits((s) => ({
                                ...s,
                                [product.id]: { price: s[product.id]?.price ?? String(product.price), quantity: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="table-actions" style={{ display: 'flex', gap: 8 }}>
                          <button className="secondary" onClick={() => handleUpdateProduct(product.id)}>
                            Save
                          </button>
                          <button className="ghost" onClick={() => openEditProduct(product)}>
                            Edit
                          </button>
                          <button className="ghost" onClick={() => handleSetDiscount(product.id)}>
                            Discount
                          </button>
                          <button className="ghost danger" onClick={() => handleDeleteProduct(product.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {orderItem && (
        <div className="modal">
          <div className="modal-card">
            <h3>Order {orderItem.name}</h3>
            <p className="muted">We will redirect you to WhatsApp to confirm.</p>
            <form className="form" onSubmit={submitOrder}>
              <label>
                Customer name
                <input
                  required
                  value={orderForm.customer}
                  onChange={(e) => setOrderForm((s) => ({ ...s, customer: e.target.value }))}
                />
              </label>
              <label>
                WhatsApp number
                <input
                  required
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm((s) => ({ ...s, phone: e.target.value }))}
                  placeholder={WHATSAPP_NUMBER}
                />
              </label>
              <label>
                Quantity
                <input
                  required
                  type="number"
                  min={1}
                  max={orderItem.quantity}
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm((s) => ({ ...s, quantity: Number(e.target.value) }))}
                />
              </label>
              <div className="modal-actions">
                <button className="ghost" type="button" onClick={() => setOrderItem(null)}>
                  Cancel
                </button>
                <button className="primary" type="submit">
                  Send via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editProductId && (
        <div className="modal" onClick={closeEditProduct}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Edit product</h3>
            <form className="form" onSubmit={saveEditProduct}>
              <label>
                Name
                <input required value={editForm.name} onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))} />
              </label>
              <label>
                Category
                <select value={editForm.category} onChange={(e) => setEditForm((s) => ({ ...s, category: e.target.value }))}>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Price (LKR)
                <input required type="number" min={0} step={0.01} value={editForm.price} onChange={(e) => setEditForm((s) => ({ ...s, price: e.target.value }))} />
              </label>
              <label>
                Quantity
                <input required type="number" min={0} step={1} value={editForm.quantity} onChange={(e) => setEditForm((s) => ({ ...s, quantity: e.target.value }))} />
              </label>
              <label className="full">
                Image URL
                <input value={editForm.image} onChange={(e) => setEditForm((s) => ({ ...s, image: e.target.value }))} />
              </label>
              <div className="modal-actions">
                <button className="ghost" type="button" onClick={closeEditProduct}>Cancel</button>
                <button className="primary" type="submit">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categoryModal && (
        <div className="modal" onClick={() => setCategoryModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Category: {categoryModal}</h3>
              <button className="ghost" onClick={() => setCategoryModal(null)} style={{ marginLeft: 12 }}>
                Close
              </button>
            </div>
            <p className="muted">Items in this category</p>
            <div className="grid" style={{ marginTop: 12 }}>
              {products.filter((p) => p.category === categoryModal).map((p) => (
                <div key={p.id} className="card product-card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={p.image} alt={p.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div className="table-title">{p.name}</div>
                    <div className="muted small">{formatLKR(p.price)} • In stock: {p.quantity}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="ghost" onClick={() => { setCategoryModal(null); setFilterCategory(p.category); }}>
                      View
                    </button>
                    <button className="primary" onClick={() => { startOrder(p); setCategoryModal(null); }}>
                      Order
                    </button>
                  </div>
                </div>
              ))}
              {products.filter((p) => p.category === categoryModal).length === 0 && (
                <div className="muted">No items found in this category.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddConfirm && (
        <div className="modal" onClick={cancelAddProduct}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm add product</h3>
            <p className="muted">Please confirm the details for the new product:</p>
            <div style={{ marginTop: 8 }}>
              <div className="muted small">Name: <strong>{addForm.name}</strong></div>
              <div className="muted small">Category: <strong>{addForm.category}</strong></div>
              <div className="muted small">Price: <strong>{formatLKR(Number(addForm.price || 0))}</strong></div>
              <div className="muted small">Quantity: <strong>{addForm.quantity}</strong></div>
            </div>
            <div className="modal-actions" style={{ marginTop: 12 }}>
              <button className="ghost" type="button" onClick={cancelAddProduct}>
                Cancel
              </button>
              <button className="primary" type="button" onClick={confirmAddProduct}>
                Confirm add
              </button>
            </div>
          </div>
        </div>
      )}

      <a className="whatsapp" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
        WhatsApp us
      </a>
      {showScrollTop && (
        <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ↑
        </button>
      )}
      <Footer />
    </div>
  );
};

export default App;
