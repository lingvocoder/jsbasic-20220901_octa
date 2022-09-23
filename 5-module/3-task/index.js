function initCarousel() {
  const inner = document.querySelector('.carousel__inner');
  let slideCount = document.querySelectorAll('.carousel__slide').length;
  const innerWidth = document.querySelector('.carousel__inner').offsetWidth;
  const btnPrev = document.querySelector('.carousel__arrow_left');
  const btnNext = document.querySelector('.carousel__arrow_right');
  let counter = 0;
  const dist = innerWidth;
  btnPrev.style.display = 'none';

  btnPrev.addEventListener('click', function (ev) {
    const target = ev.target;
    const btnPrev = target.closest('.carousel__arrow_left');
    btnNext.style.display = '';
    if (!btnPrev) {
      return;
    }
    counter--;
    if (counter < 0) {
      counter = 0;
      return;
    }
    if (counter === 0) {
      btnPrev.style.display = 'none';
    } else {
      btnPrev.style.display = '';
    }
    inner.style.transform = `translateX(-${counter * dist}px)`;
  });
  btnNext.addEventListener('click', function (ev) {
    const target = ev.target;
    const btnNext = target.closest('.carousel__arrow_right');
    btnPrev.style.display = '';
    if (!btnNext) {
      return;
    }
    counter++;
    if (counter > slideCount - 1) {
      counter = slideCount - 1;
      return;
    }
    if (counter === slideCount - 1) {
      btnNext.style.display = 'none';
    } else {
      btnNext.style.display = '';
    }
    inner.style.transform = `translateX(-${counter * dist}px)`;
  });
}
