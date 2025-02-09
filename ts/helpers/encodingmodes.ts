function IsAlfanumeric(stringa: string): boolean {
    for (let i = 0; i < stringa.length; i++) {
        if (VALID_ALPHANUMERIC[stringa[i]]==undefined) return false;
    }

    return true;
}

function IsNumeric(stringa: string): boolean {
    for (let i = 0; i < stringa.length; i++) {
        if (!(stringa[i] >= '0' && stringa[i] <= '9')) return false;
    }

    return true;
}

function GetModeIndicator(mode: EncodingMode): number {
    switch (mode) {
        case EncodingMode.NUMERIC: return 0b0001;
        case EncodingMode.ALFANUMERIC: return 0b0010;
        case EncodingMode.BYTE: return 0b0100;
        case EncodingMode.KANJI: return 0b1000;
        default: throw "Invalid Encoding Mode";
    }
}

function GetCharacterCountLength(version: number, mode: EncodingMode): number {
    switch (mode) {
        case EncodingMode.NUMERIC:
            if (version >= 1 && version <= 9) return 10;
            if (version >= 10 && version <= 26) return 12;
            if (version >= 27 && version <= 40) return 14;
            break;
        case EncodingMode.ALFANUMERIC:
            if (version >= 1 && version <= 9) return 9;
            if (version >= 10 && version <= 26) return 11;
            if (version >= 27 && version <= 40) return 13;
            break;
        case EncodingMode.BYTE:
            if (version >= 1 && version <= 9) return 8;
            if (version >= 10 && version <= 26) return 16;
            if (version >= 27 && version <= 40) return 16;
            break;
        case EncodingMode.KANJI:
            if (version >= 1 && version <= 9) return 8;
            if (version >= 10 && version <= 26) return 10;
            if (version >= 27 && version <= 40) return 12;
            break;
    }

    throw "Something wrong...";
}


function EncodeByte(testo:string):string {
    let temp = testo.split("").map(carattere=>carattere.charCodeAt(0).toString(2));
    temp=temp.map(temp=>{while(temp.length<8)temp="0"+temp;return temp});
    console.log(temp);
    return temp.join("");
}

function EncodeAlfanumeric(testo:string):string {
    let finalResult:string = "";
    while(testo.length>1) {
        let first = VALID_ALPHANUMERIC[testo.substring(0,1)];
        let second = VALID_ALPHANUMERIC[testo.substring(1,2)];
        let value = first*45+second;
        let result = value.toString(2);
        while(result.length<11) {
            result="0"+result;
        }
        finalResult+=result;
        testo = testo.substring(2);
    }

    if(testo.length==0) return finalResult;
    let singleValue = VALID_ALPHANUMERIC[testo];
    let singleResult = singleValue.toString(2);
    while(singleResult.length<6) {
        singleResult="0"+singleResult;
    }
    finalResult+=singleResult;
    return finalResult;
}