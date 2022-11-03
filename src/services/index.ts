import { FunctionComponent } from 'react'
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useSnackbar, WithSnackbarProps } from 'notistack'
import { ApiResponse } from '../contracts/axiosInterface';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setUser, setAccesstoken, setRefreshtoken } from '../redux/authSlice';
import { AccessTokenReturnInterface } from '../contracts/authInterface';

let useSnackbarRef: WithSnackbarProps
let useDispatchRef: Dispatch

export const SnackbarUtilsConfigurator: FunctionComponent = () => {
    useSnackbarRef = useSnackbar()
    useDispatchRef = useDispatch();
    return null
}

axios.interceptors.request.use((config: AxiosRequestConfig) => {
    const accesstoken = localStorage.getItem('accesstoken');
    config.headers = config.headers ?? {};
    config.headers.Authorization = accesstoken && accesstoken.length > 0 ? `Bearer ${accesstoken}` : null;
    return config;
});

axios.interceptors.response.use((response) => {
    return response;
}, async (error: AxiosError) => {
    if(error.response) {
        const status = error.response.status
        const data = error.response.data as ApiResponse
        if(status === 400 && data.errors && data.errors.length > 0) {
            useSnackbarRef.enqueueSnackbar(data.errors[0].msg, { variant: "warning", preventDuplicate: true })                
        } else if(status === 422) {
            useSnackbarRef.enqueueSnackbar(data.message, { variant: "warning", preventDuplicate: true })
        } else if(status === 500) {
            useSnackbarRef.enqueueSnackbar(data.message, { variant: "warning", preventDuplicate: true })
        } else if(status === 401  && data.errors && data.errors.length > 0 && data.errors[0].msg !== "TokenExpiredError") {
            useDispatchRef(setAccesstoken(''))
            useDispatchRef(setRefreshtoken(''))
            useDispatchRef(setUser({}))
            localStorage.clear(); 
            useSnackbarRef.enqueueSnackbar(data.message, { variant: "warning", preventDuplicate: true })
            useSnackbarRef.enqueueSnackbar('Redirecting to Login', { variant: "info", preventDuplicate: true })
            setTimeout(() => window.location.replace('/login'), 3000)
        } else if(status === 401  && data.errors && data.errors.length > 0 && data.errors[0].msg === "TokenExpiredError") {
            const prevRequest = error.config;
            const refreshtoken = localStorage.getItem('refreshtoken');
            const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
            const AUTHSERVICE_ROUTE = `${BACKEND_API_URL}/auth`
            const REFRESHTOKEN_ROUTE = `${AUTHSERVICE_ROUTE}/refreshtoken`
            const refreshresponse = await axios.post<AccessTokenReturnInterface>(REFRESHTOKEN_ROUTE, {refreshtoken: refreshtoken});
            const accesstoken = refreshresponse.data.data.accessToken
            useDispatchRef(setAccesstoken(accesstoken));
            return axios({...prevRequest, headers: {...prevRequest?.headers, Authorization: (accesstoken && accesstoken.length > 0) ? `Bearer ${accesstoken}` : null}});
        }
    }
    return Promise.reject(error);
});

export default axios
