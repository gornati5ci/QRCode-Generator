class ErrorStream {
    informations: GeneralInformation;

    constructor(informations: GeneralInformation) {
        this.informations = informations;
    }

    GenerateErrorChecking(groups: Group[]) {
        const dataLength = GetDataLength(this.informations);
        for (const group of groups) {
            for (const block of group.blocks) {
                const polinomioMessaggio = new Polinomio(block.codewords.length - 1);
                let grado = polinomioMessaggio.grado;
                for (const codeword of block.codewords) {
                    polinomioMessaggio.setup(parseInt(codeword, 2), grado--);
                }
                polinomioMessaggio.moltiplicaEsponenti(dataLength.errorCodewordsPerBlock);

                const polinomioGeneratore = new Polinomio(dataLength.errorCodewordsPerBlock);
                console.log("GRADO: " + dataLength.errorCodewordsPerBlock);
                const coefficienti = this.GetGenerator(dataLength.errorCodewordsPerBlock);
                for (let i = 0; i < coefficienti.length + 1; i++) {
                    polinomioGeneratore.setup(coefficienti[i], dataLength.errorCodewordsPerBlock - i + 1);
                }
                console.log(polinomioGeneratore);
                const originalGrade = polinomioGeneratore.grado;
                polinomioGeneratore.moltiplicaEsponenti(polinomioMessaggio.grado);

                for (let i = 0; i < block.codewords.length; i++) {
                    const esponente = ANTILOG[polinomioMessaggio.coefficienti[0]];
                    const temp = polinomioGeneratore.sommaCoefficientiNuovo(esponente, originalGrade);
                    temp.eseguiLog();
                    polinomioMessaggio.xor(temp);
                    polinomioMessaggio.coefficienti.splice(0, 1);
                    polinomioMessaggio.esponenti.splice(0, 1);
                    polinomioGeneratore.moltiplicaEsponenti(-1);
                    polinomioGeneratore.esponenti.pop();
                    polinomioGeneratore.coefficienti.pop();
                }

                for (let i = 0; i < polinomioMessaggio.coefficienti.length; i++) {
                    let temp = polinomioMessaggio.coefficienti[i].toString(2);
                    while (temp.length < 8) temp = "0" + temp;
                    block.error.push(temp);
                }
            }
        }
    }


    GetGenerator(grado: number):number[] {
        switch (grado) {
            case 7: return [0, 87, 229, 146, 149, 238, 102, 21];
            case 8: return [0, 175, 238, 208, 249, 215, 252, 196, 28];
            case 9: return [0, 95, 246, 137, 231, 235, 149, 11, 123, 36];
            case 10: return [0, 251, 67, 46, 61, 118, 70, 64, 96, 32, 45];
            case 16: return [0, 120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120];
            case 22: return [0, 210, 171, 247, 242, 93, 230, 13, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231];
            case 28: return [0, 168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195, 212, 119, 242, 37, 9, 123];
        }
    }
}