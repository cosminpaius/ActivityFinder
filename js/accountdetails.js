const firebaseConfig = {
  apiKey: "AIzaSyCWMa7w0zQVAOL_74546qvBxYLCD8x1NY0",
  authDomain: "activityfinder-166ea.firebaseapp.com",
  projectId: "activityfinder-166ea",
  storageBucket: "activityfinder-166ea.appspot.com",
  messagingSenderId: "773489635924",
  appId: "1:773489635924:web:5cd54047a4194d9fae73c1",
  measurementId: "G-ZLH25KN9WW"
};

// Initialize Firebase

var accountType;

const app = firebase.initializeApp(firebaseConfig);

var user = localStorage.getItem('user');

user = JSON.parse(user);

var userRef = firebase.firestore().collection("users").doc(user.userId);

console.log(user.userId);



userRef.get().then(function (doc) {
  if (doc.exists) {
    // Documentul există
    accountType = doc.data().accountType;
    if (accountType == 2) {
      document.getElementById('addCourtButton').style.display = 'block';
      document.getElementById('showFieldsButton').style.display = 'block';
      document.getElementById('showDetailsButton').style.display = 'block';

      let data = doc.data();
      let companyName = data.companyName;
      let phoneNumber = data.phoneNumber;
      let username = data.username;
      let mail = user.userEmail;

      document.getElementById("usernameValue").innerText = username;
      document.getElementById("phoneValue").innerText = phoneNumber;
      document.getElementById("companyNameValue").innerText = companyName;
      document.getElementById("accountTypeValue").innerText = "Renter";
      document.getElementById("mailValue").innerText = mail;

    } else {
      document.getElementById('showDetailsButton').style.display = 'block'
      document.getElementById('showBookingsButton').style.display = 'block';
      document.getElementById('companyName').style.display = 'none';

      let data = doc.data();
      let phoneNumber = data.phone;
      let username = data.username;
      let mail = user.userEmail;

      document.getElementById("usernameValue").innerText = username;
      document.getElementById("phoneValue").innerText = phoneNumber;
      document.getElementById("accountTypeValue").innerText = "Rentee";
      document.getElementById("mailValue").innerText = mail;

    }
    console.log(accountType);
  } else {
    // Documentul nu există
    console.log("Utilizatorul nu are un document asociat în baza de date.");
  }
}).catch(function (error) {
  console.log("Eroare la accesarea documentului utilizatorului: ", error);
});

var terenuriRef = firebase.firestore().collection("fields");
var rezervariRef = firebase.firestore().collection("rezervari");

document.getElementById('addCourtButton').addEventListener('click', function () {
  document.getElementById('addCourtForm').style.display = 'block';
  document.getElementById('container').style.display = 'none';
  document.getElementById('fields-container').style.display = 'none';
  document.getElementById('bookings-container').style.display = 'none';

});
document.getElementById('showDetailsButton').addEventListener('click', function () {
  document.getElementById('addCourtForm').style.display = 'none';
  document.getElementById('container').style.display = 'block';
  document.getElementById('fields-container').style.display = 'none';
  document.getElementById('bookings-container').style.display = 'none';
});

document.getElementById('showBookingsButton').addEventListener('click', function () {
  document.getElementById('addCourtForm').style.display = 'none';
  document.getElementById('fields-container').style.display = 'none';
  document.getElementById('container').style.display = 'none';
  document.getElementById('bookings-container').innerHTML = "";

  let q = firebase.firestore().collection('rezervari').where('userID', '==', user.userId);
  let bookingsCount = 0;

  q.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // Access the data of each document
      addBookingToPage(doc);

      // Increment the fieldCount variable
      bookingsCount++;
    });

    // Display the total number of fields
    console.log('Total bookings:', bookingsCount);
  }).catch((error) => {
    console.error('Error getting fields:', error);
  });

  document.getElementById('bookings-container').style.display = 'block';

});
document.getElementById('showFieldsButton').addEventListener('click', function () {
  document.getElementById('addCourtForm').style.display = 'none';
  document.getElementById('container').style.display = 'none';
  document.getElementById('bookings-container').style.display = 'none';
  document.getElementById('fields-container').innerHTML = "";

  let filters = [];
  //filters.push(firebase.firestore().collection()where('ownerId', '==', user.userId));
  let q = firebase.firestore().collection('fields').where('ownerId', '==', user.userId);
  let fieldCount = 0;

  q.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // Access the data of each document
      addFieldToPage(doc);

      // Increment the fieldCount variable
      fieldCount++;
    });

    // Display the total number of fields
    console.log('Total Fields:', fieldCount);
  }).catch((error) => {
    console.error('Error getting fields:', error);
  });

  document.getElementById('fields-container').style.display = 'block';
});

