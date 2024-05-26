'use client';
import { Editor as MonacoEditor, Monaco } from '@monaco-editor/react';
import { useCallback } from 'react';
import themeConfig from './Solarized-light.json'

export default function Editor() {
  const handleBeforeMount = useCallback((monaco: Monaco) => {
    // @ts-ignore
    monaco.editor.defineTheme('Solarized-light', themeConfig);
    monaco.editor.setTheme('Solarized-light');
  }, []);

  return (
    <MonacoEditor
      className="relative"
      height="100%"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme="Solarized-light"
      beforeMount={handleBeforeMount}
    ></MonacoEditor>
  );
}