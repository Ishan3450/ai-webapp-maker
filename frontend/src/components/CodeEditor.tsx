import React from 'react';
import { File } from '../types';
import { MonacoEditor } from './MonacoEditor';

interface CodeEditorProps {
  selectedFile: File | null;
  onContentChange: (content: string | undefined) => void;
}

export function CodeEditor({ selectedFile, onContentChange }: CodeEditorProps) {
  return (
    <div className="bg-gray-800 h-full flex flex-col">
      {selectedFile ? (
        <>
          <div className="bg-gray-700 px-4 py-2 text-sm font-mono border-b border-gray-600">
            {selectedFile.path}
          </div>
          <div className="flex-1">
            <MonacoEditor 
              file={selectedFile} 
              onChange={onContentChange} 
            />
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select a file to view its contents
        </div>
      )}
    </div>
  );
}