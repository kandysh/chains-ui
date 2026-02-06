"""Main Streamlit application for Swap Confirmation Processing."""
import streamlit as st
from config import PAGE_TITLE, PAGE_ICON, PAGE_LAYOUT
from services.state_manager import (
    initialize_session_state,
    set_booking_file,
    set_confirmation_files,
    set_results,
    set_error,
    can_process
)
from services.api_client import process_files
from components.file_upload import (
    render_booking_file_uploader,
    render_confirmation_files_uploader
)
from components.results_display import render_results_view

# Page configuration
st.set_page_config(
    page_title=PAGE_TITLE,
    layout=PAGE_LAYOUT,
    page_icon=PAGE_ICON
)

# Initialize session state
initialize_session_state()

# Header
st.title(f"{PAGE_ICON} {PAGE_TITLE}")
st.markdown("Upload booking file and confirmation PDFs to validate and match trades")

st.markdown("---")

# Upload Section
st.header("1️⃣ Upload Files")

col1, col2 = st.columns(2)

with col1:
    booking_file = render_booking_file_uploader()
    if booking_file:
        set_booking_file(booking_file)

with col2:
    confirmation_files = render_confirmation_files_uploader()
    if confirmation_files:
        set_confirmation_files(confirmation_files)

st.markdown("---")

# Process Button Section
st.header("2️⃣ Process Files")

process_button_disabled = not can_process()

if process_button_disabled:
    st.info("ℹ️ Please upload both a booking file and at least one confirmation file to proceed.")

if st.button(
    "🚀 Process Files",
    disabled=process_button_disabled,
    type="primary",
    use_container_width=True
):
    with st.spinner("Processing files... This may take a few moments."):
        try:
            # Call API to process files
            results = process_files(
                st.session_state.booking_file,
                st.session_state.confirmation_files
            )

            # Store results
            set_results(results)

            # Show success message
            st.success(f"✅ Successfully processed {len(results)} file(s)!")

        except ConnectionError as e:
            st.error(f"🔌 **Connection Error**: {str(e)}")
            st.info("💡 Make sure the backend server is running at http://localhost:8000")
            set_error(str(e))

        except Exception as e:
            st.error(f"❌ **Error**: {str(e)}")
            set_error(str(e))

st.markdown("---")

# Results Section
if st.session_state.process_results:
    st.header("3️⃣ Results")
    render_results_view(st.session_state.process_results)

    # Add a divider and helpful info
    st.markdown("---")
    st.info("""
    **📖 How to read the results:**
    - 🟢 **Green rows**: Values match and validation passed
    - 🟡 **Yellow rows**: Alias transformation was applied
    - 🔴 **Red rows**: Values don't match or validation failed

    **🔧 Actions:**
    - Click **Add Alias** on red rows to create a mapping
    - Click **Drop Alias** on yellow rows to remove a mapping
    - After making changes, click **Process Files** again to see updated results
    """)

# Footer
st.markdown("---")
st.markdown(
    "<div style='text-align: center; color: gray;'>"
    "Swap Confirmation Processing UI | Built with Streamlit"
    "</div>",
    unsafe_allow_html=True
)
