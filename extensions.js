
class Setter extends EventTarget {
    node;
    objects;
    nodeValueKey = "value";

    constructor(node, objects) {
        super();
        this.node = node;
        this.objects = objects;

        if (this.node.type === "checkbox") this.nodeValueKey = "checked";
    }

    handleEvent(event) {
        for (const object of this.objects) {
            object[this.node.name] = this.node[this.nodeValueKey];
        }
    }

}

class ElementExtension {

}

class BindingExtension extends ElementExtension {

    static standardQuery = "input[data-path]";
    static createStandardQueryExtensions() {
        for (const node of document.querySelectorAll(BindingExtension.standardQuery)) {
            new BindingExtension(node);
        }
    }

    query;
    path = [];
    node;
    objects = new Set();

    constructor(node) {
        super();

        this.node = node;

        if (node.dataset.query !== undefined) {
            const slectedNodes = document.querySelectorAll(node.dataset.query);
        }


        /*

        if (node.dataset.path === undefined) {
            if (slectedNodes !== undefined) {
                console.log("slectedNodes");
                console.log(slectedNodes);
            }
        }


        if (node.dataset.query === "") {
            this.objects = this.objects.add(this.node.parentElement);
        } else {
            this.query = node.dataset.query;
            this.qsAll(this.query);
        }
        */

        if (node.dataset.path !== undefined)
        {
            this.path = node.dataset.path.split('.');
            if (this.path[0] === "this") {
                const object = this.node[this.path[1]]
    
                this.objects.add(object);
    
                this.node.value = object[this.node.name];
    
                this.eventHandler = new Setter(this.node, this.objects);
                this.node.addEventListener("input", this.eventHandler);
            } else {
                console.log("not this");
            }
        }
        

        
    }

    qsHelper(startObject, queryString) {

        console.log("startObject");
        console.log(startObject);
        console.log("queryString");
        console.log(queryString);

        var combinations = queryString.split(',');
        console.log("combinations");
        console.log(combinations);


        var queryNodes = [this.node];
            for (const selector in combinations) {

                

                const sel = queryString.split(':closest(');
                console.log("sel");
                console.log(sel);

                var elements = startObject.querySelectorAll(sel[0]);

                if (sel.length > 1) {

                    const index = sel[0].indexOf(")");



                    var closestString;
                    
                    if (index === 0) {
                        closestString = "*";
                    } else {
                        closestString = sel;
                    }

                    queryString = sel[0];

                } else {
                    queryString = sel[0];
                }

                

                

                const scope = sel[0].trim();
                console.log("scope");
                console.log(scope);

                if (sel[0].trim() === ":scope") {
                    console.log("scope");
                    startObject = this.node;
                    const firstElement = sel.shift();
                } else {
                    startObject = document;
                }

                console.log("sel");
                console.log(sel);

                for (const queryNode in queryNodes) {

                }
                /*
                for (int i = 0; i > sel.length; i++) {
                    if (sel[i].endsWith'closest(') {

                    }
                }
                */

            }
            //this.objects = new Set(document.querySelectorAll(node.dataset.query));
    }

    qsAll(queryString) {
        console.log("queryString");
        console.log(queryString);

        var scope = this.query.split(':scope');
        console.log("scope");
        console.log(scope);



        var startObject;
        var queryString;
        if (scope.length == 2) {
            queryString = scope[1];
            startObject = this.node;
        } else {
            queryString = scope[0];
            startObject = document;
        }

        console.log("startObject");
        console.log(startObject);
        console.log("queryString");
        console.log(queryString);

        return this.qsHelper(startObject, queryString);
        
    }

}

BindingExtension.createStandardQueryExtensions();
