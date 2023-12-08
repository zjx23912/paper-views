<template>
  <div>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>著作成果信息统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getWorkList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="button" type="primary" @click="addDialog"
            >+ &nbsp;添加著作成果</el-button
          >
        </el-col>
      </el-row>
      <!--著作成果列表区域-->
      <!--著作成果列表区域-->

      <!-- stripe：列表是否显示条纹 -->
      <el-table
        :data="worklist"
        border
        stripe
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="著作名称" prop="workName"></el-table-column>
        <el-table-column label="第一作者" prop="firstAuthor"></el-table-column>
        <el-table-column
          label="参编作者"
          prop="participateAuthors"
        ></el-table-column>
        <el-table-column label="出版单位" prop="publisher"></el-table-column>
        <el-table-column
          label="出版时间"
          prop="publishDate"
          sortable
        ></el-table-column>
        <el-table-column label="出版地" prop="publishPlace"></el-table-column>
        <el-table-column label="总字数" prop="words"></el-table-column>
        <el-table-column
          label="是否译成外文"
          prop="isTranfer"
        ></el-table-column>
        <el-table-column
          label="ISBN号"
          prop="isbnNumber"
          width="160PX"
        ></el-table-column>
        <el-table-column
          label="出版社类别"
          prop="publisherLevel"
        ></el-table-column>
        <!--       -->
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 详情页按钮 -->
            <el-tooltip
              effect="dark"
              content="详情页"
              placement="top"
              :enterable="false"
            >
              <el-button
                :class="'iconfont icon-a-huaban1fuben9'"
                type="primary"
                size="mini"
                @click="detailWork(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              :class="'iconfont icon-a-huaban1fuben10'"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              
            ></el-button>
            <!-- 删除按钮 -->
