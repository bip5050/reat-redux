
// is number
export const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

// is email
export const isEmail = (value) => {
  let exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return exp.test(value);
};

// Returns false if the object is not a function
export const isFunction = (value) => {
  return typeof value === 'function';
};

// A simple check to verify that the value is an integer. Uses `isNumber`
// and a simple modulo check.
export const isInteger = (value) => {
  return isNumber(value) && value % 1 === 0;
};

// Checks if the value is a boolean
export const isBoolean = (value) => {
  return typeof value === 'boolean';
};

// Uses the `Object` function to check if the given argument is an object.
export const isObject = (obj) => {
  return obj === Object(obj);
};

// Simply checks if the object is an instance of a date
export const isDate = (obj) => {
  return obj instanceof Date;
};

// Returns false if the object is `null` of `undefined`
export const isDefined = (obj) => {
  return obj !== null && obj !== undefined;
};

// Checks if the given argument is a promise. Anything with a `then`
// function is considered a promise.
export const isPromise = (p) => {
  return !!p && isFunction(p.then);
};

export const isJqueryElement = (o) => {
  return o && isString(o.jquery);
};

export const isEmpty = (value) => {
  let attr;

  // Null and undefined are empty
  if (!isDefined(value)){
    return true;
  }

  // functions are non empty
  if (isFunction(value)){
    return false;
  }

  // Whitespace only strings are empty
  if (isString(value)){
    return /^\s*$/.test(value);
  }

  // For arrays we use the length property
  if (isArray(value)){
    return value.length === 0;
  }

  // Dates have no attributes but aren't empty
  if (isDate(value)){
    return false;
  }

  // If we find at least one property we consider it non empty
  if (isObject(value)) {
    for (attr in value) {
      return false;
    }
    return true;
  }

  return false;
};

export const isString = (value) => {
  return typeof value === 'string';
};

export const isEmptyString = (value) => {
  return isString(value) && /^\s*$/.test(value);
};

export const isArray = (value) => {
  return {}.toString.call(value) === '[object Array]';
};

export const isHash = (value) => {
  return isObject(value) && !isArray(value) && !isFunction(value);
};

export const mathRound = (value) => {
  return +(Math.round(value + "e+2") + "e-2");
}
