import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
};

export default Layout;
