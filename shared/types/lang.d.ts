declare const LangPack: {
    main: {
        index: {
            title: string;
        }
    }
    accounts: {
        register: {
            pageTitle: string;

            modal: {
                close: string;

                errors: {
                    "": "";
                    "username-size": string;
                    "alphanumeric": string;

                    "invalid-email": string;
                    "password-size": string;
                    "password-match": string;

                    "username-in-use": string;
                    "unknown": string;
                }
            }

            form: {
                title: string;
                caption: string;

                usernamePlaceholder: string;
                emailPlaceholder: string;
                passwordPlaceholder: string;
                repeatPasswordPlaceholder: string;

                activateTFA: string;
                register: string;

                haveAccount: string;
            }

            footer: string;
        },
        login: {
            pageTitle: string;

            form: {
                title: string;
                caption: string;

                emailUsernamePlaceholder: string;
                passwordPlaceholder: string;

                login: string;

                noAccount: string;
            },

            tfaModal: {
                title: string;
                placeholder: string;
                submit: string;
            },

            errorModal: {
                title: string;
                close: string;

                errors: {
                    "invalid-credentials": string;
                    "invalid-tfa-code": string;
                    "server-error": string;
                    "invalid-parameters": string;
                }
            }

            footer: string;
        }
    }
}

export default LangPack;