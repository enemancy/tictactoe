class Player{
    constructor(id,name,color,text,isCom){
        this.id = id;
        this.name = name;
        this.color = color;
        this.text = text;
        this.isCom = isCom;
    }
    checkClicked(checkBox){
        return checkBox.classList.contains(this.color);;
    }
}

export default Player;