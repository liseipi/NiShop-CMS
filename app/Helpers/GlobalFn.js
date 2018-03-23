'use strict'

const Database = use('Database')

class GlobalFnClass {

  //结合表单与表中字段有效的数据
  static async formatSubmitData(tablename, data) {
    const tableField = await Database.table(tablename).columnInfo()
    const body = data;
    let fieldData = { ...tableField }
    delete fieldData.ni_id
    let saveData = {}
    for (let key in fieldData) {
      if (body.hasOwnProperty(key)) {
        saveData[key] = body[key]
      }
    }
    return saveData
  }

  //返回无极树型结构多维数组
  static treeSort([...data], pid = 0, level = 1) {
    let result = [], temp, _this = this;
    data.forEach((item, index) => {
      if (item.parent_id == pid) {
        item = Object.assign({}, item, {level_id: level})
        result.push(item);
        temp = _this.treeSort(data, item.ni_id, level + 1);
        if (temp.length > 0) {
          item.children = temp;
        }
      }
    })
    return [...result]
  }

  //返回无极树型结构一维数组
  static soleTreeSort([...data], pid = 0, level = 1) {
    data.sort((a, b) => a.ni_id - b.ni_id)
    let result = []
    function sort_tree(Pid, level) {
      data.forEach((item, index) => {
        if (item.parent_id == Pid) {
          item = Object.assign({}, item, {level_id: level})
          result.push(item)
          sort_tree(item.ni_id, level + 1)
        }
      })
    }
    sort_tree(pid, level)
    return [...result]
  }

  //返回子集的需要字段 *(请先使用 soleTreeSort 处理返回子集一唯数据)
  static async findSubData([...data], pid = 0, field = 'ni_id') {
    let result = []
    let formatData = await this.soleTreeSort([...data], pid)
    formatData.forEach((item, index)=>{
      result.push(item[field])
    })
    return [...result]
  }

}

module.exports = GlobalFnClass
