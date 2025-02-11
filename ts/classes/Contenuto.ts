class Contenuto {
   
    dataStream:DataStream;
    errorStream:ErrorStream;

    informations:GeneralInformation;

    testo:string;

    groups:Group[];


    constructor(informations:GeneralInformation, testo:string) {
        this.informations = informations;
        this.testo=testo;
        this.dataStream = new DataStream(informations, this.testo);
        this.groups=this.GenerateGroups();
        this.errorStream = new ErrorStream(informations);
        this.errorStream.GenerateErrorChecking(this.groups);
        this.Interleave();
        this.AddFinalPadding();
    }



    private GenerateGroups(): Group[] {
        const codewords = this.dataStream.GetCodewords();
        const dataLength = GetDataLength(this.informations);
        const groups: Group[] = [];
        groups.push(new Group());
        if (dataLength.numberOfBlocksInGroup2 != null) groups.push(new Group());
        console.log("Number of groups:" + groups.length);
        for (let i = 0; i < dataLength.numberOfBlocksInGroup1; i++) {
            const block = new Block();
            for (let j = 0; j < dataLength.codewordsInGroup1; j++) {
                block.codewords.push(codewords.splice(0, 1)[0]);
                if (codewords.length == 0) break;
            }
            groups[0].blocks.push(block);
            if (codewords.length == 0) break;
        }
        console.log("Number of blocks in first group: " + groups[0].blocks.length);
        if (groups.length > 1) console.log("Number of blocks in second group: " + groups[1].blocks.length);
    
        return groups;
    }

    Interleave() {
        const interleavingData: string[][] = [];
        const interleavingError: string[][] = [];
        let maxLengthData = 0;
        let maxLengthError = 0;
        for (const group of this.groups) {
            for (const block of group.blocks) {
                interleavingData.push(block.codewords);
                interleavingError.push(block.error);
                maxLengthData = block.codewords.length > maxLengthData ? block.codewords.length : maxLengthData;
                maxLengthError = block.error.length > maxLengthError ? block.error.length : maxLengthError;
            }
        }
    
        let finalDataString = "";
        for (let i = 0; i < maxLengthData; i++) {
            for (let j = 0; j < interleavingData.length; j++) {
                if (interleavingData[j].length > i)
                    finalDataString += interleavingData[j][i];
            }
        }
    
        let finalErrorString = "";
        for (let i = 0; i < maxLengthError; i++) {
            for (let j = 0; j < interleavingError.length; j++) {
                if (interleavingError[j].length > i)
                    finalErrorString += interleavingError[j][i];
            }
        }
    
        this.testo = finalDataString + finalErrorString;
    }
    
    AddFinalPadding() {
        switch (this.informations.version) {
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                this.testo += "0000000";
                break;
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 28:
            case 29:
            case 30:
            case 31:
            case 32:
            case 33:
            case 34:
                this.testo += "000";
                break;
            case 21:
            case 22:
            case 23:
            case 24:
            case 24:
            case 26:
            case 27:
                this.testo += "0000";
                break;
    
        }
    }
    
    
    
}