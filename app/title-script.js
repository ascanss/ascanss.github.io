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

// YORUMLAR

// Input'a tıklandığında Paylaş butonunun gösterilmesi
document.getElementById(`new-comment-input`).addEventListener("click", function(){ // Input'a tıklandığında çalışır
  document.getElementById(`new-comment-submit`).style.display = "flex" // Paylaş butonu görünür hale gelir
});

// Yorum ekleme
document.getElementById(`new-comment-submit`).addEventListener("click", function(){ // Paylaş butonuna tıklanırsa çalışır 
  if(document.getElementById(`new-comment-input`).value){ // Input içindeki değer null mu diye kontrol edilir
    console.log(document.getElementById(`new-comment-input`).value); // Input'a yazılan yazı consola yazdırılır



    let commentValue = document.getElementById(`new-comment-input`).value;

    addCommentToAnime(animeName, commentValue, userUid, today); // Yorum veritabanına eklenir

    document.getElementById(`new-comment-input`).value = "" // Input temizlenir
  }
});

// Yorumların gösterilmesi

let commentsArray = [];
getData("animes") // Yorumlar okunur
    .then((anime) => {
      if (anime) {
        commentsArray = anime[animeName][`title`][`comments`];


        
        //  commentTextFr.push(commentsArray[i].split("commenter:")[0]);
        //  commenterFr.push(commentsArray[i].split("commenter:")[1]);

      } else {
        console.log("Veri bulunamadı.");
      }
    })
    .catch((error) => {
      console.error("Veri okuma hatası:", error);
    });

function createCommentElements(array){ // array yerine commentsArray yazılır.
  for(let i in array){
    let commentDiv = document.createElement("div");
    commentDiv.id = `comment-div`;
    document.getElementById(`comments-seri`).appendChild(commentDiv);

    let commenterDiv = document.createElement(`div`);
    commenterDiv.id = `commenter-div`;
    commentDiv.appendChild(commenterDiv);

    let commenterPfp = document.createElement(`img`);
    commenterPfp.id = `commenter-pfp`;
    commenterPfp.src = `1.png`;
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
              console.log("Kullanıcı bulunamadı.");
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


// Açıklama ve Resmi güncelleme
getData("animes")
    .then((anime) => {
      if (anime) {
        document.getElementById("açıklama").innerText = anime[animeName]["title"]["description"];
        document.getElementById("anime-picture").src =anime[animeName]["title"]["picture"];
      } else {
        console.log("Veri bulunamadı.");
      }
    })
    .catch((error) => {
      console.error("Veri okuma hatası:", error);
    });