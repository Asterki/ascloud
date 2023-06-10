import LangPack from "../types/lang";

const en: typeof LangPack = {
    main: {
        index: {
            title: "Welcome to the site"
        }
    },

    accounts: {
        register: {
            pageTitle: "AsCloud - Register",

            modal: {
                close: "Close",

                errors: {
                    "": "",
                    "username-size": "Usernames must be between 3 and 16 characters long",
                    "alphanumeric": "Usernames can't contain special characters other than underscores (_) and dots (.)",

                    "invalid-email": "Please enter a valid email",
                    "password-size": "Passwords must be between 6 and 256 characters long",
                    "password-match": "Password do not match",

                    "username-in-use": "That username or email is already in use, please try again",
                    "unknown": "Something went wrong, please try again later",
                }
            },

            form: {
                title: "Register",
                caption: "Create an AsCloud account.",

                usernamePlaceholder: "Your Username",
                emailPlaceholder: "Your Email",
                passwordPlaceholder: "Your Password",
                repeatPasswordPlaceholder: "Repeat Password",

                activateTFA: "Activate 2FA (Recommended)",
                register: "Register",

                haveAccount: "Already have an account? & Login",
            },

            footer: "Open source at",
        }
    }
}

export default en;