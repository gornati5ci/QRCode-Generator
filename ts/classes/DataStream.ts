class DataStream {
    modeIndicator:string;
    characterCount:CharacterCount;

    informations:GeneralInformation;
    testo:string;
    encodedStream:string;

    constructor(informations:GeneralInformation, testo:string) {
        this.informations=informations;
        this.testo=testo;
        this.SetModeIndicator();
        this.SetCharacterCount();
        this.CalculateDataString();
    }

    private SetModeIndicator() {
        this.modeIndicator = GetModeIndicator(this.informations.encodingMode).toString(2);
        while (this.modeIndicator.length < 4) this.modeIndicator = "0" + this.modeIndicator;
    }

    private SetCharacterCount() {
        this.characterCount = new CharacterCount(this.testo, this.informations);
    }

    private CalculateEncodedText() {
        switch (encodingMode) {
            case EncodingMode.ALFANUMERIC:
                return EncodeAlfanumeric(this.testo);
            case EncodingMode.BYTE:
                return EncodeByte(this.testo);
            default:
                throw "Mode not supported";
        }
    
    }

    private GetEncodedTextWithZeroTerminators(stringa:string, length:number):string {
        if (stringa.length + 4 <= length) stringa += "0000";
        else if (stringa.length + 3 <= length) stringa += "000";
        else if (stringa.length + 2 <= length) stringa += "00";
        else if (stringa.length + 1 <= length) stringa += "0";

        while (stringa.length % 8 != 0) stringa += "0";

        return stringa;
    }

    private GetPaddedString(stringa:string, length:number):string {
        const missingBytes = (length - stringa.length) / 8;
        let pads = ["11101100", "00010001"];
        for (let i = 0; i < missingBytes; i++) stringa += pads[i % 2];
        return stringa;
    }

    private CalculateDataString() {
        
        let encodedData = this.CalculateEncodedText();
        let stringa = this.modeIndicator+this.characterCount.value+encodedData;
        let numberOfBitsRequired = GetDataLength(this.informations).totalNumberOfCodewords * 8;
        stringa=this.GetEncodedTextWithZeroTerminators(stringa, numberOfBitsRequired);
        stringa = this.GetPaddedString(stringa, numberOfBitsRequired);
        if (stringa.length != numberOfBitsRequired) throw "Something went wrong";
        this.encodedStream=stringa;
    }

    GetCodewords():string[] {
        let codewords: string[] = [];
        let copia = this.encodedStream;
        while (copia.length > 0) {
            codewords.push(copia.substring(0, 8));
            copia=copia.substring(8);
        }
        return codewords;
    }
}