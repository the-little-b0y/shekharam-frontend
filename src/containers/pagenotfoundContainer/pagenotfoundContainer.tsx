import { Box, Typography } from '@mui/material';
import { FunctionComponent} from 'react';
import { themeProperties } from '../../constants/themeProperties';
import ReportIcon from '@mui/icons-material/Report';

interface Props {
  
}

const Pagenotfound: FunctionComponent<Props> = ()  => {
    return (
        <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection={'column'}
            minHeight="97vh"
        >
            <ReportIcon sx={{color: themeProperties.colors.error, fontSize: themeProperties.fontSize.xxxl}} />
            <Typography sx={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.xxxl, fontWeight: themeProperties.fontWeight.bolder, marginTop: '5px'}}>
                404
            </Typography>
            <Typography sx={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bold, marginTop: '5px'}}>
                Uh-Oh !! Page Not Found
            </Typography>
        </Box>
    );
}

export default Pagenotfound;
