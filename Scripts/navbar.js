var clickedNotifications = false;
var clickedProfile = false;

// User clickedNotifications on notifications button
function handleDropdownClick() {
  const dropdown = document.getElementById("myDropdown");
  dropdown.classList.toggle("show");
  const dropdownButton = document.getElementById("dropdownButton");
  if (!clickedNotifications) {
    dropdownButton.style.backgroundColor = "#D3D3D3";
    clickedNotifications = true;
  } else {
    dropdownButton.style.backgroundColor = "transparent";
    clickedNotifications = false;
  }
}

function handleUserDropdownClick() {
  const dropdown = document.getElementById("myDropdownPpic");
  dropdown.classList.toggle("show");
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
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
        dropdownButton.style.backgroundColor = "transparent";
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
