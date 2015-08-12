/**
 * Created by heipakchristine on 7/28/15.
 */
var Reflux = require('reflux');

module.exports = Reflux.createAction({
    asyncResult: true,
    children: [
        'validate'
    ]
});