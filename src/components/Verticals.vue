<template>
    <div>
        <div>
            <!-- 面包屑导航区域 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>纵向项目信息统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword">
            <el-button slot="append" icon="el-icon-search" @click="getVerticalsList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="button" type="primary" @click="addDialog">+ &nbsp;添加纵向项目</el-button>
        </el-col>
      </el-row>

      <!--论文列表区域-->
      <!-- stripe：列表是否显示条纹 -->
      <el-table :data="verticalsList" border stripe :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="项目名称" prop="projectName"></el-table-column>
        <el-table-column label="项目编号" prop="projectNum"></el-table-column>
        <el-table-column label="负责人" prop="leader"></el-table-column>
        <el-table-column label="项目级别" prop="projectLevel"></el-table-column>
        <!-- <el-table-column label="拟分配申题" prop="assign"></el-table-column> -->
        <el-table-column label="项目分类(中文名称)" prop="projectClassCn" sortable></el-table-column>
        <el-table-column label="项目分类（英文名称）" prop="projectClassEn"></el-table-column>
        <el-table-column label="立项日期" prop="projectDate" ></el-table-column>
        <el-table-column label="开始时间" prop="startDate"></el-table-column>
        <el-table-column label="计划完成时间" prop="planendDate" ></el-table-column>
        <el-table-column label="项目经费" prop="projectBudget" ></el-table-column>
        <el-table-column label="是否已经结项" prop="isFinished"></el-table-column>
        <el-table-column label="项目成员" prop="projectMember" ></el-table-column>
<!--         <el-table-column label="拟分配申报奖励项目" prop="assign" ></el-table-column>-->
         <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 详情页按钮 -->
            <el-tooltip effect="dark" content="详情页" placement="top" :enterable="false">
              <el-button :class="'iconfont icon-a-huaban1fuben9'" type="primary" size="mini"
                @click="detailVerticals(scope.row.id)">
              </el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-button type="primary" :class="'iconfont icon-a-huaban1fuben10'" size="mini"
              @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
             <el-button type="danger" :class="'iconfont icon-a-huaban1fuben11'" size="mini"
              @click="deleteVerticals(scope.row.id)"></el-button>
