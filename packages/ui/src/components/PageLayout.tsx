import PageMeta from './PageMeta';
import PageBreadcrumb from './PageBreadcrumb';

interface PageLayoutProps {
  title: string;
  description?: string;
  breadcrumb?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  breadcrumb,
  toolbar,
  children,
  noPadding = false,
}) => {
  return (
    <>
      <PageMeta title={title} description={description} />
      <div className={noPadding ? '' : 'mx-auto max-w-screen-2xl'}>
        <PageBreadcrumb pageTitle={breadcrumb || title} />
        {toolbar && <div className="mb-4">{toolbar}</div>}
        {children}
      </div>
    </>
  );
};

export default PageLayout;
