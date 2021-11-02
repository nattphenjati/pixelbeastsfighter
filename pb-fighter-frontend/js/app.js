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
      isDisabled: false,
      youWin: false,
      youLose: false,
      data: 'Hello World',
    }
  },
  methods: {
    async getUser(){
      //https://www.pixelbeasts.xyz/token/1082
      //https://randomuser.me/api
      const res = await fetch('https://www.pixelbeasts.xyz/token/1082')
      const { results } = await res.json()
      console.log(results)
      this.data = 'Check Code'
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
