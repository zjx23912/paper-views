<template>
  <div>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>论文管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword">
            <el-button slot="append" icon="el-icon-search" @click="getPaperList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="button" type="primary" @click="addDialog">+ &nbsp 添加论文</el-button>
        </el-col>
      </el-row>

      <!--论文列表区域-->
      <!-- stripe：列表是否显示条纹 -->
      <el-table :data="paperlist" border stripe :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="论文题目" prop="title"></el-table-column>
        <el-table-column label="作者" prop="authors"></el-table-column>
        <el-table-column label="关键词" prop="keywords"></el-table-column>
        <el-table-column label="经费资助" prop="funding"></el-table-column>
        <!--<el-table-column label="拟分配申题" prop="assign"></el-table-column>-->
        <el-table-column label="是否已发表" prop="publishDate" >
          <template slot-scope="scope">
            <span v-show="scope.row.publishDate==null"> </span>
            <span v-show="scope.row.publishDate!=null">  <i class="el-icon-success"></i> </span>
          </template>
        </el-table-column>
        <el-table-column label="是否已用于奖励申报" prop="assign">
          <template slot-scope="scope">
            <span v-show="scope.row.assign==null"> </span>
            <span v-show="scope.row.assign!=null">  <i class="el-icon-success"></i> </span>
          </template>
        </el-table-column>
        <el-table-column label="发表时间" prop="publishDate"  sortable></el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 详情页按钮 -->
            <el-tooltip effect="dark" content="详情页" placement="top" :enterable="false">
              <el-button :class="'iconfont icon-a-huaban1fuben9'" type="primary" size="mini"
                @click="detailPaper(scope.row.id)">
              </el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-button type="primary" :class="'iconfont icon-a-huaban1fuben10'" size="mini"
              @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" :class="'iconfont icon-a-huaban1fuben11'" size="mini"
                       @click="deletePaper(scope.row.id)"></el-button>
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
    <el-dialog title="添加论文" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addPaperForm" :rules="addFormRules" ref="addPaperFormRef" label-width="auto">
        <div class="addpaperone">
        <el-form-item label="论文类型" prop="paperType">
          <el-select v-model="addPaperForm.paperType" clearable  placeholder="请选择">
            <el-option  v-for="opt in (paperType)" :key="opt" :value="opt" />
            </el-select>
        </el-form-item>
        <el-form-item label="发表刊物/论文集" prop="journal">
          <el-input v-model="addPaperForm.journal" placeholder="请输入刊物/论文集名称"></el-input>
        </el-form-item>
        </div>
        <div>
          <el-form-item label="论文题目" prop="title">
            <el-input v-model="addPaperForm.title" placeholder="请输入论文题目"></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="关键词" prop="keywords">
            <el-input v-model="addPaperForm.keywords" placeholder="请输入关键词"></el-input>
          </el-form-item>
          <el-form-item label="第一作者" prop="firstAuthor">
            <el-input v-model="addPaperForm.firstAuthor" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="通讯作者" prop="correspondingAuthor">
            <el-input v-model="addPaperForm.correspondingAuthor" placeholder="请输入通讯作者"></el-input>
          </el-form-item>
          <el-form-item label="所有作者" prop="authors">
            <el-input v-model="addPaperForm.authors" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="摘要" prop="abstracts">
          <el-input type="textarea" v-model="addPaperForm.abstracts" :rows="2"></el-input>
        </el-form-item>
        <div class="addpaperone">
          <el-form-item label="是否Top期刊" prop="isTop">
              <el-select v-model="addPaperForm.isTop" clearable placeholder="请选择">
                <el-option  v-for="opt in (isTop)" :key="opt" :value="opt" />
              </el-select>
          </el-form-item>
          <el-form-item label="论文收录类别" prop="paperCategory">
            <el-select v-model="addPaperForm.paperCategory" clearable placeholder="请选择">
              <el-option  v-for="opt in (paperCategory)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="SCI论文中科院分区" prop="sciPartition">
            <el-select v-model="addPaperForm.sciPartition" clearable placeholder="请选择">
              <el-option  v-for="opt in (sciPartition)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
          <el-form-item label="刊物类型" prop="publicationType">
            <el-select v-model="addPaperForm.publicationType" clearable placeholder="请选择">
              <el-option  v-for="opt in (publicationType)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="投稿时间" prop="contributeDate">
            <el-date-picker v-model="addPaperForm.contributeDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发表/出版时间" prop="publishDate">
            <el-date-picker v-model="addPaperForm.publishDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="字数" prop="words">
            <el-input v-model="addPaperForm.words" placeholder="请输入字数"></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="卷号" prop="volumeNumber">
            <el-input v-model="addPaperForm.volumeNumber" placeholder="请输入卷号"></el-input>
          </el-form-item>
          <el-form-item label="期号" prop="issue">
            <el-input v-model="addPaperForm.issue" placeholder="请输入期号"></el-input>
          </el-form-item>
          <el-form-item label="页码范围" prop="pageRange">
            <el-input v-model="addPaperForm.pageRange" placeholder="请输入页码范围"></el-input>
          </el-form-item>
        </div>
        <!-- <el-form-item label="登记时间" prop="createTime">
          <el-input v-model="addPaperForm.createTime" disabled></el-input>
        </el-form-item> -->
        <div class="addpaperone">
          <el-form-item label="是否为译文" prop="isTranslate">
            <el-select v-model="addPaperForm.isTranslate" clearable placeholder="请选择">
              <el-option  v-for="opt in (isTranslate)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item>
          <el-form-item label="ISSN号" prop="issnNumber">
            <el-input v-model="addPaperForm.issnNumber" placeholder="请输入ISSN号"></el-input>
          </el-form-item>

        </div>
        <div class="addpaperone">
          <el-form-item label="CN号" prop="cnNumber">
            <el-input v-model="addPaperForm.cnNumber" placeholder="请输入CN号"></el-input>
          </el-form-item>
          <el-form-item label="入藏号" prop="collectNumber">
          <el-input v-model="addPaperForm.collectNumber" placeholder="请输入入藏号"></el-input>
        </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="经费资助" prop="funding">
            <el-input v-model="addPaperForm.funding" placeholder="请输入经费资助"></el-input>
          </el-form-item>
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="addPaperForm.assign" class="m-2" clearable placeholder="请选择">
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
        <el-button type="primary" @click="addPaper()">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="论文详情页" :visible.sync="detailDialogVisible" width="50%">
      <el-form :model="detailPaperForm" ref="detailPaperFormRef" label-width="auto">
        <div class="addpaperone">
          <el-form-item label="论文类型" prop="PaperType">
            <el-select v-model="detailPaperForm.paperType" placeholder="无"  disabled>
              <el-option v-for="opt in (paperType)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
          <el-form-item label="发表刊物/论文集" prop="journal">
            <el-input type="text" placeholder="detailPaperForm.journal"  disabled></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="论文题目" prop="title">
            <el-input type="text" placeholder="detailPaperForm.title"  disabled></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="关键词" prop="keywords">
            <el-input type="text" placeholder="detailPaperForm.keywords" disabled></el-input>
          </el-form-item>
          <el-form-item label="第一作者" prop="firstAuthor">
            <el-input type="text" placeholder="detailPaperForm.firstAuthor" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="通讯作者" prop="correspondingAuthor">
            <el-input type="text" placeholder="detailPaperForm.correspondingAuthor" disabled></el-input>
          </el-form-item>
          <el-form-item label="所有作者" prop="authors">
            <el-input type="text" placeholder="detailPaperForm.authors" disabled></el-input>
          </el-form-item>
        </div>
        <el-form-item label="摘要" prop="abstracts">
          <el-input type="text" placeholder="detailPaperForm.abstracts" :rows="2"  disabled></el-input>
        </el-form-item>
        <div class="addpaperone">
          <el-form-item label="是否Top期刊" prop="isTop">
            <el-select v-model="detailPaperForm.isTop"  placeholder="无" disabled>
              <el-option v-for="opt in (isTop)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item>
          <el-form-item label="论文收录类别" prop="paperCategory">
            <el-select v-model="detailPaperForm.paperCategory"  pplaceholder="无" disabled>
              <el-option v-for="opt in (paperCategory)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="SCI论文中科院分区" prop="sciPartition">
            <el-select v-model="detailPaperForm.sciPartition"  placeholder="无" disabled>
              <el-option v-for="opt in (sciPartition)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
          <el-form-item label="刊物类型" prop="publicationType">
            <el-select v-model="detailPaperForm.publicationType"  placeholder="无" disabled>
              <el-option v-for="opt in (publicationType)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="投稿时间" prop="contributeDate">
            <el-date-picker v-model="detailPaperForm.contributeDate" type="date" value-format="yyyy-MM-dd" placeholder="无" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发表/出版时间" prop="publishDate">
            <el-date-picker v-model="detailPaperForm.publishDate" type="date" value-format="yyyy-MM-dd" placeholder="无" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="字数" prop="words">
            <el-input v-model="detailPaperForm.words" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="卷号" prop="volumeNumber">
            <el-input v-model="detailPaperForm.volumeNumber" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="期号" prop="issue">
            <el-input v-model="detailPaperForm.issue" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="页码范围" prop="pageRange">
            <el-input v-model="detailPaperForm.pageRange" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <!-- <el-form-item label="登记时间" prop="createTime">
          <el-input v-model="addPaperForm.createTime" disabled></el-input>
        </el-form-item> -->
        <div class="addpaperone">
          <el-form-item label="是否为译文" prop="isTranslate">
            <el-select v-model="detailPaperForm.isTranslate"  placeholder="无" disabled>
              <el-option v-for="opt in (isTranslate)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
          <el-form-item label="ISSN号" prop="issnNumber">
            <el-input v-model="detailPaperForm.issnNumber" placeholder="无" disabled></el-input>
          </el-form-item>

        </div>
        <div class="addpaperone">
          <el-form-item label="CN号" prop="cnNumber">
            <el-input v-model="detailPaperForm.cnNumber" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="入藏号" prop="collectNumber">
            <el-input v-model="detailPaperForm.collectNumber" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addpaperinputtwo">
          <el-form-item label="经费资助" prop="funding">
            <el-input v-model="detailPaperForm.funding" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="detailPaperForm.assign" class="m-2" placeholder="无" disabled>
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <span>
            <el-button @click="download()">文件下载</el-button>
          </span>

  </div>
  </el-form>
  </el-dialog>



    <el-dialog title="修改论文" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editPaperForm" ref="editPaperFormRef" label-width="auto" :rules="editFormRules">
        <div class="addpaperone">
          <el-form-item label="论文类型" prop="paperType">
            <el-select v-model="editPaperForm.paperType" clearable placeholder="请选择">
              <el-option v-for="opt in (paperType)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item>
          <el-form-item label="发表刊物/论文集" prop="journal">
            <el-input v-model="editPaperForm.journal" placeholder="请输入刊物/论文集名称"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="论文题目" prop="title">
            <el-input v-model="editPaperForm.title" placeholder="请输入论文题目"></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="关键词" prop="keywords">
            <el-input v-model="editPaperForm.keywords" placeholder="请输入关键词"></el-input>
          </el-form-item>
          <el-form-item label="第一作者" prop="firstAuthor">
            <el-input v-model="editPaperForm.firstAuthor" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="通讯作者" prop="correspondingAuthor">
            <el-input v-model="editPaperForm.correspondingAuthor" placeholder="请输入通讯作者"></el-input>
          </el-form-item>
          <el-form-item label="所有作者" prop="authors">
            <el-input v-model="editPaperForm.authors" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="摘要" prop="abstracts">
          <el-input type="textarea" v-model="editPaperForm.abstracts" :rows="2"></el-input>
        </el-form-item>
        <div class="addpaperone">
          <el-form-item label="是否Top期刊" prop="isTop">
            <el-select v-model="editPaperForm.isTop" clearable placeholder="请选择">
              <el-option v-for="opt in (isTop)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
          <el-form-item label="论文收录类别" prop="paperCategory">
            <el-select v-model="editPaperForm.paperCategory" clearable placeholder="请选择">
              <el-option v-for="opt in (paperCategory)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="SCI论文中科院分区" prop="sciPartition">
            <el-select v-model="editPaperForm.sciPartition" clearable placeholder="请选择">
              <el-option v-for="opt in (sciPartition)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
          <el-form-item label="刊物类型" prop="publicationType">
            <el-select v-model="editPaperForm.publicationType" clearable placeholder="请选择">
              <el-option v-for="opt in (publicationType)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="投稿时间" prop="contributeDate">
            <el-date-picker v-model="editPaperForm.contributeDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发表/出版时间" prop="publishDate">
            <el-date-picker v-model="editPaperForm.publishDate" @change="pickerChange()" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="字数" prop="words">
            <el-input v-model="editPaperForm.words" placeholder="请输入字数"></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="卷号" prop="volumeNumber">
            <el-input v-model="editPaperForm.volumeNumber" placeholder="请输入卷号"></el-input>
          </el-form-item>
          <el-form-item label="期号" prop="issue">
            <el-input v-model="editPaperForm.issue" placeholder="请输入期号"></el-input>
          </el-form-item>
          <el-form-item label="页码范围" prop="pageRange">
            <el-input v-model="editPaperForm.pageRange" placeholder="请输入页码范围"></el-input>
          </el-form-item>
        </div>
        <!-- <el-form-item label="登记时间" prop="createTime">
          <el-input v-model="addPaperForm.createTime" disabled></el-input>
        </el-form-item> -->
        <div class="addpaperone">
          <el-form-item label="是否为译文" prop="isTranslate">
            <el-select v-model="editPaperForm.isTranslate" clearable placeholder="请选择">
              <el-option v-for="opt in (isTranslate)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item>
          <el-form-item label="ISSN号" prop="issnNumber">
            <el-input v-model="editPaperForm.issnNumber" placeholder="请输入ISSN号"></el-input>
          </el-form-item>

        </div>
        <div class="addpaperone">
          <el-form-item label="CN号" prop="cnNumber">
            <el-input v-model="editPaperForm.cnNumber" placeholder="请输入CN号"></el-input>
          </el-form-item>
          <el-form-item label="入藏号" prop="collectNumber">
            <el-input v-model="editPaperForm.collectNumber" placeholder="请输入入藏号"></el-input>
          </el-form-item>
        </div>
        <div class="addpaperone">
          <el-form-item label="经费资助" prop="funding">
            <el-input v-model="editPaperForm.funding" placeholder="请输入经费资助"></el-input>
          </el-form-item>
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="editPaperForm.assign" class="m-2" clearable placeholder="">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPaperInfo()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import valid from '@/common/utils/valid';

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
      paperlist: [
        //模拟数据
        {
          // id: '10',
          // paper_type:'期刊论文',
          // title: '计算机',
          // keywords: 'gis',
          // abstracts: '遥感',
          // authors: '张三',
          // funding: '09821',
          // completeBy: '',
          // journal: '测绘学报',
          // createTime: '',
          // publishTime: '2022-10-22',
          // assign: '1',
          // filepath: ''
        }
      ],
      //论文类型
      paperType:[
        '期刊论文', '论文集'
      ],
      //是否Top期刊
      isTop:[
          '是', '否'
      ],
      //论文收录类别
      paperCategory:[
          '无','SCI','EI期刊收录','CSCD','EI会议检索'
       ],
      //SCI论文中科院分区
      sciPartition:[
          '无','一区','二区','三区','四区'
        ],
      //刊物类型
      publicationType:[
          'A类期刊','B类期刊','C类期刊','中文核心','国际A类学术会议论文','一般CN','其它类型'
     ],
      //是否为译文
      isTranslate:[
          '是','否'
        ],


      //奖励申报列表--下拉选择
      Rewardlistdetail: [],

      //修改论文表单
      editPaperForm: {
        assign2:'',
      },

      //论文详情页表单
      detailPaperForm: {},

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
      addPaperForm: {
        title:'',
        paperType:'',
        firstAuthor:'',
        correspondingAuthor:'',
        authors:'',
        journal:'',
        isTop:'',
        paperCategory:'',
        sciPartition:'',
        publicationType:'',
        contributeDate:'',
        publishDate:'',
        words:'',
        volumeNumber:'',
        issue:'',
        pageRange:'',
        isTranslate:'',
        issnNumber:'',
        cnNumber:'',
        collectNumber:'',
        keywords:'',
        abstracts:'',
        funding:'',
        assign:'',
        filepath:'',
        remark:''

      },

      //表单校验规则
      addFormRules: {
        title: valid.required('请输入论文题目'),
        keywords: valid.required('请输入关键词'),
        authors: valid.required('请输入作者'),
        //fundings: valid.required_type('请输入基金号', 'number'),
        //journal: valid.required('请输入刊物/论文集名称'),
        abstracts: valid.required('请输入摘要'),
        firstAuthor:valid.required('请输入第一作者'),
        correspondingAuthor:valid.required('请输入通讯作者'),
        //publish_date: valid.required('请输入发表/出版时间'),
        //assign: valid.required('请输入申报奖励项'),
      },

      //修改表单校验规则
      editFormRules: {
        title: valid.required('请输入论文题目'),
        keywords: valid.required('请输入关键词'),
        authors: valid.required('请输入作者'),
        //fundings: valid.required_type('请输入基金号', 'number'),
        //journal: valid.required('请输入刊物/论文集名称'),
        abstracts: valid.required('请输入摘要'),
        firstAuthor:valid.required('请输入第一作者'),
        correspondingAuthor:valid.required('请输入通讯作者'),
        //publish_date: valid.required('请输入发表/出版时间'),
        //assign: valid.required('请输入申报奖励项'),
      },

      //系统时间相关
      dialogTableVisible: false

    }
  },

  //周期函数
  created() {
    this.getPaperList()
    this.getRewardList()
  },

  methods: {

    pickerChange(){
      console.log(this.editPaperForm.publishDate)
    },
    //获取查询列表
    async getPaperList() {
      const { data: res } = await this.$http.get('papers/list', { params: this.queryInfo })
      //console.log(res)
      //状态码信息n
      if (res.code !== 200) {
        this.$message.error('获取论文列表失败')
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.paperlist = res.data.records
      //console.log("论文列表" + this.paperlist)

      this.total = res.data.total

      //console.log('this.paperlist')
      //console.log(this.paperlist)
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
      this.$refs.addPaperFormRef.resetFields()
    },

    //控制弹窗的开关
    addDialog() {
      this.addDialogVisible = true;
      //调用创建时间函数
      // this.currentTime()
    },


    //添加论文
    async addPaper() {
      this.$refs.addPaperFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('/papers/add', this.addPaperForm)

        if (res.code == 201) {
          this.$message.error('添加论文失败！')
        }

        this.$message.success('添加论文成功！')

        this.addDialogVisible = false

        this.getPaperList()
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
        this.addPaperForm.filepath = res.data
      })
    },

    //文件下载
    download() {
      console.log("执行download()")
      let formData = new FormData()
      console.log("this.detailPaperForm.filepath:", this.detailPaperForm.filepath)
      console.log("this.detailPaperForm.title:", this.detailPaperForm.title)

      let filePath = this.detailPaperForm.filepath
      let fileName = this.detailPaperForm.title
      formData.append('filePath', filePath)
      formData.append('fileName', fileName)

      console.log("filePath: ", formData.get('filePath'))
      console.log("fileName: ", formData.get('fileName'))
      if (this.detailPaperForm.filepath == null) {
        this.$message.error("无文件")
      } else {
        this.$http({
          url: '/download',
          method: 'get',
          params: {
            filePath: this.detailPaperForm.filepath, // 替换为实际的值
            fileName: this.detailPaperForm.title, // 替换为实际的值
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


    //论文详情页
    async detailPaper(id) {
      this.id = id
      const { data: ref } = await this.$http.get('/papers/id', { params: { id: id } })
      if (ref.code !== 200) {
        return this.$message.error('接收论文数据失败！')
      }
      console.log(ref.data)

      this.detailPaperForm = ref.data
      this.detailDialogVisible = true


    },

    //删除论文
    async deletePaper(id) {
      this.$confirm('你确定删除此项吗（该操作不可撤回）',
      '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async ()=>{
        const { data: res } = await this.$http.delete(`papers/delete`,{ params: { id: id } })
        if (res.code !== 200) {
          this.$message.error('删除论文失败！')
        }
        if(res.code==200){
          this.$message.success('删除论文成功！')
          if(this.paperlist.length === 1){
            this.queryInfo.pageNo =
                this.queryInfo.pageNo===1 ? 1:this.queryInfo.pageNo-1;
          }
        }
        this.getPaperList()
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })

      this.getPaperList()
    },

    //显示修改论文弹窗
    async showEditDialog(id) {
      //this.editDialogVisible = true;
      //根据id从接口接收数据
      const { data: ref } = await this.$http.get('/papers/id', { params: { id: id } })
      //判断是否接收成功
      if (ref.code !== 200) {
        return this.$message.error('接收修改论文数据失败！')
      }
      //成功则将数据传输到修改数据表单
      this.editPaperForm = ref.data


      //显示修改对话框
      this.editDialogVisible = true
    },

    // 监听修改论文对话框的关闭事件
    editDialogClosed() {
      this.$refs.editPaperFormRef.resetFields()
      this.getPaperList()
    },

    //修改提交论文:有bug
    async editPaperInfo() {
      this.$refs.editPaperFormRef.validate(async valid => {
        if (!valid) return
        //根据接口提交数据给后台
        this.$http.put('/papers/update', this.editPaperForm)
        //关闭对话框

        this.editDialogVisible = false
        this.getPaperList()

      })
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pageNo = newPage
      this.getPaperList()
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
@import '@/assets/css/paper.less';
@import '@/assets/css/elstyle.less';
</style>