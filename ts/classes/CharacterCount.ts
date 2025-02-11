class CharacterCount {
    length:number;
    value:string;

    constructor(testo:string, informations:GeneralInformation) {
        this.value=testo.length.toString(2);
        this.length = GetCharacterCountLength(informations.version, informations.encodingMode);
        while (this.value.length < this.length) this.value = "0" + this.value;
    }
}