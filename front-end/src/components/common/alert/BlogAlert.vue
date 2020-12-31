<template>
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
    type: {
      type: String,
      default: 'info'
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
  },
  methods: {
    init() {
      this.classObject = this.typeList.includes(this.type) ? `inner ${this.type}` : 'inner info';
      return this.classObject
    },
    showAlert(signal) {
      let curWidth = 0;
      let speed = 0;
      const target = this.$refs.outer.clientWidth;
      const aStyle = this.$refs.alert.style;

      (signal === 'begin') && (aStyle.left = `${target}px`);

      const timer = setInterval(() => {
        const distance = target - curWidth;
        speed = Math.ceil(distance / 5);
        curWidth = curWidth + speed;

        if (signal === 'begin' && distance === 0) {
          clearInterval(timer);
        }
        if (signal === 'end' && curWidth === target) {
          clearInterval(timer);
          this.visible = false;
        }

        aStyle.left = (signal === 'begin') ? `${distance}px` : `${curWidth}px`;

      }, 30);
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
  position: relative;
  margin-bottom: 10px;
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
  position: relative;
  border-radius: 3px;
  display: flex;
}
.a-header {
  padding-left: 18px;
  font-size: 16px;
}
.a-content {
  padding-left: 8px;
  font-size: 14px;
}

.warn {
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
.a-close {
  position: absolute;
  right: 16px;
  top: 0;
}

</style>
