<template>
    <nav>
      <ul class="pagination-ul">
        <router-link :to="{ path: $route.path, query: { page: curPage - 1, per_page: perPage } }"
                     :class="[curPage - 1 > 0 ? '': 'disabled']"
        >
          <li class="pagination-li">
            <span class="pagination-page">&laquo;</span>
          </li>
        </router-link>

        <li v-for="(page, index) in iter_pages" :key="index" :class="[curPage === page ? 'pagination-li is-active' : 'pagination-li']">
          <span v-if="page != 'NaN'">
            <router-link :to="{ path: $route.path, query: { page: page, per_page: perPage } }">{{page}}</router-link>
          </span>
          <span v-else>...</span>
        </li>

        <router-link :to="{ path: $route.path, query: { page: curPage + 1, per_page: perPage } }"
                     :class="[curPage + 1 <= totalPages ? '': 'disabled']">
          <li class="pagination-li">&raquo;</li>
        </router-link>
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
      default: 5
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
      let arr = [1, 2];
      for (let i = this.leftPages; i > 0; i--) {
        arr.push(this.curPage - i);
      }
      arr.push(this.curPage);
      for (let i = 1; i <= this.rightPages; i++) {
        arr.push(this.curPage + i);
      }
      arr.push(this.totalPages - 1);
      arr.push(this.totalPages);

      // 去除
      arr = arr.filter(item => item > 0 && item <= this.totalPages)
      // 去除重复项
      arr = [...new Set(arr)];
      // 假设当前页为1，总页数为6或6以上时，在倒数第2个位置插入特殊标记  1, 2, 3 ... 5, 6
      if (this.curPage + this.rightPages < this.totalPages - 2) {
        arr.splice(-2, 0, 'NaN');
      }
      // 当前页为6或6以上时，在第3个位置插入特殊标记  1, 2 ... 4, 5, 6
      if (this.curPage - this.leftPages - 1 > 2) {
        arr.splice(2, 0, 'NaN');
      }

      return arr;
    }
  }
}
</script>

<style scoped>
.pagination-ul {
  margin: 0 auto;
  width: 500px;
  display: flex;
  justify-content: space-between;
}
.pagination-li {
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 100%;
  padding: 0;
  text-align: center;
  position: relative;
  border: 3px solid #2ecc71;
}
.is-active:before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: #2ecc71;
}

  .disabled {
    pointer-events: none;
    opacity: 0.6;
    cursor: default;
  }
</style>
