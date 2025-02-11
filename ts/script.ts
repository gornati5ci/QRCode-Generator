let encodingMode: EncodingMode | null = null;
let errorCorrection: ErrorCorrection | null = null;
const txtTesto = (document.getElementById("txtTesto") as HTMLInputElement);

document.getElementById("txtTesto").onchange = function () {
    const contenuto = (document.getElementById("txtTesto") as HTMLInputElement).value;
    const isNumeric = IsNumeric(contenuto);
    const isAlfanumeric = IsAlfanumeric(contenuto);
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
    } else {
        document.getElementById("btnByte").classList.add("btn-primary");
        document.getElementById("btnByte").classList.remove("btn-outline-primary");
        encodingMode = EncodingMode.BYTE;
    }

};

txtTesto.value = "https://www.jw.org/it";
txtTesto.onchange.call(document.getElementById("txtTesto"));




document.getElementById("btnGenerate").onclick = function () {
    if (encodingMode == null) return alert("Encoding mode not set");
    if (errorCorrection == null) return alert("Error correction is missing");
    const testo = txtTesto.value;
    const informations = new GeneralInformation();
    informations.encodingMode = encodingMode;
    informations.errorCorrection = errorCorrection;
    informations.CalculateVersion(testo);
    const contenuto = new Contenuto(informations, testo);
    for (let i = 0; i < 8; i++) {
        const table = InitializeTable(informations.version, contenuto.testo);
        table.SetFormatInformation(table.CalculateFormatInformations(i));
        const coordinates = new Coordinates(table);
        for (let i = 0; i < table.testo.length; i++) {
            const cell = table.cells[coordinates.row][coordinates.col];
            if(cell.scope!=CellScope.Empty) continue;
            cell.scope = CellScope.Data;
            cell.black = table.testo[i]=="1";
            if (i != table.testo.length - 1)
                coordinates.move();
        }
        table.Mask(i);
        console.log(table);
        DrawTable(i,table);
    }
}

function DrawTable(indice: number, table: Table) {
    const html = document.querySelector("[data-qr-code=\"" + indice + "\"]");
    while (html.children.length > 0) html.children[0].remove();
    for (let i = 0; i < table.dimension; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < table.dimension; j++) {
            const td = document.createElement("td");
            td.dataset.row = i.toString();
            td.dataset.col = j.toString();
            td.classList.add("red");
            tr.appendChild(td);
        }
        html.appendChild(tr);
    }
    for(const row of table.cells) {
        for(const cell of row) {
            Color(cell.row, cell.col, cell.black?"black":"white");
        }
    }

}

document.getElementById("btnM").click();
document.getElementById("btnGenerate").click();