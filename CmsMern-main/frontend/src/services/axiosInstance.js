import axios from 'axios'
import { getUserInfo } from './localStorageInfo';

const BASEURL = 'http://localhost:5000/api';

export const axiosInstance = axios.create({
    baseURL: BASEURL
});

axiosInstance.interceptors.request.use(
    function (config){
        const user = getUserInfo();
        if(user){
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        console.log('config',config);
        
        return config;
    },
    function(error){
        //Handling error
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function(response){
        // console.log('Response: ',response);
        return response;
    },
    function(error){
        // Handling response error
        return Promise.reject(error);
    }
);