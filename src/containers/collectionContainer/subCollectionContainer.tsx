import { FunctionComponent, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Box, Button, useMediaQuery } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { CollectionItemTypeInterface } from '../../contracts/configurationInterface';
import { getConfiguration } from '../../services/configurationService';
import { useSnackbar } from 'notistack';
import Loading from '../../components/common/loading';
import { capitalize } from 'lodash';
import Table from '../../components/common/table';
import { themeProperties } from '../../constants/themeProperties';
import { darken, useTheme } from '@mui/material/styles';
import { deleteCollection, getCollection } from '../../services/collectionServices';
import { CollectionInterface } from '../../contracts/collectionInterface';
import { countries } from '../../constants/countries';
import { DatagridActionInterface } from '../../contracts/miscInterface';
import DeleteConfirmation from '../../components/modals/deleteConfimation';

interface Props {
  
}

const style = {
    addButton: {
        marginLeft: '15px',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1)
        }
    },
    infoBox: {
        backgroundColor: themeProperties.colors.white,
        cursor: 'context-menu',
        color: themeProperties.colors.primary,
        '&:hover': {
            backgroundColor: themeProperties.colors.white,
            color: themeProperties.colors.primary
        }
    }
}

const SubCollection: FunctionComponent<Props> = ()  => {
    const { itemtype } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const [loading, setLoading] = useState<boolean>(false)
    const [itemType, setItemType] = useState<CollectionItemTypeInterface>()
    const [collection, setCollection] = useState<CollectionInterface[]>([])
    const [openConfimation, setOpenConfirmation] = useState<boolean>(false)
    const [deletionId, setDeletionId] = useState<string>('')

    useEffect(() => {
        fetchPageApis()
    }, []);

    const fetchPageApis = async() => {
        if(itemtype) {
            try {
                setLoading(true)
                const response = await getConfiguration()
                const addedCollection = response.data.collectionItemTypes.find(item => item.itemtype.trim().toLowerCase().replace(/\s/g,'') === itemtype.trim().toLowerCase().replace(/\s/g,''))
                if(!addedCollection) {
                    enqueueSnackbar(`${capitalize(itemtype)} is not added as in Collection. Redirecting back.`, { variant: "info", preventDuplicate: true })
                    navigate('/collection')
                } else {
                    setItemType(addedCollection)
                    const response1 = await getCollection(addedCollection._id as string)
                    setCollection(response1.data)
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        }
    }

    const itemName = (itemType?.itemtype)?.toLowerCase() as string + ' Name'
    const headers: string[] = matches ? ['id', itemName, 'color', 'year', 'unique feature', 'country', 'copies'] : ['id', itemName, 'unique feature']
    const rows: any[] = collection.map((element, index) => {
        const row: any = matches ? {
            [headers[0]]: index + 1,
            [headers[1]]: element.itemName,
            [headers[2]]: element.color,
            [headers[3]]: element.year,
            [headers[4]]: element.uniqueFeature,
            [headers[5]]: countries.find(country => country.code === element.country)?.name,
            [headers[6]]: String(element.copies.length) + ' Copy'
        } : {
            [headers[0]]: index + 1,
            [headers[1]]: element.itemName,
            [headers[2]]: element.uniqueFeature
        }
        return row
    })

    const editCollection = (data: CollectionInterface) => {
        navigate(`/collection/${itemtype}/add?id=${data._id as string}`)
    }

    const removeCollection = (data: CollectionInterface) => {
        setDeletionId(data._id as string)
        setOpenConfirmation(true)
    }

    const confirmRemoveCollection = async() => {
        if(deletionId) {
            try {
                setLoading(true)
                const response = await deleteCollection(deletionId)
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

    const actions: DatagridActionInterface[] = [{
        action: 'Edit',
        function: editCollection
    }, {
        action: 'Delete',
        function: removeCollection
    }];

    if(loading) {
        return (
            <Loading />
        )
    } else {
        return (
            <FixedDrawer>
                <Grid container>
                    <Grid item xs={12}>
                        <SuggestionBox greetingType='default' subtext={`View your ${capitalize(itemType?.itemtype)} Collection Overview`} />
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '20px'}}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row'
                            }}
                        >
                            <Button variant="contained" disableElevation sx={style.infoBox}>{capitalize(itemType?.itemtype)} count: {String(collection.length)}</Button>
                            <Button variant="contained" disableElevation sx={style.addButton} onClick={() => navigate(`/collection/${itemtype}/add`)}>
                                Add a new {capitalize(itemType?.itemtype)}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '20px'}}>
                        <Table rows={rows} headers={headers} ogData={collection} actions={actions} />
                    </Grid>
                </Grid>
                <DeleteConfirmation 
                    open={openConfimation}
                    handleClose={() => {
                        setOpenConfirmation(false)
                        setDeletionId('')
                    }}
                    modalHead='Delete Confimation'
                    confirm={confirmRemoveCollection}
                    deletionItem={capitalize(itemType?.itemtype)}
                    warning={`NB: Action will delete all the added copies of selected ${capitalize(itemType?.itemtype)}`}
                />
            </FixedDrawer>
        );
    }
}

export default SubCollection;
