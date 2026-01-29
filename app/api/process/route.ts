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

    // Mock processing logic - replace with your actual backend processing
    const mockResult = {
      booking_filename: 'booking.pdf',
      files: Array(5).fill(
        {
          filename: 'confirmation.pdf',
          text_excerpt: `Sample text excerpt from the processed file showing key swap details and confirmation information that was extracted and processed.`,
          unmatched_values: {
            'swap_type': ['XCS', 'OIS'],
            'counterparty': ['Unknown Bank'],
          },
          validation_status: {
            'strike date': true,
            'expiry date': true,
            'direction': true,
            'index': true,
            'spread': true,
            'swap ccy': true,
            'benchmark': false,
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
              counterparty: 'Bank B',
              units: 50000000,
              expiry_date: '2026-01-15',
              early_termination_party_a: false,
              benchmark: 'SOFR+50bps',
              spread: 0.005,
              lookback: '5Y',
              bf: 2.5,
            },
            {
              strike_date: '2024-02-01',
              trade_date: '2024-01-25',
              direction: 'short',
              swap_type: 'IRS',
              index: 'EURIBOR',
              party_a: 'Bank A',
              swap_ccy: 'EUR',
              counterparty: 'Bank C',
              units: 75000000,
              expiry_date: '2027-02-01',
              early_termination_party_a: true,
              benchmark: 'EURIBOR+25bps',
              spread: 0.0025,
              lookback: '10Y',
              bf: 3.2,
            },
          ],
          booking_matches_rows: [
            {
              sivcom: 1001,
              counterparty: 'Bank B',
              units: 50000000,
              index: 'SOFR',
              swap_ccy: 'USD',
              spread: 0.005,
              breakability: 'Bilateral',
              strike_date: '2024-01-15',
              expiry_date: '2026-01-15',
              direction: 'long',
            },
            {
              sivcom: 1002,
              counterparty: 'Bank C',
              units: 75000000,
              index: 'EURIBOR',
              swap_ccy: 'EUR',
              spread: 0.0025,
              breakability: 'Unilateral',
              strike_date: '2024-02-01',
              expiry_date: '2027-02-01',
              direction: 'short',
            },
          ],
          unknown_fields: ['custom_field_1', 'internal_reference'],
          canonical_fields: [
            'strike_date',
            'trade_date',
            'direction',
            'swap_type',
            'index',
            'party_a',
            'swap_ccy',
            'counterparty',
            'units',
            'expiry_date',
            'early_termination_party_a',
            'benchmark',
            'spread',
          ],
          aliases_used: [
            {
              source_name: 'strike_date_original',
              target_name: 'strike_date',
              used: true,
              count: 2,
              source: 'provided',
              on_field: ['strike_date'],
            },
            {
              source_name: 'party_counterparty',
              target_name: 'counterparty',
              used: true,
              count: 2,
              source: 'infered',
              on_field: ['counterparty'],
            },
            {
              source_name: 'currency',
              target_name: 'swap_ccy',
              used: true,
              count: 2,
              source: 'provided',
              on_field: ['swap_ccy'],
            },
            {
              source_name: 'notional',
              target_name: 'units',
              used: false,
              count: 0,
              source: 'infered',
              on_field: [],
            },
          ],
        },
      ),
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
