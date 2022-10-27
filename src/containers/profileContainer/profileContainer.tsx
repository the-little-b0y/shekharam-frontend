import { FunctionComponent, useState, useEffect } from 'react';
import { Grid, Box, Typography, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem, Button, OutlinedInput, InputAdornment, FormControlLabel, Radio } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { themeProperties } from '../../constants/themeProperties';
import { useSelector } from 'react-redux'
import { ReduxInterface } from '../../contracts/authInterface';
import { GetUserInterface, PutUserInterface } from '../../contracts/userInterface';
import EditIcon from '@mui/icons-material/Edit';
import { lighten, darken } from '@mui/material/styles';
import EditPersonal from '../../components/modals/editPersonals';
import { getUser, putAvatarGreeting, putRestPassword, putUser } from '../../services/userServices';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/authSlice';
import { avatarIcons, greetings } from '../../constants/greetings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { specialCharactersRegex } from '../../constants/regex';

const style = {
    editButton: {
        backgroundColor: lighten(themeProperties.colors.quaternary, 0.3),
        '&:hover': {
            backgroundColor: themeProperties.colors.quaternary,
        }
    },
    avatar: {
        padding: '10px',
        '&:hover': {
            backgroundColor: lighten(themeProperties.colors.quaternary, 0.3),
        }
    },
    selectedAvatar: {
        padding: '10px',
        backgroundColor: themeProperties.colors.quaternary,
        '&:hover': {
            backgroundColor: themeProperties.colors.quaternary,
        }
    },
    saveButton: {
        width: '100%',
        marginTop: '15px',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1),
        }
    }
}

interface Props {
  
}

