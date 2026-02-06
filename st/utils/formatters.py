"""Formatting utilities for display values."""
from typing import Any


def format_value(value: Any) -> str:
    """Format a value for display in the UI."""
    if value is None:
        return "—"

    # Handle boolean values
    if isinstance(value, bool):
        return "Yes" if value else "No"

    # Handle numeric values
    if isinstance(value, (int, float)):
        return str(value)

    # Handle string values
    return str(value).strip()


def format_field_name(field_name: str) -> str:
    """Format field name for display (title case with spaces)."""
    # Replace underscores with spaces
    formatted = field_name.replace("_", " ")
    # Title case
    return formatted.title()
