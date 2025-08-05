# Video Embed Guide for Articles

This guide explains how to add video content to your articles for TikTok, Instagram, YouTube, and other platforms.

## Article Object Structure

Your article object should include a `videos` field that can be either a string, array of strings, or array of objects.

### Option 1: Simple String (Single Video)

```json
{
  "id": 1,
  "title": "Car Review Article",
  "description": "Latest car review",
  "videos": "https://www.tiktok.com/@username/video/1234567890123456789"
}
```

### Option 2: Array of Video URLs (Multiple Videos)

```json
{
  "id": 1,
  "title": "Car Review Article", 
  "description": "Latest car review",
  "videos": [
    "https://www.tiktok.com/@username/video/1234567890123456789",
    "https://www.instagram.com/p/ABC123xyz/",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  ]
}
```

### Option 3: Array of Video Objects (With Metadata)

```json
{
  "id": 1,
  "title": "Car Review Article",
  "description": "Latest car review", 
  "videos": [
    {
      "url": "https://www.tiktok.com/@username/video/1234567890123456789",
      "platform": "tiktok",
      "title": "Car Review on TikTok",
      "description": "Quick car review video",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "duration": "0:30"
    },
    {
      "url": "https://www.instagram.com/p/ABC123xyz/",
      "platform": "instagram", 
      "title": "Car Photos on Instagram",
      "description": "Beautiful car photos",
      "thumbnail": "https://example.com/instagram-thumb.jpg"
    }
  ]
}
```

## Supported Platforms

### 1. TikTok

**URL Format:**
```
https://www.tiktok.com/@username/video/1234567890123456789
```

**Example:**
```json
{
  "videos": "https://www.tiktok.com/@carmaxspeed/video/7234567890123456789"
}
```

### 2. Instagram

**URL Format:**
```
https://www.instagram.com/p/POST_ID/
```

**Example:**
```json
{
  "videos": "https://www.instagram.com/p/ABC123xyz/"
}
```

### 3. YouTube

**URL Formats:**
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
```

**Example:**
```json
{
  "videos": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### 4. Other Platforms

For any other video platform, you can use the generic iframe embed:

```json
{
  "videos": "https://example.com/video-embed-url"
}
```

## Strapi Content Type Structure

If you're using Strapi, here's how to set up the videos field:

### Field Configuration

1. **Field Name:** `videos`
2. **Field Type:** `JSON` or `Text`
3. **Required:** No
4. **Unique:** No

### For JSON Field:
```json
{
  "type": "json",
  "name": "videos",
  "label": "Video Embeds"
}
```

### For Text Field (Multiple Videos):
```json
{
  "type": "text",
  "name": "videos", 
  "label": "Video URLs (one per line)"
}
```

## API Response Examples

### Single TikTok Video
```json
{
  "id": 1,
  "title": "2024 BMW Review",
  "description": "Complete review of the new BMW",
  "videos": "https://www.tiktok.com/@carmaxspeed/video/7234567890123456789",
  "publishedAt": "2024-01-15T10:00:00.000Z"
}
```

### Multiple Videos
```json
{
  "id": 1,
  "title": "2024 BMW Review",
  "description": "Complete review of the new BMW",
  "videos": [
    "https://www.tiktok.com/@carmaxspeed/video/7234567890123456789",
    "https://www.instagram.com/p/ABC123xyz/",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  ],
  "publishedAt": "2024-01-15T10:00:00.000Z"
}
```

### Video Objects with Metadata
```json
{
  "id": 1,
  "title": "2024 BMW Review",
  "description": "Complete review of the new BMW",
  "videos": [
    {
      "url": "https://www.tiktok.com/@carmaxspeed/video/7234567890123456789",
      "platform": "tiktok",
      "title": "BMW Review on TikTok",
      "description": "Quick 30-second review",
      "thumbnail": "https://example.com/bmw-tiktok-thumb.jpg",
      "duration": "0:30"
    },
    {
      "url": "https://www.instagram.com/p/ABC123xyz/",
      "platform": "instagram",
      "title": "BMW Photos on Instagram", 
      "description": "Beautiful BMW photos",
      "thumbnail": "https://example.com/bmw-instagram-thumb.jpg"
    }
  ],
  "publishedAt": "2024-01-15T10:00:00.000Z"
}
```

## How It Works in the Frontend

The `BlogDetailClient.tsx` component automatically detects the video platform and renders the appropriate embed:

1. **TikTok:** Uses TikTok's official embed script
2. **Instagram:** Uses Instagram's embed iframe
3. **YouTube:** Uses YouTube's embed iframe
4. **Other:** Uses generic iframe embed

## Testing Your Video Embeds

1. Add a video URL to your article's `videos` field
2. Save the article
3. View the article page
4. The video should appear in a styled container below the article content

## Troubleshooting

### Video Not Showing
- Check that the `videos` field is not empty
- Verify the video URL is correct and accessible
- Check browser console for any JavaScript errors

### TikTok Embed Issues
- Make sure the TikTok URL includes the video ID
- TikTok embeds require the official embed script to load

### Instagram Embed Issues  
- Instagram embeds work best with public posts
- Some posts may not be embeddable due to privacy settings

### YouTube Embed Issues
- Verify the YouTube video ID is correct
- Check that the video is not private or deleted 