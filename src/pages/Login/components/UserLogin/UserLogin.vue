<template>
  <div class="user-login">
    <div class="user-login-bg" :style="{'background-image':`url(${backgroundImage})`}">
     
    </div>
    <div class="content-wrapper">
      <h2 class="slogan">
       <div  class="user-login-logo" :style="{'background-image':`url(${userLoginLogo})`}"></div>
      </h2>
      <div class="form-container"  :style="{'background-image':`url(${loginFormBg})`}">
        <h4 class="form-title"></h4>
        <el-form ref="form" :model="user" label-width="0">
          <div class="form-items">
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="username" :rules="[ { required: true, message: '账号不能为空'}]">
                  <div class="form-line">
                    <i class="icon iconfont icon-people_fill" style="color:#01faff;position: relative;left:16px"> |</i>
                    <el-input placeholder="账号" v-model="user.username" ></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="password" :rules="[ { required: true, message: '密码不能为空'}]">
                  <div class="form-line">
                    <i class="icon iconfont icon-unlock_fill" style="color:#01faff;position: relative;left:16px"> |</i>
                    <el-input type="password" placeholder="密码" v-model="user.password" ></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row class=form-item>
              <el-col>
                <el-form-item>
                  <el-checkbox class="checkbox">记住账号</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row class="form-item" style="margin-top:10px">
              <el-button type="primary" class="submit-btn" size="small" @click="submitBtn" :loading="loading" style="color:#232838;background-color:#01FAFF;width:265px;">
                登 录
              </el-button>
            </el-row>
          </div>
          <el-row class="tips">
            <a href="/" class="link" style="color:#01FAFF">
              忘记密码?
            </a>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import BasicContainer from '@vue-materials/basic-container';
import API from '../../../../api/user';
import loginBg from '@/assets/loginBg.png';
import userLoginLogo from '@/assets/userLoginLogo.png';
import loginFormBg from '@/assets/login-form-bg.png';
export default {
  components: { BasicContainer },
  name: 'UserLogin',

  data() {
    return {
      loading: false,
      backgroundImage: loginBg,
      userLoginLogo: userLoginLogo,
      loginFormBg:loginFormBg,
      user: {
        username: '',
        password: '',
      },
    
    };
  },

  created() {},

  methods: {
    submitBtn() {
       let that = this;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          API.login(this.user).then(function (result) {
              that.loading = false;
              if (result && result.id) {
                localStorage.setItem('token', JSON.stringify(result));
                that.$router.push({path: '/'});
              } else {
                that.$message.error({showClose: true, message: result.errmsg || '登录失败', duration: 2000});
              }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './UserLogin.scss';
</style>
<style>
.user-login .form-items .el-input__inner{
  background-color: #fff0;
  border: 1px solid #01FAFF;
  border-radius: 0;
  padding-left: 40px;
  margin-left: -20px;
  width: 100%;
}
</style>

