async function onInitialized(document) {
    const data = await getEvents()

    createEventTable(data, document)

    document.getElementById("loadingPanel").style.display = "none"
    //LOADING PANEL
}

async function getEvents(document)  {
    const response = await fetch('http://localhost:5000/api/events')
    console.log('Response: ', response)
    
    const data = await response.json()
    console.log('Data: ', data)

    return data
}

async function deleteEvent(id) {
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
}

function createEventTable(events, document) {
    const tableHead = document.getElementById('tableHead')
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
    
    const tableBody = document.getElementById('tableBody')

    for (let i = 0; i < events.length; i++) {
        const row = document.createElement('tr')

        let event = events[i]
        
        const column1 = document.createElement('td')
        column1.innerHTML = event.name

        const column2 = document.createElement('td')

        const image = document.createElement('img')
        image.src = '../../images/completeIcon.png'
        image.width = '17'
        image.height = '17'

        column2.append(image)
        
        const column3 = document.createElement('td')
        column3.innerHTML = event.location

        const column4 = document.createElement('td')
        column4.innerHTML = event.category

        const column5 = document.createElement('td')
        column5.innerHTML = event.timeOfOccurence

        const column6 = document.createElement('td')
        column6.innerHTML = event.dateOfOccurence

        const column7 = document.createElement('td')

        const code = document.createElement('button')
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
        const column8 = document.createElement('td')

        const editButton = document.createElement('i')
        editButton.className = 'fa-regular fa-pen-to-square hand-mouse'

        editButton.onclick = function() {
            console.log(event)
            location.reload()
        }

        column8.append(editButton)

        const deleteButton = document.createElement('i')
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