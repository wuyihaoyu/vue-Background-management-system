<template>
    <div>
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row :gutter="20">
    <el-col :span="8">
       <el-input placeholder="请输入内容" >
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
    </el-col>
    <el-col :span="4">
        <el-button type="primary">添加用户</el-button>
    </el-col>
    </el-row>

    <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" >
           <template slot-scope="scope">
               <el-switch v-model="scope.row.mg_state">
               </el-switch>
           </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
           <template slot-scope="scope">
               <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
               <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                 <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
               </el-tooltip>
           </template>

        </el-table-column>
    </el-table>

     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

</el-card>
</div>
</template>

<script>

export default{
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2,
            },
            userlist:[],
            total:0,
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
       async  getUserList(){
       const {data:res} = await this.$http.get('users',{params:this.queryInfo})
       console.log(res)
       if(res.meta.status !==200 ){
           return this.$message.error('获取用户列表失败')
       }
       this.userlist = res.data.users
       this.total = res.data.total
       this.$message.success(res.meta.msg)
       },
        handleSizeChange(newsize){
            this.queryInfo.pagesize=newsize
            this.getUserList()
        },
        handleCurrentChange(newnum){
            this.queryInfo.pagenum=newnum
            this.getUserList()
        }
    }
}
</script>

<style lang="less" scoped>

</style>
