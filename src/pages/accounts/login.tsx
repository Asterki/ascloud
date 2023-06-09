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
				></motion.div>
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
