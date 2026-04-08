export type LoginRequest = {
    email: string;
    password: string;
}

export type LoginResponse = {
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    avatar: string;
    role: string;
}

export type UserDTO = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    avatar: string;
    role: string;
}