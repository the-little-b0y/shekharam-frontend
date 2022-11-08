import { FunctionComponent, useEffect, useState } from 'react';
import { Grid, Typography, Box, Button, Tooltip, IconButton } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { CollectionItemTypeInterface, ConditionTypeInterface } from '../../contracts/configurationInterface';
import { deleteCollectionItemType, getConfiguration, postCollectionItemType, putCollectionItemType } from '../../services/configurationService';
import Loading from '../../components/common/loading';
import { themeProperties } from '../../constants/themeProperties';
import ReportIcon from '@mui/icons-material/Report';
import { useNavigate } from "react-router-dom";
import { darken } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { capitalize } from 'lodash';
import HelpIcon from '@mui/icons-material/Help';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateItemType from '../../components/modals/createItemtype';
import DeleteConfirmation from '../../components/modals/deleteConfimation';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSnackbar } from 'notistack';

const style = {
    addButton: {
        backgroundColor: themeProperties.colors.secondary,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.secondary, 0.1)
        }
    },
    gotoButton: {
        marginTop: '25px',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1),
        }
    },
    actionButton: {
        backgroundColor: themeProperties.colors.quaternary,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.quaternary, 0.1)
        }
    }
}

interface Props {
  
}

const Collection: FunctionComponent<Props> = ()  => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState<boolean>(false)
    const [itemTypes, setItemTypes] = useState<CollectionItemTypeInterface[]>([])
    const [conditionTypes, setConditionTypes] = useState<ConditionTypeInterface[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const [editItemtype, setEditItemType] = useState<CollectionItemTypeInterface>()
    const [openConfimation, setOpenConfirmation] = useState<boolean>(false)
    const [deletionId, setDeletionId] = useState<string>('')

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

    const editCollectionItemType = async(item: CollectionItemTypeInterface) => {
        setEditItemType(item)
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

    const removeCollectionItemType = (id: string) => {
        setDeletionId(id)
        setOpenConfirmation(true)
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

    if(loading) {
        return (
            <Loading />
        )
    } else {
        return (
            <FixedDrawer>
                <Grid container>
                    <Grid item xs={12}>
                        <SuggestionBox greetingType='default' subtext='View all your Collections here' />
                    </Grid>
                    {(conditionTypes.length === 0) &&
                        <Grid item xs={12} style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '13px'}}>
                            <Box 
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                flexDirection={'column'}
                                minHeight="50vH"
                            >
                                <ReportIcon sx={{color: themeProperties.colors.error, fontSize: themeProperties.fontSize.xxxl}} />
                                <Typography sx={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bold, marginTop: '20px', textAlign: 'center'}}>
                                    Uh-Oh !! Please add Condition Types from Configuration
                                </Typography>
                                <Button variant="contained" disableElevation sx={style.gotoButton} onClick={() => navigate('/configuration')}>
                                    Goto Configuration
                                </Button>
                            </Box>
                        </Grid>
                    }
                    {(conditionTypes.length !== 0) &&
                        <Grid item xs={12} style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '13px'}}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Collections</Typography>
                                        <Tooltip title="What are you collecting. Eg: Coins, Stamps">
                                            <HelpIcon style={{cursor: 'pointer', color: themeProperties.colors.gray, marginLeft: '10px', fontSize: themeProperties.fontSize.smp, marginTop: '6px'}} />
                                        </Tooltip>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} style={{marginTop: '20px'}}>
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
                                                            <Typography style={{marginTop: '10px', marginBottom: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.xs}}>{item.itemtype}</Typography>
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
                                                                    sx={style.actionButton}
                                                                >
                                                                    <DeleteIcon style={{color: themeProperties.colors.error, fontSize: themeProperties.fontSize.sm}} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Edit">
                                                                <IconButton
                                                                    size='small'
                                                                    onClick={() => editCollectionItemType(item)}
                                                                    sx={style.actionButton}
                                                                >
                                                                    <EditIcon style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm}} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={`Goto ${capitalize(item.itemtype)} Collection`}>
                                                                <IconButton
                                                                    size='small'
                                                                    onClick={() => navigate(`/collection/${item.itemtype.trim().toLowerCase().replace(/\s/g,'')}`)}
                                                                    sx={style.actionButton}
                                                                >
                                                                    <ArrowForwardIcon style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm}} />
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
                                                <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.xs}}>Add a Collection</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                </Grid>
                <CreateItemType 
                    open={open}
                    handleClose={() => {
                        setOpen(false)
                        setEditItemType(undefined)
                    }}
                    modalHead={editItemtype ? 'Edit Collection' : 'Add Collection'}
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
                    deletionItem={'Collection'}
                />
            </FixedDrawer>
        );
    }
}

export default Collection;
