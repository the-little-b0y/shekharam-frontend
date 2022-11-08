import { AddSubCollection, Collection, SubCollection } from "../containers/collectionContainer";
import { Configuration } from "../containers/configurationContainer";
import { Dashboard } from "../containers/dashboardContainer";
import { Login, Register, Setup } from "../containers/loginContainer";
import { Profile } from "../containers/profileContainer";
import { RouteInterface } from "../contracts/routeInterface";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import DnsIcon from '@mui/icons-material/Dns';

export const routeList: RouteInterface[] = [{
    name: 'Login',
    path: '/login',
    rootpath: '/login',
    component: Login,
    routetype: 'non-drawer'
}, {
    name: 'Register',
    path: '/register',
    rootpath: '/register',
    component: Register,
    routetype: 'non-drawer'
}, {
    name: 'Dashboard',
    path: '/dashboard',
    rootpath: '/dashboard',
    component: Dashboard,
    routetype: 'drawer',
    position: 1,
    icon: DashboardIcon
}, {
    name: 'Setup',
    path: '/setup',
    rootpath: '/setup',
    component: Setup,
    routetype: 'non-drawer'
}, {
    name: 'Sub-Collection-add',
    path: '/collection/:itemtype/add',
    rootpath: '/collection',
    component: AddSubCollection,
    routetype: 'non-drawer',
}, {
    name: 'Sub-Collection',
    path: '/collection/:itemtype',
    rootpath: '/collection',
    component: SubCollection,
    routetype: 'non-drawer',
}, {
    name: 'Collection',
    path: '/collection',
    rootpath: '/collection',
    component: Collection,
    routetype: 'drawer',
    position: 4,
    icon: DnsIcon
}, {
    name: 'Configuration',
    path: '/configuration',
    rootpath: '/configuration',
    component: Configuration,
    routetype: 'drawer',
    position: 3,
    icon: SettingsIcon
}, {
    name: 'Profile',
    path: '/profile',
    rootpath: '/profile',
    component: Profile,
    routetype: 'drawer',
    position: 2,
    icon: AccountCircleIcon
}]