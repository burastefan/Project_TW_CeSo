class MiniNavBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="navbar-flex-center-row">
      <img src="../../images/logo.png" width="30px" height="30px" />
      <input type="text" placeholder="Search.." class="side-searchbar" />
      <a href="#" style="padding: 2px" onclick="handleUserDropdownClick()">
        <img src="../../images/profile_photo.png" width="30px" height="30px" id="profilePic" />
      </a>
      <img src="../../images/hamburger.png" width="30px" height="30px" onclick="openSideNavbar()" />
    </div>
            `;
  }
}

customElements.define("mininavbar-component", MiniNavBar);
