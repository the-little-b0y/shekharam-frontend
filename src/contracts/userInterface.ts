import { ApiResponse } from "./axiosInterface"

export interface PostUserInterface {
    mobileNumber: string,
    password: string
}

export interface GetUserInterface {
    _id: string,
    mobileNumber: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date | null
}

export interface GetUserReturnInterface extends ApiResponse {
    data: GetUserInterface
}

export interface PutUserInterface {
    firstName: string,
    lastName: string,
    dateOfBirth: Date | null
}
