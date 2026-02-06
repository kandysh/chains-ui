"""Alias management dialogs and actions."""
import streamlit as st
from services.api_client import add_alias, delete_alias


@st.dialog("Add Alias Mapping")
def show_add_alias_dialog(field_name: str, term_value: str, booking_value: str, file_idx: int, allocation_idx: int):
    """
    Show dialog to add a new alias mapping.

    Args:
        field_name: The field this alias applies to
        term_value: Value from term sheet (confirmation)
        booking_value: Value from booking data
        file_idx: File index for unique keys
        allocation_idx: Allocation index for unique keys
    """
    st.markdown(f"### Create alias for field: **{field_name}**")

    st.markdown("**Mapping:**")
    col1, col2, col3 = st.columns([2, 1, 2])
    with col1:
        st.code(str(term_value), language=None)
    with col2:
        st.markdown("<div style='text-align: center; padding-top: 10px;'>→</div>", unsafe_allow_html=True)
    with col3:
        st.code(str(booking_value), language=None)

    st.markdown("---")

    # Level selection
    level = st.radio(
        "Alias Level",
        options=["Global", "Counterparty"],
        index=0,
        help="Global: applies to all files. Counterparty: applies only to this counterparty.",
        key=f"alias_level_{file_idx}_{allocation_idx}_{field_name}"
    )

    st.markdown("---")

    col1, col2 = st.columns(2)

    with col1:
        if st.button("❌ Cancel", use_container_width=True, key=f"cancel_alias_{file_idx}_{allocation_idx}_{field_name}"):
            st.rerun()

    with col2:
        if st.button("✅ Add Alias", type="primary", use_container_width=True, key=f"confirm_alias_{file_idx}_{allocation_idx}_{field_name}"):
            try:
                add_alias(
                    source=str(term_value),
                    target=str(booking_value),
                    field=field_name,
                    level=level.lower()
                )
                st.success("✅ Alias added successfully! Click **Process Files** to see updated results.")
                st.balloons()
            except Exception as e:
                st.error(f"❌ Error adding alias: {str(e)}")


@st.dialog("Drop Alias Mapping")
def show_drop_alias_dialog(alias, field_name: str, file_idx: int, allocation_idx: int):
    """
    Show dialog to drop an existing alias mapping.

    Args:
        alias: The Alias object to drop
        field_name: The field name
        file_idx: File index for unique keys
        allocation_idx: Allocation index for unique keys
    """
    st.markdown(f"### Remove alias for field: **{field_name}**")

    st.markdown("**Current Mapping:**")
    col1, col2, col3 = st.columns([2, 1, 2])
    with col1:
        st.code(alias.source_name, language=None)
    with col2:
        st.markdown("<div style='text-align: center; padding-top: 10px;'>→</div>", unsafe_allow_html=True)
    with col3:
        st.code(alias.target_name, language=None)

    st.warning("⚠️ This will remove the alias mapping. You'll need to reprocess files to see the changes.")

    st.markdown("---")

    col1, col2 = st.columns(2)

    with col1:
        if st.button("❌ Cancel", use_container_width=True, key=f"cancel_drop_{file_idx}_{allocation_idx}_{field_name}"):
            st.rerun()

    with col2:
        if st.button("🗑️ Drop Alias", type="primary", use_container_width=True, key=f"confirm_drop_{file_idx}_{allocation_idx}_{field_name}"):
            try:
                # Determine level from alias data if available
                level = "global"  # Default, could be extended to store level in alias

                delete_alias(
                    source=alias.source_name,
                    target=alias.target_name,
                    field=field_name,
                    level=level
                )
                st.success("✅ Alias dropped successfully! Click **Process Files** to see updated results.")
            except Exception as e:
                st.error(f"❌ Error dropping alias: {str(e)}")
