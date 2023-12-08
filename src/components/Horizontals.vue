<template>
    <div>
        <div>
            <!-- 面包屑导航区域 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>横向项目信息统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" type="flex">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyword">
            <el-button slot="append" icon="el-icon-search" @click="getHorizontalsList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="button" type="primary" @click="addDialog">+ &nbsp;添加横向项目</el-button>
        </el-col>
      </el-row>

      <!--论文列表区域-->
      <!-- stripe：列表是否显示条纹 -->
      <el-table :data="horizontalsList" border stripe :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="学科门类" prop="category"></el-table-column>
        <el-table-column label="合同名称" prop="contractName"></el-table-column>
        <el-table-column label="合同类别" prop="contractCategory"></el-table-column>
        <!-- <el-table-column label="拟分配申题" prop="assign"></el-table-column> -->
        <el-table-column label="负责人" prop="manager" sortable></el-table-column>
        <el-table-column label="合同成员" prop="contractMember"></el-table-column>
         <el-table-column label="承接单位" prop="company"></el-table-column>
         <el-table-column label="合同状态" prop="contractStatus"></el-table-column>
        <el-table-column label="甲方名称" prop="firstName" ></el-table-column>
        <el-table-column label="甲方类别" prop="firstCategory"></el-table-column>
        <el-table-column label="合同金额" prop="contractAmount"></el-table-column>
        <el-table-column label="签订日期" prop="signDate" ></el-table-column>      
<!--         <el-table-column label="拟分配申报奖励项目" prop="assign" ></el-table-column>-->
         <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 详情页按钮 -->
            <el-tooltip effect="dark" content="详情页" placement="top" :enterable="false">
              <el-button :class="'iconfont icon-a-huaban1fuben9'" type="primary" size="mini"
                @click="detailHorizontals(scope.row.id)">
              </el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-button type="primary" :class="'iconfont icon-a-huaban1fuben10'" size="mini"
              @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" :class="'iconfont icon-a-huaban1fuben11'" size="mini"
              @click="deleteHorizontals(scope.row.id)"></el-button>
