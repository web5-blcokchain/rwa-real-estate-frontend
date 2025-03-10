import fs from 'fs'
import { homedir } from 'os'
import SftpUploader from 'simple-sftp-uploader'

const sftpUploaderConfig = {
  localDir: 'dist',
  remoteDir: '/www/wwwroot/xmint.fun',
  connect: {
    host: '52.221.103.134',
    port: 22,
    username: 'www',
    privateKey: fs.readFileSync(`${homedir()}/.ssh/id_rsa`)
  }
}

const sftpUploader = new SftpUploader(sftpUploaderConfig)

sftpUploader.start()
