function GetMinValidVersion(lunghezzaDelTesto:number):number|null {
    const maxVersion = Object.keys(VERSIONS_DIMENSIONS).map(Number).sort().pop();
    for(let i=1; i<=maxVersion; i++) {
        if(VERSIONS_DIMENSIONS[i][errorCorrection][encodingMode]<lunghezzaDelTesto) continue;
        return i;
    }

    return null;
}