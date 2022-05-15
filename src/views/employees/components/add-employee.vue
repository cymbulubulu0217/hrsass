<template>
  <el-dialog
    :visible="showDialog"
    title="提示"
    width="30%"
    @close="$emit('update:showDialog',false)"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="活动名称" prop="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" placeholder="选择日期" />
      </el-form-item>
      <!--      <el-form-item label="聘用形式" prop="formOfEmployment">-->
      <!--        <el-select v-model="formData.formOfEmployment" placeholder="请选择" style="width:50%" />-->
      <!--        <el-option :key="item.id" value="item in EmployeeEnum.hireType">1</el-option>-->
      <!--      </el-form-item>-->
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" placeholder="请选择" style="width:50%">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" placeholder="请选择转部门" @focus="getDepartments" />
        <el-tree
          v-if="showTree"
          :data="treeData"
          :default-expand-all="true"
          :props="{ label: 'name' }"
          class="tree-box"
          @node-click="selectNode"
        />
        <!--        <el-cascader-->
        <!--          v-model="selectKey"-->
        <!--          :options="treeData"-->
        <!--          :props="cascaderProps"-->
        <!--          expand-trigger="hover"-->
        <!--          @change="handleChange"-->
        <!--          @focus="getDepartments"-->
        <!--        />-->
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" placeholder="请选择转正时间" />
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="btnCancel">取 消</el-button>
      <el-button type="primary" @click="btnOK">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'

export default {
  name: 'AddEmployee',
  props: {
    showDialog: Boolean
  },
  data() {
    return {
      EmployeeEnum: EmployeeEnum,
      treeData: [],
      showTree: false,
      formData: {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间', trigger: 'blur' }
        ]
      }
      // cascaderProps: {
      //   expandTrigger: 'hover',
      //   value: 'name',
      //   label: 'name',
      //   children: 'children'
      // },
      // selectKey: []
    }
  },
  methods: {
    async getDepartments() {
      this.showTree = true
      const { depts } = await getDepartments()
      console.log(depts)
      this.treeData = tranListToTreeData(depts, '')
    },
    async btnOK() {
      try {
        await this.$refs.formRef.validate()
        await addEmployee(this.formData)
        this.$message.success('新增成功')
        this.$emit('getEmployeeList')
        this.$emit('update:showDialog', false)
      } catch (e) {
        console.log(e)
      }
    },
    btnCancel() {
      // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.formRef.resetFields() // 重置校验结果
      this.$emit('update:showDialog', false)
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    }
    // handleChange() {
    //   console.log(1)
    // }
  }
}
</script>

<style scoped>
.tree-box {
  position: absolute;
  z-index: 1;
  width: 80%;
  border: 1px solid blue;
  border-radius: 5px;
  overflow-y: auto;
  height: 300px;
}
</style>
