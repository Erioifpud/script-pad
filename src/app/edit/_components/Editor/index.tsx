'use client';
import { Editor as MonacoEditor, Monaco } from '@monaco-editor/react';
import { useCallback } from 'react';
import themeConfig from './Solarized-light.json'
import { dts } from './d';

interface Props {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export default function Editor(props: Props) {
  const { value, onChange, language = 'javascript' } = props;

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    // @ts-ignore
    monaco.editor.defineTheme('Solarized-light', themeConfig);
    monaco.editor.setTheme('Solarized-light');
  }, []);

  const handleMount = useCallback((editor: any, monaco: Monaco) => {
    monaco.languages.typescript.javascriptDefaults.addExtraLib(dts, 'index.d.ts')
    monaco.languages.typescript.typescriptDefaults.addExtraLib(dts, 'index.d.ts')
  }, []);

  const handleChange = useCallback((value: string | undefined) => {
    onChange(value || '');
  }, [onChange]);

  return (
    <MonacoEditor
      className="relative"
      height="100%"
      options={{
        tabSize: 2,
        minimap: {
          enabled: false,
        },
        wordWrap: 'on',
        fontSize: 15,
      }}
      defaultLanguage={language}
      theme="Solarized-light"
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      value={value}
      onChange={handleChange}
    ></MonacoEditor>
  );
}