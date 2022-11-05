import { FunctionComponent, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Grid } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';
import { CollectionItemTypeInterface } from '../../contracts/configurationInterface';
import { getConfiguration } from '../../services/configurationService';
import { useSnackbar } from 'notistack';
import Loading from '../../components/common/loading';
import { capitalize } from 'lodash';

interface Props {
  
}

const SubCollection: FunctionComponent<Props> = ()  => {
    const { itemtype } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState<boolean>(false)
    const [itemTypes, setItemTypes] = useState<CollectionItemTypeInterface[]>([])

    useEffect(() => {
        fetchPageApis()
    }, []);

    const fetchPageApis = async() => {
        if(itemtype) {
            try {
                setLoading(true)
                const response = await getConfiguration()
                setItemTypes(response.data ? response.data.collectionItemTypes : [])
                const isItemAdded = response.data.collectionItemTypes.find(item => item.itemtype.trim().toLowerCase().replace(/\s/g,'') === itemtype.trim().toLowerCase().replace(/\s/g,''))
                if(!isItemAdded) {
                    enqueueSnackbar(`${capitalize(itemtype)} is not added as an Item type in Configuration. Redirecting back.`, { variant: "info", preventDuplicate: true })
                    navigate('/collection')
                }
                setLoading(false)
            } catch (error) {
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
                        <SuggestionBox greetingType='default' subtext={`View all your ${capitalize(itemtype)} Collections here`} />
                    </Grid>
                    <Grid item xs={12} style={{paddingLeft: '20px', paddingRight: '20px', marginTop: '25px'}}>
                        
                    </Grid>
                </Grid>
            </FixedDrawer>
        );
    }
}

export default SubCollection;
