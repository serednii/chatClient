import axios from "axios";
import { URL_AUTH } from "../../const.js";



const $api = axios.create({
    withCredentials: true,
    baseURL: URL_AUTH
});

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
}, (error) => {
    return Promise.reject(error);
});

$api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const response = await axios.get(`${URL_AUTH}/refresh`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest);
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАНИЙ');
        }
    } else {
        throw error;
    }

    return Promise.reject(error);
});

export default $api;
