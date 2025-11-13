import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

interface UploadOptions {
  sourceDir: string;
  uploadsDir: string;
  courseId?: string;
  year?: number;
  type?: string;
  autoApprove?: boolean;
}

async function uploadDirectory(options: UploadOptions) {
  const {
    sourceDir,
    uploadsDir,
    courseId = 'GENERAL',
    year = new Date().getFullYear(),
    type = 'notes',
    autoApprove = true
  } = options;

  // Validate source directory
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source directory does not exist: ${sourceDir}`);
    process.exit(1);
  }

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`✅ Created uploads directory: ${uploadsDir}`);
  }

  // Get all files from source directory
  const files = fs.readdirSync(sourceDir).filter(file => {
    const filePath = path.join(sourceDir, file);
    return fs.statSync(filePath).isFile();
  });

  if (files.length === 0) {
    console.log('ℹ️  No files found in source directory');
    return;
  }

  console.log(`📁 Found ${files.length} files to upload`);
  console.log(`📂 Source: ${sourceDir}`);
  console.log(`📦 Destination: ${uploadsDir}`);
  console.log(`⚙️  Course ID: ${courseId}, Year: ${year}, Type: ${type}`);
  console.log(`✅ Auto-approve: ${autoApprove ? 'Yes' : 'No'}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const fileStats = fs.statSync(sourcePath);
    
    // Check file size (25MB limit)
    if (fileStats.size > 25 * 1024 * 1024) {
      console.log(`⚠️  Skipping ${file} - file too large (${(fileStats.size / 1024 / 1024).toFixed(2)}MB)`);
      errorCount++;
      continue;
    }

    // Check file extension
    const ext = path.extname(file).toLowerCase();
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    if (!allowedExtensions.includes(ext)) {
      console.log(`⚠️  Skipping ${file} - unsupported file type (${ext})`);
      errorCount++;
      continue;
    }

    try {
      // Determine MIME type
      let mimeType = 'application/pdf';
      if (['.jpg', '.jpeg'].includes(ext)) mimeType = 'image/jpeg';
      if (ext === '.png') mimeType = 'image/png';

      // Generate unique filename
      const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
      const destPath = path.join(uploadsDir, uniqueName);

      // Copy file
      fs.copyFileSync(sourcePath, destPath);

      // Extract title from filename (remove extension)
      const title = path.basename(file, ext);

      // Create database record
      const submission = await prisma.materialSubmission.create({
        data: {
          title: title,
          courseId: courseId,
          year: year,
          type: type,
          filePath: destPath,
          originalName: file,
          mimeType: mimeType,
          size: fileStats.size,
          ipHash: crypto.createHash('sha256').update('bulk-upload').digest('hex'),
          status: autoApprove ? 'approved' : 'pending',
          reviewNote: autoApprove ? 'Bulk uploaded and auto-approved' : 'Bulk uploaded - pending review'
        }
      });

      console.log(`✅ Uploaded: ${file} → ${submission.id}`);
      successCount++;
    } catch (error: any) {
      console.error(`❌ Error uploading ${file}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📁 Total: ${files.length}`);
}

// Main execution
async function main() {
  const sourceDir = process.argv[2];
  const courseId = process.argv[3] || 'GENERAL';
  const year = parseInt(process.argv[4]) || new Date().getFullYear();
  const type = process.argv[5] || 'notes';
  const autoApprove = process.argv[6] !== 'false';

  if (!sourceDir) {
    console.log('Usage: npx tsx scripts/upload-directory.ts <source-directory> [courseId] [year] [type] [autoApprove]');
    console.log('');
    console.log('Examples:');
    console.log('  npx tsx scripts/upload-directory.ts /path/to/files');
    console.log('  npx tsx scripts/upload-directory.ts /path/to/files MATH101 2025 notes true');
    console.log('  npx tsx scripts/upload-directory.ts /path/to/files GENERAL 2025 exam_paper false');
    console.log('');
    console.log('Parameters:');
    console.log('  source-directory: Path to directory containing files to upload');
    console.log('  courseId: Course identifier (default: GENERAL)');
    console.log('  year: Academic year (default: current year)');
    console.log('  type: Material type - notes|solution|exam_paper|textbook (default: notes)');
    console.log('  autoApprove: true|false (default: true)');
    process.exit(1);
  }

  const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');

  try {
    await uploadDirectory({
      sourceDir,
      uploadsDir,
      courseId,
      year,
      type,
      autoApprove
    });
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

