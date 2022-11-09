import { ApiResponse } from "./axiosInterface"

export interface PostUserInterface {
    mobileNumber: string,
    password: string,
    'g-recaptcha-response': string
}

export interface GetUserInterface {
    _id: string,
    mobileNumber: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date | null,
    greeting?: string,
    va?: string
}

export interface GetUserReturnInterface extends ApiResponse {
    data: GetUserInterface
}

export interface PutUserInterface {
    firstName: string,
    lastName: string,
    dateOfBirth: Date | null
}

export interface VaInterface {
    name: string,
    value: string
}
