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
      default: 3
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
    // eslint-disable-next-line vue/return-in-computed-property
    iter_pages: function () {
      let arr = [1, 2]
      for (let i = this.leftPages; i > 0; i--) {
        arr.push(this.curPage - i)
      }
      arr.push(this.curPage)
      for (let i = 1; i <= this.rightPages; i++) {
        arr.push(this.curPage + i)
      }
      arr.push(this.totalPages - 1)
      arr.push(this.totalPages)

      arr = arr.filter(item => item > 0 && item <= this.totalPages)
      arr = [...new Set(arr)]
      if (this.curPage + this.right < this.totalPages - 2) {
        arr.splice(-2, 0, 'NaN')
      }

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
