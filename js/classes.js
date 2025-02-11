var Block = /** @class */ (function () {
    function Block() {
        this.codewords = [];
        this.error = [];
    }
    return Block;
}());
var CharacterCount = /** @class */ (function () {
    function CharacterCount(testo, informations) {
        this.value = testo.length.toString(2);
        this.length = GetCharacterCountLength(informations.version, informations.encodingMode);
        while (this.value.length < this.length)
            this.value = "0" + this.value;
    }
    return CharacterCount;
}());
var Contenuto = /** @class */ (function () {
    function Contenuto(informations, testo) {
        this.informations = informations;
        this.testo = testo;
        this.dataStream = new DataStream(informations, this.testo);
        this.groups = this.GenerateGroups();
        this.errorStream = new ErrorStream(informations);
        this.errorStream.GenerateErrorChecking(this.groups);
        this.Interleave();
        this.AddFinalPadding();
    }
    Contenuto.prototype.GenerateGroups = function () {
        var codewords = this.dataStream.GetCodewords();
        var dataLength = GetDataLength(this.informations);
        var groups = [];
        groups.push(new Group());
        if (dataLength.numberOfBlocksInGroup2 != null)
            groups.push(new Group());
        console.log("Number of groups:" + groups.length);
        for (var i = 0; i < dataLength.numberOfBlocksInGroup1; i++) {
            var block = new Block();
            for (var j = 0; j < dataLength.codewordsInGroup1; j++) {
                block.codewords.push(codewords.splice(0, 1)[0]);
                if (codewords.length == 0)
                    break;
            }
            groups[0].blocks.push(block);
            if (codewords.length == 0)
                break;
        }
        console.log("Number of blocks in first group: " + groups[0].blocks.length);
        if (groups.length > 1)
            console.log("Number of blocks in second group: " + groups[1].blocks.length);
        return groups;
    };
    Contenuto.prototype.Interleave = function () {
        var interleavingData = [];
        var interleavingError = [];
        var maxLengthData = 0;
        var maxLengthError = 0;
        for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
            var group = _a[_i];
            for (var _b = 0, _c = group.blocks; _b < _c.length; _b++) {
                var block = _c[_b];
                interleavingData.push(block.codewords);
                interleavingError.push(block.error);
                maxLengthData = block.codewords.length > maxLengthData ? block.codewords.length : maxLengthData;
                maxLengthError = block.error.length > maxLengthError ? block.error.length : maxLengthError;
            }
        }
        var finalDataString = "";
        for (var i = 0; i < maxLengthData; i++) {
            for (var j = 0; j < interleavingData.length; j++) {
                if (interleavingData[j].length > i)
                    finalDataString += interleavingData[j][i];
            }
        }
        var finalErrorString = "";
        for (var i = 0; i < maxLengthError; i++) {
            for (var j = 0; j < interleavingError.length; j++) {
                if (interleavingError[j].length > i)
                    finalErrorString += interleavingError[j][i];
            }
        }
        this.testo = finalDataString + finalErrorString;
    };
    Contenuto.prototype.AddFinalPadding = function () {
        switch (this.informations.version) {
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                this.testo += "0000000";
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
                this.testo += "000";
                break;
            case 21:
            case 22:
            case 23:
            case 24:
            case 24:
            case 26:
            case 27:
                this.testo += "0000";
                break;
        }
    };
    return Contenuto;
}());
var DataLength = /** @class */ (function () {
    function DataLength(version, errorCorrection, totalNumberOfCodewords, codewordsPerBlock, numberOfBlocksInGroup1, codewordsInGroup1, numberOfBlocksInGroup2, codewordsInGroup2) {
        this.version = version;
        this.errorCorrection = errorCorrection;
        this.totalNumberOfCodewords = totalNumberOfCodewords;
        this.errorCodewordsPerBlock = codewordsPerBlock;
        this.numberOfBlocksInGroup1 = numberOfBlocksInGroup1;
        this.codewordsInGroup1 = codewordsInGroup1;
        this.numberOfBlocksInGroup2 = numberOfBlocksInGroup2;
        this.codewordsInGroup2 = codewordsInGroup2;
    }
    return DataLength;
}());
var DataStream = /** @class */ (function () {
    function DataStream(informations, testo) {
        this.informations = informations;
        this.testo = testo;
        this.SetModeIndicator();
        this.SetCharacterCount();
        this.CalculateDataString();
    }
    DataStream.prototype.SetModeIndicator = function () {
        this.modeIndicator = GetModeIndicator(this.informations.encodingMode).toString(2);
        while (this.modeIndicator.length < 4)
            this.modeIndicator = "0" + this.modeIndicator;
    };
    DataStream.prototype.SetCharacterCount = function () {
        this.characterCount = new CharacterCount(this.testo, this.informations);
    };
    DataStream.prototype.CalculateEncodedText = function () {
        switch (encodingMode) {
            case EncodingMode.ALFANUMERIC:
                return EncodeAlfanumeric(this.testo);
            case EncodingMode.BYTE:
                return EncodeByte(this.testo);
            default:
                throw "Mode not supported";
        }
    };
    DataStream.prototype.GetEncodedTextWithZeroTerminators = function (stringa, length) {
        if (stringa.length + 4 <= length)
            stringa += "0000";
        else if (stringa.length + 3 <= length)
            stringa += "000";
        else if (stringa.length + 2 <= length)
            stringa += "00";
        else if (stringa.length + 1 <= length)
            stringa += "0";
        while (stringa.length % 8 != 0)
            stringa += "0";
        return stringa;
    };
    DataStream.prototype.GetPaddedString = function (stringa, length) {
        var missingBytes = (length - stringa.length) / 8;
        var pads = ["11101100", "00010001"];
        for (var i = 0; i < missingBytes; i++)
            stringa += pads[i % 2];
        return stringa;
    };
    DataStream.prototype.CalculateDataString = function () {
        var encodedData = this.CalculateEncodedText();
        var stringa = this.modeIndicator + this.characterCount.value + encodedData;
        var numberOfBitsRequired = GetDataLength(this.informations).totalNumberOfCodewords * 8;
        stringa = this.GetEncodedTextWithZeroTerminators(stringa, numberOfBitsRequired);
        stringa = this.GetPaddedString(stringa, numberOfBitsRequired);
        if (stringa.length != numberOfBitsRequired)
            throw "Something went wrong";
        this.encodedStream = stringa;
    };
    DataStream.prototype.GetCodewords = function () {
        var codewords = [];
        var copia = this.encodedStream;
        while (copia.length > 0) {
            codewords.push(copia.substring(0, 8));
            copia = copia.substring(8);
        }
        return codewords;
    };
    return DataStream;
}());
var ErrorStream = /** @class */ (function () {
    function ErrorStream(informations) {
        this.informations = informations;
    }
    ErrorStream.prototype.GenerateErrorChecking = function (groups) {
        var dataLength = GetDataLength(this.informations);
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var group = groups_1[_i];
            for (var _a = 0, _b = group.blocks; _a < _b.length; _a++) {
                var block = _b[_a];
                var polinomioMessaggio = new Polinomio(block.codewords.length - 1);
                var grado = polinomioMessaggio.grado;
                for (var _c = 0, _d = block.codewords; _c < _d.length; _c++) {
                    var codeword = _d[_c];
                    polinomioMessaggio.setup(parseInt(codeword, 2), grado--);
                }
                polinomioMessaggio.moltiplicaEsponenti(dataLength.errorCodewordsPerBlock);
                var polinomioGeneratore = new Polinomio(dataLength.errorCodewordsPerBlock);
                console.log("GRADO: " + dataLength.errorCodewordsPerBlock);
                var coefficienti = this.GetGenerator(dataLength.errorCodewordsPerBlock);
                for (var i = 0; i < coefficienti.length + 1; i++) {
                    polinomioGeneratore.setup(coefficienti[i], dataLength.errorCodewordsPerBlock - i + 1);
                }
                console.log(polinomioGeneratore);
                var originalGrade = polinomioGeneratore.grado;
                polinomioGeneratore.moltiplicaEsponenti(polinomioMessaggio.grado);
                for (var i = 0; i < block.codewords.length; i++) {
                    var esponente = ANTILOG[polinomioMessaggio.coefficienti[0]];
                    var temp = polinomioGeneratore.sommaCoefficientiNuovo(esponente, originalGrade);
                    temp.eseguiLog();
                    polinomioMessaggio.xor(temp);
                    polinomioMessaggio.coefficienti.splice(0, 1);
                    polinomioMessaggio.esponenti.splice(0, 1);
                    polinomioGeneratore.moltiplicaEsponenti(-1);
                    polinomioGeneratore.esponenti.pop();
                    polinomioGeneratore.coefficienti.pop();
                }
                for (var i = 0; i < polinomioMessaggio.coefficienti.length; i++) {
                    var temp = polinomioMessaggio.coefficienti[i].toString(2);
                    while (temp.length < 8)
                        temp = "0" + temp;
                    block.error.push(temp);
                }
            }
        }
    };
    ErrorStream.prototype.GetGenerator = function (grado) {
        switch (grado) {
            case 7: return [0, 87, 229, 146, 149, 238, 102, 21];
            case 8: return [0, 175, 238, 208, 249, 215, 252, 196, 28];
            case 9: return [0, 95, 246, 137, 231, 235, 149, 11, 123, 36];
            case 10: return [0, 251, 67, 46, 61, 118, 70, 64, 96, 32, 45];
            case 16: return [0, 120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120];
            case 22: return [0, 210, 171, 247, 242, 93, 230, 13, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231];
            case 28: return [0, 168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195, 212, 119, 242, 37, 9, 123];
        }
    };
    return ErrorStream;
}());
var GeneralInformation = /** @class */ (function () {
    function GeneralInformation() {
    }
    GeneralInformation.prototype.CalculateVersion = function (testo) {
        var maxVersion = Object.keys(VERSIONS_DIMENSIONS).map(Number).sort().pop();
        for (var i = 1; i <= maxVersion; i++) {
            if (VERSIONS_DIMENSIONS[i][this.errorCorrection][this.encodingMode] < testo.length)
                continue;
            console.log({ length: testo.length, i: i, encodingMode: this.encodingMode, errorCorrection: this.errorCorrection });
            this.version = i;
            return;
        }
        throw "Could not calculate version";
    };
    return GeneralInformation;
}());
var Group = /** @class */ (function () {
    function Group() {
        this.blocks = [];
    }
    return Group;
}());
var Polinomio = /** @class */ (function () {
    function Polinomio(grado) {
        this.grado = grado;
        this.coefficienti = [];
        this.esponenti = [];
    }
    Polinomio.prototype.setup = function (coefficiente, esponente) {
        this.coefficienti.push(coefficiente);
        this.esponenti.push(esponente);
    };
    Polinomio.prototype.moltiplicaEsponenti = function (valore) {
        this.esponenti = this.esponenti.map(function (esponente) { return esponente + valore; });
        for (var i = 0; i < valore; i++) {
            this.esponenti.push(valore - i);
            this.coefficienti.push(0);
        }
    };
    Polinomio.prototype.sommaCoefficienti = function (valore) {
        this.coefficienti = this.coefficienti.map(function (coefficiente) { return (coefficiente + valore) % 255; });
    };
    Polinomio.prototype.sommaCoefficientiNuovo = function (valore, maxNumberOfIterations) {
        var polinomio = new Polinomio(this.grado);
        for (var i = 0; i < this.esponenti.length; i++) {
            if (i > maxNumberOfIterations)
                return polinomio;
            polinomio.setup((this.coefficienti[i] + valore) % 255, this.esponenti[i]);
        }
        return polinomio;
    };
    Polinomio.prototype.eseguiLog = function () {
        this.coefficienti = this.coefficienti.map(function (coefficiente) { return LOG[coefficiente]; });
    };
    Polinomio.prototype.eseguiAntilog = function () {
        this.coefficienti = this.coefficienti.map(function (coefficiente) { return ANTILOG[coefficiente]; });
    };
    Polinomio.prototype.xor = function (polinomio) {
        for (var i = 0; i < this.coefficienti.length; i++) {
            this.coefficienti[i] ^= polinomio.coefficienti[i];
        }
    };
    Polinomio.prototype.console = function (messaggio) {
        var result = "";
        for (var _i = 0, _a = this.coefficienti; _i < _a.length; _i++) {
            var coefficiente = _a[_i];
            result += coefficiente + " ";
        }
        console.log(messaggio, result);
    };
    return Polinomio;
}());
