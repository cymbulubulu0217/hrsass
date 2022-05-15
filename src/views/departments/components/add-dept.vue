<template>
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    width="30%"
    @close="btnCancel"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-50个字符" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1-50个字符" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="请选择" style="width:80%" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" :rows="3" placeholder="1-300个字符" style="width:80%" type="textarea" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" justify="center" type="flex">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { addDepartments, getDepartDetail, getDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  name: 'AddDept',
  props: {
    showDialog: Boolean,
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkName = async(rules, value, callback) => {
      console.log(this.treeNode)
      // 首先获取最新的组织架构数据
      const { depts } = await getDepartments()
      // const currentChildren = depts.filter(item => item.pid === this.treeNode.id)
      let currentChildren
      if (this.formData.id) {
        currentChildren = depts.filter((item) => item.pid === this.treeNode.pid && item.id !== this.treeNode.id)
      } else {
        currentChildren = depts.filter((item) => item.pid === this.treeNode.id)
      }
      const isRepeat = currentChildren.some(item => item.name === value)

      // console.log(depts)

      if (isRepeat) {
        callback(new Error('重复了'))
      } else {
        callback()
      }
    }
    const checkCode = async(rules, value, callback) => {
      const { depts } = await getDepartments()
      // const isRepeat = depts.some((item) => item.code === value)
      let isRepeat
      if (this.formData.id) {
        isRepeat = depts.some((item) => item.code === value && item.id !== this.treeNode.id)
      } else {
        isRepeat = depts.some((item) => item.code === value)
      }
      if (isRepeat) {
        callback(new Error('部门code重复了'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 负责人名称
        introduce: '' // 部门介绍
      },
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkName }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCode }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    // 获取员工简单列表数据
    async getEmployeeSimple() {
      const res = await getEmployeeSimple()
      // console.log(res)
      this.peoples = res
    },
    async btnOk() {
      // console.log(1)
      try {
        await this.$refs.formRef.validate()
        if (this.formData.id) {
          // 编辑
          await updateDepartments(this.formData)
          // console.log(1)
        } else {
          await addDepartments({
            ...this.formData,
            pid: this.treeNode.id
          })
        }

        // console.log(this.formData.id)
        this.$message.success(this.formData.id ? '更新成功' : '添加成功')
        this.$emit('getDepartments')
        this.btnCancel()
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel() {
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 负责人名称
        introduce: '' // 部门介绍
      }
      this.$refs.formRef.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style scoped>

</style>