<!--                <el-popconfirm-->
<!--              confirm-button-text="确定"-->
<!--              cancel-button-text="取消"-->
<!--              icon="el-icon-info"-->
<!--              icon-color="red"-->
<!--              @confirm="deleteVerticals(scope.row.id)"-->
<!--              title="这个纵向项目确定删除吗？"-->
<!--            >-->
<!--              &lt;!&ndash; <el-button slot="reference">删除</el-button> &ndash;&gt;-->
<!--              <el-button-->
<!--                type="danger"-->
<!--                :class="'iconfont icon-a-huaban1fuben11'"-->
<!--                size="mini"-->
<!--                slot="reference"-->
<!--                style="margin-left:10px;"-->
<!--              ></el-button>-->
<!--            </el-popconfirm>-->
          </template>
         </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="queryInfo.pageNo"
        :page-size="queryInfo.pageSize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>




    <!-- 添加论文 -->
    <!-- 需要实现的事件：addPaperForm添加论文数据集合，addPaperRules验证规则，@close关闭事件，实现添加论文功能addPatent -->
    <!-- 重置表单的位置必须有prop属性 -->
    <!-- addDialogVisible控制添加论文弹窗的显示与隐藏 -->
    <el-dialog title="添加著作成果" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- <el-form :model="addPaperForm" :rules="addFormRules" ref="addPaperFormRef" label-width="auto"> -->
        <el-form :model="addVerticalsForm" :rules="addFormRules" ref="addVerticalsFormRef" label-width="auto">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="addVerticalsForm.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <div class="addverticalsone">
          <el-form-item label="项目编号" prop="projectNum">
            <el-input v-model="addVerticalsForm.projectNum" placeholder="请输入项目编号"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="addVerticalsForm.leader" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </div>
        <div class="addverticalsone">
          <el-form-item label="项目级别" prop="projectLevel">
            <el-input v-model="addVerticalsForm.projectLevel" placeholder="请输入项目级别"></el-input>
          </el-form-item>
          <el-form-item label="项目经费" prop="projectBudget">
            <el-input v-model="addVerticalsForm.projectBudget" placeholder="请输入项目经费"></el-input>
          </el-form-item>
        </div>
        <div class="addverticalsone">
          <el-form-item label="项目分类(中文)" prop="projectClassCn">
            <el-input v-model="addVerticalsForm.projectClassCn" placeholder="请输入项目分类名称(中文)"></el-input>
          </el-form-item>
           <el-form-item label="项目分类（英文）" prop="projectClassEn">
            <el-input v-model="addVerticalsForm.projectClassEn" placeholder="请输入项目分类名称(英文)"></el-input>
          </el-form-item>
        </div>
         <el-form-item label="项目成员" prop="projectMember">
            <el-input v-model="addVerticalsForm.projectMember" placeholder="请输入项目成员"></el-input>
          </el-form-item>
        <div class="addverticalsone">
          
          <el-form-item label="是否已经结项" prop="isFinished">
            <el-select v-model="addVerticalsForm.isFinished" class="m-2" placeholder="请选择">
                            <el-option key="是"  value="是" />
                            <el-option key="否"  value="否" />
            </el-select>
          </el-form-item>
         <el-form-item label="立项时间" prop="projectDate">
            <el-date-picker v-model="addVerticalsForm.projectDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <!-- <el-form-item label="登记时间" prop="createTime">
          <el-input v-model="addPaperForm.createTime" disabled></el-input>
        </el-form-item> -->
        <div class="addverticalsone">
          
          <el-form-item label="开始时间" prop="startDate">
            <el-date-picker v-model="addVerticalsForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计划完成时间" prop="planedDate">
            <el-date-picker v-model="addVerticalsForm.planedDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
         <div class="addverticalsone">
          
          <!-- <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="addVerticalsForm.assign" class="m-2" placeholder="请选择">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="addVerticalsForm.assign" class="m-2" clearable placeholder="请选择">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
       <div class="addverticalsupload">
            <el-upload ref="upload" class="upload-demo" action="#" accept=".docx, .doc, .pdf" :auto-upload="false"
              :on-change="uploadFile" :show-file-list="false">
              <el-button type="primary" class="uploadbtn">文件上传</el-button>
            </el-upload>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVerticals()">确 定</el-button>
      </span>
    </el-dialog>

