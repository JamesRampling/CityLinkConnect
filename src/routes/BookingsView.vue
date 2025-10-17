<template>
  <h1>Service Bookings</h1>
  <router-link to="/booking/0">New</router-link>
  <div class="slideshow">
    <div class="slide">
      <div class="background-Image"></div>
      <div class="Textbox"></div>
    </div>

    <div class="slide">
      <div class="background-Image"></div>
      <div class="Textbox"></div>
    </div>

    <div class="slide">
      <div class="background-Image"></div>
      <div class="Textbox"></div>
    </div>

    <div class="slide">
      <div class="background-Image"></div>
      <div class="Textbox"></div>
    </div>

    <div class="Nav">
      <a class="prev" onclick="plusSlides(-1)">&#129032;</a>
      <a class="next" onclick="plusSlides(1)">&#129034;</a>
    </div>
  </div>

  <div></div>
</template>

<script lang="ts">
/**
  let slideIndex = 0;
  showSlides();

  function showSlides() {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
  }
  **/
</script>

<style lang="css" scoped>
.slideshow {
  width: auto;
  padding: 2rem;
  position: relative;
  margin: auto;
}
.slide {
  display: none;
}
.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
}

.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.dot {
  cursor: pointer;
  height: 15px;
  width: 15px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.active,
.dot:hover {
  background-color: #717171;
}

.fade {
  animation-name: fade;
  animation-duration: 1.5s;
}

@keyframes fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

.numbertext {
  color: #f2f2f2;
  font-size: 12px;
  padding: 8px 12px;
  position: absolute;
  top: 0;
}

.text {
  color: #f2f2f2;
  font-size: 15px;
  padding: 8px 12px;
  position: absolute;
  bottom: 8px;
  width: 100%;
  text-align: center;
}
</style>
