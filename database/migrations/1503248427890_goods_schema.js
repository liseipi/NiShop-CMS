'use strict'

const Schema = use('Schema')

class GoodsSchema extends Schema {
  up () {
    this.create('ni_goods', (table) => {
      table.increments('ni_id')
      table.integer('category_id', 8).notNullable().comment('分类ID')
      table.string('goods_sku', 32).notNullable().unique().comment('货号')
      table.string('goods_name', 255).notNullable().comment('商品名称')
      table.text('goods_keywords').comment('商品关键词')
      table.boolean('status', 1).defaultTo(1).comment('销售状态')
      table.integer('sort', 12).comment('商品排序')
      table.integer('goods_instock', 32).defaultTo(0).comment('库存')
      table.float('goods_price', 32).comment('商品价格')
      table.float('goods_original_price', 32).comment('商品原价')
      table.integer('goods_points', 64).comment('商品积分')
      table.boolean('goods_is_real', 1).defaultTo(0).comment('是否为虚拟商品')
      table.boolean('is_weight', 32).defaultTo(0).comment('是否计重：默认不计')
      table.float('goods_weight', 32).comment('重量 kg')
      table.string('goods_volume', 64).comment('体积：暂未使用')
      table.boolean('goods_is_new', 1).defaultTo(1).comment('是否为新品')
      table.boolean('goods_is_hot', 1).defaultTo(1).comment('是否为热销')
      table.boolean('goods_is_best', 1).defaultTo(1).comment('是否为精品')
      table.boolean('goods_is_promotions', 1).defaultTo(1).comment('是否正在促销')
      table.float('goods_promotions_price', 32).comment('促销价格')
      table.bigInteger('goods_promotions_time_start', 13).comment('促销开始时间')
      table.bigInteger('goods_promotions_time_end', 13).comment('促销结束时间')
      table.boolean('goods_postage', 1).defaultTo(1).comment('是否免邮')
      table.float('goods_postage_price', 32).comment('邮费价格')
      table.boolean('goods_is_group', 1).defaultTo(1).comment('是否为组商品')
      table.integer('brands_id', 8).comment('品牌ID')
      table.string('goods_thumb', 64).comment('商品主图')
      table.text('content').comment('商品详细')
      table.integer('view_count', 128).defaultTo(0).comment('查看次数')
      table.string('goods_created_admin', 32).comment('商品发布者')
      table.boolean('is_order_exist', 1).defaultTo(0).comment('是否存在订单，为1时存在订单数据，不可以修改：分类、SKU、品牌')
      table.integer('related_id', 8).defaultTo(0).comment('关联商品ID')
      table.bigInteger('update_at', 13).comment('上次修改时间')
      table.bigInteger('create_at', 13).comment('商品创建时间')
    })
    .raw("ALTER TABLE `ni_goods` AUTO_INCREMENT=800")
  }

  down () {
    this.drop('ni_goods')
  }
}

module.exports = GoodsSchema
