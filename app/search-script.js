let textInput = document.getElementById("searchinp");
let searchfr = document.getElementById("searchfr");
let searchinpbutton = document.getElementById("searchinpbutton");
let haveClickedToTurnOn = 0;
let word;

textInput.value = "";

function inputStart() {
	if (haveClickedToTurnOn % 2 === 0) {
		textInput.style.display = "inline";
		searchfr.style.display = "inline";
		searchinpbutton.innerText = "X";
	}else{
		textInput.style.display = "none";
		searchfr.style.display = "none";
		searchinpbutton.innerText = "<";
	}

	haveClickedToTurnOn += 1;
}

function addingtolist() {
	word = textInput.value;
	console.log(word);
}

function finnadidit(scope) {
	if (word == null) {
		console.log(`Can't search because input value is ${word}.\nWrite something on input or delete existing value on it and rewrite.`);
	}else{
		if(!scope){
			window.location.href = `search.html?tags=${word}`;
		}else{
			window.location.href = `../../search.html?tags=${word}`;
		}
	}

}

// Word birden fazla kelimeden oluşabilir onu parçala ve bir şeklde query ile diğer sekmeye gönder 
// veya bütün olarak gönderip orada parçala