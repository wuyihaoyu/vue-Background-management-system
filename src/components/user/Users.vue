<template>
    <div>
        <!-- <div @click="saveUserInfo">
            设置数据
        </div> -->
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row :gutter="20">
    <el-col :span="8">
       <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
    </el-col>
    <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
    </el-col>
    </el-row>

     <!-- <div v-for="item in userlist" :key="item.id">{{item}}</div> -->
    <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" >
           <template slot-scope="scope">
               <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
               </el-switch>
           </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
           <template  slot-scope="scope">          
               <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
               <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                 <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
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

<el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed">

   <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogClosed">

   <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">

     <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
   </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>


<el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%" @close="setRoleDialogClosed">

 <div>
     <p>当前的用户：{{userinfo.username}}</p>
     <p>当前的角色：{{userinfo.role_name}}</p>
     <p>分配新角色：
         <el-select v-model="selectedRoleId" placeholder="请选择">
             <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
         </el-select>
     </p>
 </div>

  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>


</div>
</template>

<script>

// import {mapActions} from 'vuex'
export default{
    data(){
        var checkEmail = (rule,value,cb)=>{
            const regEmail =/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
            if( regEmail.test(value)){
                return cb()
            }
             cb( new Error('请输入合法的邮箱'))
        }

        var checkMobile = (rule,value,cb)=>{
            const regMobile = /(^1\d{10}$)|(^[0-9]\d{7}$)/
            if( regMobile.test(value)){
                return cb()
            }
             cb( new Error('请输入合法的手机号码'))
        }

        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2,
            },
            userlist:[],
            total:0,
            addDialogVisible:false,
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            addFormRules:{
                username:[
                    { required:true,message:'请输入用户名',trigger:'blur'},
                    {
                        min:3,
                        max:10,
                        message:'用户名的长度在3~10个字符之间',
                        trigger:'blur',
                    }
                ],
                password:[
                    { required:true,message:'请输入密码',trigger:'blur'},
                    {
                        min:6,
                        max:15,
                        message:'密码的长度在6~15个字符之间',
                        trigger:'blur',
                    }
                ],
                email:[ 
                    { required:true,message:'请输入邮箱',trigger:'blur'},
                    { validator:checkEmail,trigger: 'blur'}
                    ],

                mobile:[
                    { required:true,message:'请输入手机',trigger:'blur'},
                    { validator:checkMobile,trigger: 'blur'}
                ]
            },
            editFormRules:{
                 email:[ 
                    { required:true,message:'请输入邮箱',trigger:'blur'},
                    { validator:checkEmail,trigger: 'blur'}
                    ],

                mobile:[
                    { required:true,message:'请输入手机',trigger:'blur'},
                    { validator:checkMobile,trigger: 'blur'}
                ]
                
            },
            editDialogVisible:false,
            editForm:{},
            setRoleDialogVisible:false,
            userinfo:{},
            rolesList:[],
            selectedRoleId:'',
        }
        
    },
    created(){
        this.getUserList()
    },
    methods:{
        // ...mapActions({
        //     getUser: 'user/getUser'
        // }),
        // saveUserInfo(){
        //     this.getUser({
        //         name: 'bobo'
        //     })
        //     this.$store.dispatch('user/getUser', {
        //         name: 'haoyu'
        //     })
        //     this.$message.success('success')
        // },
       async getUserList(){
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
        },
        async userStateChanged(userinfo){
            // console.log(userinfo)
            const{ data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`) 
            if(res.meta.status!==200){
                userinfo.mg_state=!userinfo.mg_state
                return this.$message.error('更新用户状态失败！')
            }
            this.$message.success('更新用户状态成功！')
       },
       addDialogClosed(){
           this.$refs.addFormRef.resetFields()
       },
       addUser(){
            this.$refs.addFormRef.validate(async valid=>
            {
                if(!valid) return
                const { data:res} = await this.$http.post('users',this.addForm)

                if(res.meta.status !== 201){
                    this.$message.error('添加用户失败!')

                }

                this.$message.success('添加用户成功!')
                this.addDialogVisible=false
                this.getUserList()
            
       })
       },
      async showEditDialog(id){
           const {data:res} = await this .$http.get('users/'+id)

           if(res.meta.status !==200){
               return this.$message.error('查询用户信息失败！')
           }

           this.editForm = res.data 
           console.log(this.editForm)         
           this.editDialogVisible = true
           
       },
       editDialogClosed(){
           this.$refs.editFormRef.resetFields()
       },
       editUserInfo(){
           this.$refs.editFormRef.validate( async valid=>{
                if(!valid) return
            //    console.log(valid)
                const{ data:res} = await this.$http.put('users/'+this.editForm.id,{
                   email:this.editForm.email,
                   mobile:this.editForm.mobile
                   })
                if(res.meta.status !==200){
                       return this.$message.error('更新用户信息失败！')
                   }
                this.editDialogVisible= false
                this.getUserList()
                this.$message.success('更新用户信息成功！')
                

           })
       },
           async  removeUserById(id){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该用户，是否继续','提示',
                {
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }
            ).catch(err=>err)
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除')
            }
            const{data:res}= await this.$http.delete('users/'+id)

            if(res.meta.status !== 200){
                return this.$message.error('删除用户失败！')
            }

            this.$message.success('删除用户成功！')
            this.getUserList()
       },
       async setRole(userInfo){
           this.userinfo = userInfo

           const {data:res} = await this.$http.get('roles')

           if( res.meta.status !== 200){
               return this.$message.error('获取角色列表失败！')
           }

           this.rolesList = res.data

           this.setRoleDialogVisible = true
       },
       setRoleDialogClosed(){
           this.selectedRoleId = ''
           this.userinfo={}
       },
       async saveRoleInfo(){
           if(!this.selectedRoleId){
               return this.$message.error('请选择要分配的角色！')
           }

           const {data:res} = await this.$http.put(
               `users/${this.userinfo.id}/role`,{
                   rid:this.selectedRoleId
               }
           )

           if(res.meta.status !== 200){
               return this.$message.error('更新角色失败！')
           }

           this.$message.success('更新角色成功')
           this.getUserList()
           this.setRoleDialogVisible = false 
       }
    }
}
</script>

<style lang="less" scoped>

</style>
