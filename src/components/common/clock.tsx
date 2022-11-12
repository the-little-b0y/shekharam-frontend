import { FunctionComponent, useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { themeProperties } from '../../constants/themeProperties';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTheme } from '@mui/material/styles';

interface Props {

}

const Clock: FunctionComponent<Props> = ()  => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const [dateNow, setDateNow] = useState<Date>(new Date());

    useEffect(() => {
        setInterval(() => setDateNow(new Date()), 30000);
    }, []);

    return (
        <Box
            display="flex"
            flexDirection={'column'}
            style={matches ? {float: 'right', marginTop: '30px'} : {alignItems: 'center'}}
        >
            <Box
                display="flex"
                flexDirection={'row'}
            >
                <CalendarMonthIcon style={{color: themeProperties.colors.primary, marginRight: '7px', fontSize: themeProperties.fontSize.mdp}} />
                <Typography>{dateNow.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</Typography>
            </Box>
            <Box
                display="flex"
                flexDirection={'row'}
                mt={'1'}
            >
                <AccessTimeIcon style={{color: themeProperties.colors.primary, marginRight: '7px', fontSize: themeProperties.fontSize.mdp}} />
                <Typography>{dateNow.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}</Typography>
            </Box>
        </Box>
    );
}

export default Clock;
