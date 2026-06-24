// ----初期化カーネル------------------------------------------
var LF_lb;
var LF_cnt;
var LF_max=1;
Line=0;
anch=new Array(999);
flg=new Array(80);
sysflg=new Array(16);
reg=new Array(16);
i=0;
flmv=false;
endline=0;
ACREAD=0;
ACMAX=8178;
histtext="";
sts_bgm=null;
sts_se=null;
cfg_bgm="auto";
cfg_se=true;
cfg_skip=0;
cfg_select=true;
cfg_anime=true;
cfg_right=true;
cfg_auto=0;
cfg_shake=true;
AutoH="";wordslength=0;
KEY_ctrl=false;KEY_shift=false;
nowskip=false;TID="";
// ----------------
readf="";nowfile="";nowtext="";
nowbgm=0;nowse=0;kidoku=false;
brn0=new Array(10);
brn1=new Array(10);
brn2=new Array(10);
branch=false;
Brkey=new Array(10);
Brnum=0;
selstr="";
// ----------------
skip=false;
view=1;
var wa,wb,wc,wlen;
var a,i,j,k;
// ----------------
nowwin="title";bkwin="";
nowgame="off";bkgame="off";
var _titleIntroActive=false;
var _titleIntroShown=false;
var _titleIntroTimers=[];
var _titleIntroStartedAt=0;
var _titleIntroOverlay=null;
var _omakeOverlayHoldTimer=null;
var _saveIntroOverlay=null;
var _saveIntroTimer=null;
var _saveIntroText=null;
var _saveSlotPreviewOverlay=null;
var _saveSlotPreviewBody=null;
var SAVE_INTRO_FADE_MS=3000;
var SAVE_INTRO_OPEN_DELAY_MS=2000;
var _suppressNextLoadVisual=false;
var _suppressLoadFlashRestore=false;
var _loadReturnReplayAnim=false;	// ★z120: アニメ途中でロードに入ったか(戻りでアニメSWFを頭から再ロード)
var _menuFlashPlayerHidden=false;
var _titleHelpOverlay=null;
var _omakeOverlay=null;
var _titleIntroTextPrimary=null;
var _titleIntroTextSecondary=null;
var _activeInlineHelpMode=-1;
var _inlineHelpWasPlaying=false;
timelbl=new Array("早朝","朝","午前","昼","午後","夕方","夜","");
shocks=0;
bibx = new Array( 10, 3,-6, 8,-10,-7,5,-3,0,0,0,0,0,0,0,0,0,0,0,0);
biby = new Array(-12, 6,-3,10, -9,-2,8, 2,0,0,0,0,0,0,0,0,0,0,0,0);
bibx2 = new Array( 20,6,-12, 16,-20,-14,10,-6,10,3,-6,8,-10,-7,5,-3,0,0,0,0);
biby2 = new Array(-24, 12,-6,20, -18,-4,16, 4,-12,6,-3,10,-9,-2,8,2,0,0,0,0);
scenario = new Array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,25,26,27,28,29,40,41,42,43,44,45,46,47,48,60,61,62,63,64,65,66,67,68,69,91,92,93,95,96,97,-1);
endm=new Array(34,33,33,33,34,33,34,33,34,34,34,34,34,34,33,34,34,33,34,34,33,34);
endt=new Array("夢やぶれて","二人のキャンパス","前途を見据えて","広がる世界","憧れ",
"私のセンセイ","夕暮れの憩い","別れの告白","彼女の志","夏への憧憬",
"すべてを捨てて","人並みの幸せ","触れあわない距離","逃避","両手に災難",
"取り残されて","あいも変わらず","お笑いの星","遠い約束","落伍者",
"一触即発","前途多難");
cfd = new Array(22);
ACF=new Array(32);
SVF=new Array(10);
PF2pos=0;PF2rev=true;PF7mode=0;PF7win="";PF2sts=true;PF7sts=true;
Q=null;	// ★ SEQはschedule.js（後続読込）で定義。bootsys()内で代入する
// ----------------
kidfile=new Array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
20,25,26,27,28,29,40,41,42,43,44,45,46,47,48,
60,61,62,63,64,65,66,67,68,69,91,92,93,95,96,97,-1);
kidcomment=new Array("オープニング","１日目夕","２日目早朝","２日目昼","２日目夕","３日目早朝",
"３日目昼","３日目午後","３日目夕方","４日目早朝","４日目昼","４日目夕方",
"５日目早朝","５日目昼","５日目夕方","６日目早朝","６日目昼","６日目夕方",
"７日目早朝","５日目夜（１）","５日目夜（２）","６日目朝","６日目夜","７日目終幕（１）",
"７日目終幕（２）","凪１日目夜","凪２日目朝","凪２日目夜","凪３日目朝","凪３日目夜",
"凪４日目朝","凪４日目夜","凪５日目朝","凪５日目夜","さやか１日目夜","さやか２日目朝",
"さやか２日目夜","さやか３日目朝","さやか３日目夜","さやか４日目朝","さやか４日目夜","さやか５日目朝",
"さやか５日目夜（１）","さやか５日目夜（２）","ＥＤ（１）","ＥＤ（２）","ＥＤ（３）","結果発表（グッド）",
"結果発表（ノーマル）","結果発表（バッド）","");
// ----------------
var _lastKlikTime=0;
var _klikFromAuto=false;
var _ignoreKlikUntil=0;
var _textClickGuardUntil=0;
var TEXT_CLICK_GUARD_MS=220;
var _resultClickGuardUntil=0;
var RESULT_CLICK_GUARD_MS=220;
function klik()
	{
	var now,fromAuto;
	fromAuto=_klikFromAuto;
	if (!fromAuto){
		now=Date.now();
		if (now-_lastKlikTime<150){_dbg("[klik] DEBOUNCE blocked ("+(now-_lastKlikTime)+"ms)");return;}
		_lastKlikTime=now;
		}
	_klikFromAuto=false;
	if (Date.now()<_ignoreKlikUntil) return;
	if (display=="MAX")	{disp_normal();return;}
	if (nowwin=="comp"){exitprocess();}
	if (nowwin=="omake1") {omake1end();return;}
	if (nowwin=="none")
		{
		// 一日終了/セーブ前後の遷移アニメ(Movie>0)はクリック/Enterでスキップ可能に
		if ((typeof Q!=="undefined")&&(Q.Movie>0)&&(typeof _skipTransitionMovie==="function")) _skipTransitionMovie();
		return;
		}
	if ((nowwin=="wait")||(nowwin=="save")||(nowwin=="saveintro")||(nowwin=="movie")||(nowwin=="REVIEW")) return;
	if ((typeof _endingSequenceStage!=="undefined")&&(_endingSequenceStage===1||_endingSequenceStage===2)) return;
	clearTimeout(AutoH);
	focus();
	if (nowwin=="ending") {checkcomplete();return;}
	if (nowwin=="title") return;
	if (nowwin=="HELP") {PF7off();return;}
	if ((!fromAuto)&&(nowwin=="")&&(nowgame=="event"))
		{
		if (!now) now=Date.now();
		if (now<_textClickGuardUntil)
			{
			_dbg("[klik] TEXT GUARD blocked ("+(_textClickGuardUntil-now)+"ms)");
			return;
			}
		}
	if ((nowgame=="event")&&(!branch)) {decode();return;}
	if ((nowgame=="slg")&&(nowwin=="RESULT"))
		{
		if (!fromAuto)
			{
			if (!now) now=Date.now();
			if (now<_resultClickGuardUntil)
				{
				_dbg("[klik] RESULT GUARD blocked ("+(_resultClickGuardUntil-now)+"ms)");
				return;
				}
			}
		Q.resultend();
		return;
		}
	if (nowgame=="slg") {Q.resultend();return;}
	return;
	}
function kick()
	{
	_dbg("[kick] nowwin="+nowwin);
	clearTimeout(AutoH);
	nowwin="";
	decode();
	}
function _ensureTitleIntroOverlay()
	{
	var parent=document.getElementById("MAINW");
	if ((!parent)||(parent.tagName=="EMBED")||(parent.tagName=="OBJECT")) parent=document.getElementById("RAY1");
	if (!parent) return null;
	if (!_titleIntroOverlay||!_titleIntroOverlay.parentNode)
		{
		_titleIntroOverlay=document.createElement("div");
		_titleIntroOverlay.id="TITLE_INTRO_OVERLAY";
		_titleIntroOverlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:2;pointer-events:none;display:none;overflow:hidden;";
		_titleIntroTextPrimary=document.createElement("div");
		_titleIntroTextPrimary.id="TITLE_INTRO_TEXT_PRIMARY";
		_titleIntroTextPrimary.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#ffffff;font-family:'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif;font-size:34px;letter-spacing:1px;opacity:0;transition:opacity 1s linear;";
		_titleIntroTextPrimary.innerHTML="";	// ★OP文字はSWF注入で復活したためHTMLオーバーレイ撤去（二重防止）
		_titleIntroTextSecondary=document.createElement("div");
		_titleIntroTextSecondary.id="TITLE_INTRO_TEXT_SECONDARY";
		_titleIntroTextSecondary.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#ffffff;font-family:'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif;font-size:34px;letter-spacing:1px;opacity:0;transition:opacity 1s linear;";
		_titleIntroTextSecondary.innerHTML="";	// ★OP文字はSWF注入で復活したためHTMLオーバーレイ撤去（二重防止）
		_titleIntroOverlay.appendChild(_titleIntroTextPrimary);
		_titleIntroOverlay.appendChild(_titleIntroTextSecondary);
		parent.appendChild(_titleIntroOverlay);
		}
	return _titleIntroOverlay;
	}
function _titleIntroTimer(fn,ms)
	{
	var id=setTimeout(fn,ms);
	_titleIntroTimers.push(id);
	return id;
	}
function _clearTitleIntro()
	{
	var i;
	for(i=0;i<_titleIntroTimers.length;i++) clearTimeout(_titleIntroTimers[i]);
	_titleIntroTimers=[];
	_titleIntroActive=false;
	_titleIntroStartedAt=0;
	if (!_titleIntroOverlay||!_titleIntroOverlay.parentNode) return;
	_titleIntroOverlay.style.display="none";
	if (_titleIntroTextPrimary) _titleIntroTextPrimary.style.opacity="0";
	if (_titleIntroTextSecondary) _titleIntroTextSecondary.style.opacity="0";
	}

function _ensureSaveIntroOverlay()
	{
	var parent=document.getElementById("MAINW");
	if (!parent) return null;
	if (_saveIntroOverlay&&_saveIntroOverlay.parentNode) return _saveIntroOverlay;
	_saveIntroOverlay=document.createElement("div");
	_saveIntroOverlay.id="SAVE_INTRO_OVERLAY";
	_saveIntroOverlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:30;display:none;pointer-events:none;overflow:hidden;";
	_saveIntroText=document.createElement("div");
	_saveIntroText.style.cssText="position:absolute;right:18px;bottom:16px;color:#f3f7ff;font-family:'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif;font-style:italic;font-size:34px;letter-spacing:0.5px;text-align:right;text-shadow:0 0 10px rgba(0,0,0,0.7), 0 0 3px rgba(0,0,0,0.9);opacity:0;transition:opacity "+SAVE_INTRO_FADE_MS+"ms linear;";
	_saveIntroText.textContent="";	// ★SWF注入で "Aquanaut Campus" が復活したためHTMLオーバーレイ撤去（二重防止）
	_saveIntroOverlay.appendChild(_saveIntroText);
	parent.appendChild(_saveIntroOverlay);
	return _saveIntroOverlay;
	}

function _hideSaveIntro()
	{
	if (_saveIntroTimer)
		{
		clearTimeout(_saveIntroTimer);
		_saveIntroTimer=null;
		}
	if (_saveIntroOverlay)
		{
		_saveIntroOverlay.style.display="none";
		}
	if (_saveIntroText)
		{
		_saveIntroText.style.opacity="0";
		}
	}

function _showSaveLogoInstant()
	{
	var overlay=_ensureSaveIntroOverlay();
	if (!overlay) return;
	overlay.style.display="block";
	if (_saveIntroText)
		{
		_saveIntroText.style.transition="none";
		_saveIntroText.style.opacity="1";
		}
	}

function _showSaveLogoFade()
	{
	var overlay=_ensureSaveIntroOverlay();
	if (!overlay) return;
	overlay.style.display="block";
	if (_saveIntroText)
		{
		_saveIntroText.style.transition="opacity "+SAVE_INTRO_FADE_MS+"ms linear";
		_saveIntroText.style.opacity="0";
		requestAnimationFrame(function(){
			requestAnimationFrame(function(){
				if (_saveIntroText) _saveIntroText.style.opacity="1";
				});
			});
		}
	}

var SAVE_SLOT_PREVIEW_META={
	3:{date:"8月3日(火)",weather:"晴れ",bg:"char179.jpg"},
	4:{date:"8月4日(水)",weather:"曇りのち雨",bg:"char107.jpg"},
	5:{date:"8月5日(木)",weather:"晴れ時々曇り",bg:"char169.jpg"},
	6:{date:"8月6日(金)",weather:"晴れ",bg:"char179.jpg"},
	7:{date:"8月7日(土)",weather:"曇り",bg:"char107.jpg"},
	8:{date:"8月8日(日)",weather:"嵐",bg:"char197.jpg"}
	};

function _ensureSaveSlotPreviewOverlay()
	{
	var parent=document.getElementById("MAINW");
	if (!parent) return null;
	if (_saveSlotPreviewOverlay&&_saveSlotPreviewOverlay.parentNode) return _saveSlotPreviewOverlay;
	_saveSlotPreviewOverlay=document.createElement("div");
	_saveSlotPreviewOverlay.id="SAVE_SLOT_PREVIEW";
	_saveSlotPreviewOverlay.style.cssText="position:absolute;left:116px;top:116px;width:280px;min-height:72px;z-index:28;display:none;pointer-events:none;background:rgba(7,18,34,0.68);border:1px solid rgba(230,240,255,0.78);box-shadow:0 10px 24px rgba(0,0,0,0.35);box-sizing:border-box;";
	_saveSlotPreviewBody=document.createElement("div");
	_saveSlotPreviewBody.style.cssText="padding:12px 16px;color:#f6fbff;font-family:'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif;font-size:20px;line-height:1.45;text-shadow:0 0 5px rgba(0,0,0,0.7);text-align:center;display:flex;align-items:center;justify-content:center;min-height:72px;box-sizing:border-box;white-space:normal;word-break:keep-all;overflow-wrap:anywhere;";
	_saveSlotPreviewOverlay.appendChild(_saveSlotPreviewBody);
	parent.appendChild(_saveSlotPreviewOverlay);
	return _saveSlotPreviewOverlay;
	}

function _getSaveSlotPreview(slot)
	{
	var str,reg0,date;
	str=cload(0,"ac"+slot);
	if (str==null) return null;
	reg0=parseInt(str.substr(0,2),16);
	if (!(reg0>=0)) return null;
	date=2+Math.floor(reg0/7);
	if (!SAVE_SLOT_PREVIEW_META[date]) return null;
	return SAVE_SLOT_PREVIEW_META[date];
	}

function _showSaveSlotPreview(slot)
	{
	var preview=_getSaveSlotPreview(slot);
	var overlay=_ensureSaveSlotPreviewOverlay();
	if (!overlay) return;
	if (!preview)
		{
		_hideSaveSlotPreview();
		return;
		}
	if (typeof showBackgroundFile==="function") showBackgroundFile(preview.bg);
	if (_saveSlotPreviewBody)
		_saveSlotPreviewBody.innerHTML=preview.date+"<br>"+preview.weather;
	overlay.style.display="block";
	}

function _hideSaveSlotPreview()
	{
	if (_saveSlotPreviewOverlay) _saveSlotPreviewOverlay.style.display="none";
	}

function _hideMenuFlashPlayer()
	{
	if (typeof FLASH_PLAYER!=="undefined" && FLASH_PLAYER)
		{
		FLASH_PLAYER.style.display="none";
		FLASH_PLAYER.style.visibility="hidden";
		FLASH_PLAYER.style.opacity="0";
		_menuFlashPlayerHidden=true;
		}
	}

function _showMenuFlashPlayer()
	{
	if (!_menuFlashPlayerHidden) return;
	if (typeof FLASH_PLAYER!=="undefined" && FLASH_PLAYER)
		{
		FLASH_PLAYER.style.display="";
		FLASH_PLAYER.style.visibility="visible";
		FLASH_PLAYER.style.opacity="1";
		if (typeof _reinjectPlayButtonHide==="function") _reinjectPlayButtonHide(FLASH_PLAYER);
		}
	_menuFlashPlayerHidden=false;
	}

function _waitForJpegAsset(file,done)
	{
	var img,url,finish;
	if (!file)
		{
		done();
		return;
		}
	url=(typeof JPEG_DIR!=="undefined")?JPEG_DIR+file:("../swf/extracted_jpeg/"+file);
	img=(typeof _preloadedJpegs!=="undefined" && _preloadedJpegs)?_preloadedJpegs[file]:null;
	if (!img)
		{
		img=new Image();
		img.src=url;
		}
	if (img.complete && img.naturalWidth>0)
		{
		done();
		return;
		}
	finish=function(){
		img.removeEventListener("load",finish);
		img.removeEventListener("error",finish);
		done();
		};
	img.addEventListener("load",finish);
	img.addEventListener("error",finish);
	}

