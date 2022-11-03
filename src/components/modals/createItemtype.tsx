import { FunctionComponent, useEffect, useState } from 'react';
import RootModal from './rootModal';
import { Box, TextField, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { themeProperties } from '../../constants/themeProperties';
import { darken } from '@mui/material/styles';
import FileAdder from '../common/fileAdder';
import { CollectionItemTypeInterface } from '../../contracts/configurationInterface';

const style = {
    saveChangesButton: {
        width: '100%',
        marginTop: '15px',
        backgroundColor: themeProperties.colors.button,
        '&:hover': {
            backgroundColor: darken(themeProperties.colors.button, 0.1),
        }
    },
    textField: {
        color: themeProperties.colors.textPrimary, 
        fontSize: themeProperties.fontSize.xs
    }
}

interface Props {
    open: boolean,
    handleClose: () => void,
    modalHead: string,
    addCollectionItemType: (itemtype: string, itemimage: string) => void,
    editItemtype?: CollectionItemTypeInterface,
    confirmeditCollectionItemType: (itemtype: string, itemimage: string) => void
}

const CreateItemType: FunctionComponent<Props> = ({open, handleClose, modalHead, addCollectionItemType, editItemtype, confirmeditCollectionItemType})  => {
    const { enqueueSnackbar } = useSnackbar();

    const [itemtype, setItemtype] = useState<string>('')
    const [itemimage, setItemImage] = useState<File[]>([])
    const [freshDrop, setFreshDrop] = useState<boolean>(false)

    useEffect(() => {
        if(open) {
            if(editItemtype) {
                setItemtype(editItemtype.itemtype)
                const dummyFile = new File([""], `${editItemtype.itemtype}.jpg`, { type: 'image/jpeg' });
                setItemImage([dummyFile])
                setFreshDrop(false)
            } else {
                setItemtype('')
                setItemImage([])
                setFreshDrop(false)
            }
        }
    }, [open, editItemtype]);

    const removeItem = (index: number) => {
        let tempArray = [...itemimage];
        tempArray.splice(index, 1)
        setItemImage(tempArray)
    }

    const saveChanges = () => {
        if(itemtype.trim().length === 0) {
            enqueueSnackbar('Please enter an Item type', { variant: "warning", preventDuplicate: true })
        } else if(itemimage.length === 0) {
            enqueueSnackbar('Please drop an Item Image', { variant: "warning", preventDuplicate: true })
        } else {
            const imageurl = URL.createObjectURL(itemimage[0]);
            const image = new Image();
            image.onload = async() => {
                if(image.width !== image.height) {
                    enqueueSnackbar("Image does not have a 1:1 ratio", { variant: "warning", preventDuplicate: true })
                } else {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = image.naturalHeight;
                    canvas.height = image.naturalWidth;
                    if (context instanceof CanvasRenderingContext2D) {
                        context.drawImage(image, 0, 0);
                        const contextimagedata = context.getImageData(0, 0, canvas.width, canvas.height);
                        const imagedata = contextimagedata.data;
                        for(let i=0; i < imagedata.length; i+=4){
                            if(imagedata[i+3] < 255){
                                imagedata[i] = 255;
                                imagedata[i+1] = 255;
                                imagedata[i+2] = 255;
                                imagedata[i+3] = 255;
                            }
                        }
                        context.putImageData(contextimagedata, 0, 0);
                    }
                    const dataURL = canvas.toDataURL('image/jpeg');
                    addCollectionItemType(itemtype.trim(), dataURL)
                }
                URL.revokeObjectURL(image.src);
            };
            image.src = imageurl;
        }
    }

    const updateChanges = () => {
        if(itemtype.trim().length === 0) {
            enqueueSnackbar('Please enter an Item type', { variant: "warning", preventDuplicate: true })
        } else if(itemimage.length === 0) {
            enqueueSnackbar('Please drop an Item Image', { variant: "warning", preventDuplicate: true })
        } else if(!freshDrop && editItemtype) {
            confirmeditCollectionItemType(itemtype.trim(), editItemtype.itemimage)
        } else if(freshDrop) {
            const imageurl = URL.createObjectURL(itemimage[0]);
            const image = new Image();
            image.onload = async() => {
                if(image.width !== image.height) {
                    enqueueSnackbar("Image does not have a 1:1 ratio", { variant: "warning", preventDuplicate: true })
                } else {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = image.naturalHeight;
                    canvas.height = image.naturalWidth;
                    if (context instanceof CanvasRenderingContext2D) {
                        context.drawImage(image, 0, 0);
                        const contextimagedata = context.getImageData(0, 0, canvas.width, canvas.height);
                        const imagedata = contextimagedata.data;
                        for(let i=0; i < imagedata.length; i+=4){
                            if(imagedata[i+3] < 255){
                                imagedata[i] = 255;
                                imagedata[i+1] = 255;
                                imagedata[i+2] = 255;
                                imagedata[i+3] = 255;
                            }
                        }
                        context.putImageData(contextimagedata, 0, 0);
                    }
                    const dataURL = canvas.toDataURL('image/jpeg');
                    confirmeditCollectionItemType(itemtype.trim(), dataURL)
                }
                URL.revokeObjectURL(image.src);
            };
            image.src = imageurl;
        }
    }

    const onDrop = (files: File[]) => {
        setItemImage(files)
        setFreshDrop(true)
    }

    return (
        <RootModal
            open={open}
            handleClose={handleClose}
            modalHead={modalHead}
        >
            <Box width={'100%'}>
                <TextField label="Item Type" variant="outlined" value={itemtype}
                    sx={{marginTop: '13px', marginBottom: '13px', width: '100%', color: themeProperties.colors.textPrimary}}
                    inputProps={{style: style.textField}}
                    InputLabelProps={{style: style.textField}}
                    onChange={(event) => setItemtype(event.target.value)}
                />
                <FileAdder
                    acceptedFiles={['image/jpeg', 'image/png']}
                    filesLimit={1}
                    sizeLimitPerFile={1}
                    onDrop={onDrop}
                    label={'Item Image'}
                    tips={"Add a 1:1 ratio image of type either JPG/JPEG/PNG"}
                    addedFiles={itemimage}
                    removeItem={removeItem}
                />
                <Button variant="contained" disableElevation sx={style.saveChangesButton} onClick={editItemtype ? updateChanges : saveChanges}>
                    {editItemtype ? 'Update Changes' : 'Save Changes'}
                </Button>
            </Box>
        </RootModal>
    );
}

export default CreateItemType;
