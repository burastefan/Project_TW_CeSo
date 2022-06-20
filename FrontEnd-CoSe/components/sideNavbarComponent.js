class SideNavBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <div id="sideNavbar" class="side-navbar-component">
            <ul>
                <li>
                <h2>Menu</h2>
                </li>
                <li><a href="../Home/home.html">Home</a></li>
                <li><a href="../Map/map.html">Map</a></li>
                <li><a href="../Events/events.html">Add Event</a></li>
                <li><a href="../Fires/fires.html">Fires</a></li>
                <li><a href="../Earthquakes/earthquakes.html">Earthquakes</a></li>
                <li><a href="../Floods/floods.html">Floods</a></li>
                <li><a href="../Storms/storms.html">Storms</a></li>
            </ul>
            </div>
          `;
  }
}

customElements.define("sidenavbar-component", SideNavBar);
