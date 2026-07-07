/**
 * Domain constants for the CRM import system.
 * Open/Closed Principle: extend by adding new constants, not modifying existing ones.
 */

/** All CRM record fields in canonical order */
const CRM_FIELDS = Object.freeze([
  "created_at",
  "name",
  "email",
  "country_code",
  "mobile_without_country_code",
  "company",
  "city",
  "state",
  "country",
  "lead_owner",
  "crm_status",
  "crm_note",
  "data_source",
  "possession_time",
  "description",
]);

/** Allowed CRM status enum values */
const CRM_STATUS_VALUES = Object.freeze([
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
]);

/** Allowed data source enum values */
const DATA_SOURCE_VALUES = Object.freeze([
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
]);

/** HTTP status codes used in the application */
const HTTP_STATUS = Object.freeze({
  OK: 200,
  BAD_REQUEST: 400,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_ERROR: 500,
});

/** Error codes for structured error handling */
const ERROR_CODES = Object.freeze({
  NO_FILE: "NO_FILE_UPLOADED",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  EMPTY_CSV: "EMPTY_CSV",
  CSV_PARSE_ERROR: "CSV_PARSE_ERROR",
  AI_PROCESSING_ERROR: "AI_PROCESSING_ERROR",
  CONFIG_ERROR: "CONFIG_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
});

module.exports = {
  CRM_FIELDS,
  CRM_STATUS_VALUES,
  DATA_SOURCE_VALUES,
  HTTP_STATUS,
  ERROR_CODES,
};
