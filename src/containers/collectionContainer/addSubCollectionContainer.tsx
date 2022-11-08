import { FunctionComponent, useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Grid, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip, Button } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { useSnackbar } from 'notistack';
import Loading from '../../components/common/loading';
import { capitalize, uniq } from 'lodash';
import { themeProperties } from '../../constants/themeProperties';
import { CollectionItemTypeInterface, ConditionTypeInterface, CurrencyInterface } from '../../contracts/configurationInterface';
import { getConfiguration } from '../../services/configurationService';
import QrcodeTextfield from '../../components/common/qrcodeTextfield';
import { currencies } from '../../constants/currencies';
import { countries } from '../../constants/countries';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { darken } from '@mui/material/styles';
import { CollectionInterface, CollectionCopyInterface } from '../../contracts/collectionInterface';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import CancelIcon from '@mui/icons-material/Cancel';
import { getSingleCollection, postCollection, putCollection } from '../../services/collectionServices';

const style = {
    textField: {
        color: themeProperties.colors.textPrimary, 
        fontSize: themeProperties.fontSize.xs
    },
    addButton: {
        backgroundColor: themeProperties.colors.secondary,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.secondary, 0.1)
        }
    },
    saveButton: {
        width: '100%',
        marginTop: '15px',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1),
        }
    },
    cancelButton: {
        width: '100%',
        marginTop: '15px',
        backgroundColor: themeProperties.colors.white,
        color: themeProperties.colors.primary,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.white, 0.1),
        }
    }
}

interface Props {
  
}

