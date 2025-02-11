class Table {
    version:number;
    dimension:number;
    cells:Cell[][];
    masking:((row:number,col:number)=>boolean)[];
    testo:string;

    constructor(version:number, testo:string) {
        this.version=version;
        this.dimension=Table.calculateDimension(version);
        this.cells=[];
        this.testo=testo;
        for(let i=0; i<this.dimension; i++) {
            const row:Cell[]=[];
            for(let j=0; j<this.dimension; j++) {
                row.push(new Cell(i,j));
            }
            this.cells.push(row);
        }

        this.masking = [
            (row, col) => (row + col) % 2 == 0,
            (row, col) => (row % 2) == 0,
            (row, col) => (col % 3) == 0,
            (row, col) => (row + col) % 3 == 0,
            (row, col) => (Math.floor(row / 2) + Math.floor(col / 3)) % 2 == 0,
            (row, col) => ((row * col) % 2) + ((row * col) % 3) == 0,
            (row, col) => (((row * col) % 2) + ((row * col) % 3)) % 2 == 0,
            (row, col) => (((row + col) % 2) + ((row * col) % 3)) % 2 == 0
        ];
    }

    AddBlock(block:IBlock) {
        const coordinates = block.GetCoordinates();
        let indice = 0;
        for(const coppia of coordinates) {
            const cell = this.cells[coppia[0]][coppia[1]];
            block.SetCell(cell, indice++);
        }
    }

    static calculateDimension(version:number):number {
        return 21 + (version - 1) * 4;
    }

    AddFindingPatterns() {
        this.AddBlock(new FindingPattern(0, 0));
        this.AddBlock(new FindingPattern(0, this.dimension - 7));
        this.AddBlock(new FindingPattern(this.dimension - 7, 0));
    }

    AddSeparators() {
        //Top-Left
        this.AddBlock(new Separator(0, 7, false));
        this.AddBlock(new Separator(7, 0, true));
        //Top-Right
        this.AddBlock(new Separator(0, this.dimension - 8, false));
        this.AddBlock(new Separator(7, this.dimension - 8, true));
        //Bottom-Left
        this.AddBlock(new Separator(this.dimension - 8, 7, false));
        this.AddBlock(new Separator(this.dimension - 8, 0, true));
    }

    AddTimingPatterns() {
        this.AddBlock(new TimingPattern(8, 6, true, this.dimension));
        this.AddBlock(new TimingPattern(6, 8, false, this.dimension));
    }

    AddDarkModule() {
        this.cells[4 * this.version + 9][8].scope = CellScope.DarkModule;
        this.cells[4*this.version+9][8].black=true;
    }

    AddFormatInformations() {
        this.AddBlock(new FormatInformation(8, 0, 9, false));
        this.AddBlock(new FormatInformation(0, 8, 9, true));
        this.AddBlock(new FormatInformation(this.dimension - 8, 8, 8, true));
        this.AddBlock(new FormatInformation(8, this.dimension - 8, 8, false));
    }

    AddAlignmentPatterns() {
        if (this.version == 1) return;
        let allAlignments:AlignmentPattern[]=[];
        let centri = ALLIGNMENT_PATTERNS_LOCATION[this.version];
        for (let i = 0; i < centri.length; i++) {
            for (let j = 0; j < centri.length; j++) {
                allAlignments.push(new AlignmentPattern(centri[i] - 2, centri[j] - 2));
            }
        }
        const validAllignmentPatterns = allAlignments.filter(alignment => !alignment.overlap(this.dimension));
        for(const pattern of validAllignmentPatterns) {
            this.AddBlock(pattern);
        }
    }

    AddVersionInformations() {
        if (this.version < 7) return;
        this.AddBlock(new VersionInformationArea(0, this.dimension - 11, true));
        this.AddBlock(new VersionInformationArea(this.dimension - 11, 0, false));
    }

    SetFormatInformation(findingPattern:string) {
        for(let j=0; j<6; j++) {
            this.cells[8][j].Set(CellScope.FindingPattern,findingPattern[j]=="1");
            this.cells[this.dimension-j-1][8].Set(CellScope.FindingPattern,findingPattern[j]=="1");
        }
        this.cells[this.dimension-6-1][8].Set(CellScope.FindingPattern,findingPattern[6]=="1");
        this.cells[7][8].Set(CellScope.FindingPattern,findingPattern[8]=="1");
        this.cells[5][8].Set(CellScope.FindingPattern,findingPattern[9]=="1");
        this.cells[4][8].Set(CellScope.FindingPattern,findingPattern[10]=="1");
        this.cells[3][8].Set(CellScope.FindingPattern,findingPattern[11]=="1");
        this.cells[2][8].Set(CellScope.FindingPattern,findingPattern[12]=="1");
        this.cells[1][8].Set(CellScope.FindingPattern,findingPattern[13]=="1");
        this.cells[0][8].Set(CellScope.FindingPattern,findingPattern[14]=="1");
        for(let j=6; j<8; j++) {
            this.cells[8][j+1].Set(CellScope.FindingPattern,findingPattern[j]=="1");
        }

        for(let j=0; j<8; j++) {
            this.cells[8][this.dimension-j-1].Set(CellScope.FindingPattern,findingPattern[7+j]=="1");
        }
    }

    Mask(indice:number) {
        for (let riga = 0; riga < this.cells.length; riga++) {
            for (let colonna = 0; colonna < this.cells.length; colonna++) {
                if (this.cells[riga][colonna].scope!=CellScope.Data
                    && this.cells[riga][colonna].scope!=CellScope.Error
                    && this.cells[riga][colonna].scope!=CellScope.Empty
                ) continue;
                if (!this.masking[indice](riga, colonna)) continue;
                this.cells[riga][colonna].black = !this.cells[riga][colonna].black;
            }
        }
    }

    CalculateFormatInformations(indice:number):string {
        let generator = "10100110111";
        let formatString = "";
        switch (errorCorrection) {
            case ErrorCorrection.H: formatString = "10"; break;
            case ErrorCorrection.L: formatString = "01"; break;
            case ErrorCorrection.M: formatString = "00"; break;
            case ErrorCorrection.Q: formatString = "11"; break;
            default: throw "Invalid";
        }
        if (indice.toString(2).length == 1) formatString += "00";
        else if (indice.toString(2).length == 2) formatString += "0";
        else if (indice.toString(2).length == 3) formatString += "";
        formatString += indice.toString(2);
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
            message = result;
            while (message.indexOf("0") == 0) message = message.substring(1);
        }

        while (message.length < 10) message = "0" + message;

        formatString = formatString + message;
        result = "";
        for (let i = 0; i < formatString.length; i++) {
            result += Number(formatString[i]) ^ Number("101010000010010"[i]);
        }
        return result;
    }

}

interface IBlock {
    SetCell(cell:Cell, indice:number):void;
    GetCoordinates():number[][];
}

enum CellScope {Empty,Data,Error,FindingPattern,Separator,DarkModule,FormatInformation, AlignmentPattern,TimingPattern,VersionInformationArea}

class Cell {
    scope:CellScope;
    row:number;
    col:number;
    black:boolean|null;

    constructor(row:number, col:number, scope:CellScope=CellScope.Empty, black:boolean|null=null) {
        this.row=row;
        this.col=col;
        this.scope=scope;
        this.black=black;
    }

    Set(scope:CellScope, black:boolean) {
        this.scope=scope;
        this.black=black;
    }
}


function InitializeTable(version: number, stringa: string):Table {

    const table:Table = new Table(version, stringa);
    table.AddFindingPatterns();
    table.AddSeparators();
    table.AddAlignmentPatterns();
    table.AddTimingPatterns();
    table.AddDarkModule();
    table.AddFormatInformations();
    table.AddVersionInformations();

    return table;
    
}