import { useState, useEffect, useCallback } from 'react';
import { ResourceItem, ConfigFile } from '@/core/interfaces/configFile';
import { parseK8sYaml } from '../utils/k8sParsers';
import { generateMultiDocYAML } from '@/features/projects/utils/k8sYamlGenerator';

export type TabType = 'wizard' | 'yaml';

export function useConfigForm(selectedConfig: ConfigFile | null, isOpen: boolean) {
  const [filename, setFilename] = useState('');
  const [rawYaml, setRawYaml] = useState('');
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('wizard');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && selectedConfig) {
      setFilename(selectedConfig.Filename);
      setRawYaml(selectedConfig.Content);
      setResources(parseK8sYaml(selectedConfig.Content));
      setActiveTab('wizard');
      setError(null);
    } else if (!isOpen) {
      // Reset logic if needed
    }
  }, [isOpen, selectedConfig]);

  const switchTab = useCallback(
    (targetTab: TabType) => {
      if (targetTab === activeTab) return;

      try {
        if (targetTab === 'yaml') {
          const generated = generateMultiDocYAML(resources);
          setRawYaml(generated);
        } else {
          const parsed = parseK8sYaml(rawYaml);
          setResources(parsed);
        }
        setActiveTab(targetTab);
      } catch (e) {
        console.error('Sync error:', e);
      }
    },
    [activeTab, resources, rawYaml],
  );

  const updateRawYaml = (val: string) => setRawYaml(val);

  return {
    filename,
    setFilename,
    rawYaml,
    setRawYaml, // <--- Add this line (Fix: Expose the setter)
    updateRawYaml,
    resources,
    setResources,
    activeTab,
    switchTab,
    error,
    setError,
  };
}
