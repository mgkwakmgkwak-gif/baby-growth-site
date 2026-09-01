// 공통 스크립트: 모바일 내비게이션 토글
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      var expanded = nav.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });

    // 메뉴 항목 클릭 시 모바일 메뉴 닫기
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  // 다른 드롭다운이 열려 있으면 닫기
  document.querySelectorAll(".nav-dropdown").forEach(function (dd) {
    dd.addEventListener("toggle", function () {
      if (dd.open) {
        document.querySelectorAll(".nav-dropdown").forEach(function (other) {
          if (other !== dd) other.open = false;
        });
      }
    });
  });

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
