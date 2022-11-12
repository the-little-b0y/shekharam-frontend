import React, { FunctionComponent, useEffect, useState } from 'react';
import { Grid, Box, Typography, Tooltip, IconButton, Button } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { themeProperties } from '../../constants/themeProperties';
import { darken } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import { CollectionItemTypeInterface } from '../../contracts/configurationInterface';
import { getConfiguration } from '../../services/configurationService';
import Loading from '../../components/common/loading';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import QrcodeTextfield from '../../components/common/qrcodeTextfield';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from 'notistack';
import { getCollectionIdByCopyQR, getCollectionIdBySetQR } from '../../services/collectionServices';

const style = {
    addButton: {
        backgroundColor: themeProperties.colors.secondary,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.secondary, 0.1)
        }
    },
    actionButton: {
        backgroundColor: themeProperties.colors.quaternary,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.quaternary, 0.1)
        }
    },
    textField: {
        color: themeProperties.colors.textPrimary, 
        fontSize: themeProperties.fontSize.xs
    },
    searchButton: {
        marginLeft: '15px',
        height: '50px',
        backgroundColor: themeProperties.colors.primary,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.primary, 0.1),
        }
    }
}

interface Props {
  
}

const Dashboard: FunctionComponent<Props> = ()  => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState<boolean>(false)
    const [itemTypes, setItemTypes] = useState<CollectionItemTypeInterface[]>([])
    const [collectionSetQrcode, setCollectionSetQrcode] = useState<string>('')
    const [copyQrcode, setCopyQrcode] = useState<string>('')

    useEffect(() => {
        fetchPageApis()
    }, []);

    const fetchPageApis = async() => {
        try {
            setLoading(true)
            const response = await getConfiguration()
            setItemTypes(response.data ? response.data.collectionItemTypes : [])
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const searchCollectionQr = async() => {
        if(collectionSetQrcode) {
            try {
                setLoading(true)
                const response = await getCollectionIdBySetQR(collectionSetQrcode)
                if(response.data._id) {
                    enqueueSnackbar(`Collection Set found`, { variant: "success", preventDuplicate: true })
                    navigate(`/dashboard/viewcollection?collectionset=${response.data._id}`) 
                } else {
                    enqueueSnackbar(`QR Code does not match any Collection Set`, { variant: "warning", preventDuplicate: true })
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        } else {
            enqueueSnackbar(`Collection Set QR Code is not present`, { variant: "warning", preventDuplicate: true })
        }
    }

    const searchCopyQr = async() => {
        if(copyQrcode) {
            try {
                setLoading(true)
                const response = await getCollectionIdByCopyQR(copyQrcode)
                if(response.data._id) {
                    enqueueSnackbar(`Collection Copy found`, { variant: "success", preventDuplicate: true })
                    navigate(`/dashboard/viewcollection?collectionset=${response.data._id}&copy=${response.data.copyid}`) 
                } else {
                    enqueueSnackbar(`QR Code does not match any Collection Copy`, { variant: "warning", preventDuplicate: true })
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }         
        } else {
            enqueueSnackbar(`Copy QR Code is not present`, { variant: "warning", preventDuplicate: true })
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
                        <SuggestionBox greetingType='timed' subtext='Here is your Overall Report' />
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '20px'}}>
                        <Grid container spacing={3}>
                            <Grid item xs={6} md={2}>
                                <Box
                                    display="flex"
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    borderRadius={'10px'}
                                    p={'20px'}
                                    height={'170px'}
                                    flexDirection={'column'}
                                    sx={{backgroundColor: themeProperties.colors.secondary, cursor: 'context-menu'}}
                                >
                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.xs, textAlign: 'center'}}>You currently have</Typography>
                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bolder, textAlign: 'center'}}>{String(itemTypes.length)}</Typography>
                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.xs, textAlign: 'center'}}>Collection{itemTypes.length > 1 ? 's' : ''}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <Box
                                    display="flex"
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    borderRadius={'10px'}
                                    p={'20px'}
                                    height={'170px'}
                                    flexDirection={'column'}
                                    sx={style.addButton}
                                    onClick={() => navigate('/collection')}
                                >
                                    <ArrowForwardIcon style={{color: themeProperties.colors.primary, fontSize: themeProperties.fontSize.mdp}} />
                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.xs, textAlign: 'center'}}>Let's add a new <span style={{fontWeight: themeProperties.fontWeight.bolder}}>Collection</span></Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Box
                                    display="flex"
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    borderRadius={'10px'}
                                    p={'20px'}
                                    height={'170px'}
                                    flexDirection={'column'}
                                    sx={{backgroundColor: themeProperties.colors.secondary}}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            width: '100%'
                                        }}
                                    >
                                        <QrcodeTextfield label={`Search Collection Set`} variant="outlined" value={collectionSetQrcode}
                                            sx={{width: '100%', marginBottom: '13px',color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                            inputProps={{style: style.textField}}
                                            InputLabelProps={{style: style.textField}}
                                            onChange={(event) => setCollectionSetQrcode(event.target.value)}
                                            getQr={(qrcode) => setCollectionSetQrcode(qrcode)}
                                        />
                                        <Button variant="contained" disableElevation sx={style.searchButton}
                                            onClick={searchCollectionQr}
                                        >
                                            <SearchIcon />
                                        </Button>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            width: '100%'
                                        }}
                                    >
                                        <QrcodeTextfield label={`Search Copy`} variant="outlined" value={copyQrcode}
                                            sx={{width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                            inputProps={{style: style.textField}}
                                            InputLabelProps={{style: style.textField}}
                                            onChange={(event) => setCopyQrcode(event.target.value)}
                                            getQr={(qrcode) => setCopyQrcode(qrcode)}
                                        />
                                        <Button variant="contained" disableElevation sx={style.searchButton}
                                            onClick={searchCopyQr}
                                        >
                                            <SearchIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                            {(itemTypes.length > 0) &&
                                <React.Fragment>
                                    <Grid item xs={12}>
                                        <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Your Collection</Typography>
                                    </Grid>
                                    {itemTypes.map((element, index) => {
                                        return (
                                            <Grid item xs={6} md={2} key={`grid-${String(index)}`}>
                                                <Box
                                                    display="flex"
                                                    justifyContent={'center'}
                                                    alignItems={'center'}
                                                    borderRadius={'10px'}
                                                    p={'20px'}
                                                    height={'200px'}
                                                    flexDirection={'column'}
                                                    sx={{backgroundColor: themeProperties.colors.white, cursor: 'context-menu'}}
                                                >
                                                    <img style={{height: '100px'}} src={element.itemimage} alt={element.itemtype} />
                                                    <Typography style={{marginTop: '10px', marginBottom: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm, fontWeight: themeProperties.fontWeight.bold}}>{element.itemtype}</Typography>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Tooltip title="View">
                                                            <IconButton
                                                                size='small'
                                                                onClick={() => navigate(`/dashboard/viewcollection?id=${element._id as string}`)}
                                                                sx={style.actionButton}
                                                            >
                                                                <KeyboardArrowRight style={{color: themeProperties.colors.primary, fontSize: themeProperties.fontSize.sm}} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        )
                                    })}
                                </React.Fragment>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </FixedDrawer>
        );
    }
}

export default Dashboard;
