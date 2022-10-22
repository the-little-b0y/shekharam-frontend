import { Dashboard } from "../containers/dashboardContainer";
import { Login } from "../containers/loginContainer";
import { RouteInterface } from "../contracts/routeInterface";

export const routeList: RouteInterface[] = [{
    name: 'Login',
    path: '/login',
    component: Login,
    routetype: 'non-drawer'
}, {
    name: 'Dashboard',
    path: '/dashboard',
    component: Dashboard,
    routetype: 'non-drawer',
}]