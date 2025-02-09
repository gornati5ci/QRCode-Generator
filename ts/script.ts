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
    const minValidVersion = GetMinValidVersion(testo.length);
    console.log("VERSION:" + minValidVersion);
    if (minValidVersion == null) return alert("Il testo inserito è troppo grosso");

    let stringa = GenerateFullDataString(testo, minValidVersion);

    const dataLength = GetDataLength(minValidVersion, errorCorrection);
    let codewords: string[] = [];
    while (stringa.length > 0) {
        codewords.push(stringa.substring(0, 8));
        stringa = stringa.substring(8);
    }

    const groups = DivideCodewords(codewords, dataLength);

    GenerateErrorChecking(groups, dataLength);

    let finalResult = Interleaving(groups);

    finalResult = FinalPadding(minValidVersion, finalResult);

    manageTable(minValidVersion, finalResult, true, true);

    manageTable(minValidVersion, finalResult, false, false);

    ManageMasking();

    manageTable(minValidVersion, finalResult, true, false);


    for (let i = 0; i < 8; i++) {

        let generator = "10100110111";
        let formatString = "";
        switch (errorCorrection) {
            case ErrorCorrection.H: formatString = "10"; break;
            case ErrorCorrection.L: formatString = "01"; break;
            case ErrorCorrection.M: formatString = "00"; break;
            case ErrorCorrection.Q: formatString = "11"; break;
            default: throw "Invalid";
        }
        if (i.toString(2).length == 1) formatString += "00";
        else if (i.toString(2).length == 2) formatString += "0";
        else if (i.toString(2).length == 3) formatString += "";
        formatString += i.toString(2);
        let message = formatString + "0000000000";
        while (message.indexOf("0") == 0) message = message.substring(1);
        let originalGenerator = generator;

        let result = "";
        while (message.length >= 11) {
            result = "";
            generator = originalGenerator;
            while (generator.length < message.length) generator += "0";
            for (let i = 0; i < generator.length; i++) {
                result += Number(generator[i]) ^ Number(message[i]);
            }
            message=result;
            while (message.indexOf("0") == 0) message = message.substring(1);
        }

        while (message.length < 10) message = "0" + message;

        formatString = formatString + message;
        result = "";
        for (let i = 0; i < formatString.length; i++) {
            result += Number(formatString[i]) ^ Number("101010000010010"[i]);
        }

        const table = document.querySelector("[data-qr-code=\""+i+"\"]");
        let numberOfCells = table.children.length;
        for(let j=0; j<6; j++) {
            table.querySelector("[data-row=\"8\"][data-col=\""+j+"\"]").className="";
            table.querySelector("[data-row=\""+(numberOfCells-j-1)+"\"][data-col=\"8\"]").className="";
            table.querySelector("[data-row=\""+(numberOfCells-j-1)+"\"][data-col=\"8\"]").classList.add(result[j]=="1"?"black":"white");
            table.querySelector("[data-row=\"8\"][data-col=\""+j+"\"]").classList.add(result[j]=="1"?"black":"white");
        }
        table.querySelector("[data-row=\""+(numberOfCells-6-1)+"\"][data-col=\"8\"]").className="";
        table.querySelector("[data-row=\""+(numberOfCells-6-1)+"\"][data-col=\"8\"]").classList.add(result[6]=="1"?"black":"white");
        table.querySelector("[data-row=\""+(7)+"\"][data-col=\"8\"]").className="";
        table.querySelector("[data-row=\""+(7)+"\"][data-col=\"8\"]").classList.add(result[8]=="1"?"black":"white");
        table.querySelector("[data-row=\""+(5)+"\"][data-col=\"8\"]").className="";
        table.querySelector("[data-row=\""+(5)+"\"][data-col=\"8\"]").classList.add(result[9]=="1"?"black":"white");
        table.querySelector("[data-row=\""+(4)+"\"][data-col=\"8\"]").className="";
        table.querySelector("[data-row=\""+(4)+"\"][data-col=\"8\"]").classList.add(result[10]=="1"?"black":"white");
        table.querySelector("[data-row=\""+(3)+"\"][data-col=\"8\"]").className="";
        table.querySelector("[data-row=\""+(3)+"\"][data-col=\"8\"]").classList.add(result[11]=="1"?"black":"white");
        table.querySelector("[data-row=\""+(2)+"\"][data-col=\"8\"]").className="";
        table.querySelector("[data-row=\""+(2)+"\"][data-col=\"8\"]").classList.add(result[12]=="1"?"black":"white");
        table.querySelector("[data-row=\""+(1)+"\"][data-col=\"8\"]").className="";
        table.querySelector("[data-row=\""+(1)+"\"][data-col=\"8\"]").classList.add(result[13]=="1"?"black":"white");
        table.querySelector("[data-row=\""+(0)+"\"][data-col=\"8\"]").className="";
        table.querySelector("[data-row=\""+(0)+"\"][data-col=\"8\"]").classList.add(result[14]=="1"?"black":"white");
        for(let j=6; j<8; j++) {
            table.querySelector("[data-row=\"8\"][data-col=\""+(j+1)+"\"]").className="";
            table.querySelector("[data-row=\"8\"][data-col=\""+(j+1)+"\"]").classList.add(result[j]=="1"?"black":"white");
        }

        for(let j=0; j<8; j++) {
            table.querySelector("[data-row=\"8\"][data-col=\""+(numberOfCells-j-1)+"\"]").className="";
            table.querySelector("[data-row=\"8\"][data-col=\""+(numberOfCells-j-1)+"\"]").classList.add(result[7+j]=="1"?"black":"white");
        }
    }

}

