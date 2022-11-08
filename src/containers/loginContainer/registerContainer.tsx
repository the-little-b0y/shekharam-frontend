import { FunctionComponent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Grid, Box, OutlinedInput, InputAdornment, IconButton, FormControl, InputLabel, Button, Typography, FormControlLabel, Radio } from '@mui/material';
import { darken } from '@mui/material/styles';
import Logo from '../../components/common/logo';
import PhoneInput from 'react-phone-input-2'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { themeProperties } from '../../constants/themeProperties';
import { useSnackbar } from 'notistack';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { PostUserInterface } from '../../contracts/userInterface';
import { getUser, postUser } from '../../services/userServices';
import { specialCharactersRegex } from '../../constants/regex';
import { authenticate } from '../../services/authServices';
import { setUser, setAccesstoken, setRefreshtoken } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import Loading from '../../components/common/loading';

const style = {
    registerButton: {
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

const Register: FunctionComponent<Props> = ()  => {
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

    const register = async() => {
        if(mobileNumber.length === 0) {
            enqueueSnackbar('Please enter a Mobile Number', { variant: "warning", preventDuplicate: true })
        } else {
            const parsedMobileNumber = parsePhoneNumber(`+${mobileNumber}`)
            if(!isValidPhoneNumber(parsedMobileNumber.nationalNumber, parsedMobileNumber.country)) {
                enqueueSnackbar('Please enter a valid Mobile Number', { variant: "warning", preventDuplicate: true })
            } else if(password.length === 0) {
                enqueueSnackbar('Please enter a Password', { variant: "warning", preventDuplicate: true })
            } else if(password.length < 8) {
                enqueueSnackbar('Password should contain minimum 8 characters', { variant: "warning", preventDuplicate: true })
            } else if(password.length > 0 && password.toUpperCase() === password) {
                enqueueSnackbar('Password should contain atleast one Lower case', { variant: "warning", preventDuplicate: true })
            } else if(password.length > 0 && password.toLowerCase() === password) {
                enqueueSnackbar('Password should contain atleast one Upper case', { variant: "warning", preventDuplicate: true })
            } else if(password.length > 0 && !/\d/.test(password)) {
                enqueueSnackbar('Password should contain atleast one Number', { variant: "warning", preventDuplicate: true })
            } else if(password.length > 0 && !specialCharactersRegex.test(password)) {
                enqueueSnackbar('Password should contain atleast one Special Character', { variant: "warning", preventDuplicate: true })
            } else {
                try {
                    setLoading(true)
                    const user: PostUserInterface = {
                        mobileNumber,
                        password
                    }
                    const response = await postUser(user)
                    enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
                    
                    const response1 = await authenticate(user)
                    dispatch(setAccesstoken(response1.data.accessToken))
                    dispatch(setRefreshtoken(response1.data.refreshToken))
                    const response2 = await getUser()
                    dispatch(setUser(response1.data))
                    enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
                    if(response2.data.firstName) {
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
                            flexDirection={'column'}
                            justifyContent="center"
                            bgcolor={themeProperties.colors.secondary}
                            borderRadius={'15px'}
                            px={'30px'}
                            py={'66px'}
                        >
                            <Typography sx={{fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bolder, color: themeProperties.colors.primary, marginBottom: '15px'}}>Password Guidelines</Typography>
                            <FormControlLabel sx={{cursor: 'context-menu', height: '35px'}} control={<Radio sx={{cursor: 'context-menu'}} checked={password.length > 7} />} label={<Typography sx={{fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>Contain minimum 8 characters</Typography>} />
                            <FormControlLabel sx={{cursor: 'context-menu', height: '35px'}} control={<Radio sx={{cursor: 'context-menu'}} checked={password.length > 0 && password.toUpperCase() !== password} />} label={<Typography sx={{fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>Atleast a Lower case</Typography>} />
                            <FormControlLabel sx={{cursor: 'context-menu', height: '35px'}} control={<Radio sx={{cursor: 'context-menu'}} checked={password.length > 0 && password.toLowerCase() !== password} />} label={<Typography sx={{fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>Atleast a Upper case</Typography>} />
                            <FormControlLabel sx={{cursor: 'context-menu', height: '35px'}} control={<Radio sx={{cursor: 'context-menu'}} checked={password.length > 0 && /\d/.test(password)} />} label={<Typography sx={{fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>Atleast a Number</Typography>} />
                            <FormControlLabel sx={{cursor: 'context-menu', height: '35px'}} control={<Radio sx={{cursor: 'context-menu'}} checked={password.length > 0 && specialCharactersRegex.test(password)} />} label={<Typography sx={{fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>Atleast a Symbol</Typography>} />
                        </Box>
                    </Grid>
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
                            <Button variant="contained" disableElevation sx={style.registerButton} onClick={register}>
                                Register
                            </Button>
                            <Typography sx={{marginTop: '13px', fontSize: themeProperties.fontSize.xs}}>
                                Already Registered ? <span style={{color: themeProperties.colors.button, cursor: 'pointer'}} onClick={() => navigate('/login')}>Login</span>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default Register;
