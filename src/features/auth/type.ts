export type LoginRequest = {
    email: string;
    password: string;
}

export type RegisterRequest = {
    email: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
}


export type LoginResponse = {
    email: string;
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