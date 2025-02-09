let findingPatterns: FindingPattern[] = [];
function manageFindingPatterns(numberOfPixels: number, real:boolean) {
    findingPatterns.push(new FindingPattern(0, 0));
    findingPatterns.push(new FindingPattern(0, numberOfPixels - 7));
    findingPatterns.push(new FindingPattern(numberOfPixels - 7, 0));
    findingPatterns.forEach(separator => separator.draw(real));
}

let separators: Separator[] = [];
function manageSeparators(numberOfPixels: number, real:boolean) {
    //Top-Left
    separators.push(new Separator(0, 7, false));
    separators.push(new Separator(7, 0, true));
    //Top-Right
    separators.push(new Separator(0, numberOfPixels - 8, false));
    separators.push(new Separator(7, numberOfPixels - 8, true));
    //Bottom-Left
    separators.push(new Separator(numberOfPixels - 8, 7, false));
    separators.push(new Separator(numberOfPixels - 8, 0, true));
    separators.forEach(separator => separator.draw(real));
}
let allAlignments: AlignmentPattern[] = [];

let validAllignmentPatterns: AlignmentPattern[];
function manageAlignmentPatterns(numberOfPixels: number, version: number, real:boolean) {
    if (version > 1) {

        let centri = ALLIGNMENT_PATTERNS_LOCATION[version];
        for (let i = 0; i < centri.length; i++) {
            for (let j = 0; j < centri.length; j++) {
                allAlignments.push(new AlignmentPattern(centri[i] - 2, centri[j] - 2));
            }
        }
        validAllignmentPatterns = allAlignments.filter(alignment => !alignment.overlap(numberOfPixels));
        validAllignmentPatterns.forEach(alignment => alignment.draw(real));
    }
}

let timingPatterns:TimingPattern[]=[];
function manageTimingPatterns(numberOfPixels: number, real:boolean) {
    const timingPatternVertical: TimingPattern = new TimingPattern(8, 6, true);
    const timingPatternHorizontal: TimingPattern = new TimingPattern(6, 8, false);
    timingPatterns.push(timingPatternHorizontal);
    timingPatterns.push(timingPatternVertical);
    timingPatternVertical.draw(numberOfPixels, real);
    timingPatternHorizontal.draw(numberOfPixels, real);
}

function manageDarkModule(version: number, real:boolean) {
    Color(4 * version + 9, 8, real?"black":"green");
}
let formatInformations: FormatInformation[] = [];

function manageFormatInformation(numberOfPixels: number, real:boolean) {
    formatInformations.push(new FormatInformation(8, 0, 9, false));
    formatInformations.push(new FormatInformation(0, 8, 9, true));
    formatInformations.push(new FormatInformation(numberOfPixels - 8, 8, 8, true));
    formatInformations.push(new FormatInformation(8, numberOfPixels - 8, 8, false));
    formatInformations.forEach(formatInformation => formatInformation.draw(real));

}

let versionInformations:VersionInformationArea[] = [];
function manageVersionInformation(numberOfPixels: number, version: number, real:boolean) {
    if (version >= 7) {
        const versionInformationVertical = new VersionInformationArea(0, numberOfPixels - 11, true);
        const versionInformationHorizontal = new VersionInformationArea(numberOfPixels - 11, 0, false);

        versionInformations.push(versionInformationHorizontal);
        versionInformations.push(versionInformationVertical);


        versionInformationHorizontal.draw(real);
        versionInformationVertical.draw(real);
    }

}

function createTable(version: number): number {
    const numberOfPixels = 21 + (version - 1) * 4;
    const tables = document.querySelectorAll("[data-qr-code]");
    for (let k = 0; k < tables.length; k++) {

        for (let i = 0; i < numberOfPixels; i++) {
            const row = document.createElement("tr");
            row.dataset.row = i.toString();
            for (let j = 0; j < numberOfPixels; j++) {
                const td = document.createElement("td");
                td.dataset.row = i.toString();
                td.dataset.col = j.toString();
                td.classList.add("red");
                row.appendChild(td);
            }
            tables[k].appendChild(row);
        }
    }
    return numberOfPixels;
}

function drawData(numberOfPixels: number, stringa: string) {
    const coordinates = new Coordinates(numberOfPixels - 1, numberOfPixels - 1);
    for (let i = 0; i < stringa.length; i++) {
        let classe = stringa[i] == "0" ? "white" : "black";
        Color(coordinates.row, coordinates.col, classe);
        if (i != stringa.length - 1)
            coordinates.move();
    }
}

function deleteOldTable() {
    const table = document.querySelectorAll("[data-qr-code]");
    for (let i = 0; i < table.length; i++) {
        while (table[i].children.length > 0) table[i].children[0].remove();

    }
}

function manageTable(version: number, stringa: string, real:boolean, deleteOld:boolean) {

    if(deleteOld) deleteOldTable();
    const numberOfPixels = 21 + (version - 1) * 4;

    if(deleteOld) {
        allAlignments = [];
        findingPatterns = [];
        formatInformations = [];
        separators = [];
        versionInformations = [];
        timingPatterns = [];
        createTable(version);
    }

    manageFindingPatterns(numberOfPixels, real);

    manageSeparators(numberOfPixels, real);

    manageAlignmentPatterns(numberOfPixels, version, real);

    manageTimingPatterns(numberOfPixels, real);

    manageDarkModule(version, real);

    manageFormatInformation(numberOfPixels, real);

    manageVersionInformation(numberOfPixels, version, real);

    if(deleteOld)
    drawData(numberOfPixels, stringa);
}