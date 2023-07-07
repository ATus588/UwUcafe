import axios from "axios";

export default axios.create({
    // baseURL: "http://127.0.0.1:8000/api",
    baseURL: "http://43.207.160.102:8000/api",
    headers: {
        "Content-type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
});