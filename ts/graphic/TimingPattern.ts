class TimingPattern {
    row: number;
    col: number;
    vertical: boolean;

    constructor(row: number, col: number, vertical: boolean) {
        this.row = row;
        this.col = col;
        this.vertical = vertical;
    }

    draw(numberOfPixels:number, real:boolean) {
        let dark = true;
        if (this.vertical) {
            let currentRow = this.row;
            while (currentRow != numberOfPixels - 8) {
                Color(currentRow, this.col, real?dark?"black":"white":"green");
                currentRow++;
                dark = !dark;
            }
        } else {
            let currentCol = this.col;
            while (currentCol != numberOfPixels - 8) {
                Color(this.row, currentCol, real?dark?"black":"white":"green");
                currentCol++;
                dark = !dark;
            }
        }
    }
}