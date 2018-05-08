'use strict'

class memberLevel {
  get rules () {
    return {
      'level_name': 'required',
      'min_order': 'required',
      'min_amount': 'required',
      'min_points': 'required'
    }
  }
  get messages(){
    return {
      'required': '这个 {{field}} 字段不为空.'
    }
  }
  async fails (errorMessages){
    this.ctx.session.withErrors(errorMessages).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = memberLevel
