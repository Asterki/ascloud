import React from "react";
import { get, set } from "idb-keyval";
import axios, { AxiosResponse } from "axios";
import crypto from "crypto";

import Head from "next/head";
import Link from "next/link";
import Modal from "../../components/modal";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import { store, RootState } from "@/store";
import { useSelector } from "react-redux";
import { setKeys } from "@/store/keysSlice";

import styles from "../../styles/main/home.module.scss";
import { User } from "../../../shared/types/models";
import { GetServerSideProps, NextPage } from "next";
import {
	GetFolderContentsRequestBody,
	GetFolderContentsResponse,
} from "../../../shared/types/api/storage";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (!context.req.isAuthenticated())
		return {
			redirect: {
				destination: "/login",
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
	const router = useRouter();
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.accounts.register;
	const keys = appState.keys;

	const [welcomeModalOpen, setWelcomeModalOpen] = React.useState(props.login);
	const [folderContents, setFolderContents] = React.useState<
		Array<{ isDirectory: boolean; fileName: string; fileSize: number }>
	>([]);
	const [currentPath, setCurrentPath] = React.useState("/");

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

	React.useEffect(() => {
		(async () => {
			if (!keys.storageIV || !keys.storageKey) {
				const retrievedKey: string | undefined = await get(
					"crypto-key"
				);
				const retrievedIV: string | undefined = await get("crypto-iv");

				// If no key, open modal to ask user for the key
				if (!retrievedKey || !retrievedIV) {
					setWelcomeModalOpen(true);
					cryptoMethods.generateKeys();
				} else {
					store.dispatch(
						setKeys({ iv: retrievedIV, key: retrievedKey })
					);

					// Get the root folder contents
					const rootFolderResponse: AxiosResponse<GetFolderContentsResponse> =
						await axios({
							method: "POST",
							url: "/api/storage/get-folder-contents",
							params: {
								folderPath: "/",
							} as GetFolderContentsRequestBody,
						});

					if (typeof rootFolderResponse.data == "object")
						setFolderContents(rootFolderResponse.data);
				}
			}
		})();
	}, []);

	React.useEffect(() => {
		(async () => {
			const folderResponse: AxiosResponse<GetFolderContentsResponse> =
				await axios({
					method: "POST",
					url: "/api/storage/get-folder-contents",
					params: {
						folderPath: currentPath,
					} as GetFolderContentsRequestBody,
				});

			if (typeof folderResponse.data == "object")
				setFolderContents(folderResponse.data);
		})();
	}, [currentPath]);

	const folderContentsElement = folderContents
		.sort((item) => {
			return item.isDirectory ? -1 : 1; // Folders are shown first
		})
		.map((file) => {
			if (!file.isDirectory) {
				return (
					<div className={styles["file"]}>
						<img src="/svg/file.svg" alt="" />
						<p>
							{file.fileName} -{" "}
							{getReadableFileSizeString(file.fileSize)}
						</p>
						<br />
						<br />
					</div>
				);
			} else {
				return (
					<div
						onClick={() =>
							setCurrentPath(`${currentPath}${file.fileName}/`)
						}
						className={styles["folder"]}
					>
						<img src="/svg/folder.svg" alt="" />
						<p>{file.fileName}</p>
						<br />
						<br />
					</div>
				);
			}
		});

	const goBackOneLevel = () => {
		setCurrentPath(currentPath.replace(/\/[^\/]+\/$/, "/"));
	};

	return (
		<div className={styles["page"]}>
			{/* <Modal modalOpen={welcomeModalOpen} modalTitle="Welcome">
				<h1>Hey there</h1>
			</Modal> */}

			<Head>
				<title>AsCloud - Home</title>
			</Head>

			<main>
				<h1>Home page</h1>

				<button onClick={goBackOneLevel}>go back</button>

				<p>Path: {currentPath}</p>

				<br />

				<div className={styles["current-folder"]}>
                    <div className={styles["folder-navbar"]}>
                        <img src="/svg/delete-bin.svg" alt="" />
                        <img src="/svg/folder-plus.svg" alt="" />
                        <img src="/svg/link.svg" alt="" />
                        <img src="/svg/upload.svg" alt="" />
                    </div>

					<div className={styles["folder-view"]}>
						{folderContentsElement}
					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;
