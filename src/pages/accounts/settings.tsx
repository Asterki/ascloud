import React from "react";

import styles from "../../styles/main/settings.module.scss";
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

const Settings: NextPage<PageProps> = (props) => {
    return (
        <div>
            <h1>jewoqje</h1>
        </div>
    );
}
 
export default Settings;