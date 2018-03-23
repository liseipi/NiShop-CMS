'use strict'

class manager {
  get rules () {
    return {
      'username': 'required|min:6|max:32|unique:ni_admin_user',
      'email': 'required|email|unique:ni_admin_user',
      'password': 'required|min:8|max:64',
      'repassword': 'same:password',
      'mobile': 'required_if:needs_delivery|integer'
    }
  }
  get messages(){
    return {
      'required': '这个 {{field}} 字段不为空.',
      'unique': '这个 {{field}} 字段已被使用.',
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
