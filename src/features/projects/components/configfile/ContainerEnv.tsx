import EnvVarManager from './EnvVarManager';
import type { EnvVar } from '@/core/interfaces/configFile';

type Props = {
  env: EnvVar[];
  onChange: (next: EnvVar[]) => void;
};

export default function ContainerEnv({ env, onChange }: Props) {
  return <EnvVarManager envVars={env} onChange={onChange} />;
}
