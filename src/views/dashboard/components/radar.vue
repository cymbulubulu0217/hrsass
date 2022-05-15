<template>
  <div>
    <div id="box" ref="radarRef" />
    <el-button @click="changeList">点击更新数据</el-button>
  </div>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { RadarChart } from 'echarts/charts'

// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  RadarChart,
  LegendComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])
export default {
  name: 'Radar',
  data() {
    return {
      list: {
        title: {
          text: '基础雷达图'
        },
        tooltip: {},
        legend: {
          data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          // 每个区域的最高值
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ]
        },
        series: [{
          name: '预算 vs 开销（Budget vs spending）',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [10, 1, 100, 5, 100, 0],
              name: '张三'
            },
            {
              value: [50, 50, 50, 50, 50, 10],
              name: '李四'
            }
          ]
        }]
      }
    }
  },
  mounted() {
    // 初始化 echarts
    this.myChart = echarts.init(this.$refs.radarRef)
    this.myChart.setOption(this.list)
  },
  methods: {
    getRanDomNumber() {
      return parseInt(Math.random() * 100)
    },
    changeList() {
      this.list.series[0].data[0].value = Array.from(Array(6), this.getRanDomNumber)
      this.list.series[0].data[1].value = Array.from(Array(6), this.getRanDomNumber)
      this.myChart.setOption(this.list)
    }
  }
}
</script>

<style scoped>
#box {
  width: 600px;
  height: 400px;
}
</style>
