const pageSize = 8;
var curPage;
var eventsData = [];
var earthquakesData = [];
var floodsData = [];
var sheltersData = [];
var userInfo = {};

async function initialize() {
    //Get User Info (Role, Name, etc.)
    const userData = await getUserByEmail();

    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("homeComponent").style.display = "block";

    //Initialize Events Table
    onInitialized(userData);

    //Initialize NavBar
    initializeNavbar(userData);

    //Initialize Admin Table if user role is Authority
    if (userData.roles === Roles.AUTHORITY) {
        document.getElementById("civilianEventsTitle").style.display = "block";
        document.getElementById("adminLoader").style.display = "block";
        
        onAdminInitalized(userData);
    }
}

async function onInitialized(userData) {
    curPage = 1;
    userInfo = userData;

    //Get events from database
    eventsData = await getEvents();

    //Get earthquakes from API and concatenate with events array
    earthquakesData = await getEarthquakesApi();
    console.log("Earthquakes: ", earthquakesData);
    eventsData = eventsData.concat(earthquakesData);

    //Get floods from API and concatenate with events array
    floodsData = await getFloodsApi();
    console.log("Floods: ", floodsData);
    eventsData = eventsData.concat(floodsData);

    //Sort events desc by date of occurence
    eventsData = eventsData.sort((e1, e2) => (new Date(e2.date) - new Date(e1.date)));
    console.log("All events: ", eventsData);

    //Loading Panel for loading table data
    document.getElementById("loader").style.display = "none";

    //Render Events Table
    renderEventTable(1);

    //Get shelters from database
    sheltersData = await getShelters();

    //Loading Panel for shelters list
    document.getElementById("sheltersLoader").style.display = "none";

    //Render Shelters List
    renderSheltersList()
   
}

async function getEvents()  {
    const response = await fetch('http://localhost:5003/api/events');
    console.log('Get Events Response: ', response);
    
    if (response.status == 200) {
        let data = await response.json();
        console.log('Get Events Data: ', data);

        data = data.map(event => {
            const utcDate = new Date(event.date); // Get the UTC date
            const eventDate = new Date(utcDate.getTime() - new Date().getTimezoneOffset() * 60000); // Convert it to local date

            return {
            ...event,
            date: eventDate,
            source: 'Local authorities'}
        });

        return data;
    }

    return [];
}

async function getShelters()  {
    const response = await fetch('http://localhost:5004/api/shelters');
    console.log('Get Shelters Response: ', response);
    
    if (response.status == 200) {
        const data = await response.json();
        console.log('Get Shelters Data: ', data);
        return data;
    }

    return [];
}

async function getEarthquakesApi() {
    const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=10')
    console.log('Response: ', response)
    
    const data = await response.json()
    console.log('Data: ', data)

    const earthquakes = data.features.map(event => {
        if (event.properties.mag < 2) {
            var code = 'yellow';
        } else if (event.properties.mag < 4) {
            var code = 'orange';
        } else {
            var code = 'red';
        }

        return {
            name: event.properties.title,
            status: 'completed',
            location: event.properties.place,
            category: 'earthquake',
            date: new Date(event.properties.time),
            timeOfOccurence: new Date(event.properties.time).toLocaleTimeString('en-UK'),
            dateOfOccurence: new Date(event.properties.time).toLocaleDateString('en-UK'),
            code: code,
            source: 'USGS Earthquake Catalog'
        }
    })

    return earthquakes;
}

async function getFloodsApi() {
    const response = await fetch('http://environment.data.gov.uk/flood-monitoring/id/floodAreas?_limit=10')
    
    const data = await response.json();

    const floods = data.items.map(event => {
        const random = Math.floor(Math.random() * 3);
        if (random == 0) {
            var code = 'yellow';
        } else if (random == 1) {
            var code = 'orange';
        } else {
            var code = 'red';
        }

        const utcDate = new Date().setUTCHours(0,0,0,0);

        return {
            name: event.label,
            status: 'pending',
            location: event.county,
            category: 'flood',
            date: new Date(utcDate),
            timeOfOccurence: new Date(utcDate).toLocaleTimeString('en-UK'),
            dateOfOccurence: new Date(utcDate).toLocaleDateString('en-UK'),
            code: code,
            source: 'Environment Agency Real Time Flood-Monitoring'
        }
    });

    return floods;
}

