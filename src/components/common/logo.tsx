import { FunctionComponent} from 'react';
import { Box, Typography } from '@mui/material';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import { themeProperties } from '../../constants/themeProperties';

interface Props {
  
}

const Logo: FunctionComponent<Props> = ()  => {
    return (
        <div>
            <Box 
                display="flex"
                flexDirection={"row"}
            >
                <AllInboxIcon sx={{color: themeProperties.colors.primary, fontSize: themeProperties.fontSize.lg, marginX: '4px'}} />
                <Typography sx={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bolder}}>
                    Shekharam
                </Typography>
            </Box>
            <Typography sx={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.xs}}>
                Made for Collection Enthusiasts
            </Typography>
        </div>
    );
}

export default Logo;
