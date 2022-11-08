import React, { FunctionComponent, useState } from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton, Tooltip } from '@mui/material';
import CropFreeIcon from '@mui/icons-material/CropFree';
import ScanQrcode from '../modals/scanQrcode';

type Props = {
    getQr: (qrcode: string) => void
} & TextFieldProps;
  

const QrcodeTextfield: FunctionComponent<Props> = ({getQr, ...props})  => {
    const [open, setOpen] = useState<boolean>(false)

    const readFromScan = (qrcode: string) => {
        if(qrcode && qrcode.length > 0) {
            getQr(qrcode)
            setOpen(false)
        }
    } 

    return (
        <React.Fragment>
            <TextField {...props}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip title="Scan QR Code">
                                <IconButton
                                    onClick={() => setOpen(true)}
                                    edge="end"
                                >
                                    <CropFreeIcon />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    )
                }}
            />
            <ScanQrcode 
                open={open}
                handleClose={() => {
                    setOpen(false)
                }}
                modalHead='Scan QR Code'
                readFromScan={readFromScan}
            />
        </React.Fragment>
    );
}

export default QrcodeTextfield;
