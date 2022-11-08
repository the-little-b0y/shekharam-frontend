import { FunctionComponent, useEffect, useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { themeProperties } from '../../constants/themeProperties';
import { darken } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";
import { CollectionItemTypeInterface } from '../../contracts/configurationInterface';
import { getConfiguration } from '../../services/configurationService';
import Loading from '../../components/common/loading';

const style = {
    addButton: {
        backgroundColor: themeProperties.colors.secondary,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.secondary, 0.1)
        }
    }
}

interface Props {
  
}

const Dashboard: FunctionComponent<Props> = ()  => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false)
    const [itemTypes, setItemTypes] = useState<CollectionItemTypeInterface[]>([])

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
                        </Grid>
                    </Grid>
                </Grid>
            </FixedDrawer>
        );
    }
}

export default Dashboard;
