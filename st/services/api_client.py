"""API client for backend communication."""
import requests
from typing import List
from config import API_PROCESS_ENDPOINT, API_ALIAS_ADD_ENDPOINT, API_ALIAS_DROP_ENDPOINT, API_TIMEOUT
from types import FileProcessResult


def process_files(booking_file, confirmation_files: List) -> List[FileProcessResult]:
    """
    Process booking file and confirmation PDFs via backend API.

    Args:
        booking_file: Streamlit UploadedFile object for booking Excel
        confirmation_files: List of Streamlit UploadedFile objects for PDFs

    Returns:
        List[FileProcessResult]: Parsed results from API

    Raises:
        ConnectionError: If cannot connect to backend
        requests.Timeout: If request times out
        requests.HTTPError: If API returns error status
        Exception: For other errors
    """
    try:
        # Prepare multipart form data
        files = []

        # Add booking file
        booking_file.seek(0)  # Reset file pointer
        files.append(
            ("booking_file", (booking_file.name, booking_file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
        )

        # Add confirmation files
        for conf_file in confirmation_files:
            conf_file.seek(0)  # Reset file pointer
            files.append(
                ("confirmation_files", (conf_file.name, conf_file, "application/pdf"))
            )

        # Make POST request
        response = requests.post(
            API_PROCESS_ENDPOINT,
            files=files,
            timeout=API_TIMEOUT
        )

        # Check for HTTP errors
        response.raise_for_status()

        # Parse JSON response
        data = response.json()

        # Convert to Pydantic models
        if isinstance(data, dict) and "files" in data:
            # Response is ProcessResponse format
            results = [FileProcessResult(**file_data) for file_data in data.get("results", [])]
        elif isinstance(data, list):
            # Response is direct list of FileProcessResult
            results = [FileProcessResult(**item) for item in data]
        else:
            raise ValueError(f"Unexpected response format: {type(data)}")

        return results

    except requests.ConnectionError as e:
        raise ConnectionError(f"Cannot connect to backend API at {API_PROCESS_ENDPOINT}. Is the server running?") from e
    except requests.Timeout as e:
        raise requests.Timeout(f"Request timed out after {API_TIMEOUT} seconds") from e
    except requests.HTTPError as e:
        raise requests.HTTPError(f"API returned error: {e.response.status_code} - {e.response.text}") from e
    except Exception as e:
        raise Exception(f"Error processing files: {str(e)}") from e


def add_alias(source: str, target: str, field: str, level: str) -> bool:
    """
    Add a new alias mapping.

    Args:
        source: Source value to map from
        target: Target value to map to
        field: Field name this alias applies to
        level: "global" or "counterparty"

    Returns:
        bool: True if successful

    Raises:
        Exception: If API call fails
    """
    try:
        payload = {
            "source_name": source,
            "target_name": target,
            "on_field": field,
            "level": level.lower()
        }

        response = requests.post(
            API_ALIAS_ADD_ENDPOINT,
            json=payload,
            timeout=30
        )

        response.raise_for_status()
        return True

    except Exception as e:
        raise Exception(f"Error adding alias: {str(e)}") from e


def delete_alias(source: str, target: str, field: str, level: str) -> bool:
    """
    Delete an existing alias mapping.

    Args:
        source: Source value
        target: Target value
        field: Field name
        level: "global" or "counterparty"

    Returns:
        bool: True if successful

    Raises:
        Exception: If API call fails
    """
    try:
        payload = {
            "source_name": source,
            "target_name": target,
            "on_field": field,
            "level": level.lower()
        }

        # Try DELETE first, fallback to POST if endpoint expects that
        response = requests.delete(
            API_ALIAS_DROP_ENDPOINT,
            json=payload,
            timeout=30
        )

        response.raise_for_status()
        return True

    except Exception as e:
        raise Exception(f"Error deleting alias: {str(e)}") from e
