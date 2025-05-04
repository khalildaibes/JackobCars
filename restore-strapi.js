const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function restoreStrapi() {
  try {
    const exportDir = path.join(process.cwd(), 'strapi-export');
    
    // Check if export directory exists
    if (!fs.existsSync(exportDir)) {
      throw new Error('Export directory not found. Please make sure you have exported files in the strapi-export directory.');
    }

    // Restore database configuration
    console.log('Restoring database configuration...');
    const databaseConfigPath = path.join(exportDir, 'database.js');
    if (fs.existsSync(databaseConfigPath)) {
      const configDir = path.join(process.cwd(), 'config');
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
      }
      fs.copyFileSync(databaseConfigPath, path.join(configDir, 'database.js'));
    }

    // Restore environment variables
    console.log('Restoring environment variables...');
    const envPath = path.join(exportDir, '.env');
    if (fs.existsSync(envPath)) {
      fs.copyFileSync(envPath, path.join(process.cwd(), '.env'));
    }

    // Restore package.json
    console.log('Restoring package.json...');
    const packagePath = path.join(exportDir, 'package.json');
    if (fs.existsSync(packagePath)) {
      fs.copyFileSync(packagePath, path.join(process.cwd(), 'package.json'));
    }

    // Restore plugins configuration
    console.log('Restoring plugins configuration...');
    const pluginsPath = path.join(exportDir, 'plugins.js');
    if (fs.existsSync(pluginsPath)) {
      const configDir = path.join(process.cwd(), 'config');
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
      }
      fs.copyFileSync(pluginsPath, path.join(configDir, 'plugins.js'));
    }

    // Restore server configuration
    console.log('Restoring server configuration...');
    const serverPath = path.join(exportDir, 'server.js');
    if (fs.existsSync(serverPath)) {
      const configDir = path.join(process.cwd(), 'config');
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
      }
      fs.copyFileSync(serverPath, path.join(configDir, 'server.js'));
    }

    // Install dependencies
    console.log('Installing dependencies...');
    await execAsync('npm install');

    // Import Strapi data
    console.log('Importing Strapi data...');
    const dataFile = path.join(exportDir, 'data.tar.gz');
    if (fs.existsSync(dataFile)) {
      // Copy the data file to the current directory
      fs.copyFileSync(dataFile, path.join(process.cwd(), 'data.tar.gz'));
      // Import the data
      await execAsync('npx strapi import --file data.tar.gz');
      // Clean up the temporary file
      fs.unlinkSync(path.join(process.cwd(), 'data.tar.gz'));
    }

    console.log('Restore completed successfully!');
    console.log('You can now start your Strapi server with: npm run develop');
  } catch (error) {
    console.error('Error during restore:', error);
    process.exit(1);
  }
}

restoreStrapi(); 