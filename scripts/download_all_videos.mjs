import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ytdlpPath = "C:\\Users\\Kevin.r\\AppData\\Local\\Microsoft\\WinGet\\Packages\\yt-dlp.yt-dlp_Microsoft.Winget.Source_8wekyb3d8bbwe\\yt-dlp.exe";
const denoPath = "C:\\Users\\Kevin.r\\AppData\\Local\\Microsoft\\WinGet\\Packages\\DenoLand.Deno_Microsoft.Winget.Source_8wekyb3d8bbwe\\deno.exe";

const videoMap = JSON.parse(fs.readFileSync('video_map.json', 'utf8'));
const outputDir = path.resolve('public/videos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadOne(id, info) {
  const targetFile = path.join(outputDir, `${id}.mp4`);
  
  if (fs.existsSync(targetFile)) {
    const stats = fs.statSync(targetFile);
    if (stats.size > 25000) {
      console.log(`[SKIP] ${id}.mp4 already exists (${(stats.size / 1024).toFixed(1)} KB)`);
      return true;
    }
  }

  console.log(`[DOWNLOADING] ${id} (${info.title})...`);
  const videoUrl = info.shortsUrl || `https://www.youtube.com/watch?v=${info.id}`;

  try {
    // Try downloading compact 360p/240p/480p mp4 stream
    const cmd = `"${ytdlpPath}" --js-runtimes "deno:${denoPath}" -f "134/135/133/160/worstvideo[ext=mp4]/bestvideo[ext=mp4][height<=480]/b" -o "${targetFile}" "${videoUrl}"`;
    execSync(cmd, { stdio: 'inherit', timeout: 45000 });
  } catch (err) {
    console.warn(`Primary format failed for ${id}, trying fallback best...`);
    try {
      const fallbackCmd = `"${ytdlpPath}" --js-runtimes "deno:${denoPath}" -f "best[height<=480]/best" --remux-video mp4 -o "${targetFile}" "${videoUrl}"`;
      execSync(fallbackCmd, { stdio: 'inherit', timeout: 45000 });
    } catch (err2) {
      console.error(`Failed to download ${id}:`, err2.message);
      return false;
    }
  }

  if (fs.existsSync(targetFile)) {
    const stats = fs.statSync(targetFile);
    console.log(`[SUCCESS] ${id}.mp4 saved (${(stats.size / 1024).toFixed(1)} KB)`);
    return true;
  }
  return false;
}

async function run() {
  console.log(`Starting download for ${Object.keys(videoMap).length} exercise reels...`);
  let successCount = 0;
  for (const [id, info] of Object.entries(videoMap)) {
    const ok = await downloadOne(id, info);
    if (ok) successCount++;
    // Small pause between downloads to avoid rate limits
    await new Promise(r => setTimeout(r, 800));
  }
  console.log(`\nDownload process completed: ${successCount}/${Object.keys(videoMap).length} available.`);
}

run();
