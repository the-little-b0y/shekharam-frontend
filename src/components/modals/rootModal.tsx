import { FunctionComponent} from 'react';
import { Modal, Box, Grid, Typography } from '@mui/material';
import { themeProperties } from '../../constants/themeProperties';
import { darken } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';

const style = {
    modal: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        p: 3,
        borderRadius: '10px'
    },
    closeIcon: {
        color: darken(themeProperties.colors.quaternary, 0.5),
        cursor: 'pointer'
    }
}

interface Props {
    children: React.ReactNode,
    open: boolean,
    handleClose: () => void,
    modalHead: string
}

const RootModal: FunctionComponent<Props> = ({children, open, handleClose, modalHead})  => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            disableAutoFocus={true}
        >
            <Box sx={style.modal}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.smp, fontWeight: themeProperties.fontWeight.bolder}}>{modalHead}</Typography>
                            <CancelIcon style={style.closeIcon} onClick={handleClose} />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        {children}
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

export default RootModal;
