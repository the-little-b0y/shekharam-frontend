import axios from './index'
import { AuthUserInterface, AuthUserReturnInterface } from '../contracts/authInterface';

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
const AUTHSERVICE_ROUTE = `${BACKEND_API_URL}/auth`

export const authenticate = async (user: AuthUserInterface) => {
    const response = await axios.post<AuthUserReturnInterface>(AUTHSERVICE_ROUTE, user)
    return response.data
}
