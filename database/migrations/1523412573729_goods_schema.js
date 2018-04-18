'use strict'

const Schema = use('Schema')

class GoodsSchema extends Schema {
  up () {
    this.create('ni_goods', (table) => {
      table.increments('ni_id')
      table.integer('category_id', 8).comment('分类ID')
      table.string('goods_sku', 32).comment('货号')
      table.string('goods_name', 255).comment('商品名称')
      table.text('goods_keywords').comment('商品关键词')
      table.integer('status', 1).comment('销售状态')
      table.integer('sort', 12).comment('商品排序')
      table.integer('goods_instock', 32).comment('库存')
      table.integer('goods_price', 32).comment('商品价格')
      table.integer('goods_original_price', 32).comment('商品原价')
      table.integer('goods_calculus', 64).comment('商品积分')
      table.integer('goods_is_real', 1).defaultTo(0).comment('是否为虚拟商品')
      table.integer('goods_weight', 32).comment('重量')
      table.string('goods_volume', 64).comment('体积')
      table.integer('goods_is_new', 1).defaultTo(1).comment('是否为新品')
      table.integer('goods_is_hot', 1).defaultTo(1).comment('是否为热销')
      table.integer('goods_is_best', 1).defaultTo(1).comment('是否为精品')
      table.integer('goods_is_promotions', 1).defaultTo(1).comment('是否正在促销')
      table.integer('goods_promotions_price', 32).comment('促销价格')
      table.bigInteger('goods_promotions_time_start', 14).comment('促销开始时间')
      table.bigInteger('goods_promotions_time_end', 14).comment('促销结束时间')
      table.integer('goods_postage', 1).comment('是否免邮')
      table.integer('goods_postage_price', 32).comment('邮费价格')
      table.integer('goods_is_group', 1).comment('是否为组商品')
      table.integer('brands_id', 8).comment('品牌ID')
      table.string('goods_thumb', 64).comment('商品主图')
      table.text('content').comment('商品详细')
      table.integer('view_number', 128).defaultTo(0).comment('查看次数')
      table.integer('goods_created_admin', 8).comment('商品发布者')
      table.timestamps()
    })
  }

  down () {
    this.drop('ni_goods')
  }
}

module.exports = GoodsSchema
