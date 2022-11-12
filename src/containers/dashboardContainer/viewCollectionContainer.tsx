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
import { getCollection, getSingleCollection } from '../../services/collectionServices';
import { capitalize } from 'lodash';
import { themeProperties } from '../../constants/themeProperties';
import { countries } from '../../constants/countries';
import { currencies } from '../../constants/currencies';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface AccordionProps {
    children: NonNullable<React.ReactNode>,
    open: boolean
}

interface Props {
  
}

const AccordionComponent: FunctionComponent<AccordionProps> = ({children, open})  => {
    if(open) {
        return (
            <Accordion expanded={true} elevation={0} sx={{background: themeProperties.colors.secondary, borderRadius: '10px'}}>
                {children}
            </Accordion>
        )
    } else {
        return (
            <Accordion elevation={0} sx={{background: themeProperties.colors.secondary, borderRadius: '10px'}}>
                {children}
            </Accordion>
        )
    }
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
    const [searchMode, setSearchMode] = useState<boolean>(false)
    const [expandMode, setExpandMode] = useState<boolean>(false)

    useEffect(() => {
        fetchPageApis()
    }, []);

    const fetchPageApis = async() => {
        try {
            setLoading(true)
            const response = await getConfiguration()
            const id = searchParams.get("id")
            const collectionset = searchParams.get("collectionset")
            const copy = searchParams.get("copy")
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
            } else if(collectionset) {
                const response1 = await getSingleCollection(collectionset)
                setSearchMode(true)
                if(copy) {
                    setExpandMode(true)
                    let returndata = response1.data
                    const copies = returndata.copies.map(element => {
                        if(element._id === copy) {
                            const copydetail = {...element, ...{selected: true}}
                            return copydetail
                        } else {
                            return element
                        }
                    })
                    returndata = {...returndata, ...{copies: copies}}
                    setCollection([returndata])
                } else {
                    setCollection([response1.data])
                }
                const addedCollection = response.data.collectionItemTypes.find(item => item._id === response1.data.collectionof)
                const currencyfromdb = currencies.find(element => element.code === response.data.currency)
                const selectedCurrency = currencyfromdb ? currencyfromdb : currencies[0]
                setCurrency(selectedCurrency)
                setConditionTypes(response.data ? response.data.conditionTypes : [])
                setItemType(addedCollection)
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
                                        <Typography style={{marginBottom: '10px', color: themeProperties.colors.primary, fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bolder}}>{searchMode ? `Searched ${capitalize(itemType?.itemtype)} Set` : (capitalize(itemType?.itemtype) + ' Set ' + String(index + 1))}</Typography>
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
                                                <AccordionComponent open={expandMode}>
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
                                                                            bgcolor={cop.selected ? themeProperties.colors.quaternary : themeProperties.colors.white}
                                                                            borderRadius={'10px'}
                                                                            p={'20px'}
                                                                        >
                                                                            <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>{capitalize(itemType?.itemtype)} Copy {String(copindex + 1)} {cop.selected && ' (Searched)'}</Typography>
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
                                                </AccordionComponent>
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
