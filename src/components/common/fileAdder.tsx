import { FunctionComponent } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import { themeProperties } from '../../constants/themeProperties';
import OverflowTip from './overflowTip';
import { DropzoneArea } from 'react-mui-dropzone';
import { makeStyles, createStyles } from '@mui/styles';

const getStyles = makeStyles(() =>
  createStyles({
    root: {
        borderRadius: '5px',
        width: '100%',
        minHeight: 'auto',
        outline: 'none'
    },
    textContainer: {
        padding: '5px'
    },
    text: {
        color: themeProperties.colors.textPrimary,
        fontSize: themeProperties.fontSize.sm,
    },
    icon: {
        display: 'none'
    }
  })
);

interface Props {
    acceptedFiles: string[],
    filesLimit: number,
    sizeLimitPerFile: number,
    onDrop: (files: File[]) => void,
    tips: string,
    label: string,
    addedFiles: File[]
    removeItem: (index: number) => void
}

const FileAdder: FunctionComponent<Props> = ({acceptedFiles, sizeLimitPerFile, filesLimit, onDrop, tips, label, addedFiles, removeItem})  => {
    const { enqueueSnackbar } = useSnackbar();
    const style = getStyles();

    const onDropRejected = (files: File[]) => {
        if(files.some(file => !acceptedFiles.includes(file.type))) {
            enqueueSnackbar("File type does not match Accepted Files", { variant: "warning", preventDuplicate: true })
        }
    }

    const onDropCheck = (files: File[]) => {
        if(files.some(file => (file.size/1048576) >= sizeLimitPerFile)) {
            enqueueSnackbar(`File Size should not exceed ${sizeLimitPerFile} MB`, { variant: "warning", preventDuplicate: true })
        } else {
            onDrop(files)
        }
    }

    return (
        <Box width={'100%'}>
            <Typography style={{marginBottom: '10px', color: themeProperties.colors.textPrimary, fontSize: themeProperties.fontSize.sm}}>{label}:</Typography>
            <DropzoneArea
                acceptedFiles={acceptedFiles}
                filesLimit={filesLimit}
                showPreviewsInDropzone={false}
                showAlerts={[]}
                onDrop={onDropCheck}
                onDropRejected={onDropRejected}
                classes={{
                    root: style.root,
                    textContainer: style.textContainer,
                    text: style.text,
                    icon: style.icon
                }}
            />
            <Typography style={{marginBottom: '15px', color: themeProperties.colors.gray, fontSize: themeProperties.fontSize.xxs, marginTop: '10px'}}>Tips: {tips}</Typography>
            <Grid container spacing={3}>
                {addedFiles.map((file, index) => {
                    return(
                        <Grid item xs={3} key={`item-${String(index)}`}>
                            <Box
                                display="flex"
                                justifyContent={'center'}
                                alignItems={'center'}
                                borderRadius={'10px'}
                                p={'5px'}
                                height={'80px'}
                                flexDirection={'column'}
                                bgcolor={themeProperties.colors.primary}
                            >
                                <OverflowTip title={file.name} length={10} sx={{color: themeProperties.colors.white, fontSize: themeProperties.fontSize.xxs}} />
                                <Typography style={{color: themeProperties.colors.error, fontSize: themeProperties.fontSize.xxs, fontWeight: themeProperties.fontWeight.bolder, cursor: 'pointer', marginTop: '5px'}} onClick={() => removeItem(index)}>Remove</Typography>
                            </Box>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    );
}

export default FileAdder;
