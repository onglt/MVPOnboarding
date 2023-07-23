import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

function CustomAlert({ message, onClose, textColor }) {
    return (
        <Modal open>
            <Modal.Header>Alert</Modal.Header>
            <Modal.Content>
                <p style={{ color: textColor || 'black' }}><b>{message}</b></p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={onClose} primary>
                    OK
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default CustomAlert;