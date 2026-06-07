import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://mining-track-system.onrender.com'
});

export default API;