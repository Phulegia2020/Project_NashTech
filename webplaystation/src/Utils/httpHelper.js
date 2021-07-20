import axios from 'axios'

const endpoint = 'http://localhost:8080/api';
const accessToken = localStorage.getItem("accessToken");

export function get(url)
{
    return axios.get(endpoint + url, {
        headers:{
            Authorization: `Bearer ${accessToken}`,
        }
    });
}

export function post(url, body)
{
    return axios.post(endpoint + url, body);
}

export function postLogin(url, body)
{
    return axios.post(endpoint + url, body, {
        headers:{
            'Content-Type': 'application/json; charset=utf-8',
        }
    });
}

export function put(url, body)
{
    return axios.put(endpoint + url, body);
}

export function del(url)
{
    return axios.delete(endpoint + url);
}