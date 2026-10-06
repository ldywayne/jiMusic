"""Decode all audio and check duration fixtures. Requires FFmpeg on PATH or --ffmpeg."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--ffmpeg', default=shutil.which('ffmpeg'))
parser.add_argument('--update', action='store_true', help='Regenerate decoded durations and hashes')
args = parser.parse_args()
if not args.ffmpeg:
    parser.error('Install FFmpeg or pass --ffmpeg /path/to/ffmpeg')
root = Path(__file__).resolve().parents[1]
fixture = root / 'tests/fixtures/audio-audit.json'
files = sorted(p for p in (root / 'src/res').iterdir() if p.suffix in {'.mp3', '.wav', '.m4a'})

def decode(file):
    result = subprocess.run([
        args.ffmpeg, '-nostdin', '-hide_banner', '-v', 'error', '-i', str(file),
        '-map', '0:a:0', '-ac', '1', '-ar', '48000', '-f', 's16le', 'pipe:1',
    ], capture_output=True, timeout=90)
    if result.returncode or not result.stdout:
        raise RuntimeError(f'{file.name}: {result.stderr.decode("utf-8", "replace")}')
    return {
        'file': file.name,
        'decodedSeconds': len(result.stdout) / 96000,
        'sha256': hashlib.sha256(file.read_bytes()).hexdigest(),
    }

with ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(decode, files))
if args.update:
    fixture.write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
else:
    expected = {row['file']: row for row in json.loads(fixture.read_text(encoding='utf-8'))}
    if set(expected) != {row['file'] for row in results}:
        raise RuntimeError('Source files changed; review the audio and regenerate the fixture')
    for row in results:
        old = expected[row['file']]
        if row['sha256'] != old['sha256'] or abs(row['decodedSeconds'] - old['decodedSeconds']) > 0.001:
            raise RuntimeError(f'Duration or content changed: {row["file"]}')
print(f'{len(results)} audio files decoded; duration and content verified.')
