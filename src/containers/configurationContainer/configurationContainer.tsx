import { FunctionComponent, useState, useEffect } from 'react';
import { Grid, Typography, Box, Tooltip, IconButton, FormControl, InputLabel, Select, Button, MenuItem } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { themeProperties } from '../../constants/themeProperties';
import HelpIcon from '@mui/icons-material/Help';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { darken } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { deleteConditionType, getConfiguration, postConditionType, putConditionType, putCurrency } from '../../services/configurationService';
import { ConditionTypeInterface } from '../../contracts/configurationInterface';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmation from '../../components/modals/deleteConfimation';
import CreateConditionType from '../../components/modals/createConditiontype';
import Loading from '../../components/common/loading';
import { currencies } from '../../constants/currencies';

const style = {
    addButton: {
        backgroundColor: themeProperties.colors.secondary,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.secondary, 0.1)
        }
    },
    editDeleteButton: {
        backgroundColor: themeProperties.colors.quaternary,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.quaternary, 0.1)
        }
    },
    textField: {
        color: themeProperties.colors.textPrimary, 
        fontSize: themeProperties.fontSize.xs
    },
    saveButton: {
        width: '100%',
        marginTop: '15px',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1),
        }
    }
}

interface Props {
  
}

const Configuration: FunctionComponent<Props> = ()  => {
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState<boolean>(false)
    const [open2, setOpen2] = useState<boolean>(false)
    const [openConfimation2, setOpenConfirmation2] = useState<boolean>(false)
    const [conditionTypes, setConditionTypes] = useState<ConditionTypeInterface[]>([])
    const [deletionId2, setDeletionId2] = useState<string>('')
    const [editConditiontype, setEditConditionType] = useState<ConditionTypeInterface>()
    const [currency, setCurrency] = useState<string>('')

    useEffect(() => {
        fetchPageApis()
    }, []);

    const fetchPageApis = async() => {
        try {
            setLoading(true)
            const response = await getConfiguration()
            setConditionTypes(response.data ? response.data.conditionTypes : [])
            setCurrency((response.data && response.data.currency) ? response.data.currency : '')
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const addConditionType = async(conditiontype: string) => {
        try {
            setLoading(true)
            const conditionType: ConditionTypeInterface = { conditiontype }
            const response = await postConditionType(conditionType)
            enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
            fetchPageApis()
            setOpen2(false)
            setLoading(false)
        } catch (error) {
            setOpen2(false)
            setLoading(false)
        }
    }

    const editConditionType = async(item: ConditionTypeInterface) => {
        setEditConditionType(item)
        setOpen2(true)
    }

    const confirmeditConditionType = async(conditiontype: string) => {
        if(editConditiontype) {
            try {
                setLoading(true)
                const conditionType: ConditionTypeInterface = { 
                    conditiontype,
                    _id: editConditiontype._id
                }
                const response = await putConditionType(conditionType)
                enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
                fetchPageApis()
                setOpen2(false)
                setEditConditionType(undefined)
                setLoading(false)
            } catch (error) {
                setOpen2(false)
                setEditConditionType(undefined)
                setLoading(false)
            }
        }
    }

    const removeConditionType = (id: string) => {
        setDeletionId2(id)
        setOpenConfirmation2(true)
    }

    const confirmRemoveConditionType = async() => {
        if(deletionId2) {
            try {
                setLoading(true)
                const response = await deleteConditionType(deletionId2)
                enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
                fetchPageApis()
                setOpenConfirmation2(false)
                setDeletionId2('')
                setLoading(false)
            } catch (error) {
                setOpenConfirmation2(false)
                setDeletionId2('')
                setLoading(false)
            }
        }
    }

    const saveCurrency = async () => {
        try {
            setLoading(true)
            const selectedCurrency = currency ? currency : currencies[0].code
            const response = await putCurrency(selectedCurrency)
            enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
            fetchPageApis()
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    if(loading) {
        return (
            <Loading />
        )
    } else {
        return (
            <FixedDrawer>
                <Grid container>
                    <Grid item xs={12}>
                        <SuggestionBox greetingType='default' subtext='Configuration page for your collection' />
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '13px'}}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row'
                            }}
                        >
                            <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Condition Types</Typography>
                            <Tooltip title="Levels in item Condition. Eg: Gem Condition, Minor Defects">
                                <HelpIcon style={{cursor: 'pointer', color: themeProperties.colors.gray, marginLeft: '10px', fontSize: themeProperties.fontSize.smp, marginTop: '6px'}} />
                            </Tooltip>
                        </Box>
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '20px'}}>
                        <Grid container spacing={3}>
                            {conditionTypes.map((item, index) => {
                                return (
                                    <Grid key={`condition-${String(index)}`} item xs={6} md={2}>
                                        <Box
                                            borderRadius={'10px'}
                                            bgcolor={themeProperties.colors.secondary}
                                            height={'90px'}
                                        >
                                            <Box
                                                display="flex"
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                flexDirection={'column'}
                                                sx={{
                                                    pt: '5px',
                                                    pb: '5px'
                                                }}
                                               
                                            >
                                                <Typography style={{marginTop: '10px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm}}>{item.conditiontype}</Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    px: '20px',
                                                    pt: '5px',
                                                    pb: '15px'
                                                }}
                                            >
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size='small'
                                                        onClick={() => removeConditionType(item._id as string)}
                                                        sx={style.editDeleteButton}
                                                    >
                                                        <DeleteIcon style={{color: themeProperties.colors.error, fontSize: themeProperties.fontSize.sm}} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size='small'
                                                        onClick={() => editConditionType(item)}
                                                        sx={style.editDeleteButton}
                                                    >
                                                        <EditIcon style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm}} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    </Grid>
                                )
                            })}
                            <Grid item xs={6} md={2}>
                                <Box
                                    display="flex"
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    borderRadius={'10px'}
                                    p={'20px'}
                                    height={'90px'}
                                    flexDirection={'column'}
                                    sx={style.addButton}
                                    onClick={() => setOpen2(true)}
                                >
                                    <AddCircleIcon style={{color: themeProperties.colors.primary, fontSize: themeProperties.fontSize.md}} />
                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.xs, textAlign: 'center'}}>Add Condition Type</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '30px'}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box
                                    bgcolor={themeProperties.colors.secondary}
                                    borderRadius={'10px'}
                                    p={'20px'}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Local Currency</Typography>
                                        <Tooltip title="Select Local Currency">
                                            <HelpIcon style={{cursor: 'pointer', color: themeProperties.colors.gray, marginLeft: '10px', fontSize: themeProperties.fontSize.smp, marginTop: '6px'}} />
                                        </Tooltip>
                                    </Box>   
                                    <FormControl fullWidth style={{marginTop: '25px', background: themeProperties.colors.white}}>
                                        <InputLabel id="currency-select-label">Currency</InputLabel>
                                        <Select
                                            labelId="currency-select-label"
                                            id="currency-select"
                                            value={currency ? currency : currencies[0].code}
                                            label="Currency"
                                            onChange={(e) => {setCurrency(e.target.value)}}
                                            size='small'
                                        >
                                            {currencies.map(element => {
                                                return (
                                                    <MenuItem key={element.code} value={element.code}>{element.expansion} ({element.symbol})</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
            
                                    <Button variant="contained" disableElevation sx={style.saveButton} onClick={saveCurrency}>
                                        Save
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <CreateConditionType 
                    open={open2}
                    handleClose={() => {
                        setOpen2(false)
                        setEditConditionType(undefined)
                    }}
                    modalHead={editConditiontype ? 'Edit Condition type' : 'Add Condition type'}
                    addConditionType={addConditionType}
                    editConditiontype={editConditiontype}
                    confirmeditConditionType={confirmeditConditionType}
                />
                <DeleteConfirmation 
                    open={openConfimation2}
                    handleClose={() => {
                        setOpenConfirmation2(false)
                        setDeletionId2('')
                    }}
                    modalHead='Delete Confimation'
                    confirm={confirmRemoveConditionType}
                    deletionItem={'Condition Type'}
                />
            </FixedDrawer>
        );
    }
}

export default Configuration;