<!-- 修改论文 -->
    <el-dialog title="修改纵向项目信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- <el-form :model="editPaperForm" ref="editPaperFormRef" label-width="auto" :rules="editFormRules"> -->
        <el-form :model="editVerticalsForm" ref="editVerticalsFormRef" label-width="auto" :rules="editFormRules">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="editVerticalsForm.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <div class="addverticalsone">
          <el-form-item label="项目编号" prop="projectNum">
            <el-input v-model="editVerticalsForm.projectNum" placeholder="请输入项目编号"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="editVerticalsForm.leader" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </div>
        <div class="addverticalsone">
          <el-form-item label="项目级别" prop="projectLevel">
            <el-input v-model="editVerticalsForm.projectLevel"  placeholder="请输入项目级别"></el-input>
          </el-form-item>
          <el-form-item label="项目经费" prop="projectBudget">
            <el-input v-model="editVerticalsForm.projectBudget" placeholder="请输入项目经费"></el-input>
          </el-form-item>
        </div>
        <div class="addverticalsone">
          <el-form-item label="项目分类（中文名称）" prop="projectClassCn">
            <el-input  v-model="editVerticalsForm.projectClassCn" placeholder="请输入项目分类"></el-input>
          </el-form-item>
          <el-form-item label="项目分类（英文名称）" prop="projectClassEn">
            <el-input v-model="editVerticalsForm.projectClassEn" placeholder="请输入项目分类"></el-input>
          </el-form-item>
        </div>
         <el-form-item label="项目成员" prop="projectMember">
            <el-input v-model="editVerticalsForm.projectMember" placeholder="请输入项目成员"></el-input>
          </el-form-item>
        <div class="addverticalsone">
          <el-form-item label="是否已经结项" prop="isFinished">
            <el-select v-model="editVerticalsForm.isFinished" class="m-2" placeholder="请选择">
                            <el-option key="是"  value="是" />
                            <el-option key="否"  value="否" />
            </el-select>
          </el-form-item>
         <el-form-item label="立项时间" prop="projectDate">
            <el-date-picker v-model="editVerticalsForm.projectDate" type="date" value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <!-- <div class="addpaperupload"></div> -->
        <div class="addpaperinputtwo">
          
           <el-form-item label="开始时间" prop="startDate">
            <el-date-picker v-model="editVerticalsForm.startDate" type="date" value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
           <el-form-item label="计划完成时间" prop="planendDate">
            <el-date-picker v-model="editVerticalsForm.planendDate" type="date" value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        
        </div>
          <!-- <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="editVerticalsForm.assign" class="m-2" placeholder="请选择">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="editVerticalsForm.assign" class="m-2" clearable placeholder="">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <!-- <el-upload ref="upload" class="upload-demo" action="#" accept=".docx, .doc, .pdf" :auto-upload="false"
            :on-change="uploadFile" :show-file-list="false">
            <el-button type="primary" class="uploadbtn">请选择文件</el-button>
          </el-upload> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPaperInfo()">确 定</el-button>
      </span>
    </el-dialog>


    <!-- //论文详情 -->
    <el-dialog title="纵向项目详情页" :visible.sync="detailDialogVisible" width="50%">
      <el-form :model="detailVerticalsForm" ref="detailVerticalsFormRef" label-width="auto">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="detailVerticalsForm.projectName" placeholder="无" disabled></el-input>
        </el-form-item>
        <div class="addverticalsone">
          <el-form-item label="项目编号" prop="projectNum">
            <el-input v-model="detailVerticalsForm.projectNum" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="detailVerticalsForm.leader" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addverticalsone">
          <el-form-item label="项目级别" prop="projectLevel">
            <el-input v-model="detailVerticalsForm.projectLevel" placeholder="无" disabled></el-input>
          </el-form-item>
             <el-form-item label="项目经费" prop="projectBudget">
            <el-input v-model="detailVerticalsForm.projectBudget" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
         <div class="addverticalsone">
          <el-form-item label="项目分类（中文名称）" prop="projectClassCn">
            <el-input v-model="detailVerticalsForm.projectClassCn" placeholder="无" disabled></el-input>
          </el-form-item>
        
        <el-form-item label="项目分类（英文名称）" prop="projectClassEn">
          <el-input v-model="detailVerticalsForm.projectClassEn" placeholder="无" disabled></el-input>
        </el-form-item>
        </div>
        <el-form-item label="项目成员" prop="projectMember">
            <el-input v-model="detailVerticalsForm.projectMember" placeholder="无" disabled></el-input>
          </el-form-item>
        <div class="addverticalsone">
          <el-form-item label="是否已经结项" prop="isFinished">
            <el-input v-model="detailVerticalsForm.isFinished" placeholder="无" disabled></el-input>
          </el-form-item>
         
          <el-form-item label="立项时间" prop="projectDate">
            <el-input v-model="detailVerticalsForm.projectDate" placeholder="无" disabled>
            </el-input>
          </el-form-item>
        </div>
        <div class="addverticalsone">
           <el-form-item label="开始时间" prop="startDate">
            <el-input v-model="detailVerticalsForm.startDate" placeholder="无" disabled>
            </el-input>
          </el-form-item>
           <el-form-item label="计划完成时间" prop="planendDate">
            <el-input v-model="detailVerticalsForm.planendDate" placeholder="无" disabled>
            </el-input>
          </el-form-item>
          
        </div>
        <!-- <el-form-item label="文件路径" prop="filepath">
          <div class="addpaperupload">
            <el-input v-model="detailPaperForm.filepath" placeholder="请选择保存路径" disabled></el-input>
          </div>
        </el-form-item> -->
        <div class="addverticalsone">
          
          <!-- <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-input v-model="detailVerticalsForm.assign" placeholder="请选择" disabled></el-input>
          </el-form-item> -->
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="detailVerticalsForm.assign" class="m-2" placeholder="无" disabled>
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-button @click="download()">文件下载</el-button>
        </div>
      </el-form>
    </el-dialog>
    </div>
