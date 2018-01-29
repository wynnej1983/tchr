var TchrCoin = artifacts.require("./TchrCoin.sol");

contract('TchrCoin', function(accounts) {
  it("should put 10000 TchrCoin in the first account", function() {
    return TchrCoin.deployed().then(function(instance) {
      return instance.getBalance.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
  });
  it("should call a function that depends on a linked library", function() {
    var tchr;
    var tchrCoinBalance;
    var tchrCoinEthBalance;

    return TchrCoin.deployed().then(function(instance) {
      tchr = instance;
      return tchr.getBalance.call(accounts[0]);
    }).then(function(outCoinBalance) {
      tchrCoinBalance = outCoinBalance.toNumber();
      return tchr.getBalanceInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      tchrCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(tchrCoinEthBalance, 2 * tchrCoinBalance, "Library function returned unexpected function, linkage may be broken");
    });
  });
  it("should send coin correctly", function() {
    var tchr;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return TchrCoin.deployed().then(function(instance) {
      tchr = instance;
      return tchr.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return tchr.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return tchr.sendCoin(account_two, amount, {from: account_one});
    }).then(function() {
      return tchr.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return tchr.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });
});
