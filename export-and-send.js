const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const archiver = require('archiver');
const axios = require('axios');

async function exportAndSend() {
  try {
    // Create export directory if it doesn't exist
    const exportDir = path.join(process.cwd(), 'strapi-export');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // Export PostgreSQL database data
    console.log('Exporting PostgreSQL database data...');
    try {
      // Database credentials
      const dbName = 'ecommerce_strapi';
      const dbUser = 'strapi';
      const dbPassword = 'KHALIL123er';
      const dbHost = 'localhost';
      const dbPort = '5432';

      // Create a temporary .pgpass file for password
      const pgpassPath = path.join(process.cwd(), '.pgpass');
      fs.writeFileSync(pgpassPath, `${dbHost}:${dbPort}:*:${dbUser}:${dbPassword}`);
      fs.chmodSync(pgpassPath, '600');

      // Set PGPASSFILE environment variable
      process.env.PGPASSFILE = pgpassPath;

      // Export schema
      console.log('Exporting database schema...');
      await execAsync(`pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} --schema-only > ${path.join(exportDir, 'schema.sql')}`);

      // Export data
      console.log('Exporting database data...');
      await execAsync(`pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} --data-only > ${path.join(exportDir, 'data.sql')}`);

      // Export complete database
      console.log('Exporting complete database...');
      await execAsync(`pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} > ${path.join(exportDir, 'complete.sql')}`);

      // Clean up .pgpass file
      fs.unlinkSync(pgpassPath);
    } catch (dbError) {
      console.error('Error exporting database:', dbError);
      throw dbError;
    }

    // Create a tar.gz archive
    console.log('Creating archive...');
    const output = fs.createWriteStream(path.join(process.cwd(), 'strapi-backup.tar.gz'));
    const archive = archiver('tar', {
      gzip: true,
      gzipOptions: { level: 9 }
    });

    output.on('close', async () => {
      console.log('Archive created successfully!');
      
      // Send email with the backup using EmailJS REST API
      console.log('Sending email...');
      try {
        // Read the backup file
        const backupFile = fs.readFileSync(path.join(process.cwd(), 'strapi-backup.tar.gz'));
        const base64Backup = backupFile.toString('base64');

        // Prepare the request data
        const requestData = {
          service_id: 'service_fiv09zs',
          template_id: 'template_f3spsuj',
          user_id: 'XNc8KcHCQwchLLHG5',
          content: {
            from_name: 'Strapi Backup System',
            subject: 'Strapi Backup',
            attachment: base64Backup
          }
        };

        // Send the request
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', requestData, {
          headers: {
            'Content-Type': 'application/json',
            'origin': 'http://localhost',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        console.log('Email sent successfully!', response.data);
        
        // Clean up
        fs.unlinkSync(path.join(process.cwd(), 'strapi-backup.tar.gz'));
        fs.rmSync(exportDir, { recursive: true, force: true });
      } catch (emailError) {
        console.error('Error sending email:', emailError.response?.data || emailError.message);
        console.log('Please check your EmailJS configuration:');
        console.log('1. Make sure you have a valid EmailJS account');
        console.log('2. Verify your service ID and template ID');
        console.log('3. Check your user ID');
      }
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(exportDir, false);
    archive.finalize();

  } catch (error) {
    console.error('Error during export and send:', error);
    process.exit(1);
  }
}

// Check if required packages are installed
const requiredPackages = ['axios', 'archiver'];
const missingPackages = requiredPackages.filter(pkg => {
  try {
    require.resolve(pkg);
    return false;
  } catch (e) {
    return true;
  }
});

if (missingPackages.length > 0) {
  console.log('Installing required packages...');
  execAsync(`npm install ${missingPackages.join(' ')}`)
    .then(() => {
      console.log('Packages installed successfully!');
      exportAndSend();
    })
    .catch(err => {
      console.error('Error installing packages:', err);
      process.exit(1);
    });
} else {
  exportAndSend();
} 