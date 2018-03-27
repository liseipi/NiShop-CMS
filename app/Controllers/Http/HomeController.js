'use strict'

class HomeController {

  async dashboard({view}){
    return view.render('dashboard')
  }

}

module.exports = HomeController
