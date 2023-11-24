
const toISOStringWithLocalOffset = (date) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(date.getTime() - offsetMs);
    const isoString = localDate.toISOString().replace('Z', '');
    return `${isoString}Z`;
  };

  const numberWithCommas = (number) =>  {
    const parsedNumber = typeof number === 'number' && !isNaN(number) ? number : 0;
    return parsedNumber.toLocaleString();
  }
  const utils = {
    toISOStringWithLocalOffset
    , numberWithCommas
  };
  
  export { utils };
  
