interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
}

type RegisterResponse = "username-email-in-use" | "done" | "server-error" | "invalid-parameters"

interface LoginRequestBody {
    usernameOrEmail: string;
    password: string;
    tfaCode: string;
}

type LoginResponse = "invalid-credentials" | "requires-tfa" | "invalid-tfa-code" | "server-error" | "invalid-parameters" | "done"

export type { RegisterRequestBody, RegisterResponse, LoginRequestBody, LoginResponse }