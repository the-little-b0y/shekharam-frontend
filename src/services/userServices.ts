import axios from './index'
import { GetUserReturnInterface, PostUserInterface, PutUserInterface } from '../contracts/userInterface';
import { ApiResponse } from '../contracts/axiosInterface';

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
const USERSERVICE_ROUTE = `${BACKEND_API_URL}/user`

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
