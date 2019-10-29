'use strict';
(function () {
  var footerList = document.querySelector('.footer__link-list');
  var footerSublist = footerList.querySelectorAll('.footer__link-sublist');
  var footerSublistArray = Array.from(footerSublist);

  var mediaQueryList = window.matchMedia("(max-width: 767px)");
  function handleMediaChange(evt) {
    if (evt.matches) {
      footerSublistArray.map(function(elem) {
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

    var target = evt.target;
    var sublistTitle = target.closest('.footer__wrapper-title');
    var sublist = sublistTitle.nextElementSibling;

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
      title.classList.remove('accordion-open');
    } else {
      list.style.maxHeight = list.scrollHeight + 'px';
      title.classList.add('accordion-open');
    }

  }
})();
