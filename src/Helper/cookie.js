import Cookies from 'js-cookie';

let cookie                  =  Cookies.get('FoodJetsAdmin');
cookie                      =   (cookie)?JSON.parse(cookie):{};
export const cookieObj     = {
    employee_id         :   cookie.employee_id || '',
    status              :   cookie.status || '',
    name                :   cookie.name || '',
    restaurant_access   :   cookie.restaurant_access || '',
    menu_access         :   cookie.menu_access || '',
    email               :   cookie.email || '',
    id                  :   cookie.id || '',
    ftkn                :   cookie.ftkn || '',
    firebase            :   cookie.firebase?{
            serviceAccount    :   cookie.firebase.serviceAccount || '',
            apiKey            :   cookie.firebase.apiKey || '',
            authDomain        :   cookie.firebase.authDomain || '',
            databaseURL       :   cookie.firebase.databaseURL || '',
            storageBucket     :   cookie.firebase.storageBucket || ''
    }:{},
    ip_addr             :   cookie.ip_addr || ''
}