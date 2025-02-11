class FindingPattern implements IBlock {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }


    GetCoordinates():number[][] {
        const result:number[][]=[];
        for(let i=0; i<7; i++) {
            for(let j=0; j<7; j++) {
                result.push([this.row+i, this.col+j]);
            }
        }
        return result;
    }

    SetCell(cell:Cell, indice:number):void {
        if(cell.scope!=CellScope.Empty) return;
        if(cell.row==this.row||cell.row==this.row+6) cell.Set(CellScope.FindingPattern,true);
        else if(cell.col==this.col||cell.col==this.col+6) cell.Set(CellScope.FindingPattern,true);
        else if(cell.row==this.row+2&&(cell.col==this.col+2||cell.col==this.col+3||cell.col==this.col+4)) cell.Set(CellScope.FindingPattern,true);
        else if(cell.row==this.row+3&&(cell.col==this.col+2||cell.col==this.col+3||cell.col==this.col+4)) cell.Set(CellScope.FindingPattern,true);
        else if(cell.row==this.row+4&&(cell.col==this.col+2||cell.col==this.col+3||cell.col==this.col+4)) cell.Set(CellScope.FindingPattern,true);
        else cell.Set(CellScope.FindingPattern,false);        
    }
}