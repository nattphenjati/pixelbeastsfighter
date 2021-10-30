/*global ethereum, MetamaskOnboarding */

/*
The `piggybankContract` is compiled from:

  pragma solidity ^0.4.0;
  contract PiggyBank {

      uint private balance;
      address public owner;

      function PiggyBank() public {
          owner = msg.sender;
          balance = 0;
      }

      function deposit() public payable returns (uint) {
          balance += msg.value;
          return balance;
      }

      function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
          require(msg.sender == owner);
          balance -= withdrawAmount;

          msg.sender.transfer(withdrawAmount);

          return balance;
      }
  }
*/

const forwarderOrigin = 'http://localhost:9010';

const initialize = () => {
  //Basic Actions Section
  const onboardButton = document.getElementById('connectButton');
  const getAccountsButton = document.getElementById('getAccounts');
  const getAccountsResult = document.getElementById('getAccountsResult');

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  //This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };
  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }
  };

  const MetaMaskClientCheck = () => {
    //Now we check to see if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
      //When the button is clicked we call this function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else {
      //If it is installed we change our button text
      onboardButton.innerText = 'CONNECT METAMASK';
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }
  };
  MetaMaskClientCheck();

  //Eth_Accounts-getAccountsButton
  getAccountsButton.addEventListener('click', async () => {
    //we use eth_accounts because it returns a list of addresses owned by us.
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    //We take the first address in the array of addresses and display it
    getAccountsResult.innerHTML = accounts[0] || 'Not able to get accounts';

    const eth_address = accounts[0];
    $(".login-wrapper").addClass( "hide" );
    getassets(eth_address);
  });


  function getassets(id){
    const options = {method: 'GET'};
    var pixelbeasts_address = "0xd539a3a5edb713e6587e559a9d007ffff92bd9ab";
    var api_address = 'https://api.opensea.io/api/v1/assets?owner='+id+'&asset_contract_address='+pixelbeasts_address+'&order_direction=desc&offset=0&limit=50';

    console.log("Fetch:");
    console.log(api_address);

    fetch(api_address, options)
      .then(function(response2) {
        return response2.json();
      })
      .then(function(data2) {
        console.log(data2["assets"]);

        for (const asset of data2["assets"]){
          console.log("started loop");
          console.log(asset);
          var token_id = asset["token_id"];
          console.log(token_id);

          if (token_id<10){
            token_id="000"+token_id;
          } else if (token_id<100){
            token_id="00"+token_id;
          } else if (token_id<1000){
            token_id="0"+token_id;
          }

          const image = asset["image_thumbnail_url"];

          var traits = [];
          for (const trait of asset["traits"]){
            var trait_type = trait["trait_type"];
            var value = trait["value"];
            traits[trait_type]=value;
          }
          console.log(traits);

          var strength = traits["Strength"];
          var hp = traits["Endurance"]*10;
          var sp = traits["Intelligence"]*10;

          $("#pbImage").attr("src",image);
          $("#shortName").prepend(token_id);
          $("#fullName").prepend('PB#'+token_id);
          $("#beastHP").prepend(hp+'/'+hp);
          $("#beastSP").prepend(sp+'/'+sp);

        }
      })
    .catch(err => console.log(err));
  };


};



window.addEventListener('DOMContentLoaded', initialize);

// alert('hello w');
