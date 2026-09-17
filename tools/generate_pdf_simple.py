#!/usr/bin/env python3
import os
import sys

IN = os.path.join('docs','DOCUMENTACAO_APRENDIZES.md')
OUT = os.path.join('docs','DOCUMENTACAO_APRENDIZES_simple.pdf')

def esc(s):
    return s.replace('\\','\\\\').replace('(','\\(').replace(')','\\)')

with open(IN, 'r', encoding='utf-8') as f:
    md = f.read()

# Simplify markdown to plain text
lines = []
for raw in md.splitlines():
    line = raw.strip()
    if not line:
        lines.append('')
        continue
    # headings
    if line.startswith('#'):
        line = line.lstrip('#').strip()
    # code fences
    if line.startswith('```'):
        continue
    # remove markdown list markers
    if line.startswith('- '):
        line = '• ' + line[2:]
    lines.append(line)

# Page setup
PAGE_WIDTH = 595  # A4-like (points) using 72dpi: 8.27in *72 = 595
PAGE_HEIGHT = 842
LEFT = 50
TOP = PAGE_HEIGHT - 50
LINE_HEIGHT = 14
MAX_LINES_PER_PAGE = (TOP - 50) // LINE_HEIGHT

pages = []
for i in range(0, len(lines), int(MAX_LINES_PER_PAGE)):
    pages.append(lines[i:i+int(MAX_LINES_PER_PAGE)])

objects = []
# 1: Catalog
# 2: Pages
obj_id = 1
obj_offsets = []
output = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"

# helper to add object
obj_contents = []

# Font object id will be assigned later
for_page_objs = []

# create content streams for pages
content_objs = []
for p in pages:
    # build content stream
    stream = 'BT /F1 12 Tf %d %d Td\n' % (LEFT, TOP)
    first = True
    for line in p:
        t = esc(line)
        if first:
            stream += '(%s) Tj\n' % t
            first = False
        else:
            stream += '0 -%d Td (%s) Tj\n' % (LINE_HEIGHT, t)
    stream = stream + 'ET\n'
    stream_bytes = stream.encode('latin-1', errors='replace')
    content_objs.append(stream_bytes)

# Add font object
font_obj_id = obj_id; obj_id +=1
obj_contents.append((font_obj_id, b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"))

# Add content objects
content_obj_ids = []
for c in content_objs:
    cid = obj_id; obj_id +=1
    content_obj_ids.append(cid)
    # will wrap as stream
    obj_contents.append((cid, b'stream-PLACEHOLDER', c))

# Pages objects and page objects
page_ids = []
for cid in content_obj_ids:
    pid = obj_id; obj_id+=1
    page_ids.append(pid)
    # page object references content cid
    obj_contents.append((pid, ('page', cid, font_obj_id)))

# Pages root
pages_obj_id = obj_id; obj_id+=1
obj_contents.append((pages_obj_id, ('pages', page_ids)))

# Catalog
catalog_id = obj_id; obj_id+=1
obj_contents.append((catalog_id, ('catalog', pages_obj_id)))

# Now serialize objects with offsets
for oid, data in obj_contents:
    obj_offsets.append(len(output))
    output += ('%d 0 obj\n' % oid).encode('ascii')
    if isinstance(data, bytes):
        output += data + b'\n'
    elif isinstance(data, tuple):
        if data[0] == 'page':
            _, content_cid, font_cid = data
            s = ('<< /Type /Page /Parent %d 0 R /Resources << /Font << /F1 %d 0 R >> >> /MediaBox [0 0 %d %d] /Contents %d 0 R >>\n' % (pages_obj_id, font_cid, PAGE_WIDTH, PAGE_HEIGHT, content_cid))
            output += s.encode('ascii')
        elif data[0] == 'pages':
            _, kids = data
            kids_s = ' '.join(['%d 0 R' % k for k in kids])
            s = ('<< /Type /Pages /Kids [ %s ] /Count %d >>\n' % (kids_s, len(kids)))
            output += s.encode('ascii')
        elif data[0] == 'catalog':
            _, pagesid = data
            s = ('<< /Type /Catalog /Pages %d 0 R >>\n' % pagesid)
            output += s.encode('ascii')
    else:
        output += str(data).encode('ascii') + b'\n'
    output += b'endobj\n'

# Now replace content streams (they were marked as stream-PLACEHOLDER)
# Need to rebuild output because we used placeholders
# Rebuild from scratch properly
output = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
obj_offsets = []
# write font obj
obj_offsets.append(len(output))
output += ("%d 0 obj\n" % font_obj_id).encode('ascii')
output += b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"

# write content objs
for idx, c in enumerate(content_objs):
    cid = content_obj_ids[idx]
    obj_offsets.append(len(output))
    output += ('%d 0 obj\n' % cid).encode('ascii')
    output += ('<< /Length %d >>\nstream\n' % len(c)).encode('ascii')
    output += c + b'\nendstream\nendobj\n'

# write page objs
for idx, pid in enumerate(page_ids):
    cid = content_obj_ids[idx]
    obj_offsets.append(len(output))
    output += ('%d 0 obj\n' % pid).encode('ascii')
    s = ('<< /Type /Page /Parent %d 0 R /Resources << /Font << /F1 %d 0 R >> >> /MediaBox [0 0 %d %d] /Contents %d 0 R >>\n' % (pages_obj_id, font_obj_id, PAGE_WIDTH, PAGE_HEIGHT, cid))
    output += s.encode('ascii')
    output += b'endobj\n'

# pages root
obj_offsets.append(len(output))
output += ('%d 0 obj\n' % pages_obj_id).encode('ascii')
kids_s = ' '.join(['%d 0 R' % k for k in page_ids])
output += ('<< /Type /Pages /Kids [ %s ] /Count %d >>\n' % (kids_s, len(page_ids))).encode('ascii')
output += b'endobj\n'

# catalog
obj_offsets.append(len(output))
output += ('%d 0 obj\n' % catalog_id).encode('ascii')
output += ('<< /Type /Catalog /Pages %d 0 R >>\n' % pages_obj_id).encode('ascii')
output += b'endobj\n'

# xref
xref_offset = len(output)
output += b'xref\n'
output += ('0 %d\n' % (catalog_id+1)).encode('ascii')
output += b'0000000000 65535 f \n'
for off in obj_offsets:
    output += ('%010d 00000 n \n' % off).encode('ascii')

# trailer
output += b'trailer\n'
output += ('<< /Size %d /Root %d 0 R >>\n' % (catalog_id+1, catalog_id)).encode('ascii')
output += b'startxref\n'
output += ('%d\n' % xref_offset).encode('ascii')
output += b'%%EOF\n'

with open(OUT,'wb') as f:
    f.write(output)

print('PDF gerado em', OUT)
