import { FunctionComponent, useEffect, useState } from 'react';
import RootModal from './rootModal';
import { Box, TextField, Button } from '@mui/material';
import { personNameRegex } from '../../constants/regex';
import { useSnackbar } from 'notistack';
import { GetUserInterface, PutUserInterface } from '../../contracts/userInterface';
import { themeProperties } from '../../constants/themeProperties';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { darken } from '@mui/material/styles';

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
    open: boolean,
    handleClose: () => void,
    modalHead: string,
    reduxUser: GetUserInterface | undefined,
    updatePersonal: (updated: PutUserInterface) => void
}

const EditPersonal: FunctionComponent<Props> = ({open, handleClose, modalHead, reduxUser, updatePersonal})  => {
    const { enqueueSnackbar } = useSnackbar();

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)

    useEffect(() => {
        if(reduxUser && open) {
            setFirstName(reduxUser.firstName)
            setLastName(reduxUser.lastName)
            setDateOfBirth(reduxUser.dateOfBirth)
        }
    }, [open]);

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
            const user: PutUserInterface = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                dateOfBirth: new Date(dateOfBirth)
            }
            updatePersonal(user)
        }
    }

    return (
        <RootModal
            open={open}
            handleClose={handleClose}
            modalHead={modalHead}
        >
            <Box width={'100%'}>
                <TextField label="First Name" variant="outlined" value={firstName}
                    sx={{marginTop: '13px', width: '100%', color: themeProperties.colors.textPrimary}}
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
        </RootModal>
    );
}

export default EditPersonal;
