'use client';
import { Editor as MonacoEditor, Monaco } from '@monaco-editor/react';
import { useCallback, useEffect, useRef } from 'react';
import themeConfig from '@/utils/Solarized-light.json'
import { emmetCSS, emmetHTML, emmetJSX } from "emmet-monaco-es";
import { dts } from './d';

interface Props {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateReadOnly(editor: any, readOnly: boolean) {
  if (!editor) return;
  editor.updateOptions({
    readOnly
  })
}

export default function Editor(props: Props) {
  const { value, onChange, language = 'javascript', readOnly } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    // @ts-expect-error 不用管类型检查，这里的格式没有错
    monaco.editor.defineTheme('Solarized-light', themeConfig);
    monaco.editor.setTheme('Solarized-light');
  }, []);

  // 这里的 editor 类型 lib 没有导出，实际上是 IStandaloneCodeEditor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMount = useCallback((editor: any, monaco: Monaco) => {
    // 初始化只读设置
    updateReadOnly(editor, !!readOnly);
    editorRef.current = editor;
    monaco.languages.typescript.javascriptDefaults.addExtraLib(dts, 'index.d.ts')
    monaco.languages.typescript.typescriptDefaults.addExtraLib(dts, 'index.d.ts')

    if (['typescript', 'javascript'].includes(language)) {
      emmetJSX(monaco)
      emmetHTML(monaco)
      emmetCSS(monaco)
    }
  }, [language, readOnly]);

  const handleChange = useCallback((value: string | undefined) => {
    onChange(value || '');
  }, [onChange]);

  // 更新只读设置
  useEffect(() => {
    updateReadOnly(editorRef.current, !!readOnly)
  }, [readOnly]);

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