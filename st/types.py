from pydantic import BaseModel
from typing import List, Any, Optional

class BaseAllocation(BaseModel):
    strike_date: Optional[str] = None
    trade_date: Optional[str] = None
    direction: Optional[str] = None  # "long" or "short"
    swap_type: Optional[str] = None
    index: Optional[str] = None
    party_a: Optional[str] = None
    swap_ccy: Optional[str] = None
    counterparty: Optional[str] = None
    units: Optional[float] = None
    expiry_date: Optional[str] = None
    benchmark: Optional[str] = None
    spread: Optional[float] = None

class BookingFileData(BaseModel):
    sivcom: Optional[int] = None
    counterparty: Optional[str] = None
    units: Optional[float] = None
    index: Optional[str] = None
    swap_ccy: Optional[str] = None
    spread: Optional[float] = None
    breakability: Optional[str] = None
    strike_date: Optional[str] = None
    expiry_date: Optional[str] = None
    direction: Optional[str] = None

class Alias(BaseModel):
    source_name: str
    target_name: str
    used: bool
    count: int
    on_field: List[str]

class NormalizedFieldResult(BaseModel):
    field_name: str
    confirmation_row: Any #primitive values only alos None
    booking_row: Any #primitive values only also None

class AllocationValidation(BaseModel):
    field_name: str
    units: bool
    strike_date: bool
    expiry_date: bool
    direction: bool
    index: bool
    spread: bool
    settlement_currency: bool
    benchmark: bool
    counterparty: bool
    breakability: bool
    break_fee: bool
    lookback: bool
    notional_amount: bool
    strike_price: bool

class FileProcessResult(BaseModel):
    filename: str
    text_excerpt: str
    validation_status: List[AllocationValidation]
    confirmation_rows: List[BaseAllocation]
    booking_matches_rows: List[BookingFileData]
    aliases_used: List[List[Alias]]
    normalized: List[List[NormalizedFieldResult]]

class ProcessResponse(BaseModel):
    booking_filename: str
    files: List[str]
