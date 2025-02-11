class Coordinates {
    maxRow: number;
    maxCol: number;
    row: number;
    col: number;
    left: boolean;
    up: boolean;
    firstCol:boolean;
    table:Table;

    constructor(table:Table) {
        this.table=table;
        this.maxRow = this.table.dimension-1;
        this.maxCol = this.table.dimension-1;
        this.row = this.maxRow;
        this.col = this.maxCol;
        this.left = true;
        this.up = true;
        this.firstCol = false;
    }

    move() {
        if(this.firstCol){
            if(this.table.cells[this.row][this.col].scope==CellScope.Empty||this.table.cells[this.row][this.col].scope==CellScope.Data) return;
            this.row--;
            return this.move();
        }
        if (this.up) {
            if (this.left) {
                this.col--;
                if (this.col < 0) throw "Invalid col";
                this.left = false;
                if(this.table.cells[this.row][this.col].scope==CellScope.Empty||this.table.cells[this.row][this.col].scope==CellScope.Data) return;
                return this.move();
            } else {
                this.left = true;
                this.col++;
                this.row--;
                if (this.col > this.maxCol) throw "Invalid position";
                if (this.row == -1) {
                    this.row = 0;
                    this.col -= 2;
                    this.up = false;
                    this.left = true;
                }
                if(this.table.cells[this.row][this.col].scope==CellScope.Empty||this.table.cells[this.row][this.col].scope==CellScope.Data) return;
                return this.move();
            }
        } else {
            if (this.left) {
                this.left = false;
                this.col--;
                if (this.col < 0) throw "Invalid position";
                if(this.table.cells[this.row][this.col].scope==CellScope.Empty||this.table.cells[this.row][this.col].scope==CellScope.Data) return;
                return this.move();
            } else {
                this.left = true;
                this.col++;
                this.row++;
                if (this.row > this.maxRow) {
                    this.row = this.maxRow;
                    this.col -= 2;
                    if(this.col==0) {
                        this.firstCol=true;
                        return this.move();
                    }
                    this.left = true;
                    this.up = true;
                }
                if(this.table.cells[this.row][this.col].scope==CellScope.Empty||this.table.cells[this.row][this.col].scope==CellScope.Data) return;
                return this.move();
            }
        }
    }
}
