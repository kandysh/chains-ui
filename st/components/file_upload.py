"""File upload widgets."""
import streamlit as st
from typing import List, Optional
from config import ALLOWED_BOOKING_EXTENSIONS, ALLOWED_CONFIRMATION_EXTENSIONS


def render_booking_file_uploader() -> Optional[any]:
    """
    Render booking file uploader widget.

    Returns:
        UploadedFile or None if no file uploaded
    """
    st.markdown("**📊 Booking File (Excel)**")
    uploaded_file = st.file_uploader(
        "Upload booking Excel file",
        type=ALLOWED_BOOKING_EXTENSIONS,
        accept_multiple_files=False,
        key="booking_uploader",
        help="Upload the Excel file containing booking data"
    )

    if uploaded_file:
        # Display file info
        file_size = len(uploaded_file.getvalue()) / 1024  # KB
        st.success(f"✅ **{uploaded_file.name}** ({file_size:.1f} KB)")

    return uploaded_file


def render_confirmation_files_uploader() -> List[any]:
    """
    Render confirmation files uploader widget.

    Returns:
        List of UploadedFile objects (empty list if none uploaded)
    """
    st.markdown("**📄 Confirmation Files (PDFs)**")
    uploaded_files = st.file_uploader(
        "Upload confirmation PDF files",
        type=ALLOWED_CONFIRMATION_EXTENSIONS,
        accept_multiple_files=True,
        key="confirmation_uploader",
        help="Upload one or more PDF confirmation files"
    )

    if uploaded_files:
        # Display file count and names
        st.success(f"✅ **{len(uploaded_files)} file(s)** uploaded")

        # Show list of filenames in expander
        with st.expander("📋 View uploaded files", expanded=False):
            for idx, file in enumerate(uploaded_files, 1):
                file_size = len(file.getvalue()) / 1024  # KB
                st.write(f"{idx}. **{file.name}** ({file_size:.1f} KB)")

    return uploaded_files if uploaded_files else []