// Adaugare terenuri in pagina my fields
function addFieldToPage(doc) {
  let field = doc.data()
  console.log(doc.id);
  let container = document.getElementById('fields-container');

  let fieldElement = document.createElement('div');
  fieldElement.className = 'card mb-3';

  let cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  fieldElement.appendChild(cardBody);

  let title = document.createElement('h5');
  title.textContent = field.nume;
  title.className = 'card-title';
  cardBody.appendChild(title);

  let description = document.createElement('p');
  description.textContent = field.descriere;
  description.className = 'card-text';
  cardBody.appendChild(description);

  let deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'btn btn-danger mt-2'; // Adaugă stiluri Bootstrap pentru buton
  deleteButton.setAttribute('data-field-id', doc.id); // Adaugă atributul personalizat
  deleteButton.addEventListener('click', deleteField);
  cardBody.appendChild(deleteButton);

  let bookingsList = document.createElement('ul');
  bookingsList.className = 'list-group list-group-flush';
  bookingsList.id = `bookings-for-${doc.id}`;
  fieldElement.appendChild(bookingsList);

  container.appendChild(fieldElement);

  // Adaugă rezervările pentru acest teren
  addBookingsToField(doc.id);
}
function addBookingsToField(fieldId) {
  // Interoghează colecția 'rezervari' pentru rezervările asociate cu acest teren
  let q = rezervariRef.where('fieldID', '==', fieldId);

  q.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // Accesează datele fiecărui document
      let booking = doc.data();
      let bookingsList = document.getElementById(`bookings-for-${fieldId}`);

      let bookingItem = document.createElement('li');
      bookingItem.className = 'list-group-item';
      bookingItem.textContent = `Rezervare: ${booking.date}, ${booking.hour}`;

      // Adaugă butoanele 'Accept' și 'Reject' dacă starea este 'pending'
      if (booking.status === 'pending') {
        let buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.justifyContent = 'flex-end';

        let acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.className = 'btn btn-success';
        acceptButton.addEventListener('click', function () {
          changeBookingStatus(doc.id, 'accepted');
        });
        buttonsDiv.appendChild(acceptButton);

        let rejectButton = document.createElement('button');
        rejectButton.textContent = 'Reject';
        rejectButton.className = 'btn btn-danger ml-2';
        rejectButton.addEventListener('click', function () {
          changeBookingStatus(doc.id, 'rejected');
        });
        buttonsDiv.appendChild(rejectButton);

        bookingItem.appendChild(buttonsDiv);
      }

      bookingsList.appendChild(bookingItem);
    });
  }).catch((error) => {
    console.error('Error getting bookings:', error);
  });
}


function changeBookingStatus(bookingId, newStatus) {
  if (newStatus === 'rejected') {
    // Șterge rezervarea
    rezervariRef.doc(bookingId).delete().then(function () {
      console.log('Booking successfully deleted');
      location.reload();
    }).catch(function (error) {
      console.error('Error removing booking:', error);
    });
  } else if (newStatus === 'accepted') {
    // Actualizează starea rezervării
    rezervariRef.doc(bookingId).update({
      status: newStatus
    }).then(function () {
      console.log('Status updated successfully');
      location.reload();
    }).catch(function (error) {
      console.error('Error updating status:', error);
    });
  }
}


