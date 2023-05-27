document.getElementById('logout-button').addEventListener('click', logout);
document.getElementById('account-details-button').addEventListener('click', function () {
  console.log("da");
  window.location.href = 'accountdetails.html';
});

// firebase.auth().onAuthStateChanged(function (user) {
//   if (user) {
//     // Utilizatorul este autentificat, deci ascundem butoanele de login și register și afișăm un mesaj de bun venit

//     alert("Sunteti conectat.");
//     document.querySelector('.signin').style.display = 'none';
//     document.querySelector('.signup-rentee').style.display = 'none';
//     document.querySelector('.user-modal').style.dispay = 'none';

//     let welcomeMessage = document.createElement('span');
//     welcomeMessage.textContent = 'Bine ai venit, ' + user.email + '!';
//     document.querySelector('.main-nav').appendChild(welcomeMessage);

//     //localStorage.setItem('user', JSON.stringify(user));
//   } else {
//     // Niciun utilizator nu este autentificat
//     localStorage.removeItem('user');
//     document.querySelector('.signin').style.display = '';
//     document.querySelector('.signup-rentee').style.display = '';
//     let welcomeMessage = document.querySelector('.main-nav span');
//     if (welcomeMessage) {
//       welcomeMessage.remove();
//     }
//   }

// });
window.addEventListener('beforeunload', function (event) {
  // Aici puteți adăuga codul dvs. care trebuie executat înainte de a se reîncărca pagina
  document.querySelector('html').style.display = 'none';
});

window.onload = function () {

  var user = localStorage.getItem('user');

  if (user) {
    user = JSON.parse(user);
    // Autentificați automat utilizatorul
    firebase.auth().signInWithEmailAndPassword(user.userEmail, user.userPass)
      .then(function () {
        // Utilizatorul este autentificat cu succes
        updateUIForLoggedInUser(user.userEmail);

      })
      .catch(function (error) {
        // Autentificarea a eșuat
      });
  }
  else {
    document.querySelector('html').style.display = 'block';
  }

}


function logout() {
  firebase.auth().signOut()
    .then(function () {
      // Deconectare reușită
      // Actualizăm interfața de utilizator
      //updateUIForLoggedOutUser();
      localStorage.removeItem('user');
      window.location.replace('index.html');
      document.querySelector('html').style.display = 'block';

    })
    .catch(function (error) {
      // A apărut o eroare
      window.alert("Error " + error.message);
    });
}

function updateUIForLoggedOutUser() {
  document.querySelector('.signin').style.display = 'block';
  document.querySelector('.signup-rentee').style.display = 'block';
  document.getElementById('logout-button').style.display = 'none';
  document.getElementById('account-details-button').style.display = 'none';

  const welcomeMessage = document.querySelector('.main-nav span');
  if (welcomeMessage) {
    welcomeMessage.remove();
  }
}

