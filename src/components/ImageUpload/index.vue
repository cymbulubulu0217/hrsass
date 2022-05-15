<template>
  <div>
    <el-upload
      :before-upload="beforeUpload"
      :class="{disabled:fileComputed}"
      :file-list="fileList"
      :http-request="upload"
      :limit="1"
      :on-change="onChange"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      action="#"
      list-type="picture-card"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percentage" style="width: 200px" />
    <el-dialog :visible.sync="dialogVisible" title="图片预览">
      <el-row align="middel" justify="center" type="flex">
        <img :src="dialogImageUrl" alt="" width="600px">
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 需要实例化
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKID3uWrviFWWFgrlPmshEUYLr64lBKCn7Av',
  SecretKey: 'Xrtf9NK0PYQ1KOBgurXw3tSkmKccLnys'
})
// 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了

export default {
  name: 'ImageUpload',
  data() {
    return {
      // 进度条
      percentage: 0,
      // 显示隐藏进度条
      showPercent: false,
      fileList: [
        { url: 'https://dogefs.s3.ladydaily.com/~/source/wallhaven/small/y8/y8vlyk.jpg' }
      ],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    // 当有图片的时候不显示上传框
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 删除图片触发，删除时
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter(item => !item.uid === file.uid)
    },
    // 查看图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onChange(file, fileList) {
      this.fileList = fileList
    },
    beforeUpload(file) {
      // console.log(file)
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 显示进度条
      this.showPercent = true
      return true
    },
    upload(params) {
      // console.log(params)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'c171730-1309402079', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
          onProgress: (progressData) => {
            // console.log(progressData)
            this.percentage = progressData.percent * 100
          }
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          // console.log(err || data)
          if (!err && data.statusCode === 200) {
            // console.log('success')
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentUid) {
                return {
                  ...item,
                  url: `http://${data.Location}`,
                  upload: true
                }
              }
              return item
            })
          }
          // 设置一个定时器，2秒后关闭进度条并清零
          setTimeout(() => {
            this.showPercent = false
            this.percentage = 0
          }, 2000)
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
