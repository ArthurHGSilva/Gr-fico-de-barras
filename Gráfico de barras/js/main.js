// defini a área disponível para "desenho"
const margin = { left: 100, right: 10, top: 10, bottom: 100 }
const width = 600 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

// definir o tamanho da área do svg
const svg = d3.select("#chart-area").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

// cria o grupo para os elementos svg
const grafico = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Eixo X -> todos os atributos que correspondem ao eixo X envolvendo o texto...
// ..."Total de gols das últimas 7 Copas do Mundo"
grafico.append("text")
  .attr("class", "x axis-label")
  .attr("x", width / 2)
  .attr("y", height + 95)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Total de gols das últimas 7 Copas do Mundo")

// Eixo Y -> todos os atributos que correspondem ao eixo Y envolvendo o texto "Gols"
grafico.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (height / 2)) // altura 
  .attr("y", -60) // distância do gráfico
  .attr("font-size", "20px")
  .attr("text-anchor", "middle") // ficar centralizado
  .attr("transform", "rotate(-90)")
  .text("Gols")

// Carregamento de dados. Essa função irá pegar todos os dados escritos no arquivo gols.json
// Irá pegar os valores estabelecidos na variável gols, e transformá-los em inteiros 
d3.json("data/gols.json").then(data => {
    data.forEach(d => {
      d.gols = Number(d.gols)
    })   

    // função para a escala de banda - eixo x 
    const x = d3.scaleBand()
        .domain(data.map(d => d.name)) // vai retornar o conjunto strings referentes a variável "name"
        .range([0, width]) // definir a largura do eixo
        .paddingInner(0.3) // espaçamento interior (entre as barras)
        .paddingOuter(0.2) // espaçamento exterior (das barras nas extremidades)
  
    // função para a escala linear - eixo y
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.gols)]) // valor real utilizado no modelo (valores físicos - no caso os gols)
        .range([height, 0]) // valor de pixels (definido no canvas: 400 - 0  (colocando a altura primeiro, o gráfico terá seus valores de baixo para cima))

    
    // função (especificação) do eixo x (parte de baixo)
    const xAxisCall = d3.axisBottom(x) // parâmetro
    grafico.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`) // translação de cima para baixo (x = 0; y = altura)
        .call(xAxisCall)
        .selectAll("text") // vai mexer no texto do eixo x e seus atributos
            .attr("y", "8")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)")
            .attr("font-size", "9px")


    // função (especificação) do eixo y  (lado esquerdo)
    const yAxisCall = d3.axisLeft(y)
        .ticks(13)// número total de ticks
    grafico.append("g")
        .attr("class", "y axis")
        .call(yAxisCall)

    //defini como será o formato das barras no gráfico
    const rects = grafico.selectAll("rect")
        .data(data)
  
    // mexe com os atributos das barras
    rects.enter().append("rect")
        .attr("y", (d) => y(d.gols)) // vai identificar os valores referidos na variável "gols" e mapeá-los com a range
        .attr("x", (d) => x(d.name)) //vai identificar os nomes com o domínio e fazer o mapeando com a range
        .attr("width", x.bandwidth) //bandwidth vai fornecer a largura da barra   
        .attr("height", d => height - y(d.gols)) // retorna a altura para adequar aos valores
        .attr("fill", "purple")
})