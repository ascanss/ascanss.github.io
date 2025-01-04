import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js"
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
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
// database
const database = getDatabase();
// Initialize Realtime Database
const db = getDatabase(app);

// Other than Firebase

let email = "";
let password = "";
let username = "";

document.getElementById("e-mail-input").onchange = function(){
  email = document.getElementById("e-mail-input").value;
}

document.getElementById("password-input").onchange = function(){
  password = document.getElementById("password-input").value;
}

document.getElementById("username-input").onchange = function(){
  username = document.getElementById("username-input").value;
}

let createnYet = false;

// Write User Data

function writeUserData(userId, name, email) {
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profilePicture: "https://lh3.googleusercontent.com/pw/AP1GczP0Azn_FcPpIMHZjv7nr5V20FVMJiUvkBoVXxW-bqmB4OpCgkrTkxnuYHdk-qlI-Dh6Hnjyi_PqNnhiN6hcIleIWeumAkWRgHPAXOczKId_mpxzTCg=s266-p-k"
  })
  .then(() => {
    console.log("Veri başarıyla yazıldı!");
  })
  .catch((error) => {
    console.error("Veri yazılırken hata oluştu:", error);
  });
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

function checkPass(output){
  let warn = document.createElement("p");
  warn.id = `warn`;

  if(output == "error"){
    warn.innerText = "Bir hata meydana geldi.";
  }else if(output == "try again"){
    warn.innerText = "Bilgilerinizi kontrol ediniz.";
  }

  warn.style.cssText = `
    color: rgb(255, 20, 20);
  `;

  document.getElementById("base-child").appendChild(warn);  
}

try{
  document.getElementById("newAccount").onclick = function(){
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(1);
        // ...


        // Adding user to rtdb/users
        writeUserData(user.uid, username, user.email);


        alert("Hesabınız oluşturuldu.");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        try{
          document.getElementById(`warn`).remove();
        }catch{
          console.log("Removed warn already or warn has not created yet.");
        }
        checkPass("error");
        createnYet = true;
        console.log(error);
      });
  }

  document.getElementById("submit").onclick = function(){
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        getUserData(user.uid)
        .then((userData) => {
          if (userData) {
            console.log("baba çalışır halde")
            if(username !== `${userData["username"]}`){
              auth.signOut();

              try{
                document.getElementById(`warn`).remove();
              }catch{
                console.log("Removed warn already or warn has not created yet.");
              }
              try{
                document.getElementById("profile-button").remove();
              }catch{
                console.log("Profile button has not created yet.");
              }
              checkPass("try again");
            }else{
              console.log("Succesfully logged in to account.");
              alert("Oturum açtınız.");
            }
          } else {
            console.log("Kullanıcı bulunamadı.");
          }
        })
        .catch((error) => {
          console.error("Veri okuma hatası:", error);
          checkPass("error");
        });      

        
        // ...
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        try{
          document.getElementById(`warn`).remove();
        }catch{
          console.log("Removed warn already or warn has not created yet.");
        }
        checkPass("error");
        createnYet = true;
      });

  }
}catch{
  try{
    document.getElementById(`warn`).remove();
  }catch{
    console.log("Removed warn already or warn has not created yet.");
  }
  checkPass("error");
  createnYet = true;
}

