const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = "harvest faculty good curious bulk super banana whale drift exchange faint august";

module.exports = {
    networks: {
         development: {
             host: "localhost",
             port: 9545,
             network_id: "*", // Match any network id
             gas:   2900000
           },
           ropsten: {
             provider: function() {
               return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/gA5k3hJdrkiPhew30BI9")
             },
             network_id: 3,
             gas:   2900000
           }
      }
};