function _waitForSaveIntroAssets(done)
	{
	var pending=1;
	function next()
		{
		pending--;
		if (pending<=0) done();
		}
	_waitForJpegAsset("char123.jpg",next);
	}

function _showSaveStaticBackground(done)
	{
	if (typeof showSaveStaticBackground==="function")
		{
		showSaveStaticBackground(done);
		return;
		}
	setposs(74);
	if (done) done();
	}

function _openSaveWindow(skipBgRefresh)
	{
	function showWindow()
		{
		_hideSaveIntro();
		_hideSaveSlotPreview();
		PF2rev=true;
		if (!skipBgRefresh) _hideMenuFlashPlayer();	// ★F500鎮座経路(skipBgRefresh)ではFLASH_PLAYERを隠さずSWFロゴ鎮座を維持
		_showSaveLogoInstant();	// HTMLロゴ枠（_saveIntroText空＝無害）
		ShowLayer("SAVEWIN");
		HideLayer("RAY2B");
		nowwin="save";
		}
	if (skipBgRefresh)
		{
		showWindow();
		return;
		}
	_showSaveStaticBackground(function(){
		if (nowwin!="saveintro"&&nowwin!="none") return;
		showWindow();
		});
	}

function _startSaveIntro()
	{
	// ★セーブ演出作り直し: F500のSWFロゴ鎮座(最終フレームfreeze)をそのまま背景に見せる。
	// 旧フロー(char123差替 + FLASH_PLAYER隠し + HTMLロゴ代替)はF500ロゴ復活で不要に。
	_hideSaveIntro();	// 旧HTMLロゴ枠が残っていたら隠す（保険）
	// ★スキップ経由(F500静止SWF差替=window._saveIntroSkip)の時は2秒のロゴ見せ遅延を飛ばして即セーブ画面を開く
	var _introDelay=(typeof window!=="undefined"&&window._saveIntroSkip)?0:SAVE_INTRO_OPEN_DELAY_MS;
	if (typeof window!=="undefined") window._saveIntroSkip=false;
	_waitForSaveIntroAssets(function(){
		if (nowwin!="saveintro") return;
		_saveIntroTimer=setTimeout(function(){
			_saveIntroTimer=null;
			_openSaveWindow(true);
			},_introDelay);
		});
	}
function _ensureTitleHelpOverlay()
	{
	var parent=document.getElementById("MAINW");
	var body,html;
	if ((!parent)||(parent.tagName=="EMBED")||(parent.tagName=="OBJECT")) parent=document.getElementById("RAY1");
	if (!parent) return null;
	if (_titleHelpOverlay&&_titleHelpOverlay.parentNode) return _titleHelpOverlay;
	_titleHelpOverlay=document.createElement("div");
	_titleHelpOverlay.id="TITLE_HELP_OVERLAY";
	_titleHelpOverlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:linear-gradient(rgba(4,10,18,0.28),rgba(4,10,18,0.28)),url('../swf/extracted_jpeg/char166.jpg') center center / cover no-repeat;";
	body=document.createElement("div");
	body.style.cssText="margin:18px 0 0 12px;padding:12px 18px 14px 14px;box-sizing:border-box;width:358px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.55;background:rgba(4,10,18,0.18);";
	html="";
	html+="<div style='font-size:27px;font-weight:bold;margin-bottom:16px;'>タイトル画面</div>";
	html+="<div style='font-size:16px;margin-top:72px;'>";
	html+="<p style='margin:0 0 4px 0;'>画面下のメニューをクリックするか、</p>";
	html+="<p style='margin:0 0 14px 0;'>テンキーを押して選択してください。</p>";
	html+="<p style='margin:0 0 8px 0;'>1: 最初からゲームを始めます。</p>";
	html+="<p style='margin:0 0 8px 0;'>2: セーブしてある場所からゲームを再開します。</p>";
	html+="<p style='margin:0 0 14px 0;'>3: 環境設定画面を開きます。</p>";
	html+="<p style='margin:0;'>ゲームを最後までクリアするとメニューが増えます。</p>";
	html+="</div>";
	html="";
	html+="<div style='font-size:27px;font-weight:bold;margin-bottom:16px;'>タイトル画面</"+"div>";
	html+="<div style='font-size:16px;'>";
	html+="<p style='margin:0 0 4px 0;'>画面下のメニューをクリックするか、</"+"p>";
	html+="<p style='margin:0 0 14px 0;'>テンキーを押して選択してください。</"+"p>";
	html+="<p style='margin:0 0 8px 0;'>1: 最初からゲームを始めます。</"+"p>";
	html+="<p style='margin:0 0 8px 0;'>2: セーブしてある場所からゲームを再開します。</"+"p>";
	html+="<p style='margin:0 0 14px 0;'>3: 環境設定画面を開きます。</"+"p>";
	html+="<p style='margin:0;'>ゲームを最後までクリアするとメニューが増えます。</"+"p>";
	html+="</"+"div>";
	html="";
	html+="<div style='font-size:27px;font-weight:bold;margin-bottom:0;'>タイトル画面</"+"div>";
	html+="<div style='font-size:16px;margin-top:72px;'>";
	html+="<p style='margin:0 0 4px 0;'>画面下のメニューをクリックするか、</"+"p>";
	html+="<p style='margin:0 0 14px 0;'>テンキーを押して選択してください。</"+"p>";
	html+="<p style='margin:0 0 8px 0;'>1: 最初からゲームを始めます。</"+"p>";
	html+="<p style='margin:0 0 8px 0;'>2: セーブしてある場所からゲームを再開します。</"+"p>";
	html+="<p style='margin:0 0 14px 0;'>3: 環境設定画面を開きます。</"+"p>";
	html+="<p style='margin:0;'>ゲームを最後までクリアするとメニューが増えます。</"+"p>";
	html+="</"+"div>";
	body.innerHTML=html;
	_titleHelpOverlay.appendChild(body);
	parent.appendChild(_titleHelpOverlay);
	return _titleHelpOverlay;
	}
function _showTitleHelpOverlay()
	{
	return _showInlineHelpOverlay(3);
	}
function _renderInlineHelpOverlay(num)
	{
	var overlay=_ensureTitleHelpOverlay();
	var body=overlay ? overlay.firstChild : null;
	var html="";
	if (!overlay||!body) return false;
	if (num==3)
		{
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:linear-gradient(rgba(4,10,18,0.28),rgba(4,10,18,0.28)),url('../swf/extracted_jpeg/char166.jpg') center center / cover no-repeat;";
		body.style.cssText="margin:18px 0 0 12px;padding:12px 18px 14px 14px;box-sizing:border-box;width:358px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.55;background:rgba(4,10,18,0.18);";
		html+="<div style='font-size:27px;font-weight:bold;margin-bottom:0;'>タイトル画面</div>";
		html+="<div style='font-size:16px;margin-top:72px;'>";
		html+="<p style='margin:0 0 4px 0;'>画面下のメニューをクリックするか、</p>";
		html+="<p style='margin:0 0 14px 0;'>テンキーを押して選択してください。</p>";
		html+="<p style='margin:0 0 8px 0;'>1: 最初からゲームを始めます。</p>";
		html+="<p style='margin:0 0 8px 0;'>2: セーブしてある場所からゲームを再開します。</p>";
		html+="<p style='margin:0 0 14px 0;'>3: 環境設定画面を開きます。</p>";
		html+="<p style='margin:0;'>ゲームを最後までクリアするとメニューが増えます。</p>";
		html+="</div>";
		}
	else if (num==0)
		{
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:linear-gradient(rgba(4,10,18,0.42),rgba(4,10,18,0.42)),url('../swf/extracted_jpeg/char169.jpg') center center / cover no-repeat;";
		body.style.cssText="margin:18px 0 0 12px;padding:10px 16px 14px 16px;box-sizing:border-box;width:470px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.12;background:rgba(4,10,18,0.26);";
		html+="<div style='font-size:27px;font-weight:bold;margin-bottom:0;'>ゲーム画面</div>";
		html+="<div style='font-size:15px;margin-top:32px;'>";
		html+="<p style='margin:0 0 12px 0;'>表示されているメッセージを読み、物語を進めます。</p>";
		html+="<p style='margin:0 0 4px 0;'>画面をクリック or テンキーの0 ... 次のページへ</p>";
		html+="<p style='margin:0 0 4px 0;'>（環境設定画面でオートプレイが設定されている場合は、</p>";
		html+="<p style='margin:0 0 12px 0;'>　クリックしなくても進みます）</p>";
		html+="<p style='margin:0 0 4px 0;'>画面右側にはシステムメニューが表示されています。</p>";
		html+="<p style='margin:0 0 4px 0;'>システムメニューをクリックするか、対応するキーを</p>";
		html+="<p style='margin:0 0 12px 0;'>押すと、以下の機能を使うことができます。</p>";
		html+="<p style='margin:0 0 4px 0;'>HELP(-) ... 操作説明画面を出します。</p>";
		html+="<p style='margin:0 0 4px 0;'>SKIP(Enter) ... メッセージをスキップします。</p>";
		html+="<p style='margin:0 0 4px 0;'>LOAD(8) ... 保存してある場所からゲームを再開します。</p>";
		html+="<p style='margin:0 0 4px 0;'>CONFIG(7) ... 環境設定画面を開きます。</p>";
		html+="<p style='margin:0 0 4px 0;'>REWIND(+) ... メッセージを読み返します。</p>";
		html+="<p style='margin:0;'>EXIT(9) ... ゲームを終了し、タイトル画面に戻ります。</p>";
		html+="</div>";
		}
	else return false;
	body.innerHTML=html;
	return true;
	}
function _showInlineHelpOverlay(num)
	{
	var overlay=_ensureTitleHelpOverlay();
	if (!_renderInlineHelpOverlay(num)) return false;
	_inlineHelpWasPlaying=!!PF7sts;
	try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}
	_activeInlineHelpMode=num;
	if (overlay) overlay.style.display="block";
	return true;
	}
function _hideTitleHelpOverlay(resume)
	{
	if (_titleHelpOverlay&&_titleHelpOverlay.parentNode) _titleHelpOverlay.style.display="none";
	// ★z88: visible復帰+playは「HELPを開く前にFLASHが再生中だった時だけ」に限定。manual fade等でpause/hiddenの最中に
	//   HELPを開閉すると、従来は_ensureFlashPlayerVisibleを無条件で呼びvisible復帰→pauseのまま▶が露出していた
	//   (SLG突入時の▶。[PB]ログで PF7off→_hideTitleHelpOverlay→_ensureFlashPlayerVisible 経由と特定)。
	//   再生中でなかった(=manual fade等)時はFLASHに触れず、元の隠れた状態を保てば▶は出ない。
	if (resume&&_inlineHelpWasPlaying)
		{
		if (typeof _ensureFlashPlayerVisible==="function") _ensureFlashPlayerVisible();
		if (FLASH_PLAYER&&typeof FLASH_PLAYER.play==="function") {try{FLASH_PLAYER.play();}catch(e){}}
		}
	_activeInlineHelpMode=-1;
	_inlineHelpWasPlaying=false;
	if (typeof _releaseTitleHelpBackground==="function") _releaseTitleHelpBackground();
	}
