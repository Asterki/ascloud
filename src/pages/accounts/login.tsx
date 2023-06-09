import { GetServerSideProps, NextPage } from "next";

import { motion } from "framer-motion";
import Link from "next/link";

import styles from "../../styles/accounts/login.module.scss";

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

const Login: NextPage = () => {
	return (
		<div className={styles["page"]}>
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
					className={styles["login-form"]}
				>
					<h1>Login</h1>
					<p>Login to your AsCloud account.</p>
					<br />
					<br />
					<input type="text" placeholder="Your Email" />
					<br />
					<br />
					<input type="text" placeholder="Your Password" />
					<br />
					<br />
					<button className={styles["register-button"]}>Login</button>
					<br />
					<br />
					<p>
						Don't have an account? <Link href="/register">Register</Link>
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

export default Login;
