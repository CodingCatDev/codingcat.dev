export const config = {
  token: process.env.NOTION_TOKEN,
  purrfectStreamsDb: process.env.NOTION_PURRFECT_STREAMS || '',
  purrfectGuestDb: process.env.NOTION_PURRFECT_GUEST || '',
  purrfectCompanyDb: process.env.NOTION_PURRFECT_COMPANY || '',
  purrfectPicksDb: process.env.NOTION_PURRFECT_PICKS || '',
};
