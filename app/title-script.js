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
function addCommentToAnime(animeName, newComment, commenter, date) {
  const commentsRef = ref(db, `animes/${animeName}/title/comments`);
  
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

var userUid = null;

auth.onAuthStateChanged(user => {
  if(user){    
    console.log(user.email);
    userUid = user.uid;

  }else{
    console.log("bum");
  }
});


//setTimeout(() => console.log(userUid), 1000); // Asenkron işlem olduğu için gecikme ile test ediliyor

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

var animes;
var episodeCount;
let fansubName;
let fansubElements = document.querySelectorAll('.fansub');

const URLParams = new URLSearchParams(window.location.search);
const animeName = URLParams.get('tags').toLowerCase();
let clientAnimeName = "";
for (let i in animeName.split("-")) {
  clientAnimeName += animeName.split("-")[i] + " ";

  clientAnimeName = clientAnimeName.toUpperCase();
}

document.getElementById("base-title").innerText = `${clientAnimeName}`;

// Bölüm Seçme

let selectEpisode;
getData("animes")
    .then((anime) => {
      if (anime) {
        episodeCount = Object.keys(anime[animeName]).length; // Kaç bölüm var?
        
        console.log(`${episodeCount} bölüm var.`);        

        for(let i=0;i<episodeCount;i++){
          console.log(Object.keys(anime[animeName]).includes("title"));
          if(!(Object.keys(anime[animeName])[i] == "title")){
            selectEpisode = document.createElement("div");
            selectEpisode.id = `select-episode`
            selectEpisode.innerText = `${i+1}. Bölüm`; // Alfabetik olarak ep{}, title'dan önce gelir. Bu yüzden 1 ekleriz.
            document.getElementById("select-episode-parent").appendChild(selectEpisode);
            selectEpisode.onclick = (function(link) {
              return function() {
                location.href = `${link}`;
              }
            })(`chapter.html?tags=${animeName}--${i+1}`);
          }
        }

      } else {
        console.log("Veri bulunamadı.");
      }
    })
    .catch((error) => {
      console.error("Veri okuma hatası:", error);
    });

// Açıklama ve Resmi güncelleme
getData("animes")
    .then((anime) => {
      if (anime) {
        document.getElementById("açıklama").innerText = anime[animeName]["title"]["description"];
        document.getElementById("anime-picture").src = anime[animeName]["title"]["picture"];
        document.getElementById("mal-score").innerText = "Puan: " + anime[animeName]["title"]["malScore"];
        let word = "";
        for(let i in anime[animeName]["title"]["tags"].split("?")){
          word = word + anime[animeName]["title"]["tags"].split("?")[i].charAt(0).toUpperCase() + anime[animeName]["title"]["tags"].split("?")[i].slice(1);
          if (i != anime[animeName]["title"]["tags"].split("?").length - 1) {
            word = word + ", ";
          }
        }
        document.getElementById("tags").innerText = word;
        for(let i=0; i<Object.keys(anime[animeName]).length; i++){
          document.getElementById("episode-count").innerText = "Bölüm Sayısı: " + i;
        }
      } else {
        console.log("Veri bulunamadı.");
      }
    })
    .catch((error) => {
      console.error("Veri okuma hatası:", error);
    });