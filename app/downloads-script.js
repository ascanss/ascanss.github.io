let message = 0;
let line = 0;

if(downloads.length != 0){
	for(i in downloads){
		if(i%5 == 0 || i == 0){
			line += 1;
			baseChild = document.createElement("div");
			baseChild.classList.add("base-child");
			baseChild.id = `base-child${line}`
			document.getElementById("base").appendChild(baseChild);
		}

		seri = document.createElement("div");
		seri.classList.add("seri");
		seri.onclick = (function(boo) {
			return function() {
				location.href = `chapter.html?tags=${boo}`;

			}
		})(downloads[i]);

		img = document.createElement("img");
		img.classList.add("seri-img");
		img.src = "1.png";

		p = document.createElement("p");
		p.classList.add("seri-ch");
		p.innerText = `${downloads[i].split("/")[0]} | ${downloads[i].split("/")[1]}`;

		document.getElementById(`base-child${line}`).appendChild(seri);
		seri.appendChild(img);
		seri.appendChild(p);

	}

}else if(downloads.length <= 0){
	document.getElementById(`titlenyen`).innerText = "Daha hiç bölüm indirmediniz.";
}