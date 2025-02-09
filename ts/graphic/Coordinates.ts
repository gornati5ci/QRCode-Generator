class Coordinates {
    maxRow: number;
    maxCol: number;
    row: number;
    col: number;
    left: boolean;
    up: boolean;
    firstCol:boolean;

    constructor(maxRow: number, maxCol: number) {
        this.maxRow = maxRow;
        this.maxCol = maxCol;
        this.row = maxRow;
        this.col = maxCol;
        this.left = true;
        this.up = true;
        this.firstCol = false;
    }

    move() {
        if(this.firstCol){
            if (!document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("black")
                && !document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("white")
                && !document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("blue")
            ) return;
            this.row--;
            return this.move();
        }
        if (this.up) {
            if (this.left) {
                this.col--;
                if (this.col < 0) throw "Invalid col";
                this.left = false;
                if (!document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("black")
                    && !document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("white")
                    && !document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("blue")
                ) return;
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
                if (!document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("black")
                    && !document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("white")
                    && !document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("blue")
                ) return;
                return this.move();
            }
        } else {
            if (this.left) {
                this.left = false;
                this.col--;
                if (this.col < 0) throw "Invalid position";
                if (!document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("black")
                    && !document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("white")
                    && !document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("blue")
                ) return;
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
                if (!document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("black")
                    && !document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("white")
                    && !document.querySelector(`td[data-row="${this.row}"][data-col="${this.col}"]`).classList.contains("blue")
                ) return;
                return this.move();
            }
        }
    }
}
