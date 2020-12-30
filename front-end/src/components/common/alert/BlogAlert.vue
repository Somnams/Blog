<template>
<!--  TODO:: TEST ALERT-->
  <div class="wrapper">
    <div class="outer">
      <div :class="classObject" ref="alert">
        <div class="a-header">
          <div class="a-title">{{title}}</div>
          <div class="a-close">X</div>
        </div>
        <div class="a-content">{{message}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogAlert',
  props: {
    type: {
      type: String,
      validator: function (val) {
        return ['error', 'success', 'warn', 'info'].indexOf(val) !== -1
      }
    },
    title: {
      type: String,
      default: 'info title'
    },
    message: {
      type: String,
      default: `Additional description and information about copyrighting..' +
        'Additional description and information about copyrighting..' +
        'Additional description and information about copyrighting..`

    }
  },
  computed: {
    classObject: function () {
      return `inner ${this.type}`
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.wrapper {
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, .2);
  position: relative;
}
.outer {
  position: absolute;
  color: #000;
  top: 100px;
  left: 10%;
  width: 80%;
  height: 180px;
}
.inner {
  height: 100%;
  width: 100%;
  border-radius: 3px;
}
.warning {
  background-color: #fffbe6;
  border: 2px solid #ffe58f;
}
.error {
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
}
.info {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}
.success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
}
.a-header {
  padding: 12px 0 0 20px;
}
.a-title {
  font-size: 16px;
}
.a-close {
  position: absolute;
  right: 18px;
  top: 0;
}
.a-content {
  padding: 0 0 0 20px;
  line-height: 24px;
  font-size: 14px;
}

</style>
