const pki = require('node-forge').pki;
const http = require('http'); 
const port = process.env.PORT || 3000; 
const server = http.createServer((req, res) => { 
    console.log(req.headers);
    const header = req.headers['X-ARR-ClientCert'];
            if (!header) {
                res.statusCode = 200; 
                res.setHeader('Content-Type', 'text/plain'); 
                res.end('Success but Not Authorized - No Client Certificate Provided\n'); 
                return;
            }

            // Convert from PEM to pki.CERT
            const pem = `-----BEGIN CERTIFICATE-----${header}-----END CERTIFICATE-----`;
            const incomingCert = pki.certificateFromPem(pem);

            // Validate time validity
            const currentDate = new Date();
            if (currentDate < incomingCert.validity.notBefore || currentDate > incomingCert.validity.notAfter) 
            {
                res.statusCode = 200; 
                res.setHeader('Content-Type', 'text/plain'); 
                res.end('Not Authorized - Certificate Not Valid'); 
                return;
            }

    res.statusCode = 200; 
    res.setHeader('Content-Type', 'text/plain'); 
    res.end('This is a protected resource\n'); 
}); 
server.listen(port, () => { 
    console.log(`Server running on port ${port}`); 
});