<!--               <el-popconfirm-->
<!--              confirm-button-text="确定"-->
<!--              cancel-button-text="取消"-->
<!--              icon="el-icon-info"-->
<!--              icon-color="red"-->
<!--              @confirm="deleteHorizontals(scope.row.id)"-->
<!--              title="这个横向项目确定删除吗？"-->
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




    <!-- 添加横向项目 -->
    <!-- 需要实现的事件：addHorizontalsForm添加横向项目数据集合，addPaperRules验证规则，@close关闭事件，实现添加论文功能addHorizontalsForm -->
    <!-- 重置表单的位置必须有prop属性 -->
    <!-- addDialogVisible控制添加论文弹窗的显示与隐藏 -->
    <el-dialog title="添加横向项目" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- <el-form :model="addPaperForm" :rules="addFormRules" ref="addPaperFormRef" label-width="auto"> -->
        <el-form :model="addHorizontalsForm" :rules="addFormRules" ref="addHorizontalsFormRef" label-width="auto">
        <el-form-item label="学科门类" prop="category">
          <!-- <el-input v-model="addHorizontalsForm.category" placeholder="请输入学科门类"></el-input> -->
            <el-select v-model="addHorizontalsForm.category">
                <el-option v-for="opt in (category)" :key="opt" :value="opt"></el-option>
            </el-select>
        </el-form-item>
        <div class="addhorizontalsone">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="addHorizontalsForm.contractName" placeholder="请输入合同名称"></el-input>
          </el-form-item>
          <el-form-item label="合同类别" prop="contractCategory">
            <!-- <el-input v-model="addHorizontalsForm.contractCategory" placeholder="请输入合同类别"></el-input> -->
            <el-select v-model="addHorizontalsForm.contractCategory">
                <el-option v-for="opt in (contractCategory)" :key="opt" :value="opt"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="addhorizontalsone">
          <el-form-item label="合同编号" prop="contractNumber">
            <el-input v-model="addHorizontalsForm.contractNumber" placeholder="请输入合同编号"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="addHorizontalsForm.manager" placeholder="请输入负责人"></el-input>
          </el-form-item>
           
        </div>
        <el-form-item label="合同成员" prop="contractMember">
            <el-input v-model="addHorizontalsForm.contractMember" placeholder="请输入合同成员"></el-input>
          </el-form-item>
        <div class="addhorizontalsone">
          <el-form-item label="承接单位" prop="company">
            <el-input v-model="addHorizontalsForm.company" placeholder="请输入承接单位"></el-input>
          </el-form-item>
          <el-form-item label="合同状态" prop="contractStatus">
            <!-- <el-input v-model="addHorizontalsForm.contractStatus" placeholder="请输入合同状态"></el-input> -->
             <el-select v-model="addHorizontalsForm.contractStatus">
                <el-option v-for="opt in (contractStatus)" :key="opt" :value="opt"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="addhorizontalsone">
          <el-form-item label="甲方名称" prop="firstName">
            <el-input v-model="addHorizontalsForm.firstName" placeholder="请输入甲方名称"></el-input>
          </el-form-item>
          <el-form-item label="甲方类别" prop="firstCategory">
            <!-- <el-input v-model="addHorizontalsForm.firstCategory" placeholder="请输入甲方类别"></el-input> -->
            <el-select v-model="addHorizontalsForm.firstCategory">
                <el-option v-for="opt in (firstCategory)" :key="opt" :value="opt"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="addhorizontalsone">
           <el-form-item label="甲方地址" prop="firstAddress">
            <el-input v-model="addHorizontalsForm.firstAddress" placeholder="请输入甲方地址"></el-input>
          </el-form-item>
          <el-form-item label="甲方地区" prop="firstRegion">
            <el-input v-model="addHorizontalsForm.firstRegion" placeholder="请输入甲方地区"></el-input>
          </el-form-item>
        </div>
        <div class="addhorizontalsone">
           <el-form-item label="合同金额" prop="contractAmount">
            <el-input v-model="addHorizontalsForm.contractAmount" placeholder="请输入合同金额"></el-input>
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethod">
            <!-- <el-input v-model="addHorizontalsForm.paymentMethod" placeholder="请输入支付方式"></el-input> -->
              <el-select v-model="addHorizontalsForm.paymentMethod">
                    <el-option v-for="opt in (paymentMethod)" :key="opt" :value="opt"></el-option>
                </el-select>
          </el-form-item>
         
          
        </div>
        <!-- <el-form-item label="登记时间" prop="createTime">
          <el-input v-model="addPaperForm.createTime" disabled></el-input>
        </el-form-item> -->
        <div class="addhorizontalsone">
          <el-form-item label="签订日期" prop="signDate">
            <el-date-picker v-model="addHorizontalsForm.signDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker v-model="addHorizontalsForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="addhorizontalsone">
          <el-form-item label="终止日期" prop="endDate">
            <el-date-picker v-model="addHorizontalsForm.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
           <el-form-item label="到账经费" prop="receiveFunds">
            <el-input v-model="addHorizontalsForm.receiveFunds" placeholder="请输入到账经费"></el-input>
          </el-form-item>
        </div>

          <!-- <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="addHorizontalsForm.assign" class="m-2" placeholder="请选择">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <div>
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="addHorizontalsForm.assign" class="m-2" clearable placeholder="请选择">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <div class="addhorizontalsupload">
            <el-upload ref="upload" class="upload-demo" action="#" accept=".docx, .doc, .pdf" :auto-upload="false"
              :on-change="uploadFile" :show-file-list="false">
              <el-button type="primary" class="uploadbtn">文件上传</el-button>
            </el-upload>
          </div>
          </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addHorizontals()">确 定</el-button>
      </span>
    </el-dialog>

