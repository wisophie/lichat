export default{
	dateTime(e){
		let old=new Date(e)
		let now = new Date();
		let d =old.getTime()
		let h =old.getHours()
		let m =old.getMinutes()
		let Y =old.getFullYear();
		let M =old.getMonth()+1;
		let D =old.getDate();
		
		let nd =now.getTime();
		let nh =now.getHours();
		let nm =now.getMinutes();
		let nY =now.getFullYear();
		let nM =now.getMonth()+1;
		let nD =now.getDate();
		if(D===nD && M===nM && Y===nY){
			if(h<10){h='0'+h}
			if(m<10){m='0'+m}
			return h+':'+m
		}
		
		//昨天时间
		if(D+1===nD && M===nM && Y===nY){
			if(h<10){h='0'+h}
			if(m<10){m='0'+m}
			return '昨天'+h+':'+m
		}else return Y+'/'+M+'/'+D
		
	},
	//聊天时间
	dateTime1(e){
		let old=new Date(e)
		let now = new Date();
		let d =old.getTime()
		let h =old.getHours()
		let m =old.getMinutes()
		let Y =old.getFullYear();
		let M =old.getMonth()+1;
		let D =old.getDate();
		
		let nd =now.getTime();
		let nh =now.getHours();
		let nm =now.getMinutes();
		let nY =now.getFullYear();
		let nM =now.getMonth()+1;
		let nD =now.getDate();
		if(D===nD && M===nM && Y===nY){
			if(h<10){h='0'+h}
			if(m<10){m='0'+m}
			return h+':'+m
		}
		
		//昨天时间
		if(D+1===nD && M===nM && Y===nY){
			if(h<10){h='0'+h}
			if(m<10){m='0'+m}
			return '昨天 '+h+':'+m
		}else if(Y===nY){
			//今年
			if(h<10){h='0'+h}
			if(m<10){m='0'+m}
			return M+'月'+D+'日 '+h+':'+m
		}else{
			//大于今年
			if(h<10){h='0'+h}
			if(m<10){m='0'+m}
			return Y+'年'+M+'月'+D+'日 '+h+':'+m
		}
		
	},
	//间隔时间差
	spacTime(old,now){
		old=new Date(old)
		now=new Date(now)
		var told=old.getTime();
		var tnow=now.getTime();
		if(told>(tnow+1000*60*5)){
			return now;
		}else return ''
	}
}
