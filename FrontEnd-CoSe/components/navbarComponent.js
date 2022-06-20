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
                <li>
                  <button
                    id="dropdownButton"
                    class="dropdown-btn"
                    onclick="handleDropdownClick()"
                  >
                    <a id="notificationsButton" href="#">
                      <i id="dropdownButtonIcon" class="fa-regular fa-bell"></i>
                      <span class="badge"></span>
                    </a>
                  </button>
                </li>
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
          <div id="myDropdown" class="dropdown-content">
            <div class="notifications-title1">Notifications</div>
            <div id="dsdd" class="notificationsPanel">
              <div class="notifications-title2">New</div>
              <a href="#">
                <div style="flex-column">
                  <div class="notifications-text1">Notification 1: Lorem ipsum dolor sit amet</div>
                  <div class="notifications-text2">- 2 hours ago</div>
                </div>
              </a>
              <a href="#">
                <div style="flex-column">
                  <div class="notifications-text1">Notification 2: Lorem ipsum dolor sit amet</div>
                  <div class="notifications-text2">- 8 hours ago</div>
                </div>
              </a>
              <div class="notifications-title2">Earlier</div>
              <a href="#">
                <div style="flex-column">
                  <div class="notifications-text1">Notification 3: Lorem ipsum dolor sit amet</div>
                  <div class="notifications-text2">- 12 hours ago</div>
                </div>
              </a>
              <a href="#">
                <div style="flex-column">
                  <div class="notifications-text1">Notification 4: Lorem ipsum dolor sit amet</div>
                  <div class="notifications-text2">- 18 hours ago</div>
                </div>
              </a>
              <a href="#">
                <div style="flex-column">
                  <div class="notifications-text1">Notification 5: Lorem ipsum dolor sit amet</div>
                  <div class="notifications-text2">- 1 day ago</div>
                </div>
              </a>
              <a href="#">
                <div style="flex-column">
                  <div class="notifications-text1">Notification 6: Lorem ipsum dolor sit amet</div>
                  <div class="notifications-text2">- 3 days ago</div>
                </div>
              </a>
              <a href="#">
                <div style="flex-column">
                  <div class="notifications-text1">Notification 7: Lorem ipsum dolor sit amet</div>
                  <div class="notifications-text2">- 1 week ago</div>
                </div>
              </a>
            </div>
          </div>
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
            <a href="#"><i class="fa-solid fa-user" style="padding-right: 10px;"></i>Account</a>
            <a href="#"><i class="fa-solid fa-gear" style="padding-right: 10px;"></i>Settings</a>
            <a href="../ChangePassword/changePassword.html"><i class="fa-solid fa-key" style="padding-right: 10px;"></i>Change Password</a>
            <a href="../Login/login.html"><i class="fa-solid fa-right-from-bracket" style="padding-right: 10px;"></i>Log out</a>
          </div>
        `;
  }
}

customElements.define("navbar-component", NavBar);
