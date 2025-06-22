import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      lastName,
      firstName,
      email,
      size,
      selectedOption,
      zip,
      address,
      address2,
      phone,
      totalAmount,
    } = body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // プラン名を日本語に変換
    const planName = selectedOption === "vip" ? "VIPファミリー" : selectedOption === "normal" ? "Normalメンバー" : "Ｔシャツオンリー";

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'シート1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
            lastName,
            firstName,
            email,
            size,
            planName,
            zip,
            address,
            address2,
            phone,
            totalAmount,
          ],
        ],
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error adding to spreadsheet:', error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 500 });
  }
} 