function _showActionInlineHelpOverlay(num)
	{
	var overlay=_ensureTitleHelpOverlay();
	var body=overlay ? overlay.firstChild : null;
	var html="",titleText,line1,line2,line3,line4,line5;
	if (!overlay||!body) return false;
	if (num==7)
		{
		titleText="\u6559\u6388\u306e\u884c\u52d5\u753b\u9762";
		line1="\u753b\u9762\u4e2d\u592e\u306b\u306f\u3001\u305d\u306e\u6642\u9593\u5e2f\u306b\u9078\u3079\u308b\u884c\u52d5\u304c\u8868\u793a\u3055\u308c\u3066\u3044\u307e\u3059\u3002";
		line2="1. \u8cc7\u6599\u5206\u6790 / 2. \u51ea\u3068\u8a71\u3059 / 3. \u3055\u3084\u304b\u3068\u8a71\u3059 / 4. \u4f11\u61a9\u3059\u308b \u306e\u4e2d\u304b\u3089\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002";
		line3="\u884c\u52d5\u306b\u3088\u3063\u3066\u6559\u6388\u306e\u4f53\u529b\u3092\u6d88\u8cbb\u3057\u307e\u3059\u3002\u4f53\u529b\u304c\u8db3\u308a\u306a\u3044\u9805\u76ee\u306f\u9078\u3079\u307e\u305b\u3093\u3002";
		line4="\u4e0b\u6bb5\u306b\u306f\u73fe\u5728\u306e \u8abf\u67fb / \u60c5\u5831 / \u767a\u898b\u5ea6 / \u4f53\u529b \u304c\u8868\u793a\u3055\u308c\u3066\u3044\u307e\u3059\u3002";
		line5="\u30e1\u30c3\u30bb\u30fc\u30b8\u57df\u3092\u30af\u30ea\u30c3\u30af\u3001\u53f3\u30af\u30ea\u30c3\u30af\u30010\u30ad\u30fc\u3001-\u30ad\u30fc\u3001Enter\u30ad\u30fc\u306e\u3044\u305a\u308c\u304b\u3067\u30b2\u30fc\u30e0\u306b\u623b\u308a\u307e\u3059\u3002";
		}
	else if (num==8)
		{
		titleText="\u51ea\u306e\u884c\u52d5\u753b\u9762";
		line1="\u753b\u9762\u4e2d\u592e\u306b\u306f\u3001\u51ea\u304c\u305d\u306e\u6642\u9593\u5e2f\u306b\u9078\u3079\u308b\u884c\u52d5\u304c\u8868\u793a\u3055\u308c\u3066\u3044\u307e\u3059\u3002";
		line2="1. \u6d77\u5e95\u63a2\u7d22 / 2. \u6d77\u57df\u8abf\u67fb / 3. \u8cc7\u6599\u5206\u6790 / 4. \u4f11\u61a9\u3059\u308b \u306e\u4e2d\u304b\u3089\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002";
		line3="\u884c\u52d5\u306b\u3088\u3063\u3066\u51ea\u306e\u4f53\u529b\u3092\u6d88\u8cbb\u3057\u307e\u3059\u3002\u4f53\u529b\u304c\u8db3\u308a\u306a\u3044\u9805\u76ee\u306f\u9078\u3079\u307e\u305b\u3093\u3002";
		line4="\u4e0b\u6bb5\u306b\u306f\u73fe\u5728\u306e \u8abf\u67fb / \u60c5\u5831 / \u767a\u898b\u5ea6 / \u4f53\u529b \u304c\u8868\u793a\u3055\u308c\u3066\u3044\u307e\u3059\u3002";
		line5="\u30e1\u30c3\u30bb\u30fc\u30b8\u57df\u3092\u30af\u30ea\u30c3\u30af\u3001\u53f3\u30af\u30ea\u30c3\u30af\u30010\u30ad\u30fc\u3001-\u30ad\u30fc\u3001Enter\u30ad\u30fc\u306e\u3044\u305a\u308c\u304b\u3067\u30b2\u30fc\u30e0\u306b\u623b\u308a\u307e\u3059\u3002";
		}
	else if (num==4)
		{
		// おまけメニューHELP(原F5914、PF7(4))。EditText useOutlines=0でRuffleが描けず文字化け→HTMLオーバーレイで再現。原文はF5914 EditTextから抽出。
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:rgba(4,10,18,0.42);";
		body.style.cssText="margin:16px 0 0 12px;padding:12px 18px 16px 16px;box-sizing:border-box;width:478px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.3;background:rgba(4,10,18,0.24);";
		html+="<div style='position:static;font-size:27px;font-weight:bold;line-height:1.05;margin:0 0 14px 0;'>おまけメニュー</div>";
		html+="<div style='position:static;font-size:15px;margin-top:24px;'>";
		html+="<p style='margin:0 0 7px 0;'>ゲーム中である条件が満たされると、追加されるメニューです。</p>";
		html+="<p style='margin:0 0 7px 0;'>メニューが表示される条件は秘密ですが、エンディングの</p>";
		html+="<p style='margin:0 0 14px 0;'>種類やメッセージの読破率が関係します。</p>";
		html+="<p style='margin:0 0 7px 0;'>全３種類ですが、それぞれのコーナーの中でさらに細分化</p>";
		html+="<p style='margin:0 0 14px 0;'>されています。</p>";
		html+="<p style='margin:0 0 14px 0;'>詳しくは説明できませんが、いろいろ探してみてください。</p>";
		html+="<p style='margin:0 0 7px 0;'>「０：戻る」をクリックするか、テンキーの０を押すと</p>";
		html+="<p style='margin:0;'>タイトル画面に戻ります。</p>";
		html+="</div>";
		body.innerHTML=html;
		_inlineHelpWasPlaying=!!PF7sts;
		if (!(typeof _captureTitleHelpBackground==="function" && _captureTitleHelpBackground()))
			{try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}}
		if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
		if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
			{_reinjectPlayButtonHide(FLASH_PLAYER);setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);}
		_activeInlineHelpMode=num;
		overlay.style.display="block";
		return true;
		}
	else if (num==5)
		{
		// 選択肢画面HELP(原F5915)。F5919と同じくEditText useOutlines=0(HGM-PRO指定)でRuffleが描けず文字化け→HTMLオーバーレイで再現。原文はF5915 EditTextから抽出。
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:rgba(4,10,18,0.42);";
		body.style.cssText="margin:14px 0 0 12px;padding:12px 18px 16px 16px;box-sizing:border-box;width:478px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.18;background:rgba(4,10,18,0.24);";
		html+="<div style='position:static;font-size:27px;font-weight:bold;line-height:1.05;margin:0 0 10px 0;'>選択肢画面</div>";
		html+="<div style='position:static;font-size:15px;margin-top:16px;'>";
		html+="<p style='margin:0 0 4px 0;'>画面下に表示されている選択肢の中から、あなたの行動</p>";
		html+="<p style='margin:0 0 12px 0;'>を選択してクリックするか、テンキーを押してください。</p>";
		html+="<p style='margin:0 0 12px 0;'>選んだ結果によって、物語が変化していきます。</p>";
		html+="<p style='margin:0 0 4px 0;'>画面右側にはシステムメニューが表示されています。</p>";
		html+="<p style='margin:0 0 4px 0;'>システムメニューをクリックするか、対応するキーを</p>";
		html+="<p style='margin:0 0 12px 0;'>押すと、以下の機能を使うことができます。</p>";
		html+="<p style='margin:0 0 4px 0;'>ＨＥＬＰ(−) ... 操作説明画面を出します。</p>";
		html+="<p style='margin:0 0 4px 0;'>ＬＯＡＤ(8) ... 保存してある場所からゲームを再開します。</p>";
		html+="<p style='margin:0 0 4px 0;'>ＣＯＮＦＩＧ(7) ... 環境設定画面を開きます。</p>";
		html+="<p style='margin:0 0 4px 0;'>ＥＸＩＴ(9) ... ゲームを終了し、タイトル画面に戻ります。</p>";
		html+="<p style='margin:8px 0 0 0;'>※ＳＫＩＰ、ＲＥＷＩＮＤは使用できません。</p>";
		html+="</div>";
		body.innerHTML=html;
		_inlineHelpWasPlaying=!!PF7sts;
		if (!(typeof _captureTitleHelpBackground==="function" && _captureTitleHelpBackground()))
			{try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}}
		if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
		if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
			{_reinjectPlayButtonHide(FLASH_PLAYER);setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);}
		_activeInlineHelpMode=num;
		overlay.style.display="block";
		return true;
		}
	else if (num==9)
		{
		// ★ セーブ画面HELP(原F5919)。EditTextがuseOutlines=0(デバイスフォント指定)でRuffleが描けず文字化け→HTMLオーバーレイで再現。
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:rgba(4,10,18,0.42);";
		body.style.cssText="margin:16px 0 0 12px;padding:12px 18px 16px 16px;box-sizing:border-box;width:478px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.3;background:rgba(4,10,18,0.24);";
		html+="<div style='position:static;font-size:27px;font-weight:bold;line-height:1.05;margin:0 0 14px 0;'>セーブ画面</div>";
		html+="<div style='position:static;font-size:15px;margin-top:30px;'>";
		html+="<p style='margin:0 0 7px 0;'>画面下に表示されている[1]～[8]をクリックするか、</p>";
		html+="<p style='margin:0 0 14px 0;'>対応するテンキーを押すと、ゲームを保存できます。</p>";
		html+="<p style='margin:0 0 7px 0;'>「セーブしない」をクリックするか、［０］を押すと</p>";
		html+="<p style='margin:0 0 14px 0;'>セーブせずに次の日へ進むことができます。</p>";
		html+="<p style='margin:0 0 7px 0;'>このゲームは、一日の終了時にしかセーブできません。</p>";
		html+="<p style='margin:0 0 7px 0;'>なお、セーブしないで次の日へ進んでも、自動セーブ機能</p>";
		html+="<p style='margin:0 0 14px 0;'>により一日終了時の状態は保存されています。</p>";
		html+="<p style='margin:0 0 7px 0;'>自動セーブは一日終了ごとに上書きされていきますので、</p>";
		html+="<p style='margin:0;'>大事なデータは明確に保存しておきましょう。</p>";
		html+="</div>";
		body.innerHTML=html;
		_inlineHelpWasPlaying=!!PF7sts;
		if (!(typeof _captureTitleHelpBackground==="function" && _captureTitleHelpBackground()))
			{try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}}
		if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
		if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
			{_reinjectPlayButtonHide(FLASH_PLAYER);setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);}
		_activeInlineHelpMode=num;
		overlay.style.display="block";
		return true;
		}
	else if (num==1)
		{
		// 読み返し画面HELP(原F5911、PF7(1))。EditText useOutlines=0→HTMLオーバーレイで再現。原文はF5911 EditTextから抽出。
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:rgba(4,10,18,0.42);";
		body.style.cssText="margin:16px 0 0 12px;padding:12px 18px 16px 16px;box-sizing:border-box;width:478px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.3;background:rgba(4,10,18,0.24);";
		html+="<div style='position:static;font-size:27px;font-weight:bold;line-height:1.05;margin:0 0 14px 0;'>読み返し画面</div>";
		html+="<div style='position:static;font-size:15px;margin-top:24px;'>";
		html+="<p style='margin:0 0 7px 0;'>イベント発生中、イベント先頭からの文章を読み返す</p>";
		html+="<p style='margin:0 0 14px 0;'>ことができます。</p>";
		html+="<p style='margin:0 0 7px 0;'>一画面に収まりきらない場合は、スクロールバーや</p>";
		html+="<p style='margin:0 0 7px 0;'>カーソルキーの上下、PageUP/PageDownなどで</p>";
		html+="<p style='margin:0 0 14px 0;'>スクロールさせることができます。</p>";
		html+="<p style='margin:0 0 7px 0;'>読み返し画面を右クリックするか、「ゲームに戻る」を</p>";
		html+="<p style='margin:0 0 7px 0;'>クリックするか、テンキーの０、＋、Enterを押すと</p>";
		html+="<p style='margin:0;'>元に戻ります。</p>";
		html+="</div>";
		body.innerHTML=html;
		_inlineHelpWasPlaying=!!PF7sts;
		if (!(typeof _captureTitleHelpBackground==="function" && _captureTitleHelpBackground()))
			{try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}}
		if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
		if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
			{_reinjectPlayButtonHide(FLASH_PLAYER);setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);}
		_activeInlineHelpMode=num;
		overlay.style.display="block";
		return true;
		}
	else if (num==2)
		{
		// 環境設定画面HELP(原F5912、PF7(2))。15行と長いためfont-size小さめ。原文はF5912 EditTextから抽出。
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:rgba(4,10,18,0.42);";
		body.style.cssText="margin:10px 0 0 12px;padding:10px 16px 12px 16px;box-sizing:border-box;width:480px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.2;background:rgba(4,10,18,0.24);";
		html+="<div style='position:static;font-size:24px;font-weight:bold;line-height:1.05;margin:0 0 8px 0;'>環境設定画面</div>";
		html+="<div style='position:static;font-size:13px;margin-top:8px;'>";
		html+="<p style='margin:0 0 3px 0;'>ゲームの環境設定を変更します。</p>";
		html+="<p style='margin:0 0 3px 0;'>各項目を切り替えるには、項目をクリックするか対応するテンキーを押してください。</p>";
		html+="<p style='margin:0 0 3px 0;'>ＢＧＭ演奏(1)…ＢＧＭ演奏の有無を切り替えます。</p>";
		html+="<p style='margin:0 0 3px 0;'>効果音再生(2)…効果音の再生の有無を切り替えます。</p>";
		html+="<p style='margin:0 0 3px 0;'>スキップ機能(3)…選択肢まで無条件、物語の分岐点まで無条件、読んだことのある場所まで、の３通りです。</p>";
		html+="<p style='margin:0 0 3px 0;'>選択肢の色(4)…選んだことのある選択肢に色を付けます。</p>";
		html+="<p style='margin:0 0 3px 0;'>一日終了時(5)…アニメーションの有無を切り替えます。</p>";
		html+="<p style='margin:0 0 3px 0;'>右クリック機能(6)…スキップ、読み返し、ズームの３通りです。</p>";
		html+="<p style='margin:0 0 3px 0;'>オートプレイ速度(7)…クリックしなくても自動的に進む機能です。</p>";
		html+="<p style='margin:0 0 3px 0;'>デフォルトに戻す…環境設定を初期状態に戻します。</p>";
		html+="<p style='margin:0 0 3px 0;'>既読のクリア…すでに読んだ文章の数を０にします。達成率が０％になるので注意してください。</p>";
		html+="<p style='margin:0;'>環境設定画面を閉じる(0)…ゲーム画面に戻ります。</p>";
		html+="</div>";
		body.innerHTML=html;
		_inlineHelpWasPlaying=!!PF7sts;
		if (!(typeof _captureTitleHelpBackground==="function" && _captureTitleHelpBackground()))
			{try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}}
		if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
		if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
			{_reinjectPlayButtonHide(FLASH_PLAYER);setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);}
		_activeInlineHelpMode=num;
		overlay.style.display="block";
		return true;
		}
	else if (num==6)
		{
		// 結果表示画面HELP(原F5916、PF7(6))。原文はF5916 EditTextから抽出。
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:rgba(4,10,18,0.42);";
		body.style.cssText="margin:14px 0 0 12px;padding:12px 18px 16px 16px;box-sizing:border-box;width:478px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.18;background:rgba(4,10,18,0.24);";
		html+="<div style='position:static;font-size:27px;font-weight:bold;line-height:1.05;margin:0 0 10px 0;'>結果表示画面</div>";
		html+="<div style='position:static;font-size:15px;margin-top:16px;'>";
		html+="<p style='margin:0 0 4px 0;'>コマンドの実行結果を表示しています。</p>";
		html+="<p style='margin:0 0 12px 0;'>マウスクリック、テンキーの０、Enterキーのいずれかで次に進みます。</p>";
		html+="<p style='margin:0 0 4px 0;'>画面右側にはシステムメニューが表示されています。</p>";
		html+="<p style='margin:0 0 4px 0;'>システムメニューをクリックするか、対応するキーを</p>";
		html+="<p style='margin:0 0 12px 0;'>押すと、以下の機能を使うことができます。</p>";
		html+="<p style='margin:0 0 4px 0;'>ＨＥＬＰ(−)…操作説明画面を出します。</p>";
		html+="<p style='margin:0 0 4px 0;'>ＬＯＡＤ(8)…保存してある場所からゲームを再開します。</p>";
		html+="<p style='margin:0 0 4px 0;'>ＣＯＮＦＩＧ(7)…環境設定画面を開きます。</p>";
		html+="<p style='margin:0 0 4px 0;'>ＥＸＩＴ(9)…ゲームを終了し、タイトル画面に戻ります。</p>";
		html+="<p style='margin:8px 0 0 0;'>※ＳＫＩＰ、ＲＥＷＩＮＤは使用できません。</p>";
		html+="</div>";
		body.innerHTML=html;
		_inlineHelpWasPlaying=!!PF7sts;
		if (!(typeof _captureTitleHelpBackground==="function" && _captureTitleHelpBackground()))
			{try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}}
		if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
		if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
			{_reinjectPlayButtonHide(FLASH_PLAYER);setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);}
		_activeInlineHelpMode=num;
		overlay.style.display="block";
		return true;
		}
	else if (num==10)
		{
		// ロード画面HELP(原F5920、PF7(10))。原文はF5920 EditTextから抽出。
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:rgba(4,10,18,0.42);";
		body.style.cssText="margin:16px 0 0 12px;padding:12px 18px 16px 16px;box-sizing:border-box;width:478px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.3;background:rgba(4,10,18,0.24);";
		html+="<div style='position:static;font-size:27px;font-weight:bold;line-height:1.05;margin:0 0 14px 0;'>ロード画面</div>";
		html+="<div style='position:static;font-size:15px;margin-top:24px;'>";
		html+="<p style='margin:0 0 7px 0;'>画面下に表示されている[1]〜[8]、9(AUTO)をクリック</p>";
		html+="<p style='margin:0 0 7px 0;'>するか、対応するテンキーを押すと、その場所からゲーム</p>";
		html+="<p style='margin:0 0 14px 0;'>を再開することができます。</p>";
		html+="<p style='margin:0 0 7px 0;'>マウスカーソルを重ねたとき、「データ無し」と表示</p>";
		html+="<p style='margin:0 0 14px 0;'>されるものは、保存されていないのでロードできません。</p>";
		html+="<p style='margin:0 0 7px 0;'>一日の終了時、セーブしなくても「自動セーブ機能」が</p>";
		html+="<p style='margin:0;'>働いていますので、その場所から再開することも可能です。</p>";
		html+="</div>";
		body.innerHTML=html;
		_inlineHelpWasPlaying=!!PF7sts;
		if (!(typeof _captureTitleHelpBackground==="function" && _captureTitleHelpBackground()))
			{try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}}
		if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
		if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
			{_reinjectPlayButtonHide(FLASH_PLAYER);setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);}
		_activeInlineHelpMode=num;
		overlay.style.display="block";
		return true;
		}
	else if (num==11)
		{
		// エンディング一覧画面HELP(原F5921、PF7(11))。原文はF5921 EditTextから抽出。
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:rgba(4,10,18,0.42);";
		body.style.cssText="margin:18px 0 0 12px;padding:12px 18px 16px 16px;box-sizing:border-box;width:478px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.4;background:rgba(4,10,18,0.24);";
		html+="<div style='position:static;font-size:27px;font-weight:bold;line-height:1.05;margin:0 0 14px 0;'>エンディング一覧画面</div>";
		html+="<div style='position:static;font-size:15px;margin-top:30px;'>";
		html+="<p style='margin:0 0 10px 0;'>あなたが今までに見た、エンディングの一覧表を表示します。</p>";
		html+="<p style='margin:0 0 10px 0;'>表題をクリックすると、そのエンディングを再生することができます。</p>";
		html+="<p style='margin:0;'>0キーを押すと、おまけメニューに戻ります。</p>";
		html+="</div>";
		body.innerHTML=html;
		_inlineHelpWasPlaying=!!PF7sts;
		if (!(typeof _captureTitleHelpBackground==="function" && _captureTitleHelpBackground()))
			{try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}}
		if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
		if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
			{_reinjectPlayButtonHide(FLASH_PLAYER);setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);}
		_activeInlineHelpMode=num;
		overlay.style.display="block";
		return true;
		}
	else if (num==12)
		{
		// 音楽鑑賞画面HELP(原F5922、PF7(12))。原文はF5922 EditTextから抽出。
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:rgba(4,10,18,0.42);";
		body.style.cssText="margin:18px 0 0 12px;padding:12px 18px 16px 16px;box-sizing:border-box;width:478px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.4;background:rgba(4,10,18,0.24);";
		html+="<div style='position:static;font-size:27px;font-weight:bold;line-height:1.05;margin:0 0 14px 0;'>音楽鑑賞画面</div>";
		html+="<div style='position:static;font-size:15px;margin-top:30px;'>";
		html+="<p style='margin:0 0 10px 0;'>ゲーム中に使用されたＢＧＭを聞くことができます。</p>";
		html+="<p style='margin:0 0 10px 0;'>４・６キーで曲の切り替え、０キーで再生、</p>";
		html+="<p style='margin:0;'>＋キーで曲の停止、９キーでおまけメニューに戻ります。</p>";
		html+="</div>";
		body.innerHTML=html;
		_inlineHelpWasPlaying=!!PF7sts;
		if (!(typeof _captureTitleHelpBackground==="function" && _captureTitleHelpBackground()))
			{try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}}
		if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
		if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
			{_reinjectPlayButtonHide(FLASH_PLAYER);setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);}
		_activeInlineHelpMode=num;
		overlay.style.display="block";
		return true;
		}
	else return false;
	overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:rgba(4,10,18,0.38);";
	body.style.cssText="margin:18px 0 0 12px;padding:12px 18px 16px 16px;box-sizing:border-box;width:470px;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 4px #001018;line-height:1.42;background:rgba(4,10,18,0.22);";
	html+="<div style='position:static;font-size:27px;font-weight:bold;line-height:1.05;margin:0 0 14px 0;'>"+titleText+"</div>";
	html+="<div style='position:static;font-size:15px;margin-top:38px;'>";
	html+="<p style='margin:0 0 10px 0;'>"+line1+"</p>";
	html+="<p style='margin:0 0 10px 0;'>"+line2+"</p>";
	html+="<p style='margin:0 0 10px 0;'>"+line3+"</p>";
	html+="<p style='margin:0 0 10px 0;'>"+line4+"</p>";
	html+="<p style='margin:0;'>"+line5+"</p>";
	html+="</div>";
	body.innerHTML=html;
	_inlineHelpWasPlaying=!!PF7sts;
	if (!(typeof _captureTitleHelpBackground==="function" && _captureTitleHelpBackground()))
		{
		try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}
		}
	if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
	if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
		{
		_reinjectPlayButtonHide(FLASH_PLAYER);
		setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);
		}
	_activeInlineHelpMode=num;
	overlay.style.display="block";
	return true;
	}