<!-- 修改横向项目-->
    <el-dialog title="修改横向项目信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editHorizontalsForm"  ref="editHorizontalsFormRef" label-width="auto" :rules="editFormRules">
        <el-form-item label="学科门类" prop="category">
          <!-- <el-input v-model="editHorizontalsForm.category" placeholder="请输入学科门类"></el-input> -->
           <el-select v-model="editHorizontalsForm.category">
                <el-option v-for="opt in (category)" :key="opt" :value="opt"></el-option>
            </el-select>
        </el-form-item>
        <div class="addhorizontalsone">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="editHorizontalsForm.contractName" placeholder="请输入合同名称"></el-input>
          </el-form-item>
          <el-form-item label="合同类别" prop="contractCategory">
            <!-- <el-input v-model="editHorizontalsForm.contractCategory" placeholder="请输入合同类别"></el-input> -->
             <el-select v-model="editHorizontalsForm.contractCategory">
                <el-option v-for="opt in (contractCategory)" :key="opt" :value="opt"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="addhorizontalsone">
          <el-form-item label="合同编号" prop="contractNumber">
            <el-input v-model="editHorizontalsForm.contractNumber" placeholder="请输入合同编号"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="editHorizontalsForm.manager" placeholder="请输入负责人"></el-input>
          </el-form-item>    
        </div>
        
        <el-form-item label="合同成员" prop="contractMember">
            <el-input v-model="editHorizontalsForm.contractMember" placeholder="请输入合同成员"></el-input>
          </el-form-item>

        <div class="addhorizontalsone">
          <el-form-item label="承接单位" prop="company">
            <el-input v-model="editHorizontalsForm.company" placeholder="请输入承接单位"></el-input>
          </el-form-item>
          <el-form-item label="合同状态" prop="contractStatus">
            <!-- <el-input v-model="editHorizontalsForm.contractStatus" placeholder="请输入合同状态"></el-input> -->
              <el-select v-model="editHorizontalsForm.contractStatus">
                <el-option v-for="opt in (contractStatus)" :key="opt" :value="opt"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="addhorizontalsone">
          <el-form-item label="甲方名称" prop="firstName">
            <el-input v-model="editHorizontalsForm.firstName" placeholder="请输入甲方名称"></el-input>
          </el-form-item>
          <el-form-item label="甲方类别" prop="firstCategory">
            <!-- <el-input v-model="editHorizontalsForm.firstCategory" placeholder="请输入甲方类别"></el-input> -->
            <el-select v-model="editHorizontalsForm.firstCategory">
                <el-option v-for="opt in (firstCategory)" :key="opt" :value="opt"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="addhorizontalsone">
           <el-form-item label="甲方地址" prop="firstAddress">
            <el-input v-model="editHorizontalsForm.firstAddress" placeholder="请输入甲方地址"></el-input>
          </el-form-item>
          <el-form-item label="甲方地区" prop="firstRegion">
            <el-input v-model="editHorizontalsForm.firstRegion" placeholder="请输入甲方地区"></el-input>
          </el-form-item>
        </div>
         <div class="addhorizontalsone">
           <el-form-item label="合同金额" prop="contractAmount">
            <el-input v-model="editHorizontalsForm.contractAmount" placeholder="请输入合同金额"></el-input>
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethod">
            <!-- <el-input v-model="editHorizontalsForm.paymentMethod" placeholder="请输入支付方式"></el-input> -->
            <el-select v-model="editHorizontalsForm.paymentMethod">
                    <el-option v-for="opt in (paymentMethod)" :key="opt" :value="opt"></el-option>
                </el-select>
          </el-form-item>
         
          
        </div>
        <!-- <el-form-item label="登记时间" prop="createTime">
          <el-input v-model="addPaperForm.createTime" disabled></el-input>
        </el-form-item> -->
        <div class="addhorizontalsone">
          <el-form-item label="签订日期" prop="signDate">
            <el-date-picker v-model="editHorizontalsForm.signDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker v-model="editHorizontalsForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
         <div class="addhorizontalsone">
          <el-form-item label="终止日期" prop="endDate">
            <el-date-picker v-model="editHorizontalsForm.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
           <el-form-item label="到账经费" prop="receiveFunds">
            <el-input v-model="editHorizontalsForm.receiveFunds" placeholder="请输入到账经费"></el-input>
          </el-form-item>
         </div>
          <!-- <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="editHorizontalsForm.assign" class="m-2" placeholder="请选择">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item> -->
           <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="editHorizontalsForm.assign" class="m-2" clearable placeholder="">
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <!-- <el-upload ref="upload" class="upload-demo" action="#" accept=".docx, .doc, .pdf" :auto-upload="false"
            :on-change="uploadFile" :show-file-list="false">
            <el-button type="primary" class="uploadbtn">请选择文件</el-button>
          </el-upload>
         -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editHorizontalsInfo()">确 定</el-button>
      </span>
    </el-dialog>

  <!-- 横向项目详情页 -->
    <el-dialog title="横向项目详情页" :visible.sync="detailDialogVisible" width="50%">
                <el-form :model="detailHorizontalsForm" ref="detailHorizontalsFormRef" label-width="auto" :rules="editFormRules">
        <el-form-item label="学科门类" prop="category">
          <el-input v-model="detailHorizontalsForm.category" placeholder="无" disabled></el-input>
        </el-form-item>
        <div class="addhorizontalsone">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="detailHorizontalsForm.contractName" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="合同类别" prop="contractCategory">
            <!-- <el-input v-model="detailHorizontalsForm.contractCategory" placeholder="无" disabled></el-input>
          </el-form-item> -->
           <el-select v-model="detailHorizontalsForm.contractCategory" placeholder="无" disabled>
                <el-option v-for="opt in (contractCategory)" :key="opt" :value="opt"></el-option>
            </el-select>
            </el-form-item>
        </div>
        <div class="addhorizontalsone">
          <el-form-item label="合同编号" prop="contractNumber">
            <el-input v-model="detailHorizontalsForm.contractNumber" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="detailHorizontalsForm.manager" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
       
           <el-form-item label="合同成员" prop="contractMember">
            <el-input v-model="detailHorizontalsForm.contractMember" placeholder="无" disabled></el-input>
          </el-form-item>
       
        
        <div class="addhorizontalsone">
          <el-form-item label="承接单位" prop="company">
            <el-input v-model="detailHorizontalsForm.company" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="合同状态" prop="contractStatus">
            <!-- <el-input v-model="detailHorizontalsForm.contractStatus" placeholder="无" disabled></el-input>
          </el-form-item> -->
            <el-select v-model="detailHorizontalsForm.contractStatus" placeholder="无" disabled>
                <el-option v-for="opt in (contractStatus)" :key="opt" :value="opt"></el-option>
            </el-select>
            </el-form-item>
        </div>
         <div class="addhorizontalsone">
          <el-form-item label="甲方名称" prop="firstName">
            <el-input v-model="detailHorizontalsForm.firstName" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="甲方类别" prop="firstCategory">
            <!-- <el-input v-model="detailHorizontalsForm.firstCategory" placeholder="无" disabled></el-input> -->
           <el-select v-model="detailHorizontalsForm.firstCategory" placeholder="无" disabled>
                <el-option v-for="opt in (firstCategory)" :key="opt" :value="opt"></el-option>
            </el-select>
          </el-form-item>
         </div>
        <div class="addhorizontalsone">
           <el-form-item label="甲方地址" prop="firstAddress">
            <el-input v-model="detailHorizontalsForm.firstAddress" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="甲方地区" prop="firstRegion">
            <el-input v-model="detailHorizontalsForm.firstRegion" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
       <div class="addhorizontalsone">
           <el-form-item label="合同金额" prop="contractAmount">
            <el-input v-model="detailHorizontalsForm.contractAmount" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethod">
            <!-- <el-input v-model="detailHorizontalsForm.paymentMethod" placeholder="无" disabled></el-input> -->
              <el-select v-model="detailHorizontalsForm.paymentMethod" placeholder="无" disabled>
                    <el-option v-for="opt in (paymentMethod)" :key="opt" :value="opt"></el-option>
                </el-select>
          </el-form-item>
         
          
        </div>
        <!-- <el-form-item label="登记时间" prop="createTime">
          <el-input v-model="addPaperForm.createTime" disabled></el-input>
        </el-form-item> -->
        <div class="addhorizontalsone">
          <el-form-item label="签订日期" prop="signDate">
             <el-input v-model="detailHorizontalsForm.signDate" placeholder="无" disabled></el-input>
          </el-form-item>
          <el-form-item label="开始日期" prop="startDate">
            <el-input v-model="detailHorizontalsForm.startDate" placeholder="无" disabled></el-input>
          </el-form-item>
        </div>
        <div class="addhorizontalsone">
          <el-form-item label="终止日期" prop="endDate">
            <el-input v-model="detailHorizontalsForm.endDate" placeholder="无" disabled></el-input>
          </el-form-item>
           <el-form-item label="到账经费" prop="receiveFunds">
            <el-input v-model="detailHorizontalsForm.receiveFunds" placeholder="无" disabled></el-input>
          </el-form-item>
          
        </div>

          <!-- <el-form-item label="拟分配申报奖励项目" prop="assign"> -->
             <!-- <el-input v-model="detailHorizontalsForm.assign" placeholder="请选择" disabled></el-input> -->
              <!-- <el-select v-model="detailHorizontalsForm.assign" class="m-2" placeholder="请选择">
                <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
          </el-form-item> -->
          <el-form-item label="拟分配申报奖励项目" prop="assign">
            <el-select v-model="detailHorizontalsForm.assign" class="m-2" placeholder="无" disabled>
              <el-option v-for="item in Rewardlistdetail" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <!-- <el-upload ref="upload" class="upload-demo" action="#" accept=".docx, .doc, .pdf" :auto-upload="false"
            :on-change="uploadFile" :show-file-list="false">
            <el-button type="primary" class="uploadbtn">请选择文件</el-button>
          </el-upload> -->
        <span>
            <el-button @click="download()">文件下载</el-button>
          </span>
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

      //论文id
      id: '',

      //横向项目列表
      horizontalsList: [
        //模拟数据
        // {
        //   id: '80',
        //   category: '多模态',
        //   contractName: '1',
        //   contractCategory: '张三',
        //   contractNumber: '一区',
        //   manager: '1',
        //   contractMember: 'one',
        //   company: '2023-11-14',
        //   contractStatus: '2023-11-14',
        //   firstName: '2022-10-22',
        //   firstCategory:'100万',
        //   firstAddress:'是',
        //   firstRegion:'李四',
        //   contractAmount: '1',
        //   paymentMethod:'100万',
        //   signDate:'是',
        //   startDate:'李四',
        //   endDate: '1',
        //   receiveFunds:'李四',
        //   assign: '1',
        //   remark: ''
        // }
      ],

      //奖励申报列表--下拉选择
      Rewardlistdetail: [],

      //修改论文表单
      editHorizontalsForm: {},

      //论文详情页表单
      detailHorizontalsForm: {},

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
      addHorizontalsForm: {
          category: '',
          contractName: '',
          contractCategory: '',
          contractNumber: '',
          manager: '',
          contractMember: '',
          company: '',
          contractStatus: '',
          firstName: '',
          firstCategory:'',
          firstAddress:'',
          firstRegion:'',
          contractAmount: '',
          paymentMethod:'',
          signDate:'',
          startDate:'',
          endDate: '',
          receiveFunds:'',
          assign: '',
          filepath:'',
          remark: ''
      },
    category: [
      "科技类","社科类"
    ],
    contractCategory:[
      "服务","开发","开放课题","其他"
    ],
    firstCategory:[
      "各级管理部门","科研机构","股份有限公司","国有企业","有限责任公司","私营企业","其他"
    ],
    paymentMethod:[
      "一次性支付或分期支付","其他"
    ],
    contractStatus:[
      "完成","未完成"
    ],
    //   //表单校验规则
      addFormRules: {
        contractName: valid.required('请输入合同名称'),
        contractCategory: valid.required('请输入合同类别'),
        manager: valid.required('请输入负责人'),
       contractStatus : valid.required('请输入合同状态'),
        firstName: valid.required('请输入甲方名称'),
        signDate: valid.required('请输入签订日期'),
        contractAmount: valid.required('请输入合同金额'),
        receiveFunds: valid.required('请输入到账经费'),
      },

      //修改表单校验规则
      editFormRules: {
         contractName: valid.required('请输入合同名称'),
        contractCategory: valid.required('请输入合同类别'),
        manager: valid.required('请输入负责人'),
       contractStatus : valid.required('请输入合同状态'),
        firstName: valid.required('请输入甲方名称'),
        signDate: valid.required('请输入签订日期'),
        contractAmount: valid.required('请输入合同金额'),
        receiveFunds: valid.required('请输入到账经费'),
        
      },

      //系统时间相关
      dialogTableVisible: false

    }
  },

  //周期函数
  created() {
    this.getHorizontalsList()
    this.getRewardList()
  },

  methods: {
    //获取查询列表
    async getHorizontalsList() {
      const { data: res } = await this.$http.get('horizontals/list', { params: this.queryInfo })
      //console.log(res)
      //状态码信息n
      if (res.code !== 200) {
        this.$message.error('获取横向项目列表失败')
      }
      //获取成功后赋值,根据后续的接口文档进行更改
      this.horizontalsList = res.data.records
      //console.log("论文列表" + this.paperlist)

      this.total = res.data.total
      console.log(this.horizontalsList)
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
      this.$refs.addHorizontalsFormRef.resetFields()
    },

    //控制弹窗的开关
    addDialog() {
      this.addDialogVisible = true;
      //调用创建时间函数
      // this.currentTime()
    },


    //添加横向项目
    async addHorizontals() {
      this.$refs.addHorizontalsFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('/horizontals/add', this.addHorizontalsForm)

        if (res.code == 201) {
          this.$message.error('添加横向项目失败！')
        }

        this.$message.success('添加横向项目成功！')

        this.addDialogVisible = false

        this.getHorizontalsList()
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
        this.addHorizontalsForm.filepath = res.data
      })
    },

    //文件下载
    download() {
      console.log("执行download()")
      let formData = new FormData()
      console.log("this.detailHorizontalsForm.filepath:", this.detailHorizontalsForm.filepath)
      console.log("this.detailHorizontalsForm.contractName:", this.detailHorizontalsForm.contractName)

      let filePath = this.detailHorizontalsForm.filepath
      let fileName = this.detailHorizontalsForm.contractName
      formData.append('filePath', filePath)
      formData.append('fileName', fileName)

      console.log("filePath: ", formData.get('filePath'))
      console.log("fileName: ", formData.get('fileName'))
      if (this.detailHorizontalsForm.filepath == null) {
        this.$message.error("无文件")
      } else {
        this.$http({
          url: '/download',
          method: 'get',
          params: {
            filePath: this.detailHorizontalsForm.filepath, // 替换为实际的值
            fileName: this.detailHorizontalsForm.contractName, // 替换为实际的值
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

    //横向项目详情页
    async detailHorizontals(id) {
      this.id = id
      const { data: ref } = await this.$http.get('/horizontals/id', { params: { id: id } })
      if (ref.code !== 200) {
        return this.$message.error('接收横向项目数据成功！')
      }

      this.detailHorizontalsForm = ref.data

      //可能有bug 将assign改为reward.title
      let rewardId = this.detailHorizontalsForm.assign
      // const { data: ret } = await this.$http.get('/rewards/id', { params: { id: rewardId } })
      //console.log(ret)
      // this.detailHorizontalsForm.assign = ret.data.title

      this.detailDialogVisible = true
      // console.log(this.id)
    },

    // async deleteHorizontals(id) {
    //   console.log(this.row);
    //   const { data: res } = await this.$http.delete("horizontals/delete", {
    //     params: { id: id },
    //   });
    //   if (res.code !== 200) {
    //     this.$message.error("删除横向项目失败！");
    //   }
    //   if (res.code == 200) {
    //     this.$message.success("删除横向项目成功！");
    //   }
    //
    //   if (this.horizontalsList.length === 1) {
    //     this.queryInfo.pageNo =
    //       this.queryInfo.pageNo === 1 ? 1 : this.queryInfo.pageNo - 1;
    //   }
    //   this.getHorizontalsList();
    // },

    //删除横向项目
    async deleteHorizontals(id) {
      this.$confirm('你确定删除此项吗（该操作不可撤回）',
          '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async ()=>{
        const { data: res } = await this.$http.delete(`horizontals/delete`,{ params: { id: id } })
        if (res.code !== 200) {
          this.$message.error('删除横向项目失败！')
        }
        if(res.code==200){
          this.$message.success('删除横向项目成功！')
          if(this.horizontalsList.length === 1){
            this.queryInfo.pageNo =
                this.queryInfo.pageNo===1 ? 1:this.queryInfo.pageNo-1;
          }
        }
        this.getHorizontalsList()
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })

      this.getHorizontalsList()
    },
    //显示修改论文弹窗
    async showEditDialog(id) {
      //this.editDialogVisible = true;
      //根据id从接口接收数据
      const { data: ref } = await this.$http.get('/horizontals/id', { params: { id: id } })
      //判断是否接收成功
      if (ref.code !== 200) {
        return this.$message.error('接收修改横向项目数据失败！')
      }
      console.log(ref)
      // debugger
      //成功则将数据传输到修改数据表单
      this.editHorizontalsForm = ref.data
      
      console.log(this.editHorizontalsForm)
      // debugger
      // this.editHorizontalsForm.assign = ''
      //将assign改为reward.title
      // let rewardId = this.editPaperForm.assign
      // const { data: ret } = await this.$http.get('/reward/id', { params: { id: rewardId } })
      // this.editPaperForm.assign = ret.data.title

      //显示修改对话框
      this.editDialogVisible = true
    },


    // 监听修改横向项目对话框的关闭事件
    editDialogClosed() {
      this.$refs.editHorizontalsFormRef.resetFields()
    },

    //修改提交横向项目:有bug
    async editHorizontalsInfo() {
      this.$refs.editHorizontalsFormRef.validate(async valid => {
        if (!valid) return
        //根据接口提交数据给后台
        await this.$http.put('/horizontals/update', this.editHorizontalsForm)
        // const { data: res } = this.$http.post('/paper/update', this.editPaperForm)
        //判断是否提交成功
        // if (res.data !== 1) {
        //   return res.$message.error('修改论文失败！')
        // }

        //重新获取列表数据
        this.getHorizontalsList()
        //关闭对话框
        this.editDialogVisible = false
      })
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pageNo = newPage
      this.getHorizontalsList()
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
@import '@/assets/css/horizontals.less';
@import '@/assets/css/elstyle.less';
</style>