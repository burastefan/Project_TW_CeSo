class LoadingScreen extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
            <div id="loadingScreen">
                <div id="screenLoader" class="loader"></div>
                <div>Loading... Please wait</div>
            </div>  
          `;
    }
  }
  
  customElements.define("loading-screen", LoadingScreen);
  