import PortManager from './PortManager';
import type { ContainerPort } from '@/core/interfaces/configFile';

type Props = {
  ports: ContainerPort[];
  onChange: (next: ContainerPort[]) => void;
};

export default function ContainerPorts({ ports, onChange }: Props) {
  return <PortManager ports={ports} onChange={onChange} />;
}
