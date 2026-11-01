#!/usr/bin/env python3
"""Regenerate src/content/translations/web-proverbs.json from the public-domain
World English Bible USFM files published by eBible.org.

Usage:
  curl -O https://ebible.org/Scriptures/eng-web_usfm.zip && unzip eng-web_usfm.zip -d web
  python3 scripts/extract-usfm.py web/21-PROeng-web.usfm > src/content/translations/web-proverbs.json

Footnotes, cross references, Strong's numbers and paragraph/poetry markers are
removed; the verse wording itself is left untouched.
"""
import json
import re
import sys

src = open(sys.argv[1], encoding="utf-8").read()
src = re.sub(r"\\f .*?\\f\*", "", src, flags=re.S)   # footnotes
src = re.sub(r"\\x .*?\\x\*", "", src, flags=re.S)   # cross references
src = re.sub(r"\\\+?w ([^|\\]*?)(\|[^\\]*?)?\\\+?w\*", r"\1", src)  # \w word|strong="..."\w*

chapters: dict[str, dict[str, str]] = {}
chapter = verse = None
for token in re.split(r"(\\c \d+|\\v \d+)", src):
    if m := re.match(r"\\c (\d+)", token):
        chapter, verse = m.group(1), None
        chapters[chapter] = {}
    elif m := re.match(r"\\v (\d+)", token):
        verse = m.group(1)
        chapters[chapter][verse] = ""
    elif chapter and verse:
        chapters[chapter][verse] += token

for verses in chapters.values():
    for v, text in verses.items():
        text = re.sub(r"\\(s\d?|ms\d?|d|r)\s[^\n]*", " ", text)  # section headings
        text = re.sub(r"\\[a-z]+\d?\*?", " ", text)              # remaining markers
        verses[v] = re.sub(r"\s+", " ", text).strip()

json.dump(
    {
        "translationId": "web",
        "book": "Proverbs",
        "source": "eBible.org eng-web USFM (World English Bible, public domain)",
        "chapters": chapters,
    },
    sys.stdout,
    ensure_ascii=False,
    indent=1,
)
