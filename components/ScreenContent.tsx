import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { EditScreenInfo } from './EditScreenInfo';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.separator} />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 1,
    backgroundColor: theme.colors.background,
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: theme.colors.limedSpruce,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.typography,
  },
}));
