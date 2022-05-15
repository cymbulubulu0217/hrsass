<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!--  选项卡     -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="角色管理" name="first">
            <el-button type="primary" @click="showDialog = true">+ 新加角色</el-button>
            <!--   表格         -->
            <template>
              <el-table
                :data="roleslist"
                style="width: 100%;margin-top: 20px"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  width="180"
                />
                <el-table-column
                  label="角色名称"
                  prop="name"
                  width="180"
                />
                <el-table-column
                  label="描述"
                  prop="description"
                />
                <el-table-column
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button size="mini" type="success" @click="assignPerm(scope.row.id)">分配权限</el-button>
                    <el-button size="mini" type="primary" @click="editRole(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div v-loading="loading" />
            </template>
            <!--    /表格        -->

            <!--    分页        -->
            <el-pagination
              :current-page.sync="queryInfo.page"
              :page-size.sync="queryInfo.pagesize"
              :total="queryInfo.total"
              layout="prev, pager, next"
              style="margin: 20px auto;text-align:center"
              @current-change="getRoleList"
            />
            <!--    /分页        -->
          </el-tab-pane>
        </el-tabs>

      </el-card>
    </div>

    <el-tab-pane label="公司信息" name="second">
      <el-alert
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
        title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
        type="info"
      />
      <!--   表单         -->
      <el-form :disabled="true" label-width="80px">
        <el-form-item label="公司名称">
          <el-input v-model="formData.name" placeholder="尚硅谷" />
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="formData.companyAddress" placeholder="公司地址" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.mailbox" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remarks" placeholder="请输入备注" type="textarea" />
        </el-form-item>
      </el-form>
      <!--    /表单        -->
    </el-tab-pane>

    <!--  /选项卡     -->

    <!--  编辑弹框  -->
    <el-dialog :visible="showDialog" title="编辑弹层" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" justify="center" type="flex">
        <el-col :span="6">
          <el-button size="small" @click="btnPermCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- /编辑弹框   -->

    <!--  分配权限弹框  -->
    <el-dialog
      :visible.sync="showProwerDialog"
      title="提示"
      width="30%"
      @close="showProwerDialog=false"
    >
      <el-tree
        ref="treeRef"
        :data="treeList"
        :default-checked-keys="premIds"
        :props="{label:'name'}"
        default-expand-all
        node-key="id"
        show-checkbox
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="showProwerDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmPrower">确 定</el-button>
      </span>
    </el-dialog>
    <!--  /分配权限弹框  -->
  </div>
</template>

<script>
import { addRole, assignPerm, deleteRole, getCompanyInfo, getRoleDetail, getRoleList, updateRole } from '@/api/setting'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permisson'

export default {
  data() {
    return {
      showProwerDialog: false,
      treeList: [],
      premIds: [],
      currentRoleId: '',
      activeName: 'first',
      roleslist: [],
      queryInfo: {
        page: 1, // 页码
        pagesize: 2, // 每页条数
        total: 0 // 记录总数
      },
      formData: {},
      loading: false,
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab)
      console.log(event)
    },
    // 获取角色列表
    async getRoleList() {
      const { rows, total } = await getRoleList({
        ...this.queryInfo
      })
      // console.log(res)
      this.roleslist = rows
      this.queryInfo.total = total
    },
    // handleSizeChange(newpagenum) {
    //   // newPage是当前点击的页码
    //   // console.log(newpagenum)
    //   this.queryInfo.page = newpagenum // 将当前页码赋值给当前的最新页码
    //   this.getRoleList()
    // }
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async del(id) {
      // console.log(id)
      // console.log(this.roleslist.length)

      await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      try {
        this.loading = true
        await deleteRole(id)
        if (this.roleslist.length === 0 && this.queryInfo.page > 1) {
          this.queryInfo.page--
        }
        await this.getRoleList()
        this.loading = false
        this.$message.success('删除成功')
      } catch (err) {
        this.$message.error(err + '删除失败')
      }
    },
    async editRole(id) {
      // console.log(id)
      // console.log(res)
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async btnOK() {
      console.log('ok')
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        await this.getRoleList()
        this.$message.success(this.roleForm.id ? '更新成功' : '新增成功')
      } catch (err) {
        this.$message.error('更新失败')
      }
      this.showDialog = false
    },
    btnCancel() {
      this.showDialog = false
    },
    async assignPerm(id) {
      console.log(id)
      this.treeList = tranListToTreeData(await getPermissionList(), '0')
      const { permIds } = await getRoleDetail(id)
      this.premIds = permIds
      this.currentRoleId = id
      this.showProwerDialog = true
    },
    async confirmPrower() {
      // console.log(this.currentRoleId)
      // console.log(this.$refs.treeRef.getCheckedKeys())
      try {
        await assignPerm({
          permIds: this.$refs.treeRef.getCheckedKeys(),
          id: this.currentRoleId
        })
        this.$message.success('修改成功')
      } catch (e) {
        console.log(e)
      }
      this.showProwerDialog = false
      this.btnPermCancel()
    },
    btnPermCancel() {
      this.treeList = []
      this.showProwerDialog = false
    }
  }
}
</script>

<style>

</style>
