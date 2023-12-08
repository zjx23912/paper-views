<template>
    <div>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>参研人员</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword">
            <el-button slot="append" icon="el-icon-search" @click="getMembersList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="button" type="primary" @click="addDialog">+ &nbsp;添加参研人员</el-button>
        </el-col>
      </el-row>

      <!--论文列表区域-->
      <!-- stripe：列表是否显示条纹 -->
      <el-table :data="memberslist" border stripe :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="单位中文名称" prop="unitCn"></el-table-column>
        <el-table-column label="单位英文名称" prop="unitEn"></el-table-column>
       
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 详情页按钮 -->
            <el-tooltip effect="dark" content="详情页" placement="top" :enterable="false">
              <el-button :class="'iconfont icon-a-huaban1fuben9'" type="primary" size="mini"
                @click="detailMembers(scope.row.id)">
              </el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-button type="primary" :class="'iconfont icon-a-huaban1fuben10'" size="mini"
              @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" :class="'iconfont icon-a-huaban1fuben11'" size="mini"
              @click="deleteMembers(scope.row.id)"></el-button>
<!--              <el-popconfirm-->
<!--              confirm-button-text="确定"-->
<!--              cancel-button-text="取消"-->
<!--              icon="el-icon-info"-->
<!--              icon-color="red"-->
<!--              @confirm="deleteMembers(scope.row.id)"-->
<!--              title="这个参研人员确定删除吗？"-->
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
       <el-dialog title="添加参研人员" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addMembersForm" :rules="addFormRules" ref="addMembersFormRef" label-width="auto">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addMembersForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <div class="addpaperone">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addMembersForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="单位中文名称" prop="unitCn">
            <el-input v-model="addMembersForm.unitCn" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="单位英文名称" prop="unitEn">
            <el-input v-model="addMembersForm.unitEn" placeholder="请输入名称"></el-input>
          </el-form-item>
        </div>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMembers()">确 定</el-button>
      </span>
        
        </el-dialog>

        
    <el-dialog title="参研人员详情" :visible.sync="detailDialogVisible" width="50%">
      <el-form :model="detailMembersForm" ref="detailMembersFormRef" label-width="auto">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="detailMembersForm.name" placeholder="无" disabled></el-input>
        </el-form-item>
        <div class="addpaperone">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="detailMembersForm.email" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
         <div class="addpaperone">
          <el-form-item label="单位中文名称" prop="unitCn">
            <el-input v-model="detailMembersForm.unitCn" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="单位英文名称" prop="unitEn">
            <el-input v-model="detailMembersForm.unitEn" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
      
      </el-form>
    </el-dialog>


     <!-- 修改论文 -->
    <el-dialog title="修改参研人员" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editMembersForm" ref="editMembersFormRef" label-width="auto" :rules="editFormRules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editMembersForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <div class="addpaperone">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editMembersForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="单位中文名称" prop="unitCn">
            <el-input v-model="editMembersForm.unitCn" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="单位英文名称" prop="unitEn">
            <el-input v-model="editMembersForm.unitEn" placeholder="请输入名称"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMembersInfo()">确 定</el-button>
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
        pageSize: 10,
      },

      //论文id
      id: '',

      //论文列表
      memberslist: [
       // 模拟数据
        // {
        //   id: '10',
        //  name: '111',
        // email: '222',
        // unitCn: '333',
        // unitEn: '444'
        // }
      ],

      //奖励申报列表--下拉选择
      Rewardlistdetail: [],

      //修改论文表单
      editMembersForm: {},

      //论文详情页表单
      detailMembersForm: {},

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
      addMembersForm: {
        id:'',
        name: '',
        email:'',
        unitCn: '',
        unitEn: '',
       
      },

      //表单校验规则
      addFormRules: {
        name: valid.required('请输入姓名'),
        email: valid.required('请输入email'),
      },

      //修改表单校验规则
      editFormRules: {
       name: valid.required('请输入姓名'),
        email: valid.required('请输入email'),
      },

      //系统时间相关
      dialogTableVisible: false

    }
  },

  //周期函数
  created() {
    this.getMembersList()
    this.getRewardList()
  },

  methods: {
    //获取查询列表
    async getMembersList() {
      const { data: res } = await this.$http.get('members/list', { params: this.queryInfo })
      //console.log(res)
     // 状态码信息n
      if (res.code !== 200) {
        this.$message.error('获取成员列表失败')
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.memberslist = res.data.records
      //console.log("论文列表" + this.paperlist)

      this.total = res.data.total

      console.log('this.memberslist')
      console.log(this.memberslist)
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
      this.$refs.addMembersFormRef.resetFields()
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
    async addMembers() {
      this.$refs.addMembersFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('/members/add', this.addMembersForm)

        if (res.code == 201) {
          this.$message.error('添加论文失败！')
        }

        this.$message.success('添加论文成功！')

        this.addDialogVisible = false

        this.getMembersList()
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
        this.addMembersForm.filepath = res.data
      })
    },

    //文件下载
    download() {
      this.$http
        .post('/paper/download',
          {
            responseType: 'blob',
          }, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
        .then((response) => {
          //console.log(response);
          //headers请求头的乱码数据转换为中文
          const fileName = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])
          //下载文件
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
    },


    //成员详情页
    async detailMembers(id) {
      this.id = id
      const { data: ref } = await this.$http.get('/members/id', { params: { id: id } })
      if (ref.code !== 200) {
        return this.$message.error('接收成员数据成功！')
      }

      this.detailMembersForm = ref.data

      //可能有bug 将assign改为reward.title
      // let rewardId = this.detailMembersForm.assign
      // const { data: ret } = await this.$http.get('/reward/id', { params: { id: rewardId } })
      //console.log(ret)
      // this.detailMembersForm.assign = ret.data.title

      this.detailDialogVisible = true
      // console.log(this.id)
    },



    // async deleteMembers(id) {
    //   console.log(this.row);
    //   const { data: res } = await this.$http.delete("members/delete", {
    //     params: { id: id },
    //   });
    //   if (res.code !== 200) {
    //     this.$message.error("删除参研人员失败！");
    //   }
    //   if (res.code == 200) {
    //     this.$message.success("删除参研人员成功！");
    //   }
    //
    //   if (this.memberslist.length === 1) {
    //     this.queryInfo.pageNo =
    //       this.queryInfo.pageNo === 1 ? 1 : this.queryInfo.pageNo - 1;
    //   }
    //   this.getMembersList();
    // },
    //删除参研人员
    async deleteMembers(id) {
      this.$confirm('你确定删除此项吗（该操作不可撤回）',
          '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async ()=>{
        const { data: res } = await this.$http.delete(`members/delete`,{ params: { id: id } })
        if (res.code !== 200) {
          this.$message.error('删除参研人员失败！')
        }
        if(res.code==200){
          this.$message.success('删除参研人员失败！')
          if(this.memberslist.length === 1){
            this.queryInfo.pageNo =
                this.queryInfo.pageNo===1 ? 1:this.queryInfo.pageNo-1;
          }
        }
        this.getMembersList()
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })

      this.getMembersList()
    },

//         deleteMembers(id) {
//       console.log(this.row)
//       this.$confirm('你确定删除此项吗（该操作不可撤回）',
//       '提示',{
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning'
//       }).then(async ()=>{
//       const { data: res } = await this.$http.delete('members/delete',{ params: { id: id } })
//       if (res.code !== 200) {
//       this.$message.error('删除参研人员失败！')
//       }
//       if(res.code==200){
//       this.$message.success('删除参研人员成功！')
//       }
//       this.getMembersList()
//       }).catch(()=>{
//       this.$message({
//       type:'info',
//       message:'已取消删除'
//       })
//       })
//  if(this.memberslist.length === 1){
//         this.queryInfo.pageNo = this.queryInfo.pageNo===1?1:this.queryInfo.pageNo-1;
//       }
//       this.getMembersList()
//       },
    //删除论文
    //  deleteMembers(id) {
    //   const { data: res } = await this.$http.delete('members/delete/?id=' + id)

    //   if (res.code !== 200) {
    //     this.$message.error('删除成员失败！')
    //   }

    //   this.$message.success('删除成员成功！')

    //   this.getMembersList()
    // },

    //显示修改论文弹窗
    async showEditDialog(id) {
      //this.editDialogVisible = true;
      //根据id从接口接收数据
      const { data: ref } = await this.$http.get('/members/id', { params: { id: id } })
    //   //判断是否接收成功
      if (ref.code !== 200) {
        return this.$message.error('接收修改论文数据失败！')
      }
    //   //成功则将数据传输到修改数据表单
      this.editMembersForm = ref.data
      // this.editMembersForm.assign = ''
    //   //将assign改为reward.title
      // let rewardId = this.editPaperForm.assign
      // const { data: ret } = await this.$http.get('/reward/id', { params: { id: rewardId } })
      // this.editPaperForm.assign = ret.data.title

      //显示修改对话框
      this.editDialogVisible = true
    },

    // 监听修改论文对话框的关闭事件
    editDialogClosed() {
      this.$refs.editMembersFormRef.resetFields()
    },

    //修改提交论文:有bug
    async editMembersInfo() {
      this.$refs.editMembersFormRef.validate(async valid => {
        if (!valid) return
        //根据接口提交数据给后台
       await this.$http.put('/members/update', this.editMembersForm)
        // const { data: res } = this.$http.post('/paper/update', this.editPaperForm)
        //判断是否提交成功
        // if (res.data !== 1) {
        //   return res.$message.error('修改论文失败！')
        // }

        //重新获取列表数据
        this.getMembersList()
        //关闭对话框
        this.editDialogVisible = false
      })
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pageNo = newPage
      this.getMembersList()
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
@import '@/assets/css/members.less';
@import '@/assets/css/elstyle.less';
</style>