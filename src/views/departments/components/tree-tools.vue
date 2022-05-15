<template>
  <!--        {{ data }}-->
  <el-row :gutter="10" justify="space-between" style="width: 100%" type="flex">
    <el-col :span="6">{{ treeNode.name }}</el-col>
    <el-col :span="6">
      <el-row type="flex">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col><!-- 下拉菜单 element -->
          <el-dropdown @command="handleClick">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="add">添加部门</el-dropdown-item>
                <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
                <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 下拉菜单 -->
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>

import { delDepartments } from '@/api/departments'

export default {
  name: 'TreeTools',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: Boolean
  },
  methods: {
    async handleClick(type) {
      // console.log(type)
      if (type === 'add') {
        // 添加子部门的操作
        // 告诉父组件 显示弹层
        // 为何传出treeNode 因为是添加子部门 需要当前部门的数据
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        //  编辑部门的操作
        this.$emit('editDepts', this.treeNode)
      } else {
        // //  删除操作
        // this.$confirm('确定要删除该部门吗').then(() => {
        //   // 如果点击了确定就会进入then
        //   return delDepartments(this.treeNode.id) // 返回promise对象
        // }).then(() => {
        //   //  如果删除成功了  就会进入这里
        //   this.$emit('delDepts') // 触发自定义事件
        //   this.$emit('delDepts')
        // })
        await this.$confirm('确定要删除该部门吗')
        await delDepartments(this.treeNode.id)
        this.$emit('delDepts')
        this.$emit('delDepts')
      }
    }
  }
}
</script>

<style scoped>

</style>
