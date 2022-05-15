<template>
  <div class="dashboard-container">
    <div class="app-container">
      <h2>
        <tool-bar>
          <template #before>
            <el-alert :closable="false" :title="`共${page.total}条记录`" center show-icon type="info" />
          </template>

          <template #after>
            <el-button size="mini" type="warning" @click="$router.push('/import')">导入</el-button>
            <el-button size="mini" type="danger" @click="exportData">导出</el-button>
            <el-button size="mini" type="primary" @click="showDialog=true">新增员工</el-button>
          </template>
        </tool-bar>
      </h2>

      <!--  表格区域    -->
      <el-card v-loading="loading">
        <el-table :data="list" border>
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="头像">
            <template v-slot="{row}">
              <el-image
                :src="row.staffPhoto"
                style="width: 100px;height: 100px;border-radius: 50%"
                @click="previewImg(row.staffPhoto)"
              >
                <template #error>
                  <el-image
                    :src="defaultImg"
                    @click="$message.error('当前用户没有头像')"
                  />
                </template>
              </el-image>
              <!--              <img-->
              <!--                v-imagerror="defaultImg"-->
              <!--                :src="row.staffPhoto"-->
              <!--                alt=""-->
              <!--                style="width: 100px;height: 100px;border-radius: 50%"-->
              <!--              >-->
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column :formatter="formatEmployment" label="聘用形式" prop="formOfEmployment" sortable="" />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" sortable="">
            <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable="">
            <template slot-scope="{row}">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" sortable="" width="280">
            <template v-slot="{row}">
              <el-button

                size="small"
                type="text"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看
              </el-button>
              <el-button size="small" type="text">转正</el-button>
              <el-button size="small" type="text">调岗</el-button>
              <el-button size="small" type="text">离职</el-button>
              <el-button size="small" type="text" @click="editRole(row.id)">角色</el-button>
              <el-button
                :disabled="!checkPermission('POINT-USER-UPDATE')"
                size="small"
                type="text"
                @click="deleteEmployee(row.id)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--  /表格区域    -->
        <!-- 分页组件 -->
        <el-row align="middle" justify="center" style="height: 60px" type="flex">
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          />
        </el-row>

        <!--  添加员工表单      -->
        <AddEmployee :show-dialog.sync="showDialog" @getEmployeeList="getEmployeeList" />
        <!--   /添加员工表单     -->

        <el-dialog :visible.sync="showQrcode" title="图片预览">
          <el-row justify="center" type="flex">
            <canvas ref="canvas" />
          </el-row>
        </el-dialog>

        <AssignRole ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
      </el-card>

    </div>
  </div>
</template>

<script>
import { delEmployee, getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import AssignRole from '@/views/employees/components/assign-role'
import { formatDate } from '@/filters'
import defaultImg from '@/assets/common/bigUserHeader.png'
import QrCode from 'qrcode'
import checkPermission from '@/mixin/checkPermission'

export default {
  components: {
    AddEmployee,
    AssignRole
  },
  mixins: [checkPermission],
  data() {
    return {
      userId: null,
      showQrcode: false,
      showRoleDialog: false,
      defaultImg,
      list: [],
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      loading: false,
      showDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    previewImg(url) {
      this.showQrcode = true
      // console.log(url)
      this.$nextTick(() => {
        // 数据更新是同步的，但是界面的渲染是异步的
        // 所有需要在 nextTick 里面获取渲染之后的 dom 元素
        // console.log(this.$refs.canvas)
        QrCode.toCanvas(this.$refs.canvas, url)
      })
    },
    exportData() {
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendors/index').then(async excle => {
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatExcelData(headers, rows)
        // console.log(data)
        excle.export_json_to_excel({
          header: Object.keys(headers),
          data,
          // data: [['13399999', '张三', '2020-2020-2020', '2020', '79119']],
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatExcelData(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    async getEmployeeList() {
      this.loading = true
      const { rows, total } = await getEmployeeList()
      // console.log(rows)
      // console.log(total)
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    handleCurrentChange(newCurrent) {
      console.log(newCurrent)
      this.page.page = newCurrent
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // console.log(row)
      // console.log(column)
      // console.log(cellValue)
      // console.log(index)
      // console.log(EmployeeEnum)
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      // console.log(id)
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        await this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    editRole(id) {
      // console.log(id)
      this.showRoleDialog = true
      this.userId = id
      this.$refs.assignRole.getCurrentRole(id)
    }
  }
}
</script>

<style>

</style>
