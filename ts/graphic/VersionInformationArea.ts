class VersionInformationArea implements IBlock {
    row: number;
    col: number;
    vertical: boolean;

    constructor(row: number, col: number, vertical: boolean) {
        this.row = row;
        this.col = col;
        this.vertical = vertical;
    }

    GetCoordinates(): number[][] {
        const result:number[][]=[];
        let deltaX = this.vertical ? 3 : 6;
        let deltaY = this.vertical ? 6 : 3;
        for (let x = 0; x < deltaX; x++) {
            for (let y = 0; y < deltaY; y++) {
                result.push([this.row+y, this.col+x]);
            }
        }
        return result;
    }

    SetCell(cell: Cell, indice: number): void {
        if(cell.scope==CellScope.Empty) {
            cell.scope=CellScope.VersionInformationArea;
        }
    }
}