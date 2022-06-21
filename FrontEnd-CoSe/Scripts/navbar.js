var clickedNotifications = false;
var clickedProfile = false;

// Click on notifications panel
function handleDropdownClick() {
  const dropdownUser = document.getElementById("myDropdownPpic");
  if (dropdownUser.classList.contains("show")) {
    dropdownUser.classList.toggle("show");
    const profilePicArrow = document.getElementById("profilePicArrow");
    if (clickedProfile == false) {
      profilePicArrow.className = "fa-solid fa-caret-up";
      clickedProfile = true;
    } else {
      profilePicArrow.className = "fa-solid fa-caret-down";
      clickedProfile = false;
    }
  }
  const dropdownButton = document.getElementById("notificationsButton");
  dropdownButton.classList.toggle("background-color-notifications");
}

// Click on user panel
function handleUserDropdownClick() {
  const dropdownUser = document.getElementById("myDropdownPpic");
  dropdownUser.classList.toggle("show");
  const profilePicArrow = document.getElementById("profilePicArrow");
  if (clickedProfile == false) {
    profilePicArrow.className = "fa-solid fa-caret-up";
    clickedProfile = true;
  } else {
    profilePicArrow.className = "fa-solid fa-caret-down";
    clickedProfile = false;
  }
}

// Click on hamburger
function openSideNavbar() {
  const sideNavBar = document.getElementById("sideNavbar");
  sideNavBar.classList.toggle("show");
}

window.onclick = function (event) {
  // Close the notifications dropdown menu if the user clicks outside of it
  if (!(event.target.id == "dropdownButtonIcon")) {
    const dropdownButton = document.getElementById("notificationsButton");
    const dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
        dropdownButton.classList.toggle("background-color-notifications");
        clickedNotifications = false;
      }
    }
  }

  // Close the profile dropdown menu if the user clicks outside of it
  if (!(event.target.id == "profilePic")) {
    const dropdowns = document.getElementsByClassName("dropdown-content-ppic");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
        const profilePicArrow = document.getElementById("profilePicArrow");
        profilePicArrow.className = "fa-solid fa-caret-down";
        clickedProfile = false;
      }
    }
  }
};

function clearLocalStorage() {
  console.log("Local storage clear");
  localStorage.clear();
  location.href="../Login/login.html";
}

function initializeNavbar(userData) {
  if (userData) {
    document.getElementById("userNameNav").innerHTML = userData.firstName + " " + userData.lastName;
    document.getElementById("userRoleNav").innerHTML = userData.roles;
    if (userData.roles === Roles.AUTHORITY) {
      document.getElementById("addSheltersNav").style.display = "block";
    }
  }
  else {
    document.getElementById("addEventsNav").style.display = "none";
  }
}
