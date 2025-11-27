-- Update social media links with actual URLs
-- You can modify these URLs in the admin dashboard after deployment

UPDATE social_media_links SET url = 'https://youtube.com/@reclaimapp' WHERE platform = 'YouTube';
UPDATE social_media_links SET url = 'https://instagram.com/reclaimapp' WHERE platform = 'Instagram';
UPDATE social_media_links SET url = 'https://twitter.com/reclaimapp' WHERE platform = 'Twitter';
UPDATE social_media_links SET url = 'https://facebook.com/reclaimapp' WHERE platform = 'Facebook';
UPDATE social_media_links SET url = 'https://tiktok.com/@reclaimapp' WHERE platform = 'TikTok';
