

/*

FreeCodeCamp Curriculum
Data Visualization with D3
-> TreemapDiagram

I  | Declaraions
II | Fetch & Roll 
    1. Fetch Data
    2. Create Hierarchy 
        a) creating a data structure represnting a tree with nodes, first argument being the object, second: children accessor function (locating children for a node)
        b) locating value for nodes, for coordinate x, x1, y, y1 later on
        c) sort the biggest nodes, so they appear from bigger to smaller
    3. Create TreeMap (gives coordinates to hierarchy)
    4. Map Elements
    5. Legend Elements

*/

//--------------------------
// I : Declarations
//--------------------------

const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"

const mapWidth = 1000
const mapHeight = 600
const fontSize = 8
const legendElementspacing = 20;

const svg = d3.select("#map")
    .append("svg")

const legend = d3.select("#legend")
    .append("svg")

const toolTip = d3
    .select("#tooltip-container")
    .append("dl")
    .attr("id", "tooltip")
    .style("display", "none");

function colorCategory(cat) {
    if (cat === "Action") return "#db4f4f"
    if (cat === "Adventure") return "#db774f"
    if (cat === "Drama") return "#dbb84f"
    if (cat === "Family") return "#9adb4f"
    if (cat === "Animation") return "#dbd44f"
    if (cat === "Comedy") return "#db9c4f"
    if (cat === "Biography") return "#4fdb64"
}

// places svg elements ("x"-wise) after each other, with space between. Based on array of elemnts widths 
function placeLegendItems(arr, space, i) {
    const widthArray = arr.map(d => d.firstChild.getBBox().width)

            i===0 
                ? xText = 0 // xText - undeclared variable
                : xText += widthArray[i-1] + space

            return xText
}

const drawMapElements = (tiles) => {

    // create g elements - for "text" and "rect elements" - stored in variable
    let group = svg.selectAll("g")
        .data(tiles)
        .enter()
        .append("g")
    // this is setting coordinates "x" & "y" for group, so that "rect" and "text" elemnts that are appended here later on are in correct place
        .attr("transform", d => {
                return "translate("+ d.x0 + ", " + d.y0 + ")"
            })
        .on("mouseover", () => {
            toolTip
                .style("display", "block")
            })
        .on("mousemove", (ev,d) => {  
            toolTip
                .html(`
                    <div>
                        <p>${d.data.name}</p>
                    </div>
                    <div>
                        <dt>Category: </dt>
                        <dd>${d.data.category}</dd>
                    </div>
                    <div>
                        <dt>Value: </dt>
                        <dd>${d.data.value}</dd>
                    </div>             
                    `)
                .attr("data-education", () => {
                    return 
                })
                .style("top", (ev.pageY)-100 +"px")
                .style("left",(ev.pageX)+20  +"px")
                .attr("data-value", () => {
                    return d.data.value
                })
            })
        .on("mouseleave", () => {
            toolTip
                .style("display","none")
            })              

    group
        .append("rect")
        .attr("class", "tile")
        .attr("fill", d => {
            let cat = d.data.category
            return colorCategory(cat)
        })
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("stroke", "white")
        .style("stroke-width", "1")

    group
        .append("text")
        .selectAll("tspan")
        .data(d => {
            // each word goes to seprate tspan
            let txt = d.data.name.split(" ")
            return txt
        })
        .enter()
        .append("tspan")
        .attr("x", 2)
        .attr("y", (d,i) => (fontSize+1) + (i*fontSize))
        .text(d => d)
        .attr("style", `font-size:${fontSize}`)
        
}

const drawLegendElements = (moviesTypes) => {

    const legendGroup = legend.selectAll("g")
        .data(moviesTypes)
        .enter()
        .append("g")

    legendGroup
        .append("text")
        .text(d => d)
        .attr("x", (d,i) => {
            const arr = legendGroup._groups[0]
            const space = legendElementspacing
            let idx = i
            return placeLegendItems(arr, space, idx)
        })
        .attr("y", 40)

    legendGroup
        .append("rect")
        .attr("class", "legend-item")
        .attr("fill", d => {
            let cat = d
            return colorCategory(cat)
        })
        .attr("width", (d,i) => {
            return legendGroup._groups[0][i].firstChild
                        .getBBox().width
        })
        .attr("height", 10)
        .attr("x", (d,i) => {

            const arr = legendGroup._groups[0]
            const space = legendElementspacing
            let idx = i
            
            return placeLegendItems(arr, space, idx)
        })

    legend.attr("width", () => {

        const widthArray = legendGroup._groups[0]
                .map( d => d.firstChild.getBBox().width)
        
        return widthArray
            .reduce((total, num) => total + num, 0 ) + legendElementspacing*(widthArray.length -1)

})

}

//--------------------------
// II : Fetch & Roll
//--------------------------

// 1. Fetch Data
d3.json(url).then(
    (data,error) => {
        if (error) console.log(error)
        else {
            // 2. Hierarchy
            const hierarchy = d3
                .hierarchy(data, d => d.children)
                .sum(d => d.value)
                .sort((n1, n2) => n2.value - n1.value)

            // 3. TreeMap
            const treemap = d3.treemap().size([mapWidth, mapHeight])
            treemap(hierarchy)

            // 4. Map 
            let tiles = hierarchy.leaves()
            drawMapElements(tiles)
                
            // 5. Legend 
            const moviesTypes = hierarchy.children.map(d => d.data.name)
            drawLegendElements(moviesTypes)
        }
    }
)