<!--            <el-popconfirm-->
<!--              confirm-button-text="确定"-->
<!--              cancel-button-text="取消"-->
<!--              icon="el-icon-info"-->
<!--              icon-color="red"-->
<!--              @confirm="deleteWork(scope.row.id)"-->
<!--              title="这个著作成果确定删除吗？"-->
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
             <el-button
              type="danger"
              :class="'iconfont icon-a-huaban1fuben11'"
              size="mini"
              @click="deleteWork(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pageNo"
        :page-size="queryInfo.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加著作成果 -->
  
    <el-dialog title="添加著作" :visible.sync="addDialogVisible" width="50%"  @close="addDialogClosed" >
      <el-form :model="addWorkForm" :rules="addFormRules"  ref="addWorkFormRef"  label-width="auto">
        <el-form-item label="著作名称" prop="workName">
          <el-input v-model="addWorkForm.workName" placeholder="请输入著作名称"></el-input>
        </el-form-item>
       
          <el-form-item label="第一作者" prop="firstAuthor">
            <el-input
              v-model="addWorkForm.firstAuthor"
              placeholder="请输入第一作者"
            ></el-input>
          </el-form-item>
       
        
          <el-form-item label="参编作者" prop="participateAuthors">
            <el-input
              v-model="addWorkForm.participateAuthors"
              placeholder="请输入参编作者,作者之间用';'分隔"
            ></el-input>
          </el-form-item>
        
        <div class="addworkone">
          <el-form-item label="出版单位" prop="publisher">
            <el-input
              v-model="addWorkForm.publisher"
              placeholder="请输入出版单位"
            ></el-input>
          </el-form-item>
          
           <el-form-item label="出版时间" prop="publishDate">
            <el-date-picker
              v-model="addWorkForm.publishDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          
        </div>

          <el-form-item label="出版地" prop="publishPlace">
            <el-select v-model="addWorkForm.publishPlace">
                <el-option v-for="opt in (publishPlace)" :key="opt" :value="opt"></el-option>
            </el-select>
          </el-form-item>

        <div class="addworkone">
          <el-form-item label="出版社级别" prop="publisherLevel">
            <!-- <el-input
              v-model="addWorkForm.publisherLevel"
              placeholder="请输入出版社级别"
              type="number"
            ></el-input> -->
            <el-select v-model="addWorkForm.publisherLevel">
                <el-option v-for="opt in (publisherLevel)" :key="opt" :value="opt"></el-option>
            </el-select>
          </el-form-item>
         
         <el-form-item label="ISBN号" prop="isbnNumber">
            <el-input
              v-model="addWorkForm.isbnNumber"
              placeholder="请输入ISBN号"
            ></el-input>
          </el-form-item>
          
        </div>
      
        <!-- <el-form-item label="登记时间" prop="createTime">
                          <el-input v-model="addPaperForm.createTime" disabled></el-input>
                        </el-form-item> -->
        <div class="addworkone">
         
          <el-form-item label="总字数" prop="words">
            <el-input
              v-model="addWorkForm.words"
              placeholder="请输入总字数"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否译成外文" prop="isTranfer">
          <el-select
            v-model="addWorkForm.isTranfer"
            class="m-2"
            placeholder="请选择"
          >
            <el-option key="是" value="是" />
            <el-option key="否" value="否" />
          </el-select>
        </el-form-item>
       
         
        </div>
          <div>
         <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select
              v-model="addWorkForm.assign"
              class="m-2"
              placeholder="请选择"
            >
              <el-option
                v-for="item in Rewardlistdetail"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <div class="addworkupload">
            <el-upload ref="upload" class="upload-demo" action="#" accept=".docx, .doc, .pdf" :auto-upload="false"
              :on-change="uploadFile" :show-file-list="false">
              <el-button type="primary" class="uploadbtn">文件上传</el-button>
            </el-upload>
          </div>
          </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addWork()">确 定</el-button>
      </span>
    </el-dialog>

 <!-- 著作成果详情页 -->
    <el-dialog
      title="著作成果详情页"
      :visible.sync="detailDialogVisible"
      width="50%"
    >
      <el-form
        :model="detailWorkForm"
        ref="detailWorkFormRef"
        label-width="auto"
      >
        <el-form-item label="著作成果名称" prop="workName">
          <el-input
            v-model="detailWorkForm.workName"
            placeholder="无"
            disabled
          ></el-input>
        </el-form-item>

        <div class="addworkone">
          <el-form-item label="第一作者" prop="firstAuthor">
            <el-input
              v-model="detailWorkForm.firstAuthor"
              placeholder="无"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="参编作者" prop="participateAuthors">
            <el-input
              v-model="detailWorkForm.participateAuthors"
              placeholder="无"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div class="addworkone">
          <el-form-item label="出版单位" prop="publisher">
            <el-input
              v-model="detailWorkForm.publisher"
              placeholder="无"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="出版时间" prop="publishDate">
            <el-input
              v-model="detailWorkForm.publishDate"
              placeholder="无"
              disabled
            ></el-input>
          </el-form-item>
        </div>

        <div class="addworkone">
          <el-form-item label="出版地" prop="publishPlace">
            <el-input
              v-model="detailWorkForm.publishPlace"
              placeholder="无"
              disabled
            >
            </el-input>
          </el-form-item>
          <el-form-item label="总字数" prop="words">
            <el-input
              v-model="detailWorkForm.words"
              placeholder="无"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="ISBN号" prop="isbnNumber">
            <el-input
              v-model="detailWorkForm.isbnNumber"
              placeholder="无"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="出版社级别" prop="publisherLevel">
          <el-input
            v-model="detailWorkForm.publisherLevel"
            placeholder="无"
            disabled
          ></el-input>
        </el-form-item>
        
        <div class="addworkone">
          
           <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="detailWorkForm.assign" class="m-2" placeholder="无" disabled>
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-button @click="download()">文件下载</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 修改著作成果 -->
    <el-dialog
      title="修改著作成果"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editWorkForm"
        ref="editWorkFormRef"
        label-width="auto"
        :rules="editFormRules"
      >
        <el-form-item label="著作名称" prop="workName">
          <el-input
            v-model="editWorkForm.workName"
            placeholder="请输入著作名称"
          ></el-input>
        </el-form-item>
       
          <el-form-item label="第一作者" prop="firstAuthor">
            <el-input
              v-model="editWorkForm.firstAuthor"
              placeholder="请输入第一作者"
            ></el-input>
          </el-form-item>
          <el-form-item label="参编作者" prop="participateAuthors">
            <el-input
              v-model="editWorkForm.participateAuthors"
              placeholder="请选择"
            ></el-input>
          </el-form-item>
       
        <div class="addworkone">
          <el-form-item label="出版单位" prop="publisher">
            <el-input
              v-model="editWorkForm.publisher"
              placeholder="请输入出版单位"
            ></el-input>
          </el-form-item>
          <el-form-item label="出版时间" prop="publishDate">
            <el-input
              v-model="editWorkForm.publishDate"
              placeholder="请输入出版时间"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="出版地" prop="publishPlace">
          <!-- <el-input
            type="textarea"
            v-model="editWorkForm.publishPlace"
          ></el-input> -->
           <el-select v-model="editWorkForm.publishPlace">
                <el-option v-for="opt in (publishPlace)" :key="opt" :value="opt"></el-option>
            </el-select>
        </el-form-item>
        <div class="addworkone">
          <el-form-item label="总字数" prop="words">
            <el-input
              v-model="editWorkForm.words"
              placeholder="请输入总字数"
            ></el-input>
          </el-form-item>

          <el-form-item label="是否译成外文" prop="isTranfer">
            <el-select
              v-model="editWorkForm.isTranfer"
              class="m-2"
              placeholder="请选择"
            >
              <el-option key="是" value="是" />
              <el-option key="否" value="否" />
            </el-select>
          </el-form-item>
        </div>
        <!-- <div class="addpaperupload"></div> -->
        <div class="addworkone">
          <el-form-item label="ISBN号" prop="isbnNumber">
            <el-input
              v-model="editWorkForm.isbnNumber"
              placeholder="请输入ISBN号"
            ></el-input>
          </el-form-item>
          <el-form-item label="出版社级别" prop="publisherLevel">
            <!-- <el-input
              v-model="editWorkForm.publisherLevel"
              placeholder="请输入出版社级别"
            ></el-input> -->
               <el-select v-model="editWorkForm.publisherLevel">
                <el-option v-for="opt in (publisherLevel)" :key="opt" :value="opt"></el-option>
            </el-select>
          </el-form-item>
        </div>
           <div class="addworkone">
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="editWorkForm.assign" class="m-2" placeholder="请选择">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="editWorkForm.assign" class="m-2" clearable placeholder="">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <!-- <el-button @click="download()">文件下载</el-button> -->
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editWorkInfo()">确 定</el-button>
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
        keyword: "",
        // 当前的页数
        pageNo: 1,
        //每页显示条数
        pageSize: 10,
      },

      //著作成果id
      id: "",

      //著作成果列表
      worklist: [
        //模拟数据
      ],

      //奖励申报列表--下拉选择
      Rewardlistdetail: [],

      //修改论文表单
      editWorkForm: {},

      //著作详情页表单
      detailWorkForm: {},

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

      //添加著作成果表单数据
      addWorkForm: {
        assign: "", //拟分配申报奖励项目
        firstAuthor: "", //第一作者
        isTranfer: "否", //是否译成外文
        isbnNumber: "", //ISBN号
        participateAuthors: "", //参编作者
        publishDate: "", //出版时间
        publishPlace: "", //出版地
        publisher: "", //出版单位
        publisherLevel: "", //出版社级别
        remark: "", //备注
        words: 0, //总字数
        workName: "", //著作名称
      },
