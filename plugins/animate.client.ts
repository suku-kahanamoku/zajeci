import "animate.css";

export default defineNuxtPlugin(() => {
  animate();
  window.addEventListener("scroll", animate);
});

function animate() {
  document.querySelectorAll(".from-left").forEach((el) => {
    const bounding = el.getBoundingClientRect();
    if (bounding.top < window.innerHeight) {
      el?.classList.add("animate__animated", "animate__fadeInLeft");
    }
  });
  //
  document.querySelectorAll(".from-right").forEach((el) => {
    const bounding = el.getBoundingClientRect();
    if (bounding.top < window.innerHeight) {
      el?.classList.add("animate__animated", "animate__fadeInRight");
    }
  });
  //
  document.querySelectorAll(".from-top").forEach((el) => {
    const bounding = el.getBoundingClientRect();
    if (bounding.top < window.innerHeight) {
      el?.classList.add("animate__animated", "animate__fadeInDown");
    }
  });
  //
  document.querySelectorAll(".from-bottom").forEach((el) => {
    const bounding = el.getBoundingClientRect();
    if (bounding.top < window.innerHeight) {
      el?.classList.add("animate__animated", "animate__fadeInUp");
    }
  });
  //
  document.querySelectorAll(".zoom-in").forEach((el) => {
    const bounding = el.getBoundingClientRect();
    if (bounding.top < window.innerHeight) {
      el?.classList.add("animate__animated", "animate__zoomIn");
    }
  });
}
