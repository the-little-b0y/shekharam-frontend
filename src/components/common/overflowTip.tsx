import { FunctionComponent } from 'react';
import { Tooltip, Typography, SxProps } from '@mui/material';
import { truncate } from 'lodash';

interface Props {
    title: string,
    length: number,
    sx?: SxProps
}

const OverflowTip: FunctionComponent<Props> = ({title, length, sx}) => {
    return (
        <Tooltip title={title} disableHoverListener={title.length <= length}>
            <Typography sx={sx ? sx : {}} style={{cursor: 'context-menu'}}>
                {truncate(title, {length: length})}
            </Typography>
        </Tooltip>
    );
}

export default OverflowTip;
