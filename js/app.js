const app = Vue.createApp({
  data(){
    return{
      //Your Data
      yourID:'',
      yourPicture: 'images/player_start.svg',
      maxHP: 0,
      currentHP: 0,
      yourHP: 100,
      maxATK: 0,
      chargeATK: 1,
      xATK:'',
      yourData: [],
      yourTraits: [],
      //Initial Enemy Data
      enemyID: '4082',
      enemyPicture: 'https://lh3.googleusercontent.com/-NG-2q7KB9sUHhpyU_p0THAGww-eZ_5HNQvaTCeBZVjbaSf0JUT56j58fnRdLiKVMiqNvSRblC1ocLuw5d7Kxd_bO-x8cjpRmk4DDg',
      enemyMaxHP: 70,
      enemyCurrentHP: 70,
      enemyMaxATK: 12,
      enemyHP: 100,
      enemyData: [],
      enemyTraits: [],
      //General Data
      minID: 1000,
      maxID: 8000,
      pureATK: 1,
      isDisabled: false,
      isCharge: false,
      youWin: false,
      youLose: false,
      finishLogin: false,
      isLoading: false,
      roundCounter: 1,
      yourAttackCounter: 0,
      enemyAttackCounter: 0,
      controlText: 'What will you do?',
      restartButton: 'RESTART',
      startButton: 'START GAME',
      loginError: '',
      data: 'Hello World',
    }
  },
  methods: {
    startGame(){
      this.isDisabled = true
      this.isLoading = true
      this.yourID = event.target.id
      console.log(this.yourID.length)
      if(this.yourID.length == 4){
        this.startButton = 'LOADING..'
        this.getYourBeast()
      } else {
        this.loginError = 'Ex: "0012" or "4082"'
      }
    },
    getYourBeast(){
      const options = {method: 'GET'}
      fetch('https://api.opensea.io/api/v1/asset/0xd539a3a5edb713e6587e559a9d007ffff92bd9ab/'+this.yourID, options)
        .then(response => response.json())
        .then(response => this.yourData.push(response))
        .then(response =>
          setTimeout(() => {
            console.log(this.yourID)
            this.setupYourBeast()
          }, 500)
         )
        .catch(err => console.error(err))
    },
    setupYourBeast(){
      this.yourID = this.yourData[0].token_id
      this.yourTraits = this.yourData[0].traits
      this.yourTraits.sort((a,b)=> (a.trait_type > b.trait_type ? 1 : -1))
      console.log(this.yourTraits)
      this.maxATK = this.yourTraits[16].value //This will break with 'Neck'

      this.yourPicture = this.yourData[0].image_url
      this.currentHP = this.yourTraits[9].value*10
      this.maxHP = this.currentHP
      this.yourHP = (this.currentHP/this.maxHP)*100
      console.log("Your HP = " + this.currentHP + "[" + this.yourHP +"]%")

      this.isDisabled = false
      this.finishLogin = true
    },
    getNewEnemy(){
      const options = {method: 'GET'}
      this.restartButton = 'LOADING..'
      this.enemyPicture = 'images/player_start.svg'
      this.isDisabled = true
      this.enemyData = []
      this.enemyID = Math.floor(Math.random()*(this.maxID-this.minID+1)+this.minID)
      fetch('https://api.opensea.io/api/v1/asset/0xd539a3a5edb713e6587e559a9d007ffff92bd9ab/'+this.enemyID, options)
        .then(response => response.json())
        .then(response => this.enemyData.push(response))
        .then(response =>
          setTimeout(() => {
            console.log(this.enemyID)
            this.resetGame()
          }, 500)
         )
        .catch(err => console.error(err))
    },
    resetGame(){

      this.enemyID = this.enemyData[0].token_id
      this.enemyPicture = this.enemyData[0].image_url

      this.enemyTraits = this.enemyData[0].traits
      this.enemyTraits.sort((a,b)=> (a.trait_type > b.trait_type ? 1 : -1))
      console.log(this.enemyTraits)

      this.enemyMaxATK = this.enemyTraits[16].value //This will break with 'Neck'+'Glass'+'Hat'
      this.enemyCurrentHP = this.enemyTraits[9].value*10
      this.enemyMaxHP = this.enemyCurrentHP
      this.enemyHP = (this.enemyCurrentHP/this.enemyMaxHP)*100
      console.log("New Enemy HP = " + this.enemyCurrentHP + "[" + this.enemyHP +"]%")

      //Fix Neck Bug
      if(typeof this.enemyMaxATK === 'string'){
        console.log("Found Neck Bug")
        this.enemyMaxATK = this.enemyTraits[18].value
      }

      if(this.youWin == false){
        console.log("Restart the game")
        this.roundCounter = 1
        this.youLose = false
        this.yourPicture = this.yourData[0].image_url
        this.currentHP = this.yourTraits[9].value*10
        this.maxHP = this.currentHP
        this.yourHP = (this.currentHP/this.maxHP)*100
        console.log("Your HP = " + this.currentHP + "[" + this.yourHP +"]%")
      } else{
        console.log("Continue to next round")
        this.roundCounter = this.roundCounter+1
        // if ((this.currentHP+15) < this.maxHP){
        //   this.currentHP = this.currentHP+15
        //   this.yourHP = (this.currentHP/this.maxHP)*100
        // }
      }

      this.controlText = 'What will you do?'
      this.youWin = false
      this.isDisabled = false
      this.restartButton = 'RESTART'
    },
    beastAttack() {
      this.pureATK = Math.floor((Math.random()*this.maxATK+1)+(this.maxATK/2))
      this.pureATK = Math.floor(this.pureATK*this.chargeATK)+5
      this.xATK = ""
      this.chargeATK = 1
      console.log("current Enemy HP = " + this.enemyCurrentHP + " | current Max Hp =" + this.enemyMaxHP)
      console.log("Your Attack = " + this.pureATK)
      this.enemyCurrentHP -= this.pureATK
      this.enemyHP = (this.enemyCurrentHP/this.enemyMaxHP)*100
      this.yourAttackCounter = this.yourAttackCounter+1
      console.log("current Enemy HP = " + this.enemyCurrentHP + "[" + this.enemyHP +"]%")
      this.isDisabled = true
      if (this.enemyHP <= 0){
        this.controlText = 'You Win!'
        this.youWin = true
        this.isDisabled = true
        this.enemyCurrentHP = 0
        this.enemyPicture = 'images/player_ko.svg'
        this.restartButton = 'NEXT ROUND'
        console.log("You Win")
      } else {
        setTimeout(() => {
          this.enemyAttack()
        }, 500)
      }
    },
    beastCharge() {
      this.chargeATK = Math.floor((Math.random() * 20) + 10)
      this.chargeATK = this.chargeATK/10
      this.xATK = " [X"+this.chargeATK+"]"
      console.log("Charge = X" + this.chargeATK)
      this.enemyHP = (this.enemyCurrentHP/this.enemyMaxHP)*100
      this.isCharge = true
      this.isDisabled = true
      setTimeout(() => {
        this.enemyAttack()
      }, 500)
    },
    enemyAttack() {
      console.log("Enemy Attact Back")
      this.pureATK = Math.floor((Math.random()*this.enemyMaxATK+1)+(this.enemyMaxATK/2));
      this.currentHP -= this.pureATK
      if (this.currentHP <= 0){
        this.currentHP = 0
      }
      this.yourHP = (this.currentHP/this.maxHP)*100
      this.enemyAttackCounter = this.enemyAttackCounter+1
      this.isDisabled = false
      if (this.yourHP <= 0){
        this.controlText = 'You Lose!'
        this.currentHP = 0
        this.chargeATK = 1
        this.xATK = ''
        this.youLose = true
        this.isDisabled = true
        this.yourPicture = 'images/player_ko.svg'
        console.log("You Lose")
      }
    }
  },
})

app.mount('#app')
