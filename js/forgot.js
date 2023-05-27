// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
document.getElementById("submitButton").addEventListener('click', function(event){
    event.preventDefault();
    var email = document.getElementById("email");
    auth.sendPasswordResetEmail(email.value).then(function() {
        window.alert("An email for password reset was sent!");
        email.value = "";
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert("The given email address is either invalid or it doesn't exist. Please try again with a valid/existing address !");
    email.value = "";
    // ..
  });
});
