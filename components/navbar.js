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
                <li><a href="../Map/map.html">Map</a></li>
                <li><a href="../Event/event.html">Events</a></li>
                <li><a href="../Fires/fires.html">Fires</a></li>
                <li><a href="../Earthquakes/earthquakes.html">Earthquakes</a></li>
                <li><a href="../Floods/floods.html">Floods</a></li>
                <li><a href="../Storms/storms.html">Storms</a></li>
              </div>
              <div class="flex-center-row">
                <li>
                  <button
                    id="dropdownButton"
                    class="dropdown-btn"
                    onclick="handleDropdownClick()"
                  >
                    <a href="#">
                      <i id="dropdownButtonIcon" class="fa-regular fa-bell"></i>
                    </a>
                  </button>
                </li>
                <li style="padding: 0">
                  <a href="#" style="padding: 2px">
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
            <a href="#">Notification 1</a>
            <a href="#">Notification 2</a>
            <a href="#">Notification 3</a>
          </div>
          <div id="myDropdownPpic" class="dropdown-content-ppic">
            <a href="#">Account</a>
            <a href="#">Settings</a>
            <a href="#">Change Password</a>
          </div>
        `;
    }
}

customElements.define('navbar-component', NavBar);