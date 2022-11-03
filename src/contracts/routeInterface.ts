import { FunctionComponent } from 'react';

export interface RouteInterface {
    name: string,
    path: string,
    rootpath: string,
    component: FunctionComponent,
    routetype: 'drawer' | 'non-drawer',
    icon?: any;
    position?: number;
}

