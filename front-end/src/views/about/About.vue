<template>
    <div class="page">
      <nav-bar class="nav-bar"/>
      <header>
        <h1></h1>
      </header>
      <div class="main-content">
        <div class="about">
          <h1 style="color: #78909C">Something about this website</h1>
          <article>
            <div class="about-us-p">
              你好，欢迎访问个人博客网站——<em class="serendipity">SERENDIPITY</em>。<br/>
              <em class="serendipity">serendipity</em>是我觉得很浪漫的一个单词，它的意思是“意外发现珍品的运气和本领”，
              希望每个访问这个网站的同学都会觉得自己拥有了<em class="serendipity">serendipity</em>。
              <br>之前没有在网上找到喜欢的博客网站，又正值春招，就自己动手做了这个博客网站。对我来说也是小有意义的一个项目～
              <br>目前这个网站只有博主一个人开发完善，如果你在访问的过程遇到问题或者有好的建议，欢迎联系我呀。
            </div>
          </article>
        </div>
        <div class="steam">
          <h1 style="color: #928bad">Our steam</h1>
          <div>
            <div class="somnam-jpg">
              <img src="../../assets/user.jpeg">
            </div>
            <p class="steam-p">博主是一位00后的弱鸡程序媛，喜欢敲代码热爱前端开发，<br>
              我的目标是踩完前端所有的分支，我的征程是星河大海，冲吖！</p>
          </div>
        </div>
        <div class="concat">
          <h1 style="color: #827717">Concat us</h1>
          <ul>
            <li>
              <img src="../../assets/icon-img/youxiang.svg" alt="" class="icon-img">s0mnam.fn@gmail.com
            </li>
            <li>
              <img src="../../assets/icon-img/github.svg" alt="" class="icon-img">
              <a href="https://github.com/Somnams">Somnams</a>
            </li>
            <li>
              <img src="../../assets/icon-img/qq.svg" alt="" class="icon-img"> 3244345132@qq.com
            </li>
          </ul>
        </div>
        <br>
        <br>
      </div>
    </div>
</template>

<script>
import NavBar from '../../components/common/nav/NavBar'
export default {
  name: 'About',
  components: {
    NavBar
  }
}
</script>

<style scoped>
  .serendipity {
    font-weight: bold;
    text-shadow: 0 0 4px #ee9ca7;
  }
  .steam {
    height: 260px;
    position: relative;
    margin-top: 50px;
  }
  .steam-p {
    position: absolute;
    left: 160px;
  }
  .somnam-jpg {
    box-shadow: 5px 4px 6px 4px #000;
    overflow: hidden;
    float: left;
    height: 100px;
    width: 100px;
    border-radius: 50%;
  }
  .somnam-jpg img {
    width: auto;
    height: 100%;
  }
  /*.concat {*/
  /*  margin-top: 50px;*/
  /*}*/
</style>
