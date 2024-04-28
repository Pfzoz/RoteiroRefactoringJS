const { readFileSync } = require("fs");

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync("./pecas.json"));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}

class ServicoCalculoFatura {
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

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor / 100);
}

function gerarFaturaHTML(fatura, calc) {
  return `
    <html>
      <p> Fatura ${fatura.cliente} </p>
      <ul>
      ${fatura.apresentacoes
        .map((apre) => {
          return `<li>  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(
            calc.calcularTotalApresentacao(apre)
          )} (${apre.audiencia} assentos) </li>`;
        })
        .join("\n\x20\x20\x20\x20\x20\x20")}
      </ul>
      <p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))} </p>
      <p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} </p>
    </html>
  `;
}

function gerarFaturaStr(fatura, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(
      calc.calcularTotalApresentacao(apre)
    )} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(
    calc.calcularTotalFatura(fatura)
  )}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(
    fatura
  )} \n`;
  return faturaStr;
}

const faturas = JSON.parse(readFileSync("./faturas.json"));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
console.log(gerarFaturaHTML(faturas, calc));