publishPlace:[
  "国内","国外"
],
 publisherLevel:[
  "一般出版社","30家出版社"
 ],
      //表单校验规则
      addFormRules: {
        workName: valid.required("请输入著作名称"),
        publisher:valid.required("请输入出版单位"),
        publishDate:valid.required("请输入出版时间"),
        //assign: valid.required("请输入拟分配申报奖励项目"),
        firstAuthor: valid.required("请输入第一作者"),
        publishPlace: valid.required("请输入出版地"),
        words: valid.required("请输入总字数"),
      },

      //修改表单校验规则
      editFormRules: {
        workName: valid.required("请输入著作名称"),
        publisher:valid.required("请输入出版单位"),
        publishDate:valid.required("请输入出版时间"),
       // assign: valid.required("请输入拟分配申报奖励项目"),
        firstAuthor: valid.required("请输入第一作者"),
        publishPlace: valid.required("请输入出版地"),
        words: valid.required("请输入总字数"),
      },

      //系统时间相关
      dialogTableVisible: false,
    };
  },

  //周期函数
  created() {
    // this.getPaperList()
    this.getRewardList();
    this.getWorkList();
  },

  methods: {
    //获取查询列表
    async getWorkList() {
      const { data: res } = await this.$http.get("works/list", {
        params: this.queryInfo,
      });
      //console.log(res)
      //状态码信息n
      if (res.code !== 200) {
        this.$message.error("获取著作列表失败");
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      console.log("%cWork.vue line:362 res", "color: #007acc;", res);
      this.worklist = res.data.records;
      //console.log("论文列表" + this.paperlist)

      this.total = res.data.total;

      // console.log("this.worklist");
      // console.log(this.worklist);
    },

    //获取奖励数据
    async getRewardList() {
      //可能有bug
      const { data: res } = await this.$http.get("rewards/list", {
        params: this.queryInfo,
      });
      //console.log(res)
      //状态码信息
      if (res.code !== 200) {
        this.$message.error("获取奖励申报详情列表失败");
      }
      this.Rewardlistdetail = res.data.records;
    },

    //弹窗关闭，清空添加论文表单
    addDialogClosed() {
      this.$refs.addWorkFormRef.resetFields();
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

    //添加著作
    async addWork() {
      this.$refs.addWorkFormRef.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$http.post(
          "/works/add",
          this.addWorkForm
        );

        if (res.code != 200) {
          this.$message.error("添加著作失败！");
        } else {
          this.$message.success("添加著作成功！");
          this.addDialogVisible = false;
          this.getWorkList();
        }
      });
    },

    //文件上传
    uploadFile(item) {
      let formData = new FormData();
      let file = item.raw;
      formData.append("file", file);
      this.$http({
        url: "/upload ", //后端提供的接口
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(({ data: res }) => {
        //接收后端的filepath
        this.addWorkForm.filepath = res.data;
      });
    },

    //文件下载
    // download() {
    //   this.$http
    //     .post(
    //       "/works/download",
    //       {
    //         responseType: "blob",
    //       },
    //       {
    //         headers: {
    //           "Content-Type": "application/json;charset=UTF-8",
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       //console.log(response);
    //       //headers请求头的乱码数据转换为中文
    //       const fileName = decodeURI(
    //         response.headers["content-disposition"].split(";")[1].split("=")[1]
    //       );
    //       //下载文件
    //       let blob = new Blob([response.data]);
    //       let objectUrl = URL.createObjectURL(blob); // 创建URL
    //       const link = document.createElement("a");
    //       link.href = objectUrl;
    //       // link.download = '.xlsx'// 自定义文件名
    //       //这里是获取后台传过来的文件名
    //       link.setAttribute("download", fileName);
    //       link.click(); // 下载文件
    //       URL.revokeObjectURL(objectUrl); // 释放内存
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       alert("下载失败");
    //     });
    // },
// download() {
//       console.log("执行download()")
//       let formData = new FormData()
//       console.log("this.detailWorkForm.filepath:", this.detailWorkForm.filepath)
//       console.log("this.detailWorkForm.title:", this.detailWorkForm.title)

//       let filePath = this.detailWorkForm.filepath
//       let fileName = this.detailWorkForm.title
//       formData.append('filePath', filePath)
//       formData.append('fileName', fileName)

//       console.log("filePath: ", formData.get('filePath'))
//       console.log("fileName: ", formData.get('fileName'))
//       if (this.detailPaperForm.filepath == "") {
//         this.$message.error("无文件")
//       } else {
//         this.$http({
//           url: '/download',
//           method: 'get',
//           params: {
//             filePath: this.detailWorkForm.filepath, // 替换为实际的值
//             fileName: this.detailWorkForm.title, // 替换为实际的值
//             // filePath: "D:\\java\\papers\\20231109\\20231109155501.pdf", // 替换为实际的值
//             // fileName: "20231107111133.pdf"
//           },
//           responseType: 'blob',
//           headers: {
//             "Content-Type": "application/json;charset=UTF-8",
//           }
//         })
//             .then((response) => {
//               console.log("response:", response);
//               console.log("response.headers:", response.headers);
//               //headers请求头的乱码数据转换为中文
//               const fileName = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])
//               console.log("fileName:", fileName);
//               let blob = new Blob([response.data])
//               let objectUrl = URL.createObjectURL(blob) // 创建URL
//               const link = document.createElement('a')
//               link.href = objectUrl
//               // link.download = '.xlsx'// 自定义文件名
//               //这里是获取后台传过来的文件名
//               link.setAttribute("download", fileName)
//               link.click() // 下载文件
//               URL.revokeObjectURL(objectUrl) // 释放内存
//             })
//             .catch((error) => {
//               console.log(error);
//               alert('下载失败')
//             })
//         console.log("执行结束")
//       }
//     },
    //文件下载
    download() {
      console.log("执行download()")
      let formData = new FormData()
      console.log("this.detailWorkForm.filepath:", this.detailWorkForm.filepath)
      console.log("this.detailWorkForm.workName:", this.detailWorkForm.workName)

      let filePath = this.detailWorkForm.filepath
      let fileName = this.detailWorkForm.workName
      formData.append('filePath', filePath)
      formData.append('fileName', fileName)

      console.log("filePath: ", formData.get('filePath'))
      console.log("fileName: ", formData.get('fileName'))
      if (this.detailWorkForm.filepath == null) {
        this.$message.error("无文件")
      } else {
        this.$http({
          url: '/download',
          method: 'get',
          params: {
            filePath: this.detailWorkForm.filepath, // 替换为实际的值
            fileName: this.detailWorkForm.workName, // 替换为实际的值
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
 // download() {
 //      console.log("执行download()")
 //      let formData = new FormData()
 //      console.log("this.detailWorkForm.filepath:", this.detailWorkForm.filepath)
 //      console.log("this.detailWorkForm.workName:", this.detailWorkForm.workName)
 //
 //      let filePath = this.detailWorkForm.filepath
 //      let workName = this.detailWorkForm.workName
 //      formData.append('filePath', filePath)
 //      formData.append('fileName', workName)
 //
 //      console.log("filePath: ", formData.get('filePath'))
 //      console.log("fileName: ", formData.get('workName'))
 //      if (this.detailWorkForm.filepath == null) {
 //        this.$message.error("无文件")
 //      } else {
 //        this.$http({
 //          url: '/download',
 //          method: 'get',
 //          params: {
 //            filePath: this.detailWorkForm.filepath, // 替换为实际的值
 //            fileName: this.detailWorkForm.workName, // 替换为实际的值
 //            // filePath: "D:\\java\\papers\\20231109\\20231109155501.pdf", // 替换为实际的值
 //            // fileName: "20231107111133.pdf"
 //          },
 //          responseType: 'blob',
 //          headers: {
 //            "Content-Type": "application/json;charset=UTF-8",
 //          }
 //        })
 //            .then((response) => {
 //              console.log("response:", response);
 //              console.log("response.headers:", response.headers);
 //              //headers请求头的乱码数据转换为中文
 //              const fileName = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])
 //              console.log("fileName:", fileName);
 //              let blob = new Blob([response.data])
 //              let objectUrl = URL.createObjectURL(blob) // 创建URL
 //              const link = document.createElement('a')
 //              link.href = objectUrl
 //              // link.download = '.xlsx'// 自定义文件名
 //              //这里是获取后台传过来的文件名
 //              link.setAttribute("download", workName)
 //              link.click() // 下载文件
 //              URL.revokeObjectURL(objectUrl) // 释放内存
 //            })
 //            .catch((error) => {
 //              console.log(error);
 //              alert('下载失败')
 //            })
 //        console.log("执行结束")
 //      }
 //    },
    //论文详情页
    async detailWork(id) {
      this.id = id;
      const { data: ref } = await this.$http.get("/works/id", {
        params: { id: id },
      });
      if (ref.code !== 200) {
        return this.$message.error("接收论文数据成功！");
      }

      this.detailWorkForm = ref.data;

      //可能有bug 将assign改为reward.title
      let rewardId = this.detailWorkForm.assign;
      // const { data: ret } = await this.$http.get('/reward/id', { params: { id: rewardId } })
      //console.log(ret)
      //this.detailWorkrForm.assign = ret.data.title

      this.detailDialogVisible = true;
      // console.log(this.id)
    },

  
    // async deleteWork(id) {
    //   console.log(this.row);
    //   const { data: res } = await this.$http.delete("works/delete", {
    //     params: { id: id },
    //   });
    //   if (res.code !== 200) {
    //     this.$message.error("删除著作成果失败！");
    //   }
    //   if (res.code == 200) {
    //     this.$message.success("删除著作成果成功！");
    //   }
    //
    //   if (this.worklist.length === 1) {
    //     this.queryInfo.pageNo =
    //       this.queryInfo.pageNo === 1 ? 1 : this.queryInfo.pageNo - 1;
    //   }
    //   this.getWorkList();
    // },
    //删除著作成果
    async deleteWork(id) {
      this.$confirm('你确定删除此项吗（该操作不可撤回）',
          '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async ()=>{
        const { data: res } = await this.$http.delete(`works/delete`,{ params: { id: id } })
        if (res.code !== 200) {
          this.$message.error('删除著作成果失败！')
        }
        if(res.code==200){
          this.$message.success('删除著作成果成功！')
          if(this.worklist.length === 1){
            this.queryInfo.pageNo =
                this.queryInfo.pageNo===1 ? 1:this.queryInfo.pageNo-1;
          }
        }
        this.getWorkList()
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })

      this.getWorkList()
    },


    //显示修改论文弹窗
    async showEditDialog(id) {
      //this.editDialogVisible = true;
      //根据id从接口接收数据
      const { data: ref } = await this.$http.get("/works/id", {
        params: { id: id },
      });
      //判断是否接收成功
      if (ref.code !== 200) {
        return this.$message.error("接收修改著作数据失败！");
      }
      console.log(ref);
      // debugger
      //成功则将数据传输到修改数据表单
      this.editWorkForm = ref.data;

      console.log(this.editWorkForm);
      // debugger
      //this.editWorkForm.assign = "";
      //将assign改为reward.title
      // let rewardId = this.editPaperForm.
      // const { data: ret } = await this.$http.get('/reward/id', { params: { id: rewardId } })
      // this.editPaperForm.assign = ret.data.title

      //显示修改对话框
      this.editDialogVisible = true;
    },

    // 监听修改论文对话框的关闭事件
    editDialogClosed() {
      this.$refs.editWorkFormRef.resetFields();
      this.getWorkList()
    },

    //修改提交论文:有bug
    async editWorkInfo() {
      this.$refs.editWorkFormRef.validate(async (valid) => {
        if (!valid) return;
        //根据接口提交数据给后台
        await this.$http.put("/works/update", this.editWorkForm);
        // const { data: res } = this.$http.post('/paper/update', this.editPaperForm)
        //判断是否提交成功
        // if (res.data !== 1) {
        //   return res.$message.error('修改论文失败！')
        // }

        //重新获取列表数据
        this.getWorkList();
        //关闭对话框
        this.editDialogVisible = false;
      });
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pageNo = newPage;
      this.getWorkList();
    },
  },

  // 销毁定时器
  beforeDestroy() {
    if (this.getDate) {
      //console.log("销毁定时器");
      clearInterval(this.getDate); // 在Vue实例销毁前，清除时间定时器
    }
  },
};
</script>

<style lang="less" scoped>
@import "@/assets/css/detail.less";
@import "@/assets/css/work.less";
@import "@/assets/css/elstyle.less";
</style>