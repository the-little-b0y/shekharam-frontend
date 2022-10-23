import axios from './index'
import { PostUserInterface } from '../contracts/userInterface';
import { ApiResponse } from '../contracts/axiosInterface';

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
const AUTHSERVICE_ROUTE = `${BACKEND_API_URL}/user`

export const postUser = async (user: PostUserInterface) => {
    const response = await axios.post<ApiResponse>(AUTHSERVICE_ROUTE, user)
    return response.data
}