class MiniNavBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="navbar-flex-center-row">
      <img src="../../images/logo.png" width="30px" height="30px" />
      <input type="text" placeholder="Search.." class="side-searchbar" />
      <button id="dropdownButton" class="dropdown-btn" onclick="handleDropdownClick()">
        <a id="notificationsButton" href="#">
          <i id="dropdownButtonIcon" class="fa-regular fa-bell"></i>
        </a>
      </button>
      <a href="#" style="padding: 2px" onclick="handleUserDropdownClick()">
        <img src="../../images/profile_photo.png" width="30px" height="30px" id="profilePic" />
      </a>
      <img src="../../images/hamburger.png" width="30px" height="30px" onclick="openSideNavbar()" />
    </div>
            `;
  }
}

customElements.define("mininavbar-component", MiniNavBar);
