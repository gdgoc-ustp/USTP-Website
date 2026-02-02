/**
 * Centralized TinyMCE configuration
 * This allows us to maintain TinyMCE settings in one place
 * API key is now fetched securely from server-side API
 */

let cachedConfig = null;

/**
 * Fetch TinyMCE configuration from secure API endpoint
 */
export const getTinyMCEConfig = async () => {
    if (cachedConfig) {
        return cachedConfig;
    }

    try {
        const response = await fetch('/api/tinymce-config');
        if (!response.ok) {
            throw new Error(`Failed to fetch TinyMCE config: ${response.statusText}`);
        }

        cachedConfig = await response.json();
        return cachedConfig;
    } catch (error) {
        console.error('Error fetching TinyMCE config:', error);
        // Fallback to basic config without API key (will show TinyMCE branding)
        return {
            apiKey: null,
            editorConfig: getBasicEditorConfig()
        };
    }
};

/**
 * Get the TinyMCE API key securely
 */
export const getTinyMCEApiKey = async () => {
    const config = await getTinyMCEConfig();
    return config.apiKey;
};

// common emoji cdn patterns from various platforms
const EMOJI_CDN_PATTERNS = [
    'fbcdn',           // facebook
    'twimg',           // twitter
    'slack-edge',      // slack
    'discord',         // discord
    'emoji',           // generic emoji paths
    'emojione',        // emojione cdn
    'twemoji',         // twitter emoji lib
    'joypixels',       // joypixels
    'noto-emoji',      // google noto
    'openmoji',        // openmoji
    'fluent-emoji',    // microsoft fluent
    'e.wpp.im',        // whatsapp web
];

// regex to detect emoji characters
const EMOJI_REGEX = /^[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}\u200d\ufe0f]+$/u;

const isEmojiText = (text) => {
    if (!text || text.length > 20) return false;
    return EMOJI_REGEX.test(text.trim());
};

const isEmojiCdnUrl = (src) => {
    const lowerSrc = src.toLowerCase();
    return EMOJI_CDN_PATTERNS.some(pattern => lowerSrc.includes(pattern));
};

const hasEmojiDimensions = (img) => {
    const width = parseInt(img.getAttribute('width') || img.style?.width) || 0;
    const height = parseInt(img.getAttribute('height') || img.style?.height) || 0;
    return (width > 0 && width <= 72) || (height > 0 && height <= 72);
};

/**
 * sanitize pasted content - converts emoji images to unicode characters
 * works on DOM node directly (for paste_postprocess)
 */
const sanitizePastedNode = (node) => {
    // process all images
    const images = node.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        const title = img.getAttribute('title') || '';
        const dataEmoji = img.getAttribute('data-emoji') || img.getAttribute('data-emoticon') || '';

        const fromEmojiCdn = isEmojiCdnUrl(src);
        const altIsEmoji = isEmojiText(alt);
        const titleIsEmoji = isEmojiText(title);
        const hasDataEmoji = isEmojiText(dataEmoji);
        const smallImage = hasEmojiDimensions(img);

        const style = img.getAttribute('style') || '';
        const hasEmojiClass = (img.className || '').toLowerCase().includes('emoji');
        const inlineSmall = /width:\s*(1[0-9]|[2-6][0-9]|7[0-2])px/i.test(style);

        const isLikelyEmoji = (fromEmojiCdn || hasEmojiClass) ||
            ((altIsEmoji || titleIsEmoji || hasDataEmoji) && (smallImage || inlineSmall)) ||
            (fromEmojiCdn && smallImage);

        if (isLikelyEmoji) {
            const emojiChar = dataEmoji || (altIsEmoji ? alt : '') || (titleIsEmoji ? title : '');
            if (emojiChar) {
                img.replaceWith(document.createTextNode(emojiChar));
            } else {
                img.remove();
            }
        }
    });

    // remove empty anchor tags
    node.querySelectorAll('a:empty').forEach(link => link.remove());

    // unwrap emoji-only links (tracking links from social platforms)
    node.querySelectorAll('a').forEach(link => {
        const text = link.textContent?.trim() || '';
        if (link.childNodes.length === 1 &&
            link.childNodes[0].nodeType === Node.TEXT_NODE &&
            isEmojiText(text)) {
            link.replaceWith(text);
        }
    });

    // strip google docs / ms word garbage spans around emoji
    node.querySelectorAll('span[style*="font-family"]').forEach(span => {
        const text = span.textContent?.trim() || '';
        if (isEmojiText(text) && span.childNodes.length === 1) {
            span.replaceWith(text);
        }
    });
};

/**
 * Basic editor configuration (without API key specific features)
 */
const getBasicEditorConfig = (height = 500, imageUploadHandler) => ({
    height,
    menubar: 'file edit view insert format tools table help',
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
        'emoticons'
    ],
    toolbar1: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
    toolbar2: 'forecolor backcolor | link image media | table emoticons | removeformat code fullscreen help',
    paste_postprocess: (editor, args) => {
        // sanitize emoji images on paste - works on the dom node directly
        sanitizePastedNode(args.node);
    },
    content_style: `
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
            padding: 1rem;
        }
        h2 { font-size: 1.75em; margin: 1.5em 0 0.75em; }
        h3 { font-size: 1.5em; margin: 1.5em 0 0.75em; }
        h4 { font-size: 1.25em; margin: 1.5em 0 0.75em; }
        p { margin: 0 0 1em; }
        blockquote {
            margin: 1em 0;
            padding: 0.5em 1em;
            border-left: 4px solid #e0e0e0;
            background: #f8f9fe;
        }
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1em auto;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        table td, table th {
            border: 1px solid #e0e0e0;
            padding: 0.5em;
        }
    `,
    images_upload_handler: imageUploadHandler,
    automatic_uploads: true,
    file_picker_types: 'image',
    image_title: true,
    image_caption: true,
    image_advtab: true,
    image_dimensions: true,
    images_upload_credentials: true,
    images_reuse_filename: false,
    images_file_types: 'jpeg,jpg,png,gif,webp',
    browser_spellcheck: true,
    contextmenu: 'link image table',
    resize: true,
    statusbar: true,
    branding: false
});

/**
 * Get editor configuration with secure API key
 */
export const getEditorConfig = async (height = 500, imageUploadHandler) => {
    const config = await getTinyMCEConfig();
    const baseConfig = getBasicEditorConfig(height, imageUploadHandler);

    // Merge with server config if available
    return {
        ...baseConfig,
        ...config.editorConfig,
        height,
        images_upload_handler: imageUploadHandler,
        paste_postprocess: baseConfig.paste_postprocess
    };
};

// Backward compatibility - export the API key getter
export const TINYMCE_API_KEY = getTinyMCEApiKey;

// Export a function for getting a configured TinyMCE editor
export default getEditorConfig;