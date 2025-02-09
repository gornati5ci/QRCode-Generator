class FindingPattern {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    draw(real) {
        for (let i = 0; i < 7; i++) {
            Color(this.row, this.col+i, real?"black":"green");
            Color(this.row+6, this.col+i, real?"black":"green");
        }
        for (let i = 0; i < 7; i++) {
            Color(this.row+i, this.col, real?"black":"green");
            Color(this.row+i, this.col+6, real?"black":"green");
        }
        Color(this.row + 2, this.col + 2,real?"black":"green");
        Color(this.row + 3, this.col + 2,real?"black":"green");
        Color(this.row + 4, this.col + 2,real?"black":"green");
        Color(this.row + 2, this.col + 3,real?"black":"green");
        Color(this.row + 3, this.col + 3,real?"black":"green");
        Color(this.row + 4, this.col + 3,real?"black":"green");
        Color(this.row + 2, this.col + 4,real?"black":"green");
        Color(this.row + 3, this.col + 4,real?"black":"green");
        Color(this.row + 4, this.col + 4,real?"black":"green");

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                const elemento = document.querySelector("td[data-row=\"" + (this.row + i) + "\"][data-col=\"" + (this.col + j) + "\"]");
                if (!elemento.classList.contains("black")) {
                    Color(this.row+i, this.col+j, real?"white":"green");
                }

            }
        }
    }

}