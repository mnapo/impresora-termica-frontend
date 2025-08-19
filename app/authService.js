import client from './feathersClient';

export async function login(email, password) {
  return await client.authenticate({
    strategy: 'local',
    email,
    password,
  });
}

export async function logout() {
  return await client.logout();
}

export async function reAuthenticate() {
  return await client.reAuthenticate();
}

const placeHolder = () => {};
export default placeHolder;