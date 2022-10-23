import { FunctionComponent } from 'react'
import axios, { AxiosError } from 'axios';
import { useSnackbar, WithSnackbarProps } from 'notistack'
import { ApiResponse } from '../contracts/axiosInterface';

let useSnackbarRef: WithSnackbarProps

export const SnackbarUtilsConfigurator: FunctionComponent = () => {
    useSnackbarRef = useSnackbar()
    return null
}

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
        } 
    }
    return Promise.reject(error);
});

export default axios
