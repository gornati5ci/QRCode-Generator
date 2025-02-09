class VersionInformationArea {
    row: number;
    col: number;
    vertical: boolean;

    constructor(row: number, col: number, vertical: boolean) {
        this.row = row;
        this.col = col;
        this.vertical = vertical;
    }

    draw(real) {
        let deltaX = this.vertical ? 3 : 6;
        let deltaY = this.vertical ? 6 : 3;
        for (let x = 0; x < deltaX; x++) {
            for (let y = 0; y < deltaY; y++) {
                if (!document.querySelector("td[data-row=\"" + (this.row + y) + "\"][data-col=\"" + (this.col + x) + "\"]").classList.contains("black"))
                    Color(this.row+y, this.col+x, real?"blue":"green");
            }
        }
    }
}