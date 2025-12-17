import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../images/SR Shopping.png';

interface HeaderProps {
  active: string;
  search: string;
  onSearchChange: (value: string) => void;
  onNavigate: (id: string) => void;
  onAdmin: () => void;
  onDashboard: () => void;
  onLogout: () => void;
  isAuthed: boolean;
}

const Header: React.FC<HeaderProps> = ({
  active,
  search,
  onSearchChange,
  onNavigate,
  onAdmin,
  onDashboard,
  onLogout,
  isAuthed,
}) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleNav = (id: string) => {
    onNavigate(id);
    setOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'categories', label: 'Categories' },
    { id: 'featured', label: 'Products' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const drawerVariants = {
    hidden: { opacity: 0, y: -12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
  };

  return (
    <motion.header className={`header-bar ${scrolled ? 'scrolled' : ''}`} aria-hidden={false}>
      <div className="content-width header-inner">
        <motion.div className="brand modern" onClick={() => handleNav('hero')} role="button" aria-label="Go home" whileHover={{ y: -2 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="SR Shopping" className="brand-logo" />
          <div>
            <div className="brand-title">SR SHOPPING</div>
            <div className="brand-subtitle">Modern home & lifestyle</div>
          </div>
        </motion.div>

        <nav className="nav-links desktop" aria-label="Primary navigation">
          {navItems.map((it) => (
            <motion.button
              key={it.id}
              className={`nav-item ${active === it.id ? 'active' : ''}`}
              onClick={() => handleNav(it.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-current={active === it.id ? 'page' : undefined}
            >
              {it.label}
              <span className="underline" aria-hidden />
            </motion.button>
          ))}
        </nav>

          <div className="header-actions">
          <div className="search pill">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search products"
            />
          </div>
          {isAuthed ? (
            <>
              <motion.button className="secondary" onClick={onDashboard} whileHover={{ y: -2 }}>
                Dashboard
              </motion.button>
              <motion.button className="ghost" onClick={onLogout} whileHover={{ y: -2 }}>
                Logout
              </motion.button>
            </>
          ) : (
            <motion.button className="primary" onClick={onAdmin} whileHover={{ y: -2 }}>
              Admin Login
            </motion.button>
          )}
          <motion.button
            className="icon-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            whileTap={{ scale: 0.96 }}
          >
            <span className="menu-line" />
            <span className="menu-line" />
            <span className="menu-line" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="mobile-drawer" initial="hidden" animate="show" exit="exit" variants={drawerVariants}>
            <div className="drawer-links">
              {navItems.map((it) => (
                <motion.button
                  key={it.id}
                  className={`nav-item ${active === it.id ? 'active' : ''}`}
                  onClick={() => handleNav(it.id)}
                  whileTap={{ scale: 0.98 }}
                  style={{ display: 'block', width: '100%', textAlign: 'left' }}
                >
                  {it.label}
                </motion.button>
              ))}
              <div style={{ marginTop: 8 }}>
                {isAuthed ? (
                  <>
                    <motion.button className="primary" onClick={onDashboard} whileTap={{ scale: 0.98 }} style={{ width: '100%' }}>
                      Dashboard
                    </motion.button>
                    <motion.button className="ghost danger" onClick={onLogout} whileTap={{ scale: 0.98 }} style={{ width: '100%', marginTop: 8 }}>
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <motion.button className="primary" onClick={onAdmin} whileTap={{ scale: 0.98 }} style={{ width: '100%' }}>
                    Admin Login
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
