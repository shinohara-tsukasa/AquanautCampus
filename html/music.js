// ********************************************************************
// ＢＧＭ音量制御用変数
// ********************************************************************
var MUS_NowFading=false;
var MUS_ChannelVolume=new Array(10);
var MUS_ChannelFader=new Array(10);
var MUS_ChannelFile=new Array(10);
var MUS_ChannelNextFile=new Array(10);
var MUS_ChannelLoop=new Array(10);
var MUS_ChannelDelta=new Array(10);
var MUS_ChannelStop=new Array(10);
var MUS_ChannelPlaying=new Array(10);
var MUS_ChannelFadetime=new Array(10);
var MUS_ChannelBeforeVolume=new Array(10);

var MUS_MasterVolume=100;
var MUS_RelVolume=new Array(10);
var MUS_PlayingChannel=1;
var MUS_TID;
// ********************************************************************
// HTML5 Audio要素（bgsound/embed代替）
// ch0,1=BGM  ch2-9=SE
// ********************************************************************
var MUS_AudioChannels=new Array(10);
// ********************************************************************
// ＢＧＭ音量制御用定数
// ********************************************************************
var MUS_FadeInterval=100;
// ********************************************************************
// 音楽ファイルフォルダ（相対パス）
// ********************************************************************
var MUS_MusicFolder="../bgm";
var MUS_SEFolder="../se";
// ***************************************************
// 上位カーネル
// ***************************************************
// ------------------------------------------------
// MUS_PlayMusic(ファイル名,ボリューム,ループ,フェードout時間,フェードin時間,クロスフェード有無）; 
// ＢＧＭ再生を開始する。
// ------------------------------------------------
function MUS_PlayMusic(Filename,Volume,Loop,FadeoutTime,FadeinTime,XFade)
	{
	// BGM拡張子: ブラウザはWMA/MIDI非対応
	// MP3/OGG変換版をbgmフォルダに置けば自動で使用
	// ★z45: omake2(音楽鑑賞モード)は cfg_bgm 設定(midi/off等)に関わらず必ずmp3変換版で再生する。
	//   midはHTML5 Audioで鳴らないため、本編BGMと同じ _bgmResolve(mp3) 経由に統一(篠原指摘)。
	if (typeof nowwin!=="undefined" && nowwin=="omake2")
		{
		Filename=_bgmResolve(Filename);
		}
	else switch (cfg_bgm)
		{
		case "auto":
		case "wma":
			// MP3→OGG→WMAの順に試行
			Filename=_bgmResolve(Filename);
			break;
		case "midi":
			Filename+=".mid";
			break;
		default:
			break;
		}
	if (MUS_NowFading) clearTimeout(MUS_TID);
	if (MUS_PlayingChannel==1){ch1=1;ch2=0;}
	else 	{ch1=0;ch2=1;}
	if ((XFade)&&(MUS_ChannelFile[ch2]==MUS_MusicFolder+"/"+Filename)) return;
	if ((!XFade)&&(MUS_ChannelFile[ch1]==MUS_MusicFolder+"/"+Filename)) return;
	if (XFade)
		{
		if (Filename.indexOf(".mid")!=-1) XFade=false;
		}
	MUS_ChannelNextFile[ch1]=MUS_MusicFolder+"/"+Filename;
	MUS_ChannelBeforeVolume[ch1]=MUS_ChannelVolume[ch1];
	MUS_ChannelVolume[ch1]=Volume;
	MUS_ChannelLoop[ch1]=Loop;
	if (XFade)
		{
		MUS_ChannelNextFile[ch2]=="";
		MUS_ChannelBeforeVolume[ch2]=MUS_ChannelVolume[ch2];
		MUS_StopChannel(ch2,FadeoutTime);
		MUS_ChannelFadetime[ch1]=FadeinTime;
		MUS_StartChannel(ch1);
		if (MUS_PlayingChannel==1) MUS_PlayingChannel=2;else MUS_PlayingChannel=1;
		}
	else	{
		MUS_ChannelFadetime[ch1]=FadeinTime;
		MUS_StopChannel(ch1,FadeoutTime);
		}
	MUS_FadeActive();
	}
// ------------------------------------------------
// MUS_StopMusic(フェード時間）; 
// ------------------------------------------------
function MUS_StopMusic(Fadetime)
	{
	if (MUS_NowFading) clearTimeout(MUS_TID);
	MUS_ChannelNextFile[0]="";
	MUS_ChannelNextFile[1]="";
	MUS_StopChannel(0,Fadetime);
	MUS_StopChannel(1,Fadetime);
	MUS_FadeActive();
	}
