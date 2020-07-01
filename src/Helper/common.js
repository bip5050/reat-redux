import moment from 'moment-timezone';
export function formatDate(date){
    return moment(date).format('MM/DD/YYYY hh:mm:ss');
}

export function getDateTime(timestamp, tz, format) {
    return moment.tz(timestamp, tz).format(format);
}
	    
export function getSysDateTime(timestamp, format) {
    return moment(timestamp).format(format);
}

export function formatAmount(amount = 0){
    return '$'+amount.toFixed(2)
}

export function filterArrayByKey(searchTerm, key, list = [], limit = 10){
    let results = [];
    for(let i = 0; results.length < limit && i<=list.length; i ++) {
      let item = list[i];
      try{
        if(item){
            if(item[key].toLowerCase().startsWith(searchTerm.toLowerCase())) {
                results.push(item)
            }
        }
       }catch(e){
          console.log(e);
       }
    }
    return results;
}

export function avgCustomerFeedback(rate){
  let dec = 0;
  let whole = Math.floor(rate);
  let fraction = (rate - whole);

  if(fraction < .25) {
    dec=0;
  } else if (fraction >= .25 && fraction < .75) {
    dec=.50;
  } else if (fraction >= .75) {
    dec=1;
  }

  let r = (whole + dec);

  //As we sometimes round up, we split again  
  let newwhole = Math.floor(r);
  fraction = (r - newwhole);   

  return {
    fraction: fraction,
    newwhole: newwhole
  };
}

export function setFilter(pagename, filter) {
  localStorage.setItem(pagename + '_filter', JSON.stringify(filter));
}

export function getFilter(pagename) {
  let filter    = localStorage.getItem(pagename + '_filter') || '{}';
  return JSON.parse(filter);
}

export function clearFilter(pagename) {
  let filter    = localStorage.removeItem(pagename + '_filter');
}

export const convertFloatTwoDecimal = function(num) {
  return parseFloat(num).toFixed(2);
}

export const convertTwoDecimalRound = function(num) {
  return +(Math.round(num + "e+2") + "e-2");
}