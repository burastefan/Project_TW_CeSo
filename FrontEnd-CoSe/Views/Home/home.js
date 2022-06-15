const pageSize = 8
var curPage = 1
var eventsData = []
var currentDocument = new Document

async function onInitialized(document) {
    currentDocument = document

    eventsData = await getEvents()

    renderEventTable(1)

    currentDocument.getElementById("loader").style.display = "none"
    //LOADING PANEL
}

async function getEvents()  {
    const response = await fetch('http://localhost:5000/api/events')
    console.log('Response: ', response)
    
    const data = await response.json()
    console.log('Data: ', data)

    return data
}

function previousPage() {
    if (curPage > 1) {
        curPage--
        renderEventTable(curPage)
    }
}
  
function nextPage() {
    if ((curPage * pageSize) < eventsData.length) {
        curPage++
        renderEventTable(curPage)
    }
}

function numPages() {
    return Math.ceil(eventsData.length / pageSize)
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function renderEventTable(page) {
    const prevButton = currentDocument.getElementById('prevButton')
    const nextButton = currentDocument.getElementById('nextButton')
    prevButton.style.visibility = "visible"
    nextButton.style.visibility = "visible"

    if (page == 1) {
        prevButton.disabled = true
    } else {
        prevButton.disabled = false
    }
    
    if (page == numPages()) {
        nextButton.disabled = true
    } else {
        nextButton.disabled = false
    }

    const tableHead = currentDocument.getElementById('tableHead')
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
    </tr>`
    
    const tableBody = currentDocument.getElementById('tableBody')

    if (document.querySelector('#tableBody').firstChild) {
        removeAllChildNodes(document.querySelector('#tableBody'))
    }

    const events = JSON.parse(JSON.stringify(eventsData)).filter((row, index) => {
        let start = (curPage - 1) * pageSize
        let end = curPage * pageSize
        if (index >= start && index < end) return true
    });

    for (let i = 0; i < events.length; i++) {
        const row = currentDocument.createElement('tr')

        let event = events[i]
        
        const column1 = currentDocument.createElement('td')
        column1.innerHTML = event.name

        const column2 = currentDocument.createElement('td')

        const image = currentDocument.createElement('img')
        image.src = '../../images/completeIcon.png'
        image.width = '17'
        image.height = '17'

        column2.append(image)
        
        const column3 = currentDocument.createElement('td')
        column3.innerHTML = event.location

        const column4 = currentDocument.createElement('td')
        column4.innerHTML = event.category

        const column5 = currentDocument.createElement('td')
        column5.innerHTML = event.timeOfOccurence

        const column6 = currentDocument.createElement('td')
        column6.innerHTML = event.dateOfOccurence

        const column7 = currentDocument.createElement('td')

        const code = currentDocument.createElement('button')
        code.className = "button"
        if (event.code == 'yellow') {
            code.style.backgroundColor = '#FDF539'
            code.innerHTML = 'Yellow'
        }
        else if (event.code == 'orange') {
            code.style.backgroundColor = '#ffa500'
            code.innerHTML = 'Orange'
        }
        else if (event.code == 'red') {
            code.style.backgroundColor = '#B22222'
            code.innerHTML = 'Red'
        }

        column7.append(code)

        //COLUMN 8 IS ONLY FOR AUTHORITIES
        const column8 = currentDocument.createElement('td')

        const editButton = currentDocument.createElement('i')
        editButton.className = 'fa-regular fa-pen-to-square hand-mouse'

        editButton.onclick = function() {
            console.log(event)
            editEvent(event)
        }

        column8.append(editButton)

        const deleteButton = currentDocument.createElement('i')
        deleteButton.className = 'fa-regular fa-trash-can hand-mouse margin-left-8'

        deleteButton.onclick = function() {
            console.log(event)
            deleteEvent(event.id)
        }

        column8.append(deleteButton)

        row.append(column1)
        row.append(column2)
        row.append(column3)
        row.append(column4)
        row.append(column5)
        row.append(column6)
        row.append(column7)
        row.append(column8)

        tableBody.append(row)
    }
}

async function deleteEvent(id) {
    const deleteModal = currentDocument.getElementById('deleteModal')
    deleteModal.innerHTML =
    `
    <h4 class="text-align-center margin-top-8">Are you sure you want to delete this event?</h4>
    <div class="flex-row flex-space-between-center">
        <button id="deleteButton" class="delete-button margin-left-12 hand-mouse">Delete</button>
        <button id="cancelDeleteButton" class="cancel-delete-button margin-left-12 hand-mouse">Cancel</button>
    </div>
    `
    
    const deleteButton = currentDocument.getElementById('deleteButton')

    deleteButton.onclick = async function() {
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: id,
        })
        console.log('Response: ', response)

        const data = await response.json()
        console.log('Data: ', data)

        deleteModal.close()

        eventsData = eventsData.filter(x => x.id !== id)

        renderEventTable(curPage)
    }

    const cancelButton = currentDocument.getElementById('cancelDeleteButton')

    cancelButton.onclick = function() {
        deleteModal.close()
    }

    deleteModal.showModal()
    
}

async function editEvent(event) {
    const editEventModal = currentDocument.getElementById('editModal')
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
                <option id="pending" value="pending">Pending</option>
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
    `

    const eventCategory = currentDocument.getElementById(`${event.category}`)
    eventCategory.selected = true

    const eventCode = currentDocument.getElementById(`${event.code}`)
    eventCode.selected = true

    const eventStatus = currentDocument.getElementById(`${event.status}`)
    eventStatus.selected = true

    editEventModal.showModal()

    currentDocument.addEventListener('submit', (e) => {e.preventDefault()})

    const saveButton = currentDocument.getElementById('saveEditButton')
    saveButton.onclick = async function() {
        const form = currentDocument.getElementById('editEventForm')

        const formData = new FormData(form)

        console.log(formData.entries())

        const title = formData.get('eventTitle')
        const description = formData.get('eventDescription')
        const date = new Date(formData.get('eventTime'))
        const location = formData.get('eventLocation')
        const category = formData.get('eventCategory')
        const code = formData.get('eventCode')
        const status = formData.get('eventStatus')

        const updatedEvent = {
        'name': title,
        'status': status,
        'location': location,
        'category': category,
        'code': code,
        'date': date,
        'description': description
        }

        console.log('Updated Event: ', updatedEvent)

        const response = await fetch(`http://localhost:5000/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
        })
        console.log('Response: ', response)

        const data = await response.json()
        console.log('Data: ', data)

        editEventModal.close()

        onInitialized(currentDocument)
    }

    const cancelButton = currentDocument.getElementById('cancelEditButton')
    cancelButton.onclick = function() {
        editEventModal.close()
    }
}