

const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"

const mapWidth = 1000
const mapHeight = 600
const fontSize = 8

let legendElementLongest;
const legendElementspacing = 20;
let xText;
let xRect;

const svg = d3.select("#map")
    .append("svg")

const legend = d3.select("#legend")
    .append("svg")


d3.json(url).then(
    (data,error) => {
        if (error) console.log(error)
        else {
            const hierarchy = d3
                // creating a data structure represnting a tree with nodes, first argument being the object, second: children accessor function (locating children for a node)
                .hierarchy(data, d => d.children)
                // locating value for nodes, for coordinate x, x1, y, y1 later on
                .sum(d => d.value)
                // sort the biggest nodes, so they appear from bigger to smaller
                .sort((n1, n2) => n2.value - n1.value)

            // will give coordinates when called
            const treemap = d3.treemap()
                .size([mapWidth, mapHeight])

            // coordinates to hierarchy
            treemap(hierarchy)

            let tiles = hierarchy.leaves()

            // create g elements - for "text" and "rect elements" - stored in variable
            let group = svg.selectAll("g")
                .data(tiles)
                .enter()
                .append("g")
                // this is setting coordinates "x" & "y" for group, so that "rect" and "text" elemnts that are appended here later on are in correct place
                .attr("transform", d => {
                        return "translate("+ d.x0 + ", " + d.y0 + ")"
                    })
                
            group
                .append("rect")
                .attr("class", "tile")
                .attr("fill", d => {
                    let cat = d.data.category
                    if (cat === "Action") return "#db4f4f"
                    if (cat === "Adventure") return "#db774f"
                    if (cat === "Drama") return "#dbb84f"
                    if (cat === "Family") return "#9adb4f"
                    if (cat === "Animation") return "#dbd44f"
                    if (cat === "Comedy") return "#db9c4f"
                    if (cat === "Biography") return "#4fdb64"
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
                    let x = d.data.name.split(" ")
                    return x
                })
                .enter()
                .append("tspan")
                .attr("x", 2)
                .attr("y", (d,i) => (fontSize+1) + (i*fontSize))
                .text(d => d)
                .attr("style", `font-size:${fontSize}`)    
                
            // LEGEND

            const moviesTypes = data.children.map( i => i.name)
            
            const legendGroup = legend.selectAll("g")
                .data(moviesTypes)
                .enter()
                .append("g")
            
            legendGroup
                .append("text")
                .text(d => d)
                .attr("x", (d,i) => {

                    const widthArray = legendGroup._groups[0]
                        .map( d => d.firstChild.getBBox().width)

                    i===0 
                        ? xText = 0
                        : xText += widthArray[i-1] + legendElementspacing

                    return xText
                })
                .attr("y", 40)

            legendGroup
                .append("rect")
                .attr("class", "legend-item")
                .attr("fill", d => {
                    let cat = d
                    if (cat === "Action") return "#db4f4f"
                    if (cat === "Adventure") return "#db774f"
                    if (cat === "Drama") return "#dbb84f"
                    if (cat === "Family") return "#9adb4f"
                    if (cat === "Animation") return "#dbd44f"
                    if (cat === "Comedy") return "#db9c4f"
                    if (cat === "Biography") return "#4fdb64"
                })
                .attr("width", (d,i) => {
                    return legendGroup._groups[0][i].firstChild
                                .getBBox().width
                })
                .attr("height", 10)
                .attr("x", (d,i) => {
                    
                    const widthArray = legendGroup._groups[0]
                        .map( d => d.firstChild.getBBox().width)

                    i===0 
                        ? xText = 0
                        : xText += widthArray[i-1] + legendElementspacing

                    return xText
                })

            legend.attr("width", () => {

                const widthArray = legendGroup._groups[0]
                        .map( d => d.firstChild.getBBox().width)
                
                let a = widthArray
                    .reduce((total, num) => total + num, 0 ) + legendElementspacing*(widthArray.length -1)

                console.log(a)
                return a

            })


        }
    }
)