<template>
  <div class="confirm" v-if="confirmShow">
    <div class="confirm-content-wrap">
      <div class="confirm-content">
        <p class="content">{{content}}</p>
      </div>
      <div class="confirm-btn">
        <span @click.prevent="noClick" class="my-btn-text cancel-btn">Cancel</span>
        <span @click.prevent="yesClick" class="my-btn-text sure-btn">Sure</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: 'delete sure?'
    }
  },
  data () {
    return {
      promiseStatus: null,
      confirmShow: false
    }
  },
  methods: {
    confirm () {
      const _this = this
      this.confirmShow = true
      return new Promise(function (resolve, reject) {
        _this.promiseStatus = { resolve, reject }
      })
    },
    noClick () {
      this.confirmShow = false
      this.promiseStatus && this.promiseStatus.reject()
    },
    yesClick () {
      this.confirmShow = false
      this.promiseStatus && this.promiseStatus.resolve()
    }
  }
}
</script>

<style scoped>
  .confirm {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 990;
  }
  .confirm-content-wrap {
    position: absolute;
    top: 28%;
    left: 0;
    right: 0;
    width: 280px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
    user-select: none;
  }
  .confirm-content {
    padding: 20px 15px 0;
    margin-bottom: 32px;
    text-align: center;
    font-size: 16px;
    color: #666;
    line-height: 1.5;
  }

  /* 底部按钮样式 */
  .confirm-btn {
    display: flex;
    border-top: 1px solid #eee;
    color: #928bad;
  }
  .cancel-btn {
    text-align: center;
    flex: 1;
    font-size: 14px;
    cursor: pointer;
  }
  .sure-btn {
    text-align: center;
    flex: 1;
    font-size: 14px;
    cursor: pointer;
  }
</style>
