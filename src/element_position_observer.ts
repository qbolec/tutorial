///<reference path="control.ts"/>
///<reference path="../externals/jquery.d.ts"/>
module Tutorial {
  export class ElementPositionObserver extends Tutorial.Control {
    timer=null;
    defaults(){
      return {
        element:null,
        width:0,
        height:0,
        top:0,
        left:0,
      }
    }
    updatePosition(){
      var element=$(this.get('element'));
      if(element.length==1){
        this.set(_.extend({
          width: element.outerWidth(),
          height:element.outerHeight(),
        },element.offset()));
      }else{
        this.set('left',this.get('left')+this.get('width')/2);
        this.set('width',0);
        this.set('top',this.get('top')+this.get('height')/2);
        this.set('height',0);
      }
    }
    initialize(){
      this.timer=setInterval(()=>this.updatePosition(),100);
      this.listenTo(this,'change:element',this.updatePosition);
      this.updatePosition();
    }
    quit(){
      window.clearInterval(this.timer);
    }
  }
}