function previousPage() {
    if (curPage > 1) {
        curPage--;
        renderEventTable(curPage);
    }
}
  
function nextPage() {
    if ((curPage * pageSize) < eventsData.length) {
        curPage++;
        renderEventTable(curPage);
    }
}

function numPages() {
    return Math.ceil(eventsData.length / pageSize);
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function renderEventTable(page) {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    prevButton.style.visibility = "visible";
    nextButton.style.visibility = "visible";

    if (page == 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }
    
    if (page == numPages()) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }

    const tableHead = document.getElementById('tableHead');
    if (userInfo.roles === Roles.AUTHORITY) {
        tableHead.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Location</th>
            <th>Category</th>
            <th>Time of occurrence</th>
            <th>Date of occurrence</th>
            <th>Code</th>
            <th>Source</th>
            <th>Actions</th>
        </tr>`;
    } else {
        tableHead.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Location</th>
            <th>Category</th>
            <th>Time of occurrence</th>
            <th>Date of occurrence</th>
            <th>Code</th>
            <th>Source</th>
        </tr>`;
    }
    
    const tableBody = document.getElementById('tableBody');

    if (document.querySelector('#tableBody').firstChild) {
        removeAllChildNodes(document.querySelector('#tableBody'));
    }

    const events = JSON.parse(JSON.stringify(eventsData)).filter((row, index) => {
        let start = (curPage - 1) * pageSize;
        let end = curPage * pageSize;
        if (index >= start && index < end) return true;
    });

    for (let i = 0; i < events.length; i++) {
        const row = document.createElement('tr');

        let event = events[i];

        const column1 = document.createElement('td');
        column1.innerHTML = event.name;

        const column2 = document.createElement('td');

        const image = document.createElement('img');
        image.width = '17';
        image.height = '17';
        if (event.status == 'completed') {
            image.src = '../../images/completeIcon.png';
        }
        else if (event.status == 'pending') {
            image.src = '../../images/progressIcon.png';
        }
        else if (event.status == 'new') {
            image.src = '../../images/newIcon.png';
        }

        column2.append(image);
        
        const column3 = document.createElement('td');
        column3.innerHTML = event.location;

        const column4 = document.createElement('td');
        column4.innerHTML = event.category;

        const column5 = document.createElement('td');
        column5.innerHTML = event.timeOfOccurence;

        const column6 = document.createElement('td');
        column6.innerHTML = event.dateOfOccurence;

        const column7 = document.createElement('td');

        const column8 = document.createElement('td');
        column8.innerHTML = event.source;

        const code = document.createElement('button');
        code.className = "button";
        if (event.code == 'yellow') {
            code.style.backgroundColor = '#FDF539';
            code.innerHTML = 'Yellow';
        }
        else if (event.code == 'orange') {
            code.style.backgroundColor = '#ffa500';
            code.innerHTML = 'Orange';
        }
        else if (event.code == 'red') {
            code.style.backgroundColor = '#B22222';
            code.innerHTML = 'Red';
        }

        column7.append(code);

        row.append(column1);
        row.append(column2);
        row.append(column3);
        row.append(column4);
        row.append(column5);
        row.append(column6);
        row.append(column7);
        row.append(column8);

        //If user is authority, give access to edit and delete actions
        if (userInfo.roles === Roles.AUTHORITY) {
            const column9 = document.createElement('td');

            const editButton = document.createElement('i');
            editButton.className = 'fa-regular fa-pen-to-square hand-mouse';

            editButton.onclick = function() {
                if (event.source === 'Local authorities')
                    editEvent(event);
            }

            column9.append(editButton);

            const deleteButton = document.createElement('i');
            deleteButton.className = 'fa-regular fa-trash-can hand-mouse margin-left-8';

            deleteButton.onclick = function() {
                if (event.source === 'Local authorities')
                    deleteEvent(event.id);
            }

            column9.append(deleteButton);

            row.append(column9);
        }

        tableBody.append(row);
    }
}

