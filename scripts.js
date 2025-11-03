window.addEventListener("DOMContentLoaded", () => {
  const inputsColor = document.querySelectorAll('input[name=product_color]');
  const formColorLabel = document.getElementById('productColorValue');
  inputsColor.forEach((input) => {
    input.addEventListener('change', (e) => {
      formColorLabel.innerText = e.target.dataset.nameDisplay;
    });
  });

  const inputsQuantity = document.querySelectorAll('.input-quantity');
  inputsQuantity.forEach((input) => {
    const inputField = input.querySelector('.input-quantity__field');
    const inputBtnIncrease = input.querySelector('.input-quantity__btn[data-action=increase]');
    const inputBtnDecrease = input.querySelector('.input-quantity__btn[data-action=decrease]');

    function toggleDecreaseBtnAttrs(inputValue) {
      const isValueValid = inputValue > 1;

      if (isValueValid) {
        inputBtnDecrease.removeAttribute('disabled');
      } else  {
        inputBtnDecrease.setAttribute('disabled', '1');
      }
    }

    inputField.addEventListener('input', (evt) => {
      toggleDecreaseBtnAttrs(evt.target.value)
    });
    inputBtnIncrease.addEventListener('click', () => {
      const initialValue = inputField.value * 1;
      const newValue = initialValue + 1;
      inputField.value = newValue;
      toggleDecreaseBtnAttrs(newValue)
    });
    inputBtnDecrease.addEventListener('click', () => {
      const initialValue = inputField.value * 1;
      const newValue = initialValue - 1;
      toggleDecreaseBtnAttrs(newValue)

      if (newValue > 0) inputField.value = newValue;
    });    
  });

  const accordions = document.querySelectorAll('.accordion__item');
  accordions.forEach((accordion) => {
    const accordionTitle = accordion.querySelector('.accordion__item-title');
    accordionTitle.addEventListener('click', () => {
      accordion.classList.toggle('accordion__item_active');
      const title = accordion.querySelector('.accordion__item-title');
      if (accordion.classList.contains('accordion__item_active')) {
        title.setAttribute('aria-expanded', 'true');
      } else {
        title.setAttribute('aria-expanded', 'false');   
      }
    });    
  });

  const modalTarget = document.querySelectorAll('.modal-target');
  let activeModalTarget = null;
  modalTarget.forEach((modalTarget)=> {
    modalTarget.addEventListener('click', ()=> {
      const modalWindow = document.querySelector('.modal');
      const modalClose = modalWindow.querySelector('.js__modal-close');
      showModal(modalWindow, modalTarget);

      if (modalClose) {
        modalClose.focus();
      }
    });
  });

  const modalBackdrop = document.querySelectorAll('.modal-backdrop');
  modalBackdrop.forEach((modalBackdrop)=> {
    modalBackdrop.addEventListener('click', (e) => {

      const modalWindow = e.target.closest('.modal');
      closeModal(modalWindow);
    });
  });

  const modalClose = document.querySelectorAll('.js__modal-close');
  modalClose.forEach((modalClose) => {
    modalClose.addEventListener('click', (e) => {
      const modalWindow = e.target.closest('.modal');
      closeModal(modalWindow);
    });
  })

  const showModal = (modalWindow, modalTarget) => {
    modalWindow.classList.add('show-modal');
    activeModalTarget = modalTarget;
  }

  const closeModal = (modalWindow) => {
    modalWindow.classList.remove('show-modal');

    if (!activeModalTarget) return;

    activeModalTarget.focus();
    activeModalTarget = null;
  }
})