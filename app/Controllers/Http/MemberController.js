'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

const memberTable = 'ni_member_info'

class MemberController {

  async userList({view, request}){

    const query = request.get()
    const page = query.page || 1
    const perPage = 20
    const typeValue = query.type || 0
    const keywords = query.keywords || ''

    const memberData = await Database.select('ni_id', 'username', 'mobile', 'email', 'is_verify_mobile', 'is_verify_email').from(memberTable)
      .where(function(){
        if(typeValue!=0){
          this.where(memberTable+'.'+typeValue, 'like', `%${keywords}%`)
        }
      })
      .orderBy('ni_id', 'desc')
      .paginate(page, perPage)

    return view.render('member.user_list', {memberData, query: query})
  }

  async edit({view, params}){
    const memberInfo = await Database.select('*').from(memberTable).where('ni_id', params.id).first()
    return view.render('member.edit', {memberInfo})
  }

  async editSave({request, response, params, session}){
    const saveData = await GlobalFn.formatSubmitData(memberTable, request.all())
    if(!request.all().status){
      saveData.status = 0
    }

    try{
      await Database.table(memberTable).where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改成功！'})
      response.redirect('back')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

}

module.exports = MemberController
