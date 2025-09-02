import React, { useState } from "react";
import { Portal, Snackbar } from "react-native-paper";

type ActionNotificationProps = {
    type: string;
    source: string;
    target: string;
    action: string;
    visible: boolean;
    onDismiss: () => void;
};

export default function ActionNotification({ type, source, target, action, visible, onDismiss }: ActionNotificationProps) {
    const label = 'OK';
    const duration = 4000;
    const craftMsg = () => {
        const msgType = type === 'success' ? 'correctamente' : 'Error: ';
        let msgSource = '';
        let msgAction = '';
        switch (source) {
            case 'products':
                msgSource = 'el producto';
                break;
            case 'clients':
                msgSource = 'el cliente';
                break;
            case 'arca':
                msgSource = 'la factura';
                break;
            case 'comprobante':
                msgSource = 'el comprobante';
                break;
        }
        switch (action) {
            case 'add':
                msgAction = 'añadió';
                break;
            case 'remove':
                msgAction = 'eliminó';
                break;
            case 'update':
                msgAction = 'modificó';
                break;
            case 'comprobante':
                msgAction = 'el comprobante';
                break;
        }
        if (type === 'success') {
            return `Se ${msgAction} ${msgSource} ${target} ${msgType}`;
        }
        return '';
    };

    return (
    <Portal>
        <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            duration={duration}
            action={{
                label: label,
                textColor: '#429E9D'
            }}>
            {craftMsg()}
        </Snackbar>
    </Portal>
    );
}
