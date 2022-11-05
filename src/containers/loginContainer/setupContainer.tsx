import { FunctionComponent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, Typography, TextField } from '@mui/material';
import { darken } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { themeProperties } from '../../constants/themeProperties';
import { useSnackbar } from 'notistack';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { personNameRegex } from '../../constants/regex';
import { PutUserInterface } from '../../contracts/userInterface';
import { getUser, putUser } from '../../services/userServices';
import { setUser } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import Loading from '../../components/common/loading';

const style = {
    confirmButton: {
        width: '100%',
        marginTop: '13px',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1),
        }
    },
    textField: {
        color: themeProperties.colors.textPrimary, 
        fontSize: themeProperties.fontSize.xs
    }
}

interface Props {
  
}

const Setup: FunctionComponent<Props> = ()  => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch()

    const [loading, setLoading] = useState<boolean>(false)
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)

    const confirm = async() => {
        if(firstName.trim().length === 0) {
            enqueueSnackbar('Please enter your First Name', { variant: "warning", preventDuplicate: true })
        } else if(firstName.trim().length > 0 && !personNameRegex.test(firstName.trim())) {
            enqueueSnackbar('You have entered an Invalid First Name', { variant: "warning", preventDuplicate: true })
        } else if(lastName.trim().length === 0) {
            enqueueSnackbar('Please enter your Last Name', { variant: "warning", preventDuplicate: true })
        } else if(lastName.trim().length > 0 && !personNameRegex.test(lastName.trim())) {
            enqueueSnackbar('You have entered an Invalid Last Name', { variant: "warning", preventDuplicate: true })
        } else if(dateOfBirth === null) {
            enqueueSnackbar('Please enter your Date of Birth', { variant: "warning", preventDuplicate: true })
        } else if(dateOfBirth > new Date()) {
            enqueueSnackbar('Entered Date of Birth is Invalid', { variant: "warning", preventDuplicate: true })
        } else {
            try {
                setLoading(true)
                const user: PutUserInterface = {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    dateOfBirth: new Date(dateOfBirth)
                }
                const response = await putUser(user)
                const response1 = await getUser()
                dispatch(setUser(response1.data))
                enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
                navigate('/dashboard')
                setLoading(false)
            } catch (error) {
                setLoading(false)
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
                            <AccountCircleIcon sx={{color: themeProperties.colors.button, fontSize: themeProperties.fontSize.xxl}} />
                            <Typography sx={{color: themeProperties.colors.primary, fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bolder}}>User Settings</Typography>
                            <TextField label="First Name" variant="outlined" value={firstName}
                                sx={{marginTop: '40px', width: '100%', color: themeProperties.colors.textPrimary}}
                                inputProps={{style: style.textField}}
                                InputLabelProps={{style: style.textField}}
                                onChange={(event) => setFirstName(event.target.value)}
                            />
                            <TextField label="Last Name" variant="outlined" value={lastName}
                                sx={{marginTop: '13px', width: '100%', color: themeProperties.colors.textPrimary}}
                                inputProps={{style: style.textField}}
                                InputLabelProps={{style: style.textField}}
                                onChange={(event) => setLastName(event.target.value)}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    label="Date Of Birth"
                                    inputFormat="DD/MM/YYYY"
                                    value={dateOfBirth}
                                    onChange={(value) => setDateOfBirth(value)}
                                    renderInput={(params) => 
                                        <TextField 
                                            sx={{marginTop: '13px', width: '100%', color: themeProperties.colors.textPrimary}}
                                            inputProps={{style: style.textField}}
                                            InputLabelProps={{style: style.textField}}
                                            {...params}  
                                        />
                                    }
                                />
                            </LocalizationProvider>
                            <Button variant="contained" disableElevation sx={style.confirmButton} onClick={confirm}>
                                Confirm
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default Setup;
