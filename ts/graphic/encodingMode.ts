function setAllButtonsToNotSelected() {
    document.getElementById("btnNumeric").classList.remove("btn-primary");
    document.getElementById("btnAlfanumeric").classList.remove("btn-primary");
    document.getElementById("btnByte").classList.remove("btn-primary");
    document.getElementById("btnKanji").classList.remove("btn-primary");
    document.getElementById("btnNumeric").classList.add("btn-outline-primary");
    document.getElementById("btnAlfanumeric").classList.add("btn-outline-primary");
    document.getElementById("btnByte").classList.add("btn-outline-primary");
    document.getElementById("btnKanji").classList.add("btn-outline-primary");
}

document.getElementById("btnNumeric").onclick= function() {
    const contenuto = (document.getElementById("txtTesto") as HTMLInputElement).value;
    if(!IsNumeric(contenuto)) return alert("Il contenuto non è numerico");
    encodingMode = EncodingMode.NUMERIC;
    setAllButtonsToNotSelected();
    document.getElementById("btnNumeric").classList.add("btn-primary");
    document.getElementById("btnNumeric").classList.remove("btn-outline-primary");
}

document.getElementById("btnAlfanumeric").onclick= function() {
    const contenuto = (document.getElementById("txtTesto") as HTMLInputElement).value;
    if(!IsAlfanumeric(contenuto)) return alert("Il contenuto non è alfanumerico");
    encodingMode = EncodingMode.ALFANUMERIC;
    setAllButtonsToNotSelected();
    document.getElementById("btnAlfanumeric").classList.add("btn-primary");
    document.getElementById("btnAlfanumeric").classList.remove("btn-outline-primary");
}

document.getElementById("btnByte").onclick= function() {
    encodingMode = EncodingMode.BYTE;
    setAllButtonsToNotSelected();
    document.getElementById("btnByte").classList.add("btn-primary");
    document.getElementById("btnByte").classList.remove("btn-outline-primary");
}

document.getElementById("btnKanji").onclick= function() {
    encodingMode = EncodingMode.KANJI;
    setAllButtonsToNotSelected();
    document.getElementById("btnKanji").classList.add("btn-primary");
    document.getElementById("btnKanji").classList.remove("btn-outline-primary");
}