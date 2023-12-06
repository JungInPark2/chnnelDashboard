
  const numberWithCommas = (number) =>  {
    const parsedNumber = typeof number === 'number' && !isNaN(number) ? number : 0;
    return parsedNumber.toLocaleString();
  }

const getYesterdayTimes = () => {
  const today = new Date();
  const yesterday = new Date(today);

  // 어제 날짜 설정
  yesterday.setDate(yesterday.getDate() - 1);

  // 날짜를 YYYY-MM-DD 형식으로 포매팅
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // 전일시 (어제) 설정
  const srtTimeYesterday = `${formatDate(yesterday)}T00:00:00.000+0900`;
  const endTimeYesterday = `${formatDate(yesterday)}T23:59:59.999+0900`;

  return {
    srtTimeYesterday,
    endTimeYesterday
  };
};

const getTodayTimes = () => {
  const today = new Date();

  // 날짜를 YYYY-MM-DD 형식으로 포매팅
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // 오늘일시 설정
  const srtTimeToday = `${formatDate(today)}T00:00:00.000+0900`;
  const endTimeToday = `${formatDate(today)}T23:59:59.999+0900`;

  return {
    srtTimeToday,
    endTimeToday
  };
};

const formatIqrySrtDttm = (date) => {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  var seconds = '00'; // 고정 초
  var milliseconds = '000'; // 고정 밀리초
  var timezoneOffset = -date.getTimezoneOffset();
  var offsetHours = Math.floor(Math.abs(timezoneOffset) / 60).toString().padStart(2, '0');
  var offsetMinutes = (Math.abs(timezoneOffset) % 60).toString().padStart(2, '0');
  var offsetSign = timezoneOffset > 0 ? '+' : '-';

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}${offsetMinutes}`;
};

const formatIqryEndDttm = (date) => {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  var seconds = '59'; // 고정 초
  var milliseconds = '999'; // 고정 밀리초
  var timezoneOffset = -date.getTimezoneOffset();
  var offsetHours = Math.floor(Math.abs(timezoneOffset) / 60).toString().padStart(2, '0');
  var offsetMinutes = (Math.abs(timezoneOffset) % 60).toString().padStart(2, '0');
  var offsetSign = timezoneOffset > 0 ? '+' : '-';

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}${offsetMinutes}`;
};

let apiKey = null;
const setApiKey = (apiKeyValue) => {
  apiKey = apiKeyValue;
};

const getApiKey = () => {
  return apiKey;
}

  const utils = {
      numberWithCommas
    , getYesterdayTimes
    , getTodayTimes
    , formatIqrySrtDttm
    , formatIqryEndDttm
    , setApiKey
    , getApiKey
  };
  
  export { utils };
  
