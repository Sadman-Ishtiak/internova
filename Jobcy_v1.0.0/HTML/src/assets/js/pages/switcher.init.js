//
/********************* Swicher js ************************/
//

function toggleSwitcher() {
  var i = document.getElementById("style-switcher");
  if (i.style.left === "-165px") {
    i.style.left = "-0px";
  } else {
    i.style.left = "-165px";
  }
}

function setColor(theme) {
  document.getElementById('bootstrap-style').href = 'assets/css/bootstrap-' + theme + '.min.css';
  document.getElementById('app-style').href = 'assets/css/app-' + theme + '.min.css';
};

function setColorGreen() {
  document.getElementById('bootstrap-style').href = 'assets/css/bootstrap.min.css';
  document.getElementById('app-style').href = 'assets/css/app.min.css';

};

//
/********************* light-dark js ************************/
//

var btn = document.getElementById("mode");
btn.addEventListener("click", function (e) {
  var theme = localStorage.getItem("theme");
  if (theme == "light" || theme == "") {
    document.body.setAttribute("data-layout-mode", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.removeAttribute("data-layout-mode");
    localStorage.setItem("theme", "light");
  }
});

//
/********************* scroll top js ************************/
//

var mybutton = document.getElementById("back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

//
/********************* Page Load js ************************/
//

var preloader = document.getElementById("preloader");

window.addEventListener("load", function () {
  preloader.style.opacity = "0";
  preloader.style.visibility = "hidden";
});

// Favourite btn
var favouriteBtn = document.getElementsByClassName("bookmark-btn");
for (var i = 0; i < favouriteBtn.length; i++) {
  var favouriteBtns = favouriteBtn[i];
  favouriteBtns.onclick = function () {
    favouriteBtns.classList.toggle("active");
  };
}
