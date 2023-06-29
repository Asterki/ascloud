// #region File
// Download File
interface DownloadFileRequestBody {
	folderPath: string;
	fileName: string;
}
type DownloadFileResponse = "server-error" | "unauthorized" | "missing-parameters" | "no-file";

// Upload File
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

// Delete File
interface DeleteFileRequestBody {
	folderPath: string;
	fileName: string;
}
type DeleteFileResponse = "unauthorized" | "missing-parameters" | "server-error" | "done" | "no-file";

// Rename File
interface RenameFileRequestBody {
	folderPath: string;
	fileName: string;
}
type RenameFileResponse = "unauthorized" | "missing-parameters" | "server-error" | "done" | "name-in-use" | "no-file";
// #endregion

// #region Folder
// Get Folder Contents
interface GetFolderContentsRequestBody {
	folderPath: string;
}
type GetFolderContentsResponse =
	| "unauthorized"
	| "missing-parameters"
	| "server-error"
	| Array<{ isDirectory: boolean; fileName: string; fileSize: number }>
	| "no-folder";

// Create Folder
interface CreateFolderRequestBody {
	folderPath: string;
	folderName: string;
}
type CreateFolderResponse =
	| "unauthorized"
	| "missing-parameters"
	| "server-error"
	| "done"
	| "folder-exists"
	| "invalid-name";

// Delete Folder
interface DeleteFolderRequestBody {
	folderPath: string;
	folderName: string;
}
type DeleteFolderResponse = "unauthorized" | "missing-parameters" | "server-error" | "done" | "no-folder";

// Rename Folder
interface RenameFolderRequestBody {
	folderPath: string;
	newName: string;
}
type RenameFolderResponse =
	| "unauthorized"
	| "missing-parameters"
	| "server-error"
	| "done"
	| "name-in-use"
	| "no-folder";
// #endregion

export type {
	FileRequestBody,
	FileResponse,
	UploadFileRequestBody,
	UploadFileResponse,
	DeleteFileRequestBody,
	DeleteFileResponse,
	RenameFileRequestBody,
	RenameFileResponse,
	GetFolderContentsRequestBody,
	GetFolderContentsResponse,
	CreateFolderRequestBody,
	CreateFolderResponse,
	DeleteFolderRequestBody,
	DeleteFolderResponse,
	RenameFolderRequestBody,
	RenameFolderResponse,
};
