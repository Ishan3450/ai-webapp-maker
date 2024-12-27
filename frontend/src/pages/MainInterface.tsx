import React, { useEffect, useState } from 'react';
import { FileExplorer } from '../components/FileExplorer';
import { StepsList } from '../components/StepsList';
import { CodeEditor } from '../components/CodeEditor';
import { File, Step, StepType } from '../types';
import { createFileStructure, updateFileContent } from '../utils/fileUtils';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseSteps } from '../utils/steps';

export function MainInterface({ prompt }: { prompt: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);

  async function init() {
    if (prompt) {
      // templateResponse will return initial steps
      const templateResponse = await axios.post(`${BACKEND_URL}/template`, { prompt: prompt.trim() });

      const parsedSteps = parseSteps(templateResponse.data.stepsForUi[0]);
      setSteps(parsedSteps);

      // llmResponse will return the next steps after the initial steps 
      const llmResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [
          {
            role: "user",
            parts: [...templateResponse.data.promptForLLM, prompt, "between the boltActions tag when providing code give code directly without providing the language type without putting '`' 3 time then language type instead direct put code"].map(text => { return { text } })
          }
        ]
      });

      // console.log(parseSteps(templateResponse.data.stepsForUi[0]), parseSteps(llmResponse.data.response));
      const maxId = Math.max(...parsedSteps.map((r: any) => r.id))

      setSteps(prev => [...prev, ...parseSteps(llmResponse.data.response).map((step, index) => ({
        ...step,
        id: maxId + index + 1
      }))])

    }
  }
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    // function which takes steps and returns a file according to a proper structure which can be rendered in the file explorer
    createFileStructure(steps, setSteps, setFiles, files);
  }, [steps]);


  const handleFileContentChange = (newContent: string | undefined) => {
    if (selectedFile && newContent !== undefined) {
      const updatedFiles = updateFileContent(files, selectedFile.path, newContent);
      setFiles(updatedFiles);

      // Update selected file reference
      const updatedFile = updatedFiles
        .flatMap(f => f.type === 'folder' ? f.children || [] : [f])
        .find(f => f.path === selectedFile.path);

      if (updatedFile) {
        setSelectedFile(updatedFile);
      }
    }
  };

  return (
    <div className="h-full bg-gray-900 text-white">
      <div className="h-full grid grid-cols-12 gap-1">
        <div className="col-span-3 border-r border-gray-700">
          <StepsList steps={steps} />
        </div>
        <div className="col-span-3 border-r border-gray-700">
          <FileExplorer
            files={files.slice(1)} // slicing from 1 as initially at 0th index creating an empty file of the boltArtifact
            onFileSelect={setSelectedFile}
          />
        </div>
        <div className="col-span-6">
          <CodeEditor
            selectedFile={selectedFile}
            onContentChange={handleFileContentChange}
          />
        </div>
      </div>
    </div>
  );
}