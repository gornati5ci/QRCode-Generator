function GetDataLength(informations:GeneralInformation):DataLength {
    return DATA_LENGTH.filter(data=>data.version==informations.version&&data.errorCorrection==informations.errorCorrection)[0];
}