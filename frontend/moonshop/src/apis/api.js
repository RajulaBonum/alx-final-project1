import axios from 'axios'
import {jwtDecode} from 'jwt-decode';

export const BaseUrl = "http://127.0.0.1:8000"

const api = axios.create({
    baseURL: BaseUrl
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access")
        if(token) {
            const decoded = jwtDecode(token)
            const expiry_data = decoded.exp
            const current_time = Date.now() / 1000
            if (expiry_data > current_time) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config;
    },

    (error) => {
        return Promise.reject(error)
    }
)
export default api