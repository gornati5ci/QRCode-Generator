var encodingMode = null;
var errorCorrection = null;
var txtTesto = document.getElementById("txtTesto");
document.getElementById("txtTesto").onchange = function () {
    var contenuto = document.getElementById("txtTesto").value;
    var isNumeric = IsNumeric(contenuto);
    var isAlfanumeric = IsAlfanumeric(contenuto);
    setAllButtonsToNotSelected();
    if (isNumeric) {
        document.getElementById("btnNumeric").classList.add("btn-primary");
        document.getElementById("btnNumeric").classList.remove("btn-outline-primary");
        encodingMode = EncodingMode.NUMERIC;
    }
    else if (isAlfanumeric) {
        document.getElementById("btnAlfanumeric").classList.add("btn-primary");
        document.getElementById("btnAlfanumeric").classList.remove("btn-outline-primary");
        encodingMode = EncodingMode.ALFANUMERIC;
    }
    else {
        document.getElementById("btnByte").classList.add("btn-primary");
        document.getElementById("btnByte").classList.remove("btn-outline-primary");
        encodingMode = EncodingMode.BYTE;
    }
};
txtTesto.value = "https://www.jw.org/it";
txtTesto.onchange.call(document.getElementById("txtTesto"));
document.getElementById("btnGenerate").onclick = function () {
    if (encodingMode == null)
        return alert("Encoding mode not set");
    if (errorCorrection == null)
        return alert("Error correction is missing");
    var testo = txtTesto.value;
    var informations = new GeneralInformation();
    informations.encodingMode = encodingMode;
    informations.errorCorrection = errorCorrection;
    informations.CalculateVersion(testo);
    var contenuto = new Contenuto(informations, testo);
    for (var i = 0; i < 8; i++) {
        var table = InitializeTable(informations.version, contenuto.testo);
        table.SetFormatInformation(table.CalculateFormatInformations(i));
        var coordinates = new Coordinates(table);
        for (var i_1 = 0; i_1 < table.testo.length; i_1++) {
            var cell = table.cells[coordinates.row][coordinates.col];
            if (cell.scope != CellScope.Empty)
                continue;
            cell.scope = CellScope.Data;
            cell.black = table.testo[i_1] == "1";
            if (i_1 != table.testo.length - 1)
                coordinates.move();
        }
        table.Mask(i);
        console.log(table);
        DrawTable(i, table);
    }
};
function DrawTable(indice, table) {
    var html = document.querySelector("[data-qr-code=\"" + indice + "\"]");
    while (html.children.length > 0)
        html.children[0].remove();
    for (var i = 0; i < table.dimension; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < table.dimension; j++) {
            var td = document.createElement("td");
            td.dataset.row = i.toString();
            td.dataset.col = j.toString();
            td.classList.add("red");
            tr.appendChild(td);
        }
        html.appendChild(tr);
    }
    for (var _i = 0, _a = table.cells; _i < _a.length; _i++) {
        var row = _a[_i];
        for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
            var cell = row_1[_b];
            Color(cell.row, cell.col, cell.black ? "black" : "white");
        }
    }
}
document.getElementById("btnM").click();
document.getElementById("btnGenerate").click();
