<template>
    <nav>
      <ul id="list-ul">
        <li id="list-pre">
          <router-link :to="{ path: $route.path, query: { page: curPage - 1, per_page: perPage } }"
                       :class="[curPage - 1 > 0 ? '': 'disabled']">
            &laquo;
          </router-link>
        </li>

        <li v-for="(page, index) in iter_pages" :key="index">
          <span v-if="page != 'NaN'">
            <router-link :to="{ path: $route.path, query: { page: page, per_page: perPage } }">{{page}}</router-link>
          </span>
          <span v-else>...</span>
        </li>

        <li id="list-next">
          <router-link :to="{ path: $route.path, query: { page: curPage + 1, per_page: perPage } }"
                       :class="[curPage + 1 <= totalPages ? '': 'disabled']">
            &raquo;
          </router-link>
        </li>

        <li id="list-last">
          <span>Page {{curPage}} of {{totalPages}}</span>
        </li>
      </ul>
    </nav>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    curPage: {
      required: true
    },
    perPage: {
      default: 10
    },
    totalPages: {
      required: true
    },
    leftPages: {
      default: 2
    },
    rightPages: {
      default: 2
    }
  },
  computed: {
    iter_pages: function () {
      // 构建分页导航，当前页左、右两边各显示2页，比如  1, 2, ... 7, 8, 9, 10, 11 ... 30, 31
      let arr = [1, 2]
      for (var i = this.leftPages; i > 0; i--) {
        arr.push(this.curPage - i)
      }
      arr.push(this.curPage)
      // eslint-disable-next-line no-redeclare
      for (var i = 1; i <= this.rightPages; i++) {
        arr.push(this.curPage + i)
      }
      arr.push(this.totalPages - 1)
      arr.push(this.totalPages)

      // 小于1，或大于最大页数的都是非法的，要去除
      arr = arr.filter(item => item > 0 && item <= this.totalPages)
      // 去除重复项
      arr = [...new Set(arr)]
      // 假设当前页为1，总页数为6或6以上时，在倒数第2个位置插入特殊标记  1, 2, 3 ... 5, 6
      if (this.curPage + this.rightPages < this.totalPages - 2) {
        arr.splice(-2, 0, 'NaN')
      }
      // 当前页为6或6以上时，在第3个位置插入特殊标记  1, 2 ... 4, 5, 6
      if (this.curPage - this.leftPages - 1 > 2) {
        arr.splice(2, 0, 'NaN')
      }

      return arr
    }
  }
}
</script>

<style scoped>
  .disabled {
    pointer-events: none;
    opacity: 0.6;
    cursor: default;
  }
  #list-ul {
    display: inline-block;
    width: 90%;
    text-align: center;
  }
  li {
    display: inline;
    text-align: center;
  }
  li a{
    color: #fff;
    padding: 8px 16px;
    border: 1px #928bad solid;
    margin-right: 15px;
  }
  #list-pre {
  }
  #list-next {
  }
  #list-last {
    float: right;
    border-bottom: 1px #928bad solid;
  }
</style>
