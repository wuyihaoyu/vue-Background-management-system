<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

             <el-table :data="orderlist" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="订单编号" prop="order_number"></el-table-column>
            <el-table-column label="订单价格" prop="order_price"></el-table-column>
            <el-table-column label="是否付款" prop="pay_status">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                    <el-tag type="danger" v-else>未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send">
                <template slot-scope="scope">
                    {{scope.row.is_send}}
                </template>
            </el-table-column>
            <el-table-column label="下单时间" prop="create_time">
                <template slot-scope="scope">
                    {{scope.row.create_time | dateFormat}}
                </template>
            </el-table-column>
            <el-table-column label="操作" >
                <template>
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
                  <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
                </template>
            </el-table-column>
            
        </el-table>

          <el-pagination
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" 
        :page-sizes="[5,10,15]" 
        :page-size="queryInfo.pagesize"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total" background>
        </el-pagination>
 
        </el-card>

        <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1"> 
                   <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>

                </el-form-item>
                <el-form-item label="详细地址" prop="address2"> 
                     <el-input v-model="addressForm.address2"></el-input>  
                </el-form-item>

            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取消</el-button>
                <el-button type="primary" @click="addressVisible = false">确定</el-button>
            </span>

        </el-dialog>

        <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
        <el-timeline>
            <el-timeline-item v-for="(activity,index) in progressInfo" :key="index" :timestamp="activity.time">
                {{activity.context}}
                {{activity.location}}
            </el-timeline-item>
        </el-timeline>

        </el-dialog>

       
    </div>
</template>

<script>
import cityData from './citydata.js'
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            orderlist:[],
            cityData:cityData,
            addressForm:{
                address1:[],
                address1:'',
            },
            addressVisible:false,
            addressFormRules:{
                address1:[
                    { required:true,message:'请选择省市区县',trigger:'blur' }
                ],
                 address2:[
                    { required:true,message:'请填写详细地址',trigger:'blur' }
                ]
            },
            progressVisible:false,
            progressInfo:[],
            res :{
                      "data":[
                                { "time":"2018-05-909:39:00",
                                "ftime":"2018-05-909:39:00",
                                "context" :"开始发货",
                                "location":"北京市朝阳区",
                                },
                                 { "time":"2018-05-1109:39:00",
                                "ftime":"2018-05-1109:39:00",
                                "context" :"配送中",
                                "location":"河北省中转站 ",
                                },
                                 { "time":"2018-05-1209:39:00",
                                "ftime":"2018-05-1209:39:00",
                                "context" :"配送中",
                                "location":"广东省广州中转站",
                                },
                                 { "time":"2018-05-1309:39:00",
                                "ftime":"2018-05-1309:39:00",
                                "context" :"已签收,感谢使用顺丰,期待再次为您服务",
                                "location":"广东江门市五邑大学",
                                },
                ]    
            }

        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        async getOrderList(){
            const {data:res} = await this.$http.get('orders',{params:this.queryInfo})

            if(res.meta.status !== 200){
                return this.$message.error('获取订单列表失败！')
            }

            console.log(res)
            this.total = res.data.total
            this.orderlist = res.data.goods
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange( newPage){
            this.queryInfo.pagenum = newPage
            this.getOrderList()

        },
        showBox(){
            this.addressVisible = true

        },
        addressDialogClosed(){
            this.$refs.addressFormRef.resetFields()
        },
        showProgressBox(){
            // const{data:res} =await this.$http.get('../../static/progress.json')
            //单号没效的用本地文件 await this.$http.get('../../static/progress.json')

            // if(res.meta.status !== 200 ){
            //     return this.$message.error('获取进度失败！')
            // }
            this.progressInfo = this.res.data
            
            this.progressVisible = true
            console.log(this.progressInfo)
        }
        

    }
}
</script>

<style lang="less" scoped>
.el-cascader{
    width: 100%;
}
   
</style>