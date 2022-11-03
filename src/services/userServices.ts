import axios from './index'
import { GetUserReturnInterface, PostUserInterface, PutUserInterface } from '../contracts/userInterface';
import { ApiResponse } from '../contracts/axiosInterface';

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
const USERSERVICE_ROUTE = `${BACKEND_API_URL}/user`
const AVATARGREETING_ROUTE = `${USERSERVICE_ROUTE}/avatar`
const PASSWORDRESET_ROUTE = `${USERSERVICE_ROUTE}/passwordreset`

export const postUser = async (user: PostUserInterface) => {
    const response = await axios.post<ApiResponse>(USERSERVICE_ROUTE, user)
    return response.data
}

export const getUser = async () => {
    const response = await axios.get<GetUserReturnInterface>(USERSERVICE_ROUTE)
    return response.data
}

export const putUser = async (user: PutUserInterface) => {
    const response = await axios.put<ApiResponse>(USERSERVICE_ROUTE, user)
    return response.data
}

export const putAvatarGreeting = async (avatar: string, greeting: string) => {
    const avatarGreeting = { avatar, greeting }
    const response = await axios.put<ApiResponse>(AVATARGREETING_ROUTE, avatarGreeting)
    return response.data
}

export const putRestPassword = async (currentpassword: string, newpassword: string) => {
    const password = { currentpassword, newpassword }
    const response = await axios.put<ApiResponse>(PASSWORDRESET_ROUTE, password)
    return response.data
}
