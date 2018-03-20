'use strict'

const Database = use('Database')

class GlobalFnClass{

  static async formatSubmitData(tablename, data){
    const tableField = await Database.table(tablename).columnInfo()
    const body = data;
    let fieldData = { ...tableField }
    delete fieldData.ni_id
    let saveData = {}
    for (let key in fieldData) {
      if(body.hasOwnProperty(key)){
        saveData[key] = body[key]
      }
    }
    return saveData
  }

  static test(){
    return 10
  }

}

module.exports = GlobalFnClass
