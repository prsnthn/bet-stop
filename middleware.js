export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

export default function middleware(request) {
  // Get the country from the request headers
  const country = request.geo?.country || '';
  
  // Allow access only if the visitor is from South Africa (ZA)
  if (country !== 'ZA') {
    // Create a Response object with a message
    return new Response(
      `<html>
        <head>
          <title>Access Restricted</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
              color: #333;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              max-width: 500px;
            }
            h1 {
              color: #e74c3c;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Access Restricted</h1>
            <p>We're sorry, but Bet Stop is currently only available to users in South Africa.</p>
            <p>This service is designed specifically for South African gambling regulations and self-exclusion programs.</p>
          </div>
        </body>
      </html>`,
      {
        status: 403,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
} 