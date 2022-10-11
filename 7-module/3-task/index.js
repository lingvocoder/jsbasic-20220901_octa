import createElement from "../../assets/lib/create-element.js";

export default class StepSlider {
  elem

  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
    this.addEventListeners();
  }

  render() {
    this.elem = createElement(this.getSlider());
    this.getSteps();
    this.setStepActive();
  }

  getSlider() {
    return `
            <div class="slider">
                <div class="slider__thumb" style="left: 50%;">
                    <span class="slider__value">${this.value}</span>
                </div>
                <div class="slider__progress" style="width: 50%;"></div>
                <div class="slider__steps">
                </div>
            </div>
    `;
  }

  getSteps = () => {
    let counter = 0;
    while (counter <= this.steps - 1) {
      this.elem.querySelector('.slider__steps').innerHTML += `
        <span data-value="${counter}" ></span>
        `;
      counter++;
    }
  }

  setStepActive = () => {
    const steps = [...this.elem.querySelectorAll('span[data-value]')];
    steps.forEach(step => {
      step.classList.remove('slider__step-active');
    });
    const activeStep = steps.find(span => span.dataset.value === String(this.value));
    activeStep.classList.add('slider__step-active');
  }

  addEventListeners() {
    this.elem.addEventListener('click', (ev) => {
      this.onStepClick(ev);
      this.setStepActive();
      this.onStepSelected();
    });
  }

  onStepClick = (ev) => {
    const valueOutput = document.querySelector('.slider__value');
    let {value, percent} = this.calculateLeftOffset(ev);
    valueOutput.textContent = String(value);
    this.value = value;

    this.changeProgressBarWidth(percent);
    this.changeSliderThumbPosition(percent);
  }

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
  }

  changeSliderThumbPosition = (percent) => {
    const progressBar = document.querySelector('.slider__thumb');
    progressBar.style.left = `${percent}%`;
  }

  changeProgressBarWidth = (percent) => {
    const progressBar = document.querySelector('.slider__progress');
    progressBar.style.width = `${percent}%`;
  }

  onStepSelected = () => {
    const event = new CustomEvent('slider-change', {
      bubbles: true,
      detail: this.value,
    });
    this.elem.dispatchEvent(event);
  }
}
