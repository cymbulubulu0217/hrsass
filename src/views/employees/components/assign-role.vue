<template>
  <el-dialog :visible="showRoleDialog" title="分配角色" @close="btnCencal">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group
      v-model="selectedRoles"
    >
      <el-checkbox
        v-for="item in list"
        :key="item.id"
        :label="item.id"
      >{{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <el-row slot="footer" justify="center" type="flex">
      <el-col :span="4">
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: Boolean,
    userId: {
      type: Number, String,
      default: null
    }
  },
  data() {
    return {
      list: [],
      selectedRoles: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    async getCurrentRole(id) {
      // console.log(id)
      const { roleIds } = await getUserDetailById(id)
      this.selectedRoles = roleIds
    },
    btnCencal() {
      this.$emit('update:showRoleDialog', false)
      this.selectedRoles = []
    },
    async btnOk() {
      await assignRoles({
        roleIds: this.selectedRoles,
        id: this.userId
      })
      this.$message.success('修改角色信息成功')
      this.btnCencal()
    }
  }
}
</script>

<style scoped>

</style>
