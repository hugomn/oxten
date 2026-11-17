"""Build the production home page from the design source.

Usage: python3 scripts/build-home.py <path to the design index.html>

Writes src/home/v5.html: image paths point at /versions/v5/, the review switcher is off,
the invite form posts to /api/waitlist, and the document head carries the site metadata.
"""
import re
import sys

SITE = "https://www.oxten.ai"
TITLE = "Oxten | Freedom from manual GRC work"
DESCRIPTION = (
    "Domain-trained agents that do complex GRC work from day one. Use them next to any platform."
)

src = open(sys.argv[1], encoding="utf-8").read()
src = src.replace('<meta name="robots" content="noindex">\n', "")
src = re.sub(r"(?<![/\w])((?:dusk|midday|morning|night)(?:-sm)?\.webp)", r"/versions/v5/\1", src)
src = re.sub(r"<title>.*?</title>", f"<title>{TITLE}</title>", src, count=1, flags=re.S)
src = re.sub(r'<meta name="description"[^>]*>\n?', "", src, count=1)

head = f"""<meta name="description" content="{DESCRIPTION}">
<link rel="canonical" href="{SITE}/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0B1B33">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Oxten">
<meta property="og:url" content="{SITE}/">
<meta property="og:title" content="{TITLE}">
<meta property="og:description" content="{DESCRIPTION}">
<meta property="og:image" content="{SITE}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Oxten: freedom from manual GRC work. An agent workspace over a garden at night.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{TITLE}">
<meta name="twitter:description" content="{DESCRIPTION}">
<meta name="twitter:image" content="{SITE}/og.jpg">
<script>document.documentElement.setAttribute('data-review','off');window.OXTEN_WAITLIST='/api/waitlist'</script>
</head>"""
assert "</head>" in src
src = src.replace("</head>", head, 1)
open("src/home/v5.html", "w", encoding="utf-8").write(src)
print("wrote src/home/v5.html", len(src), "bytes")
