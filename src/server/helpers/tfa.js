var qr = require('qr-image');
var speakeasy = require('speakeasy');

module.exports = {
    getQRCode: function(user, secret) {
        return qr.imageSync(buildAuthString(user, secret), {
            type: 'svg'
        });
    },
    getSecret: function() {
        return speakeasy.generate_key({
            length: 20,
            google_auth_qr: true
        });
    },
    getTotp: function(secret) {
        return speakeasy.time({
            key: secret,
            encoding: 'base32'
        });
    }
};

function buildAuthString(user, secret) {
    return 'otpauth://totp/Tyco:' + user.email + '?secret=' + secret.base32 + '&issuer=Tyco';
}