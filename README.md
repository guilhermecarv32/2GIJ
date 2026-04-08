# 2GIJ — Wi-Fi Site Survey Desktop

O **2GIJ** é uma ferramenta desktop para levantamento de sinal Wi-Fi (Site Survey). Com ele, você pode desenhar a planta baixa do ambiente, calibrar as dimensões reais em centímetros e mapear a intensidade do sinal (RSSI) ponto a ponto.

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar o ambiente e iniciar o aplicativo.

### 1. Pré-requisitos
Você precisa ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 2. Instalação
Após clonar o repositório ou baixar os arquivos, abra o terminal na pasta do projeto e instale as dependências necessárias:

```bash
npm install
```

### 3. Iniciar o Aplicativo
Para abrir a janela do sistema e começar o survey, execute:

```bash
npm start
```

### Funcionalidades Atuais
Módulo 1 (Core & Canvas): Ferramentas de desenho livre (Lápis, Linha, Retângulo, Círculo) e sistema de calibragem de escala em centímetros.

Módulo 2 (Survey & Scan): Integração com o hardware de rede para leitura real de RSSI (dBm), registro de pontos no mapa e exportação dos dados em JSON.

⌨️ Atalhos de Teclado
P: Ferramenta Lápis

L: Ferramenta Linha

R: Ferramenta Retângulo

C: Ferramenta Círculo

Espaço: Mover o mapa (Pan)

Ctrl + Z: Desfazer último ponto ou desenho

+ / -: Zoom In / Zoom Out