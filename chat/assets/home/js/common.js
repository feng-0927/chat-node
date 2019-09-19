$(".group_tit").click(function () {
  $(this).parent().toggleClass("cheg");
})
$(document).ready()
$("#toggle-sidebar").click(function () {
  $("#dowebok").addClass("block");
})
$(function () {
  $('#dowebok').simplerSidebar({
    opener: '#toggle-sidebar',
    sidebar: {
      align: 'left',
      width: 500,
    }
  });
});


var mySwiper1 = new Swiper('.swiper1', {
  pagination: '.swiper-pagination',
  paginationType: 'fraction',
})

var mySwiper2 = new Swiper('#swiper-container2', {
  watchSlidesProgress: true,
  watchSlidesVisibility: true,
  slidesPerView: 5.5,
  onTap: function () {
    mySwiper3.slideTo(mySwiper2.clickedIndex)
  }
})

var mySwiper3 = new Swiper('#swiper-container3', {
  autoHeight: true,
  onSlideChangeStart: function () {
    updateNavPosition()
  }
})

function updateNavPosition() {
  $('#swiper-container2 .active-nav').removeClass('active-nav')
  var activeNav = $('#swiper-container2 .swiper-slide').eq(mySwiper3.activeIndex).addClass('active-nav');
  if (!activeNav.hasClass('swiper-slide-visible')) {
    if (activeNav.index() > mySwiper2.activeIndex) {
      var thumbsPerNav = Math.floor(mySwiper2.width / activeNav.width()) - 1
      mySwiper2.slideTo(activeNav.index() - thumbsPerNav)
    }
    else {
      mySwiper2.slideTo(activeNav.index())
    }
  }
}