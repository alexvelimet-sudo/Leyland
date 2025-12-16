import React from 'react';
import { ShieldAlert } from 'lucide-react';

const Admin: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-400 pb-24">
      <ShieldAlert size={48} className="mb-4 text-slate-300" />
      <h2 className="text-xl font-bold text-slate-600">Admin Panel</h2>
      <p>This area is restricted.</p>
    </div>
  );
};
export default Admin;