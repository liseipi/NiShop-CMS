'use strict'

class member {
  get rules () {
    return {
      'username': 'required|min:4|max:32|unique:ni_admin_user|not_in:root,admin,super',
      'email': 'required_if:needs_delivery|email|unique:ni_admin_user',
    }
  }
  get messages(){
    return {
      'required': '这个 {{field}} 字段不为空.',
      'unique': '这个 {{field}} 字段已被使用.'
    }
  }
  async fails (errorMessages){
    this.ctx.session.withErrors(errorMessages).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = member
