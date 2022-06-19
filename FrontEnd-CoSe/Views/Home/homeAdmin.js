var civilianEventsData = [];

async function onAdminInitalized() {
    //Show admin table title
    const tableTitle = document.getElementById('adminEventsTitle');
    tableTitle.innerHTML = `<h2>Events submitted by civilians</h2>`;

    //Get events from database
    civilianEventsData = await getCivilianEvents();

    // //Get events from API -- TODO

    //Render Events Table
    renderAdminEventTable(1);

    //Loading Panel for loading table data
    document.getElementById("adminLoader").style.display = "none";
}



async function getCivilianEvents()  {
    const response = await fetch('http://localhost:5000/api/events/civilian');
    console.log('Get Civilian Events Response: ', response);
    
    const data = await response.json();
    console.log('Cet Civilian Events Data: ', data);

    return data;
}

function adminPreviousPage() {
    if (curPage > 1) {
        curPage--;
        renderEventTable(curPage);
    }
}
  
function adminNextPage() {
    if ((curPage * pageSize) < civilianEventsData.length) {
        curPage++;
        renderEventTable(curPage);
    }
}

function adminNumPages() {
    return Math.ceil(civilianEventsData.length / pageSize);
}

function adminRemoveAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function renderAdminEventTable(page) {
    const prevButton = document.getElementById('adminPrevButton');
    const nextButton = document.getElementById('adminNextButton');
    prevButton.style.visibility = "visible";
    nextButton.style.visibility = "visible";

    if (page == 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }
    
    if (page == adminNumPages()) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }

    const tableHead = document.getElementById('adminTableHead');
    tableHead.innerHTML = `
    <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Location</th>
        <th>Category</th>
        <th>Time of occurrence</th>
        <th>Date of occurrence</th>
        <th>Code</th>
        <th>User email</th>
        <th>Actions</th>
    </tr>`;
    
    const tableBody = document.getElementById('adminTableBody');

    if (document.querySelector('#adminTableBody').firstChild) {
        adminRemoveAllChildNodes(document.querySelector('#adminTableBody'));
    }

    const events = JSON.parse(JSON.stringify(civilianEventsData)).filter((row, index) => {
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

        const column8 = document.createElement('td');
        column8.innerHTML = event.userEmail;

        const column9 = document.createElement('td');

        const accept = document.createElement('button');
        accept.className = "button hand-mouse";
        accept.style.backgroundColor = '#90EE90';
        accept.style.margin = '0px 2px 0px';
        accept.innerHTML = 'Accept';
        accept.onclick = function() {
            console.log(event);
            acceptEvent(event);
        }

        column9.append(accept);

        const reject = document.createElement('button');
        reject.className = "button hand-mouse";
        reject.style.backgroundColor = '#DC143C';
        reject.style.margin = '0px 2px 0px';
        reject.innerHTML = 'Reject';
        reject.onclick = function() {
            console.log(event);
            rejectEvent(event.id);
        }

        column9.append(reject);

        row.append(column1);
        row.append(column2);
        row.append(column3);
        row.append(column4);
        row.append(column5);
        row.append(column6);
        row.append(column7);
        row.append(column8);
        row.append(column9);

        tableBody.append(row);
    }
}

async function rejectEvent(id) {
    const response = await fetch(`http://localhost:5000/api/events/civilian/${id}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'text/plain',
    },
    body: id,
    });
    console.log('Reject Event Response: ', response);

    const data = await response.json();
    console.log('Reject Event Data: ', data);

    //Delete event from events array
    civilianEventsData = civilianEventsData.filter(x => x.id !== id);

    //Rerender admin table after event delete
    renderAdminEventTable(curPage);
}

async function acceptEvent(event) {
    const response = await fetch(`http://localhost:5000/api/events/civilian/accept`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
    });
    console.log('Accept Event Response: ', response);

    const data = await response.json();
    console.log('Accept Event Data: ', data);

    //Rerender admin table
    onAdminInitalized()

    //Rerender all events table
    onInitialized();
}