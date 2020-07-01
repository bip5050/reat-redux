import Cookies from 'js-cookie';
import config from '../config';
//console.log('Cookie Config : ', config.cookie);

export const get = (name = 'foodjets_new_merchant') =>{
	if(config.cookie.hostname === 'http://console.dev.foodjets.com') {
		name = 'dev_'+name
	}

  	return Cookies.getJSON(name);
};

export const set = (data, name = 'foodjets_new_merchant') =>{
	if(config.cookie.hostname === 'http://console.dev.foodjets.com') {
		name = 'dev_'+name
	}
	if(!!config.cookie.domain)
		Cookies.set(name, data, {domain: config.cookie.domain});
	else
		Cookies.set(name, data);
};

export const remove = (name = 'foodjets_new_merchant') =>{
	if(config.cookie.hostname === 'http://console.dev.foodjets.com') {
		name = 'dev_'+name
	}

	if(!!config.cookie.domain)
		Cookies.remove(name, {domain: config.cookie.domain});
	else
		Cookies.remove(name);
};

export const setCookie = (data, name) =>{
  	Cookies.set(name, data);
};

export const setLifetimeCookie = (data, name) =>{
	Cookies.set(name, data, { expires: 365 });
};


export const removeCookie = (name) =>{
  	Cookies.remove(name);
};

export const getCookie = (name) =>{
  	return Cookies.getJSON(name);
};