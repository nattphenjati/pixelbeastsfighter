const app = Vue.createApp({
  data(){
    return{
      //Player One Data
      beastID: '4082',
      beastPicture: 'https://lh3.googleusercontent.com/-NG-2q7KB9sUHhpyU_p0THAGww-eZ_5HNQvaTCeBZVjbaSf0JUT56j58fnRdLiKVMiqNvSRblC1ocLuw5d7Kxd_bO-x8cjpRmk4DDg',
      maxHP: 7*10,
      currentHP: 7*10,
      yourHP: 100,
      maxSP: 11*10,
      minATK: 1,
      maxATK: 12,
      pureATK: 1,
      //Enemy Data
      enemyID: '8972',
      enemyPicture: 'https://lh3.googleusercontent.com/6YrLmeS3ghrWFbgWZXN5FVqafY5rqIC6RcQA33Xxj-tMrArkTHAdMKZc6Cv4yzeyUeWafGpeeNIwgc4QpQgRvknQm5drSEBho4zcIQ',
      enemyMaxHP: 17*10,
      enemyCurrentHP: 17*10,
      enemyMinATK: 1,
      enemyMaxATK: 15,
      enemyHP: 100,
      //General Data
      minID: 1000,
      maxID: 8000,
      isDisabled: false,
      youWin: false,
      youLose: false,
      enemyData: [],
      data: 'Hello World',
    }
  },
  methods: {
    async getUser(){
      this.enemyID = Math.floor(Math.random()*(this.maxID-this.minID+1)+this.minID);
      const options = {method: 'GET'};
      fetch('https://api.opensea.io/api/v1/asset/0xd539a3a5edb713e6587e559a9d007ffff92bd9ab/'+this.enemyID, options)
        .then(response => response.json())
        // .then(response => console.log(response))
        .then(response => this.enemyData.push(response))
        .then(response => this.data = this.enemyData[0].token_id)
        .then(response => this.enemyID = this.enemyData[0].token_id)
        .then(response => this.enemyPicture = this.enemyData[0].image_url)
        .then(response => this.enemyCurrentHP = this.enemyData[0].traits[1].value*10)
        .then(response => this.enemyMaxHP = this.enemyData[0].traits[1].value*10)
        .then(response => this.enemyMaxATK = this.enemyData[0].traits[4].value)
        .catch(err => console.error(err))
    },
    beastAttack() {
      this.pureATK = Math.floor(Math.random()*(this.maxATK-this.minATK+1)+this.minATK);
      console.log("Your Attack = " + this.pureATK)
      this.enemyCurrentHP -= this.pureATK
      console.log("Enemy HP = " + this.enemyCurrentHP)
      this.enemyHP = (this.enemyCurrentHP/this.enemyMaxHP)*100
      this.isDisabled = true
      if (this.enemyHP <= 0){
        this.youWin = true
        this.isDisabled = true
        this.enemyPicture = 'images/player_ko.svg'
        console.log("You Win")
      } else {
        setTimeout(() => {
          this.enemyAttack()
        }, 500)
      }
    },
    enemyAttack() {
      console.log("Enemy Attact Back")
      this.pureATK = Math.floor(Math.random()*(this.enemyMaxATK-this.enemyMinATK+1)+this.enemyMinATK);
      this.currentHP -= this.pureATK
      if (this.currentHP <= 0){
        this.currentHP = 0
      }
      this.yourHP = (this.currentHP/this.maxHP)*100
      this.isDisabled = false
      if (this.yourHP <= 0){
        this.youLose = true
        this.isDisabled = true
        this.beastPicture = 'images/player_ko.svg'
        console.log("You Lose")
      }
    }
  },
})

app.mount('#app')