const fieldMap = {
  'usernameValue': 'username',
  'phoneValue': 'phone',
  'companyNameValue': 'companyName'
};

function updateDatabase(id, newValue) {
  let user = firebase.auth().currentUser;
  let userRef = firebase.firestore().collection('users').doc(user.uid);
  let update = {};
  update[fieldMap[id] || id] = newValue;
  userRef.update(update).then(function () {
    console.log("Database updated successfully");
  }).catch(function (error) {
    console.error("Error updating database: ", error);
  });
}

function makeEditable(id) {
  let element = document.getElementById(id);
  let oldValue = element.innerText;
  element.innerText = "";

  let editElement = document.createElement("input");
  editElement.type = "text";
  editElement.id = id + "Edit";
  editElement.value = oldValue;

  // Adaugă stilul de culoare de fundal și culoare a textului aici
  editElement.style.backgroundColor = "black";
  editElement.style.color = "white";

  element.appendChild(editElement);
  editElement.focus();

  editElement.addEventListener("blur", function () {
    saveChanges(id, this.value);
  });

  editElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveChanges(id, this.value);
      event.preventDefault(); // Prevent form submission
    }
  });
}



function saveChanges(id, newValue) {
  let element = document.getElementById(id);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  element.innerText = newValue;
  updateDatabase(id, newValue);
}


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("usernameValue").addEventListener("blur", function () {
    this.contentEditable = "false";
    updateDatabase("username", this.innerText);
  });

  document.getElementById("phoneValue").addEventListener("blur", function () {
    this.contentEditable = "false";
    updateDatabase("phone", this.innerText);
  });

  document.getElementById("companyNameValue").addEventListener("blur", function () {
    this.contentEditable = "false";
    updateDatabase("companyName", this.innerText);
  });
});



function addBookingToPage(doc) {

  let booking = doc.data()

  console.log(doc.id);
  let container = document.getElementById('bookings-container');

  let bookingElement = document.createElement('div');
  bookingElement.className = 'booking card mt-3'; // Adaugă clasa card

  let cardBody = document.createElement('div');
  cardBody.className = 'card-body'; // Adaugă clasa card-body

  let title = document.createElement('h2');
  title.className = 'card-title'; // Adaugă clasa card-title
  console.log(booking.fieldID);
  terenuriRef.doc(booking.fieldID).get().then(function (fieldDoc) {
    if (fieldDoc.exists) {
      title.textContent = fieldDoc.data().nume;
    }
  });
  cardBody.appendChild(title);

  let info = document.createElement('p');
  info.className = 'card-text'; // Adaugă clasa card-text
  info.textContent = "Aveti o rezervare facuta la data de " + booking.date + " in intervalul orar " + booking.hour;
  cardBody.appendChild(info);

  let statusButton = document.createElement('button');
  statusButton.className = 'btn';
  statusButton.setAttribute('disabled', true); // Setează butonul ca dezactivat

  // Setează textul și culoarea butonului în funcție de starea rezervării
  if (booking.status === 'pending') {
    statusButton.textContent = 'Pending';
    statusButton.classList.add('btn-warning');
  } else if (booking.status === 'accepted') {
    statusButton.textContent = 'Accepted';
    statusButton.classList.add('btn-success');
  }

  cardBody.appendChild(statusButton);

  let deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-danger'; // Adaugă clasele btn și btn-danger
  deleteButton.textContent = 'Cancel Booking';
  deleteButton.setAttribute('data-booking-id', doc.id); // Adaugă atributul personalizat
  deleteButton.addEventListener('click', cancelBooking);
  cardBody.appendChild(deleteButton);

  bookingElement.appendChild(cardBody);
  container.appendChild(bookingElement);
}

