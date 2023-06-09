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

const Login: NextPage = () => {
	return (
		<div>
			<main></main>

			<h1>watermelon</h1>
		</div>
	);
};

export default Login;
