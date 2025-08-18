export default function initCarousel() {
  const container = document.querySelector('.container');
  if (!container) {
    console.warn('Carousel container not found');
    return;
  }

  const carouselInner = container.querySelector('.carousel__slides-container');
  if (!carouselInner) {
    console.warn('Carousel inner element not found');
    return;
  }

  const slideCount = container.querySelectorAll('.carousel__slide').length;
  const btnPrev = container.querySelector('.carousel__prev-button');
  const btnNext = container.querySelector('.carousel__next-button');

  let currentSlide = 0;
  const slideWidth = parseFloat(window.getComputedStyle(carouselInner).width);

  updateButtons();

  function moveSlide() {
    const translateDistance = -currentSlide * slideWidth;
    carouselInner.style.transform = `translateX(${translateDistance}px)`;
  }

  function updateButtons() {
    btnPrev.style.visibility = currentSlide === 0 ? 'hidden' : 'visible';
    btnNext.style.visibility = currentSlide === slideCount - 1 ? 'hidden' : 'visible';
  }
  
  function prev() {
    if (currentSlide > 0) {
      currentSlide--;
      moveSlide();
    }
  }

  function next() {
    if (currentSlide < slideCount - 1) {
      currentSlide++;
      moveSlide();
    }
  }

  container.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('.carousel__prev-button, .carousel__next-button');
    if (!clickedButton) return;

    if (clickedButton.classList.contains('carousel__prev-button')) {
      prev();
    } else if (clickedButton.classList.contains('carousel__next-button')) {
      next();
    }

    updateButtons();
  });

}
