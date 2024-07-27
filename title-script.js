var seriCh = document.getElementById("seri-ch");
var showMore = document.getElementById("buttontoshowmore");
var haveClicked = 0;

let heightingen = seriCh.offsetHeight+.25;
let supposedHeight = (window.innerWidth/100)*21
console.log(`heightingen : ${heightingen}`)
console.log(`supposedHeight : ${supposedHeight}`)

if(heightingen < supposedHeight){
	console.log("it is")
}else{
	console.log("shut your bitchass")
}
console.log(heightingen << supposedHeight)

if (heightingen < supposedHeight) {
	showMore.innerText = "";
	showMore.style.width = "0px";
	showMore.style.height = "0px";

	showMore.style.border = "none";
	showMore.style.fontSize = "0px";
}

function changestuff() {
	if(haveClicked % 2 === 0){
		seriCh.style.maxHeight = "100vw";
		showMore.innerText = "Daha Az Göster";
	}else{
		seriCh.style.maxHeight = "21vw";
		showMore.innerText = "Daha Fazla Göster";
	}
	haveClicked += 1;
}