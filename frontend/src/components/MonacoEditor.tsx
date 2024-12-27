import { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { File } from '../types';
import { getLanguageFromPath } from '../utils/fileUtils';

interface MonacoEditorProps {
  file: File;
  onChange?: (value: string | undefined) => void;
}

export function MonacoEditor({ file, onChange }: MonacoEditorProps) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="100%"
      language={getLanguageFromPath(file.path)}
      value={file.content || ''}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
      }}
      onChange={onChange}
      onMount={handleEditorDidMount}
    />
  );
}