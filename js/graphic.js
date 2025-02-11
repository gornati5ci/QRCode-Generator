var AlignmentPattern = /** @class */ (function () {
    function AlignmentPattern(row, col) {
        this.row = row;
        this.col = col;
    }
    AlignmentPattern.prototype.GetCoordinates = function () {
        var result = [];
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                result.push([this.row + i, this.col + j]);
            }
        }
        return result;
    };
    AlignmentPattern.prototype.SetCell = function (cell, indice) {
        if (cell.scope != CellScope.Empty)
            return;
        if (cell.row == this.row || cell.row == this.row + 4 || cell.col == this.col || cell.col == this.col + 4) {
            cell.Set(CellScope.AlignmentPattern, true);
        }
        else if (cell.row == this.row + 2 && cell.col == this.col + 2) {
            cell.Set(CellScope.AlignmentPattern, true);
        }
        else {
            cell.Set(CellScope.AlignmentPattern, false);
        }
    };
    AlignmentPattern.prototype.overlap = function (numberOfPixels) {
        if (this.row <= 7 && this.col <= 7)
            return true;
        if (this.row >= numberOfPixels - 8 - 7 && this.col <= 7)
            return true;
        if (this.row <= 7 && this.col >= numberOfPixels - 8 - 7)
            return true;
        return false;
    };
    return AlignmentPattern;
}());
var Coordinates = /** @class */ (function () {
    function Coordinates(table) {
        this.table = table;
        this.maxRow = this.table.dimension - 1;
        this.maxCol = this.table.dimension - 1;
        this.row = this.maxRow;
        this.col = this.maxCol;
        this.left = true;
        this.up = true;
        this.firstCol = false;
    }
    Coordinates.prototype.move = function () {
        if (this.firstCol) {
            if (this.table.cells[this.row][this.col].scope == CellScope.Empty || this.table.cells[this.row][this.col].scope == CellScope.Data)
                return;
            this.row--;
            return this.move();
        }
        if (this.up) {
            if (this.left) {
                this.col--;
                if (this.col < 0)
                    throw "Invalid col";
                this.left = false;
                if (this.table.cells[this.row][this.col].scope == CellScope.Empty || this.table.cells[this.row][this.col].scope == CellScope.Data)
                    return;
                return this.move();
            }
            else {
                this.left = true;
                this.col++;
                this.row--;
                if (this.col > this.maxCol)
                    throw "Invalid position";
                if (this.row == -1) {
                    this.row = 0;
                    this.col -= 2;
                    this.up = false;
                    this.left = true;
                }
                if (this.table.cells[this.row][this.col].scope == CellScope.Empty || this.table.cells[this.row][this.col].scope == CellScope.Data)
                    return;
                return this.move();
            }
        }
        else {
            if (this.left) {
                this.left = false;
                this.col--;
                if (this.col < 0)
                    throw "Invalid position";
                if (this.table.cells[this.row][this.col].scope == CellScope.Empty || this.table.cells[this.row][this.col].scope == CellScope.Data)
                    return;
                return this.move();
            }
            else {
                this.left = true;
                this.col++;
                this.row++;
                if (this.row > this.maxRow) {
                    this.row = this.maxRow;
                    this.col -= 2;
                    if (this.col == 0) {
                        this.firstCol = true;
                        return this.move();
                    }
                    this.left = true;
                    this.up = true;
                }
                if (this.table.cells[this.row][this.col].scope == CellScope.Empty || this.table.cells[this.row][this.col].scope == CellScope.Data)
                    return;
                return this.move();
            }
        }
    };
    return Coordinates;
}());
var FindingPattern = /** @class */ (function () {
    function FindingPattern(row, col) {
        this.row = row;
        this.col = col;
    }
    FindingPattern.prototype.GetCoordinates = function () {
        var result = [];
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                result.push([this.row + i, this.col + j]);
            }
        }
        return result;
    };
    FindingPattern.prototype.SetCell = function (cell, indice) {
        if (cell.scope != CellScope.Empty)
            return;
        if (cell.row == this.row || cell.row == this.row + 6)
            cell.Set(CellScope.FindingPattern, true);
        else if (cell.col == this.col || cell.col == this.col + 6)
            cell.Set(CellScope.FindingPattern, true);
        else if (cell.row == this.row + 2 && (cell.col == this.col + 2 || cell.col == this.col + 3 || cell.col == this.col + 4))
            cell.Set(CellScope.FindingPattern, true);
        else if (cell.row == this.row + 3 && (cell.col == this.col + 2 || cell.col == this.col + 3 || cell.col == this.col + 4))
            cell.Set(CellScope.FindingPattern, true);
        else if (cell.row == this.row + 4 && (cell.col == this.col + 2 || cell.col == this.col + 3 || cell.col == this.col + 4))
            cell.Set(CellScope.FindingPattern, true);
        else
            cell.Set(CellScope.FindingPattern, false);
    };
    return FindingPattern;
}());
var FormatInformation = /** @class */ (function () {
    function FormatInformation(row, col, length, vertical) {
        this.row = row;
        this.col = col;
        this.length = length;
        this.vertical = vertical;
    }
    FormatInformation.prototype.GetCoordinates = function () {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            var deltaRow = this.vertical ? i : 0;
            var deltaCol = this.vertical ? 0 : i;
            result.push([this.row + deltaRow, this.col + deltaCol]);
        }
        return result;
    };
    FormatInformation.prototype.SetCell = function (cell, indice) {
        if (cell.scope == CellScope.Empty) {
            cell.scope = CellScope.FormatInformation;
        }
    };
    return FormatInformation;
}());
var Separator = /** @class */ (function () {
    function Separator(row, col, vertical) {
        this.row = row;
        this.col = col;
        this.vertical = vertical;
    }
    Separator.prototype.GetCoordinates = function () {
        var result = [];
        for (var i = 0; i < 8; i++) {
            var row = this.row + (this.vertical ? 0 : i);
            var col = this.col + (this.vertical ? i : 0);
            result.push([row, col]);
        }
        return result;
    };
    Separator.prototype.SetCell = function (cell, indice) {
        if (cell.scope != CellScope.Empty)
            return;
        cell.scope = CellScope.Separator;
    };
    return Separator;
}());
var TimingPattern = /** @class */ (function () {
    function TimingPattern(row, col, vertical, dimension) {
        this.row = row;
        this.col = col;
        this.vertical = vertical;
        this.dimension = dimension;
    }
    TimingPattern.prototype.GetCoordinates = function () {
        var result = [];
        if (this.vertical) {
            var currentRow = this.row;
            while (currentRow != this.dimension - 8) {
                result.push([currentRow++, this.col]);
            }
        }
        else {
            var currentCol = this.col;
            while (currentCol != this.dimension - 8) {
                result.push([this.row, currentCol++]);
            }
        }
        return result;
    };
    TimingPattern.prototype.SetCell = function (cell, indice) {
        cell.Set(CellScope.TimingPattern, indice % 2 == 0);
    };
    return TimingPattern;
}());
var VersionInformationArea = /** @class */ (function () {
    function VersionInformationArea(row, col, vertical) {
        this.row = row;
        this.col = col;
        this.vertical = vertical;
    }
    VersionInformationArea.prototype.GetCoordinates = function () {
        var result = [];
        var deltaX = this.vertical ? 3 : 6;
        var deltaY = this.vertical ? 6 : 3;
        for (var x = 0; x < deltaX; x++) {
            for (var y = 0; y < deltaY; y++) {
                result.push([this.row + y, this.col + x]);
            }
        }
        return result;
    };
    VersionInformationArea.prototype.SetCell = function (cell, indice) {
        if (cell.scope == CellScope.Empty) {
            cell.scope = CellScope.VersionInformationArea;
        }
    };
    return VersionInformationArea;
}());
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
document.getElementById("btnNumeric").onclick = function () {
    var contenuto = document.getElementById("txtTesto").value;
    if (!IsNumeric(contenuto))
        return alert("Il contenuto non è numerico");
    encodingMode = EncodingMode.NUMERIC;
    setAllButtonsToNotSelected();
    document.getElementById("btnNumeric").classList.add("btn-primary");
    document.getElementById("btnNumeric").classList.remove("btn-outline-primary");
};
document.getElementById("btnAlfanumeric").onclick = function () {
    var contenuto = document.getElementById("txtTesto").value;
    if (!IsAlfanumeric(contenuto))
        return alert("Il contenuto non è alfanumerico");
    encodingMode = EncodingMode.ALFANUMERIC;
    setAllButtonsToNotSelected();
    document.getElementById("btnAlfanumeric").classList.add("btn-primary");
    document.getElementById("btnAlfanumeric").classList.remove("btn-outline-primary");
};
document.getElementById("btnByte").onclick = function () {
    encodingMode = EncodingMode.BYTE;
    setAllButtonsToNotSelected();
    document.getElementById("btnByte").classList.add("btn-primary");
    document.getElementById("btnByte").classList.remove("btn-outline-primary");
};
document.getElementById("btnKanji").onclick = function () {
    encodingMode = EncodingMode.KANJI;
    setAllButtonsToNotSelected();
    document.getElementById("btnKanji").classList.add("btn-primary");
    document.getElementById("btnKanji").classList.remove("btn-outline-primary");
};
function resetAllErrorCorrectionButtons() {
    document.getElementById("btnL").classList.remove("btn-primary");
    document.getElementById("btnM").classList.remove("btn-primary");
    document.getElementById("btnQ").classList.remove("btn-primary");
    document.getElementById("btnH").classList.remove("btn-primary");
    document.getElementById("btnL").classList.add("btn-outline-primary");
    document.getElementById("btnM").classList.add("btn-outline-primary");
    document.getElementById("btnQ").classList.add("btn-outline-primary");
    document.getElementById("btnH").classList.add("btn-outline-primary");
}
function errorButtonPressed(button) {
    resetAllErrorCorrectionButtons();
    button.classList.add("btn-primary");
    button.classList.remove("btn-outline-primary");
    if (button.id == "btnL")
        errorCorrection = ErrorCorrection.L;
    if (button.id == "btnM")
        errorCorrection = ErrorCorrection.M;
    if (button.id == "btnQ")
        errorCorrection = ErrorCorrection.Q;
    if (button.id == "btnH")
        errorCorrection = ErrorCorrection.H;
}
document.getElementById("btnL").onclick = function () { errorButtonPressed(this); };
document.getElementById("btnM").onclick = function () { errorButtonPressed(this); };
document.getElementById("btnQ").onclick = function () { errorButtonPressed(this); };
document.getElementById("btnH").onclick = function () { errorButtonPressed(this); };
var Table = /** @class */ (function () {
    function Table(version, testo) {
        this.version = version;
        this.dimension = Table.calculateDimension(version);
        this.cells = [];
        this.testo = testo;
        for (var i = 0; i < this.dimension; i++) {
            var row = [];
            for (var j = 0; j < this.dimension; j++) {
                row.push(new Cell(i, j));
            }
            this.cells.push(row);
        }
        this.masking = [
            function (row, col) { return (row + col) % 2 == 0; },
            function (row, col) { return (row % 2) == 0; },
            function (row, col) { return (col % 3) == 0; },
            function (row, col) { return (row + col) % 3 == 0; },
            function (row, col) { return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 == 0; },
            function (row, col) { return ((row * col) % 2) + ((row * col) % 3) == 0; },
            function (row, col) { return (((row * col) % 2) + ((row * col) % 3)) % 2 == 0; },
            function (row, col) { return (((row + col) % 2) + ((row * col) % 3)) % 2 == 0; }
        ];
    }
    Table.prototype.AddBlock = function (block) {
        var coordinates = block.GetCoordinates();
        var indice = 0;
        for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
            var coppia = coordinates_1[_i];
            var cell = this.cells[coppia[0]][coppia[1]];
            block.SetCell(cell, indice++);
        }
    };
    Table.calculateDimension = function (version) {
        return 21 + (version - 1) * 4;
    };
    Table.prototype.AddFindingPatterns = function () {
        this.AddBlock(new FindingPattern(0, 0));
        this.AddBlock(new FindingPattern(0, this.dimension - 7));
        this.AddBlock(new FindingPattern(this.dimension - 7, 0));
    };
    Table.prototype.AddSeparators = function () {
        //Top-Left
        this.AddBlock(new Separator(0, 7, false));
        this.AddBlock(new Separator(7, 0, true));
        //Top-Right
        this.AddBlock(new Separator(0, this.dimension - 8, false));
        this.AddBlock(new Separator(7, this.dimension - 8, true));
        //Bottom-Left
        this.AddBlock(new Separator(this.dimension - 8, 7, false));
        this.AddBlock(new Separator(this.dimension - 8, 0, true));
    };
    Table.prototype.AddTimingPatterns = function () {
        this.AddBlock(new TimingPattern(8, 6, true, this.dimension));
        this.AddBlock(new TimingPattern(6, 8, false, this.dimension));
    };
    Table.prototype.AddDarkModule = function () {
        this.cells[4 * this.version + 9][8].scope = CellScope.DarkModule;
        this.cells[4 * this.version + 9][8].black = true;
    };
    Table.prototype.AddFormatInformations = function () {
        this.AddBlock(new FormatInformation(8, 0, 9, false));
        this.AddBlock(new FormatInformation(0, 8, 9, true));
        this.AddBlock(new FormatInformation(this.dimension - 8, 8, 8, true));
        this.AddBlock(new FormatInformation(8, this.dimension - 8, 8, false));
    };
    Table.prototype.AddAlignmentPatterns = function () {
        var _this = this;
        if (this.version == 1)
            return;
        var allAlignments = [];
        var centri = ALLIGNMENT_PATTERNS_LOCATION[this.version];
        for (var i = 0; i < centri.length; i++) {
            for (var j = 0; j < centri.length; j++) {
                allAlignments.push(new AlignmentPattern(centri[i] - 2, centri[j] - 2));
            }
        }
        var validAllignmentPatterns = allAlignments.filter(function (alignment) { return !alignment.overlap(_this.dimension); });
        for (var _i = 0, validAllignmentPatterns_1 = validAllignmentPatterns; _i < validAllignmentPatterns_1.length; _i++) {
            var pattern = validAllignmentPatterns_1[_i];
            this.AddBlock(pattern);
        }
    };
    Table.prototype.AddVersionInformations = function () {
        if (this.version < 7)
            return;
        this.AddBlock(new VersionInformationArea(0, this.dimension - 11, true));
        this.AddBlock(new VersionInformationArea(this.dimension - 11, 0, false));
    };
    Table.prototype.SetFormatInformation = function (findingPattern) {
        for (var j = 0; j < 6; j++) {
            this.cells[8][j].Set(CellScope.FindingPattern, findingPattern[j] == "1");
            this.cells[this.dimension - j - 1][8].Set(CellScope.FindingPattern, findingPattern[j] == "1");
        }
        this.cells[this.dimension - 6 - 1][8].Set(CellScope.FindingPattern, findingPattern[6] == "1");
        this.cells[7][8].Set(CellScope.FindingPattern, findingPattern[8] == "1");
        this.cells[5][8].Set(CellScope.FindingPattern, findingPattern[9] == "1");
        this.cells[4][8].Set(CellScope.FindingPattern, findingPattern[10] == "1");
        this.cells[3][8].Set(CellScope.FindingPattern, findingPattern[11] == "1");
        this.cells[2][8].Set(CellScope.FindingPattern, findingPattern[12] == "1");
        this.cells[1][8].Set(CellScope.FindingPattern, findingPattern[13] == "1");
        this.cells[0][8].Set(CellScope.FindingPattern, findingPattern[14] == "1");
        for (var j = 6; j < 8; j++) {
            this.cells[8][j + 1].Set(CellScope.FindingPattern, findingPattern[j] == "1");
        }
        for (var j = 0; j < 8; j++) {
            this.cells[8][this.dimension - j - 1].Set(CellScope.FindingPattern, findingPattern[7 + j] == "1");
        }
    };
    Table.prototype.Mask = function (indice) {
        for (var riga = 0; riga < this.cells.length; riga++) {
            for (var colonna = 0; colonna < this.cells.length; colonna++) {
                if (this.cells[riga][colonna].scope != CellScope.Data
                    && this.cells[riga][colonna].scope != CellScope.Error
                    && this.cells[riga][colonna].scope != CellScope.Empty)
                    continue;
                if (!this.masking[indice](riga, colonna))
                    continue;
                this.cells[riga][colonna].black = !this.cells[riga][colonna].black;
            }
        }
    };
    Table.prototype.CalculateFormatInformations = function (indice) {
        var generator = "10100110111";
        var formatString = "";
        switch (errorCorrection) {
            case ErrorCorrection.H:
                formatString = "10";
                break;
            case ErrorCorrection.L:
                formatString = "01";
                break;
            case ErrorCorrection.M:
                formatString = "00";
                break;
            case ErrorCorrection.Q:
                formatString = "11";
                break;
            default: throw "Invalid";
        }
        if (indice.toString(2).length == 1)
            formatString += "00";
        else if (indice.toString(2).length == 2)
            formatString += "0";
        else if (indice.toString(2).length == 3)
            formatString += "";
        formatString += indice.toString(2);
        var message = formatString + "0000000000";
        while (message.indexOf("0") == 0)
            message = message.substring(1);
        var originalGenerator = generator;
        var result = "";
        while (message.length >= 11) {
            result = "";
            generator = originalGenerator;
            while (generator.length < message.length)
                generator += "0";
            for (var i = 0; i < generator.length; i++) {
                result += Number(generator[i]) ^ Number(message[i]);
            }
            message = result;
            while (message.indexOf("0") == 0)
                message = message.substring(1);
        }
        while (message.length < 10)
            message = "0" + message;
        formatString = formatString + message;
        result = "";
        for (var i = 0; i < formatString.length; i++) {
            result += Number(formatString[i]) ^ Number("101010000010010"[i]);
        }
        return result;
    };
    return Table;
}());
var CellScope;
(function (CellScope) {
    CellScope[CellScope["Empty"] = 0] = "Empty";
    CellScope[CellScope["Data"] = 1] = "Data";
    CellScope[CellScope["Error"] = 2] = "Error";
    CellScope[CellScope["FindingPattern"] = 3] = "FindingPattern";
    CellScope[CellScope["Separator"] = 4] = "Separator";
    CellScope[CellScope["DarkModule"] = 5] = "DarkModule";
    CellScope[CellScope["FormatInformation"] = 6] = "FormatInformation";
    CellScope[CellScope["AlignmentPattern"] = 7] = "AlignmentPattern";
    CellScope[CellScope["TimingPattern"] = 8] = "TimingPattern";
    CellScope[CellScope["VersionInformationArea"] = 9] = "VersionInformationArea";
})(CellScope || (CellScope = {}));
var Cell = /** @class */ (function () {
    function Cell(row, col, scope, black) {
        if (scope === void 0) { scope = CellScope.Empty; }
        if (black === void 0) { black = null; }
        this.row = row;
        this.col = col;
        this.scope = scope;
        this.black = black;
    }
    Cell.prototype.Set = function (scope, black) {
        this.scope = scope;
        this.black = black;
    };
    return Cell;
}());
function InitializeTable(version, stringa) {
    var table = new Table(version, stringa);
    table.AddFindingPatterns();
    table.AddSeparators();
    table.AddAlignmentPatterns();
    table.AddTimingPatterns();
    table.AddDarkModule();
    table.AddFormatInformations();
    table.AddVersionInformations();
    return table;
}
