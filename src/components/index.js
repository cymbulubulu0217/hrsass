import ToolBar from '@/components/ToolBar'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import TagsView from './TagsView'
// import ScreenFull from 'screenfull'

export default {
  install(Vue) {
    Vue.component('ToolBar', ToolBar)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.component('TagsView', TagsView)
    // Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
  }
}
