var clickedNotifications = false;
var clickedProfile = false;

// Click on notifications panel
function handleDropdownClick() {
  const dropdownNotifications = document.getElementById("myDropdown");
  dropdownNotifications.classList.toggle("show");
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
  const dropdownNotifications = document.getElementById("myDropdown");
  if (dropdownNotifications.classList.contains("show")) {
    dropdownNotifications.classList.toggle("show");
    const dropdownButton = document.getElementById("notificationsButton");
    dropdownButton.classList.toggle("background-color-notifications");
  }
  const profilePicArrow = document.getElementById("profilePicArrow");
  if (clickedProfile == false) {
    profilePicArrow.className = "fa-solid fa-caret-up";
    clickedProfile = true;
  } else {
    profilePicArrow.className = "fa-solid fa-caret-down";
    clickedProfile = false;
  }
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
