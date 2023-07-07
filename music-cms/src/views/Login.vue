<template>
    <div class="login">
        <!-- <img src="" alt="" class="login-img">
         -->
        <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="login-form"
        :size="formSize"
        status-icon>
            <h2>网易云平台登录</h2> 
            <div class="login-form-input">
                <el-form-item label="手机号" prop="username">
                    <el-input v-model="ruleForm.username" />
                </el-form-item>

                <el-form-item label="验证码" prop="yzm">
                    <el-row>
                        <el-col :span="24">
                            <el-input v-model="ruleForm.yzm" />
                        </el-col>
                        <!-- <el-col :span="1">
                            <el-button class="loginyzm">发送验证码</el-button>                             
                        </el-col> -->
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)" class="submitButton">
                        登录    
                    </el-button>
                  </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script setup>
    import { ref, reactive } from 'vue' 
    const ruleFormRef = ref(null)
    const ruleForm = reactive({
        username: '',
        yzm: ''       
    })
    // const rules = reactive({
    //     username: [
    //     { required: true, message: '手机号不能为空', trigger: 'blur' },
    //     { pattern:/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '手机号格式错误', trigger: 'blur' },
    //     ],
    //     yzm: [
    //     { required: true, message: '验证码不能为空', trigger: 'blur' },
    //     { min: 4,max:4, message: '验证码格式为4位', trigger: 'blur' },
    //     ]
    // })
    const formSize = ref( )


    const submitForm = (formEl) => {
  if (!formEl) return
   formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}


</script>
<style scoped>
    .login{
        height: 100vh;
        width: 100vw;
        /* background-color: #EC4141; */
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    .login-img{
        width: 400px;
        height: 400px;
    }
    .login-form{
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 15px;
        padding: 20px 20px;
        padding-left: 0;
        padding-bottom: 10px;
    }
    h2{
        margin-bottom: 20px;
        padding-left: 30px;
        
    }
    .loginyzm{
        margin-left: 10px;
    }
    /* .login-form-input{
        background-color: white;
        height: 150px;
        width: 300px;
    } */
    el-input{
        padding: 0;
    }
    .submitButton{
        width: 100%;
    }
</style>