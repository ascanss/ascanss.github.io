import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getDatabase, ref, get, child, update, set } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//const {firebase} = require("firebase/app");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMqyjv33uj-PQeNOQspJ29JAaqZpBQ2FY",
  authDomain: "ascanss.firebaseapp.com",
  databaseURL: "https://ascanss-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "ascanss",
  storageBucket: "ascanss.appspot.com",
  messagingSenderId: "174184549295",
  appId: "1:174184549295:web:8bdd4416a39f8706857d5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const user = auth.currentUser;
// Initialize Realtime Database
const db = getDatabase(app);

// Other than Firebase

// Log out

document.getElementById('log-out').onclick = function() {
  auth.signOut();
  location.href = "index.html";
}

// Read User Data

async function getUserData(userId) {
  const dbRef = ref(db);
  
  try {
    const snapshot = await get(child(dbRef, `users/${userId}`)); // Asenkron veri çekme işlemi
    if (snapshot.exists()) {
      return snapshot.val();  // Veriyi geri döndür
    } else {
      return null;  // Veri bulunmazsa null döner
    }
  } catch (error) {
    console.error("Veri okuma hatası:", error);
    return null;  // Hata oluşursa null döner
  }
}

// Veritabanına veri eklenmesi
function updateUserData(userId, directory, data) { // updateUserData(userIdbombom, "profilePicture", event.target.result) şeklinde çağrılır
  const datasRef = ref(db, `users/${userId}/${directory}`);
  
  // Mevcut yorumları çek
  set(datasRef, data) // `set` kullanımı veriyi doğrudan yazar
    .then(() => {
      console.log("Veri başarıyla güncellendi!");
    })
    .catch((error) => {
      console.error("Veri güncellenirken hata oluştu:", error);
    });
}

var userIdbombom;
var userProfilePic;

auth.onAuthStateChanged(user => {
  if(user){    
    console.log(user.email);
    userIdbombom = user.uid;
    getUserData(user.uid)
    .then((userData) => {
      if (userData) {
        document.getElementById("base-title").innerText = userData["username"];
        userProfilePic = userData["profilePicture"];

        let shownEmail = document.createElement("p");
        shownEmail.innerText = `E-mail: ${userData["email"]}`;
        shownEmail.classList.add("seri-ch");
        document.getElementById('user-details').appendChild(shownEmail);

        let shownUsername = document.createElement("p");
        shownUsername.innerText = `Kullanıcı Adı: ${userData["username"]}`;
        shownUsername.classList.add("seri-ch");
        document.getElementById('user-details').appendChild(shownUsername);

        document.getElementById("profile-img").src = userData["profilePicture"];
        document.getElementById("change-pfp-picture").src = userData["profilePicture"];

      } else {
        console.log("Kullanıcı bulunamadı.");
      }
    })
    .catch((error) => {
      console.error("Veri okuma hatası:", error);
    });
  }else{
    console.log("bum");
  }
});

const fileInput = document.getElementById("fileInput");
const readFileButton = document.getElementById("readFileButton");
const fileContent = document.getElementById("fileContent");
const changePfpPicture = document.getElementById("change-pfp-picture");

document.getElementById("readFileButton").onclick = function(){
  const file = fileInput.files[0];

  if (file) {
    // Dosyanın bir resim olup olmadığını kontrol et
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function (event) {
        // Görselin Base64 URL'sini al ve `src`ye ata
        changePfpPicture.src = event.target.result;
        updateUserData(userIdbombom, "profilePicture", event.target.result)
      };

      reader.readAsDataURL(file); // Görsel dosyasını Base64 olarak oku
    } else {
      alert("Lütfen bir resim dosyası seçin!");
    }
  } else {
    alert("Lütfen bir dosya seçin!");
  }
}
