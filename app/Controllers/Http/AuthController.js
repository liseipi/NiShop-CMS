'use strict'

const { validate } = use('Validator')

class AuthController {

  async signIn({request, response, auth, session}) {
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

    //const post = new LoginModel()
    const {email, password} = request.all();

    try{
      await auth.attempt(email, password)
      session.flash({notification: '登录成功！'})
      return response.redirect('/')
    }catch(error){
      //console.log(error)
      session.flash({notification: '登录失败！'})
      return response.redirect('back')
    }

  }

}

module.exports = AuthController
