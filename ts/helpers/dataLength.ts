function GetDataLength(version:number, errorCorrection:ErrorCorrection):DataLength {
    return DATA_LENGTH.filter(data=>data.version==version&&data.errorCorrection==errorCorrection)[0];
}