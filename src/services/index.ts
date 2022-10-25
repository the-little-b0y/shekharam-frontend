import { FunctionComponent } from 'react'
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useSnackbar, WithSnackbarProps } from 'notistack'
import { ApiResponse } from '../contracts/axiosInterface';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setUser, setAccesstoken, setRefreshtoken } from '../redux/authSlice';

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
}, (error: AxiosError) => {
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
        } else if(status === 401  && data.errors && data.errors.length > 0 && data.errors[0].msg === "TokenExpiredError") {
            //refreshtoken
        }
    }
    return Promise.reject(error);
});

export default axios
