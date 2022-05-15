<template>
  <div class="dashboard-container">
    <div class="app-container">
      <tool-bar>
        <template #after>
          <el-button size="mini" type="primary" @click="addPermission(1, '0')">添加按钮</el-button>
        </template>
      </tool-bar>

      <el-table :data="list" border row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="类型" prop="type">
          <template v-slot="{row}">
            <el-tag v-if="row.type===1" type="success">页面访问权限</el-tag>
            <el-tag v-else type="danger">按钮操作权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(2, row.id)"
            >添加
            </el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="deletePermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--  弹出层    -->
      <el-dialog
        :title="isEdit ?'编辑权限':'添加权限'"
        :visible="showDialog"
        @close="btnCancel"
      >
        <!--  表单区域        -->
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input v-model="formData.description" type="textarea" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="btnCancel">取 消</el-button>
          <el-button type="primary" @click="btnOk">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { addPermission, delPermission, getPermissionDetail, getPermissionList, updatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '',
        code: '', // 标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '',
        type: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.formData.id
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await getPermissionList()
      // console.log(res)
      this.list = tranListToTreeData(res, '0')
    },
    addPermission(type, pid) {
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    async btnOk() {
      await this.$refs.formRef.validate()
      if (this.isEdit) {
        // 编辑
        await updatePermission(this.formData)
      } else {
        // 添加
        await addPermission(this.formData)
      }
      this.$message.success(this.isEdit ? '编辑成功' : '添加成功')
      this.getList()
      this.btnCancel()
    },
    btnCancel() {
      this.$refs.formRef.resetFields()
      this.showDialog = false
    },
    async deletePermission(id) {
      await this.$confirm('确定要删除吗')
      await delPermission(id)
      this.$message.success('删除成功')
      this.getList()
      this.showDialog = false
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
