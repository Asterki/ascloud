// * Imports
// Lib Imports
import React, { ChangeEvent } from "react";
import { get, set } from "idb-keyval";
import axios, { Axios, AxiosResponse } from "axios";
import crypto from "crypto";

// Component Imports
import Head from "next/head";
import Navbar from "@/components/navbar";
import Img from "next/image";
import * as ContextMenu from "@radix-ui/react-context-menu";
import ErrorModal from "../../components/error";

// State Imports
import { store, RootState } from "@/store";
import { useSelector } from "react-redux";
import { setKeys } from "@/store/keysSlice";

// Styles And Types Imports
import styles from "@/styles/main/home/index.module.scss";
import { GetServerSideProps, NextPage } from "next";
import { User } from "@/../../shared/types/models";
import * as StorageServiceAPITypes from "@/../../shared/types/api/storage";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (!context.req.isAuthenticated())
		return {
			redirect: {
				destination: "/login", // Check if the user is logged in
				permanent: false,
			},
		};

	return {
		props: {
			user: JSON.parse(JSON.stringify(context.req.user)),
			login: context.query.login == "true",
		},
	};
};

interface PageProps {
	user: User;
	login: boolean;
}

const Home: NextPage<PageProps> = (props) => {
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.accounts.register;
	const keys = appState.keys;

	// #region Page State
	// Wether the just logged in modal will show up
	const [welcomeModalOpen, setWelcomeModalOpen] = React.useState(props.login);

	// Folders retrieved from the
	const [folderContents, setFolderContents] = React.useState<
		Array<{ isDirectory: boolean; fileName: string; fileSize: number }>
	>([]);
	const [currentPath, setCurrentPath] = React.useState("/");
	const [isLoadingContents, setIsLoadingContents] = React.useState<boolean>(true);

	const [isCriticalErrorModalOpen, setCriticalErrorModalOpen] = React.useState<boolean>(false);
	// #endregion

	// #region Page refs
	const fileInput = React.useRef<HTMLInputElement>(null);
	// #endregion

	// #region Functions
	const cryptoMethods = {
		encrypt: (text: string, key: string, iv: string) => {
			const cipher = crypto.createCipheriv("aes-256-ctr", key, iv); // Create the cipher to encrypt the text
			let encrypted = cipher.update(text, "utf8", "hex"); // Encrypt the text and format it to hex
			encrypted += cipher.final("hex"); // Add the iv
			return encrypted;
		},
		decrypt: (encryptedText: string, key: string, iv: string) => {
			const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv); // Create the cipher to decrypt
			let decrypted = decipher.update(encryptedText, "hex", "utf8"); // Decrypt and format the text
			decrypted += decipher.final("utf8"); // Add the iv
			return decrypted;
		},
		generatePassword: (length: number) => {
			let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
				retVal = "";
			for (let i = 0, n = charset.length; i < length; ++i) {
				retVal += charset.charAt(Math.floor(Math.random() * n));
			}
			return retVal;
		},
		updateKeys: async (key: string, iv: string) => {
			// Set the keys in the local storage
			await set("crypto-key", key);
			await set("crypto-iv", iv);

			// Set the keys in the state
			store.dispatch(setKeys({ iv: iv, key: key }));
		},
		generateKeys: () => {
			const newKey = cryptoMethods.generatePassword(32);
			const newIV = cryptoMethods.generatePassword(16);

			cryptoMethods.updateKeys(newKey, newIV);
		},
	};

	const folderViewMethods = {
		downloadFile: async (fileName: string) => {
			try {
				const response = await axios({
					url: `${process.env.NEXT_PUBLIC_FILE_SERVER_HOST}/api/storage/file`,
					method: "GET",
					withCredentials: true,
					params: {
						folderPath: currentPath,
						fileName: fileName,
					},
				});

				// Decrypt the file
				const decryptedContent = cryptoMethods.decrypt(response.data, keys.storageKey!, keys.storageIV!);
				const decryptedFile = folderViewMethods.dataURLtoFile(decryptedContent, fileName);

				// Download the file
				const url = URL.createObjectURL(decryptedFile);
				const link = document.createElement("a");

				link.href = url;
				link.download = fileName;
				link.click();
				URL.revokeObjectURL(url);
			} catch (error: any) {
				console.log(error);
				setCriticalErrorModalOpen(true);
			}
		},

		uploadFile: async () => {
			// TODO: add upload confirmation

			if (!fileInput.current!.files || !keys.storageIV || !keys.storageKey) return;
			const file = fileInput.current!.files[0];

			let reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onloadend = async () => {
				// Encrypt the file
				if (!reader.result) return;
				const encryptedResult = cryptoMethods.encrypt(
					reader.result as string,
					keys.storageKey!,
					keys.storageIV!
				);

				const encryptedData = new Blob([encryptedResult], { type: "text/plain" });
				const encryptedFile = new File([encryptedData], file.name);

				const data = new FormData();
				data.append("file", encryptedFile);
				data.append("folderPath", currentPath);

				try {
					// Upload the file
					const response: AxiosResponse<StorageServiceAPITypes.UploadFileResponse> = await axios({
						url: `${process.env.NEXT_PUBLIC_FILE_SERVER_HOST}/api/storage/file`,
						method: "POST",
						withCredentials: true,
						data: data as unknown as StorageServiceAPITypes.UploadFileRequestBody,
					});

					if (response.data == "done") {
						fileInput.current!.value = "";
						fileInput.current!.files = null;
						return updateFolderContents();
					}
				} catch (error: any) {
					console.log(error);
					setCriticalErrorModalOpen(true);
				}
			};
		},

		deleteFile: async (fileName: string) => {
			// TODO: Show confirmation form

			try {
				const folderResponse: AxiosResponse<StorageServiceAPITypes.DeleteFileResponse> = await axios({
					method: "DELETE",
					withCredentials: true,
					url: `${process.env.NEXT_PUBLIC_FILE_SERVER_HOST}/api/storage/file`,
					params: {
						folderPath: currentPath,
						fileName: fileName,
					},
				});

				// TODO: Add a modal that says "file deleted, moved to the bin, will be deleted in 10 days"

				console.log(folderResponse.data);
				updateFolderContents();
			} catch (error: any) {
				console.log(error);
				setCriticalErrorModalOpen(true);
			}
		},

		createFolder: async () => {
			const folderName = prompt("Enter the name of the folder");
			if (!folderName) return;

			try {
				const response: AxiosResponse<StorageServiceAPITypes.CreateFolderResponse> = await axios({
					method: "POST",
					url: `${process.env.NEXT_PUBLIC_FILE_SERVER_HOST}/api/storage/folder`,
					withCredentials: true,
					data: {
						folderPath: currentPath,
						folderName: folderName,
					} as StorageServiceAPITypes.CreateFolderRequestBody,
				});

				return updateFolderContents();
			} catch (error: any) {
				console.log(error);
				setCriticalErrorModalOpen(true);
			}
		},

		dataURLtoFile: (fileContent: string, fileName: string) => {
			let arr = fileContent.split(",");
			let mime = "";
			if (arr[0]) {
				const match = arr[0].match(/:(.*?);/);
				mime = match ? match[1] : "";
			}
			let bstr = arr[arr.length - 1] ? atob(arr[arr.length - 1]) : "";
			let n = bstr.length;
			let u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], fileName, { type: mime });
		},
	};

	const getReadableFileSizeString = (fileSizeInBytes: number) => {
		var i = -1;
		var byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
		do {
			fileSizeInBytes /= 1024;
			i++;
		} while (fileSizeInBytes > 1024);

		return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
	};

	const goBackOneLevel = () => {
		setIsLoadingContents(true);
		setCurrentPath(currentPath.replace(/\/[^\/]+\/$/, "/"));
	};

	const updateFolderContents = async () => {
		try {
			const folderResponse: AxiosResponse<StorageServiceAPITypes.GetFolderContentsResponse> = await axios({
				method: "GET",
				withCredentials: true,
				url: `${process.env.NEXT_PUBLIC_FILE_SERVER_HOST}/api/storage/folder`,
				params: {
					folderPath: currentPath,
				} as StorageServiceAPITypes.GetFolderContentsRequestBody,
			});

			if (typeof folderResponse.data == "object") {
				setFolderContents(folderResponse.data);
				setIsLoadingContents(false);
			} else {
				// TODO: error handling here
			}
		} catch (error: any) {
			console.log(error);
			setCriticalErrorModalOpen(true);
		}
	};
	// #endregion

	// #region Page listeners
	React.useEffect(() => {
		(async () => {
			if (!keys.storageIV || !keys.storageKey) {
				const retrievedKey: string | undefined = await get("crypto-key");
				const retrievedIV: string | undefined = await get("crypto-iv");

				// If no key, open modal to ask user for the key
				if (!retrievedKey || !retrievedIV) {
					setWelcomeModalOpen(true);
					cryptoMethods.generateKeys();
				} else {
					store.dispatch(setKeys({ iv: retrievedIV, key: retrievedKey }));
					updateFolderContents();
				}
			}
		})();
	}, []);

	React.useEffect(() => {
		// Every time the user interacts with the folders, or changes paths
		// It will retrieve the folders on that path
		updateFolderContents();
	}, [currentPath]);
	// #endregion

	// #region Mapped Elements
	const folderContentsElement = folderContents
		.sort((item) => {
			return item.isDirectory ? -1 : 1; // Folders are shown first
		})
		.map((file) => {
			if (!file.isDirectory) {
				return (
					<ContextMenu.Root key={file.fileName}>
						<ContextMenu.Trigger className="ContextMenuTrigger">
							<div className={`${styles["file"]} ${isLoadingContents ? styles["file-inactive"] : ""}`}>
								<Img width={25} height={25} src="/svg/file.svg" alt="file-icon" />
								<p>
									{file.fileName} - {getReadableFileSizeString(file.fileSize)}
								</p>
								<br />
								<br />
							</div>
						</ContextMenu.Trigger>
						<ContextMenu.Portal>
							<ContextMenu.Content className={"context-menu-content"}>
								<button onClick={() => folderViewMethods.downloadFile(file.fileName)}>Download</button>
								<button onClick={() => folderViewMethods.deleteFile(file.fileName)}>Delete</button>
								<button>View Properties</button>
							</ContextMenu.Content>
						</ContextMenu.Portal>
					</ContextMenu.Root>
				);
			} else {
				return (
					<div
						key={file.fileName}
						onClick={() => {
							if (isLoadingContents) return;

							setIsLoadingContents(true);
							setCurrentPath(`${currentPath}${file.fileName}/`);
						}}
						className={`${styles["folder"]} ${isLoadingContents ? styles["folder-inactive"] : ""}`}
					>
						<Img width={25} height={25} src="/svg/folder.svg" alt="folder-icon" />
						<p>{file.fileName}</p>
						<br />
						<br />
					</div>
				);
			}
		});
	// #endregion

	// # Page
	return (
		<div className={styles["page"]}>
			{/* <Modal modalOpen={welcomeModalOpen} modalTitle="Welcome">
				<h1>Hey there</h1>
			</Modal> */}

			{/* Custom head tags for the page */}
			<Head>
				<title>AsCloud - Home</title>
			</Head>

			<main>
				{/* Left and top navbar */}
				<Navbar user={props.user} currentPage={"shared"} />

				{/* Folder contents view and actions*/}
				<div className={styles["current-folder"]}>
					{/* Folder actions */}
					<div className={styles["folder-navbar"]}>
						<Img width={25} height={25} src="/svg/delete-bin.svg" alt="" />
						<Img
							width={25}
							height={25}
							src="/svg/folder-plus.svg"
							alt=""
							onClick={() => folderViewMethods.createFolder()}
						/>
						<Img width={25} height={25} src="/svg/link.svg" alt="" />
						<Img
							width={20}
							height={20}
							src="/svg/upload.svg"
							alt="upload"
							onClick={() => fileInput.current?.click()}
						/>
						<button onClick={updateFolderContents}>Update Folder Contents</button>
					</div>

					{/* Folder path */}
					<div className={styles["path-navbar"]}>
						<p>Path: {currentPath}</p>
						{isLoadingContents && (
							<Img width={25} height={25} src="/svg/settings-cog.svg" alt="folder-icon" />
						)}
					</div>

					{/* Folder contents view */}
					<div className={styles["folder-view"]}>
						{currentPath !== "/" && (
							<div
								onClick={() => {
									if (isLoadingContents) return;

									setIsLoadingContents(true);
									goBackOneLevel();
								}}
								className={`${styles["folder"]} ${isLoadingContents ? styles["folder-inactive"] : ""}`}
							>
								<Img width={25} height={25} src="/svg/folder.svg" alt="folder-icon" />
								<p>..</p>
								<br />
								<br />
							</div>
						)}
						{folderContentsElement}
					</div>

					<form action="wa" method="POST" encType="multipart/form-data">
						<input type="file" hidden onChange={folderViewMethods.uploadFile} ref={fileInput} />
					</form>
				</div>
			</main>

			<ErrorModal modalOpen={isCriticalErrorModalOpen} />
		</div>
	);
};

export default Home;
