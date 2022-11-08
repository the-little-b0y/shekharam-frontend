import { FunctionComponent, useEffect, useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Button, useMediaQuery, AppBar, Toolbar, IconButton } from '@mui/material';
import { routeList } from '../../constants/routes';
import { sortBy } from 'lodash';
import { useLocation, useNavigate } from "react-router-dom";
import { themeProperties } from '../../constants/themeProperties';
import { darken } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setAccesstoken, setRefreshtoken } from '../../redux/authSlice';
import { useSnackbar } from 'notistack';
import Logo from './logo';
import { ReduxInterface } from '../../contracts/authInterface';
import { GetUserInterface } from '../../contracts/userInterface';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';

interface Props {
    children: React.ReactNode;
}

const drawerWidth = 230;

const style = {
    drawerButtonActive: {
        marginX: '17px',
        marginY: '4px',
        padding: '11px',
        paddingLeft: '12px',
        borderRadius: '10px',
        backgroundColor: darken(themeProperties.colors.secondary, 0.3),
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.secondary, 0.3)
        }
    },
    drawerButtonInactiveActive: {
        marginX: '17px',
        marginY: '4px',
        padding: '11px',
        paddingLeft: '12px',
        borderRadius: '10px',
        backgroundColor: darken(themeProperties.colors.secondary, 0.1),
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.secondary, 0.2)
        }
    },
    footer: {
        width: `calc(${drawerWidth}px - 5px)`, 
        position: "fixed",
        bottom: 0,
        textAlign: "center",
        padding: '15px'
    },
    logoutButton: {
        width: '100%',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1),
        }
    }
}

const FixedDrawer: FunctionComponent<Props> = ({children})  => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const reduxState = useSelector((state) => state) as ReduxInterface
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const { enqueueSnackbar } = useSnackbar();
    const path = location.pathname;

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const accesstoken = localStorage.getItem('accesstoken');
        if(!accesstoken) {
            enqueueSnackbar('Please Login', { variant: "info", preventDuplicate: true })
            navigate('/login')
        } else if(!reduxState.accesstoken) {
            const refreshtoken = localStorage.getItem('refreshtoken');
            const user = localStorage.getItem('user')
            if(accesstoken && refreshtoken && user) {
                const parseduser: GetUserInterface = JSON.parse(user);
                dispatch(setAccesstoken(accesstoken))
                dispatch(setRefreshtoken(refreshtoken))
                dispatch(setUser(parseduser))
            }
        }
    }, []);

    const logout = () => {
        dispatch(setAccesstoken(''))
        dispatch(setRefreshtoken(''))
        dispatch(setUser({}))
        localStorage.clear();
        navigate('/login')
    }

    const drawer = (
        <div>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                py={'15px'}
                bgcolor={themeProperties.colors.primary}
                mb={'5px'}
            >
                <Logo size='sm' />
            </Box>
            <List>
                {sortBy(routeList.filter(route => route.routetype === 'drawer'), ['position']).map(route => 
                    <ListItem key={route.path} disablePadding 
                        onClick={() => {
                            if(path !== route.path) {
                                navigate(route.path)
                            }
                        }}
                    >
                        <ListItemButton sx={(path === route.rootpath) ? style.drawerButtonActive : style.drawerButtonInactiveActive}>
                            <ListItemIcon>
                                <route.icon style={(path === route.rootpath) ? {color: themeProperties.colors.primary, minWidth: '40px'} : {color: themeProperties.colors.textPrimary, minWidth: '40px'}} />
                            </ListItemIcon>
                            <ListItemText 
                                disableTypography
                                primary={<Typography sx={(path === route.rootpath) ? {fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary, fontWeight: themeProperties.fontWeight.bolder} : {fontSize: themeProperties.fontSize.xs, color: themeProperties.colors.textPrimary}}>{route.name}</Typography>}                                    
                            />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
            <Box sx={style.footer}>
                <Button variant="contained" disableElevation sx={style.logoutButton} onClick={logout}>
                    Logout
                </Button>
            </Box>
        </div>
    )

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                variant="temporary"
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open={open}
                PaperProps={{
                    sx: {
                        backgroundColor: themeProperties.colors.secondary
                    }
                }}
                onClose={() => {
                    if(!matches) {
                        setOpen(false);
                    }
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                PaperProps={{
                    sx: {
                        backgroundColor: themeProperties.colors.secondary
                    }
                }}
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
                open
            >
                {drawer}
            </Drawer>
            <Box sx={{width: '100%'}}>
                {!matches &&
                    <AppBar position="fixed" sx={{background: themeProperties.colors.primary}}>
                        <Toolbar>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width={'100%'}
                            >
                                <Logo size='sm' />
                            </Box>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{position: "fixed", top: 4, left: 15}}
                                onClick={() => setOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                }
                <Box
                    component="main"
                    sx={matches ? { flexGrow: 1, px: '30px', py: '25px' } : { flexGrow: 1, px: '30px', pb: '25px', pt: '80px' }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default FixedDrawer;
