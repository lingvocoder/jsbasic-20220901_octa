import createElement from "../../assets/lib/create-element.js";

export default class StepSlider {
  elem = null;
  activeStep = null;

  constructor({steps = 0, value = 0}) {
    this.steps = steps;
    this.value = value;
    this.render();
    this.addEventListeners();
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getSlider());
      let thumb = this.elem.querySelector('.slider__thumb');
      thumb.ondragstart = () => false;
      this.initSliderPosition();
      this.setStepActive();
    }
    return this.elem;
  }

  initSliderPosition = () => {
    const segments = this.steps - 1;
    const percent = segments > 0 ? (this.value / segments * 100) : 0;

    this.changeProgressBarWidth(percent);
    this.changeSliderThumbPosition(percent);
  };

  getSlider() {
    return `
            <div class="slider" role="slider"
            aria-valuemin="0"
            aria-valuemax="${this.steps - 1}"
            aria-valuenow="${this.value}"
            tabindex="0">
                <div class="slider__thumb">
                    <span class="slider__value">${this.value}</span>
                </div>
                <div class="slider__progress"></div>
                <div class="slider__steps">
                    ${this.getSteps()}
                </div>
            </div>
    `;
  }

  getStep = (step) => {
    return `<span data-value="${step}"></span>`;
  };

  getSteps = () => [...Array(this.steps).keys()].map(step => this.getStep(step)).join('');

  setStepActive = () => {
    const steps = [...this.elem.querySelectorAll('span[data-value]')];
    const currStep = steps.find(span => span.dataset.value === String(this.value));
    if (this.activeStep) {
      this.activeStep.classList.remove('slider__step-active');
    }
    this.activeStep = currStep;
    if (this.activeStep) {
      this.activeStep.classList.add('slider__step-active');
    }
  };

  addEventListeners() {
    this.elem.addEventListener('click', (ev) => {
      this.updateSliderPosition(ev);
      this.setStepActive();
      this.onStepSelected();
    });
    this.elem.addEventListener('pointerdown', this.onPointerDown);
  }

  onPointerDown = () => {
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp, {once: true});
  };

  onPointerMove = (ev) => {
    ev.preventDefault();
    this.elem.classList.add('slider_dragging');
    this.onDragThumb(ev);
    this.setStepActive();
  };

  onPointerUp = (ev) => {
    ev.preventDefault();
    this.elem.classList.remove('slider_dragging');
    this.onStepSelected();
    document.removeEventListener('pointermove', this.onPointerMove);
  };

  updateSliderPosition = (ev) => {
    const valueOutput = this.elem.querySelector('.slider__value');
    let {value, percent} = this.calculateLeftOffset(ev);
    valueOutput.textContent = String(value);
    this.value = value;
    this.changeProgressBarWidth(percent);
    this.changeSliderThumbPosition(percent);
  };

  onDragThumb = (ev) => {
    const valueOutput = this.elem.querySelector('.slider__value');
    let {value, percent} = this.calculateDragLeftOffset(ev);
    valueOutput.textContent = String(value);
    this.value = value;
    this.changeProgressBarWidth(percent);
    this.changeSliderThumbPosition(percent);
  };

  calculateDragLeftOffset = (ev) => {
    let left = ev.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;
    let segments = this.steps - 1;
    if (leftRelative < 0) {
      leftRelative = 0;
    }
    if (leftRelative > 1) {
      leftRelative = 1;
    }
    let leftPercent = leftRelative * 100;
    let approximateValue = Math.round(leftRelative * segments);
    return {
      value: approximateValue,
      percent: leftPercent
    };
  };

  calculateLeftOffset = (ev) => {
    let left = ev.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;
    const segments = this.steps - 1;
    if (segments === 0) {
      return {
        value: 0,
        percent: 0
      };
    }
    let approximateValue = Math.round(leftRelative * segments);
    let valuePercent = approximateValue / segments * 100;

    return {
      value: approximateValue,
      percent: valuePercent,
    };
  };

  changeSliderThumbPosition = (percent) => {
    const sliderThumb = this.elem.querySelector('.slider__thumb');
    sliderThumb.style.left = `${percent}%`;
  };

  changeProgressBarWidth = (percent) => {
    const progressBar = this.elem.querySelector('.slider__progress');
    progressBar.style.width = `${percent}%`;
  };

  onStepSelected = () => {
    const event = new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true,
    });
    this.elem.dispatchEvent(event);
  };

}
