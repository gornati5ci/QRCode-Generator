function GetDataLength(informations) {
    return DATA_LENGTH.filter(function (data) { return data.version == informations.version && data.errorCorrection == informations.errorCorrection; })[0];
}
function IsAlfanumeric(stringa) {
    for (var i = 0; i < stringa.length; i++) {
        if (VALID_ALPHANUMERIC[stringa[i]] == undefined)
            return false;
    }
    return true;
}
function IsNumeric(stringa) {
    for (var i = 0; i < stringa.length; i++) {
        if (!(stringa[i] >= '0' && stringa[i] <= '9'))
            return false;
    }
    return true;
}
function GetModeIndicator(mode) {
    switch (mode) {
        case EncodingMode.NUMERIC: return 1;
        case EncodingMode.ALFANUMERIC: return 2;
        case EncodingMode.BYTE: return 4;
        case EncodingMode.KANJI: return 8;
        default: throw "Invalid Encoding Mode";
    }
}
function GetCharacterCountLength(version, mode) {
    switch (mode) {
        case EncodingMode.NUMERIC:
            if (version >= 1 && version <= 9)
                return 10;
            if (version >= 10 && version <= 26)
                return 12;
            if (version >= 27 && version <= 40)
                return 14;
            break;
        case EncodingMode.ALFANUMERIC:
            if (version >= 1 && version <= 9)
                return 9;
            if (version >= 10 && version <= 26)
                return 11;
            if (version >= 27 && version <= 40)
                return 13;
            break;
        case EncodingMode.BYTE:
            if (version >= 1 && version <= 9)
                return 8;
            if (version >= 10 && version <= 26)
                return 16;
            if (version >= 27 && version <= 40)
                return 16;
            break;
        case EncodingMode.KANJI:
            if (version >= 1 && version <= 9)
                return 8;
            if (version >= 10 && version <= 26)
                return 10;
            if (version >= 27 && version <= 40)
                return 12;
            break;
    }
    throw "Something wrong...";
}
function EncodeByte(testo) {
    var temp = testo.split("").map(function (carattere) { return carattere.charCodeAt(0).toString(2); });
    temp = temp.map(function (temp) { while (temp.length < 8)
        temp = "0" + temp; return temp; });
    console.log(temp);
    return temp.join("");
}
function EncodeAlfanumeric(testo) {
    var finalResult = "";
    while (testo.length > 1) {
        var first = VALID_ALPHANUMERIC[testo.substring(0, 1)];
        var second = VALID_ALPHANUMERIC[testo.substring(1, 2)];
        var value = first * 45 + second;
        var result = value.toString(2);
        while (result.length < 11) {
            result = "0" + result;
        }
        finalResult += result;
        testo = testo.substring(2);
    }
    if (testo.length == 0)
        return finalResult;
    var singleValue = VALID_ALPHANUMERIC[testo];
    var singleResult = singleValue.toString(2);
    while (singleResult.length < 6) {
        singleResult = "0" + singleResult;
    }
    finalResult += singleResult;
    return finalResult;
}
function Color(row, col, color) {
    var cells = document.querySelectorAll("td[data-row=\"" + row + "\"][data-col=\"" + (col) + "\"]");
    for (var i = 0; i < cells.length; i++) {
        cells[i].className = "";
        cells[i].classList.add(color);
    }
}
function GetMinValidVersion(lunghezzaDelTesto) {
    var maxVersion = Object.keys(VERSIONS_DIMENSIONS).map(Number).sort().pop();
    for (var i = 1; i <= maxVersion; i++) {
        if (VERSIONS_DIMENSIONS[i][errorCorrection][encodingMode] < lunghezzaDelTesto)
            continue;
        return i;
    }
    return null;
}
