import TerminalPage from '@/features/storage/components/terminal/PodTerminal';
import { useSearchParams } from 'react-router-dom';

const TerminalWrapper: React.FC = () => {
  const [searchParams] = useSearchParams();
  const namespace = searchParams.get('namespace') || '';
  const pod = searchParams.get('pod') || '';
  const container = searchParams.get('container') || '';

  return <TerminalPage namespace={namespace} pod={pod} container={container} />;
};

export default TerminalWrapper;
