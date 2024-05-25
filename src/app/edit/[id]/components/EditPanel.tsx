'use client';
import { Editor, Monaco } from '@monaco-editor/react';
import { useCallback } from 'react';
import themeConfig from './Solarized-light.json'

export default function EditPanel() {
  const handleBeforeMount = useCallback((monaco: Monaco) => {
    // @ts-ignore
    monaco.editor.defineTheme('Solarized-light', themeConfig);
    monaco.editor.setTheme('Solarized-light');
  }, []);

  return (
    <Editor
      className="relative"
      height="100%"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme="Solarized-light"
      beforeMount={handleBeforeMount}
    ></Editor>
  );
}