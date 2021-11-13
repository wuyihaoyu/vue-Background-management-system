<template>
<el-container class="home-container"> 
    <el-header>
        <div>
            <img src="../assets/logo.png" alt="">
            <span>电商后台管理系统</span>
        </div> 
        <el-button type="info" @click="back">退出</el-button>
    </el-header>
    <el-container>
        <el-aside :width="isCollapse ? '64px':'200px'">
            <div class="toggle-button" @click="toggleCollapse"><i class="el-icon-s-operation"></i></div>
    <el-menu router :collapse-transition="false" :collapse="isCollapse" background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :default-active="activePath">
  
  <el-submenu :index="item.id+'' " v-for="item in menulist" :key="item.id">
    <template slot="title">
      <i :class="iconsObj[item.id]"></i>
      <span>{{item.authName}}</span>
    </template>
    <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
         <template slot="title">
      <i class="el-icon-tickets"></i>
      <span slot="title">{{subItem.authName}}</span>
    </template>
    </el-menu-item>
  </el-submenu>
</el-menu>
        </el-aside>

    <el-main>
       <!-- 路由占位符 -->
       <router-view></router-view>
    </el-main>
    </el-container>         
</el-container>
</template>

<script>
// import store from '/src/store/index.js'

export default {
    

    data(){
        return {
            menulist:[],
            iconsObj:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao',
            },
            isCollapse:false,
            activePath:'',
        }
    },
    created(){
     this.getMenuList()
     this.activePath=window.sessionStorage.getItem('activePath')
    },

    methods:{
        back(){
            window.sessionStorage.clear()
            this.$router.push('/login')
            this.$message.success('退出成功')
        },
        async getMenuList(){
             const {data:res}= await this.$http.get('menus')
             if(res.meta.status!==200)return this.$message.error(res.meta.msg)
             this.$message.success(res.meta.msg)
             this.menulist=res.data 
        },
        toggleCollapse(){
             this.isCollapse=!this.isCollapse            
        },
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath=activePath
        }
    }

}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
}

.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div{
        display: flex;
        align-items: center;   
       img{
            width:60px;
          }
        span{
            margin-left:15px;
        }  
    }

}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right:none;
    }
}
.el-main{
    background-color: #eaedf1;
}
.iconfont{
    margin-right:10px;
}
.toggle-button{
    background-color: #4a5064;

    .el-icon-s-operation{
    font-size: 20px;
    line-height: 24px;
    color: #fff;
    text-align:center;
    cursor:pointer;
    display: flex;
    justify-content: flex-end;
    }
}


</style>

