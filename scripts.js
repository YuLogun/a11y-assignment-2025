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
    const quantityLiveRegion = input.querySelector('.js__quantity-live-region');
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

    function setLiveRegionText(text) {
      quantityLiveRegion.textContent = text;
    }

    function clearLiveRegion() {
      setLiveRegionText('');
    }

    inputField.addEventListener('input', (evt) => {
      toggleDecreaseBtnAttrs(evt.target.value)
    });

    inputBtnIncrease.addEventListener('click', () => {
      const initialValue = inputField.value * 1;
      const newValue = initialValue + 1;
      inputField.value = newValue;
      toggleDecreaseBtnAttrs(newValue);
      setLiveRegionText('Quantity ' + newValue);
    });
    inputBtnDecrease.addEventListener('click', () => {
      const initialValue = inputField.value * 1;
      const newValue = initialValue - 1;
      toggleDecreaseBtnAttrs(newValue);

      if (newValue > 0) {
        inputField.value = newValue;
        setLiveRegionText('Quantity ' + newValue);
      }
    });

    inputBtnIncrease.addEventListener('blur', clearLiveRegion);
    inputBtnDecrease.addEventListener('blur', clearLiveRegion);
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

  const bodyEl = document.body;

  const modalTarget = document.querySelectorAll('.modal-target');
  let activeModalTarget = null;
  modalTarget.forEach((modalTarget)=> {
    modalTarget.addEventListener('click', ()=> {
      showModal(modalTarget);

      const modalClose = findActiveModalCloseBtn();
      if (!modalClose) return;

      modalClose.focus();
    });
  });

  const modalBackdrop = document.querySelectorAll('.modal-backdrop');
  modalBackdrop.forEach((modalBackdrop)=> {
    modalBackdrop.addEventListener('click', closeModal);
  });

  const modalClose = document.querySelectorAll('.js__modal-close');
  modalClose.forEach((modalClose) => {
    modalClose.addEventListener('click', closeModal);
  })

  function findActiveModalWindow() {
    if (!activeModalTarget) return;

    const modalId = activeModalTarget.id;
    return document.documentElement.querySelector(`[data-modal-id=${modalId}]`)
  }

  function findActiveModalCloseBtn() {
    const modalWindow = findActiveModalWindow();
    if (!modalWindow) return;

    return modalWindow.querySelector('.js__modal-close');
  }

  function listenToKeyPress(event) {
    const isEscapePressed = event.key === 'Escape';
    const isTabPressed = event.key === 'Tab';
    const isShiftTabPressed = isTabPressed && event.shiftKey;

    if (isEscapePressed) {
      closeModal();

      return;
    }

    if (isTabPressed || isShiftTabPressed) {
      const modalWindow = findActiveModalWindow();
      const modalClose = findActiveModalCloseBtn();
      const modalFocusableElements = modalWindow.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const modalFocusableElementsLength = modalFocusableElements.length
      const currentFocusedElement = document.activeElement;
      const currentFocusedElementIndex = [...modalFocusableElements].indexOf(currentFocusedElement);
      const isLastFocusableElementInModal = currentFocusedElementIndex === modalFocusableElementsLength - 1;
      const isFirstFocusableElementInModal = currentFocusedElementIndex === 0;

      if (
          (isTabPressed && isLastFocusableElementInModal)
          || (isShiftTabPressed && isFirstFocusableElementInModal)
      ) {
        event.preventDefault();
        modalClose.focus();
      }
    }
  }

  function createFocusableDiv() {
    const focusableDiv = document.createElement('div');
    focusableDiv.setAttribute('tabIndex', '0');

    return focusableDiv;
  }

  function showModal (modalTarget) {
    activeModalTarget = modalTarget;

    const modalWindow = findActiveModalWindow();

    if (!modalWindow) return;

    modalWindow.classList.add('show-modal');

    modalWindow.before(createFocusableDiv());
    modalWindow.after(createFocusableDiv());

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    bodyEl.style.paddingRight = `${scrollbarWidth}px`;
    bodyEl.classList.add('modal-opened');

    document.documentElement.addEventListener('keydown', listenToKeyPress);
  }

  function closeModal () {
    if (!activeModalTarget) return;

    const modalWindow = findActiveModalWindow();
    const modalWindowParent = modalWindow.parentElement;
    const beforeAddedDiv = modalWindow.previousSibling;
    const afterAddedDiv = modalWindow.nextSibling;

    modalWindowParent.removeChild(beforeAddedDiv);
    modalWindowParent.removeChild(afterAddedDiv);

    modalWindow.classList.remove('show-modal');

    bodyEl.style.paddingRight = '';
    bodyEl.classList.remove('modal-opened');

    document.documentElement.removeEventListener('keydown', listenToKeyPress);

    activeModalTarget.focus();
    activeModalTarget = null;
  }
})