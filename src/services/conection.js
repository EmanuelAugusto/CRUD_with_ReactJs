import axios from 'axios';


export const Conection = axios.create({
    baseURL: 'http://localhost:8081/',
    timeout: 1000,
})