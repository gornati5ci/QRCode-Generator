class Separator implements IBlock {
    row: number;
    col: number;
    vertical: boolean;

    constructor(row: number, col: number, vertical: boolean) {
        this.row = row;
        this.col = col;
        this.vertical = vertical;
    }

    GetCoordinates():number[][] {
        const result:number[][]=[];
        for(let i=0; i<8; i++) {
            const row = this.row+(this.vertical?0:i);
            const col = this.col+(this.vertical?i:0);
            result.push([row,col]);
        }
        return result;
    }

    SetCell(cell:Cell, indice:number):void {
        if(cell.scope!=CellScope.Empty) return;
        cell.scope=CellScope.Separator;
    }
}
