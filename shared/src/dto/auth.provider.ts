export const AuthProvider = {
	LOCAL: "local",
	GOOGLE: "google",
	MICROSOFT: "microsoft",
	APPLE: "apple",
} as const;

export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];
