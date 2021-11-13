<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible=true">
                        添加角色
                    </el-button>
                </el-col>
            </el-row>
        </el-card>

        <el-table :data="rolelist" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showroleDialog(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeroleById(scope.row.id)">删除</el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        
<el-dialog
  title="添加角色"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed">

   <el-form  :model="addrole"  ref="addRoles" label-width="70px">

  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addrole.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addrole.roleDesc"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addroles">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="修改角色"
  :visible.sync="editroleVisible"
  width="50%" @close="editroleClosed">

   <el-form :model="editrole"  ref="editrolesRef" label-width="70px">

     <el-form-item label="角色ID">
    <el-input v-model="editrole.roleId" disabled></el-input>
  </el-form-item>
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editrole.roleName"></el-input>
  </el-form-item>
   <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editrole.roleDesc"></el-input>
  </el-form-item>
   </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editroleVisible = false">取 消</el-button>
    <el-button type="primary" @click="editroleInfo">确 定</el-button>
  </span>
</el-dialog>

 


    </div>
</template>

<script>
export default {
    data(){
        return{
            rolelist:[],
            addDialogVisible:false,
            editroleVisible:false,
            editrole:{
                roleId:'',
                roleName:'',
                roleDesc:''

            },
            addrole:{
                roleName:'',
                roleDesc:''

            }
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
            const { data:res} = await this.$http.get('roles')

            if( res.meta.status !== 200){
                return this.$message.error('获取角色列表失败！')
            }

            this.rolelist = res.data
            this.$message.success('重新获取角色列表成功！')
            // console.log(this.rolelist)
        },
        addDialogClosed(){
           this.$refs.addRoles.resetFields()
         },
        editroleClosed(){
           this.$refs.editrolesRef.resetFields()
       },
        addroles(){
            this.$refs.addRoles.validate(async valid=>
            {
                if(!valid) return
                const { data:res} = await this.$http.post('roles',this.addrole)

                if(res.meta.status !== 201){
                    this.$message.error('添加角色失败!')

                }

                this.$message.success('添加角色成功!')
                this.addDialogVisible=false
                this.getRolesList()
            
       })
       },
        async removeroleById(id){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该角色，是否继续','提示',
                {
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }
            ).catch(err=>err)
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除')
            }
            const{data:res}= await this.$http.delete('roles/'+id)

            if(res.meta.status !== 200){
                return this.$message.error('删除用户失败！')
            }

            this.$message.success('删除用户成功！')
             this.getRolesList()
            
       },
           editroleInfo(){
           this.$refs.editrolesRef.validate( async valid=>{
                if(!valid) return
            //    console.log(valid)
                const{ data:res} = await this.$http.put('roles/'+this.editrole.roleId,{
                   roleName:this.editrole.roleName,
                   roleDesc:this.editrole.roleDesc
                   })
                if(res.meta.status !==200){
                       return this.$message.error('更新用户信息失败！')
                   }
                this.editroleVisible= false
                this.getRolesList()
                this.$message.success('更新角色信息成功！')
                

           })
       },
        async showroleDialog(id){
           const {data:res} = await this .$http.get('roles/'+id)

           if(res.meta.status !==200){
               return this.$message.error('查询角色信息失败！')
           }

           this.editrole = res.data 
        //    console.log(this.editrole)         
           this.editroleVisible = true
           
       },

    }
    
}
</script>

<style lang="less" scoped>

</style>