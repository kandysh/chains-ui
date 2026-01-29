import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // const formData = await request.formData()
    // const bookingFile = formData.get('booking_file') as File | null
    // const confirmationFiles = formData.getAll('confirmation_files') as File[]

    // if (!bookingFile && confirmationFiles.length === 0) {
    //   return NextResponse.json(
    //     { error: 'No files provided' },
    //     { status: 400 }
    //   )
    // }

    // Mock processing logic - different file types to test UI states
    const mockResult = {
      booking_filename: 'booking_master.xlsx',
      files: [
        // File 1: All validations passing, good matches
        {
          filename: 'confirmation_clean_001.pdf',
          text_excerpt: `SWAP CONFIRMATION
Date: 2024-01-15
Effective Date: 2024-01-15
Termination Date: 2026-01-15
Direction: Long
Notional: USD 50,000,000
Index: SOFR
Spread: 50bps
Benchmark: SOFR+50bps`,
          unmatched_values: {},
          validation_status: {
            'strike date': true,
            'expiry date': true,
            'direction': true,
            'index': true,
            'spread': true,
            'swap ccy': true,
            'benchmark': true,
            'counterparty': true,
            'units': true,
            'breakbility': true,
          },
          confirmation_rows: [
            {
              strike_date: '2024-01-15',
              trade_date: '2024-01-10',
              direction: 'long',
              swap_type: 'IRS',
              index: 'SOFR',
              party_a: 'Bank A',
              swap_ccy: 'USD',
              counterparty: 'JPM',
              units: 50000000,
              expiry_date: '2026-01-15',
              early_termination_party_a: false,
              benchmark: 'SOFR+50bps',
              spread: 0.005,
            },
          ],
          booking_matches_rows: [
            {
              sivcom: 1001,
              counterparty: 'JPMorgan Chase',
              units: 50000000,
              index: 'SOFR',
              swap_ccy: 'USD',
              spread: 0.005,
              breakability: 'Bilateral',
              strike_date: '2024-01-15',
              expiry_date: '2026-01-15',
              direction: 'long',
            },
          ],
          unknown_fields: [],
          canonical_fields: ['strike_date', 'trade_date', 'direction', 'swap_type', 'index', 'party_a', 'swap_ccy', 'counterparty', 'units', 'expiry_date', 'early_termination_party_a', 'benchmark', 'spread'],
          aliases_used: [
            {
              source_name: 'JPM',
              target_name: 'JPMorgan Chase',
              used: true,
              count: 1,
              source: 'provided',
              on_field: ['counterparty'],
            },
          ],
        },

        // File 2: Multiple validation failures (red alerts)
        {
          filename: 'confirmation_issues_002.pdf',
          text_excerpt: `SWAP CONFIRMATION
Trade Ref: SWP-2024-002
Party A: Bank A
Party B: Morgan Stanley
Notional: EUR 75,000,000
Start: Q2 2024
End: Q2 2027
Terms: Complex with early termination
Index: Unknown (Missing)
Counterparty: Unconfirmed
Trade Direction: Not specified`,
          unmatched_values: {
            'index': ['UNDEFINED', 'N/A'],
            'direction': ['Not Specified', ''],
            'benchmark': ['Custom Index', 'Proprietary Rate'],
          },
          validation_status: {
            'strike date': true,
            'expiry date': true,
            'direction': false,
            'index': false,
            'spread': false,
            'swap ccy': true,
            'benchmark': false,
            'counterparty': false,
            'units': true,
            'breakbility': false,
          },
          confirmation_rows: [
            {
              strike_date: '2024-04-01',
              trade_date: '2024-03-28',
              direction: null,
              swap_type: 'OIS',
              index: null,
              party_a: 'Bank A',
              swap_ccy: 'EUR',
              counterparty: 'Morgan Stanley',
              units: 75000000,
              expiry_date: '2027-04-01',
              early_termination_party_a: true,
              benchmark: null,
              spread: null,
            },
          ],
          booking_matches_rows: [],
          unknown_fields: ['trade_ref', 'terms_description', 'custom_field_xyz'],
          canonical_fields: ['strike_date', 'trade_date', 'direction', 'swap_type', 'index', 'party_a', 'swap_ccy', 'counterparty', 'units', 'expiry_date', 'early_termination_party_a', 'benchmark', 'spread'],
          aliases_used: [
            {
              source_name: 'Morgan Stanley International',
              target_name: 'Morgan Stanley',
              used: true,
              count: 1,
              source: 'infered',
              on_field: ['counterparty'],
            },
            {
              source_name: 'Q2 2024',
              target_name: '2024-04-01',
              used: true,
              count: 1,
              source: 'infered',
              on_field: ['strike_date'],
            },
            {
              source_name: 'Q2 2027',
              target_name: '2027-04-01',
              used: true,
              count: 1,
              source: 'infered',
              on_field: ['expiry_date'],
            },
          ],
        },

        // File 3: Many unmatched values (orange warnings)
        {
          filename: 'confirmation_unmatched_003.pdf',
          text_excerpt: `SWAP CONFIRMATION REPORT
Reference: CNFRM-2024-003-XYZ
Participant 1: Bank of America
Participant 2: Goldman Sachs
Amount: GBP 100,000,000
Period Start: 01-JAN-2024
Period End: 01-JAN-2027
Rate Basis: 3M SONIA
Adjustment: +75 basis points
Termination Rights: Mutual
Settlement Method: Physical Delivery
Documentation Version: ISDA 2002`,
          unmatched_values: {
            'counterparty': ['Goldman Sachs', 'GS Trading', 'Goldman Sachs International'],
            'swap_ccy': ['GBP', '£'],
            'spread': ['75bps', '0.0075', '75 basis points'],
            'swap_type': ['Fixed/Floating', 'IRS Fixed Float'],
          },
          validation_status: {
            'strike date': true,
            'expiry date': true,
            'direction': true,
            'index': true,
            'spread': true,
            'swap ccy': true,
            'benchmark': true,
            'counterparty': true,
            'units': true,
            'breakbility': true,
          },
          confirmation_rows: [
            {
              strike_date: '2024-01-01',
              trade_date: '2023-12-28',
              direction: 'short',
              swap_type: 'IRS',
              index: 'SONIA',
              party_a: 'Bank of America',
              swap_ccy: '£',
              counterparty: 'GS Trading',
              units: 100000000,
              expiry_date: '2027-01-01',
              early_termination_party_a: true,
              benchmark: 'SONIA+75bps',
              spread: '75bps',
            },
            {
              strike_date: '2024-01-01',
              trade_date: '2023-12-28',
              direction: 'short',
              swap_type: 'IRS',
              index: 'SONIA',
              party_a: 'Bank of America',
              swap_ccy: '£',
              counterparty: 'Goldman Sachs International',
              units: 100000000,
              expiry_date: '2027-01-01',
              early_termination_party_a: true,
              benchmark: 'SONIA+75bps',
              spread: '75 basis points',
            },
          ],
          booking_matches_rows: [
            {
              sivcom: 2001,
              counterparty: 'Goldman Sachs',
              units: 100000000,
              index: 'SONIA',
              swap_ccy: 'GBP',
              spread: 0.0075,
              breakability: 'Mutual',
              strike_date: '2024-01-01',
              expiry_date: '2027-01-01',
              direction: 'short',
            },
          ],
          unknown_fields: ['reference', 'period_start', 'period_end', 'settlement_method', 'documentation_version'],
          canonical_fields: ['strike_date', 'trade_date', 'direction', 'swap_type', 'index', 'party_a', 'swap_ccy', 'counterparty', 'units', 'expiry_date', 'early_termination_party_a', 'benchmark', 'spread'],
          aliases_used: [
            {
              source_name: 'GS Trading',
              target_name: 'Goldman Sachs',
              used: true,
              count: 1,
              source: 'infered',
              on_field: ['counterparty'],
            },
            {
              source_name: 'Goldman Sachs International',
              target_name: 'Goldman Sachs',
              used: false,
              count: 0,
              source: 'infered',
              on_field: ['counterparty'],
            },
            {
              source_name: '£',
              target_name: 'GBP',
              used: true,
              count: 1,
              source: 'provided',
              on_field: ['swap_ccy'],
            },
            {
              source_name: '75bps',
              target_name: '0.0075',
              used: true,
              count: 1,
              source: 'infered',
              on_field: ['spread'],
            },
            {
              source_name: '75 basis points',
              target_name: '0.0075',
              used: false,
              count: 0,
              source: 'infered',
              on_field: ['spread'],
            },
          ],
        },

        // File 4: Clean with provided aliases
        {
          filename: 'confirmation_trusted_004.pdf',
          text_excerpt: `INTERNATIONAL SWAP CONFIRMATION
Trade Date: 15-FEB-2024
Effective Date: 15-FEB-2024
Maturity Date: 15-FEB-2027
Fixed Leg: 1.85% USD Annually
Floating Leg: SOFR + 20bp
Notional: USD 25,000,000
Counterparty: Credit Suisse
Status: CONFIRMED`,
          unmatched_values: {},
          validation_status: {
            'strike date': true,
            'expiry date': true,
            'direction': true,
            'index': true,
            'spread': true,
            'swap ccy': true,
            'benchmark': true,
            'counterparty': true,
            'units': true,
            'breakbility': true,
          },
          confirmation_rows: [
            {
              strike_date: '2024-02-15',
              trade_date: '2024-02-15',
              direction: 'long',
              swap_type: 'IRS',
              index: 'SOFR',
              party_a: 'Bank A',
              swap_ccy: 'USD',
              counterparty: 'Credit Suisse (CS)',
              units: 25000000,
              expiry_date: '2027-02-15',
              early_termination_party_a: false,
              benchmark: 'SOFR+20bps',
              spread: '20bp',
            },
          ],
          booking_matches_rows: [
            {
              sivcom: 3001,
              counterparty: 'Credit Suisse',
              units: 25000000,
              index: 'SOFR',
              swap_ccy: 'USD',
              spread: 0.002,
              breakability: 'Non-Bilateral',
              strike_date: '2024-02-15',
              expiry_date: '2027-02-15',
              direction: 'long',
            },
          ],
          unknown_fields: [],
          canonical_fields: ['strike_date', 'trade_date', 'direction', 'swap_type', 'index', 'party_a', 'swap_ccy', 'counterparty', 'units', 'expiry_date', 'early_termination_party_a', 'benchmark', 'spread'],
          aliases_used: [
            {
              source_name: 'Credit Suisse (CS)',
              target_name: 'Credit Suisse',
              used: true,
              count: 1,
              source: 'provided',
              on_field: ['counterparty'],
            },
            {
              source_name: '20bp',
              target_name: '0.002',
              used: true,
              count: 1,
              source: 'provided',
              on_field: ['spread'],
            },
          ],
        },

        // File 5: Mixed scenario with some issues and multiple aliases
        {
          filename: 'confirmation_complex_005.pdf',
          text_excerpt: `COMPLEX SWAP AGREEMENT
Reference No: SWAP/2024/005
Client: Bank of Tokyo
Broker: ICAP
Principal: JPY 5,000,000,000
Transaction Start: 20-MAR-2024
Transaction Maturity: 20-MAR-2034
Fixed Rate: 1.25% per annum
Floating Reference: 3M TONA
Spread Adjustment: +35bp
Break Options: Available quarterly after year 2
Counterparty Details: Westpac Banking Corporation
Currency: JPY
Trade Type: Interest Rate Swap (10Y)`,
          unmatched_values: {
            'index': ['3M TONA', 'TONA', 'Tokyo Overnight Average'],
            'counterparty': ['Westpac', 'Westpac Banking Corporation', 'WBC'],
          },
          validation_status: {
            'strike date': true,
            'expiry date': true,
            'direction': true,
            'index': true,
            'spread': true,
            'swap ccy': true,
            'benchmark': true,
            'counterparty': true,
            'units': true,
            'breakbility': false,
          },
          confirmation_rows: [
            {
              strike_date: '2024-03-20',
              trade_date: '2024-03-18',
              direction: 'long',
              swap_type: 'IRS',
              index: 'TONA',
              party_a: 'Bank of Tokyo',
              swap_ccy: 'JPY',
              counterparty: 'Westpac',
              units: 5000000000,
              expiry_date: '2034-03-20',
              early_termination_party_a: true,
              benchmark: 'TONA+35bps',
              spread: 0.0035,
            },
          ],
          booking_matches_rows: [
            {
              sivcom: 4001,
              counterparty: 'Westpac Banking Corporation',
              units: 5000000000,
              index: 'TONA',
              swap_ccy: 'JPY',
              spread: 0.0035,
              breakability: null,
              strike_date: '2024-03-20',
              expiry_date: '2034-03-20',
              direction: 'long',
            },
          ],
          unknown_fields: ['reference_no', 'broker', 'break_options', 'fixed_rate'],
          canonical_fields: ['strike_date', 'trade_date', 'direction', 'swap_type', 'index', 'party_a', 'swap_ccy', 'counterparty', 'units', 'expiry_date', 'early_termination_party_a', 'benchmark', 'spread'],
          aliases_used: [
            {
              source_name: '3M TONA',
              target_name: 'TONA',
              used: true,
              count: 1,
              source: 'infered',
              on_field: ['index'],
            },
            {
              source_name: 'Westpac',
              target_name: 'Westpac Banking Corporation',
              used: true,
              count: 1,
              source: 'infered',
              on_field: ['counterparty'],
            },
            {
              source_name: 'WBC',
              target_name: 'Westpac Banking Corporation',
              used: false,
              count: 0,
              source: 'infered',
              on_field: ['counterparty'],
            },
            {
              source_name: '35bp',
              target_name: '0.0035',
              used: true,
              count: 1,
              source: 'infered',
              on_field: ['spread'],
            },
          ],
        },

        // File 6: Perfect Green Scenario - No aliases, no issues
        {
          filename: 'confirmation_perfect_006.pdf',
          text_excerpt: `STANDARD SWAP CONFIRMATION
Effective Date: 15-MAY-2024
Maturity Date: 15-MAY-2025
Strike Date: 15-MAY-2024
Expiry Date: 15-MAY-2025
Direction: Long
Swap Currency: AUD
Swap Type: Interest Rate Swap
Index: BBSW
Counterparty: Macquarie Bank
Units: 10,000,000
Spread: 25 basis points
Benchmark: BBSW+25bps
Breakability: Non-Bilateral
Status: PERFECT MATCH`,
          unmatched_values: {},
          validation_status: {
            'strike date': true,
            'expiry date': true,
            'direction': true,
            'index': true,
            'spread': true,
            'swap ccy': true,
            'benchmark': true,
            'counterparty': true,
            'units': true,
            'breakbility': true,
          },
          confirmation_rows: [
            {
              strike_date: '2024-05-15',
              trade_date: '2024-05-13',
              direction: 'long',
              swap_type: 'IRS',
              index: 'BBSW',
              party_a: 'Local Bank',
              swap_ccy: 'AUD',
              counterparty: 'Macquarie Bank',
              units: 10000000,
              expiry_date: '2025-05-15',
              early_termination_party_a: false,
              benchmark: 'BBSW+25bps',
              spread: 0.0025,
            },
          ],
          booking_matches_rows: [
            {
              sivcom: 5001,
              counterparty: 'Macquarie Bank',
              units: 10000000,
              index: 'BBSW',
              swap_ccy: 'AUD',
              spread: 0.0025,
              breakability: 'Non-Bilateral',
              strike_date: '2024-05-15',
              expiry_date: '2025-05-15',
              direction: 'long',
            },
          ],
          unknown_fields: [],
          canonical_fields: ['strike_date', 'trade_date', 'direction', 'swap_type', 'index', 'party_a', 'swap_ccy', 'counterparty', 'units', 'expiry_date', 'early_termination_party_a', 'benchmark', 'spread'],
          aliases_used: [],
        },
      ],
    }

    return NextResponse.json(mockResult)
  } catch (error) {
    console.error('Processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process files' },
      { status: 500 }
    )
  }
}