function adaugaTeren(descriere, nume, oras, pret, sport) {
  // Selectează fișierul încărcat de utilizator
  let imageFile = document.getElementById('imageInput').files[0];
  if (!imageFile) {
    alert('Vă rugăm să selectați o imagine!');
    return;
  }

  // Creează o referință la Firebase Storage pentru acest fișier
  let storageRef = firebase.storage().ref('images/' + imageFile.name);

  // Încarcă fișierul în Firebase Storage
  storageRef.put(imageFile).then(function (snapshot) {
    console.log('Image uploaded successfully!');

    // După încărcarea cu succes a imaginii, obține URL-ul imaginii
    snapshot.ref.getDownloadURL().then(function (downloadURL) {
      console.log('Image available at', downloadURL);

      // Apoi, adăugați terenul în Firestore cu URL-ul imaginii
      terenuriRef
        .add({
          descriere: descriere,
          nume: nume,
          oras: oras,
          pret: pret,
          sport: sport,
          ownerId: user.userId,
          imageUrl: downloadURL // Adaugă URL-ul imaginii la teren
        })
        .then(function (docRef) {
          console.log("Teren adăugat cu succes! ID teren: ", docRef.id);
          // Resetează valorile input-urilor
          document.getElementById("descriptionInput").value = "";
          document.getElementById("nameInput").value = "";
          document.getElementById("cityInput").value = "";
          document.getElementById("priceInput").value = "";
          document.getElementById("sportInput").value = "";
        })
        .catch(function (error) {
          console.error("Eroare la adăugarea terenului: ", error);
        });
    });
  }).catch(function (error) {
    console.error('Error uploading image:', error);
    alert('A intervenit o eroare la încărcarea imaginii. Vă rugăm să încercați din nou!');
  });
}


function deleteField(event) {
  let fieldId = event.target.getAttribute('data-field-id'); // Accesează atributul personalizat

  rezervariRef.where('fieldID', '==', fieldId).get().then(function (querySnapshot) {

    querySnapshot.forEach(function (doc) {
      doc.ref.delete().then(function () {
        console.log("Toate rezervarile la terenul " + fieldId + " au fost anulate.");
      }).catch(function (error) {
        console.error("Eroare la stergerea rezervarii: ", error);
      });
    });

    terenuriRef.doc(fieldId).delete()
      .then(function () {
        console.log('Terenul a fost șters cu succes!');
        // Simulam click pe butonul de show fields pentru a actuailiza
        // terenurile ramase dupa stergere
        document.getElementById('showFieldsButton').click();
        alert("Terenul a fost sters cu succes!");
      })
      .catch(function (error) {
        console.error('Eroare la ștergerea terenului:', error);
        // Afișează un mesaj de eroare
        alert('A intervenit o eroare la ștergerea terenului. Vă rugăm să încercați din nou!');
      });
  });
}

function cancelBooking(event) {
  let bookingId = event.target.getAttribute('data-booking-id'); // Accesează atributul personalizat
  rezervariRef.doc(bookingId).delete()
    .then(function () {
      console.log('Rezervarea a fost anulata cu succes!');
      // Simulam click pe butonul de show fields pentru a actuailiza
      // terenurile ramase dupa stergere
      document.getElementById('showBookingsButton').click();
      alert("Rezervarea a fost anulata cu succes!");
    })
    .catch(function (error) {
      console.error('Eroare la anularea rezervarii:', error);
      // Afișează un mesaj de eroare
      alert('A intervenit o eroare la anularea rezervarii. Vă rugăm să încercați din nou!');
    });
}

// Evenimentul de submit al formularului
document.getElementById("submitFieldButton").addEventListener("click", function (event) {
  event.preventDefault();
  console.log('da');
  var descriere = document.getElementById("descriptionInput").value;
  var nume = document.getElementById("nameInput").value;
  var oras = document.getElementById("cityInput").value;
  var pret = document.getElementById("priceInput").value;
  var sport = document.getElementById("sportInput").value;
  if (descriere && nume && oras && pret && sport) {
    adaugaTeren(descriere, nume, oras, pret, sport);
  } else {
    alert("Vă rugăm să completați toate câmpurile!");
  }
});