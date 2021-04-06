export default {
  debug: true,
  state: {
    is_authenticated: !!window.localStorage.getItem('madblog-token'),
    // 用户登录后，就算刷新页面也能再次计算出 user_id
    user_id: window.localStorage.getItem('madblog-token') ?
      JSON.parse(atob(window.localStorage
        .getItem('madblog-token').split('.')[1])).user_id : 0,
    user_name: window.localStorage.getItem('madblog-token') ?
      JSON.parse(atob(window.localStorage
        .getItem('madblog-token').split('.')[1])).user_name : '',
    // 后端传 URL 必须先用 base64 编码，这里要多进行一次 atob 解码 base64 字符串
    user_avatar: window.localStorage.getItem('madblog-token') ?
      atob(JSON.parse(atob(window.localStorage
        .getItem('madblog-token').split('.')[1])).user_avatar) : '',
    // 用户权限
    user_perms: window.localStorage.getItem('madblog-token') ?
      JSON.parse(atob(window.localStorage
        .getItem('madblog-token').split('.')[1])).permissions.split(',') : '',
    imageData: {}
  },
  loginAction () {
    if (this.debug) { console.log('loginAction triggered') }
    this.state.is_authenticated = true
    const payload = JSON.parse(atob(window.localStorage
      .getItem('madblog-token').split('.')[1]))
    this.state.user_id = payload.user_id
    this.state.user_name = payload.user_name
    this.state.user_avatar = atob(payload.user_avatar)
    this.state.user_perms = payload.permissions.split(',') // 转换成数组
  },
  logoutAction () {
    if (this.debug) console.log('logoutAction triggered')
    window.localStorage.removeItem('madblog-token')
    this.state.is_authenticated = false
    this.state.user_id = 0
    this.state.user_name = ''
    this.state.user_avatar = ''
    this.state.user_perms = ''
  },
  imageResource () {
    const imagesWebpackRequiredContext = require.context('../assets/icon-img', true, /\.svg$/);

    const imageDatas = {};
    imagesWebpackRequiredContext.keys().forEach(key => {
      const { default: imagePath } = imagesWebpackRequiredContext(key);
      const imageName = imagePath.split(/\/images\/(.*)\.(?:.+)\.svg$/)[1];
      imageDatas[imageName] = imagePath;
    });
    this.state.imageData = imageDatas;
  }
}
