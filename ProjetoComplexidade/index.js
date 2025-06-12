const fs = require('fs');
const path = require('path');

// Importação dos algoritmos disponíveis
const { gnomeSort } = require('./algoritmos/gnome_sort');
const { oddEvenSort } = require('./algoritmos/odd_even_sort');
const { cocktailSort } = require('./algoritmos/cocktail_shaker_sort');

const algoritmosDisponiveis = {
  GnomeSort: gnomeSort,
  OddEvenSort: oddEvenSort,
  CocktailShakerSort: cocktailSort,
};

function gerarArray(N, tipo) {
  let arr = Array.from({ length: N }, (_, i) => i + 1);
  if (tipo === 'pior') return arr.reverse();
  if (tipo === 'medio') {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
}

function executarAlgoritmo(algoritmo, array) {
  const inicio = process.hrtime.bigint();
  algoritmo([...array]);
  const fim = process.hrtime.bigint();
  return Number(fim - inicio) / 1e9;
}

function getMemoryUsageMB() {
  const usage = process.memoryUsage();
  return usage.heapUsed / 1024 / 1024;
}

function salvarCSVGlobal(linhasCSV, csvFileName = 'Resultados_Consolidados.csv') {
  const csvPath = `./${csvFileName}`;
  const header = 'Data;Hora;Algoritmo;N;Caso;Tempo(s);Memória(MB)\n';
  const fileExists = fs.existsSync(csvPath);
  let conteudo = '';

  if (!fileExists) {
    conteudo += header;
  }
  conteudo += linhasCSV.join('\n') + '\n';

  fs.writeFileSync(csvPath, conteudo, { flag: 'a' });
  console.log(`\nArquivo ${csvFileName} atualizado com sucesso!`);
}

function main() {
  // Usar process.cwd() para ler o arquivo na pasta atual do executável
  const caminhoEntrada = path.join(process.cwd(), 'N_Algoritmo.txt');

  console.log("Procurando o arquivo 'N_Algoritmo.txt' em:", caminhoEntrada);

  if (!fs.existsSync(caminhoEntrada)) {
    console.error("Arquivo 'N_Algoritmo.txt' não encontrado na pasta atual.");
    aguardarSaida();
    return;
  }

  const linhas = fs.readFileSync(caminhoEntrada, 'utf-8').trim().split(/\r?\n/);
  if (linhas.length < 2) {
    console.error("O arquivo 'N_Algoritmo.txt' deve conter duas linhas: N e o nome do algoritmo.");
    aguardarSaida();
    return;
  }

  const N = parseInt(linhas[0]);
  const algoritmoNome = linhas[1].trim();

  if (isNaN(N) || N <= 0) {
    console.error("O valor de N é inválido.");
    aguardarSaida();
    return;
  }

  const algoritmo = algoritmosDisponiveis[algoritmoNome];
  if (!algoritmo) {
    console.error(`Algoritmo '${algoritmoNome}' não reconhecido.`);
    aguardarSaida();
    return;
  }

  const tiposCaso = ['melhor', 'pior', 'medio'];
  const linhasCSV = [];

  tiposCaso.forEach(tipo => {
    const execucoes = tipo === 'medio' ? 5 : 1;
    let somaTempo = 0;
    let somaMemoria = 0;

    for (let i = 0; i < execucoes; i++) {
      const arr = gerarArray(N, tipo);
      const tempo = executarAlgoritmo(algoritmo, arr);
      const memoria = getMemoryUsageMB();
      somaTempo += tempo;
      somaMemoria += memoria;
    }

    const tempoMedio = somaTempo / execucoes;
    const memoriaMedia = somaMemoria / execucoes;
    const agora = new Date();
    const data = agora.toLocaleDateString('pt-BR');
    const hora = agora.toLocaleTimeString('pt-BR');

    linhasCSV.push(`${data};${hora};${algoritmoNome};${N};${tipo};${tempoMedio.toFixed(6)};${memoriaMedia.toFixed(2)}`);
    console.log(`✔ ${algoritmoNome} - ${tipo} caso - N=${N} - Tempo: ${tempoMedio.toFixed(6)}s - Memória: ${memoriaMedia.toFixed(2)}MB`);
  });

  salvarCSVGlobal(linhasCSV);
  aguardarSaida();
}

function aguardarSaida() {
  console.log("\nPressione qualquer tecla para sair...");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
}

main();
