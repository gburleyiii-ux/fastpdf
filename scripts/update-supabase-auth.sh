#!/bin/bash

# Supabase Auth URL Configuration Updater
# This script updates the Site URL and Redirect URLs in Supabase Auth

# Configuration
PROJECT_REF="olxlqhoplgyspapwwikh"
SITE_URL="https://fastpdf-djbooman.netlify.app"
ADDITIONAL_REDIRECT_URLS="https://fastpdf-djbooman.netlify.app/auth/callback"

# Check if SUPABASE_ACCESS_TOKEN is set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ Error: SUPABASE_ACCESS_TOKEN is not set"
    echo ""
    echo "To get your access token:"
    echo "1. Go to https://supabase.com/dashboard/account/tokens"
    echo "2. Click 'New Token'"
    echo "3. Give it a name like 'FastPDF Config'"
    echo "4. Copy the token"
    echo "5. Run: export SUPABASE_ACCESS_TOKEN=your_token_here"
    echo "6. Run this script again"
    exit 1
fi

echo "🔄 Updating Supabase Auth configuration..."
echo "   Project: $PROJECT_REF"
echo "   Site URL: $SITE_URL"
echo ""

# Update the auth config using Supabase Management API
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"site_url\": \"$SITE_URL\",
        \"additional_redirect_urls\": [\"$ADDITIONAL_REDIRECT_URLS\"]
    }"

echo ""
echo ""
echo "✅ Done! The Supabase Auth URL configuration has been updated."
echo ""
echo "You can verify the changes at:"
echo "https://supabase.com/dashboard/project/$PROJECT_REF/auth/url-configuration"
