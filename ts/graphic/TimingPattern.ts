class TimingPattern implements IBlock {
    row: number;
    col: number;
    vertical: boolean;
    dimension: number;

    constructor(row: number, col: number, vertical: boolean, dimension:number) {
        this.row = row;
        this.col = col;
        this.vertical = vertical;
        this.dimension = dimension;
    }

    GetCoordinates():number[][] {
        const result:number[][]=[];
        if (this.vertical) {
            let currentRow = this.row;
            while (currentRow != this.dimension - 8) {
                result.push([currentRow++, this.col]);
            }
        } else {
            let currentCol = this.col;
            while (currentCol != this.dimension - 8) {
                result.push([this.row,currentCol++]);
            }
        }
        return result;
    }

    SetCell(cell:Cell, indice:number):void {
        cell.Set(CellScope.TimingPattern,indice%2==0);
    }

}