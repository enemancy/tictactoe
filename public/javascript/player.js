class Player{
    constructor(id,name,color,text){
        this.id = id;
        this.name = name;
        this.color = color;
        this.text = text;
        const tmp = this.name == "com";
        this.isCom = tmp;
    }
    checkClicked(checkBox){
        return checkBox.classList.contains(`box-${this.color}`);;
    }
}

export default Player;