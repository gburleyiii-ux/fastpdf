/**
 * Supabase Auth URL Configuration Updater
 * Run with: node scripts/update-supabase-auth.js
 */

const PROJECT_REF = 'olxlqhoplgyspapwwikh';
const SITE_URL = 'https://fastpdf-djbooman.netlify.app';
const ADDITIONAL_REDIRECT_URLS = ['https://fastpdf-djbooman.netlify.app/auth/callback'];

async function updateAuthConfig() {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  if (!accessToken) {
    console.log('❌ Error: SUPABASE_ACCESS_TOKEN is not set\n');
    console.log('To get your access token:');
    console.log('1. Go to https://supabase.com/dashboard/account/tokens');
    console.log('2. Click "New Token"');
    console.log('3. Give it a name like "FastPDF Config"');
    console.log('4. Copy the token');
    console.log('5. Run: export SUPABASE_ACCESS_TOKEN=your_token_here');
    console.log('6. Run this script again\n');
    process.exit(1);
  }

  console.log('🔄 Updating Supabase Auth configuration...');
  console.log(`   Project: ${PROJECT_REF}`);
  console.log(`   Site URL: ${SITE_URL}\n`);

  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          site_url: SITE_URL,
          additional_redirect_urls: ADDITIONAL_REDIRECT_URLS,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Success! Auth configuration updated:\n');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n📝 You can verify at:');
    console.log(`https://supabase.com/dashboard/project/${PROJECT_REF}/auth/url-configuration`);
  } catch (error) {
    console.error('❌ Error updating auth config:', error.message);
    process.exit(1);
  }
}

updateAuthConfig();