const AddSubCollection: FunctionComponent<Props> = ()  => {
    const { itemtype } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false)
    const [currency, setCurrency] = useState<CurrencyInterface>()
    const [itemType, setItemType] = useState<CollectionItemTypeInterface>()
    const [conditionTypes, setConditionTypes] = useState<ConditionTypeInterface[]>([])
    const [itemName, setItemName] = useState<string>('')
    const [color, setColor] = useState<string>('')
    const [year, setYear] = useState<string>('')
    const [uniqueFeature, setUniqueFeature] = useState<string>('')
    const [collectionSetQrcode, setCollectionSetQrcode] = useState<string>('')
    const [country, setCountry] = useState<string>('')
    const [copies, setCopies] = useState<CollectionCopyInterface[]>([])
    const [update, setUpdate] = useState<boolean>(false)

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
                    enqueueSnackbar(`${capitalize(itemtype)} is not added in Collection. Redirecting to Collections.`, { variant: "info", preventDuplicate: true })
                    navigate('/collection')
                } else {
                    setItemType(addedCollection)
                    setConditionTypes(response.data ? response.data.conditionTypes : [])
                    const currencyfromdb = currencies.find(element => element.code === response.data.currency)
                    const selectedCurrency = currencyfromdb ? currencyfromdb : currencies[0]
                    setCurrency(selectedCurrency)
                    const id = searchParams.get("id")
                    if(id) {
                        const response1 = await getSingleCollection(id)
                        if(response1.data) {
                            setUpdate(true)
                            setItemName(response1.data.itemName)
                            setColor(response1.data.color)
                            setYear(response1.data.year)
                            setUniqueFeature(response1.data.uniqueFeature)
                            setCollectionSetQrcode(response1.data.collectionSetQrcode)
                            setCountry(response1.data.country)
                            setCopies(response1.data.copies)
                        } else {
                            enqueueSnackbar(`Particular ${capitalize(itemtype)} is not added in Database. Redirecting to Collections.`, { variant: "info", preventDuplicate: true })
                            navigate(`/collection/${itemtype}`)
                        }
                    }
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        }
    }

    const addCopy = () => {
        const newCopy: CollectionCopyInterface = {
            copyqrcode: '',
            condition: '',
            purchaseprice: '',
            marketprice: '',
            remarks: '',
            collectedfrom: '',
            collectedon: null
        }
        const updatedCopies = [...copies, ...[newCopy]]
        setCopies(updatedCopies)
    }

    const removeCopy = (index: number) => {
        let tempArray = [...copies];
        tempArray.splice(index, 1)
        setCopies(tempArray)
    }

    const changeCopyValues = (field: 'copyqrcode'|'condition'|'purchaseprice'|'marketprice'|'remarks'|'collectedfrom'|'collectedon', index: number, value: string|Date|null) => {
        setCopies(prev => prev.map((element, elindex) => elindex === index ? {...element, ...{[field]: value}} : element))
    }

    const saveCollection = async() => {
        if(itemType) {
            if(itemName.trim().length === 0) {
                enqueueSnackbar(`Please enter ${capitalize(itemType?.itemtype)} Name`, { variant: "warning", preventDuplicate: true })
            } else if(color.trim().length === 0) {
                enqueueSnackbar(`Please enter Color`, { variant: "warning", preventDuplicate: true })
            } else if(year.trim().length === 0) {
                enqueueSnackbar(`Please enter Year of production`, { variant: "warning", preventDuplicate: true })
            } else if(isNaN(Number(year)) || Number(year) < 1 || !Number.isInteger(Number(year))) {
                enqueueSnackbar(`Year of production is Invalid`, { variant: "warning", preventDuplicate: true })
            } else if(Number(year) > new Date().getFullYear()) {
                enqueueSnackbar(`Year of production should not go beyond ${new Date().getFullYear()}`, { variant: "warning", preventDuplicate: true })
            } else if(uniqueFeature.trim().length === 0) {
                enqueueSnackbar(`Please enter Unique Feature`, { variant: "warning", preventDuplicate: true })
            } else if(collectionSetQrcode.trim().length === 0) {
                enqueueSnackbar(`Please add Collection Set QR Code`, { variant: "warning", preventDuplicate: true })
            } else if(country.trim().length === 0) {
                enqueueSnackbar(`Please Select Country of Origin`, { variant: "warning", preventDuplicate: true })
            } else if(copies.length === 0) {
                enqueueSnackbar(`Please add atleast a Copy`, { variant: "warning", preventDuplicate: true })
            } else if(copies.some(copy => copy.copyqrcode.trim().length === 0)) {
                enqueueSnackbar(`Please add Copy QR code for all copies`, { variant: "warning", preventDuplicate: true })
            } else if(copies.some(copy => copy.condition.trim().length === 0)) {
                enqueueSnackbar(`Please select Condition for all copies`, { variant: "warning", preventDuplicate: true })
            } else if(copies.some(copy => copy.purchaseprice.trim().length === 0)) {
                enqueueSnackbar(`Please add Purchase Price for all copies`, { variant: "warning", preventDuplicate: true })
            } else if(copies.some(copy => isNaN(Number(copy.purchaseprice)) || Number(copy.purchaseprice) < 0)) {
                enqueueSnackbar(`Invalid Purchase Price found in some copies`, { variant: "warning", preventDuplicate: true })
            } else if(copies.some(copy => copy.marketprice.trim().length === 0)) {
                enqueueSnackbar(`Please add Market Price for all copies`, { variant: "warning", preventDuplicate: true })
            } else if(copies.some(copy => isNaN(Number(copy.marketprice)) || Number(copy.marketprice) < 0)) {
                enqueueSnackbar(`Invalid Market Price found in some copies`, { variant: "warning", preventDuplicate: true })
            } else if(copies.some(copy => copy.remarks.trim().length === 0)) {
                enqueueSnackbar(`Please add Remarks for all copies`, { variant: "warning", preventDuplicate: true })
            } else if(copies.some(copy => copy.collectedfrom.trim().length === 0)) {
                enqueueSnackbar(`Please add Collected from detail for all copies`, { variant: "warning", preventDuplicate: true })
            } else if(copies.some(copy => copy.collectedon === null)) {
                enqueueSnackbar(`Please add Collected on detail for all copies`, { variant: "warning", preventDuplicate: true })
            } else if(copies.some(copy => copy.collectedon as Date > new Date())) {
                enqueueSnackbar(`Please make sure for all copies, Collected on Date should not go beyond ${new Date().toLocaleDateString('en-GB')}`, { variant: "warning", preventDuplicate: true })
            } else {
                const allQrs = [collectionSetQrcode, ...copies.map(copy => copy.copyqrcode)]
                if(uniq(allQrs).length !== allQrs.length) {
                    enqueueSnackbar(`QR code duplicate found within Copy QR Codes and Collection Set QR Code`, { variant: "warning", preventDuplicate: true })
                } else {
                    try {
                        setLoading(true)
                        const collection: CollectionInterface = update ? {
                            _id: searchParams.get("id") as string,
                            collectionof: itemType._id as string,
                            itemName: itemName.trim(),
                            color: color.trim(),
                            year: year.trim(),
                            uniqueFeature: uniqueFeature.trim(),
                            collectionSetQrcode,
                            country,
                            copies
                        } : {
                            collectionof: itemType._id as string,
                            itemName: itemName.trim(),
                            color: color.trim(),
                            year: year.trim(),
                            uniqueFeature: uniqueFeature.trim(),
                            collectionSetQrcode,
                            country,
                            copies
                        }
                        const response = update ? await putCollection(collection) : await postCollection(collection)
                        enqueueSnackbar(response.message, { variant: "success", preventDuplicate: true })
                        navigate(`/collection/${itemtype}`)
                        setLoading(false)
                    } catch (error) {
                        setLoading(false)
                    }
                }
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
                        <SuggestionBox greetingType='default' subtext={update ? `Update the ${capitalize(itemType?.itemtype)} Collection` : `Add a new ${capitalize(itemType?.itemtype)} Collection`} />
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '15px', paddingRight: '15px', marginTop: '20px'}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box
                                    bgcolor={themeProperties.colors.secondary}
                                    borderRadius={'10px'}
                                    p={'20px'}
                                >
                                    <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Collection Details</Typography>
                                    <TextField label={`${capitalize(itemType?.itemtype)} Name`} variant="outlined" value={itemName}
                                        sx={{marginTop: '13px', marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                        inputProps={{style: style.textField}}
                                        InputLabelProps={{style: style.textField}}
                                        onChange={(event) => setItemName(event.target.value)}
                                    />
                                    <TextField label={`Color`} variant="outlined" value={color}
                                        sx={{marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                        inputProps={{style: style.textField}}
                                        InputLabelProps={{style: style.textField}}
                                        onChange={(event) => setColor(event.target.value)}
                                    />
                                    <TextField label={`Year of production`} variant="outlined" value={year}
                                        sx={{marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                        inputProps={{style: style.textField}}
                                        InputLabelProps={{style: style.textField}}
                                        onChange={(event) => setYear(event.target.value)}
                                    />
                                    <TextField label={`Unique Feature`} variant="outlined" value={uniqueFeature}
                                        sx={{marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                        inputProps={{style: style.textField}}
                                        InputLabelProps={{style: style.textField}}
                                        onChange={(event) => setUniqueFeature(event.target.value)}
                                    />
                                    <Typography style={{marginBottom: '13px', color: themeProperties.colors.gray, fontSize: themeProperties.fontSize.xxs}}>NB: A {capitalize(itemType?.itemtype)} collection set, with {capitalize(itemType?.itemtype)} Name, Color, Year of Production and Unique Feature will be created. You can add mutiple copies to this Collection set</Typography>
                                    <QrcodeTextfield label={`Collection Set QR Code`} variant="outlined" value={collectionSetQrcode}
                                        sx={{marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                        inputProps={{style: style.textField}}
                                        InputLabelProps={{style: style.textField}}
                                        onChange={(event) => setCollectionSetQrcode(event.target.value)}
                                        getQr={(qrcode) => setCollectionSetQrcode(qrcode)}
                                    />
                                    <FormControl fullWidth style={{marginBottom: '13px', background: themeProperties.colors.white}}>
                                        <InputLabel id="country-select-label">Country of Origin</InputLabel>
                                        <Select
                                            labelId="country-select-label"
                                            id="country-select"
                                            value={country}
                                            label="Country of Origin"
                                            onChange={(e) => {setCountry(e.target.value)}}
                                            size='medium'
                                            sx={style.textField}
                                        >
                                            {countries.map(element => {
                                                return (
                                                    <MenuItem key={element.code} value={element.code}>{element.name}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {copies.map((copy, index) => {
                                    return (
                                        <Box
                                            key={`copy-${String(index)}`}
                                            bgcolor={themeProperties.colors.secondary}
                                            borderRadius={'10px'}
                                            p={'20px'}
                                            mb={'20px'}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Typography style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.md, fontWeight: themeProperties.fontWeight.bolder}}>Copy {String(index + 1)} Details</Typography>
                                                <Tooltip title="Remove Copy">
                                                    <CancelIcon style={{cursor: 'pointer', color: themeProperties.colors.error, fontSize: themeProperties.fontSize.md, marginTop: '5px'}} onClick={() => removeCopy(index)} />
                                                </Tooltip>
                                            </Box>
                                            <QrcodeTextfield label={`Copy QR Code`} variant="outlined" value={copy.copyqrcode}
                                                sx={{marginTop: '13px', marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                                inputProps={{style: style.textField}}
                                                InputLabelProps={{style: style.textField}}
                                                onChange={(event) => changeCopyValues('copyqrcode', index, event.target.value)}
                                                getQr={(qrcode) => changeCopyValues('copyqrcode', index, qrcode)}
                                            />
                                            <FormControl fullWidth style={{marginBottom: '13px', background: themeProperties.colors.white}}>
                                                <InputLabel id={`condition-${String(index)}-select-label`}>Condition</InputLabel>
                                                <Select
                                                    labelId={`condition-${String(index)}-select-label`}
                                                    id={`condition-${String(index)}-select`}
                                                    value={copy.condition}
                                                    label="Condition"
                                                    onChange={(e) => changeCopyValues('condition', index, e.target.value)}
                                                    size='medium'
                                                    sx={style.textField}
                                                >
                                                    {conditionTypes.map(element => {
                                                        return (
                                                            <MenuItem key={element.conditiontype} value={element._id as string}>{element.conditiontype}</MenuItem>
                                                        )
                                                    })}
                                                </Select>
                                            </FormControl>
                                            <TextField label={`Purchase Price in ${currency?.expansion}`} variant="outlined" value={copy.purchaseprice}
                                                sx={{marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                                inputProps={{style: style.textField}}
                                                InputLabelProps={{style: style.textField}}
                                                onChange={(event) => changeCopyValues('purchaseprice', index, event.target.value)}
                                            />
                                            <TextField label={`Market Price in ${currency?.expansion}`} variant="outlined" value={copy.marketprice}
                                                sx={{marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                                inputProps={{style: style.textField}}
                                                InputLabelProps={{style: style.textField}}
                                                onChange={(event) => changeCopyValues('marketprice', index, event.target.value)}
                                            />
                                            <TextField label={`Remarks`} variant="outlined" value={copy.remarks}
                                                sx={{marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                                inputProps={{style: style.textField}}
                                                InputLabelProps={{style: style.textField}}
                                                onChange={(event) => changeCopyValues('remarks', index, event.target.value)}
                                            />
                                            <TextField label={`Collected From`} variant="outlined" value={copy.collectedfrom}
                                                sx={{marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                                inputProps={{style: style.textField}}
                                                InputLabelProps={{style: style.textField}}
                                                onChange={(event) => changeCopyValues('collectedfrom', index, event.target.value)}
                                            />
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    label="Collected On"
                                                    inputFormat="DD/MM/YYYY"
                                                    value={copy.collectedon}
                                                    onChange={(value) => changeCopyValues('collectedon', index, value)}
                                                    renderInput={(params) => 
                                                        <TextField 
                                                            sx={{width: '100%', color: themeProperties.colors.textPrimary, background: themeProperties.colors.white}}
                                                            inputProps={{style: style.textField}}
                                                            InputLabelProps={{style: style.textField}}
                                                            {...params}  
                                                        />
                                                    }
                                                />
                                            </LocalizationProvider>
                                        </Box>
                                    )
                                })}
                                <Box
                                    p={'20px'}
                                    display="flex"
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    borderRadius={'10px'}
                                    flexDirection={'column'}
                                    sx={style.addButton}
                                    onClick={addCopy}
                                >
                                    <AddCircleIcon style={{color: themeProperties.colors.primary, fontSize: themeProperties.fontSize.md}} />
                                    <Typography style={{marginTop: '5px', color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.xs, textAlign: 'center'}}>Add a New Copy</Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Button variant="contained" disableElevation sx={style.cancelButton} onClick={() => navigate(`/collection/${itemtype}`)}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button variant="contained" disableElevation sx={style.saveButton} onClick={saveCollection}>
                                            {update ? 'Update' : 'Save'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </FixedDrawer>
        );
    }
}

export default AddSubCollection;
