const pageSize = 8;
var curPage;
var eventsData = [];
var userInfo = {};

async function onInitialized(userData) {
    curPage = 1;
    userInfo = userData;

    //Get events from database
    eventsData = await getEvents();

    //Get events from API -- TODO

    //Render Events Table
    renderEventTable(1);

    //Loading Panel for loading table data
    document.getElementById("loader").style.display = "none";
}

async function getEvents()  {
    const response = await fetch('http://localhost:5000/api/events', {
        method: 'GET', 
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.jwt
        }), 
    });
    console.log('Get Events Response: ', response);
    
    if (response.status == 200) {
        const data = await response.json();
        console.log('Get Events Data: ', data);
        return data;
    }

    return [];
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

        //If user is authority, give access to edit and delete actions
        if (userInfo.roles === Roles.AUTHORITY) {
            const column8 = document.createElement('td');

            const editButton = document.createElement('i');
            editButton.className = 'fa-regular fa-pen-to-square hand-mouse';

            editButton.onclick = function() {
                editEvent(event);
            }

            column8.append(editButton);

            const deleteButton = document.createElement('i');
            deleteButton.className = 'fa-regular fa-trash-can hand-mouse margin-left-8';

            deleteButton.onclick = function() {
                deleteEvent(event.id);
            }

            column8.append(deleteButton);

            row.append(column8);
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
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
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
            <input class="input-place" type="datetime-local" name="eventTime" value="${event.date}" required>
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

        const response = await fetch(`http://localhost:5000/api/events/${event.id}`, {
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

async function getUserByEmail()  {
    const response = await fetch(`http://localhost:5000/api/users?email=${localStorage.email}`, {
        method: 'GET', 
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.jwt
        }), 
    });
    console.log("User data response: ", response);

    if (response.status == 200) {
        const data = await response.json();
        console.log("User data: ", data);

        return data[0];
    }

    return false;
}