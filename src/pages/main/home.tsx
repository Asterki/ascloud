import React from "react";
import { get, set } from "idb-keyval";
import axios, { AxiosResponse } from "axios";
import crypto from "crypto";

import Head from "next/head";
import Link from "next/link";
import Modal from "../../components/modal";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

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

	const [cryptoIV, setCryptoIV] = React.useState<string>("");
	const [cryptoKey, setCryptoKey] = React.useState<string>("");

	const [welcomeModalOpen, setWelcomeModalOpen] = React.useState(props.login);

	const cryptoMethods = {
		encrypt: (text: string, key: string, iv: string) => {
			const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
			let encrypted = cipher.update(text, "utf8", "hex");
			encrypted += cipher.final("hex");
			return encrypted;
		},
		decrypt: (encryptedText: string, key: string, iv: string) => {
			const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);
			let decrypted = decipher.update(encryptedText, "hex", "utf8");
			decrypted += decipher.final("utf8");
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
			await set("crypto-key", key);
			await set("crypto-iv", iv);

			setCryptoKey(key);
			setCryptoIV(iv);
		},
		generateKeys: () => {
			const newKey = cryptoMethods.generatePassword(32);
			const newIV = cryptoMethods.generatePassword(16);

			cryptoMethods.updateKeys(newKey, newIV);
		},
	};

	React.useEffect(() => {
		(async () => {
			const retrievedKey = await get("crypto-key");
			const retrievedIV = await get("crypto-iv");

			// If no key, open modal to ask user for the key
			if (!retrievedKey || !retrievedIV) {
				setWelcomeModalOpen(true);
			} else {
				setCryptoKey(retrievedKey);
				setCryptoIV(retrievedIV);
			}
		})();
	}, []);

	return (
		<div className={styles["page"]}>
			<Modal modalOpen={welcomeModalOpen} modalTitle="Welcome">
				<h1>Hey there</h1>
			</Modal>

			<main>
				<h1>watermelon</h1>
				<h1>hello {props.user.username}</h1>
			</main>
		</div>
	);
};

export default Home;
