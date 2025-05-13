import React from 'react';

const AdminPageLayout = ({ children, title = 'Admin Dashboard' }) => {
  return (
    <div className="admin-layout">
      <div className="admin-header">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
      </div>
      
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminPageLayout;
