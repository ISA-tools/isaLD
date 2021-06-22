import { ISASerializer } from "../utils/serializer.js"

exports.handler = async (event) => {
    try {
        let input = JSON.parse(event.body);
        if (!Object.keys(input).includes('url') && !Object.keys(input).includes('instance')) {
            return {
                statusCode: 400,
                body: JSON.stringify({error: "Please provide a URL or an ISA JSON instance"})
            }
        }
        if (!Object.keys(input).includes('ontology')) input['ontology'] = 'obo';
        let instance = input['url'] || input['instance'];
        let serializer = await new ISASerializer(instance, input['ontology']);
        return {
            statusCode: 200,
            body: JSON.stringify(serializer.output)
        }
    }
    catch(e){
        return {
            statusCode: 400,
            body: JSON.stringify({error: e.message})
        }
    }
};
