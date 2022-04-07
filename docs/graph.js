class Transformer {
    constructor() {
        this.counter = 0;
        this.values = {};
    }

    exists(s) {
        return Object.keys(this.values).includes(s);
    }

    valueID(s) {
        if (this.exists(s)) {
            return this.values[s];
        }
        this.values[s] = ++this.counter;
        return this.counter;
    }

    transform(arr, withLabels) {
        var groupList = arr.shift();
        var groups = {};

        // Uncomment this to add a custom colour scheme to node groups.
        // var colours = ["#DD3636", "#D6A744", "#1DA9E5", "#F9B109", "#627178", "#FFFFFF"];
        // for (let i = 0; i < groupList.length; i++) {
        //     var g = groupList[i];
        //     groups[g] = {color: {background: colours[i % colours.length], borderColor: "black"}};
        // }

        let nodes = [];
        let edges = [];

        for (let i = 1; i < arr.length; i++) {
            let frgId = arr[i][0];
            if (frgId === "") {
                continue;
            }

            nodes.push({id: this.valueID(frgId), label: frgId, group: "txns"});

            for (let j = 1; j < arr[i].length; j++) {

                let value = arr[i][j];

                if (value !== "") {
                    if (!this.exists(value)) {
                        nodes.push({id: this.valueID(value), label: value, group: groupList[j]});
                    }

                    var edge = {from: this.valueID(value), to: this.valueID(frgId)}
                    if (withLabels) {
                        edge["label"] = groupList[i];
                    }

                    edges.push(edge);
                }
            }
        }
        return {nodes, edges, groups};
    }
}