function _ensureOmakeOverlay()
	{
	var parent=document.getElementById("MAINW");
	var titleWrap,title,subtitle;
	if (!parent) return null;
	if (_omakeOverlay&&_omakeOverlay.parentNode) return _omakeOverlay;
	_omakeOverlay=document.createElement("div");
	_omakeOverlay.id="OMAKE_OVERLAY";
	_omakeOverlay.style.cssText="position:absolute;left:0;top:0;width:512px;height:360px;z-index:20;display:none;pointer-events:none;background:url('../swf/extracted_jpeg/char402.jpg') center center / cover no-repeat;";
	titleWrap=document.createElement("div");
	titleWrap.style.cssText="position:static;width:100%;padding-top:112px;display:flex;flex-direction:column;align-items:center;gap:10px;";
	title=document.createElement("div");
	title.style.cssText="position:static;text-align:center;color:#ffffff;font-family:'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif;font-size:42px;line-height:1;text-shadow:0 0 6px rgba(0,0,0,0.78),0 0 16px rgba(0,0,0,0.48);letter-spacing:1px;";
	title.textContent="Aquanaut Campus";
	titleWrap.appendChild(title);
	subtitle=document.createElement("div");
	subtitle.style.cssText="position:static;text-align:center;color:#f2f6ff;font-family:'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif;font-size:34px;line-height:1;text-shadow:0 0 5px rgba(0,0,0,0.78),0 0 10px rgba(0,0,0,0.42);letter-spacing:1px;";
	subtitle.textContent="おまけモード";
	titleWrap.appendChild(subtitle);
	_omakeOverlay.appendChild(titleWrap);
	parent.appendChild(_omakeOverlay);
	return _omakeOverlay;
	}
function _showOmakeOverlay()
	{
	var ov=_ensureOmakeOverlay();
	if (_omakeOverlayHoldTimer)
		{
		clearTimeout(_omakeOverlayHoldTimer);
		_omakeOverlayHoldTimer=null;
		}
	if (ov) ov.style.display="block";
	}
function _hideOmakeOverlay()
	{
	if (_omakeOverlayHoldTimer)
		{
		clearTimeout(_omakeOverlayHoldTimer);
		_omakeOverlayHoldTimer=null;
		}
	if (_omakeOverlay&&_omakeOverlay.parentNode) _omakeOverlay.style.display="none";
	}
function _holdOmakeOverlayForTitle(ms)
	{
	var ov=_ensureOmakeOverlay();
	if (!ov) return;
	if (_omakeOverlayHoldTimer)
		{
		clearTimeout(_omakeOverlayHoldTimer);
		_omakeOverlayHoldTimer=null;
		}
	ov.style.display="block";
	_omakeOverlayHoldTimer=setTimeout(function(){
		_omakeOverlayHoldTimer=null;
		_hideOmakeOverlay();
		},ms||800);
	}
// ★おまけモード(F5930,_omakeOverlay表示中)→イベントCG等へ移る瞬間、覆いを即外すと新フレームsettle前に
//   F5930 canvas残骸(文字化け)が約0.3秒露出する(篠原報告)。表示中のときだけ外すのをms(=0.5秒)遅らせCG描画後に外す。
//   非表示時(通常ゲーム/CG間切替)は何もしない＝覆いを再表示しない(CG切替を邪魔しない)。
function _delayHideOmakeOverlay(ms)
	{
	if (!_omakeOverlay||!_omakeOverlay.parentNode||_omakeOverlay.style.display==="none") return;
	if (_omakeOverlayHoldTimer) { clearTimeout(_omakeOverlayHoldTimer); _omakeOverlayHoldTimer=null; }
	_omakeOverlayHoldTimer=setTimeout(function(){ _omakeOverlayHoldTimer=null; _hideOmakeOverlay(); },ms||500);
	}
window._delayHideOmakeOverlay=_delayHideOmakeOverlay;
function _restartTitleAsStartup()
	{
	_hideTitleHelpOverlay();
	_hideOmakeOverlay();
	_clearTitleIntro();
	_titleIntroShown=false;
	_titleIntroActive=false;
	_titleIntroStartedAt=0;
	if (typeof _clearEndingSequenceTimer==="function") _clearEndingSequenceTimer();
	if (typeof _hideEndingRollOverlay==="function") _hideEndingRollOverlay();
	if (typeof _hideEndingTitleBgOverlay==="function") _hideEndingTitleBgOverlay();
	if (typeof _hideEndingTintOverlay==="function") _hideEndingTintOverlay();
	if (typeof _hideEdOverlay==="function") _hideEdOverlay();
	if (typeof _endingSequenceStage!=="undefined") _endingSequenceStage=0;
	if (typeof _cancelPlaybackDetection==="function") _cancelPlaybackDetection();
	if (typeof _unfreezePlayer==="function") _unfreezePlayer();
	try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}
	if (typeof _currentSWFFile!=="undefined") _currentSWFFile=null;
	if (typeof _currentCharId!=="undefined") _currentCharId=null;
	if (typeof _completionFired!=="undefined") _completionFired=false;
	nowwin="title";
	nowgame="off";
	branch=false;
	if (typeof PopMSG==="function") try{PopMSG();}catch(e){}
	ShowLayer("RAY2A");
	ShowLayer("RAY2B");
	HideLayer("RAY1b");
	HideLayer("SUBMSG");
	gotitle(true);
	if (typeof _reinjectPlayButtonHide==="function" && FLASH_PLAYER)
		{
		_reinjectPlayButtonHide(FLASH_PLAYER);
		setTimeout(function(){_reinjectPlayButtonHide(FLASH_PLAYER);},200);
		}
	}
function _startTitleIntro()
	{
	var overlay;
	if (_titleIntroShown) return;
	_clearTitleIntro();
	overlay=_ensureTitleIntroOverlay();
	if (!overlay) return;
	_titleIntroActive=true;
	_titleIntroShown=true;
	_titleIntroStartedAt=(new Date()).getTime();
	_titleIntroTextPrimary.innerHTML="";	// ★OP文字はSWF注入で復活したためHTMLオーバーレイ撤去（二重防止）
	_titleIntroTextSecondary.innerHTML="";
	overlay.style.display="block";
	_titleIntroTextPrimary.style.opacity="0";
	_titleIntroTextSecondary.style.opacity="0";
	_titleIntroTimer(function(){
		if (!_titleIntroActive) return;
		_titleIntroTextPrimary.style.opacity="1";
		},1000);
	_titleIntroTimer(function(){
		if (!_titleIntroActive) return;
		_titleIntroTextPrimary.style.opacity="0";
		},5000);
	_titleIntroTimer(function(){
		if (!_titleIntroActive) return;
		_titleIntroTextSecondary.style.opacity="1";
		},6000);
	_titleIntroTimer(function(){
		_clearTitleIntro();
		},10000);
	}

// ACSYS=環境設定の内容　ACF[32]=ゲームクリア状況 ACREAD=既読数
function bootsys()
	{
	var i,j,str,a;
	Q=SEQ;	// ★ schedule.js読込完了後に代入（トップレベルでは未定義だった）
	// resizeTo/moveTo removed (ブラウザ制限)
	// 環境設定の読みこみ
	ACSYS=cload(0,"ACSYSTEM");
	if (ACSYS==null)
		{
		// ★char8=動作モードの初期値を論理コア数で自動判定(6コア以下=軽量"1"/それ以上=標準"0")。以降CONFIGで変更可。
		ACSYS="00200000"+(((typeof navigator!=="undefined"&&navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=6))?"1":"0");
		}
	if (ACSYS.length==7) ACSYS+="0";	// 旧7桁(画面振動char7追加前)→8桁
	if (ACSYS.length==8) ACSYS+="0";	// 旧8桁(動作モードchar8追加前)→9桁(=標準)

	// システムフラグの読みこみ 
	// 0-23:各EDを見たフラグ 28:オプションメニュー
	// 29:音楽モード 30:裏モード
	ACGAME=cload(0,"ACGAME");
	if ((ACGAME==null)||(ACGAME=="")) ACGAME="00000000000000000000000000000000";
	for(i=0;i<=31;i++){ACF[i]=parseInt(ACGAME.charAt(i),10);}

	// 既読数の読みこみ 
	str=cload(0,"ACREAD");
	if (str==null) str="0";
	ACREAD=parseInt(str,10);

	// セーブデータのチェック
	for(i=1;i<=9;i++)
		{
		str=cload(0,"ac"+i);
		if ((str==null)||(str=="")) SVF[i]=0;
		else	{
			a=str.substr(0,2);
			j=parseInt(a,16);
			SVF[i]=j/7;
			}
		}

	// 環境設定画面の初期化 
	cfd[0]=document.getElementById("cf11").style;
	cfd[1]=document.getElementById("cf12").style;
	cfd[19]=document.getElementById("cf13").style;
	cfd[20]=document.getElementById("cf14").style;
	cfd[2]=document.getElementById("cf21").style;
	cfd[3]=document.getElementById("cf22").style;
	cfd[4]=document.getElementById("cf31").style;
	cfd[5]=document.getElementById("cf32").style;
	cfd[6]=document.getElementById("cf33").style;
	cfd[7]=document.getElementById("cf41").style;
	cfd[8]=document.getElementById("cf42").style;
	cfd[9]=document.getElementById("cf51").style;
	cfd[10]=document.getElementById("cf52").style;
	cfd[11]=document.getElementById("cf61").style;
	cfd[12]=document.getElementById("cf62").style;
	cfd[13]=document.getElementById("cf63").style;
	cfd[14]=document.getElementById("cf71").style;
	cfd[15]=document.getElementById("cf72").style;
	cfd[16]=document.getElementById("cf73").style;
	cfd[17]=document.getElementById("cf81").style;
	cfd[18]=document.getElementById("cf82").style;
	// ★動作モード(char8)設定行をCONFIG表に動的追加(body.htmはShift-JISのため触らずJSで注入)。振動行の直後に挿入。
	(function(){
		var sp=document.getElementById("cf81");
		if (sp && !document.getElementById("cf91"))
			{
			var tr=document.createElement("tr");
			tr.innerHTML='<td class=cfg onclick="keyin(105)" ondblclick="keyin(105)">動作モード(9)</td>'
				+'<td class=cfg2>'
				+'<span class=cfg3 id="cf91" onClick="PF4move(21)">標準　</span>'
				+'<span class=cfg3 id="cf92" onClick="PF4move(22)">軽量(旧型PC)</span>'
				+'</td>';
			var shakeTr=sp.parentNode.parentNode;	// span→td→tr(振動行)
			shakeTr.parentNode.insertBefore(tr,shakeTr.nextSibling);
			}
		})();
	cfd[21]=document.getElementById("cf91").style;
	cfd[22]=document.getElementById("cf92").style;
	PF4dsp();
	sfile="0";
	sstep=0;
	sts_bgm=null;
	sts_se=null;

	gotitle(true);
	}
function gotitle(status)
	{
	var str;
	var keepOmakeCover=(nowwin=="omake"&&_omakeOverlay&&_omakeOverlay.parentNode&&_omakeOverlay.style.display!="none");
	_hideSaveIntro();
	_hideTitleHelpOverlay();
	if (!keepOmakeCover) _hideOmakeOverlay();
	HideLayer("RAY3C");
	HideLayer("RAY3D");
	ShowLayer("RAY3E");
	str="<table border=0 cellpadding=0 cellspacing=0 style='margin-top:-31px;line-height:18px'>";
	str+="<tr><td><img src='blank.gif' width=400 height=1></td></tr>";
	str+="<tr><td class=selx style='padding:0 0 1px 0;line-height:18px' onclick='newgame()'>１：最初から始める</td></tr>";
	str+="<tr><td class=selx style='padding:0 0 1px 0;line-height:18px' onclick='loadgame()'>２：続きから始める</td></tr>";
	str+="<tr><td class=selx style='padding:0 0 1px 0;line-height:18px' onclick='PF4()'>３：環境設定</td></tr>";
	if (ACF[28]==1)	str+="<tr><td class=selx style='padding:0 0 1px 0;line-height:18px' onclick='omake()'>４：おまけ</td></tr>";
	str+="</table>";
	WriteLayer("TEXT",str);
	nowwin="title";branch=false;
	face(0);
	bgmon("12");
	focus();
	if (status) opmovie();
	_startTitleIntro();
	if (keepOmakeCover) _holdOmakeOverlayForTitle(status?950:550);
	}
function bgmon(num)
	{
	var a;
	nowbgm=num;
	if (nowwin=="omake2") sts_bgm=-1;
	if (skip) return;
	if (num!=sts_bgm)
		{
		sts_bgm=num;
		a=num;
		if (num<24) b=-1; else b=0;
		if ((cfg_bgm!="off")||(nowwin=="omake2")) {WriteBGM(a,b);}
		}
	}
function getbgm()
	{
	return sts_bgm;
	}
function bgmoff()
	{
	nowbgm=0;
	if (skip) return;
	sts_bgm=null;
	WriteBGM("",0);
	}
function seon(num,sts)
	{
	if (sts){	nowse=num;
		if (skip) return;
	 	if (num!=sts_se)
			{
			if (cfg_se) gose(num,sts);
			sts_se=num;
			}
		}
	else	 if ((!skip)&&(cfg_se)) gose(num,sts);
	}
function seoff(sts)
	{
	if (sts) 	{
		nowse=0;
		if (skip) return;
		stopse(sts);
		sts_se=null;
		}
	else	stopse(sts);
	}
function textout(str)
	{
	var dec;
	nowwin="";
	nowtext=makestring(str);
	if (skip) return;
	// A click that advanced into this line must not also consume it.
	_textClickGuardUntil=Date.now()+TEXT_CLICK_GUARD_MS;
	WriteLayer("TEXT",nowtext);
	if ((cfg_auto!=0)||(nowskip)) setautoclick();
	}
function skipend()
	{
	skip=false;
	if (nowbgm!=0) bgmon(nowbgm); else bgmoff();
	if (nowse!=0) seon(nowse,true); else seoff(true);
	WriteLayer("TEXT",nowtext);
	face(nowface);
	if (!drawsts) setposs(nowgrp);
	}
function setautoclick()
	{
	var wait;
	if ((cfg_auto==0)&&(!nowskip)) return;
	if (cfg_auto==1) {wait=wordslength*100;if (wait<2400) wait=2400;}
	if (cfg_auto==2) {wait=wordslength*60;if (wait<1800) wait=1800;}
	if (nowskip) wait=25;
	AutoH=setTimeout(autoclick,wait);
	}
function autoclick()
	{
	if ((nowwin=="")&&(display!="MAX")) {_klikFromAuto=true;klik();}
	}
function syson()
	{
	var a,b,str,c;
	c=nowfile;
	if (c.length==1) c="0"+c;
	str="8/";
	a=2+Math.floor(reg[0]/7);
	str+=a;
	WriteLayer("DATE",str);
	b=reg[0]%7;if (a==8) b=7;
	WriteLayer("TIME",timelbl[b]);
	if (c>="80") 	HideLayer("RAY3B");
		else	ShowLayer("RAY3B");
	ShowLayer("RAY3C");
	HideLayer("RAY3D");
	HideLayer("RAY3E");
	}
function sysoff()
	{
	HideLayer("RAY3B");
	HideLayer("RAY3C");
	ShowLayer("RAY3D");
	}
// ★ED1: Enterが押された時だけ警告オーバーレイを出す(Ctrl skipは可)。Enter skipの連続load死防止。
function _showEd1Warning()
	{
	var ov=document.getElementById("_ed1warn"),p;
	if (!ov){ ov=document.createElement("div"); ov.id="_ed1warn"; ov.style.cssText="position:absolute;top:6px;left:50%;transform:translateX(-50%);z-index:40;background:rgba(0,0,0,0.78);color:#fff;padding:5px 14px;border-radius:5px;font-size:13px;white-space:nowrap;pointer-events:none;"; p=document.getElementById("MAINW"); if(p) p.appendChild(ov); }
	if (!ov) return;
	ov.textContent="Enterでの送りは不可です（Ctrlキーでスキップできます）";
	ov.style.display="block"; ov.style.opacity="1";
	clearTimeout(window._ed1warnT);
	window._ed1warnT=setTimeout(function(){ var o=document.getElementById("_ed1warn"); if(o) o.style.display="none"; },3000);	// ★3秒=警告の表示時間
	}
window._showEd1Warning=_showEd1Warning;
function PF1()
	{
	if (nowwin=="HELP") return;
	if (nowgame=="event")
		{
		// ★ED1中はどんな状態でもEnter skip禁止(_ed1Active)。Enterが押されたら警告(3秒表示)を出すだけで送らない。Ctrl skip(nowskip)は別経路で可。
		if (window._ed1Active) { _showEd1Warning(); return; }
		skip=true;
		nowgame="off";
		decode();
		}
	}
function PF2()
	{
	nowwin="none";
	_hideSaveSlotPreview();
	sysoff();
	HideLayer("SAVEWIN");
	HideLayer("RAY2B");
	nowwin="saveintro";
	_startSaveIntro();
	}
function PF2off()
	{
	nowwin="none";
	_hideSaveIntro();
	_hideSaveSlotPreview();
	_showMenuFlashPlayer();
	PF2rev=false;
	HideLayer("SAVEWIN");
	ShowLayer("RAY2B");
	Q.Movie=2;
	if (cfg_anime) setposs(540);
	else {nowwin="";Q.main();}
	}
function PF2of()
	{
	if ((nowwin!="save")&&(nowwin!="load")) return;
	_hideSaveSlotPreview();
	if (PF2rev)
		{
		_showSaveStaticBackground();
		_showSaveLogoInstant();
		}
	}
function PF2on(num)
	{
	_showSaveSlotPreview(num);
	}
