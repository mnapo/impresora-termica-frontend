import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { PaperProvider, Card, Text, Icon, IconButton  } from "react-native-paper";
import { useRouter } from "expo-router";

type InvoiceOptionProps = {
  title: string;
  onOpenModal: () => void;
};

export default function InvoiceOption({ title, onOpenModal }: InvoiceOptionProps) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={ onOpenModal } activeOpacity={0.8} style={{ width: '100%' }}>
      <View style={styles.arrow}>
        <IconButton icon="arrow-top-right" size={32} />
      </View>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Icon source="plus" size={50} color='white' />
          <Text style={styles.title}>{title}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>);
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    margin: 8,
    paddingVertical: 20,
    elevation: 4,
    backgroundColor: '#429E9D',
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: 'white'
  },
  arrow: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  }
});
