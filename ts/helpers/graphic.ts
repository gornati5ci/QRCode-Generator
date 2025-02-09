    function Color(row:number, col:number, color:string) {
        const cells = document.querySelectorAll("td[data-row=\"" + row + "\"][data-col=\"" + (col) + "\"]");
        for(let i=0; i<cells.length; i++) {
            cells[i].className="";
            cells[i].classList.add(color);
        }
    }