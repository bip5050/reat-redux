import Config from '../config';
import axios from "axios";
import {getCookie} from '../util/cookies';

let baseAPIUrl          =   Config.ApiUrl;
let baseAPIUrl2         =   Config.ApiUrl2;
//console.log('Config : ', baseAPIUrl);
export function callApi(...params) {
    let method          =   params[0];
    let url             =   params[1] || '';
    let postData        =   params[2] || {};
    let userData            =   getCookie('foodjets_merchant') || {};
    //let userData        =   JSON.parse(localStorage.getItem('user') || '{}');
    let reqHeaders      =   {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                'Access-Control-Allow-Origin': '*'
                            };
    if(!!userData.token) {
        reqHeaders.Authorization    =   "Bearer " + userData.token;
    }
    
    let instance = axios.create({
        headers: reqHeaders
    });

    let result          =   '';
    let bodydata        =   {};
    switch(method) {
        case'POST': 
            bodydata = JSON.stringify(
                {        
                    jsonrpc:2,
                    ver:1,
                    platform:"web",
                    brw:{
                        os:"Win32",
                        name:"Chrome 67"
                    },
                    params:postData
                });
            result      =   instance.post(baseAPIUrl+url, bodydata);
        break;

        case'PUT': 
            bodydata = JSON.stringify(
                {        
                    jsonrpc:2,
                    ver:1,
                    platform:"web",
                    brw:{
                        os:"Win32",
                        name:"Chrome 67"
                    },
                    params:postData
                });
            result      =   instance.put(baseAPIUrl+url, bodydata);
        break;

        case'DELETE': 
            bodydata = JSON.stringify(
                {        
                    jsonrpc:2,
                    ver:1,
                    platform:"web",
                    brw:{
                        os:"Win32",
                        name:"Chrome 67"
                    },
                    params:postData
                });
            result      =   instance.delete(baseAPIUrl+url, bodydata);
        break;
        
        case'GET':
            result      =   instance.get(baseAPIUrl+url);
        break;
    }
    return result;
}

export function callApiV2(...params) {
    let method          =   params[0];
    let url             =   params[1] || '';
    let postData        =   params[2] || {};
    let userData            =   getCookie('foodjets_merchant') || {};
    //let userData        =   JSON.parse(localStorage.getItem('user') || '{}');
    let reqHeaders      =   {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                'Access-Control-Allow-Origin': '*'
                            };
    if(!!userData.token) {
        reqHeaders.Authorization    =   "Bearer " + userData.token;
    }
    
    let instance = axios.create({
        headers: reqHeaders
    });

    let result          =   '';
    switch(method) {
        case'POST': 
            let bodydata = JSON.stringify(
                {        
                    jsonrpc:2,
                    ver:1,
                    platform:"web",
                    brw:{
                        os:"Win32",
                        name:"Chrome 67"
                    },
                    params:postData
                });
            result      =   instance.post(baseAPIUrl2+url, bodydata);
        break;

        case'PUT': 
            bodydata = JSON.stringify(
                {        
                    jsonrpc:2,
                    ver:1,
                    platform:"web",
                    brw:{
                        os:"Win32",
                        name:"Chrome 67"
                    },
                    params:postData
                });
            result      =   instance.put(baseAPIUrl2+url, bodydata);
        break;

        case'DELETE': 
            bodydata = JSON.stringify(
                {        
                    jsonrpc:2,
                    ver:1,
                    platform:"web",
                    brw:{
                        os:"Win32",
                        name:"Chrome 67"
                    },
                    params:postData
                });
            result      =   instance.delete(baseAPIUrl2+url, bodydata);
        break;
        
        case'GET':        
            result      =   instance.get(baseAPIUrl2+url);
        break;
    }
    return result;
}

export function callOnFleetApi(...params) {
    let method          =   params[0];
    let url             =   params[1] || '';
    let postData        =   params[2] || {};
    let userData            =   getCookie('foodjets_merchant') || {};
    //let userData        =   JSON.parse(localStorage.getItem('user') || '{}');
    let reqHeaders      =   {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                'Access-Control-Allow-Origin': '*'
                            };
    if(!!userData.token) {
        //reqHeaders.Authorization    =   "Bearer " + userData.token;
    }
    
    let instance = axios.create({
        headers: reqHeaders
    });

    let result          =   '';
    switch(method) {
        case'POST': 
            let bodydata = JSON.stringify(
                {        
                    jsonrpc:2,
                    ver:1,
                    platform:"web",
                    brw:{
                        os:"Win32",
                        name:"Chrome 67"
                    },
                    params:postData
                });
            result      =   instance.post('/api2/'+url, bodydata);
        break;
        
        case'GET':        
            result      =   instance.get('/fleet/tasks/6ae0019f/public');
        break;
    }
    return result;
}