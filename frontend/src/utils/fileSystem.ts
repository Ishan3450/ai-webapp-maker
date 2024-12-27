import { File } from "../types";

export const projectFiles: File[] = [
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
