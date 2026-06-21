import React from 'react';
import { Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-6 text-center text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2 font-bold text-slate-400">
          <Briefcase className="h-5 w-5 text-primary-500" />
          <span>ReferalsHub Platform</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} ReferalsHub. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
