export default class ServicoCalculoFatura {
  constructor(repo) {
    this.repo = repo;
  }

  calcularTotalApresentacao(apre) {
    let total = 0;
    switch (this.repo.getPeca(apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecia: ${this.repo.getPeca(apre).tipo}`);
    }
    return total;
  }

  calcularCreditos(apre) {
    let creditos = 0;
    // créditos para próximas contratações
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.repo.getPeca(apre).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }

  calcularTotalCreditos(fatura) {
    let totalCreditos = 0;
    for (let apre of fatura.apresentacoes) {
      totalCreditos += this.calcularCreditos(apre);
    }
    return totalCreditos;
  }

  calcularTotalFatura(fatura) {
    let totalFatura = 0;
    for (let apre of fatura.apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(apre);
    }
    return totalFatura;
  }
}