function ManageMasking() {
    for (let i = 0; i < masking.length; i++) {
        const table = document.querySelector("[data-qr-code=\"" + i.toString() + "\"]");
        let numberOfPixels = table.children.length;
        for (let riga = 0; riga < numberOfPixels; riga++) {
            for (let colonna = 0; colonna < numberOfPixels; colonna++) {
                if (table.children[riga].children[colonna].classList.contains("green")) continue;
                if (!masking[i](riga, colonna)) continue;
                const isDark = table.children[riga].children[colonna].classList.contains("black");
                table.children[riga].children[colonna].className = "";
                if (isDark)
                    table.children[riga].children[colonna].classList.add("white");
                else
                    table.children[riga].children[colonna].classList.add("black");
            }
        }
    }
}

const masking = [
    (row, col) => (row + col) % 2 == 0,
    (row, col) => (row % 2) == 0,
    (row, col) => (col % 3) == 0,
    (row, col) => (row + col) % 3 == 0,
    (row, col) => (Math.floor(row / 2) + Math.floor(col / 3)) % 2 == 0,
    (row, col) => ((row * col) % 2) + ((row * col) % 3) == 0,
    (row, col) => (((row * col) % 2) + ((row * col) % 3)) % 2 == 0,
    (row, col) => (((row + col) % 2) + ((row * col) % 3)) % 2 == 0
];

function FinalPadding(version: number, stringa: string) {
    switch (version) {
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            stringa += "0000000";
            break;
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 28:
        case 29:
        case 30:
        case 31:
        case 32:
        case 33:
        case 34:
            stringa += "000";
            break;
        case 21:
        case 22:
        case 23:
        case 24:
        case 24:
        case 26:
        case 27:
            stringa += "0000";
            break;

    }

    return stringa;
}

function Interleaving(groups: Group[]): string {
    const interleavingData: string[][] = [];
    const interleavingError: string[][] = [];
    let maxLengthData = 0;
    let maxLengthError = 0;
    for (const group of groups) {
        for (const block of group.blocks) {
            interleavingData.push(block.codewords);
            interleavingError.push(block.error);
            maxLengthData = block.codewords.length > maxLengthData ? block.codewords.length : maxLengthData;
            maxLengthError = block.error.length > maxLengthError ? block.error.length : maxLengthError;
            console.log("code", block.codewords.length);
            console.log("error", block.error.length);
        }
    }

    let finalDataString = "";
    for (let i = 0; i < maxLengthData; i++) {
        for (let j = 0; j < interleavingData.length; j++) {
            if (interleavingData[j].length > i)
                finalDataString += interleavingData[j][i];
        }
    }

    let finalErrorString = "";
    for (let i = 0; i < maxLengthError; i++) {
        for (let j = 0; j < interleavingError.length; j++) {
            if (interleavingError[j].length > i)
                finalErrorString += interleavingError[j][i];
        }
    }

    let finalResult = finalDataString + finalErrorString;
    return finalResult;
}


