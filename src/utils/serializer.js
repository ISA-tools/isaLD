import { network } from "./schemas.js"
const axios = require('axios');

export class ISASerializer {

    /**
     *
     * @param {String | Object} instance: an ISA JSON instance or URL to an ISA JSON instance
     * @param source: the ontology to use
     * @returns {ISASerializer|*|Promise<*>}
     */
    constructor(instance, source) {
        if (ISASerializer._instance){
            network.get_contexts(source);
            return ISASerializer._instance
        }
        ISASerializer._instance = this;
        network.get_contexts(source);
        this.schemas = network.schemas;
        this.contexts = network.contexts;
        this.instance = null;
        this.output = null;
        return (async () => {
            if (typeof(instance) === 'string') {
                this.url = instance;
                await this.resolveInstance();
            }
            else this.instance = instance;
            this.output = this.injectLD(network.mainSchemaName, {}, this.instance, null);
            return this;
        })();
    }

    /**
     * Resolve the instance from the input URL
     * @returns {Promise}
     */
    async resolveInstance(){
        let response = await axios({
            method: "GET",
            baseURL: this.url
        });
        this.instance = response.data;
    }

    /**
     * Inject the LD attributes in the given instance
     * @param {String} schemaName: name of the schema to match the instance against
     * @param {Object} output: the object onto which the injection should be done
     * @param {Object} instance: the object from which the injection should be done
     * @param {Null | string} reference: reference to a fake schema for attributes without $ref
     * @returns {Object}: the json LD representation of the ISA JSON instance
     */
    injectLD(schemaName, output, instance, reference){
        let props = this.schemas[schemaName];
        if (Object.keys(this.schemas[schemaName]).includes('properties')) {
            props = this.schemas[schemaName]['properties'];
        }
        let context_key = this.getContextKey(schemaName);
        output["@context"] = this.getContextURL(schemaName);
        if (typeof(reference) === "string") {
            context_key = schemaName.replace("_schema.json", "").replace("#", "");
            output["@context"] = this.getContextURL(reference)
        }
        output["@type"] = context_key;
        for (let [fieldName, fieldVal] of Object.entries(instance)) {
            if (Object.keys(props).includes(fieldName)) {
                if (Object.keys(props[fieldName]).includes('type')
                    && props[fieldName].type === "array"){
                    if (Object.keys(props[fieldName]).includes('items')
                        && Object.keys(props[fieldName].items).includes('$ref')) {
                        let ref = props[fieldName]['items']['$ref'].replace("#", "");
                        for (let val of fieldVal) {
                            val = this.injectLD(ref, val, val, null)
                        }
                    }
                    else {
                        if (fieldName === 'inputs') {
                            fieldVal.forEach(inputVal => {
                                let ref = inputVal['@id'].split('#')[1].split("/")[0] + "_schema.json";
                                inputVal = this.injectLD(ref, inputVal, inputVal, null)
                            })
                        }
                        else if (fieldName === 'outputs') {
                            fieldVal.forEach(outputVal => {
                                let ref = outputVal['@id'].split('#')[1].split("/")[0] + "_schema.json";
                                outputVal = this.injectLD(ref, outputVal, outputVal, null)
                            })
                        }
                        else {
                            let ref = fieldName + '_schema.json';
                            this.schemas[ref] = props[fieldName];
                            for (let value of fieldVal) {
                                value  = this.injectLD(ref, value, value, schemaName)
                            }
                        }
                    }
                }
                else if (Object.keys(props[fieldName]).includes('type')
                    && props[fieldName].type === "object"){
                    let ref = fieldName + '_schema.json';
                    this.schemas[ref] = props[fieldName];
                    fieldVal = this.injectLD(ref, fieldVal, fieldVal, schemaName)
                }
                else if (Object.keys(props[fieldName]).includes('$ref')){
                    let ref = props[fieldName]['$ref'].replace("#", "");
                    fieldVal = this.injectLD(ref, fieldVal, fieldVal, null)
                }
                else if (Object.keys(props[fieldName]).includes('anyOf')
                    && fieldName === 'value' && typeof(fieldVal) === "object"){
                    let ref = props[fieldName]['anyOf'].filter(prop => {
                        if (Object.keys(prop).includes('$ref')){
                            return prop;
                        }
                    })[0]['$ref'].replace("#", "");
                    fieldVal = this.injectLD(ref, fieldVal, fieldVal, null)
                }
            }
            output[fieldName] = fieldVal;
        }
        return output;
    }

    /**
     * Given a schema name, gets the corresponding context URL
     * @param schemaName
     * @returns {*}
     */
    getContextURL(schemaName){
        return this.contexts[schemaName]
    }

    /**
     * Given a reference name, builds the corresponding context key to find in the context file.
     * @param name
     * @returns {string}
     */
    getContextKey(name) {
        function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        name = name.replace("_schema.json", "").replace("#", "");
        return name.split("_").map(str => {
            return capitalize(str)
        }).join("")
    }
}
