// Register
interface RegisterRequestBody {
	username: string;
	email: string;
	password: string;
}

type RegisterResponse = "username-email-in-use" | "done" | "server-error" | "invalid-parameters";

// Delete account
interface DeleteAccountRequestBody {
	password: string;
	tfaCode: string;
}

type DeleteAccountResponse =
	| "invalid-tfa"
	| "invalid-password"
	| "invalid-parameters"
	| "requires-tfa"
	| "done"
	| "unauthorized"
	| "server-error";

// Login
interface LoginRequestBody {
	usernameOrEmail: string;
	password: string;
	tfaCode: string;
}

type LoginResponse =
	| "invalid-credentials"
	| "requires-tfa"
	| "invalid-tfa-code"
	| "server-error"
	| "invalid-parameters"
	| "done";

// Logout
type LogoutResponse = "done" | "server-error";

export type {
	RegisterRequestBody,
	RegisterResponse,
	LoginRequestBody,
	LoginResponse,
	LogoutResponse,
	DeleteAccountRequestBody,
	DeleteAccountResponse,
};
