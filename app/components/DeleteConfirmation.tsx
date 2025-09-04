import React, { useState } from "react";
import { View, StyleSheet } from 'react-native';
import { PaperProvider, Portal, Modal, Button, Text } from "react-native-paper";

type DeleteConfirmationProps = {
    source: string;
    target: string;
    visible: boolean;
    onConfirm: () => void;
    onDismiss: () => void;
};

export default function DeleteConfirmation({ source, target, visible, onConfirm, onDismiss }: DeleteConfirmationProps) {
    const confirmLabel = 'Sí';
    const cancelLabel = 'Cancelar';
    const duration = 4000;
    const craftMsg = () => {
        let msgSource = '';
        switch (source) {
            case 'products':
                msgSource = 'el producto';
                break;
            case 'clients':
                msgSource = 'el cliente';
                break;
        }
        return `¿Desea eliminar ${msgSource} ${target}?`;   
    };

    return (<Portal>
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
            <View>
                <Text style={{ fontSize: 16 }} >{craftMsg()}</Text>
                <Button mode="contained" onPress={onConfirm} style={styles.button}>{confirmLabel}</Button>
                <Button mode="outlined" onPress={onDismiss} icon="window-close" style={{ marginTop: 10 }} labelStyle={{ color: '#429E9D'}} >{cancelLabel}</Button>
            </View>
        </Modal>
    </Portal>);
}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 },
  button: { marginTop: 16, backgroundColor: 'red' }
});