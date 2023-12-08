<template>
  <el-container class="analysis-container">
    <el-header>
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>成果统计</el-breadcrumb-item>
          <el-breadcrumb-item>成果概览</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="analysis_title">
        <P class="analy_title">成果统计</P>
      </div>
    </el-header>

    <el-main>
      <div class="com-chart" ref="seller_ref"></div>
    </el-main>
  </el-container>
</template>

<script>
import '@/echarts/essos.js';

export default {
  data() {
    return {
      chartInstance: null,
      allData: null,

    }
  },

  mounted() {
    this.initChart()
    this.getcount()
  },

  methods: {
    //初始化对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'essos')
    },


    //获取原始数据
    async getcount() {
      const { data: res } = await this.$http.get('statics/count', this.queryInfo)
      if (res.code !== 200) {
        this.$message.error('获取论文列表失败')
      }
      this.allData = res.data
      this.upDateChart()
    },


    //图表主体函数
    upDateChart() {
      const paperNum = this.allData.paperNum
      const patentNum = this.allData.patentNum
      const rewardNum = this.allData.rewardNum
      const verticalNum=this.allData.verticalNum
      const horizontalNum=this.allData.horizontalNum
      const workNum=this.allData.workNum

      const option = {
        tooltip: {},
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['奖励申报数', '专利数', '论文数','横向项目数','纵向项目数','著作数']
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            data: [rewardNum, patentNum, paperNum,horizontalNum,verticalNum,workNum]
          }
        ]
      }
      this.chartInstance.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/elstyle.less';
@import '@/assets/css/analysis.less';
</style>