const Profile: FunctionComponent<Props> = ()  => {
    const reduxState = useSelector((state) => state) as ReduxInterface
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch()

    let reduxUser:GetUserInterface|undefined;
    if(reduxState && reduxState.user) {
        reduxUser = reduxState.user as GetUserInterface;
    }

    const [open, setOpen] = useState<boolean>(false)
    const [avatar, setAvatar] = useState<string>('')
    const [greeting, setGreeting] = useState<string>('')
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
    const [currentpassword, setCurrentPassword] = useState<string>('')
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
    const [newpassword, setNewPassword] = useState<string>('')

    useEffect(() => {
        if(reduxUser) {
            if(reduxUser.greeting) {
                setGreeting(reduxUser.greeting)
            }
            if(reduxUser.avatar) {
                setAvatar(reduxUser.avatar)
            }
        }
    }, [reduxUser?.avatar, reduxUser?.greeting]);

    const updatePersonal = async (updated: PutUserInterface) => {
        const response = await putUser(updated)
        const response1 = await getUser()
        dispatch(setUser(response1.data))
        enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
        setOpen(false)
    }

    const saveAvatarGreeting = async () => {
        const selectedAv = avatar ? avatar : avatarIcons[0].name
        const selectedGr = greeting ? greeting : greetings[0]
        const response = await putAvatarGreeting(selectedAv, selectedGr)
        const response1 = await getUser()
        dispatch(setUser(response1.data))
        enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
    }

    const savePassword = async() => {
        if(currentpassword.length === 0) {
            enqueueSnackbar('Please enter your Current Password', { variant: "warning", preventDuplicate: true })
        } else if(newpassword.length === 0) {
            enqueueSnackbar('Please enter a New password', { variant: "warning", preventDuplicate: true })
        } else if(newpassword.length < 8) {
            enqueueSnackbar('New password should contain minimum 8 characters', { variant: "warning", preventDuplicate: true })
        } else if(newpassword.length > 0 && newpassword.toUpperCase() === newpassword) {
            enqueueSnackbar('New password should contain atleast one Lower case', { variant: "warning", preventDuplicate: true })
        } else if(newpassword.length > 0 && newpassword.toLowerCase() === newpassword) {
            enqueueSnackbar('New password should contain atleast one Upper case', { variant: "warning", preventDuplicate: true })
        } else if(newpassword.length > 0 && !/\d/.test(newpassword)) {
            enqueueSnackbar('New password should contain atleast one Number', { variant: "warning", preventDuplicate: true })
        } else if(newpassword.length > 0 && !specialCharactersRegex.test(newpassword)) {
            enqueueSnackbar('New Password should contain atleast one Special Character', { variant: "warning", preventDuplicate: true })
        } else {
            const response = await putRestPassword(currentpassword, newpassword)
            setShowCurrentPassword(false)
            setCurrentPassword('')
            setShowNewPassword(false)
            setNewPassword('')
            enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
        }
    }

    const handleMouseDownCurrentPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseDownNewPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <FixedDrawer>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <SuggestionBox greetingType='default' subtext='You can update the Personal data' />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box
                        bgcolor={themeProperties.colors.secondary}
                        borderRadius={'10px'}
                        p={'20px'}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>User Information</Typography>
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    color="inherit"
                                    sx={style.editButton}
                                    onClick={() => setOpen(true)}
                                >
                                    <EditIcon style={{color: themeProperties.colors.primary}} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Grid container spacing={3} sx={{marginTop: '5px'}}
                            direction='row'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Grid item xs={4}>
                                <Typography style={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>First Name:</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography style={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>{reduxUser?.firstName}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} sx={{marginTop: '0.1px'}}
                            direction='row'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Grid item xs={4}>
                                <Typography style={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Last Name:</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography style={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>{reduxUser?.lastName}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} sx={{marginTop: '0.1px'}}
                            direction='row'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Grid item xs={4}>
                                <Typography style={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Mobile Number:</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography style={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>{reduxUser?.mobileNumber}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} sx={{marginTop: '0.1px'}}
                            direction='row'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Grid item xs={4}>
                                <Typography style={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Date of Birth:</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography style={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>{reduxUser && new Date(reduxUser.dateOfBirth as Date).toLocaleDateString('en-GB')}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box
                        bgcolor={themeProperties.colors.secondary}
                        borderRadius={'10px'}
                        mt={'25px'}
                        p={'20px'}
                    >
                        <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Your Avatar and Greetings</Typography>
                        <Typography style={{marginTop: '20px', marginBottom: '5px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Avatar:</Typography>
                        <Grid container spacing={2}>
                            {avatarIcons.map((icon, index) => {
                                return (
                                    <Grid key={icon.name} item xs={2}>
                                        <IconButton
                                            size="small"
                                            color="inherit"
                                            sx={avatar ? (avatar === icon.name ? style.selectedAvatar : style.avatar) : (index === 0 ? style.selectedAvatar : style.avatar)}
                                            onClick={() => setAvatar(icon.name)}
                                        >
                                            <img style={{height: '30px'}} alt={icon.name} src={icon.value} />
                                        </IconButton>
                                    </Grid>
                                )
                            })}
                        </Grid>

                        <FormControl fullWidth style={{marginTop: '25px', background: themeProperties.colors.white}}>
                            <InputLabel id="greeting-select-label">Greeting</InputLabel>
                            <Select
                                labelId="greeting-select-label"
                                id="greeting-select"
                                value={greeting ? greeting : greetings[0]}
                                label="Greeting"
                                onChange={(e) => setGreeting(e.target.value)}
                                size='small'
                            >
                                {greetings.map(text => {
                                    return (
                                        <MenuItem key={text} value={text}>{text}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        <Button variant="contained" disableElevation sx={style.saveButton} onClick={saveAvatarGreeting}>
                            Save
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box
                        bgcolor={themeProperties.colors.secondary}
                        borderRadius={'10px'}
                        p={'20px'}
                    >
                        <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Password Reset</Typography>
                        <FormControl sx={{width: '100%', marginTop: '20px', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-cpassword" sx={{fontSize: themeProperties.fontSize.xs}}>Current Password</InputLabel>
                            <OutlinedInput
                                sx={{fontSize: themeProperties.fontSize.xs}}
                                id="outlined-adornment-cpassword"
                                label={'Current Password'}
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentpassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowCurrentPassword(prev => !prev)}
                                        onMouseDown={handleMouseDownCurrentPassword}
                                        edge="end"
                                    >
                                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl sx={{width: '100%', marginTop: '15px', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-npassword" sx={{fontSize: themeProperties.fontSize.xs}}>New Password</InputLabel>
                            <OutlinedInput
                                sx={{fontSize: themeProperties.fontSize.xs}}
                                id="outlined-adornment-npassword"
                                label={'New Password'}
                                type={showNewPassword ? 'text' : 'password'}
                                value={newpassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowNewPassword(prev => !prev)}
                                        onMouseDown={handleMouseDownNewPassword}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </FormControl>
                        {(newpassword.length > 0) &&
                            <Box>
                                <Typography sx={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm, marginBottom: '5px', marginTop: '20px'}}>Password Guidelines</Typography>
                                <FormControlLabel sx={{cursor: 'context-menu', height: '35px'}} control={<Radio sx={{cursor: 'context-menu'}} checked={newpassword.length > 7} />} label={<Typography sx={{fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>Contain minimum 8 characters</Typography>} />
                                <FormControlLabel sx={{cursor: 'context-menu', height: '35px'}} control={<Radio sx={{cursor: 'context-menu'}} checked={newpassword.length > 0 && newpassword.toUpperCase() !== newpassword} />} label={<Typography sx={{fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>Atleast a Lower case</Typography>} />
                                <FormControlLabel sx={{cursor: 'context-menu', height: '35px'}} control={<Radio sx={{cursor: 'context-menu'}} checked={newpassword.length > 0 && newpassword.toLowerCase() !== newpassword} />} label={<Typography sx={{fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>Atleast a Upper case</Typography>} />
                                <FormControlLabel sx={{cursor: 'context-menu', height: '35px'}} control={<Radio sx={{cursor: 'context-menu'}} checked={newpassword.length > 0 && /\d/.test(newpassword)} />} label={<Typography sx={{fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>Atleast a Number</Typography>} />
                                <FormControlLabel sx={{cursor: 'context-menu', height: '35px'}} control={<Radio sx={{cursor: 'context-menu'}} checked={newpassword.length > 0 && specialCharactersRegex.test(newpassword)} />} label={<Typography sx={{fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>Atleast a Symbol</Typography>} />
                            </Box>
                        }
                        <Button variant="contained" disableElevation sx={style.saveButton} onClick={savePassword}>
                            Reset Password
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <EditPersonal 
                open={open}
                handleClose={() => {
                    setOpen(false)
                }}
                modalHead='Edit Personal Details'
                reduxUser={reduxUser}
                updatePersonal={updatePersonal}
            />
        </FixedDrawer>
    );
}

export default Profile;
