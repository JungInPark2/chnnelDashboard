import axios from 'axios';

function postEventLog(url, data) {
    return axios.post('https://reqres.in/api/users?page=1', data);
}

function getEventLog(url) {
    return axios.get('https://reqres.in/api/users?page=1');
}

export { postEventLog, getEventLog };