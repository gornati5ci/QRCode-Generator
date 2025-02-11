class FormatInformation implements IBlock {
    row: number;
    col: number;
    length: number;
    vertical: boolean;

    constructor(row: number, col: number, length: number, vertical: boolean) {
        this.row = row;
        this.col = col;
        this.length = length;
        this.vertical = vertical;
    }

    GetCoordinates():number[][] {
        const result:number[][]=[];
        for (let i = 0; i < this.length; i++) {
            const deltaRow = this.vertical?i:0;
            const deltaCol = this.vertical?0:i;
            result.push([this.row+deltaRow,this.col+deltaCol]);
        }
        return result;
    }

    SetCell(cell:Cell, indice:number):void {
        if(cell.scope==CellScope.Empty) {
            cell.scope=CellScope.FormatInformation;
        }
    }
}