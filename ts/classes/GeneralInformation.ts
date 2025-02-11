class GeneralInformation {
    encodingMode:EncodingMode;
    version:number;
    errorCorrection:ErrorCorrection;

    CalculateVersion(testo:string) {
        const maxVersion = Object.keys(VERSIONS_DIMENSIONS).map(Number).sort().pop();
        for(let i=1; i<=maxVersion; i++) {
            if(VERSIONS_DIMENSIONS[i][this.errorCorrection][this.encodingMode]<testo.length) continue;
            console.log({length:testo.length,i,encodingMode:this.encodingMode, errorCorrection:this.errorCorrection})
            this.version=i;
            return;
        }
        throw "Could not calculate version";
    }
}