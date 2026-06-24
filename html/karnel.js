//---------------------------------------------------------
// karnel.js Step 4: getElementById + SE HTML5 Audio
//---------------------------------------------------------
var display="";
var pushm;

// ============================================================
// SE command number -> extracted mp3
// #P uses se1.swf-style sustained channel
// #p uses se2.swf-style one-shot channel
// ============================================================
var SE1_COMMAND_MAP={
	1:"se1_c1.mp3",
	2:"se1_c2.mp3",
	3:"se1_c3.mp3",
	4:"se1_c4.mp3",
	6:"se1_c5.mp3",
	7:"se1_c6.mp3",
	8:"se1_c7.mp3",
	9:"se1_c8.mp3",
	10:"se1_c9.mp3",
	11:"se1_c10.mp3",
	12:"se1_c11.mp3"
};
var SE1_LOOP_MAP={
	1:true,
	2:true,
	3:true,
	4:true,
	6:true,
	7:true,
	8:true,
	9:true,
	10:false,
	11:true,
	12:true
};
var SE2_COMMAND_MAP={
	33:"se2_c1.mp3",
	34:"se2_c2.mp3",
	35:"se2_c3.mp3",
	36:"se2_c4.mp3",
	37:"se2_c5.mp3",
	38:"se2_c6.mp3",
	39:"se2_c7.mp3",
	40:"se2_c8.mp3",
	41:"se2_c9.mp3",
	42:"se2_c10.mp3",
	43:"se2_c11.mp3",
	44:"se2_c12.mp3",
	45:"se2_c13.mp3",
	46:"se2_c14.mp3",
	47:"se2_c15.mp3",
	48:"se2_c16.mp3",
	49:"se2_c17.mp3",
	50:"se2_c18.mp3",
	51:"se2_c19.mp3",
	52:"se2_c20.mp3",
	53:"se2_c21.mp3",
	54:"se2_c22.mp3",
	55:"se2_c23.mp3",
	56:"se2_c24.mp3",
	57:"se2_c17.mp3",
	58:"se2_c25.mp3",
	59:"se2_c26.mp3",
	60:"se2_c27.mp3",
	61:"se2_c28.mp3",
	62:"se2_c29.mp3"
};
var SE2_MACRO_MAP={
	52:{hits:3,intervalMs:333},
	57:{hits:4,intervalMs:250}
};

var SE_Folder="../se_mp3";
var SE_Audio1=null;
var SE_Audio2=null;
var SE_BurstTimers=[];
var SE_BurstAudios=[];

function _resetSeAudio(audio)
	{
	if (!audio) return;
	try{audio.pause();}catch(e){}
	try{
		if (audio.src) audio.currentTime=0;
		}
	catch(e){}
	audio.loop=false;
	}

function _clearSeBurstTimers()
	{
	var i;
	for(i=0;i<SE_BurstTimers.length;i++) clearTimeout(SE_BurstTimers[i]);
	SE_BurstTimers=[];
	}

function _stopSeBurstAudios()
	{
	var i,audio;
	for(i=0;i<SE_BurstAudios.length;i++)
		{
		audio=SE_BurstAudios[i];
		try{audio.pause();}catch(e){}
		}
	SE_BurstAudios=[];
	}

function _playSeFile(audio,file,loop)
	{
	_resetSeAudio(audio);
	audio.loop=!!loop;
	audio.src=SE_Folder+"/"+file;
	audio.load();
	audio.play().catch(function(e){
		if (typeof _dbg==="function") _dbg("SE play failed:",file,e&&e.message?e.message:e);
	});
	}

function _playSeBurst(file,hits,intervalMs)
	{
	var i;
	_clearSeBurstTimers();
	_stopSeBurstAudios();
	for(i=0;i<hits;i++)
		{
		(function(delay){
			var tid=setTimeout(function(){
				var audio=new Audio();
				audio.loop=false;
				audio.src=SE_Folder+"/"+file;
				SE_BurstAudios.push(audio);
				audio.play().catch(function(e){
					if (typeof _dbg==="function") _dbg("SE burst play failed:",file,e&&e.message?e.message:e);
				});
			},delay);
			SE_BurstTimers.push(tid);
		})(i*intervalMs);
		}
	}

// ============================================================
// SE playback
// ============================================================
function gose(num,sts)
	{
	var key=parseInt(num,10);
	var file,macro;
	if (sts)
		{
		file=SE1_COMMAND_MAP[key];
		if (!file)
			{
			if (typeof _dbg==="function") _dbg("SE map miss:","SE1","num="+num);
			return;
			}
		if (!SE_Audio1) SE_Audio1=new Audio();
		if (typeof _dbg==="function") _dbg("SE direct map:","SE1","num="+num,"->",file,"loop="+(SE1_LOOP_MAP[key]?"1":"0"));
		_playSeFile(SE_Audio1,file,SE1_LOOP_MAP[key]);
		return;
		}

	file=SE2_COMMAND_MAP[key];
	if (!file)
		{
		if (typeof _dbg==="function") _dbg("SE map miss:","SE2","num="+num);
		return;
		}
	macro=SE2_MACRO_MAP[key];
	if (macro)
		{
		if (typeof _dbg==="function") _dbg("SE macro map:","SE2","num="+num,"->",file,"x"+macro.hits);
		_resetSeAudio(SE_Audio2);
		_playSeBurst(file,macro.hits,macro.intervalMs);
		return;
		}
	if (!SE_Audio2) SE_Audio2=new Audio();
	if (typeof _dbg==="function") _dbg("SE direct map:","SE2","num="+num,"->",file);
	_clearSeBurstTimers();
	_stopSeBurstAudios();
	_playSeFile(SE_Audio2,file,false);
	}

function stopse(sts)
	{
	var audio;
	if (sts) audio=SE_Audio1; else audio=SE_Audio2;
	if (!sts)
		{
		_clearSeBurstTimers();
		_stopSeBurstAudios();
		}
	if (!audio) return;
	_resetSeAudio(audio);
	}

// ============================================================
// DOM getElementById
// ============================================================
function ShowLayer(Lyr)
	{
	document.getElementById(Lyr).style.visibility="visible";
	}
function HideLayer(Lyr)
	{
	document.getElementById(Lyr).style.visibility="hidden";
	}
function MoveLayer(Lyr,x,y)
	{
	var el=document.getElementById(Lyr);
	el.style.left=x+"px";
	el.style.top=y+"px";
	}
function ResizeObj(x,y)
	{
	var el=document.getElementById("MAINW");
	el.style.width=x+"px";
	el.style.height=y+"px";
	}
function MoveLayerX(Lyr,x)
	{
	document.getElementById(Lyr).style.left=x+"px";
	}
function MoveLayerY(Lyr,y)
	{
	document.getElementById(Lyr).style.top=y+"px";
	}
function WriteLayer(Lyr,html)
	{
	document.getElementById(Lyr).innerHTML=html;
	}
function PushMSG()
	{
	pushm=document.getElementById("SUBMSG").innerHTML;
	}
function PopMSG()
	{
	document.getElementById("SUBMSG").innerHTML=pushm;
	}

// ============================================================
// BGM compatibility shim
// ============================================================
function WriteBGM(file,loop)
	{
	var a;
	if (file=="")
		{
		MUS_StopMusic(10);
		}
	else{
		if (loop==-1) a=true;else a=false;
		if (nowskip) MUS_PlayMusic(file,100,a,0,0,false);
			else MUS_PlayMusic(file,100,a,8,0,false);
		}
	}

// ============================================================
function Quit()
	{
	window.close();
	}