async function deleteEvent(id) {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.innerHTML =
    `
    <h4 class="text-align-center margin-top-8">Are you sure you want to delete this event?</h4>
    <div class="flex-row flex-space-between-center">
        <button id="deleteButton" class="delete-button margin-left-12 hand-mouse">Delete</button>
        <button id="cancelDeleteButton" class="cancel-delete-button margin-left-12 hand-mouse">Cancel</button>
    </div>
    `;
    
    const deleteButton = document.getElementById('deleteButton');

    deleteButton.onclick = async function() {
        const response = await fetch(`http://localhost:5003/api/events/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + localStorage.jwt
        },
        body: id,
        });
        console.log('Delete Event Response: ', response);

        if (response.status == 200) {
            const data = await response.json();
            console.log('Delete Event Data: ', data);

            //afisare mesaj editat cu succes
            snackbar(document, 'Event deleted successfully!');

            //Delete event from events array
            eventsData = eventsData.filter(x => x.id !== id);

            //Rerender table afte event delete
            renderEventTable(curPage);
        }
        else if (response.status == 404) {
            //afisare eroare delete
            snackbar(document, 'Error in updating event!');
        }
        else if (response.status == 401) {
            //afisare mesaj unauthorized
            snackbar(document, 'Unauthorized!');
        }
        deleteModal.close();
    }

    const cancelButton = document.getElementById('cancelDeleteButton');

    cancelButton.onclick = function() {
        deleteModal.close();
    }

    deleteModal.showModal();
    
}

async function editEvent(event) {
    console.log(event);

    const editEventModal = document.getElementById('editModal');
    editEventModal.innerHTML =
    `
    <div class="flex-column margin-bottom-20 margin-top-20">
        <span class="margin-bottom-8 title-page">Edit event</span>
        <span class="subtitle-page">Describe the event just happened!</span>
    </div>
    <form id="editEventForm" class="flex-column">
        <div class="flex-column margin-bottom-24">
            <label class="label-text margin-bottom-8">Event title</label>
            <input class="input-place" type="text" name="eventTitle" placeholder="Event title" value="${event.name}" required />
        </div>

        <div class="flex-column margin-bottom-24">
            <label class="label-text margin-bottom-8">Event description</label>
            <textarea class="text-area" placeholder="Description" name="eventDescription" rows="10">${event.description}</textarea>
        </div>

        <div class="flex-row">
            <div class="flex-column margin-bottom-24 margin-right-16">
            <label class="label-text margin-bottom-8">Time of occurrence:</label>
            <input class="input-place" type="datetime-local" name="eventTime" value="${event.date.slice(0, -1)}" required>
            </div>
            <div class="flex-column margin-bottom-0">
            <label class="label-text margin-bottom-8" class="">Location</label>
            <input class="input-place" type="text" name="eventLocation" placeholder="Location" value="${event.location}" required />
            </div>
        </div>

        <div class="flex-row">
            <div class="flex-column margin-right-16 margin-bottom-0">
            <label class="label-text margin-bottom-8 margin-right-16">Category:</label>
            <select class="input-place" name="eventCategory" required>
                <option id="fire" value="fire">Fire</option>
                <option id="flood" value="flood">Flood</option>
                <option id="earthquake" value="earthquake">Earthquake</option>
                <option id="storm" value="storm">Storm</option>
            </select>
            </div>

            <div class="flex-column margin-right-16 margin-bottom-0">
            <label class="label-text margin-bottom-8 ">Code:</label>
            <select class="input-place" name="eventCode" required>
                <option id="yellow" value="yellow">Yellow</option>
                <option id="red" value="red">Red</option>
                <option id="orange" value="orange">Orange</option>
            </select>
            </div>

            <div class="flex-column">
            <label class="label-text margin-bottom-8">Status</label>
            <select class="input-place" name="eventStatus" required>
                <option id="new" value="new">New</option>
                <option id="pending" value="pending">In progress</option>
                <option id="completed" value="completed">Completed</option>
            </select>
            </div>
        </div>

        <div class="flex-row flex-space-between-center margin-top-40">
            <button id="saveEditButton" class="save-edit-button input-title text-align-center hand-mouse">
            Save
            </button>
            <button id="cancelEditButton" class="cancel-edit-button input-title text-align-center hand-mouse">
            Cancel
            </button>
        </div>
    </form>
    `;
    
    //Select correct option for event data
    const eventCategory = document.getElementById(`${event.category}`);
    eventCategory.selected = true;

    const eventCode = document.getElementById(`${event.code}`);
    eventCode.selected = true;

    const eventStatus = document.getElementById(`${event.status}`);
    eventStatus.selected = true;

    editEventModal.showModal();

    document.addEventListener('submit', (e) => {e.preventDefault()});

    const saveButton = document.getElementById('saveEditButton');
    saveButton.onclick = async function() {
        const form = document.getElementById('editEventForm');

        const formData = new FormData(form);

        console.log(formData.entries());

        const title = formData.get('eventTitle');
        const description = formData.get('eventDescription');
        const date = new Date(formData.get('eventTime'));
        const location = formData.get('eventLocation');
        const category = formData.get('eventCategory');
        const code = formData.get('eventCode');
        const status = formData.get('eventStatus');

        const updatedEvent = {
            'name': title,
            'status': status,
            'location': location,
            'category': category,
            'code': code,
            'date': date,
            'description': description
        };

        console.log('Updated Event: ', updatedEvent);

        const response = await fetch(`http://localhost:5003/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.jwt
        },
        body: JSON.stringify(updatedEvent),
        })
        console.log('Edit Event Response: ', response);

        if (response.status == 200) {
            const data = await response.json();
            console.log('Edit Event Data: ', data);

            //afisare mesaj editat cu succes
            snackbar(document, 'Event updated successfully!');

            //Rerender after event is edited
            onInitialized(userInfo);
        }
        else if (response.status == 404) {
            //afisare eroare editare
            snackbar(document, 'Error in updating event!');
        }
        else if (response.status == 401) {
            //afisare mesaj unauthorized
            snackbar(document, 'Unauthorized!');
        }

        editEventModal.close();
    }

    const cancelButton = document.getElementById('cancelEditButton');
    cancelButton.onclick = function() {
        editEventModal.close();
    }
}

