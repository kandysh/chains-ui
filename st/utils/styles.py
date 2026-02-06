"""CSS injection utility for Streamlit app."""
import streamlit as st
from pathlib import Path


def inject_custom_css():
    """Inject custom CSS into the Streamlit app."""
    css_file = Path(__file__).parent.parent / "assets" / "styles.css"
    if css_file.exists():
        with open(css_file) as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
