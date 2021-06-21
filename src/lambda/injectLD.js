import { ISASerializer } from "../serializer.js"

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
        let serializer = await new ISASerializer(input['url'], input['ontology']);
        return {
            statusCode: 200,
            body: JSON.stringify({
                data: serializer.output
            })
        }
    }
    catch(e){
        return {
            statusCode: 400,
            body: JSON.stringify({error: e})
        }
    }
};