</template>



<script>
import valid from '@/common/utils/valid'
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        //模糊查询条件
        keyword: '',
        // 当前的页数
        pageNo: 1,
        //每页显示条数
        pageSize: 10,
      },

      //纵向项目id
      id: '',
        assign: '',//拟分配奖励项目
        isFinished: '',//是否已经结项
        leader: '',//负责人
        planendDate: '',//计划完成时间
        projectBudget: '',//项目经费
        projectClassCn: '',//项目分类（中文名称）
        projectClassEn: '',//项目分类（英文名称）
        projectDate: '',//立项日期
        projectLevel: '',//项目级别
        projectMember: '',//项目成员
        projectName: '',//项目名称
        projectNum: '',//项目编号
        registeredUnitCn: '',//挂名单位（中文名称）
        registeredUnitEn: '',//挂名单位（英文名称）
        remark: '',//备注
        startDate: '',//开始时间
      //论文列表
      verticalsList: [
        //模拟数据
        // {
        //   id: '80',
        //   projectName: '多模态',
        //   projectNum: '1',
        //   leader: '张三',
        //   projectLevel: '一区',
        //   projectClassCn: '1',
        //   projectClassEn: 'one',
        //   projectDate: '2023-11-14',
        //   startDate: '2023-11-14',
        //   planendDate: '2022-10-22',
        //   projectBudget:'100万',
        //   isFinished:'是',
        //   projectMember:'李四',
        //   assign: '1',
        //   remark: ''
        // }
      ],

      //奖励申报列表--下拉选择
      Rewardlistdetail: [],

      //修改论文表单
      editVerticalsForm: {},

      //论文详情页表单
      detailVerticalsForm: {},

      //论文总数
      total: 5,

      //论文id
      //id: '',

      //控制添加论文的显示与隐藏
      addDialogVisible: false,

      //控制论文详情的显示与隐藏
      detailDialogVisible: false,

      //控制论文修改的显示与隐藏
      editDialogVisible: false,

      //添加论文表单数据
      addVerticalsForm: {
         id: '',
          projectName: '',
          projectNum: '',
          leader: '',
          projectLevel: '',
          projectClassCn: '',
          projectClassEn: '',
          projectDate: '',
          startDate: '',
          planendDate: '',
          projectBudget:'',
          isFinsished:'',
          projectMember:'',
          registeredUnitCn:'',
          registeredUnitEn:'',
          assign: '',
          remark: ''
      },

    //   //表单校验规则
      addFormRules: {
        projectName: valid.required('请输入项目名称'),
        projectLevel: valid.required('请输入项目级别'),
        projectBudget: valid.required('请输入项目经费'),
        leader: valid.required('请输入负责人'),
  
        projectDate: valid.required('请输入立项时间'),
        assign: valid.required('请输入拟分配申报奖励项目'),
      },

    //   //修改表单校验规则
      editFormRules: {
        projectName: valid.required('请输入项目名称'),
        projectLevel: valid.required('请输入项目级别'),
        projectBudget: valid.required('请输入项目经费'),
        leader: valid.required('请输入负责人'),
 
        projectDate: valid.required('请输入立项时间'),
        assign: valid.required('请输入拟分配申报奖励项目'),
       },

      //系统时间相关
      dialogTableVisible: false

    }
  },

  //周期函数
  created() {
    this.getVerticalsList()
    this.getRewardList()
  },

  methods: {
    //获取查询列表
    async getVerticalsList() {
      const { data: res } = await this.$http.get('verticals/list', { params: this.queryInfo })
      //console.log(res)
      //状态码信息n
      if (res.code !== 200) {
        this.$message.error('获取论文列表失败')
        const { data: res } = await this.$http.get('verticals/list', { params: this.queryInfo })
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.verticalsList = res.data.records
      //console.log("论文列表" + this.paperlist)

      this.total = res.data.total

    },

    //获取奖励数据
    async getRewardList() {
      //可能有bug
      const { data: res } = await this.$http.get('rewards/list', { params: this.queryInfo })
      //console.log(res)
      //状态码信息
      if (res.code !== 200) {
        this.$message.error('获取奖励申报详情列表失败')
      }
      this.Rewardlistdetail = res.data.records
    },

    //弹窗关闭，清空添加论文表单
    addDialogClosed() {
      this.$refs.addVerticalsFormRef.resetFields()
    },

    //控制弹窗的开关
    addDialog() {
      this.addDialogVisible = true;
      //调用创建时间函数
      // this.currentTime()
    },

    // //创建时间
    // currentTime() {
    //   setInterval(this.getDate, 500);
    // },

    // //时间函数
    // getDate() {
    //   var _this = this;
    //   let yy = new Date().getFullYear();
    //   let mm = new Date().getMonth() + 1;
    //   let dd = new Date().getDate();
    //   let hh = new Date().getHours();
    //   let ms =
    //     new Date().getSeconds() < 10
    //       ? "0" + new Date().getSeconds()
    //       : new Date().getSeconds();
    //   let mf =
    //     new Date().getMinutes() < 10
    //       ? "0" + new Date().getMinutes()
    //       : new Date().getMinutes();

    //   _this.addPaperForm.createTime = yy + "/" + mm + "/" + dd + " " + hh + ":" + mf + ":" + ms;
    // },

    //添加论文
    async addVerticals() {
      this.$refs.addVerticalsFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('/verticals/add', this.addVerticalsForm)

        if (res.code == 201) {
          this.$message.error('添加论文失败！')
        }

        this.$message.success('添加论文成功！')

        this.addDialogVisible = false

        this.getVerticalsList()
      })
    },

    //文件上传
    uploadFile(item) {
      let formData = new FormData()
      let file = item.raw
      formData.append('file', file)
      this.$http({
        url: '/upload ', //后端提供的接口
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(({ data: res }) => {
        //接收后端的filepath
        this.addVerticalsForm.filepath = res.data
      })
    },

    //文件下载
    // download() {
    //   this.$http
    //     .post('/verticals/download',
    //       {
    //         responseType: 'blob',
    //       }, {
    //       headers: {
    //         "Content-Type": "application/json;charset=UTF-8",
    //       },
    //     })
    //     .then((response) => {
    //       //console.log(response);
    //       //headers请求头的乱码数据转换为中文
    //       const fileName = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])
    //       //下载文件
    //       let blob = new Blob([response.data])
    //       let objectUrl = URL.createObjectURL(blob) // 创建URL
    //       const link = document.createElement('a')
    //       link.href = objectUrl
    //       // link.download = '.xlsx'// 自定义文件名
    //       //这里是获取后台传过来的文件名
    //       link.setAttribute("download", fileName)
    //       link.click() // 下载文件
    //       URL.revokeObjectURL(objectUrl) // 释放内存
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       alert('下载失败')
    //     })
    // },
//文件下载
    download() {
      console.log("执行download()")
      let formData = new FormData()
      console.log("this.detailVerticalsForm.filepath:", this.detailVerticalsForm.filepath)
      console.log("this.detailVerticalsForm.projectName:", this.detailVerticalsForm.projectName)

      let filePath = this.detailVerticalsForm.filepath
      let fileName = this.detailVerticalsForm.projectName
      formData.append('filePath', filePath)
      formData.append('fileName', fileName)

      console.log("filePath: ", formData.get('filePath'))
      console.log("fileName: ", formData.get('fileName'))
      if (this.detailVerticalsForm.filepath == null) {
        this.$message.error("无文件")
      } else {
        this.$http({
          url: '/download',
          method: 'get',
          params: {
            filePath: this.detailVerticalsForm.filepath, // 替换为实际的值
            fileName: this.detailVerticalsForm.projectName, // 替换为实际的值
          },
          responseType: 'blob',
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          }
        })
            .then((response) => {
              console.log("response:", response);
              console.log("response.headers:", response.headers);
              //headers请求头的乱码数据转换为中文
              const fileName = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])
              console.log("fileName:", fileName);
              let blob = new Blob([response.data])
              let objectUrl = URL.createObjectURL(blob) // 创建URL
              const link = document.createElement('a')
              link.href = objectUrl
              // link.download = '.xlsx'// 自定义文件名
              //这里是获取后台传过来的文件名
              link.setAttribute("download", fileName)
              link.click() // 下载文件
              URL.revokeObjectURL(objectUrl) // 释放内存
            })
            .catch((error) => {
              console.log(error);
              alert('下载失败')
            })
        console.log("执行结束")
      }
    },

    //纵向项目详情页
    async detailVerticals(id) {
      this.id = id
       const { data: ref } = await this.$http.get('/verticals/id', { params: { id: id } })
       if (ref.code !== 200) {
        return this.$message.error('接收纵向项目数据成功！')
      }

      this.detailVerticalsForm = ref.data

      //可能有bug 将assign改为reward.title
      // let rewardId = this.detailVerticalsForm.assign
      // const { data: ret } = await this.$http.get('/reward/id', { params: { id: rewardId } })
      // console.log(ret)
      //  this.detailVerticalsForm.assign = ret.data.title
      
      this.detailDialogVisible = true
      // console.log(this.id)
    },

    //删除纵向项目
    async deleteVerticals(id) {
      this.$confirm('你确定删除此项吗（该操作不可撤回）',
          '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async ()=>{
        const { data: res } = await this.$http.delete(`verticals/delete`,{ params: { id: id } })
        if (res.code !== 200) {
          this.$message.error('删除纵向项目失败！')
        }
        if(res.code==200){
          this.$message.success('删除纵向项目成功！')
          if(this.verticalsList.length === 1){
            this.queryInfo.pageNo =
                this.queryInfo.pageNo===1 ? 1:this.queryInfo.pageNo-1;
          }
        }
        this.getVerticalsList()
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })

      this.getVerticalsList()
    },

    //显示修改论文弹窗
    async showEditDialog(id) {
      //this.editDialogVisible = true;
      //根据id从接口接收数据
      const { data: ref } = await this.$http.get('/verticals/id', { params: { id: id } })
      //判断是否接收成功
      if (ref.code !== 200) {
        return this.$message.error('接收修改纵向项目数据失败！')
      }
      console.log(ref)
      // debugger
      //成功则将数据传输到修改数据表单
      this.editVerticalsForm = ref.data
      
      console.log(this.editVerticalsForm)
      // debugger
      // this.editVerticalsForm.assign = ''
      //将assign改为reward.title
      // let rewardId = this.editPaperForm.assign
      // const { data: ret } = await this.$http.get('/reward/id', { params: { id: rewardId } })
      // this.editPaperForm.assign = ret.data.title

      //显示修改对话框
      this.editDialogVisible = true
    },


    // 监听修改论文对话框的关闭事件
    editDialogClosed() {
      this.$refs.editVerticalsFormRef.resetFields()
    },

    //修改提交论文:有bug
    async editPaperInfo() {
      this.$refs.editVerticalsFormRef.validate(async valid => {
        if (!valid) return
        //根据接口提交数据给后台
        await this.$http.put('/verticals/update', this.editVerticalsForm)
        // const { data: res } = this.$http.post('/paper/update', this.editPaperForm)
        //判断是否提交成功
        // if (res.data !== 1) {
        //   return res.$message.error('修改论文失败！')
        // }

        //重新获取列表数据
        this.getVerticalsList()
        //关闭对话框
        this.editDialogVisible = false
      })
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pageNo = newPage
      this.getVerticalsList()
    }
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
@import '@/assets/css/verticals.less';
@import '@/assets/css/elstyle.less';
</style>