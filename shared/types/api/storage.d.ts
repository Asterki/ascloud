// File
interface FileRequestBody {
    folderPath: string;
    fileName: string;
}

type FileResponse = "server-error" | "unauthorized" | "invalid-parameters" | "no-file" | string


// Get folder contents
interface GetFolderContentsRequestBody {
    folderPath: string;
} 

type GetFolderContentsResponse = "unauthorized" | "invalid-parameters" | "server-error" | Array<{ isDirectory: boolean, fileName: string, fileSize: number }> | "no-folder"


// Create folder
interface CreateFolderRequestBody {
    folderPath: string;
}

type CreateFolderResponse = "unauthorized" | "invalid-parameters" | "server-error" | "done" | "folder-exists" | "invalid-name"


// Permanent delete
interface PermanentDeleteFileOrFolderRequestBody {
    filePath: string;
}

type PermanentDeleteFileOrFolderResponse = "unauthorized" | "invalid-parameters" | "server-error" | "done" | "no-file" 

export type { FileRequestBody, FileResponse, GetFolderContentsRequestBody, GetFolderContentsResponse, CreateFolderRequestBody, CreateFolderResponse, PermanentDeleteFileOrFolderRequestBody, PermanentDeleteFileOrFolderResponse }
