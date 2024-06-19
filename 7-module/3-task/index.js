import createElement from "../../assets/lib/create-element.js";

export default class StepSlider {
  elem = null;
  activeStep;


  constructor({steps = 0, value = 0}) {
    this.steps = steps;
    this.segments = [...Array(steps).keys()];
    this.value = value;
    this.render();
    this.addEventListeners();
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getSlider(this.segments));
      this.setDefaultParams(this.value);
      this.setStepActive();
    }
    return this.elem;
  }

  getSlider(segments) {
    return `
            <div class="slider">
                <div class="slider__thumb" style="left: 50%;">
                    <span class="slider__value">${this.value}</span>
                </div>
                <div class="slider__progress" style="width: 50%;"></div>
                <div class="slider__steps">
                ${this.getSteps(segments)}
                </div>
            </div>
    `;
  }

  getStep = (counter) => {
    return `<span data-value="${counter}"></span>`;
  };
  getSteps = (segments) => segments.map(step => this.getStep(step)).join('');

  setStepActive = () => {
    const steps = [...this.elem.querySelectorAll('span[data-value]')];
    const currStep = steps.find(span => span.dataset.value === String(this.value));
    if (this.activeStep) {
      this.activeStep.classList.remove('slider__step-active');
    }
    this.activeStep = currStep;
    this.activeStep.classList.add('slider__step-active');
  };

  addEventListeners() {
    this.elem.addEventListener('click', (ev) => {
      this.onStepClick(ev);
      this.setStepActive();
      this.onStepSelected();
    });
  }

  setDefaultParams(value) {
    const valueOutput = this.elem.querySelector('.slider__value');
    valueOutput.textContent = String(value);
    let percent = (value / (this.steps - 1)) * 100;
    this.changeProgressBarWidth(percent);
    this.changeSliderThumbPosition(percent);
  }

  onStepClick = (ev) => {
    const valueOutput = document.querySelector('.slider__value');
    let {value, percent} = this.calculateLeftOffset(ev);
    valueOutput.textContent = String(value);
    this.value = value;

    this.changeProgressBarWidth(percent);
    this.changeSliderThumbPosition(percent);
  };

  calculateLeftOffset = (ev) => {
    let left = ev.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;
    let segments = this.steps - 1;
    let approximateValue = Math.round(leftRelative * segments);
    let valuePercent = approximateValue / segments * 100;
    return {
      value: approximateValue,
      percent: valuePercent
    };
  };

  changeSliderThumbPosition = (percent) => {
    const progressBar = this.elem.querySelector('.slider__thumb');
    progressBar.style.left = `${percent}%`;
  };

  changeProgressBarWidth = (percent) => {
    const progressBar = this.elem.querySelector('.slider__progress');
    progressBar.style.width = `${percent}%`;
  };

  onStepSelected = () => {
    const event = new CustomEvent('slider-change', {
      bubbles: true,
      detail: this.value,
    });
    this.elem.dispatchEvent(event);
  };
}
