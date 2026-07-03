#!/usr/bin/env python3
"""
Compress images in docs/assets/wechat/ to reduce GitHub Pages artifact size.

Strategy:
- PNG: try lossless (optimize + max compression). If the reduction is less than
  15%, fall back to palette quantization (256 colors) which is usually fine for
  screenshots and dramatically smaller.
- JPEG: re-encode at quality 85 with optimize and progressive.
- GIF: left untouched (Pillow support is spotty and there are few).
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "docs" / "assets" / "wechat"

# Thresholds
PNG_LOSSLESS_MIN_REDUCTION = 0.15  # If lossless saves less than 15%, use palette
JPEG_QUALITY = 85


def compress_png(path: Path) -> tuple[int, int]:
    """Return (original_bytes, new_bytes)."""
    original = path.stat().st_size
    img = Image.open(path)

    # First try lossless re-save with maximum zlib compression.
    tmp_path = path.with_suffix(".tmp.png")
    img.save(tmp_path, format="PNG", optimize=True, compress_level=9)
    lossless_size = tmp_path.stat().st_size

    reduction = (original - lossless_size) / original
    if reduction >= PNG_LOSSLESS_MIN_REDUCTION:
        os.replace(tmp_path, path)
        return original, lossless_size

    # Fall back to palette quantization (256 colors).
    # Convert to RGB first if necessary, then quantize.
    quantized = img.convert("RGB").quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    quantized.save(tmp_path, format="PNG", optimize=True, compress_level=9)
    palette_size = tmp_path.stat().st_size

    if palette_size < lossless_size:
        os.replace(tmp_path, path)
        return original, palette_size
    else:
        # Unusual: palette was bigger; keep the lossless version.
        os.replace(tmp_path, path)
        return original, lossless_size


def compress_jpeg(path: Path) -> tuple[int, int]:
    original = path.stat().st_size
    img = Image.open(path)
    # Convert to RGB if it has an alpha channel or palette.
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    tmp_path = path.with_suffix(".tmp.jpg")
    img.save(
        tmp_path,
        format="JPEG",
        quality=JPEG_QUALITY,
        optimize=True,
        progressive=True,
    )
    os.replace(tmp_path, path)
    return original, path.stat().st_size


def main() -> int:
    if not ROOT.exists():
        print(f"Directory not found: {ROOT}", file=sys.stderr)
        return 1

    total_original = 0
    total_new = 0
    processed = 0
    skipped = 0

    for path in sorted(ROOT.rglob("*")):
        if not path.is_file():
            continue

        suffix = path.suffix.lower()
        try:
            if suffix == ".png":
                orig, new = compress_png(path)
            elif suffix in (".jpg", ".jpeg"):
                orig, new = compress_jpeg(path)
            else:
                skipped += 1
                continue
        except Exception as exc:  # noqa: BLE001
            print(f"ERROR {path}: {exc}", file=sys.stderr)
            continue

        total_original += orig
        total_new += new
        processed += 1
        reduction = (orig - new) / orig * 100 if orig else 0
        print(f"{path.relative_to(ROOT)}: {orig / 1024:.1f}KB → {new / 1024:.1f}KB ({reduction:+.1f}%)")

    print("\nSummary:")
    print(f"  Processed: {processed}")
    print(f"  Skipped (gif/other): {skipped}")
    print(f"  Original: {total_original / 1024 / 1024:.2f}MB")
    print(f"  New:      {total_new / 1024 / 1024:.2f}MB")
    if total_original:
        print(f"  Saved:    {(total_original - total_new) / 1024 / 1024:.2f}MB ({(total_original - total_new) / total_original * 100:.1f}%)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
