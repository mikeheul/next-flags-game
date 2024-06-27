import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const countryName = searchParams.get('countryName');

    if (!countryName) {
        return NextResponse.json({ error: 'Country name is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch country data');
        }
        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error('No country data found');
        }
        const country = data[0];
        const flagUrl = country.flags.svg;

        return NextResponse.redirect(flagUrl); // Use NextResponse to handle redirection
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch country' }, { status: 500 });
    }
}