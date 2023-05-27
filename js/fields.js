// Configurarea Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCWMa7w0zQVAOL_74546qvBxYLCD8x1NY0",
    authDomain: "activityfinder-166ea.firebaseapp.com",
    projectId: "activityfinder-166ea",
    storageBucket: "activityfinder-166ea.appspot.com",
    messagingSenderId: "773489635924",
    appId: "1:773489635924:web:5cd54047a4194d9fae73c1",
    measurementId: "G-ZLH25KN9WW"
};

// Initializare Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// preia selecțiile utilizatorului din URL
let params = new URLSearchParams(window.location.search);
let city = params.get('city');
let sport = params.get('sport');
let date = params.get('date');
let hour = params.get('hour');

document.getElementById('selectoras').value = city;

let user = localStorage.getItem('user');
user = JSON.parse(user);

let terenuriRef = collection(db, "fields");
let rezervariRef = collection(db, "rezervari");
let currentUserRef;
if (user) {
    currentUserRef = doc(collection(db, "users"), user.userId);
}


if (user) {
    if (user.accountType == 2) {
        document.getElementById("noLoggedInMessage").innerHTML = "You can't make a booking from a renter account! Please register as a rentee in order to book a field !";
        document.getElementById("noLoggedInMessage").style.display = "block";
    }
} else {
    document.getElementById("noLoggedInMessage").innerHTML = "You can't book a field because you are not logged in! Please log in into your rentee account or register a new rentee account in order to make a booking !"
    document.getElementById("noLoggedInMessage").style.display = "block";
}

// Verifică dacă utilizatorul a selectat un oraș sau un sport
let filters = [];
if (city && city !== '') filters.push(where('oras', '==', city));
if (sport && sport !== '') filters.push(where('sport', '==', sport));

// Interogare Firebase pentru a obține terenurile care corespund selecțiilor utilizatorului
let q = query(collection(db, 'fields'), ...filters);
let fieldCount = 0;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const city1 = urlParams.get('city')
console.log(city1);
getDocs(q)
    .then((querySnapshot) => {
        document.getElementById('fields-container').innerHTML = "";
        querySnapshot.forEach((doc) => {
            // Verifică dacă există deja o rezervare la ora selectată
            console.log(doc.id);
            const qReservation = query(collection(db, 'rezervari'), where('fieldID', '==', doc.id), where('date', '==', date), where('hour', '==', hour));
            getDocs(qReservation)
                .then((resSnapshot) => {
                    if (resSnapshot.empty) {
                        // Dacă nu există o rezervare, terenul este disponibil
                        addFieldToPage(doc);
                        fieldCount++;
                        console.log(fieldCount);
                    } else {

                    }
                })
                .catch((error) => {
                    console.log("Error getting reservation: ", error);
                });
        });
        // if (fieldCount == 0) {
        //     console.log(fieldCount);
        //     showNoFieldsMessage();
        // }
    })
    .catch((error) => {
        console.log("Error getting fields: ", error);
    });

function addFieldToPage(doc) {
    let field = doc.data();

    let container = document.getElementById('fields-container');

    let fieldElement = document.createElement('div');
    fieldElement.className = 'field';
    fieldElement.style.display = 'flex'; // Adaugă flexbox
    fieldElement.style.justifyContent = 'space-between'; // Distribuie spațiul între elemente
    fieldElement.style.alignItems = 'center'; // Aliniază elementele pe centrul vertical

    let textContainer = document.createElement('div'); // Creează un nou div pentru text și buton

    let title = document.createElement('h2');
    title.textContent = field.nume;
    textContainer.appendChild(title);

    let description = document.createElement('p');
    description.textContent = "Descriere: " + field.descriere;
    textContainer.appendChild(description);

    let price = document.createElement('p');
    price.textContent = "Pret: " + field.pret + " lei/ora";
    textContainer.appendChild(price);

    let sportType = document.createElement('p');
    sportType.textContent = "Sport: " + field.sport;
    textContainer.appendChild(sportType);

    let bookButton = document.createElement('button');
    bookButton.textContent = 'Book Field';
    bookButton.setAttribute('data-field-id', doc.id);
    bookButton.setAttribute('data-owner-id', field.ownerId);
    bookButton.setAttribute('data-field-name', field.nume);
    if (!user) {
        bookButton.style.display = 'none';
    } else {
        if (user.accountType == 2) {
            bookButton.style.display = 'none';
        }
    }
    bookButton.className = 'bookButton';
    bookButton.addEventListener('click', bookField);
    textContainer.appendChild(bookButton);

    fieldElement.appendChild(textContainer);

    let imageContainer = document.createElement('div');
    let image = document.createElement('img');
    image.src = field.imageUrl;
    image.alt = field.nume;
    image.style.width = '150px';
    image.style.height = '150px';
    image.style.objectFit = 'cover';
    imageContainer.appendChild(image);

    image.addEventListener('click', function () {
        window.open(field.imageUrl, '_blank'); // Deschide imaginea într-un nou tab
    });


    fieldElement.appendChild(imageContainer);

    container.appendChild(fieldElement);
}

function bookField(event) {
    let fieldID = event.target.getAttribute('data-field-id'); // Accesează atributul personalizat
    let ownerID = event.target.getAttribute('data-owner-id');
    let nume = event.target.getAttribute('data-field-name');
    addDoc(rezervariRef, {
        fieldID: fieldID,
        ownerID: ownerID,
        numeTeren: nume,
        userID: user.userId,
        date: date,
        hour: hour,
        status: "pending"
    })
        .then(function (docRef) {
            console.log("Rezervarea a fost realizata cu succes !");
            alert("Rezervarea a fost realizata cu succes !");
            location.reload();
        })
        .catch(function (error) {
            console.error("Eroare la rezervarea terenului: ", error);
            alert("A intervenit o eroare la rezervarea terenului. Va rugam incercati din nou !");
        });
}

// Functia care afiseaza mesajul daca nu exista terenuri
function showNoFieldsMessage() {
    let container = document.getElementById('fields-container');

    let messageContainer = document.createElement('div');
    messageContainer.className = "no-fields";

    let messageElement = document.createElement('p');
    messageElement.textContent = "Nu exista terenuri disponibile pentru datele selectate !";

    messageContainer.appendChild(messageElement);
    container.appendChild(messageContainer);
}


