"""Session state management for Streamlit."""
import streamlit as st
from typing import List, Optional


def initialize_session_state():
    """Initialize session state with default values."""
    if "booking_file" not in st.session_state:
        st.session_state.booking_file = None

    if "confirmation_files" not in st.session_state:
        st.session_state.confirmation_files = []

    if "process_results" not in st.session_state:
        st.session_state.process_results = None

    if "processing" not in st.session_state:
        st.session_state.processing = False

    if "error_message" not in st.session_state:
        st.session_state.error_message = None


def set_booking_file(file):
    """Store uploaded booking file."""
    st.session_state.booking_file = file


def set_confirmation_files(files: List):
    """Store uploaded confirmation files."""
    st.session_state.confirmation_files = files


def set_results(results: List):
    """Store processing results."""
    st.session_state.process_results = results
    st.session_state.error_message = None


def set_error(error: str):
    """Store error message."""
    st.session_state.error_message = error
    st.session_state.process_results = None


def clear_results():
    """Clear all results and reset state."""
    st.session_state.process_results = None
    st.session_state.error_message = None
    st.session_state.processing = False


def clear_all():
    """Clear all state including uploaded files."""
    st.session_state.booking_file = None
    st.session_state.confirmation_files = []
    clear_results()


def can_process() -> bool:
    """Check if files are ready for processing."""
    return (
        st.session_state.booking_file is not None
        and len(st.session_state.confirmation_files) > 0
    )


def set_processing(processing: bool):
    """Set processing flag."""
    st.session_state.processing = processing
