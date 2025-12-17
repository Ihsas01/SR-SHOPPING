import React from 'react';

interface SidebarProps {
  onNavigate: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 sticky top-20">
      <div className="mb-4">
        <h4 className="font-semibold">Admin</h4>
        <p className="text-sm text-slate-500">Quick actions</p>
      </div>

      <nav className="flex flex-col gap-2">
        <button onClick={() => onNavigate('landing')} className="text-left text-sm px-3 py-2 rounded hover:bg-slate-50">View site</button>
        <button onClick={() => onNavigate('adminDashboard')} className="text-left text-sm px-3 py-2 rounded hover:bg-slate-50">Dashboard</button>
        <button onClick={() => onNavigate('featured')} className="text-left text-sm px-3 py-2 rounded hover:bg-slate-50">Products</button>
        <button onClick={() => onNavigate('categories')} className="text-left text-sm px-3 py-2 rounded hover:bg-slate-50">Categories</button>
      </nav>

      <div className="mt-6 pt-4 border-t text-sm text-slate-500">
        <div className="mb-2">Tips</div>
        <ul className="list-disc list-inside text-xs">
          <li>Use the inventory table to update stock</li>
          <li>Click Discount to set promos</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
