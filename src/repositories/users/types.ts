import type { Res, Paginate } from '../types'

export interface User {
	id?: number
	email: string
	code?: string
	mobile: string
	avatar?: string
	last_name: string
	first_name: string
	password?: string
	avatar_url?: string
	is_active?: boolean
	national_code: string
	password_confirmation?: string
}

export type UpdatePayload = {
	id: number
	first_name?: string
	last_name?: string
	email?: string
	national_code?: string
	mobile?: string
}

export interface Role {
	id: number
	name: string
	display_name: string
	hierarchal: number
	type: string
	is_tree: boolean
	scopes: string[]
	created_at: Date
	updated_at: Date
	permissions: Permission[]
}

export interface Permission {
	id: number
	name: string
	display_name: string
	group: string
	display_group: string
	scopes: null
	created_at: null
	updated_at: null
	pivot: { role_id: number; permission_id: number }
}

export interface ManageSystemRolesPayload {
	action: 'attach' | 'detach'
	user_id: number
	role_ids: number[]
}

export type Users = Paginate<User>

export interface GetUsersPayload {
	page?: number
	name?: string
	mobile?: number
	itemPerPage?: number
	national_code?: number
}

export interface RUsers {
	// ! users
	updateUser(payload: UpdatePayload): Res<User>
	insertUser(payload: User): Res<User>
	getUsers(payload: GetUsersPayload): Res<Users>
	getUser(payload: { id?: number; nationalCode?: string }): Res<User> | 'done'
	changePasswordToNationalCode(payload: { id: number; password: string }): Res<User>
	deleteUser(id: number): Res

	// ! roles
	getRoles(id: number): Res<Role[]>
	getAllRoles(): Res<Role[]>
	manageSystemRoles(payload: ManageSystemRolesPayload): Res<string>
	getSystemUsers(payload: { page: number; itemPerPage: number }): Res<Users>
}
