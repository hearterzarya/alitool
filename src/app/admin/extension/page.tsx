import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Settings, Cookie, Upload, Trash2, TestTube } from 'lucide-react';
import Link from 'next/link';

export default async function AdminExtensionPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const userRole = (session.user as any).role;
  if (userRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Cookie Manager Extension</h1>
        <p className="text-slate-600">Install the admin extension to manage cookies and sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Download Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Download className="h-6 w-6 text-blue-600" />
              <CardTitle>Download Extension</CardTitle>
            </div>
            <CardDescription>
              Download and install the admin extension for cookie management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Installation Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                <li>Download the extension ZIP file</li>
                <li>Extract the ZIP file to a folder</li>
                <li>Open Chrome/Edge and go to <code className="bg-white px-1 rounded">chrome://extensions/</code></li>
                <li>Enable "Developer mode" (top right)</li>
                <li>Click "Load unpacked" and select the extracted folder</li>
                <li>The extension icon will appear in your toolbar</li>
              </ol>
            </div>
            <Button asChild className="w-full">
              <a href="/extension/admin/admin-extension.zip" download>
                <Download className="mr-2 h-4 w-4" />
                Download Admin Extension (ZIP)
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-purple-600" />
              <CardTitle>Features</CardTitle>
            </div>
            <CardDescription>
              What you can do with the admin extension
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Cookie className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Extract Cookies</h4>
                  <p className="text-sm text-slate-600">Extract all cookies from any website with one click</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Upload className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Upload to Admin Panel</h4>
                  <p className="text-sm text-slate-600">Directly upload cookies to tools in the admin panel</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trash2 className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Clear Cookies</h4>
                  <p className="text-sm text-slate-600">Clear all cookies for a domain to test fresh sessions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TestTube className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Test Injection</h4>
                  <p className="text-sm text-slate-600">Test cookie injection before uploading</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>Step-by-step guide for managing cookies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Extract Cookies
              </h3>
              <p className="text-sm text-slate-600 ml-8">
                Navigate to the tool website (e.g., chat.openai.com), log in, then click the extension icon and click "Extract from Current Tab". 
                The extension will extract all cookies from the current page.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Review & Format
              </h3>
              <p className="text-sm text-slate-600 ml-8">
                Review the extracted cookies. Click "Format & Copy" to format them properly. The cookies will be automatically formatted 
                in the correct JSON structure needed for the admin panel.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Upload to Admin Panel
              </h3>
              <p className="text-sm text-slate-600 ml-8">
                Go to the "Upload" tab in the extension, enter the Tool ID from the admin panel, optionally set an expiry date, 
                and click "Upload Cookies". The cookies will be encrypted and saved to the tool.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Test (Optional)
              </h3>
              <p className="text-sm text-slate-600 ml-8">
                Use the "Test Cookie Injection" feature to verify cookies work before uploading. This helps ensure the cookies 
                are valid and will work for users.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="mt-6 flex gap-4">
        <Button asChild variant="outline">
          <Link href="/admin/tools">Back to Tools</Link>
        </Button>
        <Button asChild>
          <Link href="/admin">Admin Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
