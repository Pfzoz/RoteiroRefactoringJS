import { readFileSync } from "fs";

import Repositorio from "./repositorio.js";
import gerarFaturaStr from "./apresentacao.js";
import formatarMoeda from "./utils.js";
import ServicoCalculoFatura from "./servico.js";

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

const faturas = JSON.parse(readFileSync("./faturas.json"));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
console.log(gerarFaturaHTML(faturas, calc));
