import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import setupMock from "@/api/mock/setupMock";
import { utils } from '@/utils/utils';

const http = axios.create({
    headers: {
        'Content-type': 'application/json'
    },
    baseURL: import.meta.env.VITE_APP_API_URL,
    timeout:10000    // 타임아웃 설정 (10초)
});

// 요청 인터셉터 추가
http.interceptors.request.use(config => {
    const apiKey = utils.getApiKey();
    if (apiKey) {
        config.headers['Authorization'] = `ApiKey ${apiKey}`;
    }
    return config;
});

// Local인 경우 mock 데이터 응답
  if(import.meta.env.MODE === 'L'){
       console.log('%c This is Mock Mode!','color:red');
       setupMock(new MockAdapter(http));
  }

export default http;