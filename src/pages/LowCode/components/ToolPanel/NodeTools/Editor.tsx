'use client';
import { Editor as MonacoEditor, Monaco } from '@monaco-editor/react';
import { useCallback } from 'react';
import themeConfig from '@/utils/Solarized-light.json'

interface Props {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export default function Editor(props: Props) {
  const { value, onChange, language = 'json' } = props;

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    // @ts-expect-error 不用管类型检查，这里的格式没有错
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
      value={value}
      onChange={handleChange}
    ></MonacoEditor>
  );
}