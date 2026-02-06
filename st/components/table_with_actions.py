"""Table component with inline action buttons."""
import streamlit as st
import pandas as pd
from typing import List
from utils.color_logic import determine_row_color, get_color_styles, is_field_aliased
from utils.formatters import format_value, format_field_name
from components.alias_actions import show_add_alias_dialog, show_drop_alias_dialog


def render_table_with_actions(
    file_idx: int,
    allocation_idx: int,
    normalized_fields: List,
    validation,
    aliases: List
):
    """
    Render field comparison table with inline action buttons.

    Args:
        file_idx: File index for unique keys
        allocation_idx: Allocation index
        normalized_fields: List of NormalizedFieldResult objects
        validation: AllocationValidation object
        aliases: List of Alias objects for this allocation
    """
    # Build table data
    table_data = []

    for field in normalized_fields:
        field_name = field.field_name
        term_value = field.confirmation_row
        booking_value = field.booking_row

        # Determine row color
        color = determine_row_color(
            field_name=field_name,
            confirmation_value=term_value,
            booking_value=booking_value,
            validation=validation,
            aliases=aliases
        )

        # Check if field has alias applied
        aliased = is_field_aliased(field_name, aliases)
        comment = ""

        if aliased:
            # Find the alias for this field
            for alias in aliases:
                if alias.used and field_name in alias.on_field:
                    comment = f"🔄 Alias: {alias.source_name} → {alias.target_name}"
                    break

        # Format values for display
        term_display = format_value(term_value)
        booking_display = format_value(booking_value)
        field_display = format_field_name(field_name)

        table_data.append({
            "Field": field_display,
            "Term Sheet": term_display,
            "Booking Data": booking_display,
            "Comment": comment,
            "_color": color,
            "_field_name": field_name,  # Keep original for API calls
            "_term_value": term_value,
            "_booking_value": booking_value,
            "_aliased": aliased
        })

    # Create DataFrame
    df = pd.DataFrame(table_data)

    # Display table with action buttons inline
    if not df.empty:
        # Create two-column layout: table (85%) and actions (15%)
        table_col, actions_col = st.columns([85, 15])

        with table_col:
            # Apply row-level styling
            def style_row(row):
                color_styles = get_color_styles(row["_color"])
                bg_color = color_styles["background"]
                text_color = color_styles["text"]
                return [
                    f"background-color: {bg_color}; color: {text_color};" if col not in ["_color", "_field_name", "_term_value", "_booking_value", "_aliased"]
                    else ""
                    for col in row.index
                ]

            # Style the dataframe
            styled_df = df.style.apply(style_row, axis=1)

            # Display only visible columns
            visible_columns = ["Field", "Term Sheet", "Booking Data", "Comment"]
            st.dataframe(
                styled_df,
                column_config={
                    "Field": st.column_config.TextColumn("Field", width="medium"),
                    "Term Sheet": st.column_config.TextColumn("Term Sheet", width="medium"),
                    "Booking Data": st.column_config.TextColumn("Booking Data", width="medium"),
                    "Comment": st.column_config.TextColumn("Comment", width="large"),
                },
                hide_index=True,
                use_container_width=True,
                column_order=visible_columns
            )

        with actions_col:
            # Add top margin to align with table rows (accounting for header)
            st.markdown("<div style='height: 38px;'></div>", unsafe_allow_html=True)

            # Render action buttons vertically aligned with table rows
            for idx, row in enumerate(table_data):
                field_name = row["_field_name"]
                color = row["_color"]
                aliased = row["_aliased"]

                # Container with fixed height matching table row height
                with st.container():
                    # Show Add Alias button for red rows
                    if color == "red":
                        button_key = f"add_alias_{file_idx}_{allocation_idx}_{field_name}"
                        if st.button(
                            "➕ Add",
                            key=button_key,
                            use_container_width=True,
                            help=f"Add alias for {row['Field']}"
                        ):
                            show_add_alias_dialog(
                                field_name=field_name,
                                term_value=row["_term_value"],
                                booking_value=row["_booking_value"],
                                file_idx=file_idx,
                                allocation_idx=allocation_idx
                            )

                    # Show Drop Alias button for yellow rows
                    elif color == "yellow" and aliased:
                        # Find the alias object
                        alias_obj = None
                        for alias in aliases:
                            if alias.used and field_name in alias.on_field:
                                alias_obj = alias
                                break

                        if alias_obj:
                            button_key = f"drop_alias_{file_idx}_{allocation_idx}_{field_name}"
                            if st.button(
                                "➖ Drop",
                                key=button_key,
                                use_container_width=True,
                                help=f"Drop alias for {row['Field']}"
                            ):
                                show_drop_alias_dialog(
                                    alias=alias_obj,
                                    field_name=field_name,
                                    file_idx=file_idx,
                                    allocation_idx=allocation_idx
                                )
                    else:
                        # Empty placeholder for green rows to maintain alignment
                        st.markdown("<div style='height: 38px;'></div>", unsafe_allow_html=True)
    else:
        st.info("No fields to display for this allocation.")
