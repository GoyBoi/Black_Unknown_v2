import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const humansTxt = `/* TEAM */
Developer: MMWAFRIKA PRIDE
Site: https://mmwafrika.com
Twitter: @mmwafrika
Location: South Africa

/* THANKS */
Next.js, Tailwind CSS, React

/* SITE */
Last update: ${new Date().toISOString().split('T')[0]}
Standards: HTML5, CSS3, ES2015
Components: React, TypeScript
Software: VS Code, Figma`;

  return new Response(humansTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}