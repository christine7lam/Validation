var convict = require('convict');

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

/**
 * initialize convict object
 *
 * @param {Object} options available options are env and json
 * @returns {Object} convict object
 * @throws {TypeError} if env file cannot be found
 */
function init(options) {
    var env, envFile;

    var config = convict({
        endpoints: {
            datamodel: {
                host: {
                    doc: 'Data model host name',
                    format: String,
                    default: null,
                    env: 'ENDPOINTS_DATA_MODEL_HOST'
                },
                path: {
                    doc: 'Date model path',
                    format: String,
                    default: 'ingestservice/rest/discovery',
                    env: 'ENDPOINTS_DATA_MODEL_PATH'
                },
                port: {
                    doc: 'Data Model port',
                    format: 'port',
                    default: 8080,
                    env: 'DATA_MODEL_PORT'
                },
                protocol: {
                    doc: 'Data model protocol',
                    format: String,
                    default: 'http',
                    env: 'ENDPOINTS_DATA_MODEL_PROTOCOL'
                }
            }
        },
        env: {
            doc: 'App environment',
            format: ['local', 'development', 'test', 'stage', 'production'],
            default: 'local',
            arg: 'env',
            env: 'NODE_ENV'
        },
        express: {
            logger: {
                doc: 'Whether to use the logger',
                format: Boolean,
                default: false,
                env: 'EXPRESS_LOGGER'
            },
            public: {
                dir: {
                    doc: 'The public/static dir',
                    format: String,
                    default: 'public',
                    env: 'EXPRESS_PUB'
                }
            },
            session: {
                host: {
                    doc: 'Host name of the redis server',
                    format: String,
                    default: '127.0.0.1',
                    env: 'EXPRESS_SESSION_HOST'
                },
                port: {
                    doc: 'Port number the redis server is listening on',
                    format: 'port',
                    default: 6379,
                    env: 'EXPRESS_SESSION_PORT'
                },
                prefix: {
                    doc: 'Express session string prefix',
                    format: String,
                    default: 'sess-',
                    env: 'EXPRESS_SESSION_PREFIX'
                },
                ttl: {
                    doc: 'Redis session time to live',
                    format: 'nat',
                    default: 3600,
                    env: 'EXPRESS_SESSION_TTL'
                },
                db: {
                    doc: 'Redis database index to use',
                    format: 'nat',
                    default: 1,
                    env: 'EXPRESS_SESSION_DB'
                },
                secret: {
                    doc: 'Secret used to sign the session ID cookie',
                    format: String,
                    default: 'test',
                    env: 'EXPRESS_SESSION_SECRET'
                }
            },
            template: {
                cache: {
                    doc: 'Cache the compiled templates',
                    format: Boolean,
                    default: true,
                    env: 'EXPRESS_CIEW_CACHE'
                },
                dir: {
                    doc: 'The template dir',
                    format: String,
                    default: 'views',
                    env: 'EXPRESS_VIEW_DIR'
                },
                ext: {
                    doc: 'The default template extension',
                    format: String,
                    default: 'html',
                    env: 'EXPRESS_VIEW_EXT'
                }
            }
        },
        http: {
            host: {
                doc: 'HTTP host',
                format: String,
                default: 'localhost',
                env: 'HTTP_HOST'
            },
            port: {
                doc: 'HTTP port to use',
                format: 'port',
                default: 80,
                env: 'HTTP_PORT'
            },
            secure: {
                ca: {
                    doc: 'The CA file path',
                    format: String,
                    default: 'server-ca.pem',
                    env: 'HTTP_SECURE_CA'
                },
                cert: {
                    doc: 'The SSL cert file path',
                    format: String,
                    default: 'server-cert.pem',
                    env: 'HTTP_SECURE_CERT'
                },
                enabled: {
                    doc: 'If true a HTTPS server is used',
                    format: Boolean,
                    default: false,
                    env: 'HTTP_SECURE_ENABLED'
                },
                key: {
                    doc: 'The SSL key file path',
                    format: String,
                    default: 'server-key.pem',
                    env: 'HTTP_SECURE_KEY'
                }
            }
        },
        mqtt: {
            host: {
                doc: 'MQTT host name',
                format: String,
                default: 'localhost',
                env: 'MQTT_CLIENT_HOST'
            },
            port: {
                doc: 'MQTT port',
                format: 'port',
                default: 80,
                env: 'MQTT_CLIENT_PORT'
            },
            secure: {
                ca: {
                    doc: 'The CA file path',
                    format: String,
                    default: 'mqtt.client-ca.pem',
                    env: 'MQTT_CLIENT_SECURE_CA'
                },
                cert: {
                    doc: 'The cert file path',
                    format: String,
                    default: 'mqtt.client-cert.pem',
                    env: 'MQTT_CLIENT_SECURE_CERT'
                },
                enabled: {
                    doc: 'If true a secure connection is used',
                    format: Boolean,
                    default: false,
                    env: 'MQTT_CLIENT_SECURE_ENABLED'
                },
                key: {
                    doc: 'The key file path',
                    format: String,
                    default: 'mqtt.client-key.pem',
                    env: 'MQTT_CLIENT_SECURE_KEY'
                }
            }
        },
        statsd: {
            host: {
                doc: 'statsd host name',
                format: String,
                default: 'localhost',
                env: 'STATSD_HOST'
            },
            port: {
                doc: 'statsd port',
                format: 'port',
                default: 8125,
                env: 'STATSD_PORT'
            }
        }
    });

    options = options || {};

    if (options.env) {
        config.set('env', options.env);
    }

    env = config.get('env');
    envFile = path.join(__dirname, env + '.json');
    if (!fs.existsSync(envFile)) {
        throw new TypeError('Cannot find config file: ' + envFile);
    }

    config.loadFile(envFile);

    if (options.json) {
        config.load(options.json);
    }

    config.validate();
    config.getUri = getUri;
    config.createUri = createUri;

    return config;
}

/**
 * Returns a URI, if the config section is in a specific format
 *
 * @param {Object} config
 * @param {String} key the config key to get
 * @returns {String} the full URI
 * @throws {TypeError} if the key cannot be found
 */
function getUri(config, key) {
    var section = config.get(key);
    if (!section) {
        throw new TypeError('Unable to find key');
    }

    return createUri({
        protocol: section.protocol,
        host: section.host,
        port: section.port,
        path: section.path
    });
}

/**
 * Creates a {String} URI from the supplied options
 *
 * @param {Object} options
 * @returns {String} URI
 */
function createUri(options) {
    var uri = '';
    var defaults = {
        protocol: null,
        host: null,
        port: 80,
        path: '/'
    };

    options = _.defaults(options, defaults);

    // check if relative uri, i.e. no host
    if (_.isEmpty(options.host)) {
        return options.path;
    }

    if (_.isEmpty(options.protocol) === false) {
        uri += options.protocol;
        if (options.protocol[options.protocol.length - 1] !== ':') {
            uri += ':';
        }
    }

    uri += '//' + options.host;

    if (options.port) {
        uri += ':' + options.port;
    }

    // add initial slash for path, if it doesn't exist
    if (options.path[0] !== '/') {
        options.path = '/' + options.path;
    }

    uri += options.path;

    return uri;
}

var config = {
    init: init
};

module.exports = config;