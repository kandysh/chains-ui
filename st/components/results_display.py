"""Results display components."""
import streamlit as st
from typing import List
from components.allocation_table import render_allocation_table


def calculate_file_status(file_result) -> str:
    """
    Calculate overall file status based on allocations.

    Returns: "green", "yellow", "red", or "unknown"
    """
    if not file_result.normalized:
        return "unknown"

    has_red = False
    has_yellow = False
    has_green = False

    # Check all allocations
    for allocation_idx, normalized_fields in enumerate(file_result.normalized):
        validation = file_result.validation_status[allocation_idx]
        aliases = file_result.aliases_used[allocation_idx]

        for field in normalized_fields:
            # Simple check: if any alias used, it's yellow territory
            field_has_alias = any(
                alias.used and field.field_name in alias.on_field
                for alias in aliases
            )

            if field_has_alias:
                has_yellow = True
            elif field.confirmation_row == field.booking_row:
                has_green = True
            else:
                has_red = True

    # Priority: red > yellow > green
    if has_red:
        return "red"
    elif has_yellow:
        return "yellow"
    elif has_green:
        return "green"
    else:
        return "unknown"


def get_status_icon(status: str) -> str:
    """Get emoji icon for status."""
    icons = {
        "green": "✅",
        "yellow": "⚠️",
        "red": "❌",
        "unknown": "❓"
    }
    return icons.get(status, "❓")


def render_file_card(file_result, file_idx: int):
    """
    Render a single file result card.

    Args:
        file_result: FileProcessResult object
        file_idx: Index of this file in the results list
    """
    # Calculate overall status
    status = calculate_file_status(file_result)
    status_icon = get_status_icon(status)

    # Create expander for this file
    with st.expander(
        f"{status_icon} **{file_result.filename}**",
        expanded=(file_idx == 0)  # Expand first file by default
    ):
        # File metadata
        st.markdown("### 📋 File Information")

        col1, col2 = st.columns(2)
        with col1:
            st.metric("Filename", file_result.filename)
        with col2:
            num_allocations = len(file_result.normalized)
            st.metric("Allocations Found", num_allocations)

        # Text excerpt
        if file_result.text_excerpt:
            with st.expander("📄 Text Excerpt", expanded=False):
                st.text(file_result.text_excerpt[:500] + "..." if len(file_result.text_excerpt) > 500 else file_result.text_excerpt)

        st.markdown("---")

        # Render each allocation
        if file_result.normalized:
            st.markdown("### 📊 Allocations")

            for allocation_idx, normalized_fields in enumerate(file_result.normalized):
                # Get corresponding validation and aliases
                validation = file_result.validation_status[allocation_idx]
                aliases = file_result.aliases_used[allocation_idx]

                # Allocation header
                st.markdown(f"#### Allocation #{allocation_idx + 1}")

                # Render the allocation table
                render_allocation_table(
                    file_idx=file_idx,
                    allocation_idx=allocation_idx,
                    normalized_fields=normalized_fields,
                    validation=validation,
                    aliases=aliases
                )

                # Add separator between allocations
                if allocation_idx < len(file_result.normalized) - 1:
                    st.markdown("---")
        else:
            st.warning("⚠️ No allocations found in this file.")


def render_results_view(results: List):
    """
    Render the complete results view.

    Args:
        results: List of FileProcessResult objects
    """
    if not results:
        st.info("No results to display.")
        return

    st.markdown(f"### 📊 Processing Results ({len(results)} files)")

    # Summary metrics
    total_allocations = sum(len(r.normalized) for r in results)

    col1, col2 = st.columns(2)
    with col1:
        st.metric("Total Files", len(results))
    with col2:
        st.metric("Total Allocations", total_allocations)

    st.markdown("---")

    # Render each file card
    for file_idx, file_result in enumerate(results):
        render_file_card(file_result, file_idx)
