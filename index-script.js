pairs = {
	"1.0.1": "https://github.com/ascanss/ascanss.github.io/releases/download/untagged-1b60a794ebc597d6e1cf/ascanss-1.0.1.Setup.exe"
}

function download(version){
	location.href = pairs[version];
}