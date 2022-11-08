import { FunctionComponent, useEffect, useState } from 'react';
import RootModal from './rootModal';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { themeProperties } from '../../constants/themeProperties';
import { darken } from '@mui/material/styles';
import { ConditionTypeInterface } from '../../contracts/configurationInterface';

const style = {
    saveChangesButton: {
        width: '100%',
        marginTop: '15px',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1),
        }
    },
    textField: {
        color: themeProperties.colors.textPrimary, 
        fontSize: themeProperties.fontSize.xs
    }
}

interface Props {
    open: boolean,
    handleClose: () => void,
    modalHead: string,
    addConditionType: (conditiontype: string) => void,
    editConditiontype?: ConditionTypeInterface,
    confirmeditConditionType: (conditiontype: string) => void
}

const CreateConditionType: FunctionComponent<Props> = ({open, handleClose, modalHead, addConditionType, editConditiontype, confirmeditConditionType})  => {
    const { enqueueSnackbar } = useSnackbar();

    const [conditiontype, setConditiontype] = useState<string>('')

    useEffect(() => {
        if(open) {
            if(editConditiontype) {
                setConditiontype(editConditiontype.conditiontype)
            } else {
                setConditiontype('')
            }
        }
    }, [open, editConditiontype]);

    const saveChanges = () => {
        if(conditiontype.trim().length === 0) {
            enqueueSnackbar('Please enter a Condition Type', { variant: "warning", preventDuplicate: true })
        } else {
            addConditionType(conditiontype.trim())
        }
    }

    const updateChanges = () => {
        if(conditiontype.trim().length === 0) {
            enqueueSnackbar('Please enter a Condition Type', { variant: "warning", preventDuplicate: true })
        } else {
            confirmeditConditionType(conditiontype.trim())
        }
    }

    return (
        <RootModal
            open={open}
            handleClose={handleClose}
            modalHead={modalHead}
        >
            <Box width={'100%'}>
                <TextField label="Condition Type" variant="outlined" value={conditiontype}
                    sx={{marginTop: '13px', marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary}}
                    inputProps={{style: style.textField}}
                    InputLabelProps={{style: style.textField}}
                    onChange={(event) => setConditiontype(event.target.value)}
                />
                {editConditiontype && <Typography style={{marginTop: '5px', color: themeProperties.colors.gray, fontSize: themeProperties.fontSize.xxs}}>Renaming Condition Type, will take effect in respective Collection Copies</Typography>}
                <Button variant="contained" disableElevation sx={style.saveChangesButton} onClick={editConditiontype ? updateChanges : saveChanges}>
                    {editConditiontype ? 'Update Changes' : 'Save Changes'}
                </Button>
            </Box>
        </RootModal>
    );
}

export default CreateConditionType;
