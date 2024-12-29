import { File, Step, StepType } from "../types";

export function getLanguageFromPath(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase();

  const languageMap: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    md: "markdown",
    css: "css",
    html: "html",
    yml: "yaml",
    yaml: "yaml",
  };

  return languageMap[extension || ""] || "plaintext";
}

export function updateFileContent(
  files: File[],
  path: string,
  newContent: string
): File[] {
  return files.map((file) => {
    if (file.path === path) {
      return { ...file, content: newContent };
    }
    if (file.type === "folder" && file.children) {
      return {
        ...file,
        children: updateFileContent(file.children, path, newContent),
      };
    }
    return file;
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// * this function only works while setting up the initial file structure from /template endpoint steps not works while updaing the content of existing files
// export async function createFileStructure(
//   steps: Step[],
//   updateSteps: any,
//   setFiles: any
// ): Promise<void> {
//   try {
//     // Clone the files structure
//     let originalFiles: File[] = [];
//     let isUpdateHappened = false;

//     // Filter pending steps and process
//     for (const step of steps.filter(({ status }) => status === "pending")) {
//       updateSteps((prev: Step[]) =>
//         prev.map((s) => (s.id === step.id ? { ...s, status: "executing" } : s))
//       );
//       isUpdateHappened = true;

//       // Simulate delay if needed
//       // await delay(1000);

//       const parsedPath = step.filePath?.split("/") ?? [];
//       let currentFileStructure = [...originalFiles];
//       const finalAnswerRef = currentFileStructure;

//       let currentFolder = "";
//       while (parsedPath.length) {
//         currentFolder = `${currentFolder}/${parsedPath[0]}`;
//         const currentFolderName = parsedPath[0];
//         parsedPath.shift();

//         if (!parsedPath.length) {
//           // Final file
//           const file = currentFileStructure.find(
//             (x) => x.path === currentFolder
//           );
//           if (!file) {
//             currentFileStructure.push({
//               name: currentFolderName,
//               type: "file",
//               path: currentFolder,
//               content: step.code,
//             });
//           } else {
//             file.content = step.code;
//           }
//         } else {
//           // In a folder
//           let folder = currentFileStructure.find(
//             (x) => x.path === currentFolder
//           );
//           if (!folder) {
//             currentFileStructure.push({
//               name: currentFolderName,
//               type: "folder",
//               path: currentFolder,
//               children: [],
//             });
//           }

//           folder = currentFileStructure.find((x) => x.path === currentFolder)!;
//           currentFileStructure = folder.children!;
//         }
//       }

//       originalFiles = finalAnswerRef;

//       updateSteps((prev: Step[]) =>
//         prev.map((s) => (s.id === step.id ? { ...s, status: "completed" } : s))
//       );

//       // await delay(1000);
//     }

//     if (isUpdateHappened) {
//       setFiles(originalFiles);
//     }
//   } catch (e) {
//     console.error("Error while creating file structure", e);
//   }
// }

/* Example File Structure:
    [
      {
        name: "src",
        type: "folder",
        path: "src",
        children: [
          {
            name: "components",
            type: "folder",
            path: "src/components",
            children: [
              {
                name: "FileExplorer.tsx",
                type: "file",
                path: "src/components/FileExplorer.tsx",
                content: "// FileExplorer component content",
              },
              {
                name: "StepsList.tsx",
                type: "file",
                path: "src/components/StepsList.tsx",
                content: "// StepsList component content",
              },
            ],
          },
          {
            name: "App.tsx",
            type: "file",
            path: "src/App.tsx",
            content: "// App component content",
          },
        ],
      },
      {
        name: "package.json",
        type: "file",
        path: "package.json",
        content: "// Package configuration",
      },
    ];
*/
export async function createFileStructure(
  steps: Step[],
  updateSteps: any,
  setFiles: any,
  originalFiles: File[]
): Promise<void> {
  try {
    const findOrCreateFolder = (
      path: string[],
      currentFiles: File[]
    ): File[] => {
      if (!path.length) return currentFiles;

      const folderName = path[0];
      let folder = currentFiles.find(
        (file) => file.type === "folder" && file.name === folderName
      );

      if (!folder) {
        folder = {
          name: folderName,
          type: "folder",
          path: `${currentFiles[0]?.path || ""}/${folderName}`,
          children: [],
        };
        currentFiles.push(folder);
      }

      return findOrCreateFolder(path.slice(1), folder.children!);
    };

    const addOrUpdateFile = (
      path: string[],
      fileName: string,
      code: string,
      currentFiles: File[]
    ) => {
      const folder = findOrCreateFolder(path, currentFiles);
      const existingFile = folder.find(
        (file) => file.type === "file" && file.name === fileName
      );

      if (existingFile) {
        existingFile.content = code;
      } else {
        folder.push({
          name: fileName,
          type: "file",
          path: `${folder[0]?.path || ""}/${fileName}`,
          content: code,
        });
      }
    };

    let isUpdateHappened = false;

    for (const step of steps
      .filter(({ status }) => status === "pending")
      .filter((step) => step.type !== StepType.RunScript)) {
      // TODO: REMOVE THIS DELAY IF STREAMING OF RESPONSE IS IMPLEMENTED
      await delay(750);

      updateSteps((prev: Step[]) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: "executing" } : s))
      );

      isUpdateHappened = true;

      const parsedPath = step.filePath?.split("/") ?? [];
      const fileName = parsedPath.pop()!;

      addOrUpdateFile(
        parsedPath,
        fileName,
        step.code ?? "// code will come here",
        originalFiles
      );

      // TODO: REMOVE THIS DELAY IF STREAMING OF RESPONSE IS IMPLEMENTED
      await delay(750);

      updateSteps((prev: Step[]) =>
        prev.map((s) => (s.id === step.id ? { ...s, status: "completed" } : s))
      );
    }

    if (isUpdateHappened) {
      setFiles(originalFiles);
    }
  } catch (e) {
    console.error("Error while creating file structure", e);
  }
}
