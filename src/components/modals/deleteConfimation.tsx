import { FunctionComponent } from 'react';
import RootModal from './rootModal';
import { Box, Typography, Grid, Button } from '@mui/material';
import { themeProperties } from '../../constants/themeProperties';
import { darken } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';

const style = {
    confirmButton: {
        width: '100%',
        marginTop: '13px',
        backgroundColor: themeProperties.colors.error,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.error, 0.1),
        }
    }
}

interface Props {
    open: boolean,
    handleClose: () => void,
    confirm: () => void,
    modalHead: string,
    deletionItem: string
}

const DeleteConfirmation: FunctionComponent<Props> = ({open, handleClose, modalHead, deletionItem, confirm})  => {
    return (
        <RootModal
            open={open}
            handleClose={handleClose}
            modalHead={modalHead}
        >
            <Box width={'100%'} sx={{textAlign: 'center'}}>
                <WarningIcon style={{color: themeProperties.colors.error, fontSize: themeProperties.fontSize.xxl}} />
                <Typography style={{marginTop: '10px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.smp, fontWeight: themeProperties.fontWeight.bolder}}>Continue deleting {deletionItem} ? </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Button variant="outlined" disableElevation sx={{width: '100%', marginTop: '13px'}} onClick={handleClose}>
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" disableElevation sx={style.confirmButton} onClick={confirm}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </RootModal>
    );
}

export default DeleteConfirmation;
