import React from "react";
import axios, { AxiosResponse } from "axios";

import { z } from "zod";
import validator from "validator";

import Head from "next/head";
import Link from "next/link";
import Modal from "../../components/modal";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import { useSelector } from "react-redux";
import { RootState } from "../../store";

import styles from "../../styles/accounts/register.module.scss";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.isAuthenticated())
		return {
			redirect: {
				destination: "/home",
				permanent: false,
			},
		};

	return {
		props: {},
	};
};

const Register: NextPage = () => {
	const appState = useSelector((state: RootState) => state);
	const lang = appState.page.lang.main.index;
	const router = useRouter();

	const [modalState, setModalState] = React.useState({
		open: false,
		title: "",
		message: "",
	});

	const emailInput = React.useRef<HTMLInputElement>(null);
	const usernameInput = React.useRef<HTMLInputElement>(null);
	const passwordInput = React.useRef<HTMLInputElement>(null);
	const repeatPasswordInput = React.useRef<HTMLInputElement>(null);
	const activateTFAInput = React.useRef<HTMLInputElement>(null);

	const register = async () => {
		// Local tests before sending the request
		const email = emailInput.current!.value;
		const username = usernameInput.current!.value;
		const password = passwordInput.current!.value;
		const repeatPassword = repeatPasswordInput.current!.value;

		// Generally this is to ensure the user didn't typed out random things
		if (password !== repeatPassword) return setModalState({ open: true, title: "Error", message: "password-match" });

		// All of these conditions are re-checked in the server
		try {
			const parsedBody = z
				.object({
					username: z
						.string()
						.min(3, { message: "username-size" })
						.max(16, { message: "username-size" })
						.refine(
							(username) => {
								return validator.isAlphanumeric(username, "en-GB", {
									ignore: "._",
								});
							},
							{ message: "alphanumeric" }
						),
					email: z.string().refine(validator.isEmail, { message: "invalid-email" }),
					password: z.string().min(6, { message: "password-size" }).max(256, { message: "password-size" }),
				})
				.required()
				.safeParse({ email: email, username: username, password: password });

			if (!parsedBody.success && "error" in parsedBody)
				return setModalState({ open: true, title: "Error", message: parsedBody.error.errors[0].message });

			// Send the request
			const response: AxiosResponse = await axios({
				url: "/api/accounts/register",
				method: "POST",
				data: parsedBody.data,
			});

			// Switch on the response
			switch (response.data) {
				case "username-email-in-use":
					setModalState({ open: true, title: "Error", message: "username-in-use" });
					break;

				case "server-error":
					setModalState({ open: true, title: "Error", message: "unknown" });
					break;

				case "done":
					router.push("/home");
					break;
			}
		} catch (error: unknown) {
			console.log(error);
			return setModalState({ open: true, title: "Error", message: "unknown" });
		}
	};

	return (
		<div className={styles["page"]}>
			<Modal modalOpen={modalState.open} modalTitle={modalState.title}>
				<p>{modalState.message}</p>

				<button
					onClick={() => {
						setModalState({ ...modalState, open: false });
					}}
				>
					Close
				</button>
			</Modal>

			<main>
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
					className={styles["register-form"]}
				>
					<h1>Register</h1>
					<p>Create an AsCloud account.</p>
					<br />
					<br />
					<input type="text" placeholder="Your Username" ref={usernameInput} />
					<br />
					<br />
					<input type="text" placeholder="Your Email" ref={emailInput} />
					<br />
					<br />
					<input type="text" placeholder="Your Password" ref={passwordInput} />
					<br />
					<br />
					<input type="text" placeholder="Repeat Your Password" ref={repeatPasswordInput} />
					<br />
					<br />
					<div className={styles["activate-tfa-input"]}>
						<input type="checkbox" id="activate-tfa" ref={activateTFAInput} />
						<label htmlFor="activate-tfa">Activate 2FA (Recommended)</label>
					</div>
					<br />
					<br />
					<button className={styles["register-button"]} onClick={register}>
						Register
					</button>
					<br />
					<br />
					<p>
						Already have an account? <Link href="/login">Login</Link>
					</p>
				</motion.div>
			</main>

			<div className={styles["footer"]}>
				<p>
					Open source at <Link href="https://github.com/Asterki/ascloud">GitHub</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
