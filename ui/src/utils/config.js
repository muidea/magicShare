const APIV1 = '/api/v1'

module.exports = {
  name: 'MagicShare',
  prefix: 'magicShare',
  footerText: 'magicShare © 2017 muidea.com',
  staticPrefix: '/static/',
  api: {
    userStatusUrl: `${APIV1}/cas/user/`,
    userLoginUrl: `${APIV1}/cas/user/`,
    userLogoutUrl: `${APIV1}/cas/user/`,
    queryAllFileUrl: `${APIV1}/content/medias/`,
    queryFileUrl: `${APIV1}/content/media/:id`,
    deleteFileUrl: `${APIV1}/content/media/:id`,
    batchAddFileUrl: `${APIV1}/content/media/batch/`,
    fileRegistryUrl: `${APIV1}/fileregistry/file/`,
    noFoundPageUrl: `${APIV1}/404.html`,
  },
}
