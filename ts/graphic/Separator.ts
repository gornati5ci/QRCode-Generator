class Separator {
    row: number;
    col: number;
    vertical: boolean;

    constructor(row: number, col: number, vertical: boolean) {
        this.row = row;
        this.col = col;
        this.vertical = vertical;
    }

    draw(real:boolean) {
        if (this.vertical) {
            for (let i = 0; i < 8; i++) {
                Color(this.row, this.col+i, real?"white":"green");
            }
        } else {
            for (let i = 0; i < 8; i++) {
                Color(this.row+i, this.col, real?"white":"green");
            }
        }
    }
}
