<template>
    <div class="page">
      <nav-bar class="nav-bar"/>
      <header>
        <h1></h1>
      </header>
      <div class="main-content">
        <div class="about">
          <h2 style="color: #78909C">Something about this website</h2>
          <article>
            <p class="about-us-p">
              Hello, everyone.
              Thanking for you using our website...
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              when an unknown printer took a galley of type and scrambled it to make a type
              specimen book. It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply
              dummy text of the printing and typesetting industry.</p>
          </article>
        </div>
        <div class="steam">
          <h2 style="color: #455A64">Our steam</h2>
          <div>Alice</div>
          <div>Somnam</div>
          <div>Lise</div>
        </div>
        <div class="concat">
          <h2 style="color: #827717">Concat us</h2>
          <p class="about-us-p">
            Connect with Treeppo at:
          </p>
          <ul>
            <li>
              <img src="../../assets/icon-img/icon-test.svg" alt="" class="icon-img">155 *** 2606
            </li>
            <li>
              <img src="../../assets/icon-img/youxiang.svg" alt="" class="icon-img">Somnam@qq.com
            </li>
            <li>
              <img src="../../assets/icon-img/github.svg" alt="" class="icon-img">Somnams
            </li>
            <li>
              <img src="../../assets/icon-img/CN_bilibiliB.svg" alt="" class="icon-img"> XXX
            </li>
            <li>
              <img src="../../assets/icon-img/qq.svg" alt="" class="icon-img"> 3244345132@qq.com
            </li>
          </ul>
        </div>
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
  .about-us-p {
    text-align: center;
  }
</style>
