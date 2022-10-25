import { FunctionComponent} from 'react';
import { Box, Typography } from '@mui/material';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import { themeProperties } from '../../constants/themeProperties';

interface Props {
    size: 'sm'|'md'
}

const Logo: FunctionComponent<Props> = ({size})  => {
    return (
        <div>
            <Box 
                display="flex"
                flexDirection={"row"}
            >
                <AllInboxIcon sx={(size === 'md') ? {color: themeProperties.colors.primary, fontSize: themeProperties.fontSize.lg, marginX: '4px'} : {color: themeProperties.colors.button, fontSize: themeProperties.fontSize.mddp, marginX: '4px'}} />
                <Typography sx={(size === 'md') ? {color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bolder} : {color: themeProperties.colors.secondary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>
                    Shekharam
                </Typography>
            </Box>
            <Typography sx={(size === 'md') ? {color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.xs} : {color: themeProperties.colors.secondary, fontSize: themeProperties.fontSize.xxs}}>
                Made for Collection Enthusiasts
            </Typography>
        </div>
    );
}

export default Logo;
