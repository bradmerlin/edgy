function render(e) {
    var fileInput = document.getElementById("csv");

    e.preventDefault();

    var reader = new FileReader();
    var transformer = new Transformer();

    // var enableStabilisation = document.getElementById("stabilise").checked;
    // var stabilisationIterations = document.getElementById("iterations").value;
    // var enablePhysics = document.getElementById("physics").checked;
    var enableLabels = document.getElementById("labels").checked;

    var enableStabilisation = true;
    var stabilisationIterations = 400;
    var enablePhysics = true;

    var start = new Date().getTime();

    reader.onload = function () {
        console.log("start processing");
        const graph = transformer.transform(csvArray(reader.result), enableLabels);
        console.log("transform took", new Date().getTime() - start, "ms");
        const container = document.getElementById("graph");

        const data = {
            nodes: new vis.DataSet(graph.nodes),
            edges: new vis.DataSet(graph.edges),
        };

        const options = {
            layout: {improvedLayout: false, hierarchical: false},
            physics: {
                enabled: enablePhysics,
                solver: "forceAtlas2Based",
                forceAtlas2Based: {
                    gravitationalConstant: -350,
                    centralGravity: 0.01,
                    springConstant: 0.02,
                    springLength: 10,
                    damping: 0.4,
                    avoidOverlap: 0
                },
                stabilization: {
                    enabled: enableStabilisation,
                    iterations: Number(stabilisationIterations)
                }
            },
            nodes: {
                shape: "dot",
                size: 30,
                font: {
                    size: 50,
                },
            },
            edges: {
                chosen: {
                    edge: function (values, id, selected, hovering) {
                        values.width = 20;
                    }
                },
                font: {
                    size: 50,
                },

            },

            groups: graph.groups,
        };

        const network = new vis.Network(container, data, options);
        network.on("stabilizationIterationsDone", function () {
            network.setOptions({physics: enablePhysics});
        });
        console.log("render took", new Date().getTime() - start, "ms");

        loading.classList.add("hidden");
    };

    // start reading the file. When it is done, calls the onload event defined above.
    reader.readAsBinaryString(fileInput.files[0]);
}