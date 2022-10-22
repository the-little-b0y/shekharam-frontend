import { FunctionComponent } from 'react';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export interface RouteInterface {
    name: string,
    path: string,
    component: FunctionComponent,
    routetype: 'drawer' | 'non-drawer',
    icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    position?: number;
}

