export interface LoginPayload {
	user: { email: string; password: string }
}

export interface RegisterPayload {
	user: { email: string; username: string; password: string }
}

export interface User {
	bio?: string
	email: string
	token?: string
	image?: string
	username: string
}

export interface AuthResponse {
	user: User
}
export interface RUsers {
	register(payload: RegisterPayload): Promise<AuthResponse>
	login(payload: LoginPayload): Promise<AuthResponse>
}
