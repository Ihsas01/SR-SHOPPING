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
    <motion.header
      className={`sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200 transition-shadow ${scrolled ? 'shadow-lg' : ''}`}
      aria-hidden={false}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => handleNav('hero')} className="flex items-center gap-3" aria-label="Go home">
              <img src={logo} alt="SR Shopping" className="w-10 h-10 rounded-md object-contain" />
              <div className="hidden sm:block text-left">
                <div className="font-bold text-sm">SR SHOPPING</div>
                <div className="text-xs text-slate-500">Modern home & lifestyle</div>
              </div>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((it) => (
              <motion.button
                key={it.id}
                onClick={() => handleNav(it.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${active === it.id ? 'bg-violet-50 text-violet-700' : 'text-slate-700 hover:bg-slate-100'}`}
                whileHover={{ scale: 1.02 }}
              >
                {it.label}
              </motion.button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>
              <input
                aria-label="Search products"
                className="ml-2 outline-none text-sm text-slate-600 placeholder:text-slate-400 bg-transparent"
                placeholder="Search products..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {isAuthed ? (
              <>
                <motion.button onClick={onDashboard} className="hidden sm:inline-flex items-center px-3 py-2 rounded-md bg-slate-100 text-sm font-semibold text-slate-800" whileHover={{ y: -2 }}>
                  Dashboard
                </motion.button>
                <motion.button onClick={onLogout} className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50" whileHover={{ y: -2 }}>
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button onClick={onAdmin} className="inline-flex items-center px-3 py-2 rounded-md bg-gradient-to-r from-violet-600 to-violet-400 text-white text-sm font-semibold shadow" whileHover={{ y: -2 }}>
                Admin Login
              </motion.button>
            )}

            <motion.button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={open}
              className="ml-1 inline-flex items-center justify-center p-2 rounded-md border border-slate-200 md:hidden"
              whileTap={{ scale: 0.96 }}
            >
              <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="md:hidden">
            <div className="px-4 pb-4 space-y-2">
              {navItems.map((it) => (
                <button key={it.id} onClick={() => handleNav(it.id)} className={`w-full text-left px-3 py-2 rounded-md ${active === it.id ? 'bg-violet-50 text-violet-700' : 'hover:bg-slate-100'}`}>
                  {it.label}
                </button>
              ))}
              <div className="pt-2">
                {isAuthed ? (
                  <>
                    <button onClick={onDashboard} className="w-full px-3 py-2 rounded-md bg-slate-100 mb-2">Dashboard</button>
                    <button onClick={onLogout} className="w-full px-3 py-2 rounded-md border">Logout</button>
                  </>
                ) : (
                  <button onClick={onAdmin} className="w-full px-3 py-2 rounded-md bg-gradient-to-r from-violet-600 to-violet-400 text-white">Admin Login</button>
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
