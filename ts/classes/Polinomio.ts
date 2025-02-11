class Polinomio {
    grado: number;
    coefficienti: (number | null)[];
    esponenti: number[];

    constructor(grado: number) {
        this.grado = grado;
        this.coefficienti = [];
        this.esponenti = [];
    }

    setup(coefficiente: number | null, esponente: number) {
        this.coefficienti.push(coefficiente);
        this.esponenti.push(esponente);
    }

    moltiplicaEsponenti(valore: number) {
        this.esponenti = this.esponenti.map(esponente => esponente + valore);
        for (let i = 0; i < valore; i++) {
            this.esponenti.push(valore - i);
            this.coefficienti.push(0);
        }
    }

    sommaCoefficienti(valore: number) {
        this.coefficienti = this.coefficienti.map(coefficiente => (coefficiente + valore) % 255);
    }
    sommaCoefficientiNuovo(valore: number, maxNumberOfIterations: number): Polinomio {
        const polinomio: Polinomio = new Polinomio(this.grado);
        for (let i = 0; i < this.esponenti.length; i++) {
            if (i > maxNumberOfIterations) return polinomio;
            polinomio.setup((this.coefficienti[i] + valore) % 255, this.esponenti[i]);
        }
        return polinomio;
    }

    eseguiLog() {
        this.coefficienti = this.coefficienti.map(coefficiente => LOG[coefficiente]);
    }
    eseguiAntilog() {
        this.coefficienti = this.coefficienti.map(coefficiente => ANTILOG[coefficiente]);
    }

    xor(polinomio: Polinomio) {
        for (let i = 0; i < this.coefficienti.length; i++) {
            this.coefficienti[i] ^= polinomio.coefficienti[i];
        }

    }

    console(messaggio: string) {
        let result = "";
        for (const coefficiente of this.coefficienti) {
            result += coefficiente + " ";
        }
        console.log(messaggio, result);
    }
}