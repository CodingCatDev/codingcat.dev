module.exports = {
  siteUrl: process.env.SITE_URL || 'https://codingcat.dev',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/admin*', '/user*', '/server-sitemap.xml'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin*', '/user*'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://codingcat.dev'}/server-sitemap.xml`,
    ],
  },
};
