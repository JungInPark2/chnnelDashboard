
const toISOStringWithLocalOffset = (date) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(date.getTime() - offsetMs);
    const isoString = localDate.toISOString().replace('Z', '');
    return `${isoString}Z`;
  };

  const utils = {
    toISOStringWithLocalOffset
  };
  
  export { utils };
  
