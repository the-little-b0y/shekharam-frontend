import { FunctionComponent, memo, useEffect, useRef, useState } from 'react';
import { Popper, Paper, Box, Tooltip, IconButton } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { themeProperties } from '../../constants/themeProperties';
import { startCase, toLower } from 'lodash';
import { DatagridActionInterface } from '../../contracts/miscInterface';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import { darken } from '@mui/material/styles';

const style = {
    actionButton: {
        marginLeft: '5px',
        backgroundColor: themeProperties.colors.quaternary,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.quaternary, 0.1)
        }
    }
}

interface CellExpandProps {
    value: string;
    width: number;
}

const CellExpand = memo(function CellExpand(props: CellExpandProps) {
    const { width, value } = props;
    const wrapper = useRef(null);
    const cellDiv = useRef(null);
    const cellValue = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showFullCell, setShowFullCell] = useState(false);
    const [showPopper, setShowPopper] = useState(false);

    useEffect(() => {
        if (!showFullCell) {
          return undefined;
        }
    
        const handleKeyDown = (nativeEvent: KeyboardEvent) => {
          if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
            setShowFullCell(false);
          }
        }
    
        document.addEventListener('keydown', handleKeyDown);
    
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setShowFullCell, showFullCell]);

    const isOverflown = (element: any) => {
        return (
            element.scrollHeight > element.clientHeight ||
            element.scrollWidth > element.clientWidth
        );
    }

    const handleMouseEnter = () => {
        const isCurrentlyOverflown = isOverflown(cellValue.current);
        setShowPopper(isCurrentlyOverflown);
        setAnchorEl(cellDiv.current);
        setShowFullCell(true);
    };
    
    const handleMouseLeave = () => {
        setShowFullCell(false);
    };

    return (
        <Box
            ref={wrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                alignItems: 'center',
                lineHeight: '24px',
                width: 1,
                height: 1,
                position: 'relative',
                display: 'flex',
            }}
        >
            <Box
                ref={cellDiv}
                sx={{
                    height: 1,
                    width,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                }}
            />
            <Box
                ref={cellValue}
                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
                {value}
            </Box>
            {showPopper &&
                <Popper
                    open={showFullCell && anchorEl !== null}
                    anchorEl={anchorEl}
                    style={{ width, marginLeft: -17 }}
                >
                <Paper
                    elevation={1}
                    //@ts-ignore
                    sx={{ minHeight: wrapper.current.offsetHeight - 2 }}
                >
                    <div style={{ padding: 8, wordWrap: 'break-word' }}>{value}</div>
                </Paper>
                </Popper>
            }
        </Box>
    );
});

const RenderCellExpand = (params: GridCellParams) => {
    return (
        <CellExpand value={params.value || ''} width={params.colDef.computedWidth} />
    );
}

interface Props {
    rows: any[],
    headers: string[],
    ogData: any[],
    actions?: DatagridActionInterface[]
}

const Table: FunctionComponent<Props> = ({ rows, headers , ogData, actions })  => {
    const columns: GridColDef[] = rows.length > 0 ? Object.keys(rows[0]).map(row => {
        if(row === 'id') {
            const rowDetails:GridColDef = {
                field: row,
                headerName: 'ID',
                flex: 0.7,
                sortable: false
            }
            return rowDetails
        } else {
            const rowDetails:GridColDef = {
                field: row,
                headerName: startCase(toLower(row)),
                flex: 1,
                renderCell: RenderCellExpand,
                sortable: false
            }
            return rowDetails
        }
    }) : headers.map(header => {
        if(header === 'id') {
            const rowDetails:GridColDef = {
                field: header,
                headerName: 'ID',
                flex: 0.7,
                sortable: false
            }
            return rowDetails
        } else {
            const rowDetails:GridColDef = {
                field: header,
                headerName: startCase(toLower(header)),
                flex: 1,
                renderCell: RenderCellExpand,
                sortable: false
            }
            return rowDetails
        }
    })

    if(actions && actions.length > 0) {
        const actionFunction = (params: GridCellParams) => {
            const row = {id: params.getValue(params.id, "id") as number}
            const ogRow = ogData.find((element, index) => index === (row.id - 1))

            const actionIcons = actions.map((action, index) => {
                let icon;
                switch(action.action) {
                    case 'Delete':
                        icon = (
                            <Tooltip title="Delete" key={'Delete'}>
                                <IconButton
                                    onClick={() => action.function(ogRow)}
                                    size="small"
                                    sx={style.actionButton}
                                >
                                    <DeleteIcon style={{color: themeProperties.colors.error, fontSize: themeProperties.fontSize.sm}} />
                                </IconButton>
                            </Tooltip>
                        )
                    break;
                    case 'Edit':
                        icon = (
                            <Tooltip title="Edit" key={'Edit'}>
                                <IconButton
                                    size='small'
                                    onClick={() => action.function(ogRow)}
                                    sx={style.actionButton}
                                >
                                    <EditIcon style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm}} />
                                </IconButton>
                            </Tooltip>
                        )
                    break;
                    default:
                        icon = (
                            <Tooltip title="Misc" key={'Misc'}>
                                <IconButton
                                    size='small'
                                    onClick={() => action.function(ogRow)}
                                    sx={style.actionButton}
                                >
                                    <BubbleChartIcon style={{color: themeProperties.colors.tertiary, fontSize: themeProperties.fontSize.sm}} />
                                </IconButton>
                            </Tooltip>
                        )
                    break;
                }
                return icon
            })

            return actionIcons
        }
        
        const rowDetails: GridColDef = { field: 'action', headerName: 'Action', flex: 1, sortable: false, renderCell: actionFunction }
        columns.push(rowDetails)
    }


    return (
        <Box sx={{ height: 379, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection={false}
                disableSelectionOnClick
                disableColumnMenu
                experimentalFeatures={{ newEditingApi: false }}
                sx={{
                    border: 'none',
                    background: themeProperties.colors.secondary,
                    '&.MuiDataGrid-root .MuiDataGrid-row': {
                        backgroundColor: themeProperties.colors.white,
                        marginTop: '2px',
                    },
                    '&.MuiDataGrid-root .MuiDataGrid-columnHeaders': {
                        marginBottom: '2px',
                        border: 0,
                        backgroundColor: themeProperties.colors.tertiary,
                    },
                }}
            />
        </Box>
    );
}

export default Table;
