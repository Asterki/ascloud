import LangPack from "../types/lang";

const template: typeof LangPack = {
    main: {
        index: {
            title: ""
        }
    },

    accounts: {
        register: {
            pageTitle: "",

            modal: {
                close: "",

                errors: {
                    "": "",
                    "username-size": "",
                    "alphanumeric": "",

                    "invalid-email": "",
                    "password-size": "",
                    "password-match": "",

                    "username-in-use": "",
                    "unknown": "",
                }
            },

            form: {
                title: "",
                caption: "",

                usernamePlaceholder: "",
                emailPlaceholder: "",
                passwordPlaceholder: "",
                repeatPasswordPlaceholder: "",

                activateTFA: "",
                register: "",

                haveAccount: "",
            },

            footer: "",
        }
    }
}

export default template;