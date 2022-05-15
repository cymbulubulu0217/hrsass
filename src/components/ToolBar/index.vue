<template>
  <el-card class="page-tools">
    <el-row align="middle" justify="space-between" type="flex">
      <el-col v-if="$slots.before" :span="3">

        <slot name="before" />
        <!--        <el-alert :closable="false" center show-icon title="共166条记录" type="info" />-->

      </el-col>
      <el-col>
        <el-row justify="end" type="flex">
          <slot name="after" />
          <!--          <template>-->
          <!--            <el-button size="mini" type="warning">导入</el-button>-->
          <!--            <el-button size="mini" type="danger">导出</el-button>-->
          <!--            <el-button size="mini" type="primary">新增员工</el-button>-->
          <!--          </template>-->
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: 'Index'
}
</script>

<style lang="scss">
.page-tools {
  margin: 10px 0;

  .before {
    line-height: 34px;

    i {
      margin-right: 5px;
      color: #409eff;
    }

    display: inline-block;
    padding: 0 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>