jQuery(document).ready(function ($) {
  var $form_modal = $('.user-modal'),
    $form_login = $form_modal.find('#login'),
    $form_signup_rentee = $form_modal.find('#signup_as_rentee'),
    $form_signup_renter = $form_modal.find('#signup_as_renter'),
    $form_forgot_password = $form_modal.find('#reset-password'),
    $form_modal_tab = $('.switcher'),
    $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
    $tab_signup_rentee = $form_modal_tab.children('li').eq(1).children('a'),
    $tab_signup_renter = $form_modal_tab.children('li').eq(2).children('a'),
    $forgot_password_link = $form_login.find('.form-bottom-message a'),
    $back_to_login_link = $form_forgot_password.find('.form-bottom-message a'),
    $main_nav = $('.main-nav');

  //open modal
  $main_nav.on('click', function (event) {

    if ($(event.target).is($main_nav)) {
      // on mobile open the submenu
      $(this).children('ul').toggleClass('is-visible');
    } else {
      // on mobile close submenu
      $main_nav.children('ul').removeClass('is-visible');
      //show modal layer
      $form_modal.addClass('is-visible');
      //show the selected form
      //( $(event.target).is('.signup') ) ? signup_selected() : login_selected();

      if ($(event.target).is('.signup_rentee')) {
        signup_as_rentee_selected();
      } else if ($(event.target).is('.signin')) {
        login_selected();
      } else if ($(event.target).is('.signup_renter')) {
        signup_as_renter_selected();
      }
    }

  });

  //close modal
  $('.user-modal').on('click', function (event) {
    if ($(event.target).is($form_modal) || $(event.target).is('.close-form')) {
      $form_modal.removeClass('is-visible');
    }
  });
  //close modal when clicking the esc keyboard button
  $(document).keyup(function (event) {
    if (event.which == '27') {
      $form_modal.removeClass('is-visible');
    }
  });

  //switch from a tab to another
  $form_modal_tab.on('click', function (event) {
    event.preventDefault();
    //( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();

    if ($(event.target).is($tab_signup_rentee)) {
      signup_as_rentee_selected();
    } else if ($(event.target).is($tab_login)) {
      login_selected();
    } else if ($(event.target).is($tab_signup_renter)) {
      signup_as_renter_selected();
    }
  });

  //hide or show password
  $('.hide-password').on('click', function () {
    var $this = $(this),
      $password_field = $this.prev('input');

    ('password' == $password_field.attr('type')) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
    ('Show' == $this.text()) ? $this.text('Hide') : $this.text('Show');
    //focus and move cursor to the end of input field
    $password_field.putCursorAtEnd();
  });

  //show forgot-password form
  // $forgot_password_link.on('click', function (event) {
  //   event.preventDefault();
  //   forgot_password_selected();
  // });

  //back to login from the forgot-password form
  $back_to_login_link.on('click', function (event) {
    event.preventDefault();
    login_selected();
  });

  function login_selected() {
    document.getElementById("login").style.display = "block";
    document.getElementById("signup_as_rentee").style.display = "none";
    document.getElementById("signup_as_renter").style.display = "none";
    document.getElementById("reset-password").style.display = "block";

  }

  function signup_as_rentee_selected() {
    document.getElementById("login").style.display = "none";
    document.getElementById("signup_as_rentee").style.display = "block";
    document.getElementById("signup_as_renter").style.display = "none";
    document.getElementById("reset-password").style.display = "none";
  }

  function signup_as_renter_selected() {
    document.getElementById("login").style.display = "none";
    document.getElementById("signup_as_rentee").style.display = "none";
    document.getElementById("signup_as_renter").style.display = "block";
    document.getElementById("reset-password").style.display = "none";

  }

  // function forgot_password_selected() {
  //   document.getElementById("login").style.display = "none";
  //   document.getElementById("signup_as_rentee").style.display = "none";
  //   document.getElementById("signup_as_renter").style.display = "none";
  //   document.getElementById("reset-password").style.display = "block";

  // }

  //REMOVE THIS - it's just to show error messages
  $form_login.find('input[type="submit"]').on('click', function (event) {
    event.preventDefault();
    $form_login.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
  });
  $form_signup_rentee.find('input[type="submit"]').on('click', function (event) {
    event.preventDefault();
    // $form_signup_rentee.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
  });
  $form_signup_renter.find('input[type="submit"]').on('click', function (event) {
    event.preventDefault();
    // $form_signup_renter.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
  });

});


//credits https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function () {
  return this.each(function () {
    // If this function exists...
    if (this.setSelectionRange) {
      // ... then use it (Doesn't work in IE)
      // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      var len = $(this).val().length * 2;
      this.setSelectionRange(len, len);
    } else {
      // ... otherwise replace the contents with itself
      // (Doesn't work in Google Chrome)
      $(this).val($(this).val());
    }
  });
};


