<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>奖励申报管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword">
            <el-button slot="append" icon="el-icon-search" @click="getRewardList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="button" type="primary" @click="addDialogVisible = true">+ &nbsp 添加奖励申报</el-button>
        </el-col>
      </el-row>

      <!--奖励申报列表区域-->
      <!-- stripe：列表是否显示条纹 -->
      <el-table :data="Rewardlist" border stripe :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="申报题目" prop="title"></el-table-column>
        <el-table-column label="申报类型" prop="types"></el-table-column>
        <el-table-column label="关键词" prop="keywords"></el-table-column>
        <el-table-column label="行业" prop="industry"></el-table-column>
        <el-table-column label="第一完成人" prop="firstAuthor"></el-table-column>
        <el-table-column label="完成单位" prop="completionUnit"></el-table-column>
<!--        <el-table-column label="关联论文数" prop="detailRewardForm.paperNumber"></el-table-column>-->
<!--        <el-table-column label="关联专利数" prop="detailRewardForm.patentNumber"></el-table-column>-->

        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 详情页按钮 -->
            <el-tooltip effect="dark" content="详情页" placement="top" :enterable="false">
              <el-button type="primary" :class="'iconfont icon-a-huaban1fuben9'" size="mini"
                @click="detailReward(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-button type="primary" :class="'iconfont icon-a-huaban1fuben10'" size="mini"
              @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" :class="'iconfont icon-a-huaban1fuben11'" size="mini"
              @click="deleteReward(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页-->
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="queryInfo.pageNo"
        :page-size="queryInfo.pageSize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>

    <!-- 添加奖励申报 -->
    <!-- 需要实现的事件：addrewardForm添加奖励申报详情数据集合，addrewardRules验证规则，@close关闭事件，实现添加奖励申报详情功能addreward -->
    <!-- 重置表单的位置必须有prop属性 -->
    <!-- addDialogVisible控制添加奖励申报详情弹窗的显示与隐藏 -->
    <el-dialog title="添加奖励申报项目" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addRewardForm" ref="addRewardFormRef" label-width="auto" :rules="formRules">
        <div class="addrewardinput">
          <el-form-item label="申报题目" prop="title">
            <el-input v-model="addRewardForm.title" placeholder="请输入奖励申报题目"></el-input>
          </el-form-item>
          <el-form-item label="申报类型" prop="types">
            <el-input v-model="addRewardForm.types" placeholder="请输入奖励申报类型"></el-input>
          </el-form-item>
          <el-form-item label="拟申报年份" prop="years">
            <el-input v-model="addRewardForm.years" placeholder="请输入拟申报年份"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="addRewardForm.keywords" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <div class="addrewardinput">
          <el-form-item label="行业" prop="industry">
            <el-input v-model="addRewardForm.industry" placeholder="请输入行业"></el-input>
          </el-form-item>
          <el-form-item label="奖励名称" prop="awardName">
            <el-input v-model="addRewardForm.awardName" placeholder="请输入奖励名称"></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="任务来源" prop="sources">
            <el-input v-model="addRewardForm.sources" placeholder="请输入任务来源"></el-input>
          </el-form-item>
          <el-form-item label="推荐单位" prop="recommended">
            <el-input v-model="addRewardForm.recommended" placeholder="请输入推荐单位"></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="第一完成人" prop="firstAuthor">
            <el-input v-model="addRewardForm.firstAuthor" placeholder="请输入第一完成人"></el-input>
          </el-form-item>
          <el-form-item label="完成单位" prop="completionUnit">
            <el-input v-model="addRewardForm.completionUnit" placeholder="请输入完成单位"></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="成果名称" prop="achievementName">
            <el-input v-model="addRewardForm.achievementName" placeholder="请输入成果名称"></el-input>
          </el-form-item>
          <el-form-item label="所属单位" prop="affiliatedUnit">
            <el-input v-model="addRewardForm.affiliatedUnit" placeholder="请输入所属单位"></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
        <el-form-item label="获奖完成人" prop="awardWinner">
          <el-input v-model="addRewardForm.awardWinner" placeholder="请输入获奖完成人"></el-input>
        </el-form-item>
        <el-form-item label="获奖人数" prop="winnerNumber">
          <el-input v-model="addRewardForm.winnerNumber" placeholder="请输入获奖人数"></el-input>
        </el-form-item>
      </div>
        <div class="addrewardinput">
          <el-form-item label="发证机关" prop="issuingAuthority">
            <el-input v-model="addRewardForm.issuingAuthority" placeholder="请输入发证机关"></el-input>
          </el-form-item>
          <el-form-item label="获奖日期" prop="awardDate">
            <el-date-picker v-model="addRewardForm.awardDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="获奖级别" prop="awardLevel">
            <el-select v-model="addRewardForm.awardLevel" clearable placeholder="请选择">
              <el-option v-for="opt in (awardLevel)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
          <el-form-item label="获奖等级" prop="awardGrade">
            <el-select v-model="addRewardForm.awardGrade" clearable placeholder="请选择">
              <el-option v-for="opt in (awardGrade)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="总参加单位数" prop="attendNumber">
            <el-input v-model="addRewardForm.attendNumber" placeholder="请输入总参加单位数"></el-input>
          </el-form-item>
          <el-form-item label="单位排名" prop="unitRank">
            <el-select v-model="addRewardForm.unitRank" clearable placeholder="请选择">
              <el-option v-for="opt in (unitRank)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="奖励批准号" prop="approvalId">
            <el-input v-model="addRewardForm.approvalId" placeholder="请输入奖励批准号"></el-input>
          </el-form-item>
          <el-form-item label="成果形式" prop="resultForm">
            <el-select v-model="addRewardForm.resultForm" clearable placeholder="请选择">
              <el-option v-for="opt in (resultForm)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addReward()">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 修改奖励申报 -->
    <el-dialog title="修改奖励申报项目" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editRewardForm" ref="editRewardFormRef" label-width="auto" :rules="formRules">
        <div class="addrewardinput">
          <el-form-item label="申报题目" prop="title">
            <el-input v-model="editRewardForm.title" placeholder="请输入奖励申报题目"></el-input>
          </el-form-item>
          <el-form-item label="申报类型" prop="types">
            <el-input v-model="editRewardForm.types" placeholder="请输入奖励申报类型"></el-input>
          </el-form-item>
          <el-form-item label="拟申报年份" prop="years">
            <el-input v-model="editRewardForm.years" placeholder="请输入拟申报年份"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="editRewardForm.keywords" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <div class="addrewardinput">
          <el-form-item label="行业" prop="industry">
            <el-input v-model="editRewardForm.industry" placeholder="请输入行业"></el-input>
          </el-form-item>
          <el-form-item label="奖励名称" prop="awardName">
            <el-input v-model="editRewardForm.awardName" placeholder="请输入奖励名称"></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="任务来源" prop="sources">
            <el-input v-model="editRewardForm.sources" placeholder="请输入任务来源"></el-input>
          </el-form-item>
          <el-form-item label="推荐单位" prop="recommended">
            <el-input v-model="editRewardForm.recommended" placeholder="请输入推荐单位"></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="第一完成人" prop="firstAuthor">
            <el-input v-model="editRewardForm.firstAuthor" placeholder="请输入第一完成人"></el-input>
          </el-form-item>
          <el-form-item label="完成单位" prop="completionUnit">
            <el-input v-model="editRewardForm.completionUnit" placeholder="请输入完成单位"></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="成果名称" prop="achievementName">
            <el-input v-model="editRewardForm.achievementName" placeholder="请输入成果名称"></el-input>
          </el-form-item>
          <el-form-item label="所属单位" prop="affiliatedUnit">
            <el-input v-model="editRewardForm.affiliatedUnit" placeholder="请输入所属单位"></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="获奖完成人" prop="awardWinner">
            <el-input v-model="editRewardForm.awardWinner" placeholder="请输入获奖完成人"></el-input>
          </el-form-item>
          <el-form-item label="获奖人数" prop="winnerNumber">
            <el-input v-model="editRewardForm.winnerNumber" placeholder="请输入获奖人数"></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="发证机关" prop="issuingAuthority">
            <el-input v-model="editRewardForm.issuingAuthority" placeholder="请输入发证机关"></el-input>
          </el-form-item>
          <el-form-item label="获奖日期" prop="awardDate">
            <el-date-picker v-model="editRewardForm.awardDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="获奖级别" prop="awardLevel">
            <el-select v-model="editRewardForm.awardLevel" clearable placeholder="请选择">
              <el-option v-for="opt in (awardLevel)" :key="opt" :value="opt"  />
            </el-select>
          </el-form-item>
          <el-form-item label="获奖等级" prop="awardGrade">
            <el-select v-model="editRewardForm.awardGrade" clearable placeholder="请选择">
              <el-option v-for="opt in (awardGrade)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="总参加单位数" prop="attendNumber">
            <el-input v-model="editRewardForm.attendNumber" placeholder="请输入总参加单位数"></el-input>
          </el-form-item>
          <el-form-item label="单位排名" prop="unitRank">
            <el-select v-model="editRewardForm.unitRank" clearable placeholder="请选择">
              <el-option v-for="opt in (unitRank)" :key="opt" :value="opt"  />
            </el-select>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="奖励批准号" prop="approvalId">
            <el-input v-model="editRewardForm.approvalId" placeholder="请输入奖励批准号"></el-input>
          </el-form-item>
          <el-form-item label="成果形式" prop="resultForm">
            <el-select v-model="editRewardForm.resultForm" clearable placeholder="请选择">
              <el-option v-for="opt in (resultForm)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRewardInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 奖励申报详情页 -->
    <el-dialog title="奖励申报项目详情页" :visible.sync="detailDialogVisible" width="50%">
      <el-form :model="detailRewardForm" ref="detailRewardFormRef" label-width="auto">
        <div class="addrewardinput">
          <el-form-item label="申报题目" prop="title">
            <el-input v-model="detailRewardForm.title" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="申报类型" prop="types">
            <el-input v-model="detailRewardForm.types" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="拟申报年份" prop="years">
            <el-input v-model="detailRewardForm.years" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="detailRewardForm.keywords" placeholder="无" disabled></el-input>
        </el-form-item>
        <div class="addrewardinput">
          <el-form-item label="行业" prop="industry">
            <el-input v-model="detailRewardForm.industry" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="奖励名称" prop="awardName">
            <el-input v-model="detailRewardForm.awardName" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="任务来源" prop="sources">
            <el-input v-model="detailRewardForm.sources" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="推荐单位" prop="recommended">
            <el-input v-model="detailRewardForm.recommended" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="第一完成人" prop="firstAuthor">
            <el-input v-model="detailRewardForm.firstAuthor" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="完成单位" prop="completionUnit">
            <el-input v-model="detailRewardForm.completionUnit" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="成果名称" prop="achievementName">
            <el-input v-model="detailRewardForm.achievementName" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属单位" prop="affiliatedUnit">
            <el-input v-model="detailRewardForm.affiliatedUnit" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="获奖完成人" prop="awardWinner">
            <el-input v-model="detailRewardForm.awardWinner" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="获奖人数" prop="winnerNumber">
            <el-input v-model="detailRewardForm.winnerNumber" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="发证机关" prop="issuingAuthority">
            <el-input v-model="detailRewardForm.issuingAuthority" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="获奖日期" prop="awardDate">
            <el-date-picker v-model="detailRewardForm.awardDate" type="date" value-format="yyyy-MM-dd" placeholder="无" disabled>
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="获奖级别" prop="awardLevel">
            <el-select v-model="detailRewardForm.awardLevel"  placeholder="无" disabled>
              <el-option v-for="opt in (awardLevel)" :key="opt" :value="opt"/>
            </el-select>
          </el-form-item>
          <el-form-item label="获奖等级" prop="awardGrade">
            <el-select v-model="detailRewardForm.awardGrade"  placeholder="无" disabled>
              <el-option v-for="opt in (awardGrade)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="总参加单位数" prop="attendNumber">
            <el-input v-model="detailRewardForm.attendNumber" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="单位排名" prop="unitRank">
            <el-select v-model="detailRewardForm.unitRank"  placeholder="无" disabled>
              <el-option v-for="opt in (unitRank)" :key="opt" :value="opt"  />
            </el-select>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="奖励批准号" prop="approvalId">
            <el-input v-model="detailRewardForm.approvalId" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="成果形式" prop="resultForm">
            <el-select v-model="detailRewardForm.resultForm"  placeholder="无" disabled>
              <el-option v-for="opt in (resultForm)" :key="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="关联论文数" prop="paperNumber">
            <el-input v-model="detailRewardForm.paperNumber" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="关联专利数" prop="patentNumber">
            <el-input v-model="detailRewardForm.patentNumber"  placeholder="无" disabled>
            </el-input>
          </el-form-item>
        </div>
        <div class="addrewardinput">
          <el-form-item label="关联著作数" prop="workNumber">
            <el-input v-model="detailRewardForm.workNumber" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="关联横向项目数" prop="horizontalNumber">
            <el-input v-model="detailRewardForm.horizontalNumber"  placeholder="无" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="关联纵向项目数" prop="verticalNumber">
            <el-input v-model="detailRewardForm.verticalNumber"  placeholder="无" disabled>
            </el-input>
          </el-form-item>
        </div>
      </el-form>



      <!-- 奖励关联列表 -->
      <div>
        <p class="reward_p">关联论文或专利列表</p>
        <!-- 论文表 -->
        <el-table :data="paperdetail" border stripe :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="论文题目" prop="title"></el-table-column>
          <el-table-column label="第一作者" prop="firstAuthor"></el-table-column>
          <el-table-column label="通讯作者" prop="correspondingAuthor"></el-table-column>
