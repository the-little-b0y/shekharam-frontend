import { Box, Typography } from '@mui/material';
import { FunctionComponent} from 'react';
import { themeProperties } from '../../constants/themeProperties';
import ReactLoading from 'react-loading';
import Logo from './logo';

interface Props {
  
}

const Loading: FunctionComponent<Props> = ()  => {
    return (
        <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection={'column'}
            minHeight="97vh"
        >
            <Logo size='md'/>
            <Box mb='10px' />
            <ReactLoading type={'cylon'} color={themeProperties.colors.primary} />            
            <Typography sx={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bold}}>
                Loading ...
            </Typography>
        </Box>
    );
}

export default Loading;
