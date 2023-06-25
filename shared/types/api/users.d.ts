// Activate TFA
interface ActivateTFARequestBody {}

type ActivateTFAResponse = "unauthorized" | "done" | "invalid-parameters" | "server-error" | "invalid-code";

// Deactivate TFA
interface DeactivateTFARequestBody {}

type DeactivateTFAResponse = "unauthorized" | "done" | "invalid-parameters" | "server-error" | "invalid-password";

export type { ActivateTFARequestBody, ActivateTFAResponse, DeactivateTFARequestBody, DeactivateTFAResponse };