function renderSheltersList() {
    const sheltersList = document.getElementById("sheltersList");

    for (let i = 0; i < sheltersData.length; i++) {
        const shelter = document.createElement('div');
        shelter.className = "container-content-news flex-space-between-center";
        shelter.innerHTML = 
        `
        <div class="flex-center-row">
            <img src="../../images/${sheltersData[i].category}.png" class="margin-right-16" alt="stormImage" width=117 height=117/>
            <div class="flex-column">
            <span class="input-title margin-bottom-20">${sheltersData[i].name}</span>
            <span class="text-image margin-bottom-4">Shelter for ${sheltersData[i].category}</span>
            </div>
        </div>
        <div class="flex-column">
            <span class="input-title margin-bottom-20">${sheltersData[i].location}</span>
            <span class="text-image margin-bottom-4">Capacity: ${sheltersData[i].capacity}</span>
        </div>
        `;

        //If user is authority, give access to edit and delete actions
        if (userInfo.roles === Roles.AUTHORITY) {
            const adminColumn = document.createElement('div');
            adminColumn.className = "flex-column";

            const editButton = document.createElement('i');
            editButton.className = 'fa-regular fa-pen-to-square hand-mouse';

            editButton.onclick = function() {
                editShelter(sheltersData[i]);
            }

            adminColumn.append(editButton);

            const deleteButton = document.createElement('i');
            deleteButton.className = 'fa-regular fa-trash-can hand-mouse margin-top-8';

            deleteButton.onclick = function() {
                console.log(sheltersData[i]);
            }

            adminColumn.append(deleteButton);

            shelter.append(adminColumn);
        }

        sheltersList.append(shelter);
    }
}