// ------------------------------------------------
// MUS_PlaySE(チャンネル,ファイル名,ボリューム,ループ,フェードout時間,フェードin時間）; 
// ------------------------------------------------
function MUS_PlaySE(ch1,Filename,Volume,Loop,FadeoutTime,FadeinTime)
	{
	if ((ch1<1)||(ch1>8)) return;
	if (MUS_NowFading) clearTimeout(MUS_TID);
	ch1++;
	MUS_ChannelNextFile[ch1]=MUS_SEFolder+"/"+Filename;
	MUS_ChannelBeforeVolume[ch1]=MUS_ChannelVolume[ch1];
	MUS_ChannelVolume[ch1]=Volume;
	MUS_ChannelLoop[ch1]=Loop;
	MUS_ChannelFadetime[ch1]=FadeinTime;
	MUS_StopChannel(ch1,FadeoutTime);
	MUS_FadeActive();
	}
// ------------------------------------------------
// MUS_StopSE(チャンネル,フェード時間）; 
// ------------------------------------------------
function MUS_StopSE(ch,Fadetime)
	{
	if ((ch<1)||(ch>8)) return;
	if (MUS_NowFading) clearTimeout(MUS_TID);
	ch++;
	MUS_StopChannel(ch,Fadetime);
	MUS_FadeActive();
	}
// ------------------------------------------------
// MUS_SetMasterVolume(ボリューム)
// ------------------------------------------------
function MUS_SetMasterVolume(vol)
	{
	var i;
	if (vol<0) vol=0;
	if (vol>100) vol=100;
	MUS_MasterVolume=vol;
	for(i=0;i<=9;i++) MUS_SetVolume(i,true);
	}
// ------------------------------------------------
// MUS_SetMusicVolume(ボリューム)
// ------------------------------------------------
function MUS_SetMusicVolume(vol)
	{
	if (vol<0) vol=0;
	if (vol>100) vol=100;
	MUS_RelVolume[0]=vol;
	MUS_RelVolume[1]=vol;
	MUS_SetVolume(0,true);
	MUS_SetVolume(1,true);
	}
// ------------------------------------------------
// MUS_SetSEVolume(チャンネル,ボリューム)
// ------------------------------------------------
function MUS_SetSEVolume(ch,vol)
	{
	var i,c;
	if ((ch<1)||(ch>8)) return;
	if (vol<0) vol=0;
	if (vol>100) vol=100;
	MUS_RelVolume[ch+1]=vol;
	MUS_SetVolume(ch+1,true);
	}
// ***************************************************
// 下位カーネル
// ***************************************************
function InitMusic()
	{
	var i;
	MUS_PlayingChannel=1;

	for(i=0;i<=9;i++)
		{
		MUS_ChannelVolume[i]=100;
		MUS_ChannelFader[i]=0;
		MUS_ChannelFile[i]="";
		MUS_ChannelNextFile[i]="";
		MUS_ChannelLoop[i]=false;
		MUS_ChannelDelta[i]=0;
		MUS_ChannelStop[i]=0;
		MUS_ChannelPlaying[i]=false;
		MUS_ChannelFadetime[i]=0;
		MUS_RelVolume[i]=100;
		// HTML5 Audio要素を生成
		MUS_AudioChannels[i]=new Audio();
		}
	}
// ------------------------------------------------
// チャンネル演奏開始
// ------------------------------------------------
function MUS_StartChannel(ch)
	{
	var audio,l,result;
	var Filename,Volume,Loop,Fadetime;
	Filename=MUS_ChannelNextFile[ch];
	Volume=MUS_ChannelVolume[ch];
	Loop=MUS_ChannelLoop[ch];
	Fadetime=MUS_ChannelFadetime[ch];
	MUS_ChannelNextFile[ch]="";

	result=false;
	audio=MUS_AudioChannels[ch];
	MUS_ChannelVolume[ch]=Volume;
	MUS_ChannelLoop[ch]=Loop;
	audio.loop=Loop;
	if (Fadetime<=0)	// 即時開始
		{
		MUS_ChannelStop[ch]=100;
		MUS_ChannelDelta[ch]=0;
		MUS_ChannelFader[ch]=100;
		MUS_ChannelVolume[ch]=Volume;
		MUS_SetVolume(ch,true);
		audio.src=Filename;
		audio.play().catch(function(e){});
		}
	else	{
		MUS_ChannelStop[ch]=100;
		MUS_ChannelDelta[ch]=(100/Fadetime);
		MUS_ChannelFader[ch]=0;
		MUS_SetVolume(ch,true);
		audio.src=Filename;
		audio.volume=0;
		audio.play().catch(function(e){});
		result=true;
		}
	MUS_ChannelPlaying[ch]=true;
	MUS_ChannelFile[ch]=Filename;
	}
