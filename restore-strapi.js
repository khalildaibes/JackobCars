const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const archiver = require('archiver');

async function restoreStrapi() {
  try {
    // Check if backup file exists
    const backupFile = path.join(process.cwd(), 'strapi-backup.tar.gz');
    console.log('backupFile', backupFile);

    if (!fs.existsSync(backupFile)) {
      throw new Error('Backup file not found. Please make sure strapi-backup.tar.gz exists in the current directory.');
    }

    // Create temporary directory for extraction
    const tempDir = path.join(process.cwd(), 'temp-restore');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir);

    // Extract the backup file
    console.log('Extracting backup file...');
    await execAsync(`tar -xzf ${backupFile} -C ${tempDir}`);

    // List contents of temp directory to debug
    console.log('Contents of temp directory:');
    const tempContents = fs.readdirSync(tempDir);
    console.log(tempContents);

    // Create necessary directories
    const configDir = path.join(process.cwd(), 'config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Restore environment variables
    console.log('Restoring environment variables...');
    const envPath = path.join(tempDir, '.env');
    if (fs.existsSync(envPath)) {
      fs.copyFileSync(envPath, path.join(process.cwd(), '.env'));
    }

    // Restore package.json
    console.log('Restoring package.json...');
    const packagePath = path.join(tempDir, 'package.json');
    if (fs.existsSync(packagePath)) {
      fs.copyFileSync(packagePath, path.join(process.cwd(), 'package.json'));
    }

    // Restore API and components
    console.log('Restoring API and components...');
    const apiDir = path.join(tempDir, 'api');
    const componentsDir = path.join(tempDir, 'components');
    
    if (fs.existsSync(apiDir)) {
      const targetApiDir = path.join(process.cwd(), 'src', 'api');
      if (!fs.existsSync(targetApiDir)) {
        fs.mkdirSync(targetApiDir, { recursive: true });
      }
      // Copy API directory
      const copyDir = (src, dest) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };
      copyDir(apiDir, targetApiDir);
    }

    if (fs.existsSync(componentsDir)) {
      const targetComponentsDir = path.join(process.cwd(), 'src', 'components');
      if (!fs.existsSync(targetComponentsDir)) {
        fs.mkdirSync(targetComponentsDir, { recursive: true });
      }
      // Copy components directory
      const copyDir = (src, dest) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };
      copyDir(componentsDir, targetComponentsDir);
    }

    // Install dependencies
    console.log('Installing dependencies...');
    await execAsync('npm install');

    // Restore PostgreSQL database
    console.log('Restoring PostgreSQL database...');
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

      // Restore complete database
      const completeSqlPath = path.join(tempDir, 'complete.sql');
      if (fs.existsSync(completeSqlPath)) {
        console.log('Restoring complete database...');
        await execAsync(`psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} < ${completeSqlPath}`);
      } else {
        // If complete.sql doesn't exist, try restoring schema and data separately
        const schemaSqlPath = path.join(tempDir, 'schema.sql');
        const dataSqlPath = path.join(tempDir, 'data.sql');

        if (fs.existsSync(schemaSqlPath)) {
          console.log('Restoring database schema...');
          await execAsync(`psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} < ${schemaSqlPath}`);
        }

        if (fs.existsSync(dataSqlPath)) {
          console.log('Restoring database data...');
          await execAsync(`psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} < ${dataSqlPath}`);
        }
      }

      // Clean up .pgpass file
      fs.unlinkSync(pgpassPath);
    } catch (dbError) {
      console.error('Error restoring database:', dbError);
      throw dbError;
    }

    // Clean up temporary directory
    console.log('Cleaning up temporary files...');
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log('Restore completed successfully!');
    console.log('You can now start your Strapi server with: npm run develop');
  } catch (error) {
    console.error('Error during restore:', error);
    process.exit(1);
  }
}

// Check if required packages are installed
const requiredPackages = ['archiver'];
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
      restoreStrapi();
    })
    .catch(err => {
      console.error('Error installing packages:', err);
      process.exit(1);
    });
} else {
  restoreStrapi();
} 