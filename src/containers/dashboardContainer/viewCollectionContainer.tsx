import { FunctionComponent, useEffect, useState } from 'react';
import { Grid, Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { useNavigate, useSearchParams } from "react-router-dom";
import { CollectionItemTypeInterface, ConditionTypeInterface, CurrencyInterface } from '../../contracts/configurationInterface';
import { getConfiguration } from '../../services/configurationService';
import Loading from '../../components/common/loading';
import { CollectionInterface } from '../../contracts/collectionInterface';
import { useSnackbar } from 'notistack';
import { getCollection } from '../../services/collectionServices';
import { capitalize } from 'lodash';
import { themeProperties } from '../../constants/themeProperties';
import { countries } from '../../constants/countries';
import { currencies } from '../../constants/currencies';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  
}

const ViewCollection: FunctionComponent<Props> = ()  => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false)
    const [itemType, setItemType] = useState<CollectionItemTypeInterface>()
    const [collection, setCollection] = useState<CollectionInterface[]>([])
    const [currency, setCurrency] = useState<CurrencyInterface>()
    const [conditionTypes, setConditionTypes] = useState<ConditionTypeInterface[]>([])

    useEffect(() => {
        fetchPageApis()
    }, []);

    const fetchPageApis = async() => {
        try {
            setLoading(true)
            const response = await getConfiguration()
            const id = searchParams.get("id")
            if(id) {
                const addedCollection = response.data.collectionItemTypes.find(item => item._id === id)
                if(!addedCollection) {
                    enqueueSnackbar(`Collection with this id is not present. Redirecting back.`, { variant: "info", preventDuplicate: true })
                    navigate('/dashboard')
                } else {
                    const currencyfromdb = currencies.find(element => element.code === response.data.currency)
                    const selectedCurrency = currencyfromdb ? currencyfromdb : currencies[0]
                    setCurrency(selectedCurrency)
                    setConditionTypes(response.data ? response.data.conditionTypes : [])
                    setItemType(addedCollection)
                    const response1 = await getCollection(addedCollection._id as string)
                    setCollection(response1.data)
                }
            } else {
                enqueueSnackbar(`id is not present. Redirecting back.`, { variant: "info", preventDuplicate: true })
                navigate('/dashboard')
            }
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
                        <SuggestionBox greetingType='default' subtext={`Here is your ${capitalize(itemType?.itemtype)} Collection`} />
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '15px'}}>
                        <Grid container spacing={3}>
                            {collection.map((element, index) => {
                                const purchasePrice = element.copies.map(cop => Number(cop.purchaseprice)).reduce((partialSum, a) => partialSum + a, 0)
                                const marketPrice = element.copies.map(cop => Number(cop.marketprice)).reduce((partialSum, a) => partialSum + a, 0)
                                return (
                                    <Grid key={`collection-${String(index)}`} item xs={12}>
                                        <Typography style={{marginBottom: '10px', color: themeProperties.colors.primary, fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bolder}}>{capitalize(itemType?.itemtype)} Set {String(index + 1)}</Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={4}>
                                                <Box
                                                    bgcolor={themeProperties.colors.white}
                                                    borderRadius={'10px'}
                                                    p={'20px'}
                                                    height={'200px'}
                                                >
                                                    <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Basic Details</Typography>
                                                    <Typography style={{marginTop: '10px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>{capitalize(itemType?.itemtype)} Name: {element.itemName}</Typography>
                                                    <Typography style={{marginTop: '3px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Color: {element.color}</Typography>
                                                    <Typography style={{marginTop: '3px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Year: {element.year}</Typography>
                                                    <Typography style={{marginTop: '3px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Unique Feature: {element.uniqueFeature}</Typography>
                                                    <Typography style={{marginTop: '3px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Country: {countries.find(country => country.code === element.country)?.name}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} md={2}>
                                                <Box
                                                    bgcolor={themeProperties.colors.secondary}
                                                    borderRadius={'10px'}
                                                    p={'20px'}
                                                    height={'200px'}
                                                    display="flex"
                                                    justifyContent={'center'}
                                                    alignItems={'center'}
                                                    flexDirection={'column'}
                                                >
                                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm, textAlign: 'center'}}>{capitalize(itemType?.itemtype)} Set contains</Typography>
                                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.lg, fontWeight: themeProperties.fontWeight.bolder, textAlign: 'center'}}>{String(element.copies.length)}</Typography>
                                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm, textAlign: 'center'}}>Cop{element.copies.length > 1 ? 'ies' : 'y'}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} md={2}>
                                                <Box
                                                    bgcolor={themeProperties.colors.secondary}
                                                    borderRadius={'10px'}
                                                    p={'20px'}
                                                    height={'200px'}
                                                    display="flex"
                                                    justifyContent={'center'}
                                                    alignItems={'center'}
                                                    flexDirection={'column'}
                                                >
                                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm, textAlign: 'center'}}>{capitalize(itemType?.itemtype)} Set was purchased for</Typography>
                                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.lg, fontWeight: themeProperties.fontWeight.bolder, textAlign: 'center'}}>{String(purchasePrice)}</Typography>
                                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm, textAlign: 'center'}}>{currency?.expansion}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} md={2}>
                                                <Box
                                                    bgcolor={themeProperties.colors.secondary}
                                                    borderRadius={'10px'}
                                                    p={'20px'}
                                                    height={'200px'}
                                                    display="flex"
                                                    justifyContent={'center'}
                                                    alignItems={'center'}
                                                    flexDirection={'column'}
                                                >
                                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm, textAlign: 'center'}}>Market price of {capitalize(itemType?.itemtype)} Set is</Typography>
                                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.lg, fontWeight: themeProperties.fontWeight.bolder, textAlign: 'center'}}>{String(marketPrice)}</Typography>
                                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm, textAlign: 'center'}}>{currency?.expansion}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Accordion elevation={0} sx={{background: themeProperties.colors.secondary, borderRadius: '10px'}}>
                                                    <AccordionSummary
                                                        style={{minHeight: '50px', height: '0px', margin: '0px'}}
                                                        expandIcon={<ExpandMoreIcon />}
                                                    >
                                                        <Typography sx={{color: themeProperties.colors.tertiary }}>
                                                            View Copies
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails sx={{paddingBottom: '25px'}}>
                                                        <Grid container spacing={3}>
                                                            {element.copies.map((cop, copindex) => {
                                                                return (
                                                                    <Grid key={`copies-${String(index)}-${String(copindex)}`} item xs={12} md={4}>
                                                                        <Box
                                                                            bgcolor={themeProperties.colors.quaternary}
                                                                            borderRadius={'10px'}
                                                                            p={'20px'}
                                                                        >
                                                                            <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>{capitalize(itemType?.itemtype)} Copy {String(copindex + 1)}</Typography>
                                                                            <Typography style={{marginTop: '10px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>{capitalize(itemType?.itemtype)} Condition: {conditionTypes.find(cond => cond._id === cop.condition)?.conditiontype}</Typography>
                                                                            <Typography style={{marginTop: '3px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Puchase Price: {cop.purchaseprice} {currency?.expansion}</Typography>
                                                                            <Typography style={{marginTop: '3px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Market Price: {cop.marketprice} {currency?.expansion}</Typography>
                                                                            <Typography style={{marginTop: '3px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Remarks: {cop.remarks}</Typography>
                                                                            <Typography style={{marginTop: '3px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Collected From: {cop.collectedfrom}</Typography>
                                                                            <Typography style={{marginTop: '3px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>Collected On: {new Date(cop.collectedon as Date).toLocaleDateString('en-GB')}</Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                )
                                                            })}
                                                        </Grid>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </FixedDrawer>
        );
    }
}

export default ViewCollection;
