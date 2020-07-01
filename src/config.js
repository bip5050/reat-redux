//console.log('Environment : ', process.env.REACT_APP_ENV);
let env             =   process.env.REACT_APP_ENV || 'development';
//console.log(env, process.env);
let ApiUrl          =   '/api/';
let ApiUrl2         =   '/api2/';
if(env  === 'development') {
    ApiUrl          =   '/v1/merchant/';
    ApiUrl2         =   '/v2/merchant/';
}

let firebase        =   {};
let cookie          =   {};
let states          =   [];
if(env === 'production') {
    firebase        =   {
        apiKey: 'AIzaSyDb9IdB-9QWmXsQY6Q_5PBf-n_7RfGEGSg',
        authDomain: 'foodjets-4bc9f.firebaseapp.com',
        databaseURL: 'https://foodjets-4bc9f.firebaseio.com',
        storageBucket: 'foodjets-4bc9f.appspot.com',
        messagingSenderId: '644501783160',
        projectId: 'foodjets-4bc9f'
    }
    cookie          =   {
        domain: '.foodjets.com',
        hostname: 'https://console.foodjets.com'
    }
    states          =   [
        {id:"CA",value:"California"},
        //{id:"UT",value:"Utah"},
        {id:"NV",value:"Nevada"},
        /* {id:"ID",value:"Idaho"},
        {id:"WA",value:"Washington"},
        {id:"FL",value:"Florida"},
        {id:"MI",value:"Michigan"},
        {id:"VA",value:"Virginia"} */
    ];
} else {
    //if(env === 'development' || env === 'staging') {
    firebase        =   {
        apiKey: 'AIzaSyBo2UVHKB2honDutQGN_tyYSsG4lZ5BMi4',
        authDomain: 'foodjets-dev.firebaseapp.com',
        databaseURL: 'https://foodjets-dev.firebaseio.com',
        storageBucket: 'foodjets-dev.appspot.com',
        messagingSenderId: '687940236129',
        projectId: 'foodjets-dev'
    }
    cookie          =   {
        domain: (env === 'staging') ? '.dev.foodjets.com' : '',
        hostname: 'http://console.dev.foodjets.com'
    }
    states          =   [
                {id:"CA",value:"California"},
                //{id:"UT",value:"Utah"},
                {id:"NV",value:"Nevada"},
                /* {id:"ID",value:"Idaho"},
                {id:"WA",value:"Washington"},
                {id:"FL",value:"Florida"},
                {id:"MI",value:"Michigan"},
                {id:"VA",value:"Virginia"} */
            ];
}
const Config        =   {
    Title       :   'Foodjets',
    Pagination  : {
        itemsPerPage : 100
    },
    ApiUrl: ApiUrl,
    ApiUrl2: ApiUrl2,
    firebase: {...firebase},
    cookie: {...cookie},
    states: states
}
export default Config;