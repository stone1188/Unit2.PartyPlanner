// make a input and labels for names, date, time locations and descriptions for all parties
// should be able to store data and load it back to the html page
//make a delete button
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2311-FSA-ET-WEB-PT-SF/events`;

const state = {
    events: [],
}

const eventList = document.querySelector("#events");
const addEventForm = document.querySelector("#addEvents");
addEventForm.addEventListener("submit", addEvent);

async function render() {
    await getEvents();
    renderEvents();
}

render();

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
    }catch(error){
        console.error(error);
    }
}

function renderEvents() {
    if (!state.events.length) {
        eventList.innerHTML = "<li>No Events.</li>";
        return;
    }

    const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    
    li.innerHTML = `
    <h2>${event.name}</h2>
    <p>${event.date}</p>
    <p>${event.location}</p>
    <p>${event.description}</p>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Event';
    li.append(deleteButton);
    deleteButton.addEventListener('click', () => deleteEvent(event.id));
    
    return li;
  });
  eventList.replaceChildren(...eventCards);
}


async function addEvent(event) {
    event.preventDefault();
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: addEventForm.name.value,
                description: addEventForm.description.value,
                date: new Date(addEventForm.date.value),
                location: addEventForm.location.value,
            }),
        })

    if (!response.ok) {
      throw new Error('Event could not be deleted.');
    }

    render();
    }catch (error) {
        console.error(error);
    }
}



async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        });
    

    if (!response.ok) {
      throw new Error('Event could not be deleted.');
    }

    
    render();
    } catch(error) {
        console.error(error);
    }
}
