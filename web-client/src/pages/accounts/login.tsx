// * Imports
// Lib Imports
import React from "react";
import axios, { AxiosResponse } from "axios";
import { z } from "zod";

// Component Imports
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Modal from "@/components/modal";

// State Imports
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Styles And Types Imports
import styles from "@/styles/accounts/login.module.scss";
import { GetServerSideProps, NextPage } from "next";
import * as AccountServiceAPITypes from "../../../../shared/types/api/accounts";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	// Check if the user is logged in
	if (context.req.isAuthenticated())
		return {
			redirect: {
				destination: "/home", // If so, return to the home page
				permanent: false,
			},
		};

	return {
		props: {},
	};
};

const Login: NextPage = () => {
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.accounts.login;
	const router = useRouter();

	// * Page State
	// #region
	const [errorModalState, setErrorModalState] = React.useState({
		open: false,
		title: "",
		message: "",
	});
	const [TFAModalOpen, setTFAModalOpen] = React.useState(false);
	// #endregion

	// * Refs
	// #region
	const usernameOrEmailInput = React.useRef<HTMLInputElement>(null);
	const passwordInput = React.useRef<HTMLInputElement>(null);
	const TFAInput = React.useRef<HTMLInputElement>(null);
	// #endregion

	// * Page functions
	const login = async () => {
		// Handle login
		const usernameOrEmail = usernameOrEmailInput.current!.value;
		const password = passwordInput.current!.value;
		const TFACode = TFAInput.current!.value;

		try {
			const parsedBody = z
				.object({
					usernameOrEmail: z.string().min(3, { message: "fill" }),
					password: z.string().min(1, { message: "fill" }),
					tfaCode: z.string().optional(),
				})
				.required()
				.safeParse({
					usernameOrEmail: usernameOrEmail,
					password: password,
					tfaCode: TFACode,
				});

			if (!parsedBody.success && "error" in parsedBody)
				return setErrorModalState({
					open: true,
					title: "Error",
					message:
						lang.errorModal.errors[
							parsedBody.error.errors[0].message as keyof typeof lang.errorModal.errors
						],
				});

			// Send the request
			const response: AxiosResponse<AccountServiceAPITypes.LoginResponse> = await axios({
				url: "/api/accounts/login",
				method: "POST",
				data: parsedBody.data as AccountServiceAPITypes.LoginRequestBody,
			});

			switch (response.data) {
				case "done":
					router.push("/home?login=true");
					break;

				case "requires-tfa":
					setTFAModalOpen(true);
					break;

				case "invalid-parameters":
					router.push("/");

				default:
					setErrorModalState({
						open: true,
						title: "Error",
						message: lang.errorModal.errors[response.data],
					});
			}
		} catch (error: unknown) {
			console.log(error);
			return setErrorModalState({
				open: true,
				title: "Error",
				message: lang.errorModal.errors["server-error"],
			});
		}
	};

	// * Page
	return (
		<div className={styles["page"]}>
			{/* Modals out of the main content of the page */}
			<Modal modalOpen={errorModalState.open} modalTitle={errorModalState.title}>
				<p>{errorModalState.message}</p>

				<button
					onClick={() => {
						setErrorModalState({ ...errorModalState, open: false });
					}}
				>
					{lang.errorModal.close}
				</button>
			</Modal>
			<Modal modalOpen={TFAModalOpen} modalTitle={lang.tfaModal.title}>
				<input type="text" placeholder={lang.tfaModal.placeholder} ref={TFAInput} />

				<button
					onClick={() => {
						setTFAModalOpen(false);
					}}
				>
					{lang.tfaModal.submit}
				</button>
			</Modal>

			{/* Custom head tags for the page */}
			<Head>
				<title>{lang.pageTitle}</title>
			</Head>

			<main>
				{/* Login form */}
				<motion.div
					variants={{
						visible: {
							opacity: 1,
							y: 0,
							transition: { duration: 0.3 },
							display: "block",
						},
						hidden: {
							opacity: 0,
							y: -100,
							transition: { duration: 0.3 },
							transitionEnd: {
								display: "none",
							},
						},
					}}
					initial="hidden"
					animate="visible"
					className={styles["login-form"]}
				>
					<h1>{lang.form.title}</h1>
					<p>{lang.form.caption}</p>
					<br />
					<br />
					<input type="text" placeholder={lang.form.emailUsernamePlaceholder} ref={usernameOrEmailInput} />
					<br />
					<br />
					<input type="password" placeholder={lang.form.passwordPlaceholder} ref={passwordInput} />
					<br />
					<br />
					<button className={styles["register-button"]} onClick={login}>
						{lang.form.login}
					</button>
					<br />
					<br />
					<p>
						{lang.form.noAccount.split("&")[0]}{" "}
						<Link href="/register">{lang.form.noAccount.split("&")[1]}</Link>
					</p>
				</motion.div>
			</main>

			{/* Footer */}
			<div className={styles["footer"]}>
				<p>
					{lang.footer} <Link href="https://github.com/Asterki/ascloud">GitHub</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
