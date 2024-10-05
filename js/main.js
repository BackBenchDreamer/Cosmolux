import { cubicBezier } from "./utils.js";

const logEl = document.querySelector('.Log');
const containerEl = document.querySelector('.Parallax');
const scrollEl = document.querySelector('.Parallax_Scroll');

const s5Bg = document.querySelector('.Parallax_Layer-moiBg');
const s5Progress = document.querySelector('#s-moi-porgress');
const s5Spacecraft = document.querySelector('#s-moi-spacecraft');
const s5SpacecraftFire = document.querySelector('#s-moi-spacecraftFire');
const s5Texts = document.querySelectorAll('.moiText');

let containerWidth = 0;
let containerHeight = 0;
let scrollWidth = 0;
let scrollHeight = 0;
let scrollX = 0;
let scrollY = 0;
let scrollXSmoothed = 0;
let scrollYSmoothed = 0;
let velocityY = 0;
let touched = false;
let lastTouchY = 0;
let lastMove = 0;
let lastTime = 0;

const sceneRects = [];

// Function to handle resizing
function onResize() {
  containerWidth = containerEl.offsetWidth;
  containerHeight = containerEl.offsetHeight;

  scrollWidth = scrollEl.offsetWidth;
  scrollHeight = scrollEl.offsetHeight;

  const scene = document.querySelector('.Scene-5');
  sceneRects[0] = {
    top: scene.offsetTop,
    height: scene.offsetHeight
  };
}

window.addEventListener('resize', onResize);

containerEl.addEventListener('wheel', e => {
  e.preventDefault();
  velocityY += e.deltaY * 0.003;
});

function scroll(y) {
  y = Math.min(Math.max(0, y), scrollHeight - containerHeight);
  scrollY = y;
}

function step(now) {
  const dt = Math.min(now - lastTime, 150);
  lastTime = now;

  if (!touched) {
    velocityY += -velocityY * 0.003 * dt;
    if (Math.abs(velocityY) < 0.001) velocityY = 0;
    scrollY += velocityY * dt;

    if (scrollY < 0) {
      scrollY = velocityY = 0;
    }
    if (scrollY > scrollHeight - containerHeight) {
      scrollY = scrollHeight - containerHeight;
      velocityY = 0;
    }
  }

  scrollYSmoothed += (scrollY - scrollYSmoothed) / 5;

  const sy = Math.round(scrollYSmoothed * 1000) / 1000;

  scrollEl.style.setProperty('transform', `translateY(${-sy}px)`);

  // Scene 5
  const s5 = (sy + containerHeight - sceneRects[0].top) / (sceneRects[0].height + containerHeight);
  if (s5 >= 0 && s5 <= 1) {
    s5Bg.style.setProperty('--t', -119);
    const p = (s5 + 0.1) / 1.15;

    s5Progress.setAttribute('keyPoints', `${p}; ${p}`);
    s5Progress.beginElement();

    s5Spacecraft.style.setProperty('transform', `rotate(${
      -115 +
      cubicBezier(.2, 0, .5, 1, (p - 0.175) / 0.35) * 195 +
      cubicBezier(.2, 0, .8, 1, (p - 0.65) / 0.275) * -80
    }deg)`);

    s5SpacecraftFire.style.setProperty('transform', `scale(${
      cubicBezier(.1, 0, .8, 1, (p - 0.425) / 0.03) -
      cubicBezier(.1, 0, .8, 1, (p - 0.65) / 0.05)
    })`);

    s5Texts[0].classList.toggle('moiText-active', p >= 0.1 && p <= 0.35);
    s5Texts[1].classList.toggle('moiText-active', p >= 0.25 && p <= 0.5);
    s5Texts[2].classList.toggle('moiText-active', p >= 0.35 && p <= 0.675);
    s5Texts[3].classList.toggle('moiText-active', p >= 0.5 && p <= 0.75);
    s5Texts[4].classList.toggle('moiText-active', p >= 0.675 && p <= 0.8);
  }

  requestAnimationFrame(step);
}

onResize();
lastTime = performance.now();
requestAnimationFrame(step);