const firebaseConfig = {
  apiKey: "AIzaSyCWMa7w0zQVAOL_74546qvBxYLCD8x1NY0",
  authDomain: "activityfinder-166ea.firebaseapp.com",
  databaseURL: "https://activityfinder-166ea-default-rtdb.firebaseio.com",
  projectId: "activityfinder-166ea",
  storageBucket: "activityfinder-166ea.appspot.com",
  messagingSenderId: "773489635924",
  appId: "1:773489635924:web:5cd54047a4194d9fae73c1",
  measurementId: "G-ZLH25KN9WW"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth()
const database = firebase.database()

// Set up our register function
function registration_as_renter() {
  var user_email = document.getElementById("signup-email-renter").value;
  //window.alert(user_email);
  var user_password = document.getElementById("signup-password-renter").value;
  var user_company_name = document.getElementById("signup-company-name").value;
  var username = document.getElementById("signup-username-renter").value;
  var phone_number = document.getElementById("signup-phone-renter").value;
  var acceptTerms = document.getElementById("accept-terms-renter").checked;


  if (!validate_email(user_email)) {
    alert("Email-ul introdus trebuie sa fie valid.");
    return;
  }
  if (username.length < 6) {
    alert("Numele de utilizator trebuie să aibă cel puțin 6 caractere.");
    return;
  }

  if (phone_number.length !== 10) {
    alert("Numărul de telefon trebuie să conțină exact 10 cifre.");
    return;
  }

  if (isNaN(phone_number)) {
    alert("Numărul de telefon trebuie să conțină doar cifre.");
    return;
  }

  if (user_company_name.length < 6) {
    alert("Numele companiei trebuie să aibă cel puțin 6 caractere.");
    return;
  }

  if (!acceptTerms) {
    alert("Trebuie să accepți termenii și condițiile pentru a putea continua.");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(user_email, user_password).then(function () {
    window.alert("Account created successfully ! Now you can sign in !");

    var user = firebase.auth().currentUser;

    let accountType = 2;
    let userData = {
      username: username,
      phoneNumber: phone_number,
      accountType: accountType,
      companyName: user_company_name,
      UID: user.uid
    };

    firebase.firestore().collection('users').doc(user.uid).set(userData);

    document.getElementById("signup-username-renter").value = "";
    document.getElementById("signup-company-name").value = "";
    document.getElementById("signup-password-renter").value = "";
    document.getElementById("signup-email-renter").value = "";

    user.sendEmailVerification().then(function () {
      // Email sent.
      window.alert("Verification url sent.");
    }).catch(function (error) {
      // An error happened.
      window.alert("Error " + errorMessage);
    });
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    window.alert("Error " + errorMessage);
  });


}

function registration_as_rentee() {
  var user_email = document.getElementById("signup-email-rentee").value;
  var user_password = document.getElementById("signup-password-rentee").value;
  var username = document.getElementById("signup-username-rentee").value;
  var phone = document.getElementById("signup-phone-rentee").value;
  var acceptTerms = document.getElementById("accept-terms-rentee").checked;

  if (!validate_email(user_email)) {
    alert("Email-ul introdus trebuie sa fie valid.");
    return;
  }

  if (username.length < 6) {
    alert("Numele de utilizator trebuie să aibă cel puțin 6 caractere.");
    return;
  }

  if (phone.length !== 10) {
    alert("Numărul de telefon trebuie să conțină exact 10 cifre.");
    return;
  }

  if (isNaN(phone)) {
    alert("Numărul de telefon trebuie să conțină doar cifre.");
    return;
  }

  if (!acceptTerms) {
    alert("Trebuie să accepți termenii și condițiile pentru a putea continua.");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(user_email, user_password).then(function () {
    window.alert("Account created successfully ! Now you can sign in !");

    var user = firebase.auth().currentUser;
    let accountType = 1;
    let userData = {
      username: username,
      phone: phone,
      accountType: accountType,
      UID: user.uid
    };

    firebase.firestore().collection('users').doc(user.uid).set(userData);
    document.getElementById("signup-username-rentee").value = "";
    document.getElementById("signup-password-rentee").value = "";
    document.getElementById("signup-email-rentee").value = "";
    user.sendEmailVerification().then(function () {
      // Email sent.
      window.alert("Verification url sent.");
    }).catch(function (error) {
      // An error happened.
      window.alert("Error " + errorMessage);
    });
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    window.alert("Error " + errorMessage);
  });
}


function updateUIForLoggedInUser(userEmail) {
  document.querySelector('.signin').style.display = 'none';
  document.querySelector('.signup-rentee').style.display = 'none';
  document.getElementById('logout-button').style.display = 'block';
  document.getElementById('account-details-button').style.display = 'block';

  const welcomeMessage = document.createElement('span');
  welcomeMessage.innerText = `Bine ai venit, ${userEmail}!`;
  document.querySelector('.main-nav').appendChild(welcomeMessage);
  document.getElementsByClassName('user-modal')[0].style.display = 'none';
  document.querySelector('html').style.display = 'block';

  // Set a timeout to sign out after 1 hour
  setTimeout(function () {
    firebase.auth().signOut().then(function () {
      // Clear user data from localStorage
      localStorage.removeItem('user');
    }).catch(function (error) {
      // An error happened.
      console.error('Error during signout', error);
    });
  }, 3600000); // 3600000 milliseconds = 1 hour
}
// Set up our login function
function login() {
  var userEmail = document.getElementById("signin-email").value;
  var userPass = document.getElementById("signin-password").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
    .then(function (userCredential) {
      updateUIForLoggedInUser(userEmail);
      // Login successful
      var userRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
      userRef.get().then(function (doc) {
        if (doc.exists) {
          // Documentul există
          let accountType = doc.data().accountType;

          var user = {
            "userEmail": userEmail,
            "userPass": userPass,
            "userId": firebase.auth().currentUser.uid,
            "accountType": accountType
          }

          localStorage.setItem('user', JSON.stringify(user));
          console.log(user.accountType);
          // window.location.replace("index.html");
        }
      })
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert("Error " + errorMessage);
    });
}

// Validate Functions
function validate_email(email) {
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (filter.test(email)) {
    return true;
  }
  return false;
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}

