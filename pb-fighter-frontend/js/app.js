const app = Vue.createApp({
  data(){
    return{
      beastID: '4082',
      maxHP: 70,
      maxSP: 70,
      beastPicture: 'images/pb4082.png',
      enemyHP: 100,
      youWin: false,
      minATK: 1,
      maxATK: 12,
      numberATK: 1,
    }
  },
  methods: {
    beastAttack() {
      this.numberATK = Math.floor(Math.random()*(this.maxATK-this.minATK+1)+this.minATK);
      console.log("Your Attack = " + this.numberATK)
      this.enemyHP -= this.numberATK;
      console.log("Enemy HP = " + this.enemyHP)
        if (this.enemyHP <= 0){
          this.youWin = true;
          console.log("You Win")
        }
    },
  },
})

app.mount('#app')
