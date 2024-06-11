'use client';
import { Editor as MonacoEditor, Monaco } from '@monaco-editor/react';
import { useCallback } from 'react';
import themeConfig from '@/utils/Solarized-light.json'

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor(props: Props) {
  const { value, onChange } = props;

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    // @ts-expect-error 不用管类型检查，这里的格式没有错
    monaco.editor.defineTheme('Solarized-light', themeConfig);
    monaco.editor.setTheme('Solarized-light');
  }, []);

  // 这里的 editor 类型 lib 没有导出，实际上是 IStandaloneCodeEditor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const handleMount = useCallback((_: any, monaco: Monaco) => {
  // }, [language]);

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
      defaultLanguage="markdown"
      theme="Solarized-light"
      beforeMount={handleBeforeMount}
      value={value}
      onChange={handleChange}
    ></MonacoEditor>
  );
}