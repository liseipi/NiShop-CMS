'use strict'

class Role {
  async handle ({request, response, session, auth }, next) {
    if(auth.user){
      //console.log(session.get('menusData'))
      //console.log(request.url())

      let LicitUrl = false;
      let AuthCode = null;
      session.get('menusData').forEach((item, index)=>{
        if(item.controller==request.url()){
          LicitUrl = true
          AuthCode = item.ni_id
        }
      })

      if(!LicitUrl){
        session.flash({notification: '请求出错！'})
        return response.redirect('/dashboard')
      }

      if(AuthCode && auth.user.auth.indexOf(AuthCode)>=0){
        session.flash({notification: '权限出错！'})
        return response.redirect('/dashboard')
      }

    }
    await next()
  }
}

module.exports = Role
