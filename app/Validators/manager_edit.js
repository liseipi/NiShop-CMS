'use strict'

class manager {
  get rules () {
    return {
      'password': 'required_if:needs_delivery|min:8|max:64',
      'repassword': 'required_if:needs_delivery|min:8|max:64|same:password',
      'mobile': 'required_if:needs_delivery|integer'
    }
  }
  get messages(){
    return {
      'required': '这个 {{field}} 字段不为空.',
      'repassword.same': '两次密码不相同.',
      'mobile.integer': '填写正确的手机号'
    }
  }
  async fails (errorMessages){
    this.ctx.session.withErrors(errorMessages).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = manager
