import { FunctionComponent} from 'react';
import FixedDrawer from '../../components/common/fixedDrawer';

interface Props {
  
}


const Dashboard: FunctionComponent<Props> = ()  => {
    return (
        <FixedDrawer>
            Dashboard
        </FixedDrawer>
    );
}

export default Dashboard;