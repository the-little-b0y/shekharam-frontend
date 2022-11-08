import { FunctionComponent } from 'react';
import RootModal from './rootModal';
import { Box } from '@mui/material';
const QrReader = require('modern-react-qr-reader')

const previewStyle = {
    width: '100%'
}

interface Props {
    open: boolean,
    handleClose: () => void,
    modalHead: string,
    readFromScan: (qrcode: string) => void
}

const ScanQrcode: FunctionComponent<Props> = ({open, handleClose, modalHead, readFromScan })  => {
    return (
        <RootModal
            open={open}
            handleClose={handleClose}
            modalHead={modalHead}
        >
            <Box width={'100%'}>
                <QrReader
                    delay={100}
                    facingMode={"environment"}
                    onError={(err: any) => {}}
                    onScan={(data: any) => {
                        if(data) {
                            readFromScan(data)
                        }
                    }}
                    style={previewStyle}
                />
            </Box>
        </RootModal>
    );
}

export default ScanQrcode;
