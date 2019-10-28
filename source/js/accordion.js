'use strict';
(function () {
  // var sectionList = document.querySelector('.section__nav');
  // var adressList = document.querySelector('.adress__list');
  // var sectionButtonWrapper = document.querySelector('.section__wrapper');
  // var adressButtonWrapper = document.querySelector('.adress__wrapper');
  // var sectionButton = document.querySelector('.section__wrapper button');
  // var adressButton = document.querySelector('.adress__wrapper button');

  const footerList = document.querySelector('.footer__link-list');
  const footerSublist = footerList.querySelectorAll('.footer__link-sublist');
  const footerSublistArray = Array.from(footerSublist);

  console.log(footerList, footerSublist, footerSublistArray);


  var mediaQueryList = window.matchMedia("(max-width: 767px)");
  function handleMediaChange(evt) {
    if (evt.matches) {
      footerSublistArray.map((elem) => {
        elem.classList.remove('no-js');
      });
    }
  }
  mediaQueryList.addListener(handleMediaChange);
  handleMediaChange(mediaQueryList);

  if (footerList) {
    footerList.addEventListener('click', openAccordionListHandler);
  }

  function openAccordionListHandler(evt) {
    evt.preventDefault();
    const target = evt.target;
    const sublistTitle = target.closest('h3');
    const sublist = sublistTitle.nextElementSibling;

    if (window.matchMedia("(max-width: 767px)").matches) {

      if (sublistTitle) {
        addClassToList(sublistTitle, sublist);
      }

    }

    return;
  }

  function addClassToList(title, list) {

    if (list.style.maxHeight) {
      list.style.maxHeight = null;
    } else {
      list.style.maxHeight = list.scrollHeight + 'px';
    }

    title.classList.toggle('accordion-close');
    title.classList.toggle('accordion-open');
  }
})();
