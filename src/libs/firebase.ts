import admin from 'firebase-admin';

try {
  admin.initializeApp({
    credential: (process.env.GOOGLE_APPLICATION_CREDENTIALS ?
      admin.credential.applicationDefault() :
      admin.credential.cert(getFromEnv()))
  })

  interface credential {
    [key: string]: any;
  }

  function getFromEnv() {
    let vars = [
      'type',
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id',
      'auth_uri',
      'token_uri',
      'auth_provider_x509_cert_url',
      'client_x509_cert_url',
    ]
    let credential: credential = {};

    for (let i = 0; i < vars.length; i++) {
      let key: string = vars[i];
      let value = process.env[`firebase_${key}`]

      if (typeof value === 'undefined') throw new Error(`ENVIROMENT firebase_${key} don't found`);
      if (key === 'private_key') value = value.replace(/\\n/g, '\n');

      credential[key] = value;
    }

    console.log(credential)
    return credential;
  }
} catch (err) {
  console.error(err)
}

export default admin
