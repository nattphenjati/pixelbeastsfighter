const app = Vue.createApp({
  data(){
    return{
      beastID: '4082',
      maxHP: 70,
      currentHP: 70,
      yourHP: 100,
      maxSP: 70,
      beastPicture: 'images/pb4082.png',
      enemyHP: 100,
      youWin: false,
      youLose: false,
      minATK: 1,
      maxATK: 12,
      numberATK: 1,
      isDisabled: false,
    }
  },
  methods: {
    beastAttack() {
      this.numberATK = Math.floor(Math.random()*(this.maxATK-this.minATK+1)+this.minATK);
      console.log("Your Attack = " + this.numberATK)
      this.enemyHP -= this.numberATK
      this.isDisabled = true
      console.log("Enemy HP = " + this.enemyHP)
      if (this.enemyHP <= 0){
        this.youWin = true
        this.isDisabled = true
        console.log("You Win")
      } else {
        setTimeout(() => {
          this.enemyAttack()
        }, 500)
      }
    },
    enemyAttack() {
      console.log("Enemy Attact Back")
      this.numberATK = Math.floor(Math.random()*(this.maxATK-this.minATK+1)+this.minATK);
      this.currentHP -= this.numberATK
      this.yourHP = (this.currentHP/this.maxHP)*100
      this.isDisabled = false
      if (this.yourHP <= 0){
        this.youLose = true
        this.isDisabled = true
        console.log("You Lose")
      }
    }
  },
})

app.mount('#app')
