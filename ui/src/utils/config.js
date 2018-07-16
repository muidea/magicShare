const APIV1 = '/api/v1'

module.exports = {
  name: 'MagicShare',
  prefix: 'magicShare',
  footerText: 'magicShare © 2017 muidea.com',
  staticPrefix: '/static/',
  fileRegistry: '/fileregistry/file/',
  api: {
    userStatusUrl: `${APIV1}/user/status/`,
    userLoginUrl: `${APIV1}/user/login/`,
    userLogoutUrl: `${APIV1}/user/logout/`,
    queryAllFileUrl: `${APIV1}/file/`,
    queryFileUrl: `${APIV1}/file/:id`,
    deleteFileUrl: `${APIV1}/file/:id`,
    batchAddFileUrl: `${APIV1}/file/`,
    noFoundPageUrl: `${APIV1}/404.html`,
  },
}
