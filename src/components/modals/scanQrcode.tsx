import { FunctionComponent } from 'react';
import RootModal from './rootModal';
import { Box } from '@mui/material';
const QrReader = require('react-qr-scanner')

const previewStyle = {
    height: 240,
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
                    style={previewStyle}
                    onError={(err: any) => {}}
                    onScan={(data: any) => {
                        if(data && data.text) {
                            readFromScan(data.text)
                        }
                    }}
                />
            </Box>
        </RootModal>
    );
}

export default ScanQrcode;