function PF2go(num)
	{
	PF2rev=false;
	gamesave(num);
	PF2off();
	}
function PF3()
	{
	if (nowwin=="HELP") return;
	if ((nowwin=="load")||(nowwin=="save")||(nowwin=="movie")) return;
	if (nowwin=="select") HideLayer("SUBMSG");
	_hideSaveSlotPreview();
	PF2rev=true;
	PF2sts=getsts();
	PF2pos=getpos();
	if (typeof _saveSceneForLoadReturn==="function") _saveSceneForLoadReturn();	// ★z34: ロード前の画面(立ち絵+背景)を保存→キャンセルで貼り直す
	_loadReturnReplayAnim=(typeof _isAnimatingForLoadReturn==="function" && _isAnimatingForLoadReturn());	// ★z120: アニメ途中なら戻りで頭から再ロード(setposs(74)が走る前に判定)
	_showSaveStaticBackground();
	_hideMenuFlashPlayer();
	_showSaveLogoInstant();
	bkgame=nowgame;
	nowgame="off";
	sysoff();
	bkwin=nowwin;nowwin="load";
	ShowLayer("LOADWIN");
	HideLayer("RAY2B");
	}
function PF3off()
	{
	nowwin=bkwin;
	_hideSaveIntro();
	_hideSaveSlotPreview();
	if (_suppressLoadFlashRestore) _suppressLoadFlashRestore=false;
	else _showMenuFlashPlayer();
	HideLayer("LOADWIN");
	ShowLayer("RAY2B");
	nowgame=bkgame;
	if (bkwin=="select") ShowLayer("SUBMSG");
	if ((bkwin=="title")&&(PF2rev))
		{
		gotitle(true);
		return;
		}
	if (PF2rev)
		{
		if (_loadReturnReplayAnim)
			{
			// ★z120: アニメ途中でロードに入っていた→snapshot静止画でなく、そのアニメSWFを頭から再ロード(setposs)。
			//   「最初から再生でOK」(篠原)。pause/play(実体保持)でなく既存のsetposs再ロード経路に乗せるので安全。
			//   PF2pos=getpos()はsetposs(74)が走る前に取得済み=アニメSWFの正しいフレーム番号。
			_loadReturnReplayAnim=false;
			revpos(PF2sts,PF2pos);	// = setposs(nowgrp) アニメSWFを頭から再生
			}
		else
			{
			// ★z34: ロード前のスナップショットを貼り直す(再ロード=setposs→#ccccccステージ経由を回避)。失敗時のみ従来revpos
			var _restored=(typeof _restoreSceneFromLoadReturn==="function") && _restoreSceneFromLoadReturn();
			if (!_restored)
				{
				// ★z116: snapshot復元失敗→従来revpos(setposs再ロード)に転落。この経路はFLASH可視のまま+誤マップで
				//   ▶(再生ボタン)/黒一色/音楽鑑賞画面を出しうる(報告例)。z116で保存側を堅牢化し基本ここには来ない想定→発火したら記録。
				if (typeof _dbg==="function") _dbg("PF3off: snapshot restore FAILED → fallback revpos→setposs("+PF2pos+") [▶/黒/音楽画面リスク経路]");
				revpos(PF2sts,PF2pos);
				}
			}
		}
	if (bkwin!="title") syson();
	if (cfg_auto!=0) setautoclick();
	}
function PF3go(num)
	{
	var a;
	PF2rev=false;
	a=gameload(num);
	if (a!=false) 
		{
		_suppressNextLoadVisual=true;
		_suppressLoadFlashRestore=true;
		closefile();branch=false;
		WriteLayer("TEXT","");
		// ★ 選択肢表示中(nowwin=select)にロードした場合、PF3off()がbkwin=="select"を見て
		//   古い選択肢(SUBMSG)を復活させ、ロードした新データのテキストと二重表示になるバグ。
		//   実ロード時は古い選択肢コンテキストを破棄(bkwin消去＋SUBMSG非表示)。
		//   キャンセル(PF3off単独)時は bkwin が残るので選択肢復帰は従来通り動く。
		bkwin="";HideLayer("SUBMSG");
		PF3off();sysoff();
		nowwin="false";bgmoff();seoff(true);seoff(false);
		Q.Movie=4;
		Q.movieend();
		}
	else PF2rev=true;
	}
function PF4()
	{
	if (nowwin=="HELP") return;
	if (nowwin=="title") _clearTitleIntro();
	WriteLayer("ALREADY",ACREAD+"/"+ACMAX);
	WriteLayer("RATE",Math.floor((ACREAD*10000/ACMAX))/100+"%");
	bk_bgm=cfg_bgm;bk_se=cfg_se;
	ShowLayer("CONFIGWIN");
	ShowLayer("RAY1b");
	sysoff();
	facehide();
	s="<table width=460 height=64 border=0 cellpadding=0><tr>";
	s+="<td valign=top style='line-height:23px;text-shadow:0 0 2px #ffffff'>";
	s+="<span class=text>環境設定画面表示中です。<br>右クリック、０キー、Enterキーのいずれかでゲームに戻ります。";
	s+="</span></td></tr></table>";
	WriteLayer("SUBMSG",s);
	ShowLayer("SUBMSG");
	HideLayer("RAY2B");
	bkwin=nowwin;
	nowwin="CONFIG";
	PF4dsp();
	}
function PF4off()
	{
	var str;
	csave(0,"ACSYSTEM",ACSYS);
	cwrite(0);
	if (bkwin!="title") syson();
	HideLayer("CONFIGWIN");
	HideLayer("RAY1b");
	HideLayer("SUBMSG");
	if (bkwin!="select") ShowLayer("RAY2B");
	facedraw();
	if (bkwin=="select") {WriteLayer("SUBMSG",selstr);ShowLayer("SUBMSG");}
	nowwin=bkwin;
	if ((bk_bgm!=cfg_bgm)&&(cfg_bgm!="off")&&(sts_bgm!=null)) {str=sts_bgm;sts_bgm="";bgmon(str);}
	if ((!bk_se)&&(cfg_se)&&(sts_se!=null)) {str=sts_se;sts_se="";seon(str,true);}
	if ((bk_bgm!="off")&&(cfg_bgm=="off")&&(sts_bgm!=null)) {WriteBGM("",0);}
	if ((bk_se)&&(!cfg_se)&&(sts_se!=null))
		{
		stopse(true);
		stopse(false);
		}
	if (nowwin=="title")
		{
		gotitle(true);
		return;
		}
	if ((nowwin=="")&&(cfg_auto!=0)) setautoclick();
	}
function PF4dsp()
	{
	if (ACSYS.charAt(0)=="3") {cfoff(0);cfoff(1);cfoff(19);cfon(20);cfg_bgm="off";}
	else {cfon(0);cfoff(1);cfoff(19);cfoff(20);cfg_bgm="auto";}	// WMA/MIDI廃止: 無し以外(旧wma=1/midi=2含む)は自動に集約
	if (ACSYS.charAt(1)=="0") {cfon(2);cfoff(3);cfg_se=true;}
	if (ACSYS.charAt(1)=="1") {cfoff(2);cfon(3);cfg_se=false;}
	if (ACSYS.charAt(2)=="0") {cfon(4);cfoff(5);cfoff(6);cfg_skip=0;}
	if (ACSYS.charAt(2)=="1") {cfoff(4);cfon(5);cfoff(6);cfg_skip=1;}
	if (ACSYS.charAt(2)=="2") {cfoff(4);cfoff(5);cfon(6);cfg_skip=2;}
	if (ACSYS.charAt(3)=="0") {cfon(7);cfoff(8);cfg_select=true;}
	if (ACSYS.charAt(3)=="1") {cfoff(7);cfon(8);cfg_select=false;}
	if (ACSYS.charAt(4)=="0") {cfon(9);cfoff(10);cfg_anime=true;}
	if (ACSYS.charAt(4)=="1") {cfoff(9);cfon(10);cfg_anime=false;}
	if (ACSYS.charAt(5)=="0") {cfon(11);cfoff(12);cfoff(13);cfg_right=0;}
	if (ACSYS.charAt(5)=="1") {cfoff(11);cfon(12);cfoff(13);cfg_right=1;}
	if (ACSYS.charAt(5)=="2") {cfoff(11);cfoff(12);cfon(13);cfg_right=2;}
	if (ACSYS.charAt(6)=="0") {cfon(14);cfoff(15);cfoff(16);cfg_auto=0;}
	if (ACSYS.charAt(6)=="1") {cfoff(14);cfon(15);cfoff(16);cfg_auto=1;}
	if (ACSYS.charAt(6)=="2") {cfoff(14);cfoff(15);cfon(16);cfg_auto=2;}
	if (ACSYS.charAt(7)=="0") {cfon(17);cfoff(18);cfg_shake=true;}
	if (ACSYS.charAt(7)=="1") {cfoff(17);cfon(18);cfg_shake=false;}
	// ★動作モード(char8): 標準="0"=12fps想定 / 軽量="1"=8fps想定。低性能PCでフェード等が完走前にfreezeされ霞む対策。
	if (ACSYS.charAt(8)=="1") {cfoff(21);cfon(22);}
	else {cfon(21);cfoff(22);}
	if (typeof _setAssumedFps==="function") _setAssumedFps(ACSYS.charAt(8)=="1"?8:12);
	}
function cfon(num) {cfd[num].background="red";}
function cfoff(num) {cfd[num].background="transparent";}

function PF4move(num)
	{
	if (num==0) PF4set(0,0);
	if (num==1) PF4set(0,1);
	if (num==19) PF4set(0,2);
	if (num==20) PF4set(0,3);
	if (num==2) PF4set(1,0);
	if (num==3) PF4set(1,1);
	if (num==4) PF4set(2,0);
	if (num==5) PF4set(2,1);
	if (num==6) PF4set(2,2);
	if (num==7) PF4set(3,0);
	if (num==8) PF4set(3,1);
	if (num==9) PF4set(4,0);
	if (num==10) PF4set(4,1);
	if (num==11) PF4set(5,0);
	if (num==12) PF4set(5,1);
	if (num==13) PF4set(5,2);
	if (num==14) PF4set(6,0);
	if (num==15) PF4set(6,1);
	if (num==16) PF4set(6,2);
	if (num==17) PF4set(7,0);
	if (num==18) PF4set(7,1);
	if (num==21) PF4set(8,0);	// 動作モード:標準
	if (num==22) PF4set(8,1);	// 動作モード:軽量
	PF4dsp();
	}
function PF4set(num,value)
	{
	ACSYS=ACSYS.substring(0,num)+value+ACSYS.substring(num+1);
	}
function PF4reset()
	{
	ACSYS="002000000";	// ★9桁(char8=動作モード"0"=標準)
	PF4dsp();
	}
function PF4clear()
	{
	var i,a;
	var sts=confirm("データを全てクリアします。よろしいですか？\n（読破率が０になります）");
	if (sts)
		{
		i=0;
		while(1==1)
			{
			a=scenario[i];
			if (a==-1) break;
			csave(0,"read"+a,"");
			i++;
			}
		ACREAD=0;
		csave(0,"ACREAD",""+ACREAD);
		readf="";
		for(i=0;i<=999;i++) readf+="0";
		ACGAME="00000000000000000000000000000000";
		for(i=0;i<=31;i++){ACF[i]=parseInt(ACGAME.charAt(i),10);}
		csave(0,"ACGAME",ACGAME);
		WriteLayer("ALREADY",ACREAD+"/"+ACMAX);
		WriteLayer("RATE",Math.floor((ACREAD*10000/ACMAX))/100+"%");
		cwrite(0);
		}
	}
function PF5()
	{
	if (nowwin=="HELP") return;
	if (nowwin==""){
	WriteLayer("HISTWIN",histtext+"<span class=selx onclick='PF5off()'><font color=white>ゲームに戻る</font></span>");
	ShowLayer("HISTWIN");
	ShowLayer("RAY1b");
	sysoff();
	facehide();
	s="<table width=460 height=64 border=0 cellpadding=0><tr>";
	s+="<td class=sub>";
	s+="テキスト再読表示中です。<br>右クリック、０キー、＋キーのいずれかでゲームに戻ります。";
	s+="</td></tr></table>";
	WriteLayer("SUBMSG",s);
	ShowLayer("SUBMSG");
	HideLayer("RAY2B");
	HISTfocus();
	nowwin="REVIEW";
	}
	}
function PF5off()
	{
	syson();
//	MoveLayerY("RAY1",0);
	HideLayer("HISTWIN");
	HideLayer("SUBMSG");
	ShowLayer("RAY2B");
	HideLayer("RAY1b");
	facedraw();
	nowwin="";
	if (cfg_auto!=0) setautoclick();
	}
function PF6()
	{
	var a;
	if (nowwin=="HELP") return;
	a=confirm("タイトル画面に戻ります。\nよろしいですか？");
	if (a) 
		{
		exitprocess();
		}
	}
function exitprocess()
	{
	closefile();
	skip=false;
	seoff(true);seoff(false);
	HideLayer("SUBMSG");
	nowgame="";
	sysoff();face(0);
	// ★z166: z165(個別リセット追加)でもED18途中EXIT→F5012(OP)不再生が直らず。本編ED→タイトルの_restartTitleAsStartupは
	//   ED系hide/_endingSequenceStage=0/nowwin=title/branch/PopMSG/_clearTitleIntro等まで含む完全リセットで、これが本編EDで
	//   F5012が再生される理由。exitprocessはその一部しか真似ておらず不足だった。完全に_restartTitleAsStartupへ統一する
	//   (skip解除はその先のopmovieが担う=z106)。closefile/seoff/sysoff/face(0)は本編EXIT用に先に実行済み。
	if (typeof _restartTitleAsStartup==="function") {_restartTitleAsStartup();return;}
	ShowLayer("RAY2A");	// フォールバック(旧経路、_restartTitleAsStartup未定義時のみ)
	ShowLayer("RAY2B");
	gotitle(true);
	}
function PF7(num)
	{
	PF7win=nowwin;
	nowwin="HELP";
	PF7mode=num;
	PF7sts=getsts();
	PF7Frame=getpos();
	PushMSG();
	if ((num==0)||(num==3)||(num==4)||(num==6)||(num==7)||(num==8)||(num==11)||(num==12))
		HideLayer("RAY2B");
	if (num==1){
		HideLayer("HISTWIN");
		HideLayer("RAY1b");
		}
	if (num==2)
		{
		HideLayer("CONFIGWIN");
		HideLayer("RAY1b");
		}
	if (num==9) HideLayer("SAVEWIN");
	if (num==10) HideLayer("LOADWIN");
	if (num==11) {HideLayer("RAY1b");HideLayer("HISTWIN");}
	s="<table width=460 height=64 border=0 cellpadding=0><tr>";
	s+="<td valign=top style='text-shadow:0 0 2px #ffffff;line-height:23px;'>";
	s+="<span class=text>操作説明表示中です。<br>メッセージ域をクリック、右クリック、<br>０キー、−キー、Enterキーのいずれかでゲームに戻ります。";
	s+="</span></td></tr></table>";
	WriteLayer("SUBMSG",s);
	ShowLayer("SUBMSG");
	if ((num==0)&&_showInlineHelpOverlay(0)) return;
	if ((num==3)&&_showTitleHelpOverlay()) return;
	if (((num==1)||(num==2)||(num==4)||(num==5)||(num==6)||(num==7)||(num==8)||(num==9)||(num==10)||(num==11)||(num==12))&&_showActionInlineHelpOverlay(num)) return;
	setposs(5910+num);
	}
function PF7off()
	{
	var num;
	num=PF7mode;
	if (num==3)
		{
		_restartTitleAsStartup();
		return;
		}
	if (((num==0)||(num==1)||(num==2)||(num==4)||(num==5)||(num==6)||(num==7)||(num==8)||(num==9)||(num==10)||(num==11)||(num==12))&&(_activeInlineHelpMode==num))
		{
		_hideTitleHelpOverlay(true);
		}
	else revpos(PF7sts,PF7Frame);
	PopMSG();HideLayer("SUBMSG");
	if ((num==0)||(num==3)||(num==4)||(num==6)||(num==7)||(num==8)||(num==11)||(num==12))
		ShowLayer("RAY2B");
	if (num==1)
		{
		ShowLayer("SUBMSG");
		ShowLayer("HISTWIN");
		ShowLayer("RAY1b");
		HISTfocus();
		}
	if (num==2) {ShowLayer("SUBMSG");
		ShowLayer("RAY1b");
		ShowLayer("CONFIGWIN");}
	if (num==5) {WriteLayer("SUBMSG",selstr);ShowLayer("SUBMSG");}
	if (num==9) ShowLayer("SAVEWIN");
	if (num==10) ShowLayer("LOADWIN");
	if (num==11) {ShowLayer("HISTWIN");ShowLayer("RAY1b");}
	nowwin=PF7win;
	if ((nowwin=="")&&(cfg_auto!=0)) setautoclick();
	}
// -------------------------------------------------------------
function ACFset(num)
	{
	var i,a,s;
	ACF[num]=1;
	if (ACF[28]==0) ACF[28]=1;
	a=0;
	for(i=0;i<=24;i++) {if (ACF[i]==1) a++;}
	if ((a>=3)&&(ACF[29]==0)) ACF[29]=1;
	a=ACREAD/ACMAX;
	if (a>=0.7) ACF[30]=1;
	s="";
	for(i=0;i<=31;i++) {s+=""+ACF[i];}
	csave(0,"ACGAME",s);
	}
