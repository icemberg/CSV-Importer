// Allowed CRM status values for validation
const ALLOWED_CRM_STATUSES = [
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
  "",
];

// Allowed data source values for validation
const ALLOWED_DATA_SOURCES = [
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
  "",
];

// All CRM fields
const CRM_FIELDS = [
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
];

/**
 * Validates and sanitizes a single CRM record.
 * Returns the sanitized record.
 */
function validateRecord(record) {
  const sanitized = {};

  for (const field of CRM_FIELDS) {
    let value = record[field];
    if (value === null || value === undefined) {
      value = "";
    } else {
      value = String(value).trim();
    }
    value = value.replace(/\r?\n/g, " | ");
    sanitized[field] = value;
  }
  if (!ALLOWED_CRM_STATUSES.includes(sanitized.crm_status)) {
    sanitized.crm_status = "";
  }
  if (!ALLOWED_DATA_SOURCES.includes(sanitized.data_source)) {
    sanitized.data_source = "";
  }
  if (sanitized.created_at) {
    const parsed = new Date(sanitized.created_at);
    if (isNaN(parsed.getTime())) {
      sanitized.created_at = "";
    }
  }
  if (sanitized.mobile_without_country_code) {
    sanitized.mobile_without_country_code =
      sanitized.mobile_without_country_code.replace(/[^\d]/g, "");
  }

  return sanitized;
}
function hasContactInfo(record) {
  return (
    (record.email && record.email.trim() !== "") ||
    (record.mobile_without_country_code &&
      record.mobile_without_country_code.trim() !== "")
  );
}

module.exports = {
  validateRecord,
  hasContactInfo,
};
