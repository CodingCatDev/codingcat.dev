export function utcOffset(isoString: string, timeZone = 'America/new_york') {
  console.log('conversion:input', isoString);
  const isoStringDate = new Date(isoString);
  const offset = getOffset(timeZone, isoStringDate);
  console.log('conversion:offsethours', offset / 60 / 60 / 1000);
  const output = new Date(Date.parse(isoStringDate.toISOString()) + offset)
    .toISOString()
    .replace('Z', '');
  console.log('conversion:output', output);
  return output;
}

const getOffset = (timeZone = 'UTC', date = new Date()) => {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
  return tzDate.getTime() - utcDate.getTime();
};

const calendlyDate = '2022-01-26T14:00:00.000000Z';
console.log('hardcoded:calendlyDate', calendlyDate);
console.log('hardcoded:fromFunc', utcOffset(calendlyDate));
console.log('hardcoded:shouldMatch', '2022-01-26T09:00:00.000');
