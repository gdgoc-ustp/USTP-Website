const TINYMCE_API_KEY = process.env.TINYMCE_API_KEY;

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check if API key is configured
    if (!TINYMCE_API_KEY) {
        console.error('TinyMCE API key is not configured');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        // Return the TinyMCE configuration with the secure API key
        const config = {
            apiKey: TINYMCE_API_KEY,
            editorConfig: {
                height: 500,
                menubar: 'file edit view insert format tools table help',
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
                    'emoticons'
                ],
                toolbar1: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
                toolbar2: 'forecolor backcolor | link image media | table emoticons | removeformat code fullscreen help',
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
            }
        };

        return res.status(200).json(config);

    } catch (error) {
        console.error('Error getting TinyMCE config:', error);
        return res.status(500).json({ 
            error: 'Internal server error while getting TinyMCE configuration' 
        });
    }
}
