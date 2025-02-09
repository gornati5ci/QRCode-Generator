class AlignmentPattern {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    overlap(numberOfPixels: number): boolean {
        if (this.row <= 7 && this.col <= 7) return true;
        if (this.row >= numberOfPixels - 8 - 7 && this.col <= 7) return true;
        if (this.row <= 7 && this.col >= numberOfPixels - 8 - 7) return true;

        return false;
    }

    draw(real:boolean) {
        for (let i = 0; i < 5; i++) {
            Color(this.row, this.col+i, real?"black":"green");
            Color(this.row+4, this.col+i, real?"black":"green");
        }
        for (let i = 0; i < 5; i++) {
            Color(this.row+i, this.col, real?"black":"green");
            Color(this.row+i, this.col+4, real?"black":"green");
        }
        Color(this.row+2,this.col+2,real?"black":"green");

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const elemento = document.querySelector("td[data-row=\"" + (this.row + i) + "\"][data-col=\"" + (this.col + j) + "\"]");
                if (!elemento.classList.contains("black")) {
                    Color(this.row+i, this.col+j, real?"white":"green");
                }

            }
        }
    }
}
