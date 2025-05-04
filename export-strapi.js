const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const archiver = require('archiver');
const { google } = require('googleapis');
const axios = require('axios');

// Google Drive API setup
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'client_secret_778747622539-p6pd1dg613ic0j4pe1j33d80rjp8q0pk.apps.googleusercontent.com.json');

async function authorize() {
  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    
    // Get credentials from web configuration
    const { client_id, client_secret } = credentials.web;
    
    if (!client_id || !client_secret) {
      throw new Error('Invalid credentials file structure. Missing client_id or client_secret.');
    }

    // Use a simple redirect URI
    const redirectUri = 'http://localhost';

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

    // Check if we have previously stored a token
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
      oAuth2Client.setCredentials(token);
      return oAuth2Client;
    }

    // Get new token
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent' // Force consent screen to get refresh token
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    console.log('Enter the code from that page here: ');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve, reject) => {
      rl.question('Enter the code here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return reject(err);
          oAuth2Client.setCredentials(token);
          fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
          resolve(oAuth2Client);
        });
      });
    });
  } catch (error) {
    console.error('Error authorizing with Google Drive:', error);
    console.log('Please make sure your credentials file is properly formatted.');
    console.log('The file should be downloaded from the Google Cloud Console and contain:');
    console.log('1. client_id');
    console.log('2. client_secret');
    console.log('3. web application configuration');
    throw error;
  }
}

async function uploadToDrive(auth, filePath) {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: `strapi-backup-${new Date().toISOString()}.tar.gz`,
    mimeType: 'application/gzip',
  };
  const media = {
    mimeType: 'application/gzip',
    body: fs.createReadStream(filePath),
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });
    return file.data;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

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
      
      try {
        // Authorize with Google Drive
        console.log('Authorizing with Google Drive...');
        const auth = await authorize();
        
        // Upload to Google Drive
        console.log('Uploading to Google Drive...');
        const uploadedFile = await uploadToDrive(auth, path.join(process.cwd(), 'strapi-backup.tar.gz'));
        
        // Send email with the download link
        console.log('Sending email...');
        const requestData = {
          service_id: 'service_fiv09zs',
          template_id: 'template_f3spsuj',
          user_id: 'XNc8KcHCQwchLLHG5',
          template_params: {
            to_email: 'blacklife4ever93@gmail.com',
            from_name: 'Strapi Backup System',
            subject: 'Strapi Backup',
            message: `Your Strapi backup is ready. You can download it from: ${uploadedFile.webViewLink}`,
            name: 'Backup Strapi'
          }
        };

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
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        console.log('Please check your configuration:');
        console.log('1. Make sure you have a valid Google Drive API setup');
        console.log('2. Verify your EmailJS credentials');
      }
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(exportDir, false);
    
    // Add the public/uploads directory if it exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (fs.existsSync(uploadsDir)) {
      console.log('Adding uploads directory to archive...');
      archive.directory(uploadsDir, 'public/uploads');
    }
    
    archive.finalize();

  } catch (error) {
    console.error('Error during export and send:', error);
    process.exit(1);
  }
}

// Check if required packages are installed
const requiredPackages = ['axios', 'archiver', 'googleapis'];
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