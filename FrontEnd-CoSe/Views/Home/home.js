function eventTableOnInitialized(events, document) {
    const tableBody = document.getElementById('tableBody');

    for (let i = 0; i < events.length; i++) {
      const row = document.createElement('tr');

      let event = events[i];
      
      const column1 = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'checkbox';
      column1.append(input);
      
      const column2 = document.createElement('td');
      column2.innerHTML = event.name;

      const column3 = document.createElement('td');
      const image = document.createElement('img');
      image.src = '../../images/completeIcon.png';
      image.width = '17';
      image.height = '17';
      column3.append(image);

      
      const column4 = document.createElement('td');
      column4.innerHTML = event.location;

      const column5 = document.createElement('td');
      column5.innerHTML = event.category;

      const column6 = document.createElement('td');
      column6.innerHTML = event.timeOfOccurence;

      const column7 = document.createElement('td');
      column7.innerHTML = event.dateOfOccurence;

      const column8 = document.createElement('td');
      const button = document.createElement('button');
      button.className = "button";
      if (event.code == 'yellow') {
          button.style.backgroundColor = '#FDF539';
          button.innerHTML = 'Yellow';
      }
      else if (event.code == 'orange') {
          button.style.backgroundColor = '#ffa500';
          button.innerHTML = 'Orange';
      }
      else if (event.code == 'red') {
          button.style.backgroundColor = '#B22222';
          button.innerHTML = 'Red';
      }
      
      column8.append(button);

      const column9 = document.createElement('td');
      const imageDots = document.createElement('img');
      imageDots.src = '../../images/extinseIcon.png';
      imageDots.className = 'hand-mouse';
      imageDots.width = '17';
      imageDots.height = '17';
      column9.append(imageDots);

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