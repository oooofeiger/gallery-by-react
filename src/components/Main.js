require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

var imageData = require('../data/imageData.json');
// let yeomanImage = require('../images/yeoman.png');

//获取图片数据
imageData = (function genImageURL(imageDataArr){
	for(var i = 0, j=imageDataArr.length; i< j; i++){
		var singleImageData = imageDataArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageData);

//获取区间内的随机数
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

//获取0~30°之间的一个任意正负值
function get30DegRandom(){
	return ((Math.random() > 0.5 ? '':'-') + Math.ceil(Math.random()* 30));
}


class ImgFigure extends React.Component{
	constructor(){
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		

		e.stopPropagation();
		e.preventDefault();
	};

	render(){
		var styleObj = {};

		//如果props属性中指定了图片位置，则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		var imgFigureClassName = 'img-figure';
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		//如果图片的旋转角有指且不为零，添加角度
		if(this.props.arrange.rotate){
			(['Moz','ms','Webkit','']).forEach(function(value){
				if(value !== ''){
					styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
				}else{
					styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
				}
			}.bind(this))
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}

class ControllerUnit extends React.Component{
	constructor(){
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e){
		//如果点击的是当前正在选中的按钮，则翻转图片，否则将对应图片居中
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render(){
		var controllerUnitClassName = "controller-unit";
		//如果对应的是居中态图片，显示控制按钮的居中态
		if(this.props.arrange.isCenter){
			controllerUnitClassName += " is-center";

			//如果同时对应的是翻转图片，显示控制按钮的翻转态
			if(this.props.arrange.isInverse){
				controllerUnitClassName += " is-inverse";
			}
		}


		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		)
	}
}

class AppComponent extends React.Component {
  Constant = {
  	centerPos : {
  		left:0,
  		right:0
  	},
  	hPosRange : { 		//水平方向的取值范围
  		leftSecX : [0,0],
  		rightSecX : [0,0],
  		y:[0,0]
  	},
  	vPosRange : {		//垂直方向的取值范围
  		x: [0,0],
  		topY : [0,0]
  	}
  }

  /*
   *反转图片
   *@param index 输入当前被执行翻转函数的图片索引值
   *@return ｛function｝这是一个闭包函数
   */
   inverse(index){
   	return function(){
   		var imgsArrangeArr = this.state.imgsArrangeArr;

   		imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

   		this.setState({
   			imgsArrangeArr : imgsArrangeArr
   		});

   		console.log(this.state.imgsArrangeArr[index].isInverse)
   	}.bind(this);
   }

   /*
    *利用rerange函数居中对应index的图片
    *@param index
    *return ｛function｝
    */
    center(index){
    	return function(){
    		this.rearrange(index);
    	}.bind(this);
    }

  /*
   *重新布局所有图片
   *@param centerIndex 指定居中排布哪张图片
   */
   rearrange(centerIndex){
   		var imgsArrangeArr = this.state.imgsArrangeArr,
   			Constant = this.Constant,
   			centerPos = Constant.centerPos,
   			hPosRange = Constant.hPosRange,
   			vPosRange = Constant.vPosRange,
   			hPosRangeLeftSecX = hPosRange.leftSecX,
   			hPosRangeRightSecX = hPosRange.rightSecX,
   			hPosRangeY = hPosRange.y,
   			vPosRangeTopY = vPosRange.topY,
   			vPosRangeX = vPosRange.x;

   		var	imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1); //拿到中间位置的图片信息，splice返回被删除的数组
   			imgsArrangeCenterArr[0] = {pos:centerPos,rotate:0,isCenter:true};//剧中图片的位置,不需要旋转,且居中


   		var	imgsArrangeTopArr = [],
   			topImgNum = Math.floor(Math.random()*2),  // 上部区域取一个图片或者不取
   			topImgSpliceIndex = 0,   //上部区域图片的索引值

   			//取出要布局上侧的图片状态信息
   			topImgSpliceIndex = Math.floor(Math.random()*(imgsArrangeArr.length - topImgNum)),
   			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
   			
   			//布局位于上侧的图片
   			imgsArrangeTopArr.forEach(function(value, index){
   				imgsArrangeTopArr[index] = {
   					pos : {
	   					top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
	   					left : getRangeRandom(vPosRangeX[0],vPosRangeX[1])
	   				},
	   				rotate : get30DegRandom(),
	   				isCenter : false
   				}
   			});

   			//布局左右两侧的图片
   			for(var i = 0, j = imgsArrangeArr.length, k = j/2; i < j ; i++){
   				var hPosRangeLORX = null;

   				//前半部分布局左边，后半部分布局右边
   				if(i < k){
   					hPosRangeLORX = hPosRangeLeftSecX;
   				}else{
   					hPosRangeLORX = hPosRangeRightSecX;
   				}

   				imgsArrangeArr[i] = {
   					pos : {
	   					top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
	   					left : getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
	   				},
	   				rotate : get30DegRandom(),
	   				isCenter : false
   				}
   			}

   			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
   				imgsArrangeArr.splice(topImgSpliceIndex, 0 , imgsArrangeTopArr[0])
   			}

   			imgsArrangeArr.splice(centerIndex,0, imgsArrangeCenterArr[0]);

   			console.log(imgsArrangeArr.length)
   			
   			this.setState({
   				imgsArrangeArr : imgsArrangeArr
   			})
   			
   };

   constructor(){
   	super();
   	this.state = {			//初始化状态信息
   		imgsArrangeArr : [
   			// {
   			// 	pos: {
	   		// 		left:0,
	   		// 		top:0
	   		// 	},
	   		// 	rotate : 0,  //图片旋转角度
	   		//  isInverse : false ,  //图片正反面状态
	   		//  isCenter : false     //图片是否居中
   			// }
   		]
   	}
   }
  

  componentDidMount(){   //组件加载以后为每一张图片计算其位置范围
  	var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
  		stageW = stageDOM.scrollWidth,
  		stageH = stageDOM.scrollHeight,
  		halfStageW = Math.ceil(stageW/2),
  		halfStageH = Math.ceil(stageH/2);

  	//拿到图片的大小
  	var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
  		imgW = imgFigureDom.scrollWidth,
  		imgH = imgFigureDom.scrollHeight,
  		halfImgW = Math.ceil(imgW/2),
  		halfImgH = Math.ceil(imgH/2); 

  	//计算中心图片的位置点
  	this.Constant.centerPos = {
  		left: halfStageW - halfImgW,
  		top: halfStageH - halfImgH
  	}

  	//计算左右两侧的图片排布区域取值范围
  	this.Constant.hPosRange.leftSecX[0] = -halfImgW/3;
  	this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
  	this.Constant.hPosRange.rightSecX[0] = halfStageW + imgW;
  	this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW*2/3;

  	this.Constant.hPosRange.y[0] = -halfImgH;
  	this.Constant.hPosRange.y[1] = stageH - halfImgH;

  	//计算上侧的图片排布区域取值范围 
  	this.Constant.vPosRange.topY[0] = -halfImgH;
  	this.Constant.vPosRange.topY[1] = halfStageH-halfImgH*3;
  	this.Constant.vPosRange.x[0] = halfStageW - imgW;
  	this.Constant.vPosRange.x[1] = halfStageW;

  	this.rearrange(0);
  }

  render() {
	var controllerUnits = [],
		imgFigures = [];

	imageData.forEach(function(value, index){
		if(!this.state.imgsArrangeArr[index]){
			this.state.imgsArrangeArr[index] = {
				pos:{
					left:0,
					top:0
				},
				rotate:0,
				isInverse: false,
				isCenter: false
			}
		}
		imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
	}.bind(this));


    return (
      <section className="stage" ref="stage">
      	<section className="img-sec">{imgFigures}</section>
      	<nav className="controller-nav">{controllerUnits}</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
