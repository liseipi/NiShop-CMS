'use strict'

const { validate } = use('Validator')
const Database = use('Database')

class AuthController {

  async signIn({request, response, auth, session}) {
    try {
      await auth.check()
      session.flash({notification: '您已经登录，请退出后重试！'})
      return response.redirect('/')
    } catch (error) {

      const rules = {
        email: 'required|email',
        password: 'required|min:6'
      }
      const messages = {
        'email.required': '请输入邮箱地址.',
        'email.email': '请输入正确的邮箱地址.',
        'password.required': '请输入登录密码.',
        'password.min': '请输入不小于6位的登录密码.'
      }
      const validation = await validate(request.all(), rules, messages)
      if(validation.fails()){
        session.withErrors(validation.messages()).flashAll()
        return response.redirect('back')
      }

      const {email, password} = request.all();

      try{
        const userInfo = await auth.attempt(email, password)

        if(userInfo.status!=1){
          await auth.logout()
          session.flash({notification: '登录失败，用户已经禁用！'})
          return response.redirect('back')
        }

        let saveData = {
          lastIp : userInfo.thisIp,
          thisIp : request.ip(),
          lastlogin_at: userInfo.updated_at,
          updated_at: new Date(),
          frequency: userInfo.frequency+1
        }
        let upMsg = ''
        try{
          await Database.table('ni_admin_user').where('ni_id', userInfo.ni_id).update(saveData)
        }catch(error){
          upMsg = '用户信息更新失败。'
        }

        //const menusData = await Database.select('ni_id', 'controller').from('ni_menus')
        //session.put('menusData', menusData)

        session.flash({notification: '登录成功！'+upMsg})
        return response.redirect('/')
      }catch(error){
        //console.log(error)
        session.flash({notification: '登录失败！'})
        return response.redirect('back')
      }
    }
  }

}

module.exports = AuthController
