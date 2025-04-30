import React from 'react';

interface PageTitleProps {
  children: React.ReactNode;
  id?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ children, id }) => {
  return (
    <h1 id={id} className="text-lg font-semibold text-center flex-1 text-gray-800">
      {children}
    </h1>
  );
};

export default PageTitle;
