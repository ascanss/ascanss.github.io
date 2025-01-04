import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js"
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
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

var userSigned = false;
var authPage = false;

// Read User Data

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

// User signIn/logIn stuff

auth.onAuthStateChanged(user => {
	if(user){
		let profile = document.createElement("img");
		getData("users")
    .then((usersDirectoryData) => {
    	if (usersDirectoryData) {
    		profile.src = usersDirectoryData[user.uid]["profilePicture"];
    	} else {
        console.log("Veri bulunamadı.");
      }
    })
    .catch((error) => {
      console.error("Veri okuma hatası:", error);
    });
		profile.id = "profile-button";
		profile.onclick = function(){
			location.href = `profile.html`;
		}

		document.getElementById("profile-button-parent").appendChild(profile);
		try{
			document.getElementById("sign-in-button-for-navbar").remove();
		}catch{
			console.log("Sign in button has not created yet.");
		}
	}else{
		let signInButton = document.createElement("div");
		signInButton.innerText = "Oturum Aç";
		signInButton.id = "sign-in-button-for-navbar"
		signInButton.style.cssText = `
			background-color: rgb(75, 190.5, 75);
			font-size: 1vw;
			font-weight: 500;
			width: 7vw;
			height: 3vw;
			color: #fff;
			text-decoration: none;
			font-family: 'Poppins', sans-serif;

			border-radius: 1vw;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
		`

		signInButton.onclick = function(){
			location.href = `auth.html`
		}

		document.getElementById("profile-button-parent").appendChild(signInButton);
	}
});


// Ana sayfayı güncelleme - updater verisini okuma

getData("updater")
  .then((update) => {
  	if (update["new version"] && location.href.split("/")[location.href.split("/").length-1] == "index.html") {
  		document.getElementById("new-version-container").style.display = "flex";
  		document.getElementById("download-new-version").innerText = "İndir: " + update["new version"].split("?^^?^^?")[0];
  		document.getElementById("download-new-version").onclick = function(){
  			location.href = update["new version"].split("?^^?^^?")[1];
  			document.getElementById("new-version-container").style.display = "none";
  		}
  		document.getElementById("next-time-lil-bro").onclick = function(argument) {
  			document.getElementById("new-version-container").style.display = "none";
  		}
  	} else {
  		console.log("straight sigma boy sigma alpha male ascanss evlatları");
  	}

    if (update && location.href.split("/")[location.href.split("/").length-1] == "index.html") {
    	// INDEX UPDATELERI
    	let indexUpdate = update["index"];

    	let word = "";

    	// Yeni Bölümler Kısmı
    	for(let i = 0; i < indexUpdate["yeni bölümler"].split("?").length; i++){
    		// Oluşturulacak elemanın innerText'i oluşturulur ve word değişkeni altında tutulur
    		word = "";
    		
    		for (let j = 0; j < indexUpdate["yeni bölümler"].split("?")[i].split("--")[0].split("-").length; j++){
    			word = word + indexUpdate["yeni bölümler"].split("?")[i].split("--")[0].split("-")[j].charAt(0).toUpperCase() +  indexUpdate["yeni bölümler"].split("?")[i].split("--")[0].split("-")[j].slice(1);
					if (!(j == indexUpdate["yeni bölümler"].split("?")[i].split("--")[0].split("-").length - 1)) {
						word = word + " ";
					}
    		}
    		let animePic = "";
    		getData("animes") // Anime görseli alınır
				  .then((anime) => {
				    if (anime) {
				    	animePic = anime[indexUpdate["yeni bölümler"].split("?")[i].split("--")[0]]["title"]["picture"];
				    } else {
				      console.log("Veri bulunamadı.");
				    }
				  })
				  .catch((error) => {
				    console.error("Veri okuma hatası:", error);
				  });
				word = `${word} | ${indexUpdate["yeni bölümler"].split("?")[i].split("--")[1]}. Bölüm`;
				
				// Eleman oluşturulur
				let indexDivElement = document.createElement(`div`); // --> div Elemanı
				indexDivElement.classList.add(`seri`);
				indexDivElement.id = `yeni-bölümler-seri-no${i}`;
				indexDivElement.onclick = function(){
					location.href = `chapter.html?tags=${indexUpdate["yeni bölümler"].split("?")[i]}`;
				}
				document.getElementById(`yeni-bölümler-base-child`).appendChild(indexDivElement);

				let indexImgElement = document.createElement(`img`); // --> img Elemanı (Resim)
				indexImgElement.classList.add(`seri-img`);
				setTimeout(() => indexImgElement.src = animePic, 1000);
				document.getElementById(`yeni-bölümler-seri-no${i}`).appendChild(indexImgElement);

				let indexerPElement = document.createElement(`p`); // --> p Elemanı (Yazı)
				indexerPElement.classList.add(`seri-ch`);
				indexerPElement.innerText = word;
				document.getElementById(`yeni-bölümler-seri-no${i}`).appendChild(indexerPElement);
    	}

    	// Popüler Seriler Kısmı
    	for(let i = 0; i < indexUpdate["popüler seriler"].split("?").length; i++){
    		// Oluşturulacak elemanın innerText'i oluşturulur ve word değişkeni altında tutulur
    		word = "";
    		
    		for (let j = 0; j < indexUpdate["popüler seriler"].split("?")[i].split("-").length; j++){
    			word = word + indexUpdate["popüler seriler"].split("?")[i].split("-")[j].charAt(0).toUpperCase() +  indexUpdate["popüler seriler"].split("?")[i].split("-")[j].slice(1);
					if (!(j == indexUpdate["popüler seriler"].split("?")[i].split("-").length - 1)) {
						word = word + " ";
					}
    		}

    		let animePic = "";
    		getData("animes") // Anime görseli alınır
				  .then((anime) => {
				    if (anime) {
				    	animePic = anime[indexUpdate["popüler seriler"].split("?")[i].split("--")[0]]["title"]["picture"];
				    } else {
				      console.log("Veri bulunamadı.");
				    }
				  })
				  .catch((error) => {
				    console.error("Veri okuma hatası:", error);
				  });
				
				
				// Eleman oluşturulur
				let indexDivElement = document.createElement(`div`); // --> div Elemanı
				indexDivElement.classList.add(`seri`);
				indexDivElement.id = `popüler-seriler-seri-no${i}`;
				indexDivElement.onclick = function(){
					location.href = `title.html?tags=${indexUpdate["popüler seriler"].split("?")[i]}`;
				}
				document.getElementById(`popüler-seriler-base-child`).appendChild(indexDivElement);

				let indexImgElement = document.createElement(`img`); // --> img Elemanı (Resim)
				indexImgElement.classList.add(`seri-img`);
				setTimeout(() => indexImgElement.src = animePic, 1000);
				document.getElementById(`popüler-seriler-seri-no${i}`).appendChild(indexImgElement);

				let indexerPElement = document.createElement(`p`); // --> p Elemanı (Yazı)
				indexerPElement.classList.add(`seri-ch`);
				indexerPElement.innerText = word;
				document.getElementById(`popüler-seriler-seri-no${i}`).appendChild(indexerPElement);   		
    	}
    	    	
    } else {

      console.log("Veri bulunamadı.");
    }
  })
  .catch((error) => {
    console.error("Veri okuma hatası:", error);
  });
