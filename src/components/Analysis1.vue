<template>
  <el-container class="analysis-container">
    <el-header>
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>成果统计</el-breadcrumb-item>
          <el-breadcrumb-item>查询页面</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="analysis_title">
        <P class="analy_title">成果统计</P>
      </div>
    </el-header>
    <el-main>
      <el-row :gutter="24" type="flex" class="analy_select">
        <el-col :span="8" style="padding-left:12px;padding-right:0px">
          <div class="analy_select_head">
            <p class="analy_p">请输入作者姓名：</p>
            <el-input placeholder="请输入作者姓名" v-model="Keyword"></el-input>
            <el-button slot="append" icon="iconfont icon-a-huaban1fuben7" @click="search()"></el-button>
            <el-button @click="export2excel()">导出数据</el-button>
          </div>

        </el-col>
      </el-row>

      <el-row :gutter="24" type="flex" class="analy_select">
        <el-col style="padding-left:12px;padding-right:0px">
          <div>
            <p class="reward_p">已发表论文列表
              <div>
                <el-button @click="paperDownload()">导出数据</el-button>
              </div>
            </p>
            <!-- 论文表 -->
            <el-table :data="paperlist" border fit stripe :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="论文题目" prop="title"></el-table-column>
              <el-table-column label="第一作者" prop="firstAuthor"></el-table-column>
              <el-table-column label="通讯作者" prop="correspondingAuthor"></el-table-column>
              <el-table-column label="所有作者" prop="authors"></el-table-column>
              <el-table-column label="刊物类型" prop="publicationType"></el-table-column>
              <el-table-column label="发表时间" prop="publishDate"></el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="paperInfo.pageNo" key="lista"
              :page-size="paperInfo.pageSize" layout="total, prev, pager, next, jumper" :total="papertotal">
            </el-pagination>
          </div>
          <div>
            <!-- 专利表 -->
            <p class="reward_p">已授权专利列表
              <div>
                <el-button @click="patentDownload()">导出数据</el-button>
              </div></p>
            <el-table :data="patentlist" border stripe :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="专利名称" prop="patentName"></el-table-column>
              <el-table-column label="专利发明（设计）人" prop="patentDesigner"></el-table-column>
              <el-table-column label="申请人" prop="applicant"></el-table-column>
              <el-table-column label="专利权人" prop="patentee"></el-table-column>
              <el-table-column label="授权日期" prop="authorizationDate"></el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="patentInfo.pageNo" key="listb"
              :page-size="patentInfo.pageSize" layout="total, prev, pager, next, jumper" :total="patenttotal">
            </el-pagination>
          </div>

          <div>
            <!-- 获批奖励表 -->
            <p class="reward_p">已获批奖励列表
              <div>
                <el-button @click="rewardDownload()">导出数据</el-button>
              </div></p>
            <el-table :data="rewardlist" border stripe :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="奖励名称" prop="awardName"></el-table-column>
              <el-table-column label="申报题目" prop="title"></el-table-column>
              <el-table-column label="第一完成人" prop="firstAuthor"></el-table-column>
              <el-table-column label="获奖完成人" prop="awardWinner"></el-table-column>
              <el-table-column label="获奖日期" prop="awardDate"></el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="rewardInfo.pageNo" key="listc"
              :page-size="rewardInfo.pageSize" layout="total, prev, pager, next, jumper" :total="rewardtotal">
            </el-pagination>
          </div>

          <div>
            <!-- 发表著作表 -->
            <p class="reward_p">已发表著作列表
              <div>
                <el-button @click="workDownload()">导出数据</el-button>
              </div></p>
            <el-table :data="worklist" border stripe :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="著作名称" prop="workName"></el-table-column>
              <el-table-column label="第一作者" prop="firstAuthor"></el-table-column>
              <el-table-column label="参编作者" prop="participateAuthors"></el-table-column>
              <el-table-column label="出版单位" prop="publisher"></el-table-column>
              <el-table-column label="出版时间" prop="publishDate"></el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="workInfo.pageNo" key="listd"
              :page-size="workInfo.pageSize" layout="total, prev, pager, next, jumper" :total="worktotal">
            </el-pagination>
          </div>

          <div>
            <!-- 纵向项目信息 -->
            <p class="reward_p">纵向项目信息
              <div>
                <el-button @click="verticalsDownload()">导出数据</el-button>
              </div></p>
            <el-table :data="verticalslist" border stripe :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="项目名称" prop="projectName"></el-table-column>
              <el-table-column label="项目级别" prop="projectLevel"></el-table-column>
              <el-table-column label="负责人" prop="leader"></el-table-column>
              <el-table-column label="项目成员(其他参研人员)" prop="projectMember"></el-table-column>
              <el-table-column label="开始时间" prop="startDate"></el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="verticalsInfo.pageNo" key="liste"
              :page-size="verticalsInfo.pageSize" layout="total, prev, pager, next, jumper" :total="verticalstotal">
            </el-pagination>
          </div>

          <div>
            <!-- 横向项目信息 -->
            <p class="reward_p">横向项目信息
              <div>
                <el-button @click="horizontalsDownload()">导出数据</el-button>
              </div></p>
            <el-table :data="horizontalslist" border stripe :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="学科门类" prop="category"></el-table-column>
              <el-table-column label="合同名称" prop="contractName"></el-table-column>
              <el-table-column label="负责人" prop="manager"></el-table-column>
              <el-table-column label="合同成员" prop="contractMember"></el-table-column>
              <el-table-column label="签订日期" prop="signDate"></el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="horizontalsInfo.pageNo" key="listf"
              :page-size="horizontalsInfo.pageSize" layout="total, prev, pager, next, jumper" :total="horizontalstotal">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>


