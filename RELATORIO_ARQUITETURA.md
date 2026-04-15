# Relatorio Breve de Arquitetura - 2GIJ

## Visao Geral
A solucao e um aplicativo desktop em Electron, focado em Site Survey de Wi-Fi, com coleta de RSSI no Windows, desenho de planta e geracao de heatmap/relatorio.

A arquitetura segue 3 camadas principais:
- Processo principal (integracao com sistema operacional)
- Ponte IPC entre processos
- Interface renderizadora com logica de negocio

## Estrutura Geral
- Processo principal Electron: cria a janela e integra com o SO para leitura de sinal Wi-Fi em [main.js](main.js#L1).
- Ponte IPC: expoe a chamada de scan para a interface por meio de [preload.js](preload.js#L1).
- Frontend e dominio da aplicacao: UI, estado, desenho, survey, heatmap e exportacoes em [index.html](index.html#L1).
- Configuracao de execucao e dependencias em [package.json](package.json#L1).

## Responsabilidade por Camada
### 1) Camada Desktop / Infra
[main.js](main.js#L1) inicializa o Electron, executa `netsh wlan show interfaces`, interpreta saida PT/EN, converte percentual de sinal para RSSI aproximado e retorna dados padronizados.

### 2) Camada de Comunicacao
[preload.js](preload.js#L1) publica `window.electronAPI.wifiScan`, encapsulando `ipcRenderer.invoke`.

### 3) Camada de Apresentacao + Aplicacao
[index.html](index.html#L334) concentra HTML/CSS/JS com estado global, eventos, maquina de estados do survey, renderizacao de canvas e exportacao de dados/relatorios.

## Fluxo Principal de Dados
1. Usuario inicia o survey na barra de controle em [index.html](index.html#L1135).
2. Clique no mapa dispara scan em [index.html](index.html#L894), chamando `window.electronAPI.wifiScan` em [index.html](index.html#L391).
3. O processo principal atende via `ipcMain.handle('wifi-scan')` em [main.js](main.js#L65), faz amostragem e devolve SSID/RSSI/banda.
4. A interface abre modal de confirmacao e salva ponto em [index.html](index.html#L923).
5. O heatmap IDW e renderizado com base nos pontos em [index.html](index.html#L461).
6. Exportacoes:
- JSON do projeto em [index.html](index.html#L1124)
- Snapshot PNG/JPG em [index.html](index.html#L552)

## Modelo de Estado
O estado e centralizado no objeto `state` em [index.html](index.html#L359), contendo:
- Dados de projeto: desenhos, pontos coletados, escala
- Estado de interacao: ferramenta ativa, zoom/pan, calibracao
- Estado de survey: idle/running/paused/done
- Estado de heatmap: visibilidade e parametros IDW

## Decisoes Arquiteturais Relevantes
- Renderizacao em multiplos canvases sobrepostos para separar responsabilidades visuais (base, heatmap, overlay, cursor) em [index.html](index.html#L336).
- Algoritmo IDW com otimizacoes de performance (offscreen em baixa resolucao + blur) em [index.html](index.html#L453).
- Fallback para modo demo sem Electron em [index.html](index.html#L401), melhorando testabilidade da interface.

## Pontos de Atencao
- Acoplamento alto: boa parte da logica esta em um unico arquivo [index.html](index.html#L334), o que pode dificultar evolucao.
- Plataforma: coleta real de sinal depende de `netsh`, portanto o modulo de leitura esta orientado a Windows em [main.js](main.js#L11).
