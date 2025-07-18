/**
 * Script para executar testes no ambiente Docker
 * 
 * Este script:
 * 1. Modifica temporariamente o jest.config.js para usar a configuração Docker
 * 2. Executa os testes especificados ou todos os testes
 * 3. Restaura a configuração original
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Processar argumentos da linha de comando
const args = process.argv.slice(2);
const testPath = args.length > 0 && !args[0].startsWith('--') ? args[0] : 'src/__tests__/models';
const otherArgs = args.filter(arg => arg.startsWith('--'));

// Caminho para o arquivo de configuração do Jest
const jestConfigPath = path.join(__dirname, 'jest.config.js');

// Ler o conteúdo atual
const originalConfig = fs.readFileSync(jestConfigPath, 'utf-8');

// Modificar a configuração para usar o setup do Docker
const modifiedConfig = originalConfig.replace(
  "setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.js']",
  "setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.docker.js']"
);

// Salvar a configuração modificada
fs.writeFileSync(jestConfigPath, modifiedConfig);

try {
  // Construir o comando de teste
  const testCommand = `npx jest ${testPath} --verbose ${otherArgs.join(' ')}`;
  
  // Executar os testes
  console.log(`Executando testes com configuração Docker: ${testCommand}`);
  execSync(testCommand, { stdio: 'inherit' });
  
  console.log('\n\u2705 Testes executados com sucesso!');
} catch (error) {
  process.exitCode = 1;
} finally {
  // Restaurar a configuração original
  fs.writeFileSync(jestConfigPath, originalConfig);
  console.log('Configuração original restaurada.');
}