<!--           <el-table-column label="详情" width="70px">-->
<!--            <el-button type="primary" :class="'iconfont icon-a-huaban1fuben9'" size="mini"></el-button>-->
   <!--     </el-table-column> -->
        </el-table>
        <!-- 专利表 -->
        <el-table :data="patentdetail" border stripe :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="专利名称" prop="patentName"></el-table-column>
          <el-table-column label="专利发明（设计）人" prop="patentDesigner"></el-table-column>
          <el-table-column label="授权号（即专利号）" prop="authorizationNumber"></el-table-column>
          <!-- <el-table-column label="详情" width="70px">
            <el-button type="primary" :class="'iconfont icon-a-huaban1fuben9'" size="mini"
              @click="detailPaperDetail(scope.row.id)"></el-button>
          </el-table-column> -->
        </el-table>
      </div>
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
        pageSize: 10
      },

      //表单校验规则
      formRules: {
        title: valid.required('请输入申报题目'),
        types: valid.required('请输入申报类型'),
        industry: valid.required('请输入行业名称'),
        firstAuthor: valid.required('请输入第一完成人'),
        completion: valid.required('请输入完成单位'),
        recommended: valid.required('请输入推荐单位'),
        sources: valid.required('请输入任务来源')
      },
      awardLevel:[
          '国家科学技术奖','省部级科技成果奖','中国专利奖','厅级成果奖'
        ],
      awardGrade:[
          '一等奖','二等奖','三等奖','金奖','优秀奖'
        ],
      unitRank:[
          '第一','其他'
       ],
      resultForm:[
          '研究或咨询报告','论文','其他'
       ],

      //奖励申报列表
      Rewardlist: [
        // {
        // //模拟数据
        //   title: '太空船',
        //   types: '科技',
        //   keywords: '大数据',
        //   industry: '航空航天',
        //   authors: '张三',
        //   completion: '河南大学',
        //   recommended: '河南大学',
        //   completeBy: '李四',
        //   sources: '河南省',
        //   years: '2022'
        // }
      ],

      //论文列表
      paperlistdetail: [],

      //专利列表
      patentlistdetail: [],

      paperdetail:[],
      // //论文详情
      // paperdetail: [
      //
      // ],

      //专利详情
      patentdetail: [],

      //论文总数
      papersum: null,

      //专利总数
      patentsum: null,

      //论文页弹窗
      paperdetailDialogVisible: false,

      //奖励申报总数
      total: 5,

      //控制添加奖励申报的显示与隐藏
      addDialogVisible: false,

      //修改奖励申报列表
      editRewardForm: {},

      //控制修改奖励申报的显示与隐藏
      editDialogVisible: false,

      //控制专利详情的显示与隐藏
      detailDialogVisible: false,

      //添加奖励申报表单数据
      addRewardForm: {
        types:'',
        industry:'',
        years:'',
        keywords:'',
        recommended:'',
        sources:'',
        awardName:'',
        firstAuthor:'',
        title:'',
        achievementName:'',
        affiliatedUnit:'',
        awardWinner:'',
        winnerNumber:'',
        issuingAuthority:'',
        awardDate:'',
        awardLevel:'',
        awardGrade:'',
        completionUnit:'',
        attendNumber:'',
        unitRank:'',
        approvalId:'',
        resultForm:'',
        remark:'',
        paperNumber:'',
        patentNumber:'',
        workNumber:'',
        horizontalNumber:'',
        verticalNumber:''

      },


      //奖励申报详情表单
      detailRewardForm: {
        //模拟数据
        // title: '太空船',
        // types: '科技',
        // keywords: '大数据',
        // industry: '航空航天',
        // authors: '张三',
        // completion: '河南大学',
        // recommended: '河南大学',
        // completeBy: '李四',
        // sources: '河南省',
        // years: '2022'
      }
    }
  },

  //周期函数
  created() {
    this.getRewardList()
    // this.getPaperList()
    // this.getPatentList()
  },

  methods: {
    //获取查询列表
    async getRewardList() {
      const { data: res } = await this.$http.get('rewards/list', { params: this.queryInfo })
      //console.log(res)
      //状态码信息
      if (res.code !== 200) {
        this.$message.error('获取奖励申报详情列表失败')
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.Rewardlist = res.data.records
      //console.log("奖励申报详情列表" + this.Rewardlist)
      this.total = res.data.total
    },


    //弹窗关闭，清空添加奖励申报详情表单
    addDialogClosed() {
      this.$refs.addRewardFormRef.resetFields()
    },

    //添加奖励申报
    async addReward() {
      this.$refs.addRewardFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/rewards/add', this.addRewardForm)

        if (res.code == 201) {
          this.$message.error('添加奖励申报失败！')
        }

        this.$message.success('添加奖励申报成功！')

        this.addDialogVisible = false

        this.getRewardList()
      })
    },

    //删除奖励申报
      deleteReward(id) {
        console.log(this.row)
        this.$confirm('你确定删除此项吗（该操作不可撤回）',
            '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
          const {data: res} = await this.$http.delete('/rewards/delete', {params: {id: id}})
          if (res.code !== 200) {
            this.$message.error('删除奖励申报失败！')
          }
          if (res.code == 200) {
            this.$message.success('删除奖励申报成功！')
          }
          this.getRewardList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        if(this.Rewardlist.length === 1){
          this.queryInfo.pageNo = this.queryInfo.pageNo===1?1:this.queryInfo.pageNo-1;
        }
        this.getRewardList()
      },

    //显示修改奖励申报弹窗
    async showEditDialog(id) {
      this.editDialogVisible = true;
      //根据id从接口接收数据
      const { data: ref } = await this.$http.get('/rewards/id', { params: { id: id } })
      //判断是否接收成功
      if (ref.code !== 200) {
        return this.$message.error('接收修改奖励申报数据失败！')
      }
      //成功则将数据传输到修改数据表单
      this.editRewardForm = ref.data
      //显示修改对话框
      //this.editDialogVisible = true
    },

    // 监听修改奖励申报对话框的关闭事件
    editDialogClosed() {
      this.$refs.editRewardFormRef.resetFields()
    },

    //修改提交奖励申报:有bug
    editRewardInfo() {
      this.$refs.editRewardFormRef.validate(async valid => {
        if (!valid) return
        this.$http.put('/rewards/update', this.editRewardForm)
        //根据接口提交数据给后台
        // const { data: ref } = this.$http.post('/reward/update', this.editRewardForm)
        //判断是否提交成功
        // if (ref.code !== 200) {
        //   return this.$message.error('修改奖励申报失败！')
        // }
        //重新获取列表数据
        this.getRewardList()
        //关闭对话框
        this.editDialogVisible = false
      })
    },

    //奖励申报详情页
    async detailReward(id) {
      //this.detailDialogVisible = true
      //根据id从接口接收数据
      const { data: ref } = await this.$http.get('/rewards/id', { params: { id: id } })
      //判断是否接收成功
      console.log(ref)
      if (ref.code !== 200) {
        return this.$message.error('接收奖励申报数据失败！')
      }
      //成功则将数据传输到数据表单
      this.detailRewardForm = ref.data
      let Paperassign=this.detailRewardForm.id
      console.log(Paperassign)


        const { data: retPaper } = await this.$http.get('/papers/assign', {params: {assign: Paperassign}})
        if (retPaper.code !== 200) {
          return this.$message.error('获取论文数据失败！')
        }
        console.log(retPaper.data)
        this.paperdetail = retPaper.data
      this.detailRewardForm.paperNumber=retPaper.data.length
      console.log(retPaper.data.length)
      const { data: retPatent } = await this.$http.get('patents/assign', {params: {assign: Paperassign}})
      //console.log(res)
      //状态码信息
      if (retPatent.code !== 200) {
        return this.$message.error('获取专利列表失败!')
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.patentdetail = retPatent.data
      this.detailRewardForm.patentNumber=retPatent.data.length
      console.log(retPatent.data.length)

      const { data: retWork } = await this.$http.get('works/assign', {params: {assign: Paperassign}})
      //console.log(res)
      //状态码信息
      if (retWork.code !== 200) {
        return this.$message.error('获取著作列表失败!')
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.patentdetail = retWork.data
      this.detailRewardForm.workNumber=retWork.data.length
      console.log(retWork.data.length)

      const { data: retHorizontal } = await this.$http.get('horizontals/assign', {params: {assign: Paperassign}})
      //console.log(res)
      //状态码信息
      if (retHorizontal.code !== 200) {
        return this.$message.error('获取横向项目列表失败!')
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.patentdetail = retHorizontal.data
      this.detailRewardForm.horizontalNumber=retHorizontal.data.length
      console.log(retHorizontal.data.length)

      const { data: retVertical } = await this.$http.get('verticals/assign', {params: {assign: Paperassign}})
      //console.log(res)
      //状态码信息
      if (retVertical.code !== 200) {
        return this.$message.error('获取纵向项目列表失败!')
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.patentdetail = retVertical.data
      this.detailRewardForm.verticalNumber=retVertical.data.length
      console.log(retVertical.data.length)

        this.detailDialogVisible = false
        this.paperdetailDialogVisible = true
      // console.log(this.detailRewardForm.id)
      //待改bug,assign字段传id后不可以用模糊查询
      // this.idCard.assign = this.detailRewardForm.id
      // console.log(this.idCard.assign)
      // this.getPaperList()
      //
      // this.getPatentList()
      //显示详情页对话框
      this.detailDialogVisible = true
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pageNo = newPage
      this.getRewardList()
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/detail.less';
@import '@/assets/css/reward.less';
</style>