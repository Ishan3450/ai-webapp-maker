import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File as FileIcon, Folder, DownloadIcon } from 'lucide-react';
import { File } from '../types';
import JSZip from 'jszip';
import { saveAs } from "file-saver";

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

  const handleDownload = async () => {
    const projectZip = new JSZip();

    const addFilesToZip = (items: File[], folder: JSZip) => {
      items.forEach((item) => {
        if (item.type === "file") {
          folder.file(item.name, item.content);
        } else if (item.type === "folder") {
          const newFolder = folder.folder(item.name);
          addFilesToZip(item.children ?? [], newFolder!);
        }
      });
    };

    addFilesToZip(files, projectZip);

    const content = await projectZip.generateAsync({ type: "blob" });
    saveAs(content, "project.zip");
  };

  // files = files.sort((a: File, b: File): number => {
  //   if (a.type === "folder") {
  //     return -1;
  //   }
  //   return 1;
  // })

  // sorting so that folders appears before than files
  files = files.sort((a: File, b: File): number => {
    if (a.type === "folder" && b.type !== "folder") {
      return -1;
    }
    if (a.type !== "folder" && b.type === "folder") {
      return 1;
    }
    if (a.type === "folder" && b.type === "folder") {
      if (a.children && b.children) {
        a.children = a.children.sort((childA, childB) => {
          if (childA.type === "folder" && childB.type !== "folder") {
            return -1;
          }
          if (childA.type !== "folder" && childB.type === "folder") {
            return 1;
          }
          return 0;
        });
      }
      return 0;
    }
    return 0;
  });


  return (
    <div className="bg-gray-800 h-full flex flex-col">
      <div className="px-4 py-2 text-lg font-semibold border-b border-gray-700 flex justify-between w-full">
        <span>Files</span>
        <span><DownloadIcon className='cursor-pointer hover:text-gray-500' onClick={handleDownload} /></span>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {files.map((file, index) => (
          <FileItem key={index} file={file} onFileSelect={onFileSelect} />
        ))}
      </div>
    </div>
  );
}