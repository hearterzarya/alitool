import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    // Try both possible extension names
    const possiblePaths = [
      join(process.cwd(), 'public', 'extension', 'growtools-extension.zip'),
      join(process.cwd(), 'public', 'extension', 'alitool-extension.zip'),
    ];
    
    let fileBuffer: Buffer | null = null;
    let fileName = 'alitool-extension.zip';
    
    for (const filePath of possiblePaths) {
      try {
        fileBuffer = await readFile(filePath);
        fileName = filePath.includes('growtools') ? 'growtools-extension.zip' : 'alitool-extension.zip';
        break;
      } catch (error) {
        // Try next path
        continue;
      }
    }
    
    if (!fileBuffer) {
      throw new Error('Extension file not found');
    }
    
    // Convert Buffer to Uint8Array for NextResponse (Uint8Array is a valid BodyInit type)
    const uint8Array = new Uint8Array(fileBuffer);
    
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error serving extension file:', error);
    return NextResponse.json(
      { error: 'Extension file not found. Please contact support.' },
      { status: 404 }
    );
  }
}
