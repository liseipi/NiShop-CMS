'use strict'

class redpacket {
  get rules () {
    return {
      'redpacket_name': 'required',
      'redpacket_price': 'required',
      'redpacket_min_order_price': 'required',
      'redpacket_type': 'required',
      'redpacket_push_start_at': 'required',
      'redpacket_push_end_at': 'required',
      'redpacket_use_start_at': 'required',
      'redpacket_use_end_at': 'required'
    }
  }
  get messages(){
    return {
      'required': '这个 {{field}} 字段不为空.',
      'redpacket_push_start_at.required': '发放开始时间不为空.',
      'redpacket_push_end_at.required': '发放结束时间不为空.',
      'redpacket_use_start_at.required': '使用开始时间不为空.',
      'redpacket_use_end_at.required': '使用结束时间不为空.'
    }
  }
  async fails (errorMessages){
    this.ctx.session.withErrors(errorMessages).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = redpacket
