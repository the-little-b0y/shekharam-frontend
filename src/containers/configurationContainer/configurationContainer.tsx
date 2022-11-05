import { FunctionComponent, useState, useEffect } from 'react';
import { Grid, Typography, Box, Tooltip, IconButton } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { themeProperties } from '../../constants/themeProperties';
import HelpIcon from '@mui/icons-material/Help';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { darken } from '@mui/material/styles';
import CreateItemType from '../../components/modals/createItemtype';
import { useSnackbar } from 'notistack';
import { deleteCollectionItemType, deleteConditionType, getConfiguration, postCollectionItemType, postConditionType, putCollectionItemType, putConditionType } from '../../services/configurationService';
import { CollectionItemTypeInterface, ConditionTypeInterface } from '../../contracts/configurationInterface';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmation from '../../components/modals/deleteConfimation';
import CreateConditionType from '../../components/modals/createConditiontype';
import Loading from '../../components/common/loading';

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
    }
}

interface Props {
  
}

const Configuration: FunctionComponent<Props> = ()  => {
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [openConfimation, setOpenConfirmation] = useState<boolean>(false)
    const [itemTypes, setItemTypes] = useState<CollectionItemTypeInterface[]>([])
    const [deletionId, setDeletionId] = useState<string>('')
    const [editItemtype, setEditItemType] = useState<CollectionItemTypeInterface>()
    const [open2, setOpen2] = useState<boolean>(false)
    const [openConfimation2, setOpenConfirmation2] = useState<boolean>(false)
    const [conditionTypes, setConditionTypes] = useState<ConditionTypeInterface[]>([])
    const [deletionId2, setDeletionId2] = useState<string>('')
    const [editConditiontype, setEditConditionType] = useState<ConditionTypeInterface>()

    useEffect(() => {
        fetchPageApis()
    }, []);

    const fetchPageApis = async() => {
        try {
            setLoading(true)
            const response = await getConfiguration()
            setItemTypes(response.data ? response.data.collectionItemTypes : [])
            setConditionTypes(response.data ? response.data.conditionTypes : [])
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const addCollectionItemType = async(itemtype: string, itemimage: string) => {
        try {
            setLoading(true)
            const collectionItemType: CollectionItemTypeInterface = { itemtype, itemimage }
            const response = await postCollectionItemType(collectionItemType)
            enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
            fetchPageApis()
            setOpen(false)
            setLoading(false)
        } catch (error) {
            setOpen(false)
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

    const editCollectionItemType = async(item: CollectionItemTypeInterface) => {
        setEditItemType(item)
        setOpen(true)
    }

    const editConditionType = async(item: ConditionTypeInterface) => {
        setEditConditionType(item)
        setOpen(true)
    }

    const confirmeditCollectionItemType = async(itemtype: string, itemimage: string) => {
        if(editItemtype) {
            try {
                setLoading(true)
                const collectionItemType: CollectionItemTypeInterface = { 
                    itemtype, itemimage,
                    _id: editItemtype._id
                }
                const response = await putCollectionItemType(collectionItemType)
                enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
                fetchPageApis()
                setOpen(false)
                setEditItemType(undefined)
                setLoading(false)
            } catch (error) {
                setOpen(false)
                setEditItemType(undefined)
                setLoading(false)
            }
        }
    }

    const confirmeditConditionType = async(conditiontype: string) => {
        if(editItemtype) {
            try {
                setLoading(true)
                const conditionType: ConditionTypeInterface = { 
                    conditiontype,
                    _id: editItemtype._id
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

    const removeCollectionItemType = (id: string) => {
        setDeletionId(id)
        setOpenConfirmation(true)
    }

    const removeConditionType = (id: string) => {
        setDeletionId2(id)
        setOpenConfirmation2(true)
    }

    const confirmRemoveCollectionItemType = async() => {
        if(deletionId) {
            try {
                setLoading(true)
                const response = await deleteCollectionItemType(deletionId)
                enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
                fetchPageApis()
                setOpenConfirmation(false)
                setDeletionId('')
                setLoading(false)
            } catch (error) {
                setOpenConfirmation(false)
                setDeletionId('')
                setLoading(false)
            }
        }
    }

    const confirmRemoveConditionType = async() => {
        if(deletionId) {
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
                    <Grid item xs={12} style={{paddingLeft: '20px', paddingRight: '20px', marginTop: '25px'}}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row'
                            }}
                        >
                            <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Collection Item Type</Typography>
                            <Tooltip title="What items are you collecting. Eg: Coins, Stamps">
                                <HelpIcon style={{cursor: 'pointer', color: themeProperties.colors.gray, marginLeft: '10px', fontSize: themeProperties.fontSize.smp, marginTop: '6px'}} />
                            </Tooltip>
                        </Box>
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '20px', paddingRight: '20px', marginTop: '15px'}}>
                        <Grid container spacing={3}>
                            {itemTypes.map((item, index) => {
                                return (
                                    <Grid key={`item-${String(index)}`} item xs={6} md={2}>
                                        <Box
                                            borderRadius={'10px'}
                                            bgcolor={themeProperties.colors.secondary}
                                            height={'184.5px'}
                                        >
                                            <Box
                                                display="flex"
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                flexDirection={'column'}
                                                sx={{
                                                    pt: '15px'
                                                }}
                                               
                                            >
                                                <img style={{height: '100px'}} src={item.itemimage} alt={item.itemtype} />
                                                <Typography style={{marginTop: '10px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.xs}}>{item.itemtype}</Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    px: '15px',
                                                    pb: '15px'
                                                }}
                                            >
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size='small'
                                                        onClick={() => removeCollectionItemType(item._id as string)}
                                                        sx={style.editDeleteButton}
                                                    >
                                                        <DeleteIcon style={{color: themeProperties.colors.error, fontSize: themeProperties.fontSize.sm}} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size='small'
                                                        onClick={() => editCollectionItemType(item)}
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
                                    height={'184.5px'}
                                    flexDirection={'column'}
                                    sx={style.addButton}
                                    onClick={() => setOpen(true)}
                                >
                                    <AddCircleIcon style={{color: themeProperties.colors.primary, fontSize: themeProperties.fontSize.mdp}} />
                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.xs}}>Add Item Type</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '20px', paddingRight: '20px', marginTop: '30px'}}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row'
                            }}
                        >
                            <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Condition Type</Typography>
                            <Tooltip title="Levels in item Condition. Eg: Gem Condition, Minor Defects">
                                <HelpIcon style={{cursor: 'pointer', color: themeProperties.colors.gray, marginLeft: '10px', fontSize: themeProperties.fontSize.smp, marginTop: '6px'}} />
                            </Tooltip>
                        </Box>
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '20px', paddingRight: '20px', marginTop: '15px'}}>
                        <Grid container spacing={3}>
                            {conditionTypes.map((item, index) => {
                                return (
                                    <Grid key={`condition-${String(index)}`} item xs={6} md={2}>
                                        <Box
                                            borderRadius={'10px'}
                                            bgcolor={themeProperties.colors.secondary}
                                            height={'84.5px'}
                                        >
                                            <Box
                                                display="flex"
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                flexDirection={'column'}
                                                sx={{
                                                    pt: '5px'
                                                }}
                                               
                                            >
                                                <Typography style={{marginTop: '10px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.smp}}>{item.conditiontype}</Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    px: '15px',
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
                                    height={'84.5px'}
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
                </Grid>
                <CreateItemType 
                    open={open}
                    handleClose={() => {
                        setOpen(false)
                        setEditItemType(undefined)
                    }}
                    modalHead={editItemtype ? 'Edit Item type' : 'Add Item type'}
                    addCollectionItemType={addCollectionItemType}
                    editItemtype={editItemtype}
                    confirmeditCollectionItemType={confirmeditCollectionItemType}
                />
                <DeleteConfirmation 
                    open={openConfimation}
                    handleClose={() => {
                        setOpenConfirmation(false)
                        setDeletionId('')
                    }}
                    modalHead='Delete Confimation'
                    confirm={confirmRemoveCollectionItemType}
                    deletionItem={'Collection Item Type'}
                />
                <CreateConditionType 
                    open={open2}
                    handleClose={() => {
                        setOpen2(false)
                        setEditConditionType(undefined)
                    }}
                    modalHead={editItemtype ? 'Edit Condition type' : 'Add Condition type'}
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
