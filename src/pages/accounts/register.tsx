import { GetServerSideProps, NextPage } from "next";

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
				<div className={styles["register-form"]}>
					<h1>Register</h1>
					<p>Create an AsCloud account.</p>
					<br />
					<br />
					<input type="text" placeholder="Your Email" />
					<br /> <br />
					<input type="text" placeholder="Your Password" />
					<br /> <br />
					<input type="text" placeholder="Repeat Your Password" />
					<br />
					<br />
					<div className={styles["activate-tfa-input"]}>
						<input type="checkbox" id="activate-tfa" />
						<label htmlFor="activate-tfa">Activate 2FA (Recommended)</label>
					</div>
					<br /> <br />
					<button className={styles["register-button"]}>Register</button>
				</div>
			</main>
		</div>
	);
};

export default Register;
