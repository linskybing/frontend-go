import React from 'react';

interface PageMetaProps {
  title: string;
  description?: string;
}

export const PageMeta: React.FC<PageMetaProps> = ({ title, description }) => (
  <>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </>
);

export default PageMeta;
