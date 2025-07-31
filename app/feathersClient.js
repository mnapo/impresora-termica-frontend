import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io('http://localhost:3030', {
  transports: ['websocket'],
});

const client = feathers();
client.configure(socketio(socket));
client.configure(auth({ storage: AsyncStorage }));

export default client;