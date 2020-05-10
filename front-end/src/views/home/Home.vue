<template>
  <div class="page">
    <main>
      <img class="myImg"  alt="" src="../../assets/user.jpeg"/>
      <p class="myName">
        <span>--</span>The good seaman is known in bad weather.<span>--</span>
      </p>
    </main>
    <nav id="home-nav">
      <router-link tag="a" to="/blog"><div class="anchor">click</div></router-link>
    </nav>
    <footer>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home'
}
</script>

<style scoped>
  .page {
    overflow-y: hidden;
  }
  #home-nav {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    z-index: 3;
    position: fixed;
    top: 45%;
    left: 65%;
    text-align: center;
    background: radial-gradient(circle at 50%, #434343, #c0c0c0 50%, #000 75%, #000);
    animation: navbar 3s infinite;
  }
  #home-nav div{
    color: white;
    margin-top: 45px;
    font-size: 28px;
  }
  #home-nav:hover{
    cursor: pointer;
  }
  @keyframes navbar{
    0%{
      opacity: 0.2;
    }
    50%{
      opacity: 0.4;
    }
    100%{
      opacity: 0.2;
    }
  }
  main {
    margin-top: 80px;
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    text-align: center;
    z-index: 1;
  }
  main::-webkit-scrollbar {
    display: none;
  }
  .myImg {
    z-index: 1;
    width: 20%;
    border-radius: 30%;
    margin-left: 40%;
    box-shadow: 0 0 4px 5px #434343;
    -webkit-box-reflect: below 20px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(250, 250, 250, 0.6)));
  }
  .myName {
    margin-top: -10px;
    z-index: 2;
    font-weight: bold;
    color: white;
  }
  footer {
    width: 100%;
    height: 100%;
    display: flex;
    z-index: 2;
  }
  footer li {
    position: absolute;
    list-style: none;
    display: block;
    bottom: -100px;
    width: 50px;
    height: 50px;
    background: radial-gradient(circle at 50%, #2c7744, #0f9b0f 50%, #000 75%, #000);
    border-radius: 50%;
    animation: balls 25s infinite linear;
  }
  footer li:nth-child(1) {
    left: 10%;
    width: 30px;
    height: 30px;
    background: radial-gradient(ellipse at center, #ee9ca7, #000);
  }
  footer li:nth-child(2) {
    left: 20%;
    animation-delay: 2s;
    animation-duration: 17s;
  }
  footer li:nth-child(3) {
    left: 30%;
    animation-delay: 4s;
    background: radial-gradient(circle at 50%, #434343, #c0c0c0 50%, #000 75%, #000);
  }
  footer li:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    animation-duration: 22s;
    background: radial-gradient(circle at 50%, #ee9ca7, #ffdde1 50%, #000 75%, #000);
  }
  footer li:nth-child(5) {
    left: 60%;
    width: 30px;
    height: 30px;
  }
  footer li:nth-child(6) {
    left: 80%;
    width: 90px;
    height: 90px;
    animation-delay: 3s;
  }
  footer li:nth-child(7) {
    left: 32%;
    width: 100px;
    height: 100px;
    animation-delay: 7s;
    background: radial-gradient(circle at 50%, #ee9ca7, #ffdde1 50%, #000 75%, #000);
  }
  footer li:nth-child(8) {
    left: 55%;
    width: 20px;
    height: 20px;
    animation-delay: 15s;
    animation-duration: 40s;
  }
  footer li:nth-child(9) {
    left: 70%;
    width: 30px;
    height: 30px;
    animation-delay: 2s;
    animation-duration: 40s;
    background: radial-gradient(ellipse at center, #ee9ca7, #000);
  }
  footer li:nth-child(10) {
    left: 85%;
    animation-delay: 11s;
  }
  @keyframes balls {
    0% {
      opacity: 0.1;
      top: 80%;
    }
    50% {
      opacity: 0.4;
      top: 50%;
    }
    70% {
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      top: 0;
    }
  }
</style>
