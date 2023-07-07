import axios from "axios";

export default axios.create({
    baseURL: "http://43.207.160.102:8000/api",
    // baseURL: "http://18.179.201.202:8000/api",
    headers: {
        "Content-type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
});