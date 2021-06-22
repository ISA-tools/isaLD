import { ISASerializer } from "../utils/serializer.js"

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
    };
    if (event.httpMethod === 'OPTIONS'){
        return {
            statusCode: 200,
            headers: headers
        }
    }
    try {
        let input = JSON.parse(event.body);
        if (!Object.keys(input).includes('url') && !Object.keys(input).includes('instance')) {
            return {
                statusCode: 400,
                body: JSON.stringify({error: "Please provide a URL or an ISA JSON instance"}),
                headers: headers
            }
        }
        if (!Object.keys(input).includes('ontology')) input['ontology'] = 'obo';
        let instance = input['url'] || input['instance'];
        console.log(typeof instance);
        let serializer = await new ISASerializer(instance, input['ontology']);
        return {
            statusCode: 200,
            body: JSON.stringify({instance: serializer.output}),
            headers: headers
        }
    }
    catch(e){
        return {
            statusCode: 400,
            body: JSON.stringify({error: e.message}),
            headers: headers
        }
    }
};
