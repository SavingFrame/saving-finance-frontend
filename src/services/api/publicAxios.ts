import axios from 'axios';

const publicAxios = axios.create({
  baseURL: 'http://192.168.100.16:8000/api',
});

export default publicAxios;
