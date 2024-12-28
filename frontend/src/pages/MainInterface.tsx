import React, { useEffect, useState } from "react";
import { FileExplorer } from "../components/FileExplorer";
import { StepsList } from "../components/StepsList";
import { CodeEditor } from "../components/CodeEditor";
import { File, Step } from "../types";
import { createFileStructure, updateFileContent } from "../utils/fileUtils";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { parseSteps } from "../utils/steps";
import { useWebContainer } from "../hooks/useWebContainer";

interface Content {
  role: "user" | "model";
  parts: { text: string }[];
}

export function MainInterface({ prompt }: { prompt: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [mountAgain, setMountAgain] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [llmMessages, setLlmMessages] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const webContainer = useWebContainer();

  async function init() {
    if (prompt) {
      // templateResponse will return initial steps
      const templateResponse = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt.trim(),
      });

      const parsedSteps = parseSteps(templateResponse.data.stepsForUi[0]);
      setSteps(parsedSteps);

      // * bundle of messages to LLM from user
      const messages: Content[] = [
        {
          role: "user",
          parts: [
            ...templateResponse.data.promptForLLM,
            prompt,
            "IMPORTANT (MIND IT): Between the boltActions tag when providing code give code directly without providing the language type without putting '`' 3 time then language type instead direct put code",
          ].map((text) => {
            return { text };
          }),
        },
      ];

      // llmResponse will return the next steps after the initial steps
      const llmResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: messages,
      });

      // * setting the model's response as role model (will be used in future for providing context of the previous chat)
      setLlmMessages([
        ...messages,
        { role: "model", parts: [{ text: llmResponse.data.response }] },
      ]);

      // console.log(parseSteps(templateResponse.data.stepsForUi[0]), parseSteps(llmResponse.data.response));
      const maxId = Math.max(...parsedSteps.map((r: any) => r.id));

      setSteps((prev) => [
        ...prev,
        ...parseSteps(llmResponse.data.response).map((step, index) => ({
          ...step,
          id: maxId + index + 1,
        })),
      ]);
    }
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    // function which takes steps and returns a file according to a proper structure which can be rendered in the file explorer
    createFileStructure(steps, setSteps, setFiles, files);
  }, [steps]);

  useEffect(() => {
    const convertToWebContainerFormat = (
      files: File[]
    ): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: File, isRootFolder: boolean) => {
        if (file.type === "folder") {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(
                file.children.map((child) => [
                  child.name,
                  processFile(child, false),
                ])
              )
              : {},
          };
        } else if (file.type === "file") {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || "",
              },
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }

        return mountStructure[file.name];
      };

      // Process each top-level file/folder
      files.forEach((file) => processFile(file, true));

      return mountStructure;
    };

    const mountStructure: any = convertToWebContainerFormat(files);
    // console.log("Mount Structure", mountStructure);
    webContainer?.mount(mountStructure);
  }, [files, webContainer, mountAgain]);

  const handleFileContentChange = (newContent: string | undefined) => {
    if (selectedFile && newContent !== undefined) {
      const updatedFiles = updateFileContent(
        files,
        selectedFile.path,
        newContent
      );
      setFiles(updatedFiles);

      // Update selected file reference
      const updatedFile = updatedFiles
        .flatMap((f) => (f.type === "folder" ? f.children || [] : [f]))
        .find((f) => f.path === selectedFile.path);

      if (updatedFile) {
        setSelectedFile(updatedFile);
      }
    }
  };

  const handleSubmitUserPrompt = async () => {
    const newMessage: Content = {
      role: "user",
      parts: [{ text: userPrompt }],
    };

    setLoading(true);
    const updatedLlmResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...llmMessages, newMessage],
    });
    setLoading(false);

    setLlmMessages((prev) => [
      ...prev,
      newMessage,
      { role: "model", parts: [{ text: updatedLlmResponse.data.response }] },
    ]);

    const maxId = Math.max(...steps.map((r: any) => r.id));

    setSteps((prev) => [
      ...prev,
      ...parseSteps(updatedLlmResponse.data.response).map((step, index) => ({
        ...step,
        id: maxId + index + 1,
      })),
    ]);
    setUserPrompt("");
  };

  return (
    <div className="h-full bg-gray-900 text-white">
      <div className="h-full grid grid-cols-12 gap-1">
        <div className="col-span-3 border-r border-gray-700 max-h-screen">
          <StepsList
            steps={steps}
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            handleSubmitUserPrompt={handleSubmitUserPrompt}
            loading={loading}
          />
        </div>
        <div className="col-span-3 border-r border-gray-700 max-h-screen">
          <FileExplorer
            files={files.slice(1)} // slicing from 1 as initially at 0th index creating an empty file of the boltArtifact
            onFileSelect={setSelectedFile}
          />
        </div>
        <div className="col-span-6 max-h-screen">
          <CodeEditor
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            onContentChange={handleFileContentChange}
            webContainer={webContainer}
            setMountAgain={setMountAgain}
          />
        </div>
      </div>
    </div>
  );
}
