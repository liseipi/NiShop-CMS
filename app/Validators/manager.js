'use strict'

class manager {
  get rules () {
    return {
      'username': 'required|min:5|max:32|unique:ni_admin_user|not_in:root,admin,super',
      'email': 'required|email|unique:ni_admin_user',
      'password': 'required|min:8|max:64',
      'repassword': 'same:password'
    }
  }
  get messages(){
    return {
      'required': '这个 {{field}} 字段不为空.',
      'unique': '这个 {{field}} 字段已被使用.',
      'repassword.same': '两次密码不相同.'
    }
  }
  async fails (errorMessages){
    this.ctx.session.withErrors(errorMessages).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = manager
