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

async function deleteEvent(id) {
    const deleteModalTitle = currentDocument.createElement('h4')
    deleteModalTitle.className = 'text-align-center margin-top-8'
    deleteModalTitle.innerHTML = 'Are you sure you want to delete this event?'

    const deleteButton = currentDocument.createElement('button')
    deleteButton.className = 'delete-button margin-left-12'
    deleteButton.innerHTML = 'Delete'
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
        removeAllChildNodes(deleteModal)

        eventsData = eventsData.filter(x => x.id !== id)

        renderEventTable(curPage)
    }

    const cancelButton = currentDocument.createElement('button')
    cancelButton.className = 'cancel-button margin-right-12'
    cancelButton.innerHTML = 'Cancel'
    cancelButton.onclick = function() {
        deleteModal.close()
        removeAllChildNodes(deleteModal)
    }

    const buttonsDiv = currentDocument.createElement('div')
    buttonsDiv.className = 'flex-row flex-space-between-center'
    buttonsDiv.append(deleteButton)
    buttonsDiv.append(cancelButton)

    const deleteModal = currentDocument.getElementById('deleteModal')
    deleteModal.append(deleteModalTitle)
    deleteModal.append(buttonsDiv)

    deleteModal.showModal()
    
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
            location.reload()
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