const URLParams = new URLSearchParams(window.location.search);
const tags = URLParams.get('tags').toLowerCase();
const clientTags = tags.toUpperCase();
let slicedTags = tags.split(" ");
let equals = [""];
let series = [];
let headinto = [];

let basechildStyleSheet = {
    width: "88vw",
    display: "flex",
    flexDirection: "row",
    alignSelf: "start",
    padding: "1vw",
    overflowY: "auto",
    justifyContent: "start"
}

let seriStyleSheet = {
    margin: "1%",
    cursor: "pointer"
}

let seriimgStyleSheet = {
    margin: "1%",
    padding: 0,

    width: "15vw",
    height: "20vw"
}

let serichStyleSheet = {
    color: "#fff",
    fontFamily: "sans-serif",
    fontSize: "1.5vw",
    textAlign: "center",
    maxWidth: "15vw"
}

function createfr() {


	let base = document.getElementById("base");
	let basetitle = document.getElementById("base-title");

	basetitle.innerText = `${clientTags}`;
	let currentBaseChild;

	let basechild1 = document.createElement("div");
	let basechild2 = document.createElement("div");
	let basechild3 = document.createElement("div");

	base.appendChild(basechild1);
	base.appendChild(basechild2);
	base.appendChild(basechild3);

	let fünf = 1;
	for (i=0; i<series.length; i++) {
		
		
		if (fünf <= 5) {
			Object.assign(basechild1.style, basechildStyleSheet);
			currentBaseChild = basechild1;

			let seri1 = document.createElement("div");
			seri1.id = `seriId${i}`;
			let seriimg1 = document.createElement("img");
			let serich1 = document.createElement("p");

			Object.assign(seri1.style, seriStyleSheet);
			Object.assign(seriimg1.style, seriimgStyleSheet);
			Object.assign(serich1.style, serichStyleSheet);

			seriimg1.src = "1.png";
			seri1.onclick = (function(boo) {
				return function() {
					location.href = `titles/${boo}/title.html`;

				}
			})(headinto[i]);
			//function() {location.href = `titles/${headinto[i]}/title.html`;}
			console.log(series[i]);
			serich1.innerText = `${series[i]}`;

			
			basechild1.appendChild(seri1);
			seri1.appendChild(seriimg1);
			seri1.appendChild(serich1);
			fünf++;


		}else if (fünf > 5 && fünf <= 10) {
			Object.assign(basechild2.style, basechildStyleSheet);
			currentBaseChild = basechild2;

			let seri2 = document.createElement("div");
			let seriimg2 = document.createElement("img");
			let serich2 = document.createElement("p");

			Object.assign(seri2.style, seriStyleSheet);
			Object.assign(seriimg2.style, seriimgStyleSheet);
			Object.assign(serich2.style, serichStyleSheet);

			seriimg2.src = "1.png";
			seri2.onclick = (function(boo) {
				return function() {
					location.href = `titles/${boo}/title.html`;

				}
			})(headinto[i]);
			serich2.innerText = `${series[i]}`; 

			basechild2.appendChild(seri2);
			seri2.appendChild(seriimg2);
			seri2.appendChild(serich2);

			fünf++;

		}else if(fünf > 10 && fünf < 15){

			Object.assign(basechild3.style, basechildStyleSheet);
			currentBaseChild = basechild3;

			let seri3 = document.createElement("div");
			let seriimg3 = document.createElement("img");
			let serich3 = document.createElement("p");

			Object.assign(seri.style, seriStyleSheet);
			Object.assign(seriimg.style, seriimgStyleSheet);
			Object.assign(serich.style, serichStyleSheet);

			seriimg.src = "1.png";
			seri.onclick = (function(boo) {
				return function() {
					location.href = `titles/${boo}/title.html`;

				}
			})(headinto[i]);
			serich.innerText = `${series[i]}`;

			basechild3.appendChild(seri);
			seri.appendChild(seriimg);
			seri.appendChild(serich);

			fünf++;
		}
	}
}


function createinyen() {
	for(i in equals){
		for(dim1 in titleTags){
			for(dim2 in titleTags[dim1]){
				if(titleTags[dim1][dim2] === equals[i]){
					if (!series.includes(titleTags[dim1][0])) {
						series.push(titleTags[dim1][0]);
						headinto.push(titleTags[dim1][1]);
						console.log(headinto);
						console.log(series);
					}
				}
			}
		}
	}
}

function ifThere() {//check if there is a serie with tags
	for(i in titleTags){
		for(j in titleTags[i]){
			for(tag in slicedTags){
				if (slicedTags[tag] === titleTags[i][j]){
					if(!equals.includes(slicedTags[tag])){
						equals.push(slicedTags[tag]);
					}
				}
			}
		}
	}
}

const titleTags = [// ilk eleman kullanıcıya gösterilir, ikinci seri sayfasına gitmek için, diğerleri ise arama fonksiyonunun seriyi bulabilmesi için.		
	["Omniscient Readers Viewpoint", "omniscient-readers-viewpoint", "omniscient", "readers", "viewpoint"],
	["Reiwa-no Dara-san", "reiwa-no-dara-san", "reiwa", "reiwa-no", "dara", "dara-san"]
]

ifThere();
createinyen();
createfr();