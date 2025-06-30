import axios from 'axios';

const token = 'YOUR_TOKEN'; // or fetch from localStorage/session/context

const AxiosClientWithToken = axios.create({
  baseURL: 'https://your.api.url',
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export default AxiosClientWithToken;