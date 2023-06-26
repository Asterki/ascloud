// * Imports
// Lib Imports
import React, { ChangeEvent } from "react";
import { get, set } from "idb-keyval";
import axios, { AxiosResponse } from "axios";
import crypto from "crypto";

// Component Imports
import Head from "next/head";
import Navbar from "@/components/navbar";

// State Imports
import { store, RootState } from "@/store";
import { useSelector } from "react-redux";
import { setKeys } from "@/store/keysSlice";

// Styles And Types Imports
import styles from "@/styles/main/home/index.module.scss";
import { GetServerSideProps, NextPage } from "next";
import { User } from "@/../shared/types/models";
import { GetFolderContentsRequestBody, GetFolderContentsResponse } from "@/../shared/types/api/storage";

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

	// * Page State
	// #region
	// Wether the just logged in modal will show up
	const [welcomeModalOpen, setWelcomeModalOpen] = React.useState(props.login);

	// Folders retrieved from the
	const [folderContents, setFolderContents] = React.useState<
		Array<{ isDirectory: boolean; fileName: string; fileSize: number }>
	>([]);
	const [currentPath, setCurrentPath] = React.useState("/");
	const [isLoadingContents, setIsLoadingContents] = React.useState<boolean>(true);
	// #endregion

	// * Page refs
	// #region
	const fileInput = React.useRef<HTMLInputElement>(null);
	// #endregion

	// * Functions
	// #region
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

	const getReadableFileSizeString = (fileSizeInBytes: number) => {
		var i = -1;
		var byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
		do {
			fileSizeInBytes /= 1024;
			i++;
		} while (fileSizeInBytes > 1024);

		return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
	};

	const uploadFile = async (event: any) => {
		event.preventDefault();
		event.target.submit();
	};

	const goBackOneLevel = () => {
		setIsLoadingContents(true);
		setCurrentPath(currentPath.replace(/\/[^\/]+\/$/, "/"));
	};
	// #endregion

	// * Page listeners
	// #region
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

					// Get the root folder contents
					const rootFolderResponse: AxiosResponse<GetFolderContentsResponse> = await axios({
						method: "POST",
						url: "/api/storage/get-folder-contents",
						params: {
							folderPath: "/",
						} as GetFolderContentsRequestBody,
					});

					if (typeof rootFolderResponse.data == "object") {
						setFolderContents(rootFolderResponse.data);
						setIsLoadingContents(false);
					}
				}
			}
		})();
	}, []);

	React.useEffect(() => {
		// Every time the user interacts with the folders, or changes paths
		// It will retrieve the folders on that path
		(async () => {
			const folderResponse: AxiosResponse<GetFolderContentsResponse> = await axios({
				method: "POST",
				url: "/api/storage/get-folder-contents",
				params: {
					folderPath: currentPath,
				} as GetFolderContentsRequestBody,
			});

			if (typeof folderResponse.data == "object") {
				setFolderContents(folderResponse.data);
				setIsLoadingContents(false);
			} else {
				// TODO: error handling here
			}
		})();
	}, [currentPath]);
	// #endregion

	// * Mapped Elements
	// #region
	const folderContentsElement = folderContents
		.sort((item) => {
			return item.isDirectory ? -1 : 1; // Folders are shown first
		})
		.map((file) => {
			if (!file.isDirectory) {
				return (
					<div
						key={file.fileName}
						className={`${styles["file"]} ${isLoadingContents ? styles["file-inactive"] : ""}`}
					>
						<img src="/svg/file.svg" alt="" />
						<p>
							{file.fileName} - {getReadableFileSizeString(file.fileSize)}
						</p>
						<br />
						<br />
					</div>
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
						<img src="/svg/folder.svg" alt="" />
						<p>{file.fileName}</p>
						<br />
						<br />
					</div>
				);
			}
		});
	// #endregion

	// * Page
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
						<img src="/svg/delete-bin.svg" alt="" />
						<img src="/svg/folder-plus.svg" alt="" />
						<img src="/svg/link.svg" alt="" />
						<img src="/svg/upload.svg" alt="upload" onClick={() => fileInput.current?.click()} />
					</div>

					{/* Folder path */}
					<div className={styles["path-navbar"]}>
						<p>Path: {currentPath}</p>
						{isLoadingContents && <img src="/svg/settings-cog.svg" alt="" />}
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
								<img src="/svg/folder.svg" alt="" />
								<p>..</p>
								<br />
								<br />
							</div>
						)}
						{folderContentsElement}
					</div>

					<form
						action="/api/storage/upload"
						onSubmit={uploadFile}
						method="POST"
						encType="multipart/form-data"
					>
						<input type="file" name="file" id="ew" />
						<input type="text" name="folderPath" placeholder="path" id="folderPath" />

						<input type="submit" value="Submit" />
					</form>
				</div>
			</main>
		</div>
	);
};

export default Home;
