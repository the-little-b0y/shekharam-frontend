import { ApiResponse } from "./axiosInterface"
import { GetUserInterface } from "./userInterface"

export interface AuthUserInterface {
    mobileNumber: string,
    password: string
}

export interface ReduxInterface {
    accesstoken: string,
    refreshtoken: string,
    user: GetUserInterface | {}
}

interface AuthUserDataInterface {
    userid: string,
    mobileNumber: string,
    tokenType: string,
    accessToken: string, 
    refreshToken: string,
}

interface AccessTokenDataInterface {
    accessToken: string
}

export interface AuthUserReturnInterface extends ApiResponse {
    data: AuthUserDataInterface
}

export interface AccessTokenReturnInterface extends ApiResponse {
    data: AccessTokenDataInterface
}
