
  
  <script>
  //引入compositionAPI
  import {ref, computed, reactive, toRefs } from 'vue'
  // 引入 element-plus 相关
  import {ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
  // 引入路由相关 API
  import {useRouter } from 'vue-router'
  // 引入 API 接口

  // 引入 vuex 相关 API
  import { useStore } from 'vuex'
  import {
    QRCodeKey,
    QRCodeBase,
    QRCodeState,
    telIsRegister,
    sendCaptcha,
    checkCaptcha,
    telLogin,
    telRegister,
    isLogin,
  } from '@/api'
  export default {
    name: 'Login',
    props: ['closeDialog'],
    setup(props) {
      // 定义变量 router 用来进行路由相关操作
      const router = useRouter()
  
      // 定义变量 store 用来进行 vuex 相关操作
      const store = useStore()
  
      // 电话号码的校验函数
      const validateTel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else {
          let telReg =
            /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
          if (!telReg.test(value)) {
            callback(new Error('手机号不符合规范'))
          } else {
            // 调用 callback 否则会一直处于校验状态
            callback()
          }
        }
      }
  
      // 密码的校验函数
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          let passwordReg =
            /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,20}$/
          if (!passwordReg.test(value)) {
            callback(new Error('密码不规范'))
          } else {
            callback()
          }
        }
      }
  
      // 验证码的校验函数
      const validateCaptcha = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } else {
          callback()
        }
      }
  
      // 昵称的校验函数
      const validateNickname = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请先输入账户昵称'))
        } else {
          callback()
        }
      }
  
      // 定义计算属性 loginDialogIsVisible 获取登录展示框的展示状态
      let loginDialogIsVisible = computed({
        get() {
          return store.state.loginDialogIsVisible
        },
        set(val) {
          return val
        },
      })
  
      // 定义变量 info 用来保存当前组件的响应式数据
      const info = reactive({
        // 指向登录表单的 DOM 元素
        loginRef: '',
        // 指向注册表单的 DOM 元素
        registerRef: '',
        // 登录信息
        loginInfo: {
          tel: '',
          captcha: '',
        },
        // 登录的规则
        loginRule: {
          tel: [{ validator: validateTel, trigger: 'blur' }],
          captcha: [{ validator: validateCaptcha, trigger: 'blur' }],
        },
        // 注册信息
        registerInfo: {
          tel: '',
          captcha: '',
          password: '',
          nickname: '',
        },
        // 注册规则
        registerRule: {
          tel: [{ validator: validateTel, trigger: 'blur' }],
          password: [{ validator: validatePassword, trigger: 'blur' }],
          captcha: [{ validator: validateCaptcha, trigger: 'blur' }],
          nickname: [{ validator: validateNickname, trigger: 'blur' }],
        },
        // 登录验证码框内容
        loginCaptcha: '获取验证码',
        // 注册验证码的内容
        registerCaptcha: '获取验证码',
        // 登录的状态为
        loginState: '登录',
        // 是否使用二维码登录
        isQRCodeLogin: false,
        // 二维码的 base64 值
        QRCodeBase: '',
        // 二维码的状态值
        QRCodeState: {},
        // 二维码的状态码
        QRCodeStateCode: 0,
        // loading 加载
        loading: false,
      })
  
      // 定义获取登录二维码 key 值的方法
      const getQRCodeKey = async () => {
        let res = await QRCodeKey()
        getQRCodeBase(res.data.unikey)
      }
  
      // 定义变量 checkTimer 用来保存检测二维码状态的定时器
      let checkTimer
  
      // 定义获取二维码 base64 编码的方法
      const getQRCodeBase = async (key) => {
        // 每次重新获取二维码时，将二维码的状态值重置
        info.QRCodeState = {}
        info.QRCodeStateCode = 0
        let res = await QRCodeBase(key)
        // 获取二维码的 base64 编码
        info.QRCodeBase = res.data.qrimg
        // 跳转到二维码登录部分
        info.isQRCodeLogin = true
        if (checkTimer) {
          clearInterval(checkTimer)
        }
        // 开启定时器，定时检测二维码的扫描状态
        checkTimer = setInterval(() => {
          checkQRCodeState(key)
        }, 1000)
      }
  
      // 定义检测二维码状态的方法
      const checkQRCodeState = async (key) => {
        let res = await QRCodeState(key)
        // 如果状态码改变了修改值
        if (res.code !== info.QRCodeStateCode) {
          // 根据状态码的改变做出响应操作
          if (res.code === 800) {
            ElMessage({
              message: '二维码已过期',
              type: 'warning',
              grouping: true,
              duration: 3000,
            })
            // 二维码过期了，关闭定时器
            clearInterval(checkTimer)
          } else if (res.code === 802) {
            ElMessage({
              message: '扫码成功，请确认是否登录',
              type: 'success',
              grouping: true,
              duration: 3000,
            })
          } else if (res.code === 803) {
            // 关闭登录弹窗
            props.closeDialog(false)
  
            // 登录成功
            ElMessage({
              message: `${res.message}`,
              type: 'success',
              grouping: true,
              duration: 3000,
            })
            // 登录成功，关闭定时器
            clearInterval(checkTimer)
            router.go(0)
          }
          // 修改值
          info.QRCodeState = res
          info.QRCodeStateCode = res.code
        }
      }
  
      // 定义检测手机号注册状态的方法
      const checkTelIsRegister = async (phone, type) => {
        let res = await telIsRegister(phone)
        info.telIsRegister = res.exist
  
        // 判断获取验证码是用于登录还是注册
        if (type === 'loginCaptcha') {
          // 用于登录
  
          if (res.exist === 1) {
            getCaptcha(phone, type)
          } else {
            ElMessage({
              message: '手机号还未注册，请先注册后再进行登录',
              type: 'warning',
              grouping: true,
            })
          }
        } else {
          // 用于注册
  
          if (res.exist === -1) {
            // 手机号还未注册
  
            // 发送验证码
            getCaptcha(phone, type)
          } else {
            ElMessage({
              message: '手机号已注册，前往登录页面登录即可',
              type: 'warning',
              grouping: true,
            })
          }
        }
      }
  
      const getCaptcha = async (phone, type) => {
        let res = await sendCaptcha(phone)
        if (res.code === 200) {
          ElMessage({
            message: '验证码已发送，请注意查收',
            type: 'success',
            grouping: true,
          })
          let timer
          let time = 60
          timer = setInterval(() => {
            info[type] = `${--time}s 后重新获取`
            if (time < 0) {
              clearInterval(timer)
              info[type] = '获取验证码'
            }
          }, 1000)
        }
      }
  
      // 定义手机号登录的方法
      const toLogin = async (phone, captcha) => {
        let res = await telLogin(phone, captcha)
        // 将当前登陆账户的账户 id 保存在 localStorage 中
        window.localStorage.setItem('userId', res.data.profile.userId)
        ElMessage({
          message: '登录成功',
          type: 'success',
          grouping: true,
        })
        // 关闭登录弹窗
        props.closeDialog(false)
        // 刷新页面，重新获取数据
        router.go(0)
      }
  
      // 定义注册的方法
      const toRegister = async (phone, password, captcha, nickname) => {
        let res = await telRegister(phone, password, captcha, nickname)
        ElMessage({
          message: '注册成功，为您跳转到登录界面',
          type: 'success',
          grouping: true,
        })
        skipLogin()
      }
  
      // 定义校验验证码的方法
      const toCheckCaptcha = async (phone, captcha, type) => {
        let res = await checkCaptcha(phone, captcha)
        // 判断验证码填写是否正确
        if (res.code === 200) {
          //验证码填写正确
  
          // 判断是进行登录操作还是注册操作
          if (type) {
            // 进行登录操作
  
            // 调用登录的接口
            toLogin(phone, captcha)
          } else {
            // 进行注册操作
  
            // 调用注册的接口
            toRegister(
              phone,
              info.registerInfo.password,
              captcha,
              info.registerInfo.nickname
            )
          }
        } else {
          ElMessage({
            message: '验证码错误，请仔细核对验证码',
            type: 'error',
            grouping: true,
          })
        }
      }
  
      // 定义点击密码登录时的方法
      const hint = () => {
        ElMessage({
          message: '由于网易云云盾验证，暂只支持扫码登录',
          type: 'warning',
          grouping: true,
          duration: 5000,
        })
      }
  
      // 定义跳转到注册部分的方法
      const skipRegister = () => {
        info.loginState = '注册'
      }
  
      // 定义跳转到登录部分的方法
      const skipLogin = () => {
        info.loginState = '登录'
      }
  
      // 定义跳转到二维码登录的方法
      const toQRCodeLogin = () => {
        if (!info.QRCodeStateCode || info.QRCodeStateCode === 800) {
          // 获取二维码
          getQRCodeKey()
        } else {
          // 跳转到二维码登录部分
          info.isQRCodeLogin = true
        }
      }
  
      // 定义刷新二维码的方法
      const updateQRCode = () => {
        // 获取二维码
        getQRCodeKey()
      }
  
      // 定义点击发送验证码的方法
      const getCaptchaToClick = (type) => {
        ElMessage({
          message: '由于网易云云盾验证，暂只支持扫码登录',
          type: 'warning',
          grouping: true,
          duration: 5000,
        })
        return
        // 由于网易云云盾验证，暂只支持扫码登录，下面是之前可以手机号登录时写的逻辑
        // 判断是否可以获取验证码
        if (info[type] === '获取验证码') {
          // 如果可以获取验证码，再进行后续操作
  
          // 定义手机号的正则
          let telReg =
            /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  
          // 判断发送验证码是用于登录还是注册
          if (type === 'loginCaptcha') {
            // 判断手机号是否符合规范
            if (telReg.test(info.loginInfo.tel)) {
              // 检测手机号是否已经注册
              checkTelIsRegister(info.loginInfo.tel, type)
            } else {
              ElMessage({
                message: '请输入正确的手机号',
                type: 'error',
                grouping: true,
              })
            }
          } else {
            if (telReg.test(info.registerInfo.tel)) {
              console.log('发送注册的验证码')
              // 检测手机号是否已经注册
              checkTelIsRegister(info.registerInfo.tel, type)
            } else {
              ElMessage({
                message: '请输入正确的手机号',
                type: 'error',
                grouping: true,
              })
            }
          }
        } else {
          ElMessage({
            message: '验证码已发送，请稍等',
            type: 'warning',
            grouping: true,
          })
        }
      }
  
      // 定义点击登录的方法
      const login = (formEl) => {
        ElMessage({
          message: '由于网易云云盾验证，暂只支持扫码登录',
          type: 'warning',
          grouping: true,
          duration: 5000,
        })
        return
  
        if (!formEl) return
        formEl.validate((valid) => {
          if (valid) {
            toCheckCaptcha(info.loginInfo.tel, info.loginInfo.captcha, 1)
          } else {
            ElMessage({
              message: '登录不全',
              type: 'error',
              grouping: true,
            })
            return false
          }
        })
      }
  
      // 定义定义点击注册账号的方法
      const register = (formEl) => {
        if (!formEl) return
        formEl.validate((valid) => {
          if (valid) {
            // 判断验证码填写是否正确（第三个参数传递：0，表示当前进行的是注册操作）
            toCheckCaptcha(info.registerInfo.tel, info.registerInfo.captcha, 0)
          } else {
            ElMessage({
              message: '注册信息填写不完善',
              type: 'error',
              grouping: true,
            })
            return false
          }
        })
      }
  
      return {
        loginDialogIsVisible,
        hint,
        skipRegister,
        skipLogin,
        ArrowLeft,
        ArrowRight,
        toQRCodeLogin,
        updateQRCode,
        getCaptchaToClick,
        login,
        register,
        ...toRefs(info),
      }
    },
  }
  </script>
  
  <style lang="less" scoped>
  .login {
    .telLogin {
      .suggest {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        .QRCode {
          width: 50px;
          height: 50px;
          background-color: #eee;
          box-sizing: border-box;
          padding: 5px;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          img {
            width: 100%;
          }
          .shield {
            width: 70.9px;
            height: 70.9px;
            background-color: #fff;
            position: absolute;
            top: 14.5px;
            left: 15px;
            transform: rotate(45deg);
          }
        }
        .tooltip {
          display: flex;
          .triangle {
            width: 1px;
            height: 0px;
            border-right: 5px solid #aaa;
            border-bottom: 5px solid white;
            border-left: 5px solid white;
          }
          .content {
            height: 30px;
            background-color: #aaa;
            border-radius: 5px;
            border-top-left-radius: 0;
            color: white;
            padding: 0 15px;
            line-height: 30px;
            font-size: 13px;
          }
        }
      }
      .backLogin {
        position: absolute;
        top: 15px;
        left: 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .logo {
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
        img {
          width: 80px;
          height: 80px;
          border-radius: 10px;
        }
      }
    }
    .QRCodeLogin {
      & > .title {
        font-size: 30px;
        color: #000;
        text-align: center;
        margin: 20px 0 40px;
      }
      .imgBox {
        height: 250px;
        padding: 0 20px;
        position: relative;
        .hintImg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          height: 250px;
          transition: 0.5s;
          img {
            height: 100%;
          }
        }
        .QRCode {
          width: 225px;
          transition: 0.5s;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          img {
            width: 100%;
            transition: 0.5s;
          }
          .hint {
            white-space: normal;
            text-align: center;
            line-height: 25px;
            font-size: 16px;
            a {
              color: cornflowerblue;
            }
          }
        }
        .QRCodeAbandon {
          width: 200px;
          height: 200px;
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 999;
          background-color: rgba(0, 0, 0, 0.795);
          .title {
            color: white;
            text-align: center;
            margin-top: 80px;
            font-size: 16px;
          }
          .el-button {
            height: 15px;
            box-sizing: content-box;
            background-color: #3893ee;
            padding: 5px 10px;
            margin: 15px auto 0;
            color: white;
            display: block;
            font-size: 12px;
            &:hover {
              color: white;
              background-color: #2481dd;
            }
          }
        }
        &.isUseful:hover {
          .hintImg {
            opacity: 1;
            transform: translate(-150px, -100px);
          }
          .QRCode {
            transform: scale(0.7) translate(0px, -150px);
          }
        }
      }
      .selectElseLogin {
        display: flex;
        justify-content: center;
        margin: 50px 0;
        span {
          cursor: pointer;
          display: flex;
          align-items: center;
        }
      }
      .waitConfirm {
        display: flex;
        justify-content: center;
      }
    }
  }
  </style>
  <template>
    <div class="login">
      <div class="telLogin" v-if="!isQRCodeLogin">
        <div
          class="suggest"
          @click="toQRCodeLogin"
          v-show="loginState === '登录'"
        >
          <div class="QRCode">
            <div class="img">
              <img src="./images/QRcode.png" alt="" />
            </div>
            <div class="shield"></div>
          </div>
          <div class="tooltip">
            <div class="triangle"></div>
            <div class="content">扫码登录更安全</div>
          </div>
        </div>
        <div class="backLogin" @click="skipLogin" v-show="loginState === '注册'">
          <el-icon><ArrowLeft /></el-icon>
          返回登录
        </div>
        <!-- logo -->
        <div class="logo">
          <img src="./images/logo.jpg" alt="" />
        </div>
        <!-- 登录表单 -->
        <el-form
          ref="loginRef"
          :model="loginInfo"
          status-icon
          :rules="loginRule"
          label-width="60px"
          class="loginForm"
          v-show="loginState === '登录'"
        >
          <el-form-item label="手机号：" prop="tel">
            <el-input
              v-model.trim="loginInfo.tel"
              type="input"
              autocomplete="off"
              placeholder="请输入您的手机号码"
            />
          </el-form-item>
          <el-form-item class="captcha" label="验证码：" prop="captcha">
            <el-input
              v-model.trim="loginInfo.captcha"
              type="input"
              autocomplete="off"
              placeholder="输入验证码"
            />
            <div class="getCaptcha" @click="getCaptchaToClick('loginCaptcha')">
              {{ loginCaptcha }}
            </div>
          </el-form-item>
          <div class="passwordLogin">
            <span @click="hint">密码登录</span>
          </div>
          <div class="primary">
            <el-button @click="login(loginRef)">登录</el-button>
          </div>
          <!-- 注册按钮 -->
          <div class="else">
            <el-button @click="skipRegister">注册</el-button>
          </div>
        </el-form>
        <!-- 注册表单 -->
        <el-form
          ref="registerRef"
          :model="registerInfo"
          status-icon
          :rules="registerRule"
          label-width="60px"
          class="registerForm"
          v-show="loginState === '注册'"
        >
          <el-form-item label="手机号：" prop="tel">
            <el-input
              v-model.trim="registerInfo.tel"
              type="input"
              autocomplete="off"
              placeholder="请输入您的手机号码"
            />
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input
              v-model.trim="registerInfo.password"
              type="input"
              autocomplete="off"
              placeholder="设置登录密码"
            />
            <div class="passwordHint">
              密码需要是数字/字母
            </div>
          </el-form-item>
          <el-form-item label="昵称：" prop="nickname">
            <el-input
              v-model.trim="registerInfo.nickname"
              type="input"
              autocomplete="off"
              placeholder="设置账户昵称"
            />
          </el-form-item>
          <el-form-item class="captcha" label="验证码：" prop="captcha">
            <el-input
              v-model.trim="registerInfo.captcha"
              type="input"
              autocomplete="off"
              placeholder="输入验证码"
            />
            <!--  获取验证码 -->
            <div class="getCaptcha" @click="getCaptchaToClick('registerCaptcha')">
              {{ registerCaptcha }}
            </div>
          </el-form-item>
          <!-- 注册按钮 -->
          <div class="primary">
            <el-button @click="register(registerRef)">注册</el-button>
          </div>
        </el-form>
      </div>
      <!-- 二维码登录 -->
      <div class="QRCodeLogin" v-if="isQRCodeLogin">
        <div class="title">扫码登录</div>
        <!-- 扫码图片部分 -->
        <div
          :class="{ imgBox: true, isUseful: QRCodeStateCode === 801 }"
          v-show="
            QRCodeStateCode === 0 ||
            QRCodeStateCode === 800 ||
            QRCodeStateCode === 801
          "
        >
          <!-- 提示图片 -->
          <div class="hintImg">
            <img src="./images/hint.png" alt="" />
          </div>
          <!-- 二维码 -->
          <div class="QRCode">
            <img :src="QRCodeBase" alt="" />
            <!-- 提示内容 -->
            <div class="hint">
              使用
              <a href="https://music.163.com/#/download" target="_blank"
                >网易云音乐App</a
              >
              扫码登录
            </div>
          </div>
          <!-- 二维码已失效 -->
          <div class="QRCodeAbandon" v-show="QRCodeStateCode === 800">
            <div class="title">二维码已失效</div>
            <el-button type="primary" @click="updateQRCode">点击刷新</el-button>
          </div>
        </div>
        <!-- 待确认 -->
        <div class="waitConfirm">
          <img
            src="./images/waitConfirm.png"
            v-show="QRCodeStateCode === 802"
            alt=""
          />
        </div>
        <!-- 选择其他登录方式 -->
        <div class="selectElseLogin" @click="isQRCodeLogin = false">
          <span>
            选择其他登录方式<el-icon><ArrowRight /></el-icon>
          </span>
        </div>
      </div>
    </div>
  </template>