const APIV1 = '/api/v1'

module.exports = {
  name: 'MagicShare',
  prefix: 'magicShare',
  footerText: 'magicShare © 2017 muidea.com',
  api: {
    userStatus: `${APIV1}/cas/user/`,
    userLogin: `${APIV1}/cas/user/`,
    userLogout: `${APIV1}/cas/user/`,
    indexQuery: `${APIV1}/content/medias/`,
    batchAdd: `${APIV1}/content/media/batch/`,
    noFoundPage: `${APIV1}/404.html`,
    fileRegistry: `${APIV1}/fileregistry/file/`,
  },
}
