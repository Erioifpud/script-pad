'use client';
import { Editor as MonacoEditor, Monaco } from '@monaco-editor/react';
import { useCallback } from 'react';
import themeConfig from './Solarized-light.json'

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor(props: Props) {
  const { value, onChange } = props;

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    // @ts-ignore
    monaco.editor.defineTheme('Solarized-light', themeConfig);
    monaco.editor.setTheme('Solarized-light');
  }, []);

  const handleChange = useCallback((value: string | undefined) => {
    onChange(value || '');
  }, [onChange]);

  return (
    <MonacoEditor
      className="relative"
      height="100%"
      defaultLanguage="javascript"
      theme="Solarized-light"
      beforeMount={handleBeforeMount}
      value={value}
      onChange={handleChange}
    ></MonacoEditor>
  );
}