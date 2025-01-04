import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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
// Initialize Realtime Database
const db = getDatabase(app);

// Veri Okuma
async function getData(directory) {
  const dbRef = ref(db);
  
  try {
    const snapshot = await get(child(dbRef, `${directory}`)); // Asenkron veri çekme işlemi
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

// Yorumları Veritabanına Ekleme
function addCommentToAnime(newComment, commenter, date) {
  const commentsRef = ref(db, `updater/contact/comments`);
  
  // Mevcut yorumları çek
  get(commentsRef)
    .then((snapshot) => {
      const commentsData = snapshot.exists() ? snapshot.val() : {}; // Var olan yorumları al veya boş obje

      // Yorum sayısını alarak yeni anahtar oluştur
      const commentCount = Object.keys(commentsData).length;
      const commentKeys = Object.keys(commentsData);
      let lastCommentKey = commentKeys.length ? commentKeys[commentKeys.length - 1] : null;
      let newCommentKey;
      if(lastCommentKey){
        newCommentKey = `comment${Number(lastCommentKey.split("omment")[1]) + 1}`// `comment${commentCount + 1}`;
      }else if(!(lastCommentKey)){
        newCommentKey = `comment1`
      }

      // Yeni yorumu ekle
      const updatedComments = { ...commentsData, [newCommentKey]: `${newComment}commenter:${commenter}date:${date}` }; // Yorum {yorum}commenter:{user.uid} şeklinde kaydedilir

      return update(commentsRef, updatedComments);
    })
    .then(() => {
      console.log("Yorum başarıyla eklendi!");
    })
    .catch((error) => {
      console.error("Yorum eklenirken hata oluştu:", error);
    });
}

/* Yorumları veritabanına ekleme için örnek kullanım
addCommentToAnime("vinland-saga", 1, "şimşek makguin", user uid)
--------------------------------------------------------------------------------------------------
  user uid --> users içinde yer alır, buradan kullanıcı adı elde edilecek ve kullanıcılara, 
  yorumu yapan kişinin kullanıcıadını göstermek için user uid kullanıclacak.          
  İçinde kullanıcıya ait bilgileri (e-posta adresi, kullanıcı adı) bulundurur.        
--------------------------------------------------------------------------------------------------
*/

// Kullanıcı falan filan, user.uid

var userUid;

auth.onAuthStateChanged(user => {
  if(user){    
    console.log(user.email);
    userUid = user.uid;

  }else{
    console.log("bum");
  }
});

// Kullanıcı verilerine ulaşma

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


// Other than Firebase

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;
console.log(today);

document.querySelectorAll("#links-holder-link").forEach(link => {
  link.onclick = function() {
    getData("updater")
    .then((update) => {
      if (update) {
        console.log(link.getAttribute('value'), 1);
        window.open(update["contact"]["links"][link.getAttribute('value')]);
      } else {
        console.log("Bir hata meydana geldi..");
      }
    })
    .catch((error) => {
      console.error("Veri okuma hatası:", error);
    });
  }
});

// FORUM
/* Yorumlar kısmı olmayacak

// Input'a tıklandığında Paylaş butonunun gösterilmesi
document.getElementById(`new-comment-input`).addEventListener("click", function(){ // Input'a tıklandığında çalışır
  document.getElementById(`new-comment-submit`).style.display = "flex" // Paylaş butonu görünür hale gelir
});

// Yorum ekleme
document.getElementById(`new-comment-submit`).addEventListener("click", function(){ // Paylaş butonuna tıklanırsa çalışır 
  if(document.getElementById(`new-comment-input`).value){ // Input içindeki değer null mu diye kontrol edilir
    console.log(document.getElementById(`new-comment-input`).value); // Input'a yazılan yazı consola yazdırılır



    let commentValue = document.getElementById(`new-comment-input`).value;

    addCommentToAnime(commentValue, userUid, today); // Yorum veritabanına eklenir

    document.getElementById(`new-comment-input`).value = "" // Input temizlenir
  }
});

// Yorumların gösterilmesi

let commentsArray = [];
getData("updater") // Yorumlar okunur
    .then((update) => {
      if (update) {
        commentsArray = update["contact"][`comments`];     
        //  commentTextFr.push(commentsArray[i].split("commenter:")[0]);
        //  commenterFr.push(commentsArray[i].split("commenter:")[1]);

      } else {
        console.log("Veri bulunamadı.");
      }
    })
    .catch((error) => {
      console.error("Veri okuma hatası:", error);
    });

function createCommentElements(array){ // array yerğne commentsArray yazılır.
  for(let i in array){
    let commentDiv = document.createElement("div");
    commentDiv.id = `comment-div`;
    document.getElementById(`comments-seri`).appendChild(commentDiv);

    let commenterDiv = document.createElement(`div`);
    commenterDiv.id = `commenter-div`;
    commentDiv.appendChild(commenterDiv);

    let commenterPfp = document.createElement(`img`);
    getData("users")
        .then((user) => {
          if (user) {
            if (user[array[i].split("commenter:")[1].split("date:")[0]][`profilePicture`]) {
              commenterPfp.src = user[array[i].split("commenter:")[1].split("date:")[0]][`profilePicture`];
            }
            //  commentTextFr.push(commentsArray[i].split("commenter:")[0]);
            //  commenterFr.push(commentsArray[i].split("commenter:")[1]);
    
          } else {
            console.log("Veri bulunamadı.");
          }
        })
        .catch((error) => {
          console.error("Veri okuma hatası:", error);
        });
    commenterPfp.id = `commenter-pfp`;
    
    commenterDiv.appendChild(commenterPfp);

    let commenterAndDate = document.createElement(`div`);
    commenterAndDate.id = `commenter-and-date`;
    commenterDiv.appendChild(commenterAndDate);

    let commenterUsername = document.createElement(`p`);
    commenterUsername.id = `commenter-username`;
    getUserData(array[i].split(`commenter:`)[1].split("date:")[0])
        .then((userData) => {
          if (userData) {
          commenterUsername.innerText = userData["username"];
        } else {
            commenterUsername.innerText = `[deleted]`;
            commenterPfp.src = `1.png`;
          }
      })
      .catch((error) => {
          console.error("Veri okuma hatası:", error);
      });
    commenterAndDate.appendChild(commenterUsername);

    let commentDate = document.createElement(`p`);
    commentDate.id = `comment-date`;
    if(today.split("/")[2] - array[i].split(`commenter:`)[1].split("date:")[1].split("/")[2] == 0){
      if(today.split("/")[1] - array[i].split(`commenter:`)[1].split("date:")[1].split("/")[1] == 0){
        if(today.split("/")[0] - array[i].split(`commenter:`)[1].split("date:")[1].split("/")[0] == 0){
          commentDate.innerText = `Bugün`
        } else if(!(today.split("/")[0] - array[i].split(`commenter:`)[1].split("date:")[1].split("/")[0] == 0)){
          commentDate.innerText = `${today.split("/")[0] - array[i].split(`commenter:`)[1].split("date:")[1].split("/")[0]} gün önce`
        }
      } else if(!(today.split("/")[1] - array[i].split(`commenter:`)[1].split("date:")[1].split("/")[1] == 0)){
        commentDate.innerText = `${today.split("/")[1] - array[i].split(`commenter:`)[1].split("date:")[1].split("/")[1]} ay önce`
      }
    } else if(!(today.split("/")[2] - array[i].split(`commenter:`)[1].split("date:")[1].split("/")[2] == 0)){
      commentDate.innerText = `${today.split("/")[2] - array[i].split(`commenter:`)[1].split("date:")[1].split("/")[2]} yıl önce`
    }
    commenterAndDate.appendChild(commentDate)

    let commentText = document.createElement(`p`);
    commentText.id = `comment-text`;
    commentText.innerText = array[i].split(`commenter:`)[0];
    commentDiv.appendChild(commentText);


  }
}

setTimeout(() => createCommentElements(commentsArray), 1000);

*/