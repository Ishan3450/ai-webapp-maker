export interface File {
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: File[];
}

export enum StepType {
  CreateFile,
  EditFile,
  CreateFolder,
  DeleteFile,
  RunScript,
  Unknown
}

export interface Step {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'executing' | 'completed';
  type: StepType;
  code?: string;
  filePath?: string;
}