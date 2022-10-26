import { FunctionComponent} from 'react';
import { Grid } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';

interface Props {
  
}

const Collection: FunctionComponent<Props> = ()  => {
    return (
        <FixedDrawer>
            <Grid container>
                <Grid item xs={12}>
                    <SuggestionBox greetingType='default' subtext='View all your Collections here' />
                </Grid>
            </Grid>
        </FixedDrawer>
    );
}

export default Collection;
