import axios from 'axios';

// Using ngrok so a physical device can reach the backend
export const BASE_URL = 'https://ecdada228ac2.ngrok-free.app/';
export const api = axios.create({ baseURL: BASE_URL });