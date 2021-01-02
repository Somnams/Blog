<template>
<!--  TODO:: ALERT position-->
  <div v-if="visible" class="wrapper">
    <div class="outer" ref="outer">
      <div :class="classObject" ref="alert">
        <div class="a-header">
          <div class="a-title">{{title}}:</div>
          <div class="a-close" @click="onClickClose">
            <a>Close Now</a>
          </div>
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
    autoClose: {
      type: [Boolean, Number],
      default: 3,
      validator(val) {
        return typeof  val === 'boolean' || typeof val === 'number';
      }
    },
    type: {
      type: String,
      default: 'info'
    },
    title: {
      type: String,
      default: 'infoTitle'
    },
    message: {
      type: String,
      default: `Additional description and information about copyrighting..' +
        'Additional description and information about copyrighting..' +
        'Additional description and information about copyrighting..`

    }
  },
  data () {
    return {
      visible: true,
      classObject: '',
      typeList: ['error', 'warn', 'success', 'info']
    }
  },
  mounted () {
    this.init();
    this.showAlert('begin');
    this.execAutoClose();
  },
  methods: {
    init() {
      this.classObject = this.typeList.includes(this.type) ? `inner ${this.type}` : 'inner info';
      return this.classObject;
    },
    showAlert(signal) {
      let curWidth = 0;
      let speed = 0;
      let target;
      let aStyle;

      this.$nextTick(() => {
        target = this.$refs.outer.clientWidth;
        aStyle = this.$refs.alert.style;
        (signal === 'begin') && (aStyle.left = `${target}px`);
        console.log(document.body.clientWidth);
      })

      const timer = setInterval(() => {
        const distance = target - curWidth;
        speed = Math.ceil(distance / 5);
        curWidth = curWidth + speed;

        if (signal === 'begin' && distance <= 0) {
          clearInterval(timer);
        }
        if (signal === 'end' && curWidth >= target) {
          clearInterval(timer);
          this.visible = false;
        }

        aStyle.left = (signal === 'begin') ? `${distance}px` : `${curWidth}px`;

      }, 30);
    },
    execAutoClose() {
      if (this.autoClose) {
        setTimeout(() => {
          this.onClickClose();
        }, this.autoClose * 1000);
      }
    },
    onClickClose() {
      this.showAlert('end');
    }
  }
}
</script>

<style scoped>
.wrapper {
  height: 40px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 9999;
}
.outer {
  position: absolute;
  color: #000;
  top: 0;
  width: 100%;
  height: 38px;
}
.inner {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 3px;
  line-height: 38px;
  display: flex;
}
.a-header {
  padding-left: 18px;
  font-size: 16px;
  text-align: center;
}
.a-content {
  padding-left: 8px;
  font-size: 14px;
}

.warn {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
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
.a-close {
  position: absolute;
  right: 16px;
  top: 0;
}

</style>
