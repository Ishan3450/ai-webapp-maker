import React, { useState } from 'react';
import { File } from '../types';
import { MonacoEditor } from './MonacoEditor';
import { X } from 'lucide-react';
import PreviewCode from './PreviewCode';
import { WebContainer } from '@webcontainer/api';

interface CodeEditorProps {
  selectedFile: File | null;
  onContentChange: (content: string | undefined) => void;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setMountAgain: React.Dispatch<React.SetStateAction<boolean>>;
  webContainer: WebContainer | null;
}


export function CodeEditor({ selectedFile, onContentChange, setSelectedFile, webContainer, setMountAgain }: CodeEditorProps) {
  const styleSelected = "bg-gray-700 py-1 px-3 rounded duration-150";
  const [selectedTab, changeSelectedTab] = useState<"code" | "preview">("code");
  const handleCloseFile = () => setSelectedFile(null);

  const handleTabChange = () => {
    changeSelectedTab(prev => prev === "code" ? "preview" : "code");
  }

  return (
    <div className="bg-gray-800 h-full flex flex-col">
      {selectedFile ? (
        <>
          <div className="bg-gray-700 p-2 text-sm font-mono border-b border-gray-600 flex justify-between">
            <span className=' bg-gray-800 px-4 py-2 rounded flex gap-3 w-fit items-center'>
              <span>{selectedFile.path}</span>
              <span className='bg-gray-700 p-1 rounded hover:text-gray-900 cursor-pointer duration-150' onClick={handleCloseFile}>
                <X className='h-4 w-4' />
              </span>
            </span>

            <span className='bg-gray-800 p-2 rounded flex gap-3 w-fit items-center cursor-pointer' onClick={handleTabChange}>
              <button className={styleSelected}>{selectedTab === "code" ? "Code" : "Preview"}</button>
              <button>{selectedTab === "preview" ? "Code" : "Preview"}</button>
            </span>
          </div>
          <div className="flex-1">
            {selectedTab === "code" ?
              <MonacoEditor
                file={selectedFile}
                onChange={onContentChange}
              />
              : <PreviewCode webContainer={webContainer} setMountAgain={setMountAgain} />
            }
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select a file to view its contents and/or its preview
        </div>
      )}
    </div>
  );
}