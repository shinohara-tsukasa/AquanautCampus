// ============================================================
// schedule.js — Step 7: SEQオブジェクト化
// 元: schedule.htm (frameset内別ページ)
// ============================================================
var SEQ = (function(){

var brn0=new Array(10);
var brn1=new Array(10);
var brn2=new Array(10);
var branch=false;
var Brkey=new Array(10);
var Brnum=0;
var Movie=0;
var cmd=["1:資料分析","2:凪と話す","3:さやかと話す","4:休憩する","1:海底探索","2:海域調査","3:資料分析","4:休憩する"];
var cmdhpd1=[5,0,0,0,30,15,15,0];
var cmdhpd2=[0,0,0,0,25,20,25,0];
var explor1=[0,10,20,35,50,65,80,95,110,130,150,999,999];
var explor2=[0, 3, 4, 5, 5, 5, 7, 9,10,10,12,10,20];
var explor3=["","水路の跡","土器のかけら","農耕器具らしき木片","金属器のかけら","錆びた金属器","完全な土器","農耕地跡","堤防の残骸","石棺のようなもの","住居跡","古代人の集落","海底神殿"];
var beforelevel=0,afterlevel=0;
var time=0,c1=0,c2=0,tzone=0;
var mycmd=0,nagicmd=0,cmdstp=0,exestp=0;
var paramraise=0;
var _chainAutoAdvance=false;
var _chainAdvanceTimer=null;
var CHAIN_RESULT_DELAY_MS=900;
var CHAIN_ACTION_BUFFER_MS=250;
var r=new Array(16);
var br=new Array(16);
var M=window;	// 元: top.MAIN

function _clearChainAdvance()
	{
	if (_chainAdvanceTimer)
		{
		clearTimeout(_chainAdvanceTimer);
		_chainAdvanceTimer=null;
		}
	}

function _setResultClickGuard()
	{
	if (typeof M.RESULT_CLICK_GUARD_MS==="undefined") return;
	M._resultClickGuardUntil=Date.now()+M.RESULT_CLICK_GUARD_MS;
	}

function _queueChainAdvance()
	{
	var delay;
	_clearChainAdvance();
	if (!_chainAutoAdvance) return;
	delay=_getChainAdvanceDelay();
	_chainAdvanceTimer=setTimeout(function(){
		_chainAdvanceTimer=null;
		if ((M.nowgame=="slg")&&(M.nowwin=="RESULT")) resultend();
		},delay);
	}

function _hasSecondActionThisTurn()
	{
	if (((tzone>=2)&&(tzone<=4))||((r[0]==36)&&(M.flg[30]==1)))
		{
		if ((r[0]>=23)&&(r[0]<=25)&&(f[6]==1)) return false;
		return true;
		}
	return false;
	}

function _hasDifferentQueuedActions()
	{
	return _hasSecondActionThisTurn() && (mycmd!=nagicmd);
	}

function _getCurrentResultCmd()
	{
	if (exestp==0) return mycmd;
	return nagicmd;
	}

function _getActionAdvanceDelay(cmd)
	{
	var frame=0,info;
	if ((cmd==0)||(cmd==6)) frame=6080;
	if (cmd==4) frame=6000;
	if (cmd==5) frame=6040;
	if (!frame) return CHAIN_RESULT_DELAY_MS;
	if (typeof FRAME_TO_SWF==="undefined") return CHAIN_RESULT_DELAY_MS;
	info=FRAME_TO_SWF[frame];
	if (!info||!info.duration) return CHAIN_RESULT_DELAY_MS;
	return Math.ceil(info.duration*1000)+CHAIN_ACTION_BUFFER_MS;
	}

function _getChainAdvanceDelay()
	{
	if (!_hasDifferentQueuedActions()) return CHAIN_RESULT_DELAY_MS;
	return _getActionAdvanceDelay(_getCurrentResultCmd());
	}

async function main()
	{
	var a,b,c,ed;
	r=M.reg;
	f=M.flg;
	console.log("[SEQ.main] reg[0]="+r[0]);
	_dbg("[SEQ.main] reg[0]="+r[0]+" tzone="+(r[0]%7));
	while (1==1){
	time=r[0];
	date=Math.floor((r[0]-6)/7);
	tzone=time%7;
	if (tzone==0)
		{
		addreg(1,35);
		addreg(2,40);
		}
	ed=null;
	switch (time)
		{
		case 1: ed=0;break;
		case 5: ed=1;break;
		case 7: ed=2;break;
		case 10: ed=3;break;
		case 12: ed=4;break;
		case 14: ed=5;break;
		case 17: ed=6;break;
		case 18: ed=7;break;
		case 19: ed=8;break;
		case 21: ed=9;break;
		case 24: if (f[6]==1) ed=10; break;
		case 26: ed=11;break;
		case 28: ed=12;break;
		case 31: ed=13;break;
		case 33: ed=14;break;
		case 34: ed=20;break;
		case 35: ed=15;break;
		case 38: ed=16;break;
		case 40: ed=17;break;
		case 41: ed=27;break;
		case 42: ed=18;break;
		case 43: ed=90;break;
		}
	if (ed!=null) {_dbg("[SEQ.main] → goevent("+ed+")");await goevent(ed);break;}
	if ((tzone==1)||(tzone==6))
		{
		cmdstp=0;
		_dbg("[SEQ.main] → menu branch, tzone="+tzone+" reg[0]="+r[0]);
		if ((r[0]==36)&&(M.flg[30]==1)) menu02();
		else menu01();
		break;
		}
	if ((tzone>=2)||(tzone<=4))
		{
		cmdstp=0;
		_dbg("[SEQ.main] → menu02 branch, tzone="+tzone+" reg[0]="+r[0]);
		menu02();
		break;
		}
		}
	}

function menu01()
	{
	_dbg("[SEQ.menu01] reg[0]="+r[0]+" tzone="+tzone);
	var str;
	if (tzone==1) {M.setposs(9);M.bgmon("01")}
	if (tzone==6) {M.setposs(21);M.bgmon("04")}
	str="<table border=1 width=480 cellspacing=1 cellpadding=2 bgcolor='#333355'>";
	str+="<tr><td align=center class=rsel nowrap>";
	if (r[1]>50) clr="<font color=white>";
	if ((r[1]<=50)&&(r[1]>25)) clr="<font color=yellow>";
	if (r[1]<=25) clr="<font color=red>";
	str+="教授の行動<br>"+clr+"(体力："+r[1]+"/100)</font>";
	str+="</td><td><table border=1 cellspacing=0 cellpadding=2 bgcolor='#333355'>";
	str+="<tr>";
	if (r[1]>=5) str+="<td class=sel onclick='SEQ.selit(0)'>";
	else str+="<td class=nosel>";
	str+=cmd[0]+"</td>";
	str+="<td class=sel onclick='SEQ.selit(1)'>";
	str+=cmd[1]+"</td></tr>";
	str+="<tr><td class=sel onclick='SEQ.selit(2)'>";
	str+=cmd[2]+"</td>";
	str+="<td class=sel onclick='SEQ.selit(3)'>";
	str+=cmd[3]+"</td></tr>";
	str+="</table></td></tr></table>";
	str+="<table border=1 width=480 cellspacing=1 cellpadding=0 bgcolor='#333355'>";
	str+="<tr><td class=pal>探索</td><td class=pal2>"+r[4]+"</td>";
	str+="<td class=pal>情報</td><td class=pal2>"+r[5]+"</td>";
	str+="<td class=pal>把握</td><td class=pal2>"+r[6]+"</td>";
	str+="<td class=pal>発見</td><td class=pal2>"+r[3]+"</td>";
	str+="</tr></table>";
	M.nowgame="off";
	M.syson();
	M.WriteLayer("TEXT",str);
	M.nowwin="cmd1";
	}

function menu02()
	{
	console.log("[SEQ.menu02] reg[0]="+r[0]+" tzone="+tzone);
	_dbg("[SEQ.menu02] reg[0]="+r[0]+" tzone="+tzone+" cmdstp="+cmdstp);
	var str,hp,ss;
	if (cmdstp==0)
		{
		if (r[0]==18) M.bgmon("18");
		if ((r[0]>=36)&&(r[0]<=39)) M.bgmon("23");
		if ((r[0]>=43)&&(r[0]<=46)) M.bgmon("03");
		if ((r[0]<36)&&(r[0]!=18))  M.bgmon("02");
		ss=false;
		if ((r[0]==18)||(r[0]==38)||(r[0]==39)) {M.setposs(1000);ss=true;}
		if ((r[0]==36)||((tzone==2)&&(r[0]!=37))) {window.__slgFadeC6=(r[0]==2);M.setposs(370);M.seon(44,false);ss=true;}
		if (!ss) M.setposs(385);
		}
	if (cmdstp==2) cmdstp=0;
	str="<table border=1 width=480 cellspacing=0 cellpadding=2 bgcolor='#333355'>";
	str+="<tr><td align=center class=rsel nowrap>";
	if (cmdstp==0) {hp=r[1];str+="教授の行動";hpd=cmdhpd1;}
	else {hp=r[2];str+="凪の行動";hpd=cmdhpd2}
	if (hp>50) clr="<font color=white>";
	if ((hp<=50)&&(hp>25)) clr="<font color=yellow>";
	if (hp<=25) clr="<font color=red>";
	str+="<br>"+clr+"(体力："+hp+"/100)</font>";
	str+="</td><td><table border=1 cellspacing=1 cellpadding=2 bgcolor='#333355'><tr>";
	if (hp>=hpd[4]) str+="<td class=sel onclick='SEQ.selit(4)'>";
	else str+="<td class=nosel>";
	str+=cmd[4]+"</td>";
	if (hp>=hpd[5]) str+="<td class=sel onclick='SEQ.selit(5)'>";
	else str+="<td class=nosel>";
	str+=cmd[5]+"</td></tr><tr>";
	if (hp>=hpd[6]) str+="<td class=sel onclick='SEQ.selit(6)'>";
	else str+="<td class=nosel>";
	str+=cmd[6]+"</td>";
	if (hp>=hpd[7]) str+="<td class=sel onclick='SEQ.selit(7)'>";
	else str+="<td class=nosel>";
	str+=cmd[7]+"</td></tr><tr>";
	str+="</table></td></tr></table>";
	str+="<table border=1 width=480 cellspacing=1 cellpadding=0 bgcolor='#333355'>";
	str+="<tr><td class=pal>探索</td><td class=pal2>"+r[4]+"</td>";
	str+="<td class=pal>情報</td><td class=pal2>"+r[5]+"</td>";
	str+="<td class=pal>把握</td><td class=pal2>"+r[6]+"</td>";
	str+="<td class=pal>発見</td><td class=pal2>"+r[3]+"</td>";
	str+="</tr></table>";
	M.syson();
	M.nowgame="off";
	M.WriteLayer("TEXT",str);
	M.nowwin="cmd2";
	}

function selit(num)
	{
	var a;
	M.focus();
	if (((tzone>=2)&&(tzone<=4))||((r[0]==36)&&(M.flg[30]==1)))
		{
		if (cmdstp==0)
			{
			if (r[1]<cmdhpd1[num]) return;
			M.nowwin="";
			M.WriteLayer("TEXT","");
			mycmd=num;
			if ((r[0]>=23)&&(r[0]<=25)&&(f[6]==1)) {nagicmd=0;_chainAutoAdvance=false;}
			else {cmdstp=1;menu02();return;}
			}
		else	{
			if (r[2]<cmdhpd2[num]) return;
			M.nowwin="";
			M.WriteLayer("TEXT","");
			nagicmd=num;
			_chainAutoAdvance=false;	// ★教授結果→凪結果はクリックで進める(自動進行を無効化、篠原指示)。原作はクリック送り
			}
		}
	else	{
		if (r[1]<cmdhpd1[num]) return;
		M.nowwin="";
		M.WriteLayer("TEXT","");
		mycmd=num;nagicmd=0;
		_chainAutoAdvance=false;
		}
	_clearChainAdvance();
	exestp=0;
	a=events();
	if (a!=null) goevent(a);
	else execommand();
	}

function execommand()
	{
	var a,b,i;
	_getsts();
	beforelevel=r[13];
	if (exestp==0)
		{
		subreg(1,cmdhpd1[mycmd]);
		switch(mycmd)
			{
			case 0: a=Math.floor(r[5]/5)+4;
				addreg(6,a);
				M.setposs(6080,true);
				break;
			case 3: addreg(1,35);
				break;
			case 4: a=Math.floor(r[6]/10);
				addreg(1,a);
				a=Math.floor(r[6]/6)+2;
				i=r[13]+1;
				b=explor1[i];
				if (r[4]+a>b) a=(b-r[4]);
				addreg(4,a);
				M.setposs(6000,true);
				M.seon(59,false);
				break;
			case 5: a=Math.floor(r[6]/5)+2;
				addreg(5,a);
				M.setposs(6040,true);
				break;
			case 6: a=Math.floor(r[5]/6)+2;
				addreg(6,a);
				M.setposs(6080,true);
				break;
			case 7: addreg(1,25);
				break;
			}
		}
	else	{
		subreg(2,cmdhpd2[nagicmd]);
		switch(nagicmd)
			{
			case 4: a=Math.floor(r[6]/10);
				addreg(2,a);
				a=Math.floor(r[6]/5)+3;
				i=r[13]+1;
				b=explor1[i];
				if (r[4]+a>b) a=(b-r[4]);
				addreg(4,a);
				M.setposs(6000,true);
				M.seon(59,false);
				break;
			case 5: a=Math.floor(r[6]/5)+3;
				addreg(5,a);
				M.setposs(6040,true);
				break;
			case 6: a=Math.floor(r[5]/7)+4;
				addreg(6,a);
				M.setposs(6080,true);
				break;
			case 7: addreg(2,30);
				break;
			}
		}
	Movie=0;
	movieend();
	}

function movieend()
	{
	_dbg("[SEQ.movieend] Movie="+Movie+" exestp="+exestp);
	var a,s,weatherFrame;
	r=M.reg;
	if (Movie==0)
		{
		if (exestp==0)
			{
			switch(mycmd)
				{
				case 0:
				case 6: cmdresult("教授：資料分析<br>把握レベルが"+paramraise+"上がった。");
					break;
				case 3: cmdresult("教授：休息<br>体力が３５回復した。");
					break;
				case 4: s="教授：海底探索<br>探索レベルが"+paramraise+"上がった。<br>";
					afterlevel=calclevel();
					if (beforelevel!=afterlevel){
					s+="<font color=yellow>";
					s+=explor3[afterlevel]+"を発見した！！";
					addreg(3,explor2[afterlevel]);
					addreg(13,1);}
					cmdresult(s);
					break;
				case 5: cmdresult("教授：海域調査<br>情報レベルが"+paramraise+"上がった。");
					break;
				case 7: cmdresult("教授：休息<br>体力が２５回復した。");
					break;
				}
			}
		else	{
			switch(nagicmd)
				{
				case 4: s="凪：海底探索<br>探索レベルが"+paramraise+"上がった。<br>";
					afterlevel=calclevel();
					if (beforelevel!=afterlevel){
					s+="<font color=yellow>";
					s+=explor3[afterlevel]+"を発見した！！";
					addreg(3,explor2[afterlevel]);
					addreg(13,1);}
					cmdresult(s);
					break;
				case 5: cmdresult("凪：海域調査<br>情報レベルが"+paramraise+"上がった。");
					break;
				case 6: cmdresult("凪：資料分析<br>把握レベルが"+paramraise+"上がった。");
					break;
				case 7: cmdresult("凪：休息<br>体力が３０回復した。");
					break;
				}
			}
		return;
		}
	if (Movie==1) {M.PF2();}
	if (Movie==2)
		{
		date=Math.floor((r[0]-6)/7);
		M.nowwin="none";
		if (typeof M.startDayTransitionSequence==="function")
			{
			weatherFrame=0;
			if (date==5) weatherFrame=7360;
			else if ((date==3)&&(M.flg[21]==1)) weatherFrame=0;
			else if ((date==3)&&(M.flg[22]==1)) weatherFrame=7420;
			else if ((date==1)||(date==4)||(date==5)) weatherFrame=7400;
			else weatherFrame=7350;
			if (M.startDayTransitionSequence(date,weatherFrame))
				{
				Movie=4;
				return;
				}
			}
		Movie=3;
		M.setposs(7000+date*50);
		return;
		}
	if (Movie==3)
		{
		date=Math.floor((r[0]-6)/7);
		Movie=4;
		if (date==5) {M.setposs(7360);return;}
		if ((date==3)&&(M.flg[21]==1)) {Movie=0;M.nowwin="";main();return;}
		if ((date==3)&&(M.flg[22]==1)) {M.setposs(7420);return;}
		if ((date==1)||(date==4)||(date==5)) {M.setposs(7400);return;}
		M.setposs(7350);
		return;
		}
	if (Movie==4)
		{
		Movie=0;M.nowwin="";
		main();
		return;
		}
	}

function resultend()
	{
	_dbg("[SEQ.resultend] tzone="+tzone+" exestp="+exestp+" reg[0]="+r[0]);
	_clearChainAdvance();
	M.nowgame="off";
	if ((tzone>=2)&&(tzone<=4)&&(exestp==0))
		{
		if ((r[0]>=23)&&(r[0]<=25)&&(f[6]==1)) timegoes();
		else {exestp=1;execommand();}
		}
	else	{
		if ((r[0]==36)&&(exestp==0)) {exestp=1;execommand();}
		else timegoes();
		}
	}

function timegoes()
	{
	_clearChainAdvance();
	_chainAutoAdvance=false;
	r=M.reg;	// ★ main()未実行時もreg参照を確保
	r[0]++;
	console.log("[SEQ.timegoes] reg[0]="+r[0]);
	_dbg("[SEQ.timegoes] reg[0]="+r[0]+" tzone="+(r[0]%7));
	tzone=r[0]%7;
	if (tzone==0)
		{
		M.gamesave(9);
		M.nowwin="none";
		M.sysoff();
		M.WriteLayer("TEXT","");
		Movie=1;
		M.bgmoff();
		if (M.cfg_anime) M.setposs(500);else {M.setposs(74);M.PF2();}
		}
	else main();
	}

function _getsts()
	{
	for(var i=0;i<=15;i++) br[i]=r[i];
	}

function cmdresult(str)
	{
	var sts,c1,c2,c3,c4;
	var cr1="<font color=white>";
	var cr2="<font color=yellow>↑";
	var cr3="<font color=red>↓";
	if (br[4]==r[4]) c1=cr1; if (br[4]>r[4]) c1=cr3; if (br[4]<r[4]) c1=cr2;
	if (br[5]==r[5]) c2=cr1; if (br[5]>r[5]) c2=cr3; if (br[5]<r[5]) c2=cr2;
	if (br[6]==r[6]) c3=cr1; if (br[6]>r[6]) c3=cr3; if (br[6]<r[6]) c3=cr2;
	if (br[3]==r[3]) c4=cr1; if (br[3]>r[3]) c4=cr3; if (br[3]<r[3]) c4=cr2;
	sts="<table border=1 width=480 cellspacing=1 cellpadding=2 bgcolor='#333355'>";
	// ★発見あり(3行=<br>2個)のときだけ行間を詰めて枠が膨らむのを抑える(原作者要望)。通常(2行)は既定のまま。
	var _rselStyle=(((str.match(/<br>/g)||[]).length)>=2)?" style='line-height:1.05'":"";
	sts+="<tr><td class=rsel nowrap"+_rselStyle+">"+str+"</td></tr><tr><td>";
	sts+="<table border=1 width=480 cellspacing=1 cellpadding=0 bgcolor='#333355'>";
	sts+="<tr><td class=pal>探索</td><td class=pal2>"+c1+r[4]+"</td>";
	sts+="<td class=pal>情報</td><td class=pal2>"+c2+r[5]+"</td>";
	sts+="<td class=pal>把握</td><td class=pal2>"+c3+r[6]+"</td>";
	sts+="<td class=pal>発見</td><td class=pal2>"+c4+r[3]+"</td>";
	sts+="</tr></table></td></tr></table>";
	M.nowgame="slg";
	M.nowwin="RESULT";
	_setResultClickGuard();
	M.WriteLayer("TEXT",sts);
	_queueChainAdvance();
	}

function events()
	{
	var result;
	c1=mycmd; c2=nagicmd; result=null;
	if ((r[0]==36)&&(M.flg[30]==0)) {result=26;return result;}
	switch (c1)
		{
		case 0: result=events0();break;
		case 1: result=events1();break;
		case 2: result=events2();break;
		case 3: result=events3();break;
		case 4: result=events4();break;
		case 5: result=events5();break;
		case 6: result=events6();break;
		case 7: result=events7();break;
		}
	return result;
	}

function events7(){return null;}
function events4(){return null;}
function events5(){return null;}
function events6(){return null;}

function events1()
	{
	var result=null;
	if (time==6) result=40;
	if (time==8) result=41;
	if (time==13) result=42;
	if (time==15) result=43;
	if (time==20) result=44;
	if (time==22) result=45;
	if (time==27) result=46;
	if (time==29) result=47;
	if (time==36) result=26;
	return result;
	}

function events2()
	{
	var result=null;
	if (time==6) result=60;
	if (time==8) result=61;
	if (time==13) result=62;
	if (time==15) result=63;
	if (time==20) result=64;
	if (time==22) result=65;
	if (time==27) result=66;
	if (time==29) result=67;
	if (time==36) result=26;
	return result;
	}

function events0()
	{
	var result=null;
	if (time==36) result=26;
	return result;
	}

function events3()
	{
	var result=null;
	if (time==36) result=26;
	return result;
	}

async function goevent(num)
	{
	_dbg("[SEQ.goevent] num="+num+" reg[0]="+M.reg[0]);
	M.skip=false;
	await M.readfile(""+num);
	}

function endevent(status)
	{
	if (window._debugMode) { if (typeof window._showDebugMenu==="function") window._showDebugMenu(); return; }	// ★デバッグ: イベント終了(#e/#E)で一覧へ復帰
	console.log("[SEQ.endevent] status="+status+" reg[0]="+M.reg[0]);
	try{_dbg("[SEQ.endevent] status="+status+" reg[0]="+M.reg[0]+" tzone="+(M.reg[0]%7));}catch(e){console.error("_dbg failed in endevent:",e);}
	M.closefile();
	if (status)
		{
		if ((tzone==1)||(tzone==6)) {menu01();return;}
		if ((tzone>=2)||(tzone<=4)) {cmdstp=0;menu02();return;}
		}
	else timegoes();
	}

function addreg(num,val)
	{
	r[num]+=val;
	if ((num==1)||(num==2)) {if (r[num]>100) r[num]=100;}
	paramraise=val;
	}

function subreg(num,val)
	{
	r[num]-=val;
	if (r[num]<0) r[num]=0;
	}

function calclevel()
	{
	var i,rv,sts;
	rv=-1;
	sts=M.reg[13]+1;
	if (M.reg[4]>=explor1[sts]) rv=sts;
	else rv=M.reg[13];
	return rv;
	}

// --- 公開API ---
return {
	get Movie(){ return Movie; },
	set Movie(v){ Movie=v; },
	get cmdstp(){ return cmdstp; },
	set cmdstp(v){ cmdstp=v; },
	main: main,
	movieend: movieend,
	selit: selit,
	endevent: endevent,
	resultend: resultend,
	menu01: menu01,
	menu02: menu02
};

})();
