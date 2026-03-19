import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // Include HTTP-only cookies on every cross-origin request.
    // The JWT is now stored as a server-set cookie, never in localStorage.
    withCredentials: true,
})

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        return Promise.reject(error)
    }
)

export default instance
