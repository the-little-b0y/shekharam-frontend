import { FunctionComponent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, OutlinedInput, InputAdornment, IconButton, FormControl, InputLabel, Button, Typography, Grid } from '@mui/material';
import { darken } from '@mui/material/styles';
import Logo from '../../components/common/logo';
import PhoneInput from 'react-phone-input-2'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { themeProperties } from '../../constants/themeProperties';
import { useSnackbar } from 'notistack';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { authenticate } from '../../services/authServices';
import { AuthUserInterface } from '../../contracts/authInterface';
import { useDispatch } from 'react-redux'
import { setUser, setAccesstoken, setRefreshtoken } from '../../redux/authSlice';
import { getUser } from '../../services/userServices';
import Loading from '../../components/common/loading';

const style = {
    loginButton: {
        width: '100%',
        marginTop: '13px',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1),
        }
    }
}

interface Props {
  
}

const Login: FunctionComponent<Props> = ()  => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch()

    const [loading, setLoading] = useState<boolean>(false)
    const [mobileNumber, setMobileNumber] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const login = async() => {
        if(mobileNumber.length === 0) {
            enqueueSnackbar('Please enter a Mobile Number', { variant: "warning", preventDuplicate: true })
        } else {
            const parsedMobileNumber = parsePhoneNumber(`+${mobileNumber}`)
            if(!isValidPhoneNumber(parsedMobileNumber.nationalNumber, parsedMobileNumber.country)) {
                enqueueSnackbar('Please enter a valid Mobile Number', { variant: "warning", preventDuplicate: true })
            } else if(password.length === 0) {
                enqueueSnackbar('Please enter a Password', { variant: "warning", preventDuplicate: true })
            } else {
                try {
                    setLoading(true)
                    const user: AuthUserInterface = {
                        mobileNumber,
                        password
                    }
                    const response = await authenticate(user)
                    enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
                    dispatch(setAccesstoken(response.data.accessToken))
                    dispatch(setRefreshtoken(response.data.refreshToken))
                    const response1 = await getUser()
                    dispatch(setUser(response1.data))
                    if(response1.data.firstName) {
                        navigate('/dashboard')
                    } else {
                        navigate('/setup')
                    }
                    setLoading(false)
                } catch (error) {
                    setLoading(false)
                }
            }
        }
    }

    if(loading) {
        return (
            <Loading />
        )
    } else {
        return (
            <Box 
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="97vh"
            >
                <Grid 
                    spacing={3}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={12} md={4}>
                        <Box 
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection={'column'}
                            bgcolor={themeProperties.colors.secondary}
                            borderRadius={'15px'}
                            p={'30px'}
                        >
                            <Logo size='md' />
                            <PhoneInput
                                containerStyle={{marginTop: '40px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.xs}}
                                inputStyle={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.xs, width: '100%'}}
                                specialLabel={'Mobile Number'}
                                country={'in'}
                                placeholder={''}
                                value={mobileNumber}
                                onChange={value => setMobileNumber(value)}
                            />
                            <FormControl sx={{width: '100%', marginTop: '13px', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password" sx={{fontSize: themeProperties.fontSize.xs}}>Password</InputLabel>
                                <OutlinedInput
                                    sx={{fontSize: themeProperties.fontSize.xs}}
                                    id="outlined-adornment-password"
                                    label={'Password'}
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(prev => !prev)}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <Button variant="contained" disableElevation sx={style.loginButton} onClick={login}>
                                Login
                            </Button>
                            <Typography sx={{marginTop: '13px', fontSize: themeProperties.fontSize.xs}}>
                                New here ? <span style={{color: themeProperties.colors.button, cursor: 'pointer'}} onClick={() => navigate('/register')}>Create an Account</span>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default Login;
