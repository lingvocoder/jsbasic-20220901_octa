import {createElement} from "../../assets/lib/create-element.js";

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
    this.elem.style.setProperty('--slider-progress', `${percent}%`);
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
    const steps = this.elem.querySelectorAll('.slider__steps span');

    if (this.activeStep) {
      this.activeStep.classList.remove('slider__step-active');
    }
    this.activeStep = steps[this.value];
    if (this.activeStep) {
      this.activeStep.classList.add('slider__step-active');
    }
  };

  addEventListeners() {
    this.elem.addEventListener('click', (ev) => {
      this.updateSliderPosition(ev);
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

  onPointerUp = () => {
    this.elem.classList.remove('slider_dragging');
    this.onStepSelected();
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  };

  updateSliderPosition = (ev) => {
    const valueOutput = this.elem.querySelector('.slider__value');
    let {value, percent} = this.calculateLeftOffset(ev);
    valueOutput.textContent = String(value);
    this.value = value;
    this.setStepActive();
    this.elem.style.setProperty('--slider-progress', `${percent}%`);
  };

  onDragThumb = (ev) => {
    const valueOutput = this.elem.querySelector('.slider__value');
    let {value, percent} = this.calculateDragLeftOffset(ev);
    valueOutput.textContent = String(value);
    this.value = value;
    this.elem.style.setProperty('--slider-progress', `${percent}%`);
  };

  calculateDragLeftOffset = (ev) => {
    const rect = this.elem.getBoundingClientRect();
    let left = ev.clientX - rect.left;
    if (left < 0) left = 0;
    if (left > rect.width) left = rect.width;

    let leftRelative =  Math.max(0, Math.min(1, left / rect.width));
    let segments = this.steps - 1;

    let leftPercent = leftRelative * 100;
    let approximateValue = Math.round(leftRelative * segments);
    return {
      value: approximateValue,
      percent: leftPercent
    };
  };

  calculateLeftOffset = (ev) => {
    const rect = this.elem.getBoundingClientRect();
    let left = ev.clientX - rect.left;
    if (left < 0) left = 0;
    if (left > rect.width) left = rect.width;

    let leftRelative = Math.max(0, Math.min(1, left / rect.width));
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

  onStepSelected = () => {
    const event = new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true,
    });
    console.log(event.detail);
    this.elem.dispatchEvent(event);
  };

}
