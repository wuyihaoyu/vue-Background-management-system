<template>
    <div class="login_container">
    <div class="login_box">
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="">
        </div>
        <el-form ref='loginFormRef' :model="loginForm"  :rules="loginFormRules" label-width="0px" class="login_form">
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>

             <el-form-item prop="password" >
                <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
            </el-form-item>
             <el-form-item  class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetloginFormref">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    </div>
</template>

<script>
export default{
    data(){
        return{
            loginForm:{
                username:'admin',
                password:'123456'
            },
            loginFormRules:{
                username:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],

                password:[
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
            }
        }
    },
 


   methods:{
        resetloginFormref(){
            this.$refs.loginFormRef.resetFields();
        },
    
    login() {
      this.$refs.loginFormRef.validate( valid => {
        if (!valid) {
          return (this.loginLoading = false)
        }
        this.$http.post('login', this.loginForm).then(res=> {
            // console.log(res)
            if(res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg +' '+ res.data.data.email)
                window.sessionStorage.setItem("token",res.data.data.token)
                this.$router.push("/home")
            }else {
                 this.$message.error(res.data.meta.msg + ' 帐号或密码错误!')
             }
        })
    
        // 1. 将登录成功之后的 token,保存到客户端的 sessionStorage(会话机制/只在当前页面生效)中 localStorage(持久话机制/关闭页面也不会忘记数据)
        //   1.1 项目中除了登录之外的API接口,必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效, 所以将 token 保存在 sessionStorage中
        // 2. 通过编程式路由导航跳转到后台主页,路由地址是 /home
      })
    }

   }   
}


</script>

<style lang="less" scoped>
.login_container{
    background-color: red;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top:50%;
    transform:translate(-50%,-50%);
    
    .avatar_box{
       height: 130px; 
       width: 130px;
       border: 1px solid #eee;
       border-radius: 50%;
       padding: 10px;
       box-shadow: 0 0 10px;
       position: absolute;
       left: 50%;
       transform: translate(-50%,-50%);
       background-color: #fff; 
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color:#eee;
        }
    }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.btns{
    display:flex;
    justify-content:flex-end;
}
</style>