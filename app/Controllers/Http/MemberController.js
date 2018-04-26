'use strict'

class MemberController {

  async userList({view}){
    return view.render('member.user_list')
  }

}

module.exports = MemberController
