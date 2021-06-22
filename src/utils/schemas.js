import assay_schema from "./schemas/assay_schema.json"
import comment_schema from "./schemas/comment_schema.json"
import data_schema from "./schemas/data_schema.json"
import factor_schema from "./schemas/factor_schema.json"
import factor_value_schema from "./schemas/factor_value_schema.json"
import investigation_schema from "./schemas/investigation_schema.json"
import material_attribute_schema from "./schemas/material_attribute_schema.json"
import material_attribute_value_schema from "./schemas/material_attribute_value_schema.json"
import material_schema from "./schemas/material_schema.json"
import ontology_annotation_schema from "./schemas/ontology_annotation_schema.json"
import ontology_source_reference_schema from "./schemas/ontology_source_reference_schema.json"
import organization_schema from "./schemas/organization_schema.json"
import person_schema from "./schemas/person_schema.json"
import process_parameter_value_schema from "./schemas/process_parameter_value_schema.json"
import process_schema from "./schemas/process_schema.json"
import protocol_parameter_schema from "./schemas/protocol_parameter_schema.json"
import protocol_schema from "./schemas/protocol_schema.json"
import publication_schema from "./schemas/publication_schema.json"
import sample_schema from "./schemas/sample_schema.json"
import source_schema from "./schemas/source_schema.json"
import study_schema from "./schemas/study_schema.json"

const SCHEMAS = {
  "assay_schema.json": assay_schema,
  "comment_schema.json": comment_schema,
  "data_schema.json": data_schema,
  "factor_schema.json": factor_schema,
  "factor_value_schema.json": factor_value_schema,
  "investigation_schema.json": investigation_schema,
  "material_attribute_schema.json": material_attribute_schema,
  "material_attribute_value_schema.json": material_attribute_value_schema,
  "material_schema.json": material_schema,
  "ontology_annotation_schema.json": ontology_annotation_schema,
  "ontology_source_reference_schema.json": ontology_source_reference_schema,
  "organization_schema.json": organization_schema,
  "person_schema.json": person_schema,
  "process_parameter_value_schema.json": process_parameter_value_schema,
  "process_schema.json": process_schema,
  "protocol_parameter_schema.json": protocol_parameter_schema,
  "protocol_schema.json": protocol_schema,
  "publication_schema.json": publication_schema,
  "sample_schema.json": sample_schema,
  "source_schema.json": source_schema,
  "study_schema.json": study_schema
};
const CONTEXTS_URL = "https://raw.githubusercontent.com/ISA-tools/isa-api/feature/isajson-context/" +
    "isatools/resources/json-context";

function get_context_url(schemaName, source){
  return `${CONTEXTS_URL}/${source}/isa_` + schemaName.replace("_schema.json", `_${source}_context.jsonld`)
}

export const network = {
  mainSchemaName: "investigation_schema.json",
  schemas: SCHEMAS,
  contexts: {},
  get_contexts: function(source){
    Object.keys(SCHEMAS).forEach(schema => {
      this.contexts[schema] = get_context_url(schema, source)
    })
  }
};
