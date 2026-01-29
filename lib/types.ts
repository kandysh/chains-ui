/**
 * Centralized type definitions for the API response and application state
 * Exported for use throughout the application to maintain type consistency
 */

/**
 * Validation status for individual fields in a confirmation file
 */
export interface ValidationStatus {
  "strike date": boolean;
  "expiry date": boolean;
  direction: boolean;
  index: boolean;
  spread: boolean;
  "swap ccy": boolean;
  benchmark: boolean;
  counterparty: boolean;
  units: boolean;
  breakbility: boolean;
}

/**
 * Represents a value alias - a transformation between different textual
 * representations of the same semantic value
 *
 * Example: "GS Trading" → "Goldman Sachs" (different names for same counterparty)
 * Example: "75bps" → "0.0075" (different formats for same spread value)
 * Example: "£" → "GBP" (different symbols for same currency)
 */
export interface Alias {
  source_name: string;        // The value found in the source document
  target_name: string;        // The canonical value it maps to
  used: boolean;              // Whether this alias was applied in this file
  count: number;              // Number of times this alias was applied
  source: "provided" | "infered";  // Whether from config or LLM-inferred
  on_field: string[];         // Which canonical field(s) this value alias applies to
}

/**
 * Represents a single confirmation row with parsed field values
 * Note: Some fields (e.g., spread) may contain source values (string) when they've been aliased,
 * or canonical values (number) when no alias applies
 */
export interface ConfirmationRow {
  strike_date?: string | Date;
  trade_date?: string | Date;
  direction?: "long" | "short";
  swap_type?: string;
  index?: string;
  party_a?: string;
  swap_ccy?: string;
  counterparty?: string;
  units?: number;
  expiry_date?: string | Date;
  early_termination_party_a?: boolean;
  benchmark?: string;
  spread?: number | string;
  lookback?: string;
  bf?: number;
}

/**
 * Represents a transformed field with alias information for display
 */
export interface TransformedField {
  fieldName: string;
  alias: string;
}

/**
 * Represents a booking match from the booking file
 */
export interface BookingMatch {
  sivcom?: number;
  counterparty?: string;
  units?: number;
  index?: string;
  swap_ccy?: string;
  spread?: number;
  breakability?: string;
  strike_date?: string | Date;
  expiry_date?: string | Date;
  direction?: "long" | "short";
}

/**
 * Processing result for a single confirmation file
 */
export interface FileResult {
  filename: string;
  text_excerpt: string;
  unmatched_values: Record<string, string[]>;
  validation_status: ValidationStatus;
  confirmation_rows: ConfirmationRow[];
  booking_matches_rows: BookingMatch[];
  unknown_fields: string[];
  canonical_fields: string[];
  aliases_used: Alias[];
}

/**
 * Main API response containing results for all processed files
 */
export interface ProcessResult {
  booking_filename: string;
  files: FileResult[];
}
