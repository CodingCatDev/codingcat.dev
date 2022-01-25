export function utcOffset(isoString: string, timezone = 'America/New_York') {
  console.log('conversion:input', isoString);
  const originalDate = new Date(
    new Date(isoString).toLocaleString('en-US', {
      timeZone: timezone,
    })
  );
  const utcDate = new Date(
    new Date(isoString).toLocaleString('en-US', {
      timeZone: 'UTC',
    })
  );

  // // Milliseconds from original Date
  const offset = originalDate.getTime() - utcDate.getTime();
  const output = new Date(Date.parse(originalDate.toISOString()) + offset)
    .toISOString()
    .replace('Z', '');
  console.log('conversion:output', output);
  return output;
}

const calendlyDate = '2022-01-26T14:00:00.000000Z';
console.log('hardcoded:calendlyDate', calendlyDate);
console.log('hardcoded:fromFunc', utcOffset(calendlyDate));
console.log('hardcoded:shouldMatch', '2022-01-26T09:00:00.000000-05:00');
console.log(
  'hardcoded:shouldMatchLocale',
  new Date('2022-01-26T09:00:00.000000-05:00').toLocaleString('en-US', {
    timeZone: 'America/New_York',
  })
);
