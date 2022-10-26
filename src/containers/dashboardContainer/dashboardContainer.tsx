import { FunctionComponent} from 'react';
import { Grid } from '@mui/material';
import FixedDrawer from '../../components/common/fixedDrawer';
import SuggestionBox from '../../components/common/suggestionBox';

interface Props {
  
}

const Dashboard: FunctionComponent<Props> = ()  => {
    return (
        <FixedDrawer>
            <Grid container>
                <Grid item xs={12}>
                    <SuggestionBox greetingType='timed' subtext='Here is your Overall Report' />
                </Grid>
            </Grid>
        </FixedDrawer>
    );
}

export default Dashboard;
