class NavBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
          <nav class="stroke">
            <ul class="flex-space-between-center">
              <div class="flex-center-row">
                <li style="padding: 0">
                  <img src="../../images/logo.png" width="47" height="47" />
                </li>
                <li>
                  <input type="text" placeholder="Search.." class="searchbar" />
                </li>
              </div>
              <div class="flex-center-row">
                <li><a href="../Home/home.html">Home</a></li>
                <li><a href="../Events/events.html">Add Event</a></li>
                <li><a href="../Map/map.html">Map</a></li>
                <li><a href="../Earthquakes/earthquakes.html">Earthquakes</a></li>
                <li><a href="../Floods/floods.html">Floods</a></li>
                <li><a href="../Fires/fires.html">Fires</a></li>
                <li><a href="../Storms/storms.html">Storms</a></li>
              </div>
              <div class="flex-center-row">
                <li style="padding: 0">
                  <a href="#" style="padding: 2px" onclick="handleUserDropdownClick()">
                    <img
                      src="../../images/profile_photo.png"
                      width="43"
                      height="43"
                      id="profilePic"
                    />
                    <i id="profilePicArrow" class="fa-solid fa-caret-down"></i>
                  </a>
                </li>
              </div>
            </ul>
          </nav>
          <div id="myDropdownPpic" class="dropdown-content-ppic">
            <a>
              <div class="flex-row">
              <img
              src="../../images/profile_photo.png"
              width="43"
              height="43"
              id="profilePic"
              /><div class="flex-column">
                  <div class="profile-title">
                  Jessica Alba
                  </div>
                  <div class="role-title">
                  Civilian
                  </div>
                </div>
              </div>
            </a>
            <a href="../ChangePassword/changePassword.html"><i class="fa-solid fa-key" style="padding-right: 10px;"></i>Change Password</a>
            <a href="../Login/login.html"><i class="fa-solid fa-right-from-bracket" style="padding-right: 10px;"></i>Log out</a>
          </div>
        `;
  }
}

customElements.define("navbar-component", NavBar);
