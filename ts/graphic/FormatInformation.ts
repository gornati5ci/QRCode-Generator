class FormatInformation {
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

    draw(real:boolean) {
        if (this.vertical) {
            let currentRow = this.row;
            for (let i = 0; i < this.length; i++) {
                if (!document.querySelector("td[data-row=\"" + currentRow + "\"][data-col=\"" + this.col + "\"]").classList.contains("black"))
                    Color(currentRow , this.col, real?"blue":"green");
                currentRow++;
            }
        } else {
            let currentCol = this.col;
            for (let i = 0; i < this.length; i++) {
                if (!document.querySelector("td[data-row=\"" + this.row + "\"][data-col=\"" + currentCol + "\"]").classList.contains("black"))
                    Color(this.row, currentCol, real?"blue":"green");
                currentCol++;
            }
        }
    }
}