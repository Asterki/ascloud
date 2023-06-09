import { GetServerSideProps, NextPage } from "next";

import { motion } from "framer-motion";
import Link from "next/link";

import styles from "../../styles/accounts/register.module.scss";

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
					className={styles["register-form"]}
				>
					<h1>Register</h1>
					<p>Create an AsCloud account.</p>
					<br />
					<br />
					<input type="text" placeholder="Your Email" />
					<br />
					<br />
					<input type="text" placeholder="Your Password" />
					<br />
					<br />
					<input type="text" placeholder="Repeat Your Password" />
					<br />
					<br />
					<div className={styles["activate-tfa-input"]}>
						<input type="checkbox" id="activate-tfa" />
						<label htmlFor="activate-tfa">Activate 2FA (Recommended)</label>
					</div>
					<br />
					<br />
					<button className={styles["register-button"]}>Register</button>
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
