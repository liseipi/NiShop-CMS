'use strict'

class Role {
  async handle ({request, response, session, auth }, next) {
    if(auth.user){
      //console.log(session.get('menusData'))
      //console.log(request.url().match(/^\/.+\(/.+)?/ig))

      let LicitUrl = true;
      let AuthCode = null;
      let acturl = request.url()
      let urlArr = acturl.split('/')
      if(urlArr.length-1>=3){
        acturl = '/'+urlArr[1]+'/'+urlArr[2]
      }

      if(session.get('menusData')){
        session.get('menusData').forEach((item, index)=>{
          if(item.controller==acturl){
            LicitUrl = false
            AuthCode = item.ni_id
          }
        })
      }

      //指定URL不做全局权限认证
      const no_Auth = [
        '/',
        '/dashboard'
      ]
      if(no_Auth.indexOf(acturl)<0){
        if(LicitUrl){
          session.flash({notification: '请求出错！'})
          return response.redirect('/dashboard')
        }
        if(AuthCode && auth.user.auth.indexOf(AuthCode)<0){
          session.flash({notification: '权限出错！'})
          return response.redirect('/dashboard')
        }
      }

    }
    await next()
  }
}

module.exports = Role