// ------------------------------------------------
// チャンネル停止
// ------------------------------------------------
function MUS_StopChannel(ch,Fadetime)
	{
	var v,d,audio,nxt;
	nxt=false;
	audio=MUS_AudioChannels[ch];
	if (!MUS_ChannelPlaying[ch])
		{
		MUS_ChannelFile[ch]="";
		if (MUS_ChannelNextFile[ch]!="") {nxt=true;MUS_ChannelPlaying[ch]=false;MUS_StartChannel(ch);}
		return;
		}
	if (Fadetime<=0)	// 即時停止
		{
		audio.pause();
		audio.currentTime=0;
		audio.src="";
		MUS_ChannelStop[ch]=0;
		MUS_ChannelDelta[ch]=0;
		MUS_ChannelFader[ch]=0;
		MUS_ChannelFile[ch]="";
		if (MUS_ChannelNextFile[ch]!="") {nxt=true;MUS_ChannelPlaying[ch]=false;MUS_StartChannel(ch);}
		}
	else	{
		v=MUS_ChannelFader[ch];
		MUS_ChannelStop[ch]=0;
		MUS_ChannelDelta[ch]=(v/Fadetime+1)*-1;
		MUS_ChannelFile[ch]="";
		}
	if (!nxt) MUS_ChannelPlaying[ch]=false;
	}
// ------------------------------------------------
// フェードアウト（タイマー処理）本体
// ------------------------------------------------
function MUS_FadeActive()
	{
	var i,d,sts,audio;
	NowFading=true;
	sts=false;
	for(i=0;i<=9;i++)
		{
		d=MUS_ChannelDelta[i];
		if (d==0) continue;
		sts=true;
		MUS_ChannelFader[i]+=d;
		if (d>0)	{
			if (MUS_ChannelFader[i]>MUS_ChannelStop[i])
				{
				MUS_ChannelDelta[i]=0;
				MUS_ChannelFader[i]=100;
				MUS_ChannelPlaying[i]=true;
				}
			MUS_SetVolume(i,true);
			}
		else	{
			if (MUS_ChannelFader[i]<MUS_ChannelStop[i])
				{
				MUS_ChannelDelta[i]=0;
				MUS_ChannelFader[i]=0;
				MUS_ChannelPlaying[i]=false;
				audio=MUS_AudioChannels[i];
				audio.pause();
				audio.currentTime=0;
				audio.src="";
				if (MUS_ChannelNextFile[i]!="") {MUS_StartChannel(i);}
				}
			MUS_SetVolume(i,false);
			}
		}
	if (sts) MUS_TID=setTimeout(MUS_FadeActive,MUS_FadeInterval);
	else MUS_NowFading=false;
	}
// ------------------------------------------------
// 絶対ボリューム制御
// HTML5 Audio: volume = 0.0〜1.0 リニアスケール
// 元bgsound: -3000*(1-vv) dBスケール → vvそのものがリニア値
// ------------------------------------------------
function MUS_SetVolume(ch,mode)
	{
	var audio,v,vv;
	audio=MUS_AudioChannels[ch];
	if (!audio) return;
	if (mode) v=MUS_ChannelVolume[ch];else v=MUS_ChannelBeforeVolume[ch];
	vv=(v/100)*(MUS_MasterVolume/100)*(MUS_RelVolume[ch]/100)*(MUS_ChannelFader[ch]/100);
	if (vv<0) vv=0;
	if (vv>1) vv=1;
	try { audio.volume=vv; } catch(e) {}
	}
// ------------------------------------------------
// BGMファイル名解決: MP3優先（ブラウザ互換）
// bgmフォルダにMP3変換版を置けば自動で使用
// 変換コマンド例: for %f in (bgm\*.wma) do ffmpeg -i "%f" -q:a 2 "bgm\%~nf.mp3"
// ------------------------------------------------
function _bgmResolve(basename)
	{
	// canPlayTypeで対応フォーマット判定
	var a=new Audio();
	if (a.canPlayType("audio/mpeg")) return basename+".mp3";
	if (a.canPlayType("audio/ogg")) return basename+".ogg";
	// フォールバック: MP3（変換前はエラーになるが無害）
	return basename+".mp3";
	}
