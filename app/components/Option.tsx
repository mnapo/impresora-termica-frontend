import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Text, Icon, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";

type OptionProps = {
  title: string;
  icon: string;
  path: any;
};

export default function Option({ title, icon, path }: OptionProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(path);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.arrow}>
          <IconButton icon="arrow-top-right" size={32} />
        </View>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Icon source={icon} size={50} color='lightseagreen' />
          <Text style={styles.title}>{title}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    margin: 8,
    paddingVertical: 20,
    elevation: 4,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  arrow: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  }
});
