import { FunctionComponent } from 'react';
import { Box, Typography, Grid, useMediaQuery } from '@mui/material';
import { ReduxInterface } from '../../contracts/authInterface';
import { useSelector } from 'react-redux'
import { getMyVaIcon, greetings, getTimeGreeting } from '../../constants/greetings';
import { themeProperties } from '../../constants/themeProperties';
import Clock from './clock';
import { useTheme } from '@mui/material/styles';
import { GetUserInterface } from '../../contracts/userInterface';

interface Props {
    greetingType: 'default' | 'timed',
    subtext: string
}

const SuggestionBox: FunctionComponent<Props> = ({greetingType, subtext})  => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const reduxState = useSelector((state) => state) as ReduxInterface

    let reduxUser:GetUserInterface|undefined;
    if(reduxState && reduxState.user) {
        reduxUser = reduxState.user as GetUserInterface;
    }

    return (
        <Grid container spacing={3} style={{marginBottom: '10px'}}>
            <Grid item xs={12} md={8}>
                <Box
                    display="flex"
                    height={matches ? "120px" : "90px"}
                    flexDirection={'row'}
                    style={matches ? {} : {justifyContent: 'center'}}
                >
                    <Box p={1} 
                        display="flex"
                        justifyContent={'center'}
                        flexDirection={'column'}
                    >
                        <img src={getMyVaIcon(reduxUser)} alt="va" style={matches ? {height: '120px'} : {height: '90px'}} />
                    </Box>
                    <Box p={1} 
                        display="flex"
                        justifyContent={'center'}
                        flexDirection={'column'}
                    >
                        <Typography style={matches ? {color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.lg} : {color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.mdp}}>{(greetingType === 'default') ? ((reduxUser && reduxUser.greeting) ? reduxUser.greeting : greetings[0]) : getTimeGreeting()}<span style={{fontWeight: themeProperties.fontWeight.bolder}}>{reduxUser?.firstName}</span> !!</Typography>
                        <Typography style={matches ? {lineHeight: '20px', color: themeProperties.colors.gray, fontSize: themeProperties.fontSize.md} : {lineHeight: '20px', color: themeProperties.colors.gray, fontSize: themeProperties.fontSize.smp}}>{subtext}</Typography>
                    </Box>
                </Box>
            </Grid>
            {matches &&
                <Grid item xs={12} md={4}>
                    <Clock />
                </Grid>
            }
        </Grid>
    );
}

export default SuggestionBox;
