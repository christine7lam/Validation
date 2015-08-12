var Normalize = {
    //adapt a fire asset to a universal representation
    asset: function(asset) {



        //normalize dates
        if (asset.generalConfigurations[0].dateProvisioned != null) {
            var pieces = (asset.generalConfigurations[0].dateProvisioned.indexOf('T') !== -1) ?
                asset.generalConfigurations[0].dateProvisioned.split('T') :
                    asset.generalConfigurations[0].dateProvisioned.split(' ');

            var date = new Date(pieces[0]);
            asset.generalConfigurations[0].dateProvisioned = date.toDateString();
        }

    }
};

module.exports = Normalize;