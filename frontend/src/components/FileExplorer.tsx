import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File as FileIcon, Folder, Loader2, CheckCircle } from 'lucide-react';
import { File } from '../types';

interface FileExplorerProps {
  files: File[];
  onFileSelect: (file: File) => void;
}

function FileItem({ file, depth = 0, onFileSelect }: { file: File; depth?: number; onFileSelect: (file: File) => void }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleFolder = () => {
    if (file.type === 'folder') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <div
        className="flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer rounded group"
        onClick={() => file.type === 'file' ? onFileSelect(file) : toggleFolder()}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {file.type === 'folder' && (
          <span className="mr-1 text-gray-400">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}

        {file.type === 'folder' ? (
          <Folder size={16} className="mr-2 text-blue-400" />
        ) : (
          <FileIcon size={16} className="mr-2 text-gray-400" />
        )}

        <span className="text-sm group-hover:text-white">{file.name}</span>
      </div>

      {file.type === 'folder' && isOpen && file.children?.map((child, index) => (
        <FileItem
          key={index}
          file={child}
          depth={depth + 1}
          onFileSelect={onFileSelect}
        />
      ))}

    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {

  // sorting so that folders appears before than files
  files = files.sort((a: File, b: File): number => {
    if (a.type === "folder") {
      return -1;
    }
    return 1;
  })

  return (
    <div className="bg-gray-800 h-full flex flex-col">
      <div className="px-4 py-2 text-lg font-semibold border-b border-gray-700 flex gap-2">
        Files
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {files.map((file, index) => (
          <FileItem key={index} file={file} onFileSelect={onFileSelect} />
        ))}
      </div>
    </div>
  );
}