function GetGenerator(grado:number) {
    switch(grado) {
        case 7: return [0,87,229,146,149,238,102,21];
        case 8: return [0,175,238,208,249,215,252,196,28];
        case 9: return [0,95,246,137,231,235,149,11,123,36];
        case 10: return [0,251,67,46,61,118,70,64,96,32,45];
        case 16: return [0,120,104,107,109,102,161,76,3,91,191,147,169,182,194,225,120];
        case 22: return [0,210,171,247,242,93,230,13,109,221,53,200,74,8,172,98,80,219,134,160,105,165,231];
        case 28: return [0,168,223,200,104,224,234,108,180,110,190,195,147,205,27,232,201,21,43,245,87,42,195,212,119,242,37,9,123];
    }
}

function GenerateErrorChecking(groups: Group[], dataLength: DataLength) {
    for (const group of groups) {
        for (const block of group.blocks) {
            const polinomioMessaggio = new Polinomio(block.codewords.length - 1);
            let grado = polinomioMessaggio.grado;
            for (const codeword of block.codewords) {
                polinomioMessaggio.setup(parseInt(codeword, 2), grado--);
            }
            polinomioMessaggio.moltiplicaEsponenti(dataLength.errorCodewordsPerBlock);

            const polinomioGeneratore = new Polinomio(dataLength.errorCodewordsPerBlock);
            console.log("GRADO: "+dataLength.errorCodewordsPerBlock);
            const coefficienti = GetGenerator(dataLength.errorCodewordsPerBlock);
            for(let i=0; i<coefficienti.length+1; i++) {
                polinomioGeneratore.setup(coefficienti[i],dataLength.errorCodewordsPerBlock-i+1);
            }
            console.log(polinomioGeneratore);
            const originalGrade = polinomioGeneratore.grado;
            polinomioGeneratore.moltiplicaEsponenti(polinomioMessaggio.grado);

            for (let i = 0; i < block.codewords.length; i++) {
                const esponente = ANTILOG[polinomioMessaggio.coefficienti[0]];
                const temp = polinomioGeneratore.sommaCoefficientiNuovo(esponente, originalGrade);
                temp.eseguiLog();
                polinomioMessaggio.xor(temp);
                polinomioMessaggio.coefficienti.splice(0, 1);
                polinomioMessaggio.esponenti.splice(0, 1);
                polinomioGeneratore.moltiplicaEsponenti(-1);
                polinomioGeneratore.esponenti.pop();
                polinomioGeneratore.coefficienti.pop();
            }

            for (let i = 0; i < polinomioMessaggio.coefficienti.length; i++) {
                let temp = polinomioMessaggio.coefficienti[i].toString(2);
                while (temp.length < 8) temp = "0" + temp;
                block.error.push(temp);
            }
        }
    }
}

class Polinomio {
    grado: number;
    coefficienti: (number | null)[];
    esponenti: number[];

    constructor(grado: number) {
        this.grado = grado;
        this.coefficienti = [];
        this.esponenti = [];
    }

    setup(coefficiente: number | null, esponente: number) {
        this.coefficienti.push(coefficiente);
        this.esponenti.push(esponente);
    }

    moltiplicaEsponenti(valore: number) {
        this.esponenti = this.esponenti.map(esponente => esponente + valore);
        for (let i = 0; i < valore; i++) {
            this.esponenti.push(valore - i);
            this.coefficienti.push(0);
        }
    }