import reward from "@/components/Reward.vue";

export default {
  computed: {
    reward() {
      return reward
    }
  },
  data() {
    return {
      filename:'',
      // 获取用户列表的参数对象
      queryInfo: {
        //模糊查询条件
        keyword: '',
        // 当前的页数
        pageNo: 1,
        //每页显示条数
        pageSize: 10,
      },
      //获取论文列表的参数
      paperInfo: {
        //模糊查询条件
        keyword: '',
        // 当前的页数
        pageNo: 1,
        //每页显示条数
        pageSize: 10,
      },
      paperInfo2:{
        name:'',
      },
      //获取专利列表
      patentInfo: {
        //模糊查询条件
        keyword: '',
        // 当前的页数
        pageNo: 1,
        //每页显示条数
        pageSize: 10,
      },
      //获批奖励列表
      rewardInfo: {
        //模糊查询条件
        keyword: '',
        // 当前的页数
        pageNo: 1,
        //每页显示条数
        pageSize: 10,
      },//已发表著作列表
      workInfo: {
        //模糊查询条件
        keyword: '',
        // 当前的页数
        pageNo: 1,
        //每页显示条数
        pageSize: 10,
      },
      //纵向项目列表
      verticalsInfo: {
        //模糊查询条件
        keyword: '',
        // 当前的页数
        pageNo: 1,
        //每页显示条数
        pageSize: 10,
      },
      //横向项目列表
      horizontalsInfo: {
        //模糊查询条件
        keyword: '',
        // 当前的页数
        pageNo: 1,
        //每页显示条数
        pageSize: 10,
      },
      //论文关键字
      Keyword: '',

      //论文列表
      paperlist: [],
      paperlist2: [],
      //专利列表
      patentlist: [],
      //获批奖励列表
      rewardlist: [],
      rewardlist2:[],
      //已发表著作列表
      worklist: [],
      //纵向项目列表
      verticalslist: [],
      //横向项目列表
      horizontalslist: [],
      //系统时间相关
      dialogTableVisible: false,
      //各项查询结果数目
      papertotal: 0,
      patenttotal: 0,
      worktotal: 0,
      rewardtotal: 0,
      verticalstotal: 0,
      horizontalstotal: 0,

      myArray:[]
    }
  },

  //周期函数
  created() {
    this.getPaperList()
    this.getPatentList()
    this.getRewardList()
    this.getWorkList()
    this.getVerticalsList()
    this.getHorizontalsList()
    this.getReward()
  },

  methods: {
    export2excel(){
      this.paperDownload()
      this.patentDownload()
      this.rewardDownload()
      this.workDownload()
      this.verticalsDownload()
      this.horizontalsDownload()
    },
    async getReward(){
      const { data: res } = await this.$http.get('rewards/list', { params: this.rewardInfo })
      if (res.code !== 200) {
        this.$message.error('获取奖励申报详情列表失败')
      }
      this.rewardlist2 = res.data.records
      //const dictionary={}
      let Length=res.data.records.length
      for(let i=0;i<Length;i++){
        this.myArray[res.data.records[i].id]=res.data.records[i].title
      }
      this.rewardtotal = res.data.total
    },
    //导出论文数据
     async paperDownload() {
       console.log("Keyword: ", this.Keyword)
       const { data: res } = await this.$http.get('papers/member_finish', { params: {name:this.Keyword }})
       if (res.code !== 200) {
         // console.log("res:", res)
         this.$message.error('获取论文列表失败')
       }
       let Length=res.data.length
       for(let i=0;i<Length;i++){
         res.data[i].assign=this.myArray[res.data[i].assign]
       }
       this.paperlist2 = res.data
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['论文题目', '论文类型', '第一作者', '通讯作者', '所有作者（论文署名）', '发表刊物/论文集', '是否Top期刊', '论文收录类别', 'SCI论文中科院分区', '刊物类型',
          '投稿时间', '发表/出版时间', '字数', '卷号', '期号', '页码范围', '是否为译文', 'ISSN号', 'CN号', '入藏号', '关键词', '摘要', '经费资助', '拟分配申报奖励项目','文件路径',
          '备注']
        const filterVal = ['title', 'paperType', 'firstAuthor', 'correspondingAuthor', 'authors', 'journal', 'isTop', 'paperCategory', 'sciPartition', 'publicationType',
          'contributeDate', 'publishDate', 'words', 'volumeNumber', 'issue', 'pageRange', 'isTranslate', 'issnNumber', 'cnNumber', 'collectNumber', 'keywords', 'abstracts', 'funding', 'assign',
          'filepath', 'remark']

        //导出的为论文列表数据
        const list = this.paperlist2
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '已发表论文',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })

        this.downloadLoading = false
      })
    },
    //导出专利数据
    async patentDownload() {
      console.log("Keyword: ", this.Keyword)
      const { data: res } = await this.$http.get('patents/member_finish', { params: {name:this.Keyword }})
      if (res.code !== 200) {
        // console.log("res:", res)
        this.$message.error('获取专利列表失败')
      }
      let Length=res.data.length
      for(let i=0;i<Length;i++){
        res.data[i].assign=this.myArray[res.data[i].assign]
      }
      this.paperlist2 = res.data
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['专利名称', '专利发明（设计）人', '专利类型', '专利状态','公开号','申请日期', '公开日期', '授权日期', '授权号（即专利号）', '学校署名', '申请人', '专利权人', '拟分配申报奖励项目', '附件路径', '备注'
      ]
        const filterVal = ['patentName', 'patentDesigner', 'patentCategory', 'patentStatus', 'publicationNumber', 'applyDate', 'publicationDate', 'authorizationDate', 'authorizationNumber', 'schoolSign', 'applicant', 'patentee', 'assign', 'filepath', 'remark'
        ]

        //导出的为专利列表数据
        const list = this.paperlist2
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '已授权专利',

          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    //导出已获奖数据
    async rewardDownload() {
      console.log("Keyword: ", this.Keyword)
      const { data: res } = await this.$http.get('rewards/member_finish', {  params: {name:this.Keyword } })
      if (res.code !== 200) {
        // console.log("res:", res)
        this.$message.error('获取获奖数据列表失败')
      }
      let Length=res.data.length
      for(let i=0;i<Length;i++){
        res.data[i].assign=this.myArray[res.data[i].assign]
      }
      this.paperlist2 = res.data
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['申报类型', '行业', '拟申报年份', '关键词', '推荐单位', '任务来源', '奖励名称', '第一完成人', '申报题目', '成果名称', '所属单位', '获奖完成人', '获奖人数', '发证机关', '获奖日期', '获奖级别', '获奖等级', '完成单位', '总参加单位数', '单位排名', '奖励批准号', '成果形式', '附件路径', '备注'

        ]
        const filterVal = ['types', 'industry', 'years', 'keywords', 'recommended', 'sources', 'awardName', 'firstAuthor', 'title', 'achievemenName', 'affiliatedUnit', 'awardWinner', 'winnerNumber', 'issuingAuthority', 'awardDate', 'awardLevel', 'awardGrade', 'completionUnit', 'attendNumber', 'unitRank', 'approvalId', 'resultForm', 'filepath', 'remark'

        ]

        //导出的为获奖列表数据
        const list = this.paperlist2
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '已获批奖励',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    //导出著作数据
    async workDownload() {
      console.log("Keyword: ", this.Keyword)
      const { data: res } = await this.$http.get('works/member_finish', {  params: {name:this.Keyword } })
      if (res.code !== 200) {
        // console.log("res:", res)
        this.$message.error('获取著作列表失败')
      }
      let Length=res.data.length
      for(let i=0;i<Length;i++){
        res.data[i].assign=this.myArray[res.data[i].assign]
      }
      this.paperlist2 = res.data
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['著作名称', '第一作者', '参编作者', '出版单位', '出版时间', '出版地', '总字数（万字）', '是否译成外文', 'ISBN号', '出版社级别', '拟分配申报奖励项目', '附件路径', '备注']
        const filterVal = ['workName', 'firstAuthor', 'participateAuthors', 'publisher', 'publishDate', 'publishPlace', 'words', 'isTranfer', 'isbnNumber', 'publisherLevel', 'assign', 'filepath', 'remark'

        ]

        //导出的为著作列表数据
        const list = this.paperlist2
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '已发表著作',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    //导出纵向项目数据
    async verticalsDownload() {
      console.log("Keyword: ", this.Keyword)
      const { data: res } = await this.$http.get('verticals/member', {  params: {name:this.Keyword } })
      if (res.code !== 200) {
        // console.log("res:", res)
        this.$message.error('获取纵向项目列表失败')
      }
      let Length=res.data.length
      for(let i=0;i<Length;i++){
        res.data[i].assign=this.myArray[res.data[i].assign]
      }
      this.paperlist2 = res.data
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['项目名称', '项目编号', '负责人', '项目级别', '项目分类（中文名称）', '项目分类（英文名称）', '立项日期', '开始时间', '计划完成时间', '项目经费', '是否已经结项', '项目成员(其他参研人员)', '挂名单位（中文名称）',
          '挂名单位（英文名称）', '拟分配申报奖励项目（并未注明添加）', '附件路径', '备注']
        const filterVal = ['projectName', 'projectNum', 'leader', 'projectLevel', 'projectClassCn', 'projectClassEn', 'projectDate', 'startDate', 'planendDate', 'projectBudget', 'isFinished', 'projectMember',
          'registeredUnitCn', 'registeredUnitEn', 'assign', 'filepath', 'remark']

        //导出的为纵向项目列表数据
        const list = this.paperlist2
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '纵向项目',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    //导出横向项目数据
    async horizontalsDownload() {
      const { data: res } = await this.$http.get('horizontals/member', {  params: {name:this.Keyword } })
      if (res.code !== 200) {
        // console.log("res:", res)
        this.$message.error('获取横向项目列表失败')
      }
      let Length=res.data.length
      for(let i=0;i<Length;i++){
        res.data[i].assign=this.myArray[res.data[i].assign]
      }
      this.paperlist2 = res.data
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['学科门类', '合同名称', '合同类别', '合同编号', '负责人', '合同成员', '承接单位', '合同状态', '甲方名称', '甲方类别', '甲方地址', '甲方地区', '合同金额', '支付方式', '签订日期', '开始日期',
          '终止日期', '到账经费', '拟分配申报奖励项目', '附件路径', '备注']
        const filterVal = ['category', 'contractName', 'contractCategory', 'contractNumber', 'manager', 'contractMember', 'company', 'contractStatus', 'firstName', 'firstCategory', 'firstAddress', 'firstRegion', 'contractAmount', 'paymentMethod',
          'signDate', 'startDate', 'endDate', 'receiveFunds', 'assign', 'filepath', 'remark']

        //导出的为横向项目列表数据
        const list = this.paperlist2
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '横向项目',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },

    async search() {
      this.paperInfo.keyword = this.Keyword
      this.patentInfo.keyword = this.Keyword
      this.rewardInfo.keyword = this.Keyword
      this.workInfo.keyword = this.Keyword
      this.verticalsInfo.keyword = this.Keyword
      this.horizontalsInfo.keyword = this.Keyword
      this.getPaperList()
      this.getPatentList()
      this.getRewardList()
      this.getWorkList()
      this.getVerticalsList()
      this.getHorizontalsList()
    },
    //获取论文列表
    async getPaperList() {
      const { data: res } = await this.$http.get('papers/finish_list', { params: this.paperInfo })
      if (res.code !== 200) {
        this.$message.error('获取论文列表失败')
      }
      this.paperlist = res.data.records
      this.papertotal = res.data.total
    },

    //获取专利列表
    async getPatentList() {
      const { data: res } = await this.$http.get('patents/finish_list', { params: this.patentInfo })
      //状态码信息n
      if (res.code !== 200) {
        this.$message.error('获取论文列表失败')
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.patentlist = res.data.records
      this.patenttotal = res.data.total
    },

    //获取奖励数据
    async getRewardList() {
      const { data: res } = await this.$http.get('rewards/finish_list', { params: this.rewardInfo })
      //状态码信息
      if (res.code !== 200) {
        this.$message.error('获取奖励申报详情列表失败')
      }
      this.rewardlist = res.data.records
      this.rewardtotal = res.data.total
    },

    //获取著作数据
    async getWorkList() {
      const { data: res } = await this.$http.get('works/finish_list', { params: this.workInfo })
      //状态码信息
      if (res.code !== 200) {
        this.$message.error('获取已发表著作列表失败')
      }
      this.worklist = res.data.records
      this.worktotal = res.data.total
    },
    //获取纵向项目数据
    async getVerticalsList() {
      const { data: res } = await this.$http.get('verticals/list', { params: this.verticalsInfo })
      //状态码信息
      if (res.code !== 200) {
        this.$message.error('获取纵向项目列表失败')
      }
      this.verticalslist = res.data.records
      this.verticalstotal = res.data.total
    },
    //获取横向项目数据
    async getHorizontalsList() {
      const { data: res } = await this.$http.get('horizontals/list', { params: this.horizontalsInfo })
      //状态码信息
      if (res.code !== 200) {
        this.$message.error('获取横向项目列表失败')
      }
      this.horizontalslist = res.data.records
      this.horizontalstotal = res.data.total
    },
    //控制弹窗的开关
    addDialog() {
      this.addDialogVisible = true;
      //调用创建时间函数
      // this.currentTime()
    },


    // 监听修改论文对话框的关闭事件
    editDialogClosed() {
      this.$refs.editPaperFormRef.resetFields()
    },


    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pageNo = newPage
      this.getPaperList()
      this.getPatentList()
      this.getRewardList()
      this.getWorkList()
      this.getVerticalsList()
      this.getHorizontalsList()
    },

  },

  // 销毁定时器
  beforeDestroy() {
    if (this.getDate) {
      //console.log("销毁定时器");
      clearInterval(this.getDate); // 在Vue实例销毁前，清除时间定时器
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/detail.less';
@import '@/assets/css/paper.less';
@import '@/assets/css/elstyle.less';
@import '@/assets/css/analysis.less';
</style>