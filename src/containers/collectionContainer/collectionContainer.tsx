import { FunctionComponent, useEffect, useState } from 'react';
import { Grid, Typography, Box, Button, Tooltip, IconButton } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { CollectionItemTypeInterface, ConditionTypeInterface } from '../../contracts/configurationInterface';
import { getConfiguration } from '../../services/configurationService';
import Loading from '../../components/common/loading';
import { themeProperties } from '../../constants/themeProperties';
import ReportIcon from '@mui/icons-material/Report';
import { useNavigate } from "react-router-dom";
import { darken } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { capitalize } from 'lodash';

const style = {
    gotoButton: {
        marginTop: '25px',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1),
        }
    },
    arrowButton: {
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

    const [loading, setLoading] = useState<boolean>(false)
    const [itemTypes, setItemTypes] = useState<CollectionItemTypeInterface[]>([])
    const [conditionTypes, setConditionTypes] = useState<ConditionTypeInterface[]>([])

    useEffect(() => {
        fetchPageApis()
    }, []);

    const fetchPageApis = async() => {
        setLoading(true)
        const response = await getConfiguration()
        setItemTypes(response.data ? response.data.collectionItemTypes : [])
        setConditionTypes(response.data ? response.data.conditionTypes : [])
        setLoading(false)
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
                    {(itemTypes.length === 0 || conditionTypes.length === 0) &&
                        <Grid item xs={12} style={{paddingLeft: '20px', paddingRight: '20px', marginTop: '25px'}}>
                            <Box 
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                flexDirection={'column'}
                                minHeight="50vH"
                            >
                                <ReportIcon sx={{color: themeProperties.colors.error, fontSize: themeProperties.fontSize.xxxl}} />
                                <Typography sx={{color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.mdp, fontWeight: themeProperties.fontWeight.bold, marginTop: '20px', textAlign: 'center'}}>
                                    Uh-Oh !! Please add Collection Item Type and Condition Type from Configuration
                                </Typography>
                                <Button variant="contained" disableElevation sx={style.gotoButton} onClick={() => navigate('/configuration')}>
                                    Goto Configuration
                                </Button>
                            </Box>
                        </Grid>
                    }
                    {(itemTypes.length !== 0 && conditionTypes.length !== 0) &&
                        <Grid item xs={12} style={{paddingLeft: '20px', paddingRight: '20px', marginTop: '25px'}}>
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
                                                        justifyContent: 'center',
                                                        px: '15px',
                                                        pt: '5px',
                                                        pb: '15px'
                                                    }}
                                                >
                                                    <Tooltip title={`Goto ${capitalize(item.itemtype)} Collection`}>
                                                        <IconButton
                                                            size='small'
                                                            onClick={() => navigate(`/collection/${item.itemtype.trim().toLowerCase().replace(/\s/g,'')}`)}
                                                            sx={style.arrowButton}
                                                        >
                                                            <ArrowForwardIcon style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm}} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </FixedDrawer>
        );
    }
}

export default Collection;
