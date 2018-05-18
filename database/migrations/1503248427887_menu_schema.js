'use strict'

const Schema = use('Schema')
const Database = use('Database')

class MenuSchema extends Schema {
  up () {
    this.create('ni_menus', (table) => {
      table.increments('ni_id')
      table.string('menuname', 32).notNullable().comment('菜单名称')
      table.integer('parent_id', 6).notNullable().comment('父级ID')
      table.string('controller', 64).notNullable().comment('控制器名称')
      table.boolean('runStatus', 1).comment('状态 0：显示左侧菜单，：隐藏链接处理')
      table.integer('menu_sort', 6).comment('排序')
    })
    .raw("ALTER TABLE `ni_menus` AUTO_INCREMENT=100")

    this.schedule(async (trx) => {
      //await Database.schema.raw(``)
      let rows = [
        {ni_id:100,menuname:"控制台中心",parent_id:0,controller:"/dashboard",runStatus:0,menu_sort:100},

        {ni_id:150,menuname:"导航菜单管理",parent_id:0,controller:"/menu",runStatus:0,menu_sort:100},
        {ni_id:151,menuname:"增加菜单",parent_id:150,controller:"/menu/add",runStatus:0,menu_sort:100},
        {ni_id:152,menuname:"菜单列表",parent_id:150,controller:"/menu/list",runStatus:0,menu_sort:100},
        {ni_id:153,menuname:"编辑菜单",parent_id:150,controller:"/menu/edit",runStatus:1,menu_sort:100},
        {ni_id:154,menuname:"删除菜单",parent_id:150,controller:"/menu/destroy",runStatus:1,menu_sort:100},

        {ni_id:200,menuname:"文章管理",parent_id:0,controller:"/article",runStatus:0,menu_sort:100},
        {ni_id:201,menuname:"增加文章",parent_id:200,controller:"/article/add",runStatus:0,menu_sort:100},
        {ni_id:202,menuname:"文章列表",parent_id:200,controller:"/article/list",runStatus:0,menu_sort:100},
        {ni_id:203,menuname:"编辑文章",parent_id:200,controller:"/article/edit",runStatus:1,menu_sort:100},
        {ni_id:204,menuname:"删除文章",parent_id:200,controller:"/article/destroy",runStatus:1,menu_sort:100},
        {ni_id:205,menuname:"增加栏目",parent_id:200,controller:"/article/categoryAdd",runStatus:0,menu_sort:100},
        {ni_id:206,menuname:"栏目列表",parent_id:200,controller:"/article/category",runStatus:0,menu_sort:100},
        {ni_id:207,menuname:"编辑栏目",parent_id:200,controller:"/article/categoryEdit",runStatus:1,menu_sort:100},
        {ni_id:208,menuname:"删除栏目",parent_id:200,controller:"/article/categoryDestroy",runStatus:1,menu_sort:100},

        {ni_id:250,menuname:"商品管理",parent_id:0,controller:"/goods",runStatus:0,menu_sort:100},
        {ni_id:251,menuname:"增加商品",parent_id:250,controller:"/goods/add",runStatus:0,menu_sort:100},
        {ni_id:252,menuname:"商品列表",parent_id:250,controller:"/goods/list",runStatus:0,menu_sort:100},
        {ni_id:253,menuname:"编辑商品",parent_id:250,controller:"/goods/edit",runStatus:1,menu_sort:100},
        {ni_id:254,menuname:"删除商品",parent_id:250,controller:"/goods/destroy",runStatus:1,menu_sort:100},
        {ni_id:255,menuname:"商品编辑--删除属性",parent_id:250,controller:"/goods/delAttr",runStatus:1,menu_sort:100},
        {ni_id:256,menuname:"商品编辑--删除组商品",parent_id:250,controller:"/goods/delGroup",runStatus:1,menu_sort:100},
        {ni_id:257,menuname:"商品编辑--删除相册",parent_id:250,controller:"/goods/delGallery",runStatus:1,menu_sort:100},
        {ni_id:258,menuname:"增加商品栏目",parent_id:250,controller:"/goods/categoryAdd",runStatus:0,menu_sort:100},
        {ni_id:259,menuname:"商品栏目列表",parent_id:250,controller:"/goods/category",runStatus:0,menu_sort:100},
        {ni_id:260,menuname:"编辑商品栏目",parent_id:250,controller:"/goods/categoryEdit",runStatus:1,menu_sort:100},
        {ni_id:261,menuname:"删除商品栏目",parent_id:250,controller:"/goods/categoryDestroy",runStatus:1,menu_sort:100},
        {ni_id:262,menuname:"增加品牌",parent_id:250,controller:"/goods/brandsAdd",runStatus:0,menu_sort:100},
        {ni_id:263,menuname:"品牌列表",parent_id:250,controller:"/goods/brands",runStatus:0,menu_sort:100},
        {ni_id:264,menuname:"品牌编辑",parent_id:250,controller:"/goods/brandsEdit",runStatus:1,menu_sort:100},
        {ni_id:265,menuname:"品牌删除",parent_id:250,controller:"/goods/brandsDestroy",runStatus:1,menu_sort:100},
        {ni_id:266,menuname:"增加商品属性",parent_id:250,controller:"/goods/attrAdd",runStatus:0,menu_sort:100},
        {ni_id:267,menuname:"商品属性列表",parent_id:250,controller:"/goods/attr",runStatus:0,menu_sort:100},
        {ni_id:268,menuname:"编辑商品属性",parent_id:250,controller:"/goods/attrEdit",runStatus:1,menu_sort:100},
        {ni_id:269,menuname:"删除商品属性",parent_id:250,controller:"/goods/attrDestroy",runStatus:1,menu_sort:100},

        {ni_id:300,menuname:"广告与促销",parent_id:0,controller:"/advert",runStatus:0,menu_sort:100},
        {ni_id:301,menuname:"增加广告",parent_id:300,controller:"/advert/add",runStatus:0,menu_sort:100},
        {ni_id:302,menuname:"广告列表",parent_id:300,controller:"/advert/list",runStatus:0,menu_sort:100},
        {ni_id:303,menuname:"编辑广告",parent_id:300,controller:"/advert/edit",runStatus:1,menu_sort:100},
        {ni_id:304,menuname:"删除广告",parent_id:300,controller:"/advert/destroy",runStatus:1,menu_sort:100},
        {ni_id:305,menuname:"删除广告图片",parent_id:300,controller:"/advert/delAdvertPhoto",runStatus:1,menu_sort:100},
        {ni_id:306,menuname:"增加优惠活动",parent_id:300,controller:"/advert/saleAdd",runStatus:0,menu_sort:100},
        {ni_id:307,menuname:"优惠活动列表",parent_id:300,controller:"/advert/saleList",runStatus:0,menu_sort:100},
        {ni_id:308,menuname:"编辑优惠活动",parent_id:300,controller:"/advert/saleEdit",runStatus:1,menu_sort:100},
        {ni_id:309,menuname:"删除优惠活动",parent_id:300,controller:"/advert/saleDestroy",runStatus:1,menu_sort:100},
        {ni_id:310,menuname:"增加红包",parent_id:300,controller:"/advert/redPacketAdd",runStatus:0,menu_sort:100},
        {ni_id:311,menuname:"红包列表",parent_id:300,controller:"/advert/redPacket",runStatus:0,menu_sort:100},
        {ni_id:312,menuname:"编辑红包",parent_id:300,controller:"/advert/redPacketEdit",runStatus:1,menu_sort:100},
        {ni_id:313,menuname:"删除红包",parent_id:300,controller:"/advert/redPacketDestroy",runStatus:1,menu_sort:100},
        {ni_id:314,menuname:"发放红包",parent_id:300,controller:"/advert/redPacketLibrary",runStatus:1,menu_sort:100},

        {ni_id:350,menuname:"会员管理",parent_id:0,controller:"/member",runStatus:0,menu_sort:100},
        {ni_id:351,menuname:"增加会员",parent_id:350,controller:"/member/add",runStatus:0,menu_sort:100},
        {ni_id:352,menuname:"会员列表",parent_id:350,controller:"/member/list",runStatus:0,menu_sort:100},
        {ni_id:353,menuname:"编辑会员",parent_id:350,controller:"/member/edit",runStatus:1,menu_sort:100},
        {ni_id:354,menuname:"删除会员",parent_id:350,controller:"/member/destroy",runStatus:1,menu_sort:100},
        {ni_id:355,menuname:"增加等级",parent_id:350,controller:"/member/levelAdd",runStatus:0,menu_sort:100},
        {ni_id:356,menuname:"等级列表",parent_id:350,controller:"/member/level",runStatus:0,menu_sort:100},
        {ni_id:357,menuname:"编辑等级",parent_id:350,controller:"/member/levelEdit",runStatus:1,menu_sort:100},
        {ni_id:358,menuname:"删除等级",parent_id:350,controller:"/member/levelDestroy",runStatus:1,menu_sort:100},
        {ni_id:359,menuname:"增加地址",parent_id:350,controller:"/member/addressNew",runStatus:1,menu_sort:100},
        {ni_id:360,menuname:"编辑地址",parent_id:350,controller:"/member/addressEdit",runStatus:1,menu_sort:100},
        {ni_id:361,menuname:"删除地址",parent_id:350,controller:"/member/addressDestroy",runStatus:1,menu_sort:100},
        {ni_id:362,menuname:"会员购物车",parent_id:350,controller:"/member/cart",runStatus:1,menu_sort:100},
        {ni_id:363,menuname:"保存购物车",parent_id:350,controller:"/member/cartSave",runStatus:1,menu_sort:101},

        {ni_id:400,menuname:"订单管理",parent_id:0,controller:"/order",runStatus:0,menu_sort:100},
        {ni_id:401,menuname:"订单列表",parent_id:400,controller:"/order/list",runStatus:0,menu_sort:100},
        {ni_id:402,menuname:"订单合并",parent_id:400,controller:"/order/merge",runStatus:0,menu_sort:100},
        {ni_id:403,menuname:"增加订单",parent_id:400,controller:"/order/add",runStatus:1,menu_sort:100},

        {ni_id:450,menuname:"权限管理",parent_id:0,controller:"/manager",runStatus:0,menu_sort:100},
        {ni_id:451,menuname:"角色列表",parent_id:450,controller:"/manager/role",runStatus:0,menu_sort:100},
        {ni_id:452,menuname:"增加角色",parent_id:450,controller:"/manager/roleAdd",runStatus:0,menu_sort:100},
        {ni_id:453,menuname:"编辑角色",parent_id:450,controller:"/manager/roleEdit",runStatus:1,menu_sort:100},
        {ni_id:454,menuname:"删除角色",parent_id:450,controller:"/manager/roleDestroy",runStatus:1,menu_sort:100},
        {ni_id:455,menuname:"增加管理员",parent_id:450,controller:"/manager/add",runStatus:0,menu_sort:100},
        {ni_id:456,menuname:"管理员列表",parent_id:450,controller:"/manager/list",runStatus:0,menu_sort:100},
        {ni_id:457,menuname:"编辑管理员",parent_id:450,controller:"/manager/edit",runStatus:1,menu_sort:100},
        {ni_id:458,menuname:"删除管理员",parent_id:450,controller:"/manager/destroy",runStatus:1,menu_sort:100},

        {ni_id:500,menuname:"资源管理",parent_id:0,controller:"/file",runStatus:1,menu_sort:100},
        {ni_id:501,menuname:"上传资源",parent_id:500,controller:"/file/save",runStatus:0,menu_sort:100},

        {ni_id:550,menuname:"查找数据",parent_id:0,controller:"/findGet",runStatus:1,menu_sort:100},
        {ni_id:551,menuname:"获取品牌",parent_id:550,controller:"/getBrands",runStatus:1,menu_sort:100},
        {ni_id:552,menuname:"获取分类",parent_id:550,controller:"/getCategory",runStatus:1,menu_sort:100},
        {ni_id:553,menuname:"获取商品",parent_id:550,controller:"/getGoods",runStatus:1,menu_sort:100},
        {ni_id:554,menuname:"获取会员",parent_id:550,controller:"/getMember",runStatus:1,menu_sort:100},
        {ni_id:555,menuname:"Ajax请求商品属性",parent_id:550,controller:"/goods/getAttr",runStatus:1,menu_sort:100},
        {ni_id:556,menuname:"Ajax请求检查SKU",parent_id:550,controller:"/goods/checkSku",runStatus:1,menu_sort:100},
        {ni_id:557,menuname:"Ajax请求地区",parent_id:550,controller:"/member/getRegion",runStatus:1,menu_sort:100},

        {ni_id:600,menuname:"系统管理",parent_id:0,controller:"/system",runStatus:0,menu_sort:100},
        {ni_id:601,menuname:"商店信息",parent_id:600,controller:"/system/shopInfo",runStatus:0,menu_sort:100},
      ]
      await Database.table('ni_menus').transacting(trx).insert(rows)
    })

  }

  down () {
    this.drop('ni_menus')
  }
}

module.exports = MenuSchema
