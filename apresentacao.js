import formatarMoeda from "./utils.js";

export default function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(
        calc.calcularTotalApresentacao(apre)
      )} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(
      calc.calcularTotalFatura(fatura)
    )}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} \n`;
    return faturaStr;
  };
  