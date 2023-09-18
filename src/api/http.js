import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import setupMock from "@/api/mock/setupMock";

const http = axios.create({
    headers: {
        'Content-type': 'application/json',
    },
    baseURL: import.meta.env.VITE_APP_API_URL
});

// Server에 소스 올리고 테스트 해봐야함
if(import.meta.env.MODE === 'development'){
     console.log('%c This is Mock Mode!','color:red');
     setupMock(new MockAdapter(http));

 }

export default http;