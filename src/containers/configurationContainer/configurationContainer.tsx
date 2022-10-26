import { FunctionComponent} from 'react';
import { Grid } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';

interface Props {
  
}

const Configuration: FunctionComponent<Props> = ()  => {
    return (
        <FixedDrawer>
            <Grid container>
                <Grid item xs={12}>
                    <SuggestionBox greetingType='default' subtext='Configuration page for your collection' />
                </Grid>
            </Grid>
        </FixedDrawer>
    );
}

export default Configuration;
