class AlignmentPattern implements IBlock {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    GetCoordinates():number[][] {
        const result:number[][]=[];
        for(let i=0; i<5; i++) {
            for(let j=0; j<5; j++) {
                result.push([this.row+i, this.col+j]);
            }
        }
        return result;
    }

    SetCell(cell:Cell, indice:number):void {
        if(cell.scope!=CellScope.Empty) return;
        if(cell.row==this.row||cell.row==this.row+4||cell.col==this.col||cell.col==this.col+4) {
            cell.Set(CellScope.AlignmentPattern,true);
        } else if(cell.row==this.row+2&&cell.col==this.col+2) {
            cell.Set(CellScope.AlignmentPattern,true);
        } else {
            cell.Set(CellScope.AlignmentPattern,false);
        }
    }

    overlap(numberOfPixels: number): boolean {
        if (this.row <= 7 && this.col <= 7) return true;
        if (this.row >= numberOfPixels - 8 - 7 && this.col <= 7) return true;
        if (this.row <= 7 && this.col >= numberOfPixels - 8 - 7) return true;

        return false;
    }
}
