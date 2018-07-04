const APIV1 = '/api/v1'

module.exports = {
  name: 'MagicShare',
  prefix: 'magicShare',
  footerText: 'magicShare © 2017 muidea.com',
  api: {
    userStatusUrl: `${APIV1}/cas/user/`,
    userLoginUrl: `${APIV1}/cas/user/`,
    userLogoutUrl: `${APIV1}/cas/user/`,
    queryAllFileUrl: `${APIV1}/content/medias/`,
    deleteFileUrl: `${APIV1}/content/media/:id`,
    batchAddFileUrl: `${APIV1}/content/media/batch/`,
    noFoundPageUrl: `${APIV1}/404.html`,
    fileRegistryUrl: `${APIV1}/fileRegistryUrl/file/`,
  },
}