// ★裏モード: 全ED・全おまけ(ED一覧/音楽鑑賞/特別付録)を開放する。タイトル画面でUキーから呼ぶ。
function _unlockAllEd()
	{
	var i,s;
	for(i=0;i<=24;i++) ACF[i]=1;	// 全ED達成扱い(omake1のED一覧が全部表示される)
	ACF[28]=1;ACF[29]=1;ACF[30]=1;	// おまけ開放・音楽鑑賞・特別付録
	s="";for(i=0;i<=31;i++) s+=""+ACF[i];
	csave(0,"ACGAME",s);	// localStorageに保存(次回起動後も維持)
	if (typeof gotitle==="function") gotitle(false);	// タイトルメニュー再描画(status=falseでOP再生せず)→「4：おまけ」を即表示
	alert("【裏モード】全ED・全おまけを開放しました。タイトルの「４：おまけ」から確認できます。");
	}
window._unlockAllEd=_unlockAllEd;
// ★デバッグモード: 全イベント(EDまで=kidcomment 0-69)を番号で直接再生し、イベント終了(#e/#E/#J)でこの一覧に戻る。
//   テキスト通し検証([[open-issues]]最優先)の加速用。裏モードUキーから起動。ルート前提flagはEDフローチャート由来。
function _showDebugMenu()
	{
	var str,msg,i;
	window._debugMode=true;
	if (typeof skip!=="undefined") skip=false;
	if (typeof nowskip!=="undefined") nowskip=false;
	if (typeof _cancelPlaybackDetection==="function") _cancelPlaybackDetection();
	if (typeof _unfreezePlayer==="function") _unfreezePlayer();
	// ★戻り時リセット: 前イベントのBGM/SE/背景/canvas残骸を消す(omake()/exitprocess()と同型)。
	//   これが無いと前章のBGMが鳴り続け、背景/立ち絵canvasが一覧の裏に残る。
	if (typeof bgmoff==="function") bgmoff();
	if (typeof seoff==="function") {seoff(true);seoff(false);}
	if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
	try{if (typeof FLASH_PLAYER!=="undefined" && FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}
	// ★canvasを実消去。hideだけだとタイトルSWF(F5012「2002」)等のcanvas残骸が残り、char無し背景フレーム(F0102等)に
	//   入った瞬間にfreeze化されて居座り、本来の背景(char067)を埋もれさせる(篠原報告)。pixelごと消す。
	if (typeof _clearFlashCanvas==="function") _clearFlashCanvas();
	if (typeof _currentSWFFile!=="undefined") _currentSWFFile=null;
	if (typeof showBackgroundFile==="function") showBackgroundFile("char402.jpg");
	nowwin="debug"; nowgame="off";
	str="【デバッグ】①イベントを選ぶ→②入口フラグ分岐を選ぶ→再生。終わるとこの一覧に戻る。";
	WriteLayer("TEXT",str);
	msg="<table border=0 cellspacing=0 cellpadding=2><tr><td><img src='blank.gif' width=400 height=1></td></tr>";
	for(i=0;kidfile[i]!=-1;i++)
		{
		if (kidfile[i]>=91 && kidfile[i]<=93) continue;	// ★ED本体(91/92/93)はomakeで個別再生できるので一覧から除外。結果発表(95/96/97=グッド/ノーマル/バッド)は含めて足す(篠原要望)。テキスト後はreg14=0でED凪(91)へ流れる
		msg+="<tr><td class=selx onclick='_debugBranch("+i+")'><font color=white>["+i+"] "+kidcomment[i]+" ("+kidfile[i]+".dat)</font></td></tr>";
		}
	msg+="</table>";
	ShowLayer("HISTWIN"); ShowLayer("RAY1b");
	WriteLayer("HISTWIN",msg);
	try{document.getElementById("HISTWIN").focus();}catch(e){}
	}
// ★章の冒頭#f?(入口フラグ分岐)を最初の#a(=本編開始)まで動的解析し、各分岐を個別に選べるサブメニュー。
//   同じ日(同じ.dat)でもflgで展開が分かれるものを全部選べるようにする(篠原指示2026-06-21)。
async function _debugBranch(idx)
	{
	var kf=kidfile[idx],branches=[],i,l,m,lines,resp,buf,msg,fs;
	try{
		resp=await fetch("../sys/"+kf+".dat?cb="+Date.now());
		buf=await resp.arrayBuffer();
		lines=new TextDecoder("shift_jis").decode(buf).split(/\r?\n/);
		for(i=0;i<lines.length;i++)
			{
			l=lines[i];
			m=l.match(/^#f\?\s+(\S+)\s+(\d+)/);
			if (m) {branches.push({cond:m[1],label:m[2]});continue;}
			if (/^#a\s/.test(l)) break;	// 最初の#a(分岐の飛び先/本編開始)で入口#f?群は終わり。間のセリフ/#J/#sは読み飛ばす
			}
	}catch(e){}
	if (branches.length===0) { _debugJump(idx,""); return; }	// 分岐なしの章は直接再生
	msg="<table border=0 cellspacing=0 cellpadding=2><tr><td><img src='blank.gif' width=400 height=1></td></tr>";
	msg+="<tr><td class=selx onclick='_debugJump("+idx+",\"\")'><font color=#aaffaa>(分岐なし／デフォルト＝入口flg全部off)</font></td></tr>";
	for(i=0;i<branches.length;i++)
		{
		fs=_condToFlgs(branches[i].cond);
		msg+="<tr><td class=selx onclick='_debugJump("+idx+",\""+fs+"\")'><font color=white>flg "+branches[i].cond+" → a"+branches[i].label+"</font></td></tr>";
		}
	msg+="<tr><td class=selx onclick='_showDebugMenu()'><font color=#ffff88>← 章一覧へ戻る</font></td></tr>";
	msg+="</table>";
	WriteLayer("TEXT","【"+kidcomment[idx]+" ("+kf+".dat)】入口フラグ分岐を選択（flg条件→飛び先ラベル）。");
	ShowLayer("HISTWIN"); ShowLayer("RAY1b");
	WriteLayer("HISTWIN",msg);
	}
// #f?条件式("19*!10")→真にするflg番号をカンマ区切りで。否定(!N)項はクリア済み(=0)なので除外。
function _condToFlgs(cond)
	{
	var parts=(""+cond).split("*"),out=[],p,k;
	for(k=0;k<parts.length;k++){ p=parts[k]; if (p.length && p.charAt(0)!=="!") out.push(p); }
	return out.join(",");
	}
async function _debugJump(idx,flgStr)
	{
	var i,kf,fs;
	HideLayer("HISTWIN"); HideLayer("RAY1b");
	kf=kidfile[idx];
	for(i=0;i<=79;i++) flg[i]=0;
	for(i=0;i<=29;i++) reg[i]=0;
	reg[7]=10; reg[9]=10;                   // 凪/さやか好感度(ルート章が前提)を最大付与
	if (flgStr){ fs=(""+flgStr).split(","); for(i=0;i<fs.length;i++){ if(fs[i]!=="") flg[parseInt(fs[i],10)]=1; } }	// 入口分岐選択: 指定flgのみON
	else { if (kf>=40 && kf<=48) flg[28]=1; else if (kf>=60 && kf<=69) flg[26]=1; }	// デフォルト/分岐なし時のルート保険
	window._debugMode=true; window._debugLoading=true;
	nowwin=""; nowgame="event";
	await readfile(kf);
	window._debugLoading=false;
	}
window._showDebugMenu=_showDebugMenu;
window._debugBranch=_debugBranch;
window._debugJump=_debugJump;
// -------------------------------------------------------------
async function readfile(fname)
	{
	if (window._debugMode && !window._debugLoading) { _showDebugMenu(); return; }	// ★デバッグ: 章末#Jの次章ロードを止め一覧へ復帰
	_dbg("[readfile] fname="+fname+" nowgame="+nowgame+" nowwin="+nowwin);
	nowgame="off";	// ★ fetch中のklik→decode()を阻止（init_scn→decodeで"event"に復帰）
	closefile();
	af=cload(0,"read"+fname);
	nowfile=fname;
	if ((af==null)||(af==""))
		{
		readf="";
		for(i=0;i<=999;i++) readf+="0";
		}
	else readf=decodemap(af);
	syson();
	await LoadScn(fname);
	init_scn();
	}
function closefile()
	{
	_dbg("[closefile] readf empty="+(readf=="")+", nowfile="+nowfile);
	if (readf!="")
		{
		af=encodemap(readf);
		csave(0,"read"+nowfile,af);
		readf="";
		csave(0,"ACREAD",""+ACREAD);
		cwrite(0);
		}
	}
function encodemap(data)
	{
	var result="",blk="",cord="";
	var bkc="",bkk=-1,i;
	for(i=0;i<1000;i++)
		{
		a=data.charAt(i);
		if ((bkc!=a)||(bkk>=254))
			{
			if (bkk!=-1)
				{
				bkkh=bkk.toString(16);
				if (bkkh.length==1) bkkh="0"+bkkh;
				if (bkk>3) blk=cord+""+bkkh;
				result+=blk;
				}
			bkk=0;bkc=a;blk="";
			if (a=="0") cord="A";
			if (a=="1") cord="B";
			if (a=="2") cord="C";
			}
		blk+=a;bkk++;		
		}
	if (bkk!=-1)
		{
		bkkh=bkk.toString(16);
		if (bkkh.length==1) bkkh="0"+bkkh;
		if (bkk>3) blk=cord+""+bkkh;
		result+=blk;
		}
	return result;
	}
function decodemap(data)
	{
	var result="",blk="",blk9=0,cord="";
	var bkc="",bkk=-1,i,p=-1;
	var len=data.length;
	while(1==1)
		{
		p++;
		if (p>len) break;
		a=data.charAt(p);
		if ((a>="0")&&(a<="2")) {result+=a;continue;}
		if (a=="A") cord="0";
		if (a=="B") cord="1";
		if (a=="C") cord="2";
		p++;
		blk=data.substr(p,2);
		blk9=parseInt(blk,16);
		for(i=1;i<=blk9;i++) result+=cord;
		p++;
		}
	return result;
	}

function init_scn(){
	_dbg("[init_scn] nowfile="+nowfile+" endline will be set");
	i=0;Line=0;
	histtext="";
	while(1==1)
		{
		s=scn[i];
		if (s=="") {endline=i;break;}
		wa=s.charAt(0);
		if (wa=='#'){
			wb=s.charAt(1);
			wlen=s.length;
			if (wb=='a')
				{
				wc=s.substring(3,wlen);
				j=parseInt(wc,10);
				anch[j]=i;
				}
			}
		i++;
		}
	decode();
	}
function getstr(){
	var a,c,b1,b2;
	a=scn[Line];
	if (a==null || typeof a==="undefined"){
		_dbg("[getstr] GUARD: scn["+Line+"] is undefined, returning **");
		Line++;
		return "**";
		}
	c=readf.charAt(Line);
	linests=c;
	if (c=="0")
		{
		kidoku=false;
		if ((cfg_skip==2)&&(skip)) skipend();
		if ((nowskip)&&(cfg_skip==2)) {nowskip=false;clearTimeout(AutoH);if (cfg_auto!=0) setautoclick();if (typeof _refreezeCurrentCharFrame==="function") _refreezeCurrentCharFrame();}
		b1=a.charAt(0);b2=a.charAt(1);
		wread=readf.substr(0,Line)+"1"+readf.substr(Line+1,999);
		readf=wread;
		nowf9=parseInt(nowfile,10);
		if ((nowf9<70)||(nowf9>=90))
			{
			if ((b1!="#")||(b2=="t")) ACREAD++;
			}
		}
	else	kidoku=true;
	Line++;
	return a;
	}
var _decoding=false;
async function decode()
	{
	if (_decoding){_dbg("[decode] REENTRANT BLOCKED");return;}
	_decoding=true;
	_dbg("[decode] Line="+Line+" nowfile="+nowfile+" nowwin="+nowwin+" nowgame="+nowgame);
	var wa,wb,wc,wd,wlen,wstr,wstr2;
	var a,a0,i,j,k,b1,b2;
	fskip=false;
	try{
	while(1==1){
		if (branch) break;
		s=getstr();
		wlen=s.length;
		wa=s.charAt(0);
		if (_suppressNextLoadVisual && wa!='#') _suppressNextLoadVisual=false;
		if (wa=='#'){
			wb=s.charAt(1);
			if (_suppressNextLoadVisual)
				{
				if ((wb!='v')&&(wb!='m')&&(wb!='p')&&(wb!='P')&&(wb!='f')&&(wb!='F')&&(wb!='#')&&(wb!='j')&&(wb!='J')&&(wb!='x')&&(wb!='X'))
					_suppressNextLoadVisual=false;
				}
			if (wb=='#')
				{
				if (skip) skipend();
				continue;
				}
			if (wb=='j')
				{
				wc=s.substring(3,wlen);
				j=parseInt(wc,10);
				Line=anch[j];
				continue;
				}
			if (wb=='J')
				{
				wc=s.substring(3,wlen);
				j=parseInt(wc,10);
				_decoding=false;	// ★ readfile→init_scn→decode()の再入を許可
				await readfile(j);
				break;
				}
			if (wb=='s')		// 選択肢
				{
				wd=parseInt(s.charAt(2),10);
				selmake(wd);
				break;
				}
			if (wb=='t')		// トークコマンド
				{
				wc=s.substring(3,wlen);
				brn1=wc.split(" ");
				face(brn1[0]);
				textout(brn1[1]);
				if (skip) continue;
				if (nowgame!="event") nowgame="event";
				break;
				}
			if (wb=='Q')	// ゲーム終了
				{
				exitprocess();
				break;
				}
			if (wb=='e')	// イベント終了（コマンド実行有効）
				{
				_dbg("[decode] #e at Line="+Line+" nowfile="+nowfile);
				skip=false;face(0);
				seoff(true);seoff(false);
				Q.endevent(true);
				break;
				}
			if (wb=='E')	// イベント終了（コマンド実行無効）
				{
				_dbg("[decode] #E at Line="+Line+" nowfile="+nowfile);
				nowskip=false;skip=false;face(0);
				seoff(true);seoff(false);
				_dbg("[decode] #E calling Q.endevent(false)...");
				try{Q.endevent(false);}catch(e){_dbg("[decode] #E ERROR: "+e.message);console.error("#E endevent error:",e);}
				_dbg("[decode] #E endevent returned");
				break;
				}
			if (wb=='m')	// 音楽再生コマンド #m
				{
				wc=s.substring(3,wlen);
				if (wc=="off"){bgmoff();continue;}
				bgmon(wc);
				continue;
				}
			if (wb=='p')		// ＳＥ再生コマンド #p
				{
				wc=s.substring(3,wlen);
				if (wc=="off"){seoff(false);continue;}
				seon(wc,false);
				continue;
				}
			if (wb=='P')	// 持続ＳＥ再生コマンド #P
				{
				wc=s.substring(3,wlen);
				if (wc=="off"){seoff(true);continue;}
				seon(wc,true);
				continue;
				}
			if (wb=='v')		// Flashムービー再生コマンド #v
				{
				wc=parseInt(s.substring(3,wlen),10);
				_dbg("[decode] #v "+wc+" at Line="+Line);
				if (_suppressNextLoadVisual)
					{
					_suppressNextLoadVisual=false;
					if (typeof showSceneBackgroundOnly==="function") showSceneBackgroundOnly(wc);
					else setposs(wc);
					continue;
					}
				setposs(wc);continue;
				}
			if (wb=='V')	// スキップ不可ムービー	
				{
				if (skip) skipend();
				textout("");
				nowwin="wait";
				wc=parseInt(s.substring(3,wlen),10);
				setposs(wc);
				break;
				}
			if (wb=='c')		// スタッフロール
				{
				wc=parseInt(s.substring(3,wlen),10);
				window._ed1Active=false;	// ★ED roll(#c)突入でED1のEnter skip禁止を解除(規制はED1突入〜roll前まで)。起点はomake1go(num===1)
				ACFset(wc);
				closefile();skip=false;seoff(true);
				nowwin="ending";sysoff();
				HideLayer("RAY3D");
				HideLayer("RAY2A");
				HideLayer("RAY2B");
				wd=endm[wc];bgmon(wd);
				setposs(4900+wc);
				break;
				}
			if (wb=='x')		// 画面を揺らす
				{
				if ((!skip)&&(!nowskip)&&(cfg_shake)) shake(false);
				continue;
				}
			if (wb=='X')	// 画面を揺らす（強）
				{
				if ((!skip)&&(!nowskip)&&(cfg_shake)) shake(true);
				continue;
				}
			if (wb=='f'){  // フラグ操作コマンド
				wd=s.charAt(2);
				if (wd=='+') {wc=parseInt(s.substring(4,wlen),10);flg[wc]=1;continue;}
				if (wd=='-') {wc=parseInt(s.substring(4,wlen),10);flg[wc]=0;continue;}
				if (wd=='?')	{
						fskip=true;
						wstr=s.substring(4,wlen);
						brn0=wstr.split(" ");
						j=parseInt(brn0[1],10);
						i=detect(brn0[0]);
						if (i==true) 
							{
							Line=anch[j];
							if (cfg_skip==1) skipend();
							continue;
							}
						continue;
						}
				}
			if (wb=='F'){  // システムフラグ操作
				wd=s.charAt(2);
				if (wd=='+') {wc=parseInt(s.substring(4,wlen),10);ACFset(wc);continue;}
				if (wd=='?')	{
						fskip=true;
						wstr=s.substring(4,wlen);
						brn0=wstr.split(" ");
						j=parseInt(brn0[1],10);
						i=detect(brn0[0]);
						if (i==true) 
							{
							Line=anch[j];
							if (cfg_skip==1) skipend();
							continue;
							}
						continue;
						}
				}
			if (wb=='r'){ // レジスタ操作コマンド
				wc=s.charAt(2);
				if (wc=='+') {wd=parseInt(s.substring(4,wlen),10);if (reg[wd]<100) reg[wd]++;continue;}
				if (wc=='-') {wd=parseInt(s.substring(4,wlen),10);if (reg[wd]>0) reg[wd]--;continue;}
				if (wc=='=') 	{
						wstr=s.substring(4,wlen);
						brn0=wstr.split(" ");
						i=parseInt(brn0[0],10);
						j=parseInt(brn0[1],10);
						reg[i]=j;continue;
						}
				if (wc=='<') 	{
						wstr=s.substring(4,wlen);
						brn0=wstr.split(" ");
						i=parseInt(brn0[0],10);
						j=parseInt(brn0[1],10);
						reg[i]+=j;
						if (reg[i]>100) reg[i]=100;
						continue;
						}
				if (wc=='>') 	{
						wstr=s.substring(4,wlen);
						brn0=wstr.split(" ");
						i=parseInt(brn0[0],10);
						j=parseInt(brn0[1],10);
						reg[i]-=j;
						if (reg[i]<0) reg[i]=0;
						continue;
						}
				if (wc=='?')	{	//	レジスタ値によって分岐する
						fskip=false;
						wstr=s.substring(4,wlen);
						brn0=wstr.split(" ");
						i=parseInt(brn0[0],10);
						j=parseInt(brn0[2],10);
						k=parseInt(brn0[3],10);
						if ((brn0[1]=="=")&&(reg[i]==j)) fskip=true;
						if ((brn0[1]==">")&&(reg[i]>j)) fskip=true;
						if ((brn0[1]=="<")&&(reg[i]<j)) fskip=true;
						if ((brn0[1]=="<=")&&(reg[i]<=j)) fskip=true;
						if ((brn0[1]==">=")&&(reg[i]>=j)) fskip=true;
						if ((brn0[1]=="!=")&&(reg[i]!=j)) fskip=true;
						if (fskip)	{
							fskip=false;
							Line=anch[k];
							if (cfg_skip==1) skipend();
							continue;
							}
						continue;
						}
				}
			}
		else	{
			if (s.charAt(0)=='?')	// レジスタが一定値とチェックしてメッセージ変化
				{
				fskip=true;
				wstr=s.substring(1,wlen);
				brn0=wstr.split(" ");
				i=parseInt(brn0[0],10);
				j=parseInt(brn0[2],10);
				if ((brn0[1]=="=")&&(reg[i]!=j)) continue;
				if ((brn0[1]==">")&&(reg[i]<=j)) continue;
				if ((brn0[1]=="<")&&(reg[i]>=j)) continue;
				if ((brn0[1]=="<=")&&(reg[i]>j)) continue;
				if ((brn0[1]==">=")&&(reg[i]<j)) continue;
				if ((brn0[1]=="!=")&&(reg[i]==j)) continue;
				s=brn0[3];
				}
			face(0);
			textout(s);
			if ((fskip)&&(skip)) {if (cfg_skip==1) {skipend();fskip=false;}}
			if (skip) continue;
			if (nowgame!="event") nowgame="event";
			break;
			}
		}
	}finally{_decoding=false;}
	}
function detect(dt_str)
	{
	var i,c,ps,len,res1;
	var nums="0123456789";
	var str2="";
	var fl1="";
	var fl2=true;
	var result=true;
	var fl4;

	len=dt_str.length;
	if (len==0)	return(true);
	for(i=0;i<len;i++)
		{
		c=dt_str.charAt(i);
		if (c==' ') continue;
		if (c=='!') {fl2=false;continue;}
		ps=nums.indexOf(c,0);
		if (ps != -1)
			{
			fl1=fl1+c;
			if (i!=len-1) continue;
			}
		if (fl1.length > 0)
			{
			fl3=parseInt(fl1,10);		
			if ((fl3<0)||(fl3>95))
				{ alert('Detection Error(Illegal Flag)');
				  result=false;break;
				}
			fl4=flg[fl3];
			if (fl2==false)  fl4=(fl4 ^ 1);
			str2=str2+ fl4;
			fl1="";
			fl2=true;
			if (c=='*') {str2=str2+"&";}
			if (c=='+') {str2=str2+"|";}
			if (i != len-1) continue;
			}
		}
	if (result==true)
		{
		res1=eval(str2);
		if (res1==1) result=true;
		if (res1==0) result=false;
		return(result);
		}
	else return(false);
	}
// -------------- 文字列生成 ------------------------------------
function makestring(str)
	{
	var result;
	var m_normal="<span style='color:#000000;font-size:16px;'>";
	var m_big="<span style='color:#000000;font-size:24px;'>";
	var m_red="<span style='font-size:24px;color:#ff2600;'>";
	var m_small="<span style='color:#000000;font-size:12px;'>";
	var m_huge="<span style='font-size:36px;color:#ff2600;'>";

	var k_normal="<span style='color:#444444;font-size:16px;'>";
	var k_big="<span style='color:#444444;font-size:24px;'>";
	var k_red="<span style='font-size:24px;color:#ff5522;'>";
	var k_small="<span style='color:#444444;font-size:12px;'>";
	var k_huge="<span style='font-size:36px;color:#ff5522;'>";

	var h_normal="<span style='color:#ffffff;font-size:16px;'>";
	var h_big="<span style='color:#ffffff;font-size:24px;'>";
	var h_red="<span style='font-size:24px;color:#ff6000;'>";
	var h_small="<span style='color:#ffffff;font-size:12px;'>";
	var h_huge="<span style='font-size:36px;color:#ff6000;'>";

	var l=str.length;
	var i,a,m;
	if (kidoku)	{w_normal=k_normal;w_big=k_big;w_red=k_red;w_small=k_small;w_huge=k_huge;}
	else{w_normal=m_normal;w_big=m_big;w_red=m_red;w_small=m_small;w_huge=m_huge;}
	wordslength=0;
	result=w_normal;histtext+=h_normal;
	for(i=0;i<l;i++)
		{
		a=str.charAt(i);
		if (a=="*")	{result+="<br>";histtext+="<br>";continue;}
		if (a=="<")	{result+="</span>"+w_big;histtext+="</span>"+h_big;continue;}
		if (a=="(")	{result+="</span>"+w_huge;histtext+="</span>"+h_huge;continue;}
		if (a=="/")	{result+="</span>"+w_normal;histtext+="</span>"+h_normal;continue;}
		if (a==">")	{result+="</span>"+w_small;histtext+="</span>"+h_small;continue;}
		if (a=="!")	{result+="</span>"+w_red;histtext+="</span>"+h_red;continue;}
		result+=a;
		histtext+=a;
		wordslength++;
		}
	result+="</span>";
	histtext+="</span><br>";
	result+="<img src='click.gif'>";
	return result;
	}
function shake(mode)
	{
	shocks=0;
	Shakemode=mode;
	setTimeout(shakeit,20);
	}
function shakeit()
	{
	var x,y;
	if (shocks<=20)
		{
		if (Shakemode==false)	{x=bibx[shocks];y=biby[shocks];}
			else		{x=bibx2[shocks];y=biby2[shocks];}
		if ((x!=0)||(y!=0))
			{
			MoveLayer("RAY1",x,y);
			shocks++;
			setTimeout(shakeit,30);
			}
		else{
			MoveLayer("RAY1",0,0);
			}
		}
	}
// ----------- 選択肢テーブル生成 -------------------------------------------
function selmake(num)
	{
	var result="";
	var i,j,s,s2,wlen;
	var b1,b2;
	var brna=new Array(10);
	var s;
	result="<table width=390 height=64 border=0 cellpadding=0><tr>";
	result+="<td valign=top>";
	result+="<table border=1 width=400 cellspacing=1 cellpadding=1>";
	Brnum=0;Seltop=Line;
	for(i=1;i<=num;i++)
		{
		s=getstr();
		wlen=s.length;
		brna=s.split(" ");
		brn2[i]=brna[1];
		Brkey[Brnum]=i;Brnum++;
		result+="<tr><td class=selx onclick='selit("+i+")'>";
		result+=Brnum+"：";
		if ((cfg_select)&&(linests=="2")) result+="<font color='#880000'>";
		result+=brna[0]+"</font></td></tr>";
		}
	result+="</table>";
	result+="</td></tr></table>";
	skipend();
	branch=true;
	nowwin="select";
	selstr=result;
	WriteLayer("SUBMSG",result);
	HideLayer("RAY2B");
 	ShowLayer("SUBMSG");
	}
function selend()
	{
	branch=false;
	nowwin="";
	ShowLayer("RAY2B");
 	HideLayer("SUBMSG");
	decode();
	}
function selit(num)
	{
	var a;
	wread=readf.substr(0,Seltop-1+num)+"2"+readf.substr(Seltop+num,999);
	readf=wread;
	a=brn2[num];
	Line=anch[a];
	selend();
	}
// ====================================================================
function gamesave(num)
	{
	var str,str2,a,i,j,fw;
	str="";
	SVF[num]=reg[0]/7;
	for(i=0;i<=15;i++)
		{
		a=reg[i].toString(16);
		if (a.length==1) a="0"+a;
		str+=a;
		}
	for(j=0;j<=9;j++)
		{
		fw=0;
		for(i=0;i<=7;i++)
			{
			fw+=Math.pow(2,(7-i))*flg[j*8+i];
			}
		a=fw.toString(16);
		if (a.length==1) a="0"+a;
		str+=a;
		}
	csave(0,"ac"+num,str);
	cwrite(0);
	}
function gameload(num)
	{
	var str,a,i,j,fw,f1,f2;
	str=cload(0,"ac"+num);
	if (str==null) return false;
	closefile();
	for(i=0;i<=15;i++)
		{
		a=str.substr(i*2,2);
		reg[i]=parseInt(a,16);
		}
	for(j=0;j<=9;j++)
		{
		a=str.substr(32+j*2,2);
		fw=parseInt(a,16);
		for(i=0;i<=7;i++)
			{
			f1=Math.pow(2,(7-i));
			if ((fw&f1)!=0) f2=1;else f2=0;
			flg[8*j+i]=f2;
			}
		}
	}
// ====================================================================
function context()
	{
	if (nowwin=="none") return;
	if ((typeof _endingSequenceStage!=="undefined")&&(_endingSequenceStage===1||_endingSequenceStage===2))
		{
		_restartTitleAsStartup();
		return;
		}
	if (nowwin=="HELP") {PF7off();return;}
	if (nowwin=="omake1"){klik();return;}
	if (nowwin=="REVIEW"){PF5off();return;}
	if (nowwin=="save"){PF2off();return;}
	if (nowwin=="load"){PF3off();return;}
	if (nowwin=="COUNT"){countoff();return;}
	if (nowwin=="CONFIG"){PF4off();return;}
	if (nowwin=="omake2"){omake2exit();return;}
	if (nowwin=="omake") {gotitle(true);return;}
	if (nowwin=="ending") {_restartTitleAsStartup();return;}
	if (nowwin=="cmd2") {keyin(48);return;}
	if (display=="MAX") {disp_normal();return;}
	if (cfg_right==0) PF5();
	if (cfg_right==1) PF1();
	if (cfg_right==2)
		{
		display="MAX";
		ResizeObj(683,480);
		MoveLayer("RAY1",-22,0);
		document.getElementById("RAY1").style.zIndex=10;
		WriteLayer("RAY1c","<img src='blank.gif' width=640 height=480>");
		RAY1c.style.zIndex=11;
		}
	}
function _handleEndingExitClick(e)
	{
	if (!e) return;
	if (!(e.button===0||e.button===2)) return;
	if (!((typeof _endingSequenceStage!=="undefined")&&(_endingSequenceStage===1||_endingSequenceStage===2))) return;
	e.preventDefault();
	e.stopPropagation();
	_restartTitleAsStartup();
	}
function double()
	{
	if (nowwin=="") {keyin(96);keyin(96);return;}
	klik();
	}
// ====================================================================
function keyin(a)
	{
	var a,bnum;
	bnum=-1;
	if ((a>=96)&&(a<=105)) bnum=a-96;
	if ((a>=48)&&(a<=57)) bnum=a-48;
	// ★ED1中(_ed1Active)はEnter(13)/↓(40)送りを全経路の手前で禁止し警告(3秒)。EnterはnowwinでklikかPF1に分岐するため、
	//   PF1だけに仕込むと漏れる→keyin冒頭で一括ブロック。Ctrl(17=nowskip)skipは別経路なので通す。
	if ((a==13||a==40) && window._ed1Active) { if (typeof _showEd1Warning==="function") _showEd1Warning(); return; }
	if (a==16) KEY_shift=false;
	if (a==17)
		{
		KEY_ctrl=false;
		if (nowskip) {nowskip=false;clearTimeout(AutoH);if (cfg_auto!=0) setautoclick();if (typeof _refreezeCurrentCharFrame==="function") _refreezeCurrentCharFrame();}
		}
	if (nowwin=="none")
		{
		// 一日終了/セーブ前後の遷移アニメ(Movie>0)をEnter/→/0キーでスキップ（klikへ委譲）
		if ((bnum==0)||(a==13)||(a==39)) klik();
		return;
		}
	if (nowwin=="")
		{
		if (a==37) a=107;			//←
		if (a==38) a=107;			//↑
		if (a==39) {a=48;bnum=0;}	//→
		if (a==40) {a=13;}			//↓
		if (a==109) {PF7(0);return;}
		if (bnum==7) {PF4();return;}
		if (bnum==8) {PF3();return;}
		if (bnum==9) {PF6();return;}
		if (a==107) {PF5();return;}
		if (bnum==0) {klik();return;}
		if (a==13) {PF1();return;}
		return;
		}
	if (nowwin=="RESULT")
		{
		if (a==39) {a=48;bnum=0;}	//→
		if (a==40) {a=48;bnum=0;}	//↓
		if (a==109) {PF7(6);return;}
		if (bnum==7) {PF4();return;}
		if (bnum==8) {PF3();return;}
		if (bnum==9) {PF6();return;}
		if ((bnum==0)||(a==13)) {klik();return;}
		return;
		}
	if (nowwin=="REVIEW")
		{
		if (a==38)
			{
			document.getElementById("HISTWIN").scrollTop-=30;
			return;
			}
		if (a==40)
			{
			document.getElementById("HISTWIN").scrollTop+=30;
			return;
			}
		if (a==39) {a=48;bnum=0;}	//→
		if (a==109) {PF7(1);return;}
		if ((bnum==0)||(a==107)) PF5off();
		return;
		}
	if ((nowwin=="COUNT"))
		{
		if (a==38)
			{
			document.getElementById("HISTWIN").scrollTop-=30;
			return;
			}
		if (a==40)
			{
			document.getElementById("HISTWIN").scrollTop+=30;
			return;
			}
		if (a==39) {a=48;bnum=0;}	//→
		if (bnum==0) countoff();
		return;
		}
	if (nowwin=="CONFIG")
		{
		if (a==109) {PF7(2);return;}
		if ((bnum==0)||(a==13)) PF4off();
		if (bnum==1)
			{
			if (cfg_bgm=="auto") PF4set(0,3);	// 自動→無し
				else PF4set(0,0);		// 無し→自動 (WMA/MIDI廃止で2状態トグル)
			PF4dsp();
			}
		if (bnum==2)
			{
			if (cfg_se) PF4set(1,1);else PF4set(1,0);
			PF4dsp();
			}
		if (bnum==3)
			{
			if (cfg_skip==0) PF4set(2,1);
			else {if (cfg_skip==1) PF4set(2,2);else PF4set(2,0);}
			PF4dsp();
			}
		if (bnum==4)
			{
			if (cfg_select) PF4set(3,1);else PF4set(3,0);
			PF4dsp();
			}
		if (bnum==5)
			{
			if (cfg_anime) PF4set(4,1);else PF4set(4,0);
			PF4dsp();
			}
		if (bnum==6)
			{
			if (cfg_right==0) PF4set(5,1);
			else {if (cfg_right==1) PF4set(5,2);else PF4set(5,0);}
			PF4dsp();
			}
		if (bnum==7)
			{
			if (cfg_auto==0) PF4set(6,1);
			else {if (cfg_auto==1) PF4set(6,2);else PF4set(6,0);}
			PF4dsp();
			}
		if (bnum==8)
			{
			if (cfg_shake) PF4set(7,1);else PF4set(7,0);
			PF4dsp();
			}
		if (bnum==9)
			{
			if (ACSYS.charAt(8)=="1") PF4set(8,0); else PF4set(8,1);	// 動作モード トグル
			PF4dsp();
			}
		return;
		}
	if (nowwin=="HELP")
		{
		if (a==37) a=107;			//←
		if (a==38) a=107;			//↑
		if (a==39) {a=48;bnum=0;}	//→
		if (a==40) {a=13;}			//↓
		if ((bnum==0)||(a==109)||(a==13)) {PF7off();return;}
		return;
		}
	if (nowwin=="title")
		{
		if (a==109) {PF7(3);return;}
		if (bnum==1) {newgame();return;}
		if (bnum==2) {loadgame();return;}
		if (bnum==3) {PF4();return;}
		if ((bnum==4)&&(ACF[28]==1)) {omake();return;}
		return;
		}
	if (nowwin=="omake")
		{
		if (a==109) {PF7(4);return;}
		if (bnum==1) {omake1();return;}
		if ((bnum==2)&&(ACF[29]==1)) {omake2();return;}
		if ((bnum==3)&&(ACF[30]==1)) {omake3();return;}
		if (bnum==0) {gotitle(true);return;}
		return;
		}
	if (nowwin=="omake1")
		{
		if (a==109) {PF7(11);return;}
		if (bnum==0) {omake1end();return;}
		return;
		}
	if (nowwin=="omake2")
		{
		if (a==37) bnum=4;			//←
		if (a==38) a=107;			//↑
		if (a==39) bnum=6;			//→
		if (a==40) bnum=0;			//↓
		if (a==109) {PF7(12);return;}
		if (bnum==0) {omake2play();return;}
		if (bnum==4) {omake2prev();return;}
		if (bnum==6) {omake2next();return;}
		if (a==107) {omake2stop();return;}
		if (bnum==9) {omake2exit();return;}
		return;
		}
	if (nowwin=="select")
		{
		if (a==109) {PF7(5);return;}
		if (bnum==7) {PF4();return;}
		if (bnum==8) {PF3();return;}
		if (bnum==9) {PF6();return;}
		if ((bnum>0)&&(bnum<=Brnum)) selit(bnum);
		return;
		}
	if (nowwin=="cmd1")
		{
		if (a==109) {PF7(7);return;}
		if (bnum==7) {PF4();return;}
		if (bnum==8) {PF3();return;}
		if (bnum==9) {PF6();return;}
		if ((bnum>0)&&(bnum<5)) Q.selit(bnum-1);
		return;
		}	
	if (nowwin=="cmd2")
		{
		if (a==109) {PF7(8);return;}
		if (bnum==7) {PF4();return;}
		if (bnum==8) {PF3();return;}
		if (bnum==9) {PF6();return;}
		if ((bnum>0)&&(bnum<5)) Q.selit(bnum+3);
		if ((bnum==0)&&(Q.cmdstp==1)) {Q.cmdstp=2;Q.menu02();}
		return;
		}	
	if (nowwin=="save")
		{
		if ((bnum>0)&&(bnum<9)) {PF2go(bnum);return;}
		if (bnum==0) {PF2off();return;}
		if (a==109) {PF7(9);return;}
		}
	if (nowwin=="load")
		{
		if ((bnum>0)&&(bnum<10)) {PF3go(bnum);return;}
		if (bnum==0) {PF3off();return;}
		if (a==109) {PF7(10);return;}
		}
	if (nowwin=="ending"){if (bnum==9) checkcomplete();}
	if (nowwin=="comp"){if (bnum==0) exitprocess();}
	}
// ====================================================================
function keydown(num)
	{
	var a;
	a=num;firstpress=KEY_ctrl;
	if (num==16) KEY_shift=true;else KEY_shift=false;
	if (num==17) KEY_ctrl=true;else KEY_ctrl=false;
	if ((KEY_ctrl)&&(nowwin=="")&&(!nowskip))
		{
		nowskip=true;setautoclick();
		}
	}
function wheel(e)
	{
	var a,b;
	if (!e) e=window.event;
	a=e.deltaY;
	// ★ホイール送り修正: 旧版は wheelDelta(±120固定)で判定していたが、Chromeの deltaY は
	//   ±120にならない(OS/設定依存で±100等・トラックパッドは小数)→ if が全falseで無反応だった。
	//   deltaY は符号のみ意味がある(正=下/手前に回す、負=上/奥に回す)ので符号で判定する。
	//   割当は原版(wheelDelta基準: 奥=+120/手前=-120)を保つ。deltaYは符号逆なので a<0=奥, a>0=手前。
	b=nowwin;
	if (b=="omake2")
		{
		if (a<0) {keyin(100);return;}	// 奥(up)
		if (a>0) {keyin(102);return;}	// 手前(down)
		}
	if ((b=="")||(b=="RESULT"))
		{
		if (a<0) {keyin(107);return;}	// 奥→読み返し(PF5/REWIND)
		if (a>0) {keyin(96);return;}	// 手前→読み進め(klik)
		}
	if ((b=="REVIEW")||(b=="COUNT"))
		{
		if (a<0) {keyin(38);return;}	// 奥→履歴を上スクロール
		if (a>0) {keyin(40);return;}	// 手前→履歴を下スクロール
		}
	}
function G_keydown(e)
	{
	var a,r;
	if (!e) e=window.event;
	a=e.keyCode;
	if((a==116)||(a==114)||(a==122))
		{
		e.preventDefault();
		return;
		}
	// ★裏モード: タイトル画面で U(85) を押すと全ED・全おまけ開放
	if (a==85 && typeof nowwin!=="undefined" && nowwin=="title") {e.preventDefault();_unlockAllEd();if (typeof _showDebugMenu==="function") _showDebugMenu();return;}	// ★U=裏モード開放+デバッグメニュー(統合)
	if ((a==27)||(a==32)||((a>=65)&&(a<=90))) e.preventDefault();
	keydown(a);
	}
function G_keyup(e)
	{
	var a,r;
	if (!e) e=window.event;
	a=e.keyCode;
	if((a==116)||(a==114)||(a==122))
		{
		e.preventDefault();
		return;
		}
	if ((a==27)||(a==32)||((a>=65)&&(a<=90))) e.preventDefault();
	keyin(a);
	}
// ====================================================================
function omake()
	{
	var str="";
	_clearTitleIntro();
	_titleIntroShown=false;
	_titleIntroActive=false;
	_titleIntroStartedAt=0;

	// ★t21: 全おまけ解除で項目が4つ(1エンディング一覧/2音楽鑑賞/3特別付録/0タイトルに戻る)になると
	//        最下項目がメッセージ窓(white.gif半透明×bg.jpg=高さ約100px)の下端を超え、水色背景が足りなくなる。
	//        タイトルメニュー(gotitle)と同じ行間(cellpadding0+line-height18)に詰めて4項目でも窓内に収める。
	//        ※omakeは上部にchar402オーバーレイ(z20)が居るのでmargin-topでの上方シフトは不可(被って隠れる)。
	str="<table border=0 cellpadding=0 cellspacing=0 style='line-height:18px'>";
	str+="<tr><td class=selx style='padding:0 0 1px 0;line-height:18px' onclick='omake1()'>１：エンディング一覧</td></tr>";
	if (ACF[29]==1)	str+="<tr><td class=selx style='padding:0 0 1px 0;line-height:18px' onclick='omake2()'>２：音楽鑑賞</td></tr>";
	if (ACF[30]==1)	str+="<tr><td class=selx style='padding:0 0 1px 0;line-height:18px' onclick='omake3()'>３：特別付録</td></tr>";
	str+="<tr><td class=selx style='padding:0 0 1px 0;line-height:18px' onclick='gotitle(true)'>０：タイトルに戻る</td></tr>";
	str+="</table>";
	nowwin="omake";
	if (typeof _cancelPlaybackDetection==="function") _cancelPlaybackDetection();
	if (typeof _unfreezePlayer==="function") _unfreezePlayer();
	if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
	try{if (typeof FLASH_PLAYER!=="undefined" && FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}
	if (typeof _currentSWFFile!=="undefined") _currentSWFFile=null;
	if (typeof showBackgroundFile==="function") showBackgroundFile("char402.jpg");
	bgmon(17);
	WriteLayer("TEXT",str);
	_showOmakeOverlay();
	focus();
	}
// ====================================================================
function omake1()
	{
	var str,msg;
	_ignoreKlikUntil=Date.now()+250;
	_hideOmakeOverlay();
	str="すでに見たエンディング一覧です。<br>タイトルをクリックすると再生できます。<br>メッセージ域をクリックまたは０キーでメニューに戻ります。";
	nowwin="omake1";
	WriteLayer("TEXT",str);
	msg="<table border=0 cellspacing=0 cellpadding=3>";
	msg+="<tr><td><img src='blank.gif' width=400 height=1></td></tr>";
	ShowLayer("HISTWIN");
	ShowLayer("RAY1b");
	document.getElementById("HISTWIN").focus();
	nowwin="omake1";
	for(i=0;i<=21;i++)
		{
		if (ACF[i]==1)
			{
			msg+="<tr><td class=selx onclick='omake1go("+i+")'><font color=white>["+i+"]："+endt[i]+"</font></td></tr>";
			}
		}
	msg+="</table>";
	WriteLayer("HISTWIN",msg);
	}
async function omake1go(num)
	{
	HideLayer("HISTWIN");
	HideLayer("RAY1b");
	for(i=0;i<=79;i++) flg[i]=0;
	reg[0]=49;
	reg[14]=num;
	window._ed1Active=(num===1);	// ★ED1(omake)突入を起点に、ED roll(#c)に入るまでEnter skip禁止(keyin冒頭がEnter/↓押下時に3秒警告)。他EDは規制なし
	if (typeof _resetSceneForOmakeReplay==="function") _resetSceneForOmakeReplay();	// ★z36: ED再生前にfreeze/char状態クリア(2回目以降の残留防止)
	await readfile(90);
	}
function omake1end()
	{
	HideLayer("RAY1b");
	HideLayer("HISTWIN");
	omake();
	}
function omake2()
	{
	var str,msg;
	_hideOmakeOverlay();
	str="音楽鑑賞モードです。<br>４・６キーで曲の切り替え、０キーで再生、＋キーで停止、９キーでメニューに戻ります。";
	nowwin="omake2";
	WriteLayer("TEXT",str);
	ShowLayer("MUSICCTRL");
	bgmoff();
	// ★z107: 音楽鑑賞(omake2)突入時の「OP突き抜け／char白く」対策。直前のタイトルOP(F5012)等のcanvas残像が、
	//   setposs(5932)→_loadGameSWFの_ensureFlashPlayerVisible(visible復帰)時に_clearFlashCanvasより前に一瞬見える
	//   (=OP突き抜け)、かつF5932描画前の白が出る(=char白く)。omake1go(ED再生, [sys.js]_resetSceneForOmakeReplay)と
	//   同様にfreeze/char/SWFをリセットし、canvasを先にクリアしてからF5932をロードする。visible復帰時は透明→背景char402が
	//   見え、続く_freezePlayer(透明canvas→_freezeBackgroundOnly=char402)が描画途中を覆って白も防ぐ。
	if (typeof _resetSceneForOmakeReplay==="function") _resetSceneForOmakeReplay();
	if (typeof _clearFlashCanvas==="function") _clearFlashCanvas();
	setposs(5932);
	_omake2Init();
	focus();
	}
// omake2play/prev/next/stop → ruffle_core.js に移動済み
function omake2exit()
	{
	HideLayer("MUSICCTRL");
	HideLayer("SUBMSG");
	if (typeof _hideOmake2Display==="function") _hideOmake2Display();	// ★z45: 中央の♪曲名オーバーレイを消す
	bgmoff();
	omake();
	}
async function omake3(){await readfile(80);}	// ★t22: 特別付録。F5930(#v5930)の「おまけモード」化けは setposs(5930)側で_omakeOverlay表示して覆う
function checkcomplete()
	{
	if (ACREAD>=ACMAX)
		{
		bgmon(17);
		setposs(4499);
		nowwin="comp";
		}
	else exitprocess();
	}
// ----------------------------------------------
async function checker()
	{
	if (bkwin!="title") {alert("既読チェックはタイトル画面で行なってください。");return;}
	var s="<table width=460 height=64 border=0 cellpadding=0><tr>";
	s+="<td valign=top style='text-shadow:0 0 2px #ffffff;line-height:23px;'>";
	s+="<span class=text>既読数をカウント中です………しばらくお待ち下さい。";
	s+="</span></td></tr></table>";
	WriteLayer("SUBMSG",s);
	ShowLayer("SUBMSG");
	var str="<table border=1 cellpadding=2 cellspacing=0><tr>";
	str+="<td class=kidc>内容</td><td class=kidc>文字数</td><td class=kidc>全行数</td>";
	str+="<td class=kidc>既読行数</td><td class=kidc>達成率</td></tr>";
	var i=0;
	var maxcnt1=0,maxcnt2=0,maxcntc=0;
	while(1==1)
		{
		if (kidfile[i]==-1) break;
		var chrcnt=0,linecnt=0,kidcnt=0;
		var af2=cload(0,"read"+kidfile[i]);
		var creadf2;
		if ((af2==null)||(af2==""))
			{
			creadf2="";
			for(var ii=0;ii<=999;ii++) creadf2+="0";
			}
		else creadf2=decodemap(af2);
		try{
			var resp=await fetch("../sys/"+kidfile[i]+".dat");
			if (resp.ok){
				var buf=await resp.arrayBuffer();
				var decoder=new TextDecoder("shift_jis");
				var ftxt=decoder.decode(buf);
				var flines=ftxt.split(/\r?\n/);
				var l=0,nocount=0;
				for(var li=0;li<flines.length;li++)
					{
					var sl=flines[li];
					if (sl.length<1) break;
					if (sl=="**") break;
					if (nocount>0)
						{
						var c1x=creadf2.charAt(l);
						l++;
						if (c1x!="0") kidcnt++;
						nocount--;
						continue;
						}
					var a2=sl.charAt(0),b2=sl.charAt(1),c2=sl.charAt(2);
					if ((a2=="#")&&(b2!="t")&&(b2!="s")) {l++;continue;}
					if ((a2=="#")&&(b2=="s")) {nocount=parseInt(c2,10);l++;linecnt+=nocount;continue;}
					var c1x=creadf2.charAt(l);
					l++;
					linecnt++;
					var chrsu;
					if (b2=="t") {var tn=sl.split(" ");chrsu=tn[2].length;}
					else chrsu=sl.length;
					chrcnt+=chrsu;
					if (c1x!="0") kidcnt++;
					}
				}
			}catch(ex){}
		var perc;
		if ((kidcnt==0)||(linecnt==0)) perc="0%";
		else perc=Math.floor((kidcnt/linecnt)*10000)/100+"%";
		var comp=((kidcnt==linecnt)&&(kidcnt!=0));
		str+="<tr>";
		str+="<td class=kidh>"+kidcomment[i]+"("+kidfile[i]+")</td>";
		str+="<td class=kid>"+chrcnt+"</td>";
		str+="<td class=kid>"+linecnt+"</td>";
		str+="<td class=kid>"+kidcnt+"</td>";
		if (comp) str+="<td class=kidcomp>"+perc+"</td>";
		else str+="<td class=kid>"+perc+"</td>";
		str+="</tr>";
		i++;
		maxcnt1+=linecnt;maxcnt2+=kidcnt;maxcntc+=chrcnt;
		}
	if ((maxcnt1==0)||(maxcnt2==0)) perc="0%";
	else perc=Math.floor((maxcnt2/maxcnt1)*10000)/100+"%";
	str+="<tr><td class=kidh>合　計</td>";
	str+="<td class=kid>"+maxcntc+"</td>";
	str+="<td class=kid>"+maxcnt1+"</td>";
	str+="<td class=kid>"+maxcnt2+"</td>";
	str+="<td class=kid>"+perc+"</td></tr>";
	str+="</table><br>";
	str+="<span class=selx onclick='countoff()'><font color=white>環境設定に戻る</font></span>";
	WriteLayer("HISTWIN",str);
	document.getElementById("HISTWIN").scrollTop=0;
	sysoff();
	facehide();
	HideLayer("CONFIGWIN");
	ShowLayer("HISTWIN");
	HideLayer("RAY2B");
	s="<table border=0><tr><td nowrap style='text-shadow:0 0 2px #ffffff'><span class=text>";
	s+="既読数の一覧を表示しています。<br>右クリック、０キーのいずれかで環境設定画面に戻ります。";
	s+="</span></td></tr></table>";
	WriteLayer("SUBMSG",s);
	nowwin="COUNT";
	}
function countoff()
	{
	HideLayer("HISTWIN");
	nowwin=bkwin;
	PF4();
	}
// ============================================================
// Step 7追加: disp_normal, HISTfocus, addEventListener
// ============================================================
function disp_normal()
	{
	display="";
	ResizeObj(512,360);
	MoveLayer("RAY1",0,0);
	document.getElementById("RAY1").style.zIndex=0;
	WriteLayer("RAY1c","<img src='blank.gif' width=512 height=360>");
	document.getElementById("RAY1c").style.zIndex=2;
	}
function HISTfocus()
	{
	var h=document.getElementById("HISTWIN");
	if (h) {h.scrollTop=h.scrollHeight;h.focus();}
	}
// --- イベントリスナー登録 ---
document.addEventListener("keydown",G_keydown);
document.addEventListener("keyup",G_keyup);
document.addEventListener("contextmenu",function(e){e.preventDefault();context();});
document.addEventListener("mouseup",_handleEndingExitClick,true);
document.addEventListener("pointerup",_handleEndingExitClick,true);
document.addEventListener("wheel",wheel);
document.addEventListener("selectstart",function(e){e.preventDefault();});
