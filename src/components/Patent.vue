<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专利管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword">
            <el-button slot="append" icon="el-icon-search" @click="getPatentList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="button" type="primary" @click="addDialogVisible = true">+ &nbsp 添加专利</el-button>
        </el-col>
      </el-row>

      <!--专利列表区域-->
      <!-- stripe：列表是否显示条纹 -->
      <el-table :data="patentlist" border stripe :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="专利名称" prop="patentName"></el-table-column>
        <el-table-column label="专利发明（设计）人" prop="patentDesigner"></el-table-column>
        <el-table-column label="专利类型" prop="patentCategory"></el-table-column>
        <el-table-column label="公开时间" prop="publicationDate"></el-table-column>
        <el-table-column label="授权时间" prop="authorizationDate"></el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 详情页按钮 -->
            <el-tooltip effect="dark" content="详情页" placement="top" :enterable="false">
              <el-button type="primary" :class="'iconfont icon-a-huaban1fuben9'" size="mini"
                @click="detailPatent(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-button type="primary" :class="'iconfont icon-a-huaban1fuben10'" size="mini"
              @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" :class="'iconfont icon-a-huaban1fuben11'" size="mini"
              @click="deletePatent(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="queryInfo.pageNo"
        :page-size="queryInfo.pageSize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加专利 -->
    <!-- 需要实现的事件：addPatentForm添加专利数据集合，addPatentRules验证规则，@close关闭事件，实现添加专利功能addPatent -->
    <!-- 重置表单的位置必须有prop属性 -->
    <!-- addDialogVisible控制添加专利弹窗的显示与隐藏 -->
    <el-dialog title="添加专利" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addPatentForm" ref="addPatentFormRef" label-width="auto" :rules="addformRules">
        <el-form-item label="专利名称" prop="patentName">
          <el-input v-model="addPatentForm.patentName" placeholder="请输入专利名称"></el-input>
        </el-form-item>
        <el-form-item label="专利发明（设计）人" prop="patentDesigner">
          <el-input v-model="addPatentForm.patentDesigner" placeholder="请输入专利发明（设计）人"></el-input>
        </el-form-item>
        <div class="addpatentinput">
        <el-form-item label="专利类型" prop="patentCategory">
        <el-select v-model="addPatentForm.patentCategory" clearable placeholder="请选择" >
          <el-option v-for="opt in (patentCategory)" :key="opt" :value="opt"/>
        </el-select>
      </el-form-item >
          <el-form-item label="专利状态" prop="patentStatus">
            <el-input v-model="addPatentForm.patentStatus" placeholder="请输入专利状态"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="公开号" prop="publicationNumber">
          <el-input v-model="addPatentForm.publicationNumber" placeholder="请输入公开号"></el-input>
        </el-form-item>
        <div class="addpatentinput">
          <el-form-item label="申请日期" prop="applyDate">
            <el-date-picker v-model="addPatentForm.applyDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="公开日期" prop="publicationDate">
            <el-date-picker v-model="addPatentForm.publicationDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="addpatentinput">
          <el-form-item label="授权日期" prop="authorizationDate">
            <el-date-picker v-model="addPatentForm.authorizationDate" type="date" value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="授权号（专利号）" prop="authorizationNumber">
            <el-input v-model="addPatentForm.authorizationNumber" placeholder="请输入授权号（专利号）"></el-input>
          </el-form-item>
        </div>
        <div class="addpatentinput">
          <el-form-item label="学校署名" prop="schoolSign">
            <el-input v-model="addPatentForm.schoolSign" placeholder="请输入学校名称"></el-input>
          </el-form-item>
          <el-form-item label="申请人" prop="applicant">
            <el-input v-model="addPatentForm.applicant" placeholder="请输入申请人"></el-input>
          </el-form-item>
        </div>
        <div class="addpatentinput">
          <el-form-item label="专利权人" prop="patentee">
            <el-input v-model="addPatentForm.patentee" placeholder="请输入专利权人"></el-input>
          </el-form-item>
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="addPatentForm.assign" class="m-2" clearable placeholder="请选择">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <div class="addpaperupload">
            <el-upload ref="upload" class="upload-demo" action="#" accept=".docx, .doc, .pdf" :auto-upload="false"
                       :on-change="uploadFile" :show-file-list="false">
              <el-button type="primary" class="uploadbtn">文件上传</el-button>
            </el-upload>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPatent()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 专利详情页 -->
    <el-dialog title="专利详情页" :visible.sync="detailDialogVisible" width="50%">
      <el-form :model="detailPatentForm" ref="detailPatentFormRef" label-width="auto">
        <el-form-item label="专利名称" prop="patentName">
          <el-input v-model="detailPatentForm.patentName" placeholder="无" disabled></el-input>
        </el-form-item>
        <el-form-item label="专利发明（设计）人" prop="patentDesigner">
          <el-input v-model="detailPatentForm.patentDesigner" placeholder="无" disabled></el-input>
        </el-form-item>
        <div class="addpatentinput">
          <el-form-item label="专利类型" prop="patentCategory">
            <el-select v-model="detailPatentForm.patentCategory"  placeholder="无" disabled >
              <el-option v-for="opt in (patentCategory)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item >
          <el-form-item label="专利状态" prop="patentStatus">
            <el-input v-model="detailPatentForm.patentStatus" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <el-form-item label="公开号" prop="publicationNumber">
          <el-input v-model="detailPatentForm.publicationNumber" placeholder="无" disabled></el-input>
        </el-form-item>
        <div class="addpatentinput">
          <el-form-item label="申请日期" prop="applyDate">
            <el-date-picker v-model="detailPatentForm.applyDate" type="date" value-format="yyyy-MM-dd" placeholder="无" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="公开日期" prop="publicationDate">
            <el-date-picker v-model="detailPatentForm.publicationDate" type="date" value-format="yyyy-MM-dd" placeholder="无" disabled>
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="addpatentinput">
          <el-form-item label="授权日期" prop="authorizationDate">
            <el-date-picker v-model="detailPatentForm.authorizationDate" type="date" value-format="yyyy-MM-dd"
                            placeholder="无" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="授权号（专利号）" prop="authorizationNumber">
            <el-input v-model="detailPatentForm.authorizationNumber" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addpatentinput">
          <el-form-item label="学校署名" prop="schoolSign">
            <el-input v-model="detailPatentForm.schoolSign" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="申请人" prop="applicant">
            <el-input v-model="detailPatentForm.applicant" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addpatentinput">
          <el-form-item label="专利权人" prop="patentee">
            <el-input v-model="detailPatentForm.patentee" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="detailPatentForm.assign" class="m-2" placeholder="无" disabled>
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <span>
            <el-button @click="download()" >文件下载</el-button>
          </span>
        </div>
      </el-form>
    </el-dialog>


    <el-dialog title="修改专利" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editPatentForm" ref="editPatentFormRef" label-width="auto" :rules="editformRules">
        <el-form-item label="专利名称" prop="patentName">
          <el-input v-model="editPatentForm.patentName" placeholder="请输入专利名称"></el-input>
        </el-form-item>
        <el-form-item label="专利发明（设计）人" prop="patentDesigner">
          <el-input v-model="editPatentForm.patentDesigner" placeholder="请输入专利发明（设计）人"></el-input>
        </el-form-item>
        <div class="addpatentinput">
          <el-form-item label="专利类型" prop="patentCategory">
            <el-select v-model="editPatentForm.patentCategory" clearable placeholder="请选择" >
              <el-option v-for="opt in (patentCategory)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item >
          <el-form-item label="专利状态" prop="patentStatus">
            <el-input v-model="editPatentForm.patentStatus" placeholder="请输入专利状态"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="公开号" prop="publicationNumber">
          <el-input v-model="editPatentForm.publicationNumber" placeholder="请输入公开号"></el-input>
        </el-form-item>
        <div class="addpatentinput">
          <el-form-item label="申请日期" prop="applyDate">
            <el-date-picker v-model="editPatentForm.applyDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="公开日期" prop="publicationDate">
            <el-date-picker v-model="editPatentForm.publicationDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="addpatentinput">
          <el-form-item label="授权日期" prop="authorizationDate">
            <el-date-picker v-model="editPatentForm.authorizationDate" type="date" value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="授权号（专利号）" prop="authorizationNumber">
            <el-input v-model="editPatentForm.authorizationNumber" placeholder="请输入授权号（专利号）"></el-input>
          </el-form-item>
        </div>
        <div class="addpatentinput">
          <el-form-item label="学校署名" prop="schoolSign">
            <el-input v-model="editPatentForm.schoolSign" placeholder="请输入学校名称"></el-input>
          </el-form-item>
          <el-form-item label="申请人" prop="applicant">
            <el-input v-model="editPatentForm.applicant" placeholder="请输入申请人"></el-input>
          </el-form-item>
        </div>
        <div class="addpatentinput">
          <el-form-item label="专利权人" prop="patentee">
            <el-input v-model="editPatentForm.patentee" placeholder="请输入专利权人"></el-input>
          </el-form-item>
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="editPatentForm.assign" class="m-2" clearable placeholder="请选择">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPatentInfo()">确 定</el-button>
      </span>
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
        pageSize: 12
      },

      idCard: {
        id: ''
      },

      //删除专利
      // deletePatent: {
      //   id: ''
      // },

      //专利列表
      patentlist: [{
        //   {
        //   //id: '',
        //   title: '太空船',
        //   patentNumber: '231',
        //   authors: '张三',
        //   //completeBy: '',
        //   applyTime: '2022-6-30',
        //   publishTime: '2020-6-30',
        //   assign: '1'
        // }
        //模拟数据
        // patent_name: '其他',
        // patent_designer: '张三',
        // patent_category: '1',
        // patent_status: '1',
        // publication_number: '11',
        // apply_date: '1',
        // publication_date: '1',
        // authorization_date: '1',
        // authorization_number: '1',
        // school_sign: '1',
        // applicant: '1',
        // patentee: '1',
        // assign: '1'
      }
      ],

      //专利总数
      total: 5,

      //控制添加专利的显示与隐藏
      addDialogVisible: false,

      //添加专利表单数据
      addPatentForm: {
        patentName:'',
        patentDesigner:'',
        patentCategory:'',
        patentStatus:'',
        publicationNumber:'',
        applyDate:'',
        publicationDate:'',
        authorizationDate:'',
        authorizationNumber:'',
        schoolSign:'',
        applicant:'',
        patentee:'',
        assign:'',
        filepath:'',
        remark:''
      },
      //专利类型
      patentCategory:[
        '国际发明专利','国家发明专利','实用新型专利','外观设计专利'
        ],

      //奖励申报列表--下拉选择
      Rewardlistdetail: [],

      //修改表单校验规则
      editformRules: {
        patentName:valid.required('请输入专利名称'),
        patentDesigner:valid.required('请输入专利发明（设计）人'),
        patentee:valid.required('请输入专利权人'),
        authorizationNumber: valid.required('请输入专利号'),
        //fundings: valid.required_type('请输入基金号', 'number'),
        //assign: valid.required('请输入申报奖励项'),
      },

      //添加表单校验规则
      addformRules: {
        patentName:valid.required('请输入专利名称'),
        patentDesigner:valid.required('请输入专利发明（设计）人'),
        patentee:valid.required('请输入专利权人'),
        authorizationNumber: valid.required('请输入专利号'),
        //fundings: valid.required_type('请输入基金号', 'number'),
        //assign: valid.required('请输入申报奖励项'),
      },

      //修改专利列表
      editPatentForm: {},

      //控制修改专利的显示与隐藏
      editDialogVisible: false,

      //控制专利详情的显示与隐藏
      detailDialogVisible: false,

      //专利详情表单
      detailPatentForm: {

      }

    }
  },

  //周期函数
  created() {
    this.getPatentList()
    this.getRewardList()
  },

  methods: {
    //获取查询列表
    async getPatentList() {
      const { data: res } = await this.$http.get('patents/list', { params: this.queryInfo })
      //console.log(res)
      //状态码信息
      if (res.code !== 200) {
        this.$message.error('获取专利列表失败')
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.patentlist = res.data.records
      //console.log("专利列表" + this.Patentlist)
      this.total = res.data.total
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
        this.addPaperForm.filepath = res.data
      })
    },

    //文件下载
    download() {
      console.log("执行download()")
      let formData = new FormData()
      console.log("this.detailPatentForm.filepath:", this.detailPatentForm.filepath)
      console.log("this.detailPatentForm.patentName:", this.detailPatentForm.patentName)

      let filePath = this.detailPatentForm.filepath
      let fileName = this.detailPatentForm.patentName
      formData.append('filePath', filePath)
      formData.append('fileName', fileName)

      console.log("filePath: ", formData.get('filePath'))
      console.log("fileName: ", formData.get('fileName'))
      if (this.detailPatentForm.filepath == null) {
        this.$message.error("无文件")
      } else {
        this.$http({
          url: '/download',
          method: 'get',
          params: {
            filePath: this.detailPatentForm.filepath, // 替换为实际的值
            fileName: this.detailPatentForm.patentName, // 替换为实际的值
            // filePath: "D:\\java\\papers\\20231109\\20231109155501.pdf", // 替换为实际的值
            // fileName: "20231107111133.pdf"
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
    //获取奖励数据
    async getRewardList() {
      const { data: res } = await this.$http.get('rewards/list', { params: this.queryInfo })
      //console.log(res)
      //状态码信息
      if (res.code !== 200) {
        this.$message.error('获取奖励申报详情列表失败')
      }
      this.Rewardlistdetail = res.data.records
    },

    //弹窗关闭，清空添加专利表单
    addDialogClosed() {
      this.$refs.addPatentFormRef.resetFields()
    },

    //添加专利
    async addPatent() {
      this.$refs.addPatentFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/patents/add', this.addPatentForm)

        if (res.code == 201) {
          this.$message.error('添加专利失败！')
        }

        this.$message.success('添加专利成功！')

        this.addDialogVisible = false

        this.getPatentList()
      })
    },

    //删除专利
    deletePatent(id) {
      console.log(this.row)
      this.$confirm('你确定删除此项吗（该操作不可撤回）',
          '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async ()=>{
        const { data: res } = await this.$http.delete('/patents/delete',{ params: { id: id } })
        if (res.code !== 200) {
          this.$message.error('删除专利失败！')
        }
        if(res.code==200){
          this.$message.success('删除专利成功！')
        }
        this.getPatentList()
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })
      if(this.patentlist.length === 1){
        this.queryInfo.pageNo = this.queryInfo.pageNo===1?1:this.queryInfo.pageNo-1;
      }
      this.getPatentList()
      },
    //显示修改专利弹窗
    async showEditDialog(id) {
      // this.editDialogVisible = true;
      // this.idCard.id = id
      // 根据id从接口接收数据
      const { data: ref } = await this.$http.get('/patents/id', { params: { id: id } })
      // 判断是否接收成功
      if (ref.code !== 200) {
        return this.$message.error('接收修改专利数据失败！')
      }
      // 成功则将数据传输到修改数据表单
      this.editPatentForm = ref.data

      // 显示修改对话框
      this.editDialogVisible = true
    },

    // 监听修改专利对话框的关闭事件
    editDialogClosed() {
      this.$refs.editPatentFormRef.resetFields()
    },

    //修改提交专利:有bug
    editPatentInfo() {
      this.$refs.editPatentFormRef.validate(async valid => {
        if (!valid) return
        //根据接口提交数据给后台
        this.$http.put('/patents/update', this.editPatentForm)
        //重新获取列表数据
        this.getPatentList()
        //关闭对话框
        this.editDialogVisible = false
      })
    },

    //专利详情页
    async detailPatent(id) {
      //this.detailDialogVisible = true
      //根据id从接口接收数据
      const { data: ref } = await this.$http.get('/patents/id', { params: { id: id } })
      //判断是否接收成功
      if (ref.code !== 200) {
        return this.$message.error('接收专利数据失败！')
      }
      //成功则将数据传输到数据表单
      this.detailPatentForm = ref.data

      //显示详情页对话框
      this.detailDialogVisible = true
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pageNo = newPage
      this.getPatentList()
    }
  }
}
</script>
  
<style lang="less" scoped>
@import '@/assets/css/detail.less';
@import '@/assets/css/patent.less';
</style>
  