import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const host = process.env.EXPO_PUBLIC_HOST;
const port = process.env.EXPO_PUBLIC_PORT;
const socket = io(`https://${host}:${port}`, {
  transports: ['websocket'],
});

const client = feathers();
client.configure(socketio(socket));
client.configure(auth({ storage: AsyncStorage }));

export default client;