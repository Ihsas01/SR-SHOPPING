import React from 'react';
import { motion } from 'framer-motion';
import logo from '../images/SR Shopping.png';

const IconWhatsApp = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M21.7 2.3A11.9 11.9 0 0012 0C5.4 0 .2 5.2.2 11.8c0 2 0.5 3.9 1.5 5.6L0 24l6.8-1.8c1.6.9 3.3 1.3 5.1 1.3 6.6 0 11.8-5.2 11.8-11.8 0-3.1-1.2-6-3.3-8.4z" fill="#25D366"/>
    <path d="M17.6 14.1c-.3-.1-1.8-.9-2-.9-.2 0-.3-.1-.5.1-.2.3-.8.9-1 1.1-.2.1-.4.1-.7 0-.3-.1-1.4-.5-2.7-1.6-1-1-1.6-2.2-1.8-2.5-.2-.3 0-.4.1-.6.1-.2.1-.4.2-.5.1-.1.1-.3 0-.5-.1-.2-.7-1.7-1-2.4-.3-.6-.6-.5-.9-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.1 3 .1.3 1.8 3 4.4 4.2 3 1.5 3.3 1.2 3.9 1.1.6-.1 1.8-.8 2-1.6.1-.8.1-1.4.1-1.6 0-.2-.1-.4-.4-.5z" fill="#fff"/>
  </svg>
);

const IconFacebook = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M22 12a10 10 0 10-11.6 9.9v-7H8.4v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.1v1.9h2.3l-.4 2.9H13v7A10 10 0 0022 12z" fill="#1877F2"/>
  </svg>
);

const IconInstagram = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <linearGradient id="ig" x1="0" x2="1">
      <stop offset="0" stopColor="#f58529" />
      <stop offset="0.5" stopColor="#dd2a7b" />
      <stop offset="1" stopColor="#8134af" />
    </linearGradient>
    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" fill="url(#ig)"/>
    <circle cx="12" cy="12" r="3.2" fill="#fff"/>
    <circle cx="17.5" cy="6.5" r="1" fill="#fff"/>
  </svg>
);

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-12" id="contact">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SR Shopping" className="w-14 h-14 object-contain rounded-md" />
              <div>
                <div className="font-bold">SR SHOPPING</div>
                <div className="text-sm text-slate-500">Curated home & lifestyle</div>
              </div>
            </div>
            <p className="text-sm text-slate-600">A modern local shop bringing you curated home, fashion, beauty, and lifestyle essentials with friendly cash-on-delivery service.</p>
            <div className="flex gap-2 mt-2">
              <a className="inline-flex items-center px-3 py-2 rounded-md bg-violet-600 text-white text-sm" href="https://wa.me/0763913526" target="_blank" rel="noreferrer">Chat now</a>
              <a className="inline-flex items-center px-3 py-2 rounded-md border text-sm" href="mailto:support@srshopping.com">Email</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <a href="#hero" className="text-slate-700 hover:text-violet-600">Home</a>
              <a href="#featured" className="text-slate-700 hover:text-violet-600">Featured</a>
              <a href="#about" className="text-slate-700 hover:text-violet-600">About</a>
              <a href="#contact" className="text-slate-700 hover:text-violet-600">Contact</a>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-700">
              <a className="hover:text-violet-600" href="mailto:support@srshopping.com">support@srshopping.com</a>
              <a className="hover:text-violet-600" href="tel:0763913526">0763913526</a>
              <span>Colombo, Sri Lanka</span>
              <a className="hover:text-violet-600" href="https://wa.me/0763913526" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Follow & Subscribe</h4>
            <div className="flex items-center gap-3 mb-3">
              <motion.a href="https://wa.me/0763913526" target="_blank" rel="noreferrer" aria-label="WhatsApp" whileHover={{ y: -4 }} className="p-2 bg-white rounded-md shadow-sm">
                <IconWhatsApp />
              </motion.a>
              <motion.a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" whileHover={{ y: -4 }} className="p-2 bg-white rounded-md shadow-sm">
                <IconFacebook />
              </motion.a>
              <motion.a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" whileHover={{ y: -4 }} className="p-2 bg-white rounded-md shadow-sm">
                <IconInstagram />
              </motion.a>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input aria-label="Subscribe email" placeholder="Your email" className="flex-1 px-3 py-2 border rounded-md text-sm" />
              <button className="px-3 py-2 bg-violet-600 text-white rounded-md text-sm">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">© 2025 SR SHOPPING. All Rights Reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
