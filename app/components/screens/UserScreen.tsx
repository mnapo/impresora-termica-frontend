import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function UserScreen() {

  return (<>
    <Stack.Screen options={{ title: "Mis Datos" }}/>
    <View style={ styles.container } >
    </View>
  </>);
}

const styles = StyleSheet.create({
  container: { padding: 10, width: '100%' },
});