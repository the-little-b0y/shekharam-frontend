import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetUserInterface } from '../contracts/userInterface';

const initAccessToken: string = ''
const initRefreshToken: string = ''
const initUser: GetUserInterface | {} = {}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        accesstoken: initAccessToken,
        refreshtoken: initRefreshToken,
        user: initUser,
    },
    reducers: {
        setAccesstoken: (state, param: PayloadAction<string>) => {
            const { payload } = param;
            localStorage.setItem('accesstoken', payload);
            state.accesstoken = payload
        },
        setRefreshtoken: (state, param: PayloadAction<string>) => {
            const { payload } = param;
            localStorage.setItem('refreshtoken', payload);
            state.refreshtoken = payload
        },
        setUser: (state, param: PayloadAction<GetUserInterface | {}>) => {
            const { payload } = param;
            localStorage.setItem('user', JSON.stringify(payload));
            state.user = payload
        },
    }
});

const { actions, reducer } = authSlice

export const { setAccesstoken, setRefreshtoken, setUser } = actions;
export default reducer;