function resetAllErrorCorrectionButtons() {
    document.getElementById("btnL").classList.remove("btn-primary");
    document.getElementById("btnM").classList.remove("btn-primary");
    document.getElementById("btnQ").classList.remove("btn-primary");
    document.getElementById("btnH").classList.remove("btn-primary");
    document.getElementById("btnL").classList.add("btn-outline-primary");
    document.getElementById("btnM").classList.add("btn-outline-primary");
    document.getElementById("btnQ").classList.add("btn-outline-primary");
    document.getElementById("btnH").classList.add("btn-outline-primary");
}

function errorButtonPressed(button:HTMLButtonElement) {
    resetAllErrorCorrectionButtons();
    button.classList.add("btn-primary");
    button.classList.remove("btn-outline-primary");
    if(button.id=="btnL") errorCorrection = ErrorCorrection.L;
    if(button.id=="btnM") errorCorrection = ErrorCorrection.M;
    if(button.id=="btnQ") errorCorrection = ErrorCorrection.Q;
    if(button.id=="btnH") errorCorrection = ErrorCorrection.H;

}

document.getElementById("btnL").onclick=function() {errorButtonPressed(this as HTMLButtonElement);}
document.getElementById("btnM").onclick=function() {errorButtonPressed(this as HTMLButtonElement);}
document.getElementById("btnQ").onclick=function() {errorButtonPressed(this as HTMLButtonElement);}
document.getElementById("btnH").onclick=function() {errorButtonPressed(this as HTMLButtonElement);}