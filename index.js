const { readFileSync } = require("fs");

class ServicoCalculoFatura {
  calcularTotalApresentacao(apre, pecas) {
    let total = 0;
    switch (getPeca(apre, pecas).tipo) {
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
        throw new Error(`Peça desconhecia: ${getPeca(apre, pecas).tipo}`);
    }
    return total;
  }

  calcularCreditos(apre, pecas) {
    let creditos = 0;
    // créditos para próximas contratações
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(apre, pecas).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }

  calcularTotalCreditos(pecas, fatura) {
    let totalCreditos = 0;
    for (let apre of fatura.apresentacoes) {
      totalCreditos += this.calcularCreditos(apre, pecas);
    }
    return totalCreditos;
  }

  calcularTotalFatura(fatura) {
    let totalFatura = 0;
    for (let apre of fatura.apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(apre, pecas);
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

function getPeca(apresentacao, pecas) {
  return pecas[apresentacao.id];
}

function gerarFaturaHTML(fatura, pecas) {
  return `
    <html>
      <p> Fatura ${fatura.cliente} </p>
      <ul>
      ${fatura.apresentacoes.map((apre) => {
        return `<li>  ${getPeca(apre, pecas).nome}: ${formatarMoeda(
          calc.calcularTotalApresentacao(apre, pecas)
        )} (${apre.audiencia} assentos) </li>`;
      }).join('\n\x20\x20\x20\x20\x20\x20')}
      </ul>
      <p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))} </p>
      <p> Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura)} </p>
    </html>
  `;
}

function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(apre, pecas).nome}: ${formatarMoeda(
      calc.calcularTotalApresentacao(apre, pecas)
    )} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(
    pecas,
    fatura
  )} \n`;
  return faturaStr;
}

const faturas = JSON.parse(readFileSync("./faturas.json"));
const pecas = JSON.parse(readFileSync("./pecas.json"));
const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);
console.log(gerarFaturaHTML(faturas, pecas));