    sommaCoefficienti(valore: number) {
        this.coefficienti = this.coefficienti.map(coefficiente => (coefficiente + valore) % 255);
    }
    sommaCoefficientiNuovo(valore: number, maxNumberOfIterations: number): Polinomio {
        const polinomio: Polinomio = new Polinomio(this.grado);
        for (let i = 0; i < this.esponenti.length; i++) {
            if (i > maxNumberOfIterations) return polinomio;
            polinomio.setup((this.coefficienti[i] + valore) % 255, this.esponenti[i]);
        }
        return polinomio;
    }

    eseguiLog() {
        this.coefficienti = this.coefficienti.map(coefficiente => LOG[coefficiente]);
    }
    eseguiAntilog() {
        this.coefficienti = this.coefficienti.map(coefficiente => ANTILOG[coefficiente]);
    }

    xor(polinomio: Polinomio) {
        for (let i = 0; i < this.coefficienti.length; i++) {
            this.coefficienti[i] ^= polinomio.coefficienti[i];
        }

    }

    console(messaggio: string) {
        let result = "";
        for (const coefficiente of this.coefficienti) {
            result += coefficiente + " ";
        }
        console.log(messaggio, result);
    }
}

function DivideCodewords(codewords: string[], dataLength: DataLength): Group[] {
    const groups: Group[] = [];
    groups.push(new Group());
    if (dataLength.numberOfBlocksInGroup2 != null) groups.push(new Group());
    console.log("Number of groups:" + groups.length);
    for (let i = 0; i < dataLength.numberOfBlocksInGroup1; i++) {
        const block = new Block();
        for (let j = 0; j < dataLength.codewordsInGroup1; j++) {
            block.codewords.push(codewords.splice(0, 1)[0]);
            if (codewords.length == 0) break;
        }
        groups[0].blocks.push(block);
        if (codewords.length == 0) break;
    }
    console.log("Number of blocks in first group: " + groups[0].blocks.length);
    if (groups.length > 1) console.log("Number of blocks in second group: " + groups[1].blocks.length);

    return groups;
}

class Block {
    codewords: string[];
    error: string[];

    constructor() {
        this.codewords = [];
        this.error = [];
    }
}

class Group {
    blocks: Block[];

    constructor() {
        this.blocks = [];
    }
}

function GetStringPrefix(testo: string, version: number): string {
    let modeIndicator = GetModeIndicator(encodingMode).toString(2);
    while (modeIndicator.length < 4) modeIndicator = "0" + modeIndicator;
    let characterCountIndicator = testo.length.toString(2);
    let characterCountLength = GetCharacterCountLength(version, encodingMode);
    while (characterCountIndicator.length < characterCountLength) characterCountIndicator = "0" + characterCountIndicator;
    return modeIndicator + characterCountIndicator;
}

function GenerateFullDataString(testo: string, version: number): string {

    let encodedData: string;
    switch (encodingMode) {
        case EncodingMode.ALFANUMERIC:
            encodedData = EncodeAlfanumeric(testo);
            break;
        case EncodingMode.BYTE:
            encodedData = EncodeByte(testo);
            break;
        default:
            throw "Mode not supported";
    }

    let numberOfBitsRequired = GetDataLength(version, errorCorrection).totalNumberOfCodewords * 8;
    let stringa = GetStringPrefix(testo, version) + encodedData;
    if (stringa.length + 4 <= numberOfBitsRequired) stringa += "0000";
    else if (stringa.length + 3 <= numberOfBitsRequired) stringa += "000";
    else if (stringa.length + 2 <= numberOfBitsRequired) stringa += "00";
    else if (stringa.length + 1 <= numberOfBitsRequired) stringa += "0";

    while (stringa.length % 8 != 0) stringa += "0";

    const missingBytes = (numberOfBitsRequired - stringa.length) / 8;
    let pads = ["11101100", "00010001"];
    for (let i = 0; i < missingBytes; i++) stringa += pads[i % 2];

    if (stringa.length != numberOfBitsRequired) throw "Something went wrong";

    return stringa;
}

document.getElementById("btnM").click();
document.getElementById("btnGenerate").click();