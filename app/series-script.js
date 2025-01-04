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


// Other than Firebase

getData("animes")
  .then((anime) => {
    if (anime) {
    	for(let i=0; i<Object.keys(anime).length; i++){
    		let word = "";

    		for(let j=0; j<Object.keys(anime)[i].split("-").length; j++){
    			word = word + Object.keys(anime)[i].split("-")[j].charAt(0).toUpperCase() + Object.keys(anime)[i].split("-")[j].slice(1);
    			if(!(j==Object.keys(anime)[i].split("-").length-1)){
    				word = word + " ";
    			}
    		}

			let seriesDivElement = document.createElement(`div`); // --> div Elemanı
			seriesDivElement.classList.add(`seri`);
			seriesDivElement.id = `series-seri-no${i}`;
			seriesDivElement.onclick = function(){
				location.href = `title.html?tags=${Object.keys(anime)[i]}`;
			}
			document.getElementById(`series-base-child`).appendChild(seriesDivElement);

			let indexImgElement = document.createElement(`img`); // --> img Elemanı (Resim)
			indexImgElement.classList.add(`seri-img`);
			indexImgElement.src = anime[Object.keys(anime)[i]]["title"]["picture"];
			document.getElementById(`series-seri-no${i}`).appendChild(indexImgElement);

			let indexerPElement = document.createElement(`p`); // --> p Elemanı (Yazı)
			indexerPElement.classList.add(`seri-ch`);
			indexerPElement.innerText = word;
			document.getElementById(`series-seri-no${i}`).appendChild(indexerPElement);   
    	}
   	} else {
      console.log("Veri bulunamadı.");
    }
  })
  .catch((error) => {
    console.error("Veri okuma hatası:", error);
  });


document.getElementById("apply-changes").onclick = function(){
	console.log(document.getElementById("kategoriler").value == "hepsi")

	document.getElementById("series-base-child").remove();

	let newSeriesBaseChild = document.createElement("div");
	newSeriesBaseChild.id = "series-base-child";
	newSeriesBaseChild.classList.add("base-child");
	document.getElementById("yeni-bölümler").appendChild(newSeriesBaseChild);

	getData("animes")
	.then((anime) => {
		if (anime) {
			for(let i=0; i<Object.keys(anime).length; i++){
				if ((anime[Object.keys(anime)[i]]["title"]["tags"].includes(document.getElementById("kategoriler").value) || document.getElementById("kategoriler").value == "hepsi") && (anime[Object.keys(anime)[i]]["title"]["tags"].includes(document.querySelector('input[name="type-of-anime"]:checked').value) || document.querySelector('input[name="type-of-anime"]:checked').value == "hepsi")) {
					let word = "";

					for(let j=0; j<Object.keys(anime)[i].split("-").length; j++){
						word = word + Object.keys(anime)[i].split("-")[j].charAt(0).toUpperCase() + Object.keys(anime)[i].split("-")[j].slice(1);
						if(!(j==Object.keys(anime)[i].split("-").length-1)){
							word = word + " ";
						}
					}

					let seriesDivElement = document.createElement(`div`); // --> div Elemanı
					seriesDivElement.classList.add(`seri`);
					seriesDivElement.id = `series-seri-no${i}`;
					seriesDivElement.onclick = function(){
						location.href = `title.html?tags=${Object.keys(anime)[i]}`;
					}
					document.getElementById(`series-base-child`).appendChild(seriesDivElement);

					let indexImgElement = document.createElement(`img`); // --> img Elemanı (Resim)
					indexImgElement.classList.add(`seri-img`);
					indexImgElement.src = anime[Object.keys(anime)[i]]["title"]["picture"];
					document.getElementById(`series-seri-no${i}`).appendChild(indexImgElement);

					let indexerPElement = document.createElement(`p`); // --> p Elemanı (Yazı)
					indexerPElement.classList.add(`seri-ch`);
					indexerPElement.innerText = word;
					document.getElementById(`series-seri-no${i}`).appendChild(indexerPElement);
				}
			}
		} else {
			console.log("Veri bulunamadı.");
		}
	})
	.catch((error) => {
	console.error("Veri okuma hatası:", error);
	});
}