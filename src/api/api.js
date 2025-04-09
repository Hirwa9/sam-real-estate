import axios from "axios";
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const CURRENCY_KEY = process.env.REACT_APP_CURRENCY_API_KEY;

export const Axios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Allows sending cookies and auth headers
});