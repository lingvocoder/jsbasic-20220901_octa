function initCarousel() {
  const container = document.querySelector('.container');
  let slideCount = container.querySelectorAll('.carousel__slide').length;
  const carouselInner = container.querySelector('.carousel__inner');
  const btnPrev = container.querySelector('.carousel__arrow_left');
  const btnNext = container.querySelector('.carousel__arrow_right');
  let counter = 0;
  const slideWidth = parseFloat(window.getComputedStyle(carouselInner).width);
  checkEdgeSlides();

  function moveSlide() {
    let dist = -counter * slideWidth;
    carouselInner.style.transform = `translateX(${dist}px)`;
  }

  function checkEdgeSlides() {
    if (counter === 0) {
      btnPrev.style.display = 'none';
    } else {
      btnPrev.style.display = '';
    }
    if (counter === slideCount - 1) {
      btnNext.style.display = 'none';
    } else {
      btnNext.style.display = '';
    }
  }

  function prev() {
    counter--;
    moveSlide();
  }

  function next() {
    counter++;
    moveSlide();
  }

  container.addEventListener('click', (ev) => {
    const {target} = ev;
    const btnPrev = target.closest('.carousel__arrow_left');
    const btnNext = target.closest('.carousel__arrow_right');
    if (btnPrev) {
      prev();
    }
    if (btnNext) {
      next();
    }
    checkEdgeSlides();
  });

}

module.exports = initCarousel;
