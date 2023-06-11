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
					store.dispatch(setKeys({ iv: retrievedIV, key: retrievedIV }));
				}
			}
		})();
	}, []);

	return (
		<div className={styles["page"]}>
			{/* <Modal modalOpen={welcomeModalOpen} modalTitle="Welcome">
				<h1>Hey there</h1>
			</Modal> */}

			<Head>
				<title>AsCloud - Home</title>
			</Head>

			<main>
				<h1>watermelon</h1>
				<h1>hello {props.user.username}</h1>
			</main>
		</div>
	);
};

export default Home;
