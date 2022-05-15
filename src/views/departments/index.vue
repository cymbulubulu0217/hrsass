<template>
  <div class="dashboard-container">
    <el-card :tree-node="companyInfo" class="card-box">
      <!-- 用了一个行列布局 -->
      <tree-tool
        :gutter="10"
        :is-root="isRoot"
        :tree-node="companyInfo"
        justify="space-between"
        type="flex"
        @addDepts="addDepts"
      />
      <!--      <el-row :gutter="10" :tree-node="companyInfo" justify="space-between" type="flex" />-->
    </el-card>

    <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
      <template v-slot="{data}">
        <treeTool :tree-node="data" @addDepts="addDepts" @delDepts="getDepartments" @editDepts="editDepts" />
      </template>
    </el-tree>
    <div v-loading="loading" class="dashboard-container">
      <AddDept ref="addDept" :show-dialog.sync="showDialog" :tree-node="treeNode" @getDepartments="getDepartments" />
    </div>
  </div>
</template>

<script>
import treeTool from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept'

export default {
  components: {
    treeTool,
    AddDept
  },
  data() {
    return {
      isRoot: true,
      companyInfo: {
        name: '',
        manager: '负责人'
      },
      defaultProps: {
        label: 'name'
      },
      departs: [],
      showDialog: false,
      treeNode: {},
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {

    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      // console.log(result)
      this.departs = tranListToTreeData(result.depts, '')
      this.companyInfo = { name: result.companyName, manager: '负责人', id: '' }
      this.loading = false
    },
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.treeNode = node
    },
    editDepts(node) {
      this.showDialog = true
      this.treeNode = node
      this.$refs.addDept.getDetail(node.id)
    }
  }
}
</script>

<style>
.dashboard-container {
  width: 900px;
  margin: 50px auto;
  font-size: 14px;
}
</style>
