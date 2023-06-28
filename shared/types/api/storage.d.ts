// #region File
interface DownloadFileRequestBody {
  folderPath: string;
  fileName: string;
}
type DownloadFileResponse =
  | "server-error"
  | "unauthorized"
  | "missing-parameters"
  | "no-file";

interface UploadFileRequestBody {
  folderPath: string;
}
type UploadFileResponse =
  | "unauthorized"
  | "missing-parameters"
  | "invalid-parameters"
  | "file-exists"
  | "invalid-folder"
  | "server-error"
  | "done";

interface DeleteFileRequestBody {
  folderPath: string;
  fileName: string;
}
type DeleteFileResponse =
  | "unauthorized"
  | "missing-parameters"
  | "server-error"
  | "done"
  | "no-file";
// #endregion


// #region Folder
interface GetFolderContentsRequestBody {
  folderPath: string;
}
type GetFolderContentsResponse =
  | "unauthorized"
  | "missing-parameters"
  | "server-error"
  | Array<{ isDirectory: boolean; fileName: string; fileSize: number }>
  | "no-folder";

interface CreateFolderRequestBody {
  folderPath: string;
}
type CreateFolderResponse =
  | "unauthorized"
  | "missing-parameters"
  | "server-error"
  | "done"
  | "folder-exists"
  | "invalid-name";
// #endregion

// Permanent delete
interface PermanentDeleteFileOrFolderRequestBody {
  filePath: string;
}

type PermanentDeleteFileOrFolderResponse =
  | "unauthorized"
  | "invalid-parameters"
  | "server-error"
  | "done"
  | "no-file";

export type {
  FileRequestBody,
  FileResponse,
  UploadFileRequestBody,
  UploadFileResponse,
  DeleteFileRequestBody,
  DeleteFileResponse,
  GetFolderContentsRequestBody,
  GetFolderContentsResponse,
  CreateFolderRequestBody,
  CreateFolderResponse,
  PermanentDeleteFileOrFolderRequestBody,
  PermanentDeleteFileOrFolderResponse,
};
