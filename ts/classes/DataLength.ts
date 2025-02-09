class DataLength {
    version:number;
    errorCorrection:ErrorCorrection;
    totalNumberOfCodewords:number;
    errorCodewordsPerBlock:number;
    numberOfBlocksInGroup1:number;
    codewordsInGroup1:number;
    numberOfBlocksInGroup2:number|null;
    codewordsInGroup2:number|null;

    constructor(version:number, errorCorrection:ErrorCorrection, totalNumberOfCodewords:number,
        codewordsPerBlock:number, numberOfBlocksInGroup1:number, codewordsInGroup1:number,
    numberOfBlocksInGroup2:number|null,codewordsInGroup2:number|null) {
        this.version=version;
        this.errorCorrection=errorCorrection;
        this.totalNumberOfCodewords=totalNumberOfCodewords;
        this.errorCodewordsPerBlock=codewordsPerBlock;
        this.numberOfBlocksInGroup1=numberOfBlocksInGroup1;
        this.codewordsInGroup1=codewordsInGroup1;
        this.numberOfBlocksInGroup2=numberOfBlocksInGroup2;
        this.codewordsInGroup2=codewordsInGroup2;
    }
}