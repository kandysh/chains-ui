"""Color determination logic for field rows."""
from typing import List, Any, Dict
from config import COLORS


def is_field_aliased(field_name: str, aliases: List[Any]) -> bool:
    """Check if a field has an alias applied."""
    for alias in aliases:
        if alias.used and field_name in alias.on_field:
            return True
    return False


def get_field_validation(field_name: str, validation: Any) -> bool:
    """
    Get validation status for a field.
    Maps field_name to validation attribute, handling variations.
    """
    # Normalize field name
    normalized = field_name.lower().replace(" ", "_").replace("-", "_")

    # Try to get the attribute from validation
    try:
        return getattr(validation, normalized, False)
    except AttributeError:
        return False


def compare_values(val1: Any, val2: Any) -> bool:
    """
    Smart comparison handling types and nulls.
    Returns True if values are considered equal.
    """
    # Handle None/null cases
    if val1 is None and val2 is None:
        return True
    if val1 is None or val2 is None:
        return False

    # Convert to strings for comparison (handles type differences)
    str1 = str(val1).strip().lower()
    str2 = str(val2).strip().lower()

    return str1 == str2


def determine_row_color(
    field_name: str,
    confirmation_value: Any,
    booking_value: Any,
    validation: Any,
    aliases: List[Any]
) -> str:
    """
    Determine row color based on field state.

    Logic:
    1. If alias used on this field → yellow
    2. Else if values match AND field validation passes → green
    3. Else → red

    Returns: "green", "yellow", or "red"
    """
    # Check for alias usage first
    if is_field_aliased(field_name, aliases):
        return "yellow"

    # Check if values match and field is valid
    values_match = compare_values(confirmation_value, booking_value)
    field_valid = get_field_validation(field_name, validation)

    if values_match and field_valid:
        return "green"

    return "red"


def get_color_styles(color: str) -> Dict[str, str]:
    """Return CSS style dictionary for a given color."""
    return COLORS.get(color, COLORS["red"])