async function editShelter(shelter) {
    console.log(shelter);

    const editShelterModal = document.getElementById('editShelterModal');
    editShelterModal.innerHTML =
    `
    <div class="flex-column margin-bottom-20">
        <span class="margin-bottom-8 title-page">Edit shelter</span>
    </div>
    <form id="addEventForm" class="flex-column">
    <div class="flex-column margin-bottom-24">
        <label class="label-text margin-bottom-8">Shelter title</label>
        <input class="input-place" type="text" name="shelterTitle" placeholder="Shelter title" value=${shelter.name} required />
    </div>

    <div class="flex-column margin-bottom-24">
        <label class="label-text margin-bottom-8">Shelter description</label>
        <textarea class="text-area" placeholder="Description" name="shelterDescription" rows="10">${shelter.description}</textarea>
    </div>

    <div class="flex-row">
        <div class="flex-column margin-bottom-24 margin-right-16">
        <label class="label-text margin-bottom-8" class="">Location</label>
        <input id="autocompleteLocation" class="input-place" type="text" name="shelterLocation" placeholder="Location" value=${shelter.location} required />
        </div>
        <div class="flex-column margin-bottom-24 margin-right-16">
        <label class="label-text margin-bottom-8" class="">Capacity</label>
        <input class="input-place" type="number" name="shelterCapacity" placeholder="Capacity" value=${shelter.capacity} required />
        </div>
        <div class="flex-column margin-right-16 margin-bottom-0">
        <label class="label-text margin-bottom-8 margin-right-16">Category</label>
        <select class="input-place" name="shelterCategory" required>
            <option value="fire">Fire</option>
            <option value="flood">Flood</option>
            <option value="earthquake">Earthquake</option>
            <option value="storm">Storm</option>
        </select>
        </div>
    </div>

    <div class="flex-row flex-space-between-center margin-top-40">
        <button id="saveEditButton" class="save-edit-button input-title text-align-center hand-mouse">
        Save
        </button>
        <button id="cancelEditButton" class="cancel-edit-button input-title text-align-center hand-mouse">
        Cancel
        </button>
    </div>
    </form>
    `;

    editShelterModal.showModal();

    document.addEventListener('submit', (e) => {e.preventDefault()});

    // const saveButton = document.getElementById('saveEditButton');
    // saveButton.onclick = async function() {
    //     const form = document.getElementById('editEventForm');

    //     const formData = new FormData(form);

    //     console.log(formData.entries());

    //     const title = formData.get('eventTitle');
    //     const description = formData.get('eventDescription');
    //     const date = new Date(formData.get('eventTime'));
    //     const location = formData.get('eventLocation');
    //     const category = formData.get('eventCategory');
    //     const code = formData.get('eventCode');
    //     const status = formData.get('eventStatus');

    //     const updatedEvent = {
    //         'name': title,
    //         'status': status,
    //         'location': location,
    //         'category': category,
    //         'code': code,
    //         'date': date,
    //         'description': description
    //     };

    //     console.log('Updated Event: ', updatedEvent);

    //     const response = await fetch(`http://localhost:5003/api/events/${event.id}`, {
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + localStorage.jwt
    //     },
    //     body: JSON.stringify(updatedEvent),
    //     })
    //     console.log('Edit Event Response: ', response);

    //     if (response.status == 200) {
    //         const data = await response.json();
    //         console.log('Edit Event Data: ', data);

    //         //afisare mesaj editat cu succes
    //         snackbar(document, 'Event updated successfully!');

    //         //Rerender after event is edited
    //         onInitialized(userInfo);
    //     }
    //     else if (response.status == 404) {
    //         //afisare eroare editare
    //         snackbar(document, 'Error in updating event!');
    //     }
    //     else if (response.status == 401) {
    //         //afisare mesaj unauthorized
    //         snackbar(document, 'Unauthorized!');
    //     }

    //     editShelterModal.close();
    // }

    const cancelButton = document.getElementById('cancelEditButton');
    cancelButton.onclick = function() {
        editShelterModal.close();
    }
}

function htmlToCSV(filename) {
	var data = [];
    let row = []; // Header row

    row.push('NAME');
    row.push('STATUS');
    row.push('LOCATION');
    row.push('CATEGORY');
    row.push('TIME OF OCCURENCE');
    row.push('DATE OF OCCURENCE');
    row.push('CODE');
    row.push('SOURCE');
    row.push('DESCRIPTION');
            
    data.push(row.join(",")); 	

    for (let i = 0; i < eventsData.length; i++) {
        let row = []; // Row for data of event[i]

        row.push(eventsData[i].name);
        row.push(eventsData[i].status);
        row.push(eventsData[i].location);
        row.push(eventsData[i].category);
        row.push(eventsData[i].timeOfOccurence);
        row.push(eventsData[i].dateOfOccurence);
        row.push(eventsData[i].code);
        row.push(eventsData[i].source);
        row.push(eventsData[i].description);

        row = row.map(string => string === null ? '' : `\"${string}\"`); // export to csv considers to values that contatin ','

        data.push(row.join(",")); 
    }

	downloadCSVFile(data.join("\n"), filename);
}

function downloadCSVFile(csv, filename) {
	var csv_file, download_link;

	csv_file = new Blob([csv], {type: "text/csv"});

	download_link = document.createElement("a");
	download_link.download = filename;
	download_link.href = window.URL.createObjectURL(csv_file);
	download_link.style.display = "none";
    
	document.body.appendChild(download_link);
	download_link.click();
}

function viewMap() {
    location.href = "../Map/Map.html";
}