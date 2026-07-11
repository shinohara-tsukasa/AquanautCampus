function _hideMainJpeg()
	{
	var img=document.getElementById("MAINW_JPEG");
	if (img) img.style.display="none";
	}

function showSaveStaticBackground(done)
	{
	// 譌ｧ繧ｪ繝ｼ繝舌・繝ｬ繧､髯､蜴ｻ・医Ξ繧ｬ繧ｷ繝ｼ莠呈鋤・・
	var mainDiv=document.getElementById("MAINW");
	var token=++_pendingStaticBgToken;
	var wasPrecovered=_saveTransitionPrecoverActive;
	_clearSaveTransitionPrecover();
	if (!wasPrecovered) _holdCurrentSceneCover();
	if (FLASH_PLAYER)
		{
		try{FLASH_PLAYER.pause();}catch(e){}
		FLASH_PLAYER.style.display="none";
		FLASH_PLAYER.style.visibility="hidden";
		FLASH_PLAYER.style.opacity="0";
		}
	_waitForBgFile("char123.jpg",function(){
		if (token!==_pendingStaticBgToken) return;
		_clearDayTransitionOverlay();
		if (_gameOverlayTimer) {clearTimeout(_gameOverlayTimer);_gameOverlayTimer=null;}
	if (_gameOverlay&&_gameOverlay.parentNode) _gameOverlay.parentNode.removeChild(_gameOverlay);
	_gameOverlay=null;
	if (_unfreezeTimer) {clearTimeout(_unfreezeTimer);_unfreezeTimer=null;}
	_cancelPlaybackDetection();
		_completionFired=true;
		_updateBgLayer(74);
		_hideMainJpeg();
		_currentSWFFile=null;
		nowgrp=74;
		drawsts=true;
		if (mainDiv) mainDiv.style.background="transparent";
		requestAnimationFrame(function(){
			requestAnimationFrame(function(){
				if (token!==_pendingStaticBgToken) return;
				_unfreezePlayer();
				_hideEdOverlay();
				_clearSceneHoldOverlay();
				_dbg("save bg: static char123");
				if (done) done();
				});
			});
		});
	}

// ============================================================
// ruffle_core.js — Step 6: Ruffle統合
// setposs/face/boot/再生完了検知
// 依存: _frame_to_file.js (FRAME_TO_SWF, ED_FRAME_MAP)
//       music.js (InitMusic)
//       files.js (LF_FlashReg初期化済み)
//       karnel.js (ShowLayer/HideLayer/WriteLayer等)
// ============================================================

// ============================================================
// WebGL preserveDrawingBuffer 強制有効化
// Ruffleのcanvasキャプチャ（freeze表示）に必要
// ============================================================
(function(){
var _origGetContext=HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext=function(type,attrs){
	if (type==="webgl"||type==="webgl2"){
		attrs=attrs||{};
		attrs.preserveDrawingBuffer=true;
		}
	return _origGetContext.call(this,type,attrs);
	};
})();

// ============================================================
// フリーズ表示: playback complete後にcanvasキャプチャで静止画化
// Ruffleのloop問題（endType:'none'のSWFがループ→明滅）対策
// ============================================================
var _freezeOverlay=null;
var _freezeSourceFile=null;
var _titleHelpFreezeOverlay=null;

function _getFlashCanvas()
	{
	if (!FLASH_PLAYER) return null;
	var canvas=null;
	try{
		if (FLASH_PLAYER.shadowRoot) canvas=FLASH_PLAYER.shadowRoot.querySelector("canvas");
		if (!canvas) canvas=FLASH_PLAYER.querySelector("canvas");
		}
	catch(e){}
	return canvas;
	}

function _clearFlashCanvas()
	{
	var canvas=_getFlashCanvas();
	var ctx2d=null,gl=null;
	if (!canvas) return false;
	try{
		ctx2d=canvas.getContext("2d");
		if (ctx2d)
			{
			ctx2d.clearRect(0,0,canvas.width||512,canvas.height||360);
			_dbg("flash canvas cleared: 2d");
			return true;
			}
		}
	catch(e){}
	try{
		gl=canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		if (gl)
			{
			gl.clearColor(0,0,0,0);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT|gl.STENCIL_BUFFER_BIT);
			_dbg("flash canvas cleared: webgl");
			return true;
			}
		}
	catch(e){}
	return false;
	}

function _freezePlayer(sourceFile)
	{
	if (!FLASH_PLAYER) return;
	var canvas=_getFlashCanvas();
	var bgImg=document.getElementById("BG_LAYER");
	var jpgImg=document.getElementById("MAINW_JPEG");
	if (!canvas && !bgImg && !jpgImg){_dbg("freeze: no drawable source found");return;}
	// ★z56: canvasが未描画(width/height<=1)のまま焼くと「1x1の白freeze」になり、引き伸ばされて
	//   前画面を白く覆う(F57=bg only直後はFlash canvasが1x1にリセットされ、F660ロード時のz51 _freezePlayerが拾っていた)。
	//   立ち絵canvasが無いだけで背景BG_LAYERは生きているので、背景のみのfreezeにフォールバックする。
	if (canvas && (canvas.width<=1 || canvas.height<=1))
		{
		_dbg("freeze: canvas not rendered (1x1) → bg-only fallback");
		_freezeBackgroundOnly(sourceFile);
		return;
		}
	var w=(canvas&&canvas.width)?canvas.width:512,h=(canvas&&canvas.height)?canvas.height:360;
	if (w===0||h===0) {w=512;h=360;}
	var ov=document.createElement("canvas");
	ov.width=w;ov.height=h;
	ov.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;";
	try{
		var ctx=ov.getContext("2d");
		// ★ BG_LAYER(背景JPEG)はfreezeに焼き込まない。背景はsetposs→_updateBgLayerで同期更新され、
		//    生きたBG_LAYER(z0)がこのfreeze overlay(z2)の下に常に正しく見える。
		//    焼き込むとCtrlスキップ時に古い背景が被さって1場面遅れ/固定する([[bg-jpeg-skip-lag-bug]] A案)。
		//    (旧: if (bgImg && bgImg.style.display!=="none" && bgImg.complete) ctx.drawImage(bgImg,0,0,w,h);)
		// ★z29: tint焼き込みも除去。背景を焼かない(z6)のにtintだけ焼くと、生BG_TINT_LAYER(z0)と
		//    二重掛けになる（夕方=_sunsetBgHoldActive時、z22の背景維持で生tintが見えるようになり顕在化）。
		//    tintは生BG_TINT_LAYER(z0)に一任。立ち絵canvasは元々tintの上=tint非適用なので見た目不変、
		//    背景領域のtintが2枚→1枚に正常化。bg-only(_freezeBackgroundOnly)は背景を焼き下を覆うのでtint焼き込みは残す。
		//    (旧: _drawBgTintOverlay(ctx,w,h);)
		if (jpgImg && jpgImg.style.display!=="none" && jpgImg.complete) ctx.drawImage(jpgImg,0,0,w,h);
		if (canvas) ctx.drawImage(canvas,0,0,w,h);
		}
	catch(e){_dbg("freeze: drawImage failed: "+e.message);return;}
	// ★ 新overlayを先に配置してから旧を除去（空白フレーム防止）
	FLASH_PLAYER.parentNode.insertBefore(ov,FLASH_PLAYER.nextSibling);
	var old=_freezeOverlay;
	_freezeOverlay=ov;
	_freezeSourceFile=sourceFile||_currentSWFFile||null;
	if (old&&old.parentNode) old.parentNode.removeChild(old);
	_dbg("freeze: overlay created "+w+"x"+h+" src="+_freezeSourceFile);
	}

function _freezeBackgroundOnly(sourceFile)
	{
	var bgImg=document.getElementById("BG_LAYER");
	var jpgImg=document.getElementById("MAINW_JPEG");
	var ov,ctx,old;
	if (!bgImg && !jpgImg){_dbg("freeze bg-only: no drawable source found");return;}
	ov=document.createElement("canvas");
	ov.width=512;
	ov.height=360;
	ov.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;";
	try{
		ctx=ov.getContext("2d");
		// ★z59: 背景char072(BG_LAYER)とtintは焼き込まない。生BG_LAYER(z0)+生BG_TINT(z0)がfreeze(z2)の下に常に見える。
		//   焼き込むと、unfreeze時に「焼いた背景(z2, drawImage補間)→生背景(z0, img表示)」へ切り替わる瞬間、補間方式の
		//   違いで背景の見え方がカクッと変わり、固定のはずの立ち絵が振動して見える(篠原報告:char振動・枠不動・bgの見え方変化)。
		//   背景はBG_LAYER生に一任(z6/z29と同方針)。JPEG静止画(MAINW_JPEG)だけは焼く(下にBG_LAYERが無いケース用)。
		//   (旧: ctx.drawImage(bgImg,...); _drawBgTintOverlay(ctx,...);)
		if (jpgImg && jpgImg.style.display!=="none" && jpgImg.complete) ctx.drawImage(jpgImg,0,0,ov.width,ov.height);
		}
	catch(e){_dbg("freeze bg-only failed: "+e.message);return;}
	FLASH_PLAYER.parentNode.insertBefore(ov,FLASH_PLAYER.nextSibling);
	old=_freezeOverlay;
	_freezeOverlay=ov;
	_freezeSourceFile=sourceFile||_currentSWFFile||null;
	if (old&&old.parentNode) old.parentNode.removeChild(old);
	_dbg("freeze: bg-only overlay created src="+_freezeSourceFile);
	}

// ★ Ctrlスキップ終了時の「キャラfreezeが古いまま固定」対策(C案)。
// skip中は連続ロードでsettleが中断され、最終フレームがsameChar/same-fileだと再freezeされず
// 古いキャラが残る。skip終了後に「freezeが現SWFと不一致(=古い)」時だけ現フレームを強制再ロード。
var _skipEndRefreezeTimer=null;
function _refreezeCurrentCharFrame()
	{
	if (_skipEndRefreezeTimer) clearTimeout(_skipEndRefreezeTimer);
	_skipEndRefreezeTimer=setTimeout(function(){
		_skipEndRefreezeTimer=null;
		var num=(typeof nowgrp!=="undefined")?nowgrp:-1;
		if (num<0 || num>=200) return;					// 立ち絵フレーム(F0-199)のみ
		if (typeof skip!=="undefined" && skip) return;
		if (typeof nowskip!=="undefined" && nowskip) return;		// まだskip継続中なら何もしない
		if (!_currentSWFFile) return;
		if (_freezeSourceFile===_currentSWFFile) return;		// freezeが最新=不要(無駄リロード防止)
		_dbg("skip-end refreeze: stale freeze "+_freezeSourceFile+" != current "+_currentSWFFile+" at F"+num);
		_currentSWFFile=null; _currentCharId=null;			// same-file/sameCharスキップを回避し強制再ロード
		setposs(num);
		},120);
	}

var _manualFadeOverlay=null;
var _manualFadeTimer=null;
var _sceneHoldOverlay=null;
var _pendingStaticBgToken=0;
var _saveTransitionPrecoverTimer=null;
var _lateWhiteoutTimer=null;
var _saveTransitionPrecoverActive=false;
var _dayTransitionOverlay=null;
var _dayTransitionBody=null;
var _dayTransitionTimer=null;
var _dayTransitionStormStyleInjected=false;
var DAY_TRANSITION_DATE_FRAMES={
	7000:3,
	7050:4,
	7100:5,
	7150:6,
	7200:7,
	7250:8
	};
var DAY_TRANSITION_WEATHER_FRAMES={
	7350:true,
	7360:true,
	7400:true,
	7420:true
	};
var DAY_TRANSITION_DAY_META={
	3:{date:"8\u67083\u65e5(\u706b)",weather:"\u6674\u308c",bg:"char179.jpg"},
	4:{date:"8\u67084\u65e5(\u6c34)",weather:"\u66c7\u308a\u306e\u3061\u96e8",bg:"char107.jpg"},
	5:{date:"8\u67085\u65e5(\u6728)",weather:"\u6674\u308c\u6642\u3005\u66c7\u308a",bg:"char169.jpg"},
	6:{date:"8\u67086\u65e5(\u91d1)",weather:"\u6674\u308c",bg:"char179.jpg"},
	7:{date:"8\u67087\u65e5(\u571f)",weather:"\u66c7\u308a",bg:"char107.jpg"},
	8:{date:"8\u67088\u65e5(\u65e5)",weather:"\u5d50",bg:"char197.jpg"}
	};

function _ensureFlashPlayerVisible()
	{
	_clearSaveTransitionPrecover();
	_clearSceneHoldOverlay();
	if (!FLASH_PLAYER) return;
	var _wasHidden=(FLASH_PLAYER.style.visibility==="hidden"||FLASH_PLAYER.style.display==="none"||FLASH_PLAYER.style.opacity==="0");
	FLASH_PLAYER.style.display="";
	FLASH_PLAYER.style.visibility="visible";
	FLASH_PLAYER.style.opacity="1";
	// ★z87(一時デバッグ): ▶の真因=hidden→visible復帰のタイミング特定用。hidden状態から戻した時だけ呼び出し元を記録。
	if (_wasHidden)
		{
		var _st="";try{_st=(new Error().stack||"").split("\n").slice(1,4).join(" <- ");}catch(e){}
		_dbg("[PB] FLASH visible復帰(was hidden) nowgrp="+(typeof nowgrp!=="undefined"?nowgrp:"?")+" file="+_currentSWFFile+" from: "+_st);
		}
	}

function _ensureEndingTintOverlay()
	{
	var parent=document.getElementById("MAINW");
	if (!parent) return null;
	if (_endingTintOverlay&&_endingTintOverlay.parentNode) return _endingTintOverlay;
	_endingTintOverlay=document.createElement("div");
	_endingTintOverlay.id="ENDING_TINT_OVERLAY";
	_endingTintOverlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:4;background:rgba(0,0,0,0.28);pointer-events:none;visibility:hidden;opacity:0;";
	parent.appendChild(_endingTintOverlay);
	return _endingTintOverlay;
	}

function _showEndingTintOverlay()
	{
	var el=_ensureEndingTintOverlay();
	if (!el) return;
	el.style.transition="opacity 0.2s linear";
	el.style.visibility="visible";
	el.style.opacity="1";
	}

function _hideEndingTintOverlay()
	{
	if (!_endingTintOverlay) return;
	_endingTintOverlay.style.visibility="hidden";
	_endingTintOverlay.style.opacity="0";
	}

// ★ EDタイトルのtint色。原作game.swfのタイトルsprite depth1のカラー乗算(RGBmul/256)を解析した値。
//    mix-blend-mode:multiply で背景に乗算＝原作再現。ED00/ED15のみ紫青、他は無彩色暗転、256→255(=無tint)。
var _ED_TITLE_TINT={
	0:"rgb(77,77,205)",   1:"rgb(179,179,179)", 2:"rgb(128,128,128)", 3:"rgb(77,77,77)",
	4:"rgb(128,128,128)", 5:"rgb(128,128,128)", 6:"rgb(128,128,128)", 7:"rgb(179,179,179)",
	8:"rgb(255,255,255)", 9:"rgb(255,255,255)", 10:"rgb(255,255,255)",11:"rgb(255,255,255)",
	12:"rgb(255,255,255)",13:"rgb(179,179,179)",14:"rgb(128,128,128)",15:"rgb(77,77,205)",
	16:"rgb(128,128,128)",17:"rgb(128,128,128)",18:"rgb(255,255,255)",19:"rgb(172,172,172)",
	20:"rgb(128,128,128)",21:"rgb(128,128,128)"
	};

function _ensureEndingTitleBgOverlay()
	{
	var parent=document.getElementById("MAINW");
	if (!parent) return null;
	if (_endingTitleBgOverlay&&_endingTitleBgOverlay.parentNode) return _endingTitleBgOverlay;
	_endingTitleBgOverlay=document.createElement("div");
	_endingTitleBgOverlay.id="ENDING_TITLE_BG_OVERLAY";
	_endingTitleBgOverlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:3;pointer-events:none;visibility:hidden;opacity:0;background:#001018 no-repeat center center / cover;";
	parent.appendChild(_endingTitleBgOverlay);
	return _endingTitleBgOverlay;
	}

function _getEndingTitleBackgroundFile(edNumber)
	{
	var map={
		0:"char225.jpg",
		1:"char265.jpg",
		2:"char225.jpg",
		3:"char333.jpg",
		4:"char225.jpg",
		5:"char283.jpg",
		6:"char113.jpg",
		7:"char265.jpg",
		8:"char296.jpg",
		9:"char296.jpg",
		10:"char293.jpg",
		11:"char296.jpg",
		12:"char296.jpg",
		13:"char225.jpg",
		14:"char006.jpg",
		15:"char225.jpg",
		16:"char225.jpg",
		17:"char265.jpg",
		18:"char296.jpg",
		19:"char035.jpg",
		20:"char119.jpg",
		21:"char225.jpg"
		};
	if (map.hasOwnProperty(edNumber)) return map[edNumber];
	return "char439.jpg";
	}

function _showEndingTitleBgOverlay(file,fadeMs)
	{
	var el=_ensureEndingTitleBgOverlay();
	if (!el) return;
	el.style.transition="none";
	el.style.backgroundImage="url('../swf/extracted_jpeg/"+file+"')";
	el.style.visibility="visible";
	el.style.opacity="0";
	void el.offsetHeight;
	el.style.transition="opacity "+fadeMs+"ms linear";
	el.style.opacity="1";
	}

function _hideEndingTitleBgOverlay()
	{
	if (!_endingTitleBgOverlay) return;
	_endingTitleBgOverlay.style.transition="none";
	_endingTitleBgOverlay.style.visibility="hidden";
	_endingTitleBgOverlay.style.opacity="0";
	}

function _ensureEndingRollOverlay()
	{
	var parent=document.getElementById("MAINW");
	var bg;
	if (!parent) return null;
	if (_endingRollOverlay&&_endingRollOverlay.parentNode) return _endingRollOverlay;
	_endingRollOverlay=document.createElement("div");
	_endingRollOverlay.id="ENDING_ROLL_OVERLAY";
	_endingRollOverlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:6;visibility:hidden;overflow:hidden;pointer-events:none;background:#001018;";
	bg=document.createElement("div");
	bg.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;background:url('../swf/extracted_jpeg/char439.jpg') no-repeat center center / cover;filter:brightness(0.7) saturate(0.9);";
	_endingRollOverlay.appendChild(bg);
	_endingRollContent=document.createElement("div");
	_endingRollContent.id="ENDING_ROLL_CONTENT";
	// 原作EDは ＭＳ明朝・bold・center。サイズは行ごと(.edrLine style)に持たせる。色は海背景上で可読化のため白+影に置換。
	_endingRollContent.style.cssText="position:absolute;left:46px;top:100%;width:420px;color:#f4fbff;text-align:center;font-family:'ＭＳ 明朝','MS Mincho','Yu Mincho','Hiragino Mincho ProN',serif;font-weight:bold;line-height:1.18;text-shadow:0 0 8px rgba(0,0,0,0.72);";
	_endingRollOverlay.appendChild(_endingRollContent);
	if (!document.getElementById("EDR_STYLE"))
		{
		var _edrSt=document.createElement("style");
		_edrSt.id="EDR_STYLE";
		// ★index.htmlの全体CSS「div{position:absolute}」を打ち消す(これが無いと各行が絶対配置で1点に重なる)。
		// nowrap=行折れ防止(原作は各行1テキストフィールド)。影は最終カードに transition で個別付与。
		_edrSt.textContent="#ENDING_ROLL_CONTENT div{position:static;white-space:nowrap}";
		document.head.appendChild(_edrSt);
		}
	parent.appendChild(_endingRollOverlay);
	return _endingRollOverlay;
	}

var _endingCreditsHtml=null;
var _endingCreditsPromise=null;
function _getEndingCreditsHtml()
	{
	if (_endingCreditsHtml) return Promise.resolve(_endingCreditsHtml);
	if (_endingCreditsPromise) return _endingCreditsPromise;
	_endingCreditsPromise=_loadTextUtf8("ed_credits.html?cb="+Date.now()).then(function(t){	// ★検証中キャッシュバスター。配布前に "ed_credits.html" へ戻す
		_endingCreditsHtml=t; _endingCreditsPromise=null;
		_dbg("ed_credits loaded:",(t?t.length:0),"chars");
		return t;
		}).catch(function(e){
		_endingCreditsPromise=null; _dbg("ed_credits load failed:",e.message); return null;
		});
	return _endingCreditsPromise;
	}

var _endingClickReturn=null;
var _endingAutoReturnCleaners=[];
function _clearEndingAutoReturn()
	{
	var k;
	for(k=0;k<_endingAutoReturnCleaners.length;k++){try{_endingAutoReturnCleaners[k]();}catch(e){}}
	_endingAutoReturnCleaners=[];
	if (_endingClickReturn){try{document.removeEventListener("click",_endingClickReturn,true);}catch(e){} _endingClickReturn=null;}
	}
function _doEndingAutoReturn(why)
	{
	_clearEndingAutoReturn();
	if (_endingSequenceStage!==2) return;	// 既に終了/別状態なら戻り処理しない
	_dbg("ed auto-return ("+why+")");
	_finishEndingRollSequence();
	}
// ED曲(BGMチャンネルのAudio)が鳴り終わったら自動でタイトルへ。+ended来ない場合の保険タイマー。
function _armEndingAutoReturn(safetyMs)
	{
	var i;
	_clearEndingAutoReturn();
	if (typeof MUS_AudioChannels!=="undefined" && MUS_AudioChannels)
		for (i=0;i<2;i++)
			(function(au){
				if (!au) return;
				try{au.loop=false;}catch(e){}	// ED曲は1回再生で終わらせる(ループだとendedが来ない)
				var f=function(){_doEndingAutoReturn("audio ended");};
				au.addEventListener("ended",f);
				_endingAutoReturnCleaners.push(function(){au.removeEventListener("ended",f);});
			})(MUS_AudioChannels[i]);
	_clearEndingSequenceTimer();
	_endingSequenceTimer=setTimeout(function(){_doEndingAutoReturn("safety timer");},safetyMs);
	}

// 原作credits(ＭＳ明朝・サイズ階層)をinnerHTMLでスクロール。最終カードを画面中央で停止(居座り)。返値=スクロール所要ms。
function _applyEndingRollHtml(frag,targetDurationMs)
	{
	var finalHtml,finalEl,finalTop,finalH,distancePx,durationMs,plEl;
	if (!_endingRollContent) return 18000;
	// 原作最終カード(cid560/562をデコード)= 「企画・製作 / Pleiades Company」を中央停止し、下に「マウスクリックで…戻ります」(原作=丸ゴシック,α0→1フェードイン)。
	// 手前に大きめ余白(240px)を置き、停止時に上のクレジットは画面外へ抜けきって最終カードだけが中央に残るようにする。
	finalHtml='<div style="height:240px"></div>'
		+'<div id="EDR_FINAL" style="line-height:1.4">'
			+'<div style="font-size:28px">企画・製作</div>'
			+'<div id="EDR_PLEIADES" style="font-size:34px;margin-top:6px;text-shadow:0 0 8px rgba(0,0,0,0.72);transition:text-shadow 0.8s ease-out">Pleiades Company</div>'
		+'</div>'
		+'<div id="EDR_RETURN" style="font-family:\'HG丸ゴシックM-PRO\',\'HGRSGU\',\'Meiryo\',sans-serif;font-size:20px;margin-top:40px;opacity:0;transition:opacity 0.8s ease-in">マウスクリックでタイトルに戻ります</div>';
	_endingRollContent.innerHTML=frag+finalHtml;
	_endingRollContent.style.transition="none";
	_endingRollContent.style.transform="translateY(0)";
	void _endingRollContent.offsetHeight;
	finalEl=document.getElementById("EDR_FINAL");
	finalTop=finalEl?finalEl.offsetTop:(_endingRollContent.scrollHeight||0);
	finalH=finalEl?finalEl.offsetHeight:44;
	// content先頭は overlay下端(y=360)から開始。最終カード中心を画面中央(y=180)に来た所で止める。
	distancePx=180+finalTop+finalH/2;
	// 原作のスクロール窓(②timeline)があればそれに尺を合わせ背景と同期。無ければ実測速度32.8px/秒。
	durationMs=(targetDurationMs>0)?Math.round(targetDurationMs):Math.round(distancePx/32.8*1000);
	if (window._EDR_FAST>0) durationMs=Math.max(3000,window._EDR_FAST|0);	// ★検証用: window._EDR_FAST=8000 でED全体を高速再生(着地+影を即確認)
	_endingRollContent.style.transition="transform "+durationMs+"ms linear";
	_endingRollContent.style.transform="translateY(-"+distancePx+"px)";
	// 中央停止の瞬間(=スクロール所要時間後)に Pleiades Company へ影をフェードイン(原作演出)。
	plEl=document.getElementById("EDR_PLEIADES");
	if (plEl) setTimeout(function(){
		var p=document.getElementById("EDR_PLEIADES");
		if (!p) return;
		// 影=白っぽい灰色を右下に少しズラして。可読性の薄い暗グローも残す。
		p.style.textShadow="6px 6px 1px rgba(205,205,210,0.75),0 0 8px rgba(0,0,0,0.5)";
		_dbg("ed pleiades shadow on (+"+durationMs+"ms)");
		},durationMs);
	// 影の少し後に「マウスクリックで…戻ります」をフェードイン(原作の最終フェード)。同時にクリック戻りを有効化。
	setTimeout(function(){
		var rt=document.getElementById("EDR_RETURN");
		if (rt) rt.style.opacity="1";
		if (_endingSequenceStage===2 && !_endingClickReturn)
			{
			_endingClickReturn=function(){_doEndingAutoReturn("click");};
			document.addEventListener("click",_endingClickReturn,true);
			}
		},durationMs+1300);
	// 自動戻り: ED曲(BGM)が鳴り終わったら戻る。+保険タイマー。
	_armEndingAutoReturn(durationMs+60000);
	_dbg("ed shadow scheduled at +"+durationMs+"ms");
	return durationMs;
	}

function _scheduleEndingRollComplete(durationMs)
	{
	if (!(durationMs>0)) durationMs=18000;
	_clearEndingSequenceTimer();
	_endingSequenceTimer=setTimeout(function(){
		_finishEndingRollSequence();
		},durationMs);
	}

function _loadEndingTimelineMap()
	{
	if (_endingTimelineMap) return Promise.resolve(_endingTimelineMap);
	if (_endingTimelineMapPromise) return _endingTimelineMapPromise;
	_endingTimelineMapPromise=_loadTextUtf8("../sys/aqcan_ed_background_timeline_corrected.md").then(function(src){
		var map={};
		var lines=src.replace(/\r/g,"").split("\n");
		var i,line,m,ed,current=null,phase="title";
		for(i=0;i<lines.length;i++)
			{
			line=lines[i];
			m=line.match(/^##\s*ED(\d{2})\s+(.*)$/);
			if (m)
				{
				ed=parseInt(m[1],10);
				current=map[ed]||{
					edNumber:ed,
					title:m[2].trim(),
					titleSegments:[],
					rollSegments:[]
					};
				map[ed]=current;
				phase="title";
				continue;
				}
			if (!current) continue;
			if (/^###\s+/i.test(line))
				{
				if (/scroll end/i.test(line)) phase="roll";
				else phase="title";
				continue;
				}
			m=line.match(/^- title before scroll:\s*([\d.]+)/i);
			if (m)
				{
				current.titleBeforeScrollSec=parseFloat(m[1])||0;
				continue;
				}
			m=line.match(/^- scroll end:\s*([\d.]+)/i);
			if (m)
				{
				current.scrollEndSec=parseFloat(m[1])||0;
				continue;
				}
			m=line.match(/^- final cards end:\s*([\d.]+)/i);
			if (m)
				{
				current.finalCardsEndSec=parseFloat(m[1])||0;
				continue;
				}
			m=line.match(/^- (char\d{3}\.jpg|non-jpeg\/vector segment)\s*\/\s*([\d.]+)秒/i);
			if (m)
				{
				(phase==="roll"?current.rollSegments:current.titleSegments).push({
					file:/^char/i.test(m[1])?m[1]:null,
					durationSec:parseFloat(m[2])||0
					});
				continue;
				}
			}
		if (!Object.keys(map).length) throw new Error("no timeline rows");
		_endingTimelineMap=map;
		_endingTimelineMapPromise=null;
		_dbg("ending timeline loaded:",Object.keys(map).length,"rows");
		return map;
		}).catch(function(err){
		_endingTimelineMapPromise=null;
		_dbg("ending timeline load failed:",err.message);
		return null;
		});
	return _endingTimelineMapPromise;
	}

function _getEndingTimelineInfo(edNumber)
	{
	var map=_endingTimelineMap;
	return (map&&map.hasOwnProperty(edNumber))?map[edNumber]:null;
	}

function _clearEndingBackgroundTimers()
	{
	var i;
	for(i=0;i<_endingBackgroundTimers.length;i++) clearTimeout(_endingBackgroundTimers[i]);
	_endingBackgroundTimers=[];
	}

function _scheduleEndingBackgroundSegments(segments)
	{
	var i,seg,offsetMs=0,totalMs=0,id;
	_clearEndingBackgroundTimers();
	if (!segments||!segments.length) return 0;
	for(i=0;i<segments.length;i++)
		{
		seg=segments[i];
		if (seg && seg.file)
			{
			if (offsetMs<=0) showBackgroundFile(seg.file);
			else
				{
				(function(file,delay){
					id=setTimeout(function(){
						if (_endingSequenceStage!==2) return;
						showBackgroundFile(file);
						_dbg("ending bg:",file,"at",delay+"ms");
						},delay);
					_endingBackgroundTimers.push(id);
					})(seg.file,offsetMs);
				}
			}
		offsetMs+=Math.round(((seg&&seg.durationSec)||0)*1000);
		}
	totalMs=offsetMs;
	return totalMs;
	}

function _finishEndingRollSequence()
	{
	if (_endingSequenceStage===0) return;
	_clearEndingSequenceTimer();
	_clearEndingBackgroundTimers();
	_endingSequenceStage=3;
	_hideEndingRollOverlay();
	_hideEndingTintOverlay();
	_hideEdOverlay();
	_dbg("ending roll complete");
	if (typeof _restartTitleAsStartup==="function")
		{
		_endingSequenceStage=0;
		_restartTitleAsStartup();
		return;
		}
	if (typeof gotitle==="function")
		{
		_endingSequenceStage=0;
		nowwin="title";
		nowgame="off";
		gotitle(true);
		}
	}

function _loadTextUtf8(url)
	{
	return fetch(url).then(function(resp){
		if (!resp.ok) throw new Error("fetch failed: "+url+" status="+resp.status);
		return resp.arrayBuffer();
		}).then(function(buf){
		return new TextDecoder("utf-8").decode(buf);
		});
	}

function _parseEndingRollMarkdown(src)
	{
	var lines,sections,current,i,line,m;
	if (!src) return [];
	lines=src.replace(/\r/g,"").split("\n");
	sections=[];
	current=null;
	for(i=0;i<lines.length;i++)
		{
		line=lines[i];
		m=line.match(/^##\s+(.+?)\s*$/);
		if (m)
			{
			current={title:m[1],items:[]};
			sections.push(current);
			continue;
			}
		if (!current) continue;
		m=line.match(/^\s*-\s+(.*?)\s*$/);
		if (m)
			{
			current.items.push(m[1]);
			continue;
			}
		if ((!/^\s*$/.test(line)) && current.items.length>0)
			current.items[current.items.length-1]+="\n"+line.replace(/^\s+/,"");
		}
	return sections;
	}

function _getEndingRollSections()
	{
	if (_endingRollSections) return Promise.resolve(_endingRollSections);
	if (_endingRollSectionsPromise) return _endingRollSectionsPromise;
	_endingRollSectionsPromise=_loadTextUtf8("../gptcheckdata/game_swf_ed_roll_structured.md").then(function(src){
		var sections=_parseEndingRollMarkdown(src);
		if (!sections.length) throw new Error("no ending roll sections");
		_endingRollSections=sections;
		_endingRollSectionsPromise=null;
		_dbg("ending roll md loaded:",sections.length,"sections");
		return sections;
		}).catch(function(err){
		_endingRollSectionsPromise=null;
		_dbg("ending roll md load failed:",err.message);
		return null;
		});
	return _endingRollSectionsPromise;
	}

function _buildEndingRollLinesFromSections(sections)
	{
	var order=[0,1,2,3,4,5,6,7,8];
	var lines=["","Credits",""];
	var i,idx,section,j;
	if (!sections||!sections.length) return null;
	for(i=0;i<order.length;i++)
		{
		idx=order[i];
		section=sections[idx];
		if (!section||!section.items||!section.items.length) continue;
		lines.push(section.title);
		lines.push("");
		for(j=0;j<section.items.length;j++)
			lines.push(section.items[j]);
		lines.push("");
		}
	return lines;
	}

function _applyEndingRollLines(lines)
	{
	var contentHeight,distancePx,durationMs;
	if (!_endingRollContent) return 18000;
	_endingRollContent.textContent=(lines&&lines.length)?lines.join("\n"):"";
	_endingRollContent.style.transition="none";
	_endingRollContent.style.transform="translateY(0)";
	void _endingRollContent.offsetHeight;
	contentHeight=_endingRollContent.scrollHeight||0;
	distancePx=Math.max(720,contentHeight+420);
	durationMs=Math.max(30000,Math.min(120000,Math.round(distancePx/55*1000)));
	_endingRollContent.style.transition="transform "+durationMs+"ms linear";
	_endingRollContent.style.transform="translateY(-"+distancePx+"px)";
	return durationMs;
	}

function _showEndingRollOverlay(edNumber)
	{
	var ov=_ensureEndingRollOverlay();
	var bgEl=null;
	var fallbackLines,durationMs;
	if (!ov||!_endingRollContent) return;
	bgEl=ov.firstChild;
	ov.style.background="transparent";
	if (bgEl && bgEl!==_endingRollContent) bgEl.style.display="none";
	ov.style.visibility="visible";
	_endingRollContent.textContent="";
	_endingRollDisplayDurationMs=0;
	fallbackLines=[
		"",
		"Credits",
		"",
		"Aquanaut Campus",
		"",
		"Pleiades Company",
		"Original Release 2002-2007",
		"",
		"Thank you for playing",
		""
		];
	durationMs=_applyEndingRollLines(fallbackLines);
	_endingRollDisplayDurationMs=durationMs;
	_getEndingRollSections().then(function(sections){
		var lines;
		if (_endingSequenceStage!==2 || !_endingRollOverlay || _endingRollOverlay.style.visibility==="hidden") return;
		lines=_buildEndingRollLinesFromSections(sections);
		if (!lines||!lines.length)
			{
			return;
			}
		durationMs=_applyEndingRollLines(lines);
		_endingRollDisplayDurationMs=durationMs;
		_dbg("ending roll md applied");
		});
	}

function _hideEndingRollOverlay()
	{
	if (!_endingRollOverlay) return;
	_endingRollOverlay.style.visibility="hidden";
	if (_endingRollContent)
		{
		_endingRollContent.style.transition="none";
		_endingRollContent.style.transform="translateY(0)";
		}
	}

function _hideFlashPlayerVisualOnly()
	{
	if (!FLASH_PLAYER) return;
	FLASH_PLAYER.style.visibility="hidden";
	FLASH_PLAYER.style.opacity="0";
	}

function _startEndingRollSequence()
	{
	var tl=_getEndingTimelineInfo(_endingCurrentEdNumber);
	var durationMs=0;
	var timelineRollMs=0;
	_endingSequenceStage=2;
	showBackgroundFile("char439.jpg");
	_hideMainJpeg();
	_hideEndingTintOverlay();
	_hideEdOverlay();
	_showEndingRollOverlay(_endingCurrentEdNumber);
	if (typeof _clearFlashCanvas==="function") _clearFlashCanvas();	// ★z163: F7619ロードのvisible復帰前にcanvas残骸を消す(z161同型・別SWF/別EDロール入りの一瞬対策)
	_loadGameSWF("game_F7619.swf",76,false);
	setTimeout(function(){_hideFlashPlayerVisualOnly();},60);
	if (tl && tl.rollSegments && tl.rollSegments.length)
		{
		timelineRollMs=_scheduleEndingBackgroundSegments(tl.rollSegments);
		}
	if (_endingRollDisplayDurationMs>durationMs) durationMs=_endingRollDisplayDurationMs;
	if (tl && tl.finalCardsEndSec>0 && tl.titleBeforeScrollSec>0)
		{
		timelineRollMs=Math.round((tl.finalCardsEndSec-tl.titleBeforeScrollSec)*1000);
		if (timelineRollMs>durationMs) durationMs=timelineRollMs;
		}
	if (durationMs>0) _scheduleEndingRollComplete(durationMs);
	_dbg("ending roll started","ms="+durationMs);
	}

function _clearEndingSequenceTimer()
	{
	if (_endingSequenceTimer)
		{
		clearTimeout(_endingSequenceTimer);
		_endingSequenceTimer=null;
		}
	}

function _isEndingTitleSwf(file)
	{
	var k;
	if (!file || typeof ED_FRAME_MAP==="undefined") return false;
	for (k in ED_FRAME_MAP)
		{
		if (ED_FRAME_MAP.hasOwnProperty(k) && ED_FRAME_MAP[k] && ED_FRAME_MAP[k].file===file) return true;
		}
	return false;
	}

function _startEndingTitleSequence()
	{
	var el=document.getElementById("ED_OVERLAY");
	var titleMs=10000;
	var fadeMs=1200;
	_endingSequenceStage=1;
	_showEndingTintOverlay();
	if (el)
		{
		el.style.transition="opacity 1.2s linear";
		el.style.opacity="1";
		el.style.visibility="visible";
		}
	if (titleMs<fadeMs) fadeMs=Math.max(200,titleMs);
	_clearEndingSequenceTimer();
	_endingSequenceTimer=setTimeout(function(){
		var edEl=document.getElementById("ED_OVERLAY");
		_endingSequenceTimer=null;
		if (_endingTintOverlay)
			{
			_endingTintOverlay.style.transition="opacity "+fadeMs+"ms linear";
			_endingTintOverlay.style.opacity="0";
			}
		if (edEl)
			{
			edEl.style.transition="opacity "+fadeMs+"ms linear";
			edEl.style.opacity="0";
			}
		_endingSequenceTimer=setTimeout(function(){
			_endingSequenceTimer=null;
			_startEndingRollSequence();
			},fadeMs);
		},titleMs);
	}

function _clearSaveTransitionPrecover()
	{
	if (_saveTransitionPrecoverTimer)
		{
		clearTimeout(_saveTransitionPrecoverTimer);
		_saveTransitionPrecoverTimer=null;
		}
	_saveTransitionPrecoverActive=false;
	}

function _clearSceneHoldOverlay()
	{
	if (_sceneHoldOverlay&&_sceneHoldOverlay.parentNode)
		_sceneHoldOverlay.parentNode.removeChild(_sceneHoldOverlay);
	_sceneHoldOverlay=null;
	}

function _holdCurrentSceneCover()
	{
	var mainDiv=document.getElementById("MAINW");
	if (!mainDiv) return false;
	if (_sceneHoldOverlay&&_sceneHoldOverlay.parentNode) return true;
	_clearSceneHoldOverlay();
	_sceneHoldOverlay=_captureVisibleScene(mainDiv,512,360);
	if (_sceneHoldOverlay) _sceneHoldOverlay.style.zIndex="14";
	return !!_sceneHoldOverlay;
	}

function _startSaveTransitionPrecover()
	{
	var mainDiv=document.getElementById("MAINW");
	_waitForBgFile("char123.jpg",function(){
		if (_currentSWFFile!=="game_F0500.swf"||_completionFired) return;
		_saveTransitionPrecoverActive=true;
		_updateBgLayer(74);
		_hideMainJpeg();
		if (mainDiv) mainDiv.style.background="transparent";
		// ★Step1b: ロゴアニメ(F500)を見せるためFLASH_PLAYERは隠さない（char123はBG_LAYERに敷いて黒フレーム/チラ見え防止のみ）
		_dbg("save precover: char123 (player visible)");
		});
	}

function _waitForBgFile(file,done)
	{
	var img;
	function finish()
		{
		img.removeEventListener("load",finish);
		img.removeEventListener("error",finish);
		done();
		}
	if (!file) {done();return;}
	img=(typeof _preloadedJpegs!=="undefined" && _preloadedJpegs)?_preloadedJpegs[file]:null;
	if (!img)
		{
		img=new Image();
		img.src=JPEG_DIR+file;
		}
	if (img.complete&&img.naturalWidth>0)
		{
		done();
		return;
		}
	img.addEventListener("load",finish);
	img.addEventListener("error",finish);
	}

function showSceneBackgroundOnly(num)
	{
	var mainDiv=document.getElementById("MAINW");
	_clearSaveTransitionPrecover();
	_clearSceneHoldOverlay();
	_clearDayTransitionOverlay();
	if (!_sunsetBgHoldActive) _clearManualFadeOverlay();
	_cancelPlaybackDetection();
	_completionFired=true;
	_unfreezePlayer();
	_hideEdOverlay();
	if (_sunsetBgHoldActive && (num===_sunsetBgHoldReleaseFrame || _sunsetBgHoldExtraReleaseFrames[num]))
		_clearSunsetBgHold();
	if (_sunsetBgHoldActive)
		_maintainSunsetBgHold();
	else
		_updateBgLayer(num);
	_hideMainJpeg();
	_currentSWFFile=null;
	nowgrp=num;
	drawsts=true;
	if (mainDiv) mainDiv.style.background="transparent";
	if (FLASH_PLAYER)
		{
		try{FLASH_PLAYER.pause();}catch(e){}
		FLASH_PLAYER.style.visibility="hidden";
		FLASH_PLAYER.style.opacity="0";
		}
	_dbg("scene bg only:",num);
	}

function showBackgroundFile(file)
	{
	var img;
	var mainDiv=document.getElementById("MAINW");
	if (!file) return false;
	_clearSaveTransitionPrecover();
	_clearSceneHoldOverlay();
	_clearDayTransitionOverlay();
	img=document.getElementById("BG_LAYER");
	if (!img) {_initBgLayer();img=document.getElementById("BG_LAYER");}
	if (!img) return false;
	_clearManualFadeOverlay();
	_hideMainJpeg();
	if (!_sunsetBgHoldActive) _hideBgTint();
	_currentBgJpeg=file;
	img.src=JPEG_DIR+file;
	img.style.display="block";
	if (mainDiv) mainDiv.style.background="transparent";
	_dbg("BG_LAYER direct:",file);
	return true;
	}

var _bgTintLayer=null;
var _sunsetBgHoldActive=false;
var _sunsetBgHoldFile="char035.jpg";
var _sunsetBgHoldReleaseFrame=400;
var _sunsetBgHoldExtraReleaseFrames={
	21:true,
	105:true,
	106:true
	};
var _sunsetBgHoldTint="rgba(220,176,76,0.48)";

function _initBgTintLayer()
	{
	var mainDiv=document.getElementById("MAINW");
	var tint=document.getElementById("BG_TINT_LAYER");
	if (!mainDiv) return;
	if (tint) return;
	tint=document.createElement("div");
	tint.id="BG_TINT_LAYER";
	tint.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:0;pointer-events:none;display:none;background:"+_sunsetBgHoldTint+";";
	mainDiv.appendChild(tint);
	_bgTintLayer=tint;
	}

function _showBgTint(color)
	{
	var tint=document.getElementById("BG_TINT_LAYER");
	if (!tint) {_initBgTintLayer();tint=document.getElementById("BG_TINT_LAYER");}
	if (!tint) return;
	_bgTintLayer=tint;
	tint.style.background=color||_sunsetBgHoldTint;
	tint.style.display="block";
	}

function _hideBgTint()
	{
	var tint=document.getElementById("BG_TINT_LAYER");
	if (tint) tint.style.display="none";
	}

function _drawBgTintOverlay(ctx,w,h)
	{
	var tint=document.getElementById("BG_TINT_LAYER");
	var fillColor;
	if (!ctx||!tint||tint.style.display==="none") return;
	fillColor=tint.style.background;
	if (!fillColor && window.getComputedStyle)
		fillColor=window.getComputedStyle(tint).backgroundColor;
	if (!fillColor) return;
	ctx.fillStyle=fillColor;
	ctx.fillRect(0,0,w,h);
	}

function _maintainSunsetBgHold()
	{
	var img=document.getElementById("BG_LAYER");
	var mainDiv=document.getElementById("MAINW");
	if (!_sunsetBgHoldActive) return false;
	if (!img) {_initBgLayer();img=document.getElementById("BG_LAYER");}
	if (!img) return false;
	if (_currentBgJpeg!==_sunsetBgHoldFile)
		{
		_currentBgJpeg=_sunsetBgHoldFile;
		img.src=JPEG_DIR+_sunsetBgHoldFile;
		}
	img.style.display="block";
	_showBgTint(_sunsetBgHoldTint);
	if (mainDiv) mainDiv.style.background="transparent";
	return true;
	}

function _clearSunsetBgHold()
	{
	if (!_sunsetBgHoldActive) return;
	_sunsetBgHoldActive=false;
	_hideBgTint();
	_dbg("sunset bg hold cleared");
	}

function _beginSunsetBgHoldTransition()
	{
	var mainDiv=document.getElementById("MAINW");
	var overlay;
	if (!mainDiv) return false;
	_clearManualFadeOverlay();
	overlay=_captureVisibleScene(mainDiv,512,360);
	_sunsetBgHoldActive=true;
	_maintainSunsetBgHold();
	_hideMainJpeg();
	_unfreezePlayer();
	if (FLASH_PLAYER)
		{
		try{FLASH_PLAYER.pause();}catch(e){}
		FLASH_PLAYER.style.visibility="hidden";
		FLASH_PLAYER.style.opacity="0";
		}
	if (!overlay)
		{
		_dbg("sunset bg hold begin: no overlay");
		return true;
		}
	_manualFadeOverlay=overlay;
	overlay.style.zIndex="11";
	overlay.style.opacity="1";
	overlay.style.transition="opacity 900ms linear";
	requestAnimationFrame(function(){
		requestAnimationFrame(function(){
			if (_manualFadeOverlay) _manualFadeOverlay.style.opacity="0";
			});
		});
	_manualFadeTimer=setTimeout(function(){
		_clearManualFadeOverlay();
		_dbg("sunset bg hold begin");
		},980);
	return true;
	}

function _ensureDayTransitionOverlay()
	{
	var parent=document.getElementById("MAINW");
	if (!parent) return null;
	if (!_dayTransitionStormStyleInjected)
		{
		var style=document.createElement("style");
		style.textContent="@keyframes dayTransitionStormZoom{0%{transform:scale(1);}35%{transform:scale(1.035);}100%{transform:scale(1);}}";
		document.head.appendChild(style);
		_dayTransitionStormStyleInjected=true;
		}
	if (_dayTransitionOverlay&&_dayTransitionOverlay.parentNode) return _dayTransitionOverlay;
	_dayTransitionOverlay=document.createElement("div");
	_dayTransitionOverlay.id="DAY_TRANSITION_OVERLAY";
	_dayTransitionOverlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:24;display:none;pointer-events:none;";
	_dayTransitionBody=document.createElement("div");
	_dayTransitionBody.style.cssText="position:absolute;left:116px;top:116px;width:280px;min-height:72px;padding:12px 16px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;background:rgba(7,18,34,0.68);border:1px solid rgba(230,240,255,0.78);box-shadow:0 10px 24px rgba(0,0,0,0.35);color:#f6fbff;font-family:'Yu Mincho','Hiragino Mincho ProN','MS Mincho',serif;font-size:20px;line-height:1.45;text-align:center;text-shadow:0 0 5px rgba(0,0,0,0.7);white-space:normal;word-break:keep-all;overflow-wrap:anywhere;";
	_dayTransitionOverlay.appendChild(_dayTransitionBody);
	parent.appendChild(_dayTransitionOverlay);
	return _dayTransitionOverlay;
	}

function _clearDayTransitionOverlay()
	{
	var mainDiv=document.getElementById("MAINW");
	if (_dayTransitionTimer)
		{
		clearTimeout(_dayTransitionTimer);
		_dayTransitionTimer=null;
		}
	if (_dayTransitionOverlay) _dayTransitionOverlay.style.display="none";
	if (_dayTransitionBody)
		{
		_dayTransitionBody.innerHTML="";
		}
	if (mainDiv)
		{
		mainDiv.style.animation="none";
		mainDiv.style.transform="none";
		mainDiv.style.transformOrigin="";
		}
	}

function _getCurrentDayTransitionDay()
	{
	var reg0;
	if (typeof reg==="undefined" || !reg) return 0;
	reg0=reg[0];
	if (!(reg0>=0)) return 0;
	return 2+Math.floor(reg0/7);
	}

function _getDayTransitionMeta(frame)
	{
	var day=DAY_TRANSITION_DATE_FRAMES[frame];
	var base;
	if (!day&&DAY_TRANSITION_WEATHER_FRAMES[frame]) day=_getCurrentDayTransitionDay();
	base=DAY_TRANSITION_DAY_META[day];
	if (!base) return null;
	return {
		date:base.date,
		weather:base.weather,
		bg:base.bg,
		showWeather:!!DAY_TRANSITION_WEATHER_FRAMES[frame]
		};
	}

function _getFrameDurationMs(frame)
	{
	var info=FRAME_TO_SWF[frame];
	if (!info||!info.duration) return 0;
	return Math.ceil(info.duration*1000);
	}

function _startDayTransitionOverlay(meta,durationMs,label,frameNum)
	{
	var overlay;
	var mainDiv=document.getElementById("MAINW");
	if (!(frameNum>=0)) frameNum=0;
	if (!meta||!durationMs) return false;
	_clearDayTransitionOverlay();
	_clearManualFadeOverlay();
	if (_gameOverlayTimer) {clearTimeout(_gameOverlayTimer);_gameOverlayTimer=null;}
	if (_gameOverlay&&_gameOverlay.parentNode) _gameOverlay.parentNode.removeChild(_gameOverlay);
	_gameOverlay=null;
	_cancelPlaybackDetection();
	_completionFired=false;
	_unfreezePlayer();
	_hideEdOverlay();
	if (!showBackgroundFile(meta.bg)) _updateBgLayer(frameNum);
	_hideMainJpeg();
	_currentSWFFile=null;
	nowgrp=frameNum;
	drawsts=true;
	if (FLASH_PLAYER)
		{
		try{FLASH_PLAYER.pause();}catch(e){}
		FLASH_PLAYER.style.display="none";
		FLASH_PLAYER.style.visibility="hidden";
		FLASH_PLAYER.style.opacity="0";
		}
	overlay=_ensureDayTransitionOverlay();
	if (overlay&&_dayTransitionBody)
		{
		_dayTransitionBody.innerHTML=meta.showWeather?(meta.date+"<br>"+meta.weather):meta.date;
		if (meta.weather=="\u5d50")
			{
			if (mainDiv)
				{
				mainDiv.style.transformOrigin="256px 152px";
				mainDiv.style.animation="dayTransitionStormZoom 1.7s ease-in-out infinite";
				}
			}
		else
			{
			if (mainDiv)
				{
				mainDiv.style.animation="none";
				mainDiv.style.transform="none";
				mainDiv.style.transformOrigin="";
				}
			}
		overlay.style.display="block";
		}
	_dayTransitionTimer=setTimeout(function(){
		_dayTransitionTimer=null;
		if (_dayTransitionOverlay) _dayTransitionOverlay.style.display="none";
		if (!_completionFired) _onPlaybackComplete();
		},durationMs);
	_dbg("day transition overlay:",label,meta.date,meta.showWeather?meta.weather:"date-only");
	return true;
	}

function _startDayTransition(frame)
	{
	var meta=_getDayTransitionMeta(frame);
	return _startDayTransitionOverlay(meta,_getFrameDurationMs(frame),frame,frame);
	}

function startDayTransitionSequence(day,weatherFrame)
	{
	// ★日付遷移をSWFアニメに戻す: オーバーレイを使わずfalseを返し、
	//   schedule.jsの既存SWFフォールバック経路(setposs DATE→WEATHER)に処理を委ねる。
	return false;
	var actualDay=day+3;
	var meta=DAY_TRANSITION_DAY_META[actualDay];
	var dateFrame=7000+Math.max(0,day)*50;
	var durationMs=_getFrameDurationMs(dateFrame);
	if (!meta||!durationMs) return false;
	if (weatherFrame) durationMs+=_getFrameDurationMs(weatherFrame);
	return _startDayTransitionOverlay({
		date:meta.date,
		weather:meta.weather,
		bg:meta.bg,
		showWeather:!!weatherFrame
		},durationMs,"day"+day+(weatherFrame?("/"+weatherFrame):""),dateFrame);
	}

function _captureVisibleScene(parentEl,w,h)
	{
	var source=_freezeOverlay||_captureOverlay(FLASH_PLAYER,parentEl,w,h);
	var ov,ctx;
	if (!source) return null;
	if (source!==_freezeOverlay) return source;
	ov=document.createElement("canvas");
	ov.width=w;ov.height=h;
	ov.style.cssText="position:absolute;top:0;left:0;width:"+w+"px;height:"+h+"px;z-index:10;pointer-events:none;";
	try{
		ctx=ov.getContext("2d");
		ctx.drawImage(source,0,0,w,h);
		}
	catch(e){return null;}
	parentEl.appendChild(ov);
	return ov;
	}

function _repaintOverlayWithCurrentBackground(overlay)
	{
	var ctx,bgImg,jpgImg,w,h;
	if (!overlay || !overlay.getContext) return false;
	ctx=overlay.getContext("2d");
	if (!ctx) return false;
	w=overlay.width||512;
	h=overlay.height||360;
	bgImg=document.getElementById("BG_LAYER");
	jpgImg=document.getElementById("MAINW_JPEG");
	ctx.clearRect(0,0,w,h);
	try{
		if (bgImg && bgImg.style.display!=="none" && bgImg.complete) ctx.drawImage(bgImg,0,0,w,h);
		_drawBgTintOverlay(ctx,w,h);
		if (jpgImg && jpgImg.style.display!=="none" && jpgImg.complete) ctx.drawImage(jpgImg,0,0,w,h);
		}
	catch(e){return false;}
	return true;
	}

function _clearManualFadeOverlay()
	{
	if (_manualFadeTimer)
		{
		clearTimeout(_manualFadeTimer);
		_manualFadeTimer=null;
		}
	if (_manualFadeOverlay&&_manualFadeOverlay.parentNode)
		_manualFadeOverlay.parentNode.removeChild(_manualFadeOverlay);
	_manualFadeOverlay=null;
	}

function _startManualSceneFade(bgFrame,durationMs,fadeFromJpeg)
	{
	var mainDiv=document.getElementById("MAINW");
	var overlay;
	if (!mainDiv) return false;
	_clearManualFadeOverlay();
	if (_gameOverlayTimer) {clearTimeout(_gameOverlayTimer);_gameOverlayTimer=null;}
	if (_gameOverlay&&_gameOverlay.parentNode) _gameOverlay.parentNode.removeChild(_gameOverlay);
	_gameOverlay=null;
	// ★z43: 背景のみキャプチャ(立ち絵=Ruffle canvasを除外)。SLG突入は「背景charがじわっとフェード／立ち絵swfは即消え」が正(篠原)。
	//   立ち絵は下の_unfreezePlayer(freeze除去)+_clearFlashCanvas(z42)で即消し、この背景overlayだけが古背景→char169へフェードする。
	//   従来の_captureVisibleScene(立ち絵込み)だと立ち絵までフェードして逆になっていた。
	// ★z63: 既にbgFrameの背景(FRAME_TO_BG_JPEG[bgFrame]=char169)が表示中ならフェードしない。
	//   SLGのmenu02はcmdstp遷移(行動選択→結果→次の選択)でsetposs(370)を複数回呼ぶ。2回目以降は1回目で既に
	//   背景がchar169になっており、snapshotがchar169→char169の無意味フェード=「正式背景が先に出てからフェード」の
	//   あべこべに見えていた(篠原報告)。1回目(旧背景→char169)は正常にフェードし、2回目以降はsnapshot/フェードを
	//   作らず背景維持＋立ち絵だけ消す(下の !overlay fallback で return)。
	var bgAlready=(typeof FRAME_TO_BG_JPEG!=="undefined" && FRAME_TO_BG_JPEG[bgFrame] && FRAME_TO_BG_JPEG[bgFrame]===_currentBgJpeg);
	// ★z66: 一日目SLG突入の特例。フェード元(overlay)を直近の通常シーン背景char054(snapshot)ではなく、
	//   指定JPEG(char006)で固定する(篠原指示)。選択肢シーンF9のBG_LAYERは触らずchar054のまま、
	//   フェードインの瞬間だけchar006→char169へ繋ぐ。char006は512×384=char054/char169と同寸、
	//   BG_LAYERと同じobject-fit:none+左上で出すので位置ずれ無し(下24px=6.25%クロップも同一)。
	if (fadeFromJpeg && !bgAlready)
		{
		overlay=document.createElement("img");
		overlay.src=JPEG_DIR+fadeFromJpeg;
		overlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;object-fit:none;object-position:0 0;";
		mainDiv.appendChild(overlay);
		_dbg("manual fade from JPEG:",fadeFromJpeg,"(一日目SLG突入特例) F"+bgFrame);
		}
	else
		overlay=bgAlready?null:_captureBackgroundOverlay(mainDiv,512,360);
	if (bgAlready) _dbg("manual fade skip (bg already "+_currentBgJpeg+"): F"+bgFrame+" 重複setposs");
	_cancelPlaybackDetection();
	_completionFired=true;
	_updateBgLayer(bgFrame);
	_hideMainJpeg();
	_unfreezePlayer();
	_currentSWFFile=null;
	nowgrp=bgFrame;
	drawsts=true;
	if (FLASH_PLAYER)
		{
		try{FLASH_PLAYER.pause();}catch(e){}
		FLASH_PLAYER.style.visibility="hidden";
		FLASH_PLAYER.style.opacity="0";
		}
	// ★z42: manual fadeで前SWF(F3000等)を視覚的にフェードアウトしても、FLASH_PLAYER canvasにピクセルが残る。
	//   次のsetposs(_loadGameSWFの_captureOverlay)がそれを拾って「無関係な別シーン」として一瞬復活させていた(篠原報告)。
	//   フェード用overlayは上で_captureVisibleScene済みなので、ここでcanvasを消しても演出は継続する。
	_clearFlashCanvas();
	if (!overlay)
		{
		_dbg("manual fade fallback: no overlay for F"+bgFrame);
		return true;
		}
	_manualFadeOverlay=overlay;
	overlay.style.zIndex="11";
	overlay.style.opacity="1";
	overlay.style.transition="opacity "+durationMs+"ms linear";
	requestAnimationFrame(function(){
		requestAnimationFrame(function(){
			if (_manualFadeOverlay) _manualFadeOverlay.style.opacity="0";
			});
		});
	_manualFadeTimer=setTimeout(function(){
		_clearManualFadeOverlay();
		_dbg("manual fade complete: F"+bgFrame);
		},durationMs+60);
	return true;
	}

function _captureTitleHelpBackground()
	{
	var mainDiv=document.getElementById("MAINW");
	var source=_freezeOverlay||_getFlashCanvas();
	var ctx,w,h;
	if (!mainDiv||!source) return false;
	w=source.width||512;
	h=source.height||360;
	if (!_titleHelpFreezeOverlay||!_titleHelpFreezeOverlay.parentNode)
		{
		_titleHelpFreezeOverlay=document.createElement("canvas");
		_titleHelpFreezeOverlay.id="TITLE_HELP_BG";
		_titleHelpFreezeOverlay.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:18;pointer-events:none;display:none;";
		mainDiv.appendChild(_titleHelpFreezeOverlay);
		}
	_titleHelpFreezeOverlay.width=w;
	_titleHelpFreezeOverlay.height=h;
	ctx=_titleHelpFreezeOverlay.getContext("2d");
	if (!ctx) return false;
	ctx.clearRect(0,0,w,h);
	try{ctx.drawImage(source,0,0,w,h);}
	catch(e){_dbg("title help freeze failed: "+e.message);return false;}
	_titleHelpFreezeOverlay.style.display="block";
	try{if (FLASH_PLAYER) FLASH_PLAYER.pause();}catch(e){}
	return true;
	}

function _releaseTitleHelpBackground()
	{
	if (_titleHelpFreezeOverlay&&_titleHelpFreezeOverlay.parentNode)
		_titleHelpFreezeOverlay.style.display="none";
	}

function _unfreezePlayer()
	{
	if (_freezeOverlay&&_freezeOverlay.parentNode)
		{
		// ★z58 一時計測: freeze(ov)とRuffle canvasの実表示位置/大きさを比較(立ち絵ズレ調査)。確認後この計測ブロックは削除する。
		try{
			var _c=_getFlashCanvas();
			if (_c){
				var ro=_freezeOverlay.getBoundingClientRect(), rc=_c.getBoundingClientRect();
				_dbg("[RECT] freeze="+ro.left.toFixed(2)+","+ro.top.toFixed(2)+" "+ro.width.toFixed(2)+"x"+ro.height.toFixed(2)
					+" | canvas="+rc.left.toFixed(2)+","+rc.top.toFixed(2)+" "+rc.width.toFixed(2)+"x"+rc.height.toFixed(2)
					+" | Δpos="+(rc.left-ro.left).toFixed(2)+","+(rc.top-ro.top).toFixed(2)
					+" Δsize="+(rc.width-ro.width).toFixed(2)+"x"+(rc.height-ro.height).toFixed(2)+" | INT freeze="+_freezeOverlay.width+"x"+_freezeOverlay.height+" ruffle="+_c.width+"x"+_c.height+" cssW="+getComputedStyle(_c).width+" cssH="+getComputedStyle(_c).height);
			}
		}catch(e){}
		_freezeOverlay.parentNode.removeChild(_freezeOverlay);
		_dbg("freeze: overlay removed");
		}
	_freezeOverlay=null;
	_freezeSourceFile=null;
	}

// ============================================================
// ★z34: ロード/セーブ画面に入る前の画面(立ち絵+背景)をスナップショット保存し、
//   キャンセルで戻ったら再ロード(setposs→#ccccccステージ経由)せずそのまま貼り直す。
//   篠原案: 「ロード前の状態を保持→戻ったら出す」。再ロード不要＝#cccccc露出/settle待ちゼロ。
// ============================================================
var _loadReturnSnapshot=null;
var _loadReturnNowgrp=-1;
var _loadReturnSWFFile=null;
var _loadReturnBgJpeg="";
var _loadReturnHasScene=false;
var _loadReturnFaceShown=false;	// ★z35: ロード前に顔が出ていたか
var _currentFrameCount=0;		// ★z120: 現在表示中SWFのフレーム数(ロード戻りのアニメ頭出し判定用)

function _saveSceneForLoadReturn()
	{
	var canvas=_getFlashCanvas();
	var bgImg=document.getElementById("BG_LAYER");
	var jpgImg=document.getElementById("MAINW_JPEG");
	var w=512,h=360,snap,ctx;
	snap=document.createElement("canvas");
	snap.width=w;snap.height=h;
	try{ctx=snap.getContext("2d");}
	catch(e){_dbg("save scene: getContext failed: "+e.message);_loadReturnHasScene=false;return;}
	// ★z116: 各drawImageを個別try/catchで囲む。1つが例外(tainted canvasのSecurityError等)で落ちても
	//   全損(_loadReturnHasScene=false→PF3offがrevpos→setposs再ロードに転落し▶/黒/音楽画面)させず、
	//   焼けたぶん(最低BG_LAYER)のpartial snapshotを必ず残す。「復元がfallbackに落ちない」のが要点。
	try{if (bgImg && bgImg.style.display!=="none" && bgImg.complete) ctx.drawImage(bgImg,0,0,w,h);}
	catch(e){_dbg("save scene: bg drawImage failed: "+e.message);}
	try{_drawBgTintOverlay(ctx,w,h);}
	catch(e){_dbg("save scene: tint failed: "+e.message);}
	try{if (jpgImg && jpgImg.style.display!=="none" && jpgImg.complete) ctx.drawImage(jpgImg,0,0,w,h);}
	catch(e){_dbg("save scene: jpeg drawImage failed: "+e.message);}
	// ★z115: bg only(_currentSWFFile=null=選択肢/日付画面)では立ち絵SWF無し→freeze/canvasは前シーン残骸(青い絵等)なので焼かない(かぶり防止)
	try{
		if (_currentSWFFile && _freezeOverlay) ctx.drawImage(_freezeOverlay,0,0,w,h);	// 立ち絵freezeを優先(描画済みの確実な絵)
		else if (_currentSWFFile && canvas) ctx.drawImage(canvas,0,0,w,h);				// freeze無ければ生Ruffle
		}
	catch(e){_dbg("save scene: char drawImage failed: "+e.message);}
	_loadReturnSnapshot=snap;
	_loadReturnNowgrp=(typeof nowgrp!=="undefined")?nowgrp:-1;
	_loadReturnSWFFile=_currentSWFFile;
	_loadReturnBgJpeg=_currentBgJpeg;
	_loadReturnHasScene=true;
	// ★z35: ロード画面の間だけ顔をface_000(デフォルト)に差し替え。nowfaceは保持し戻りでfacedrawで復元
	if (FACE_PLAYER && FACE_PLAYER.style.display!=="none")
		{
		_loadReturnFaceShown=true;
		FACE_PLAYER.src=FACE_PNG_DIR+"face_000.png";
		}
	else _loadReturnFaceShown=false;
	_dbg("scene saved for load-return: F"+_loadReturnNowgrp+" "+_loadReturnSWFFile+" bg="+_loadReturnBgJpeg+" face="+(_loadReturnFaceShown?"shown→000":"hidden"));
	}

function _restoreSceneFromLoadReturn()
	{
	if (!_loadReturnHasScene || !_loadReturnSnapshot) return false;
	// 既存freeze(ロード画面用)を除去し、保存スナップショットをfreeze overlay(z2)として貼り直す
	_unfreezePlayer();
	var snap=_loadReturnSnapshot;
	snap.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;";
	if (FLASH_PLAYER && FLASH_PLAYER.parentNode)
		{
		FLASH_PLAYER.parentNode.insertBefore(snap,FLASH_PLAYER.nextSibling);
		_freezeOverlay=snap;
		_freezeSourceFile=_loadReturnSWFFile;
		}
	// 状態も戻す。次のklikで通常のsetposs→新SWFロードでfreezeはatomic置換される
	nowgrp=_loadReturnNowgrp;
	_currentSWFFile=_loadReturnSWFFile;
	if (_loadReturnBgJpeg)
		{
		_currentBgJpeg=_loadReturnBgJpeg;
		var img=document.getElementById("BG_LAYER");
		if (!img){_initBgLayer();img=document.getElementById("BG_LAYER");}
		if (img){img.src=JPEG_DIR+_loadReturnBgJpeg;img.style.display="block";}
		var mainDiv=document.getElementById("MAINW");
		if (mainDiv) mainDiv.style.background="transparent";
		}
	if (FLASH_PLAYER){FLASH_PLAYER.style.visibility="hidden";FLASH_PLAYER.style.opacity="0";}	// 再ロードしないのでFlash実体は隠す(snapshotが見える)
	_loadReturnSnapshot=null;
	_loadReturnHasScene=false;
	// ★z35: 顔を元(nowface)に戻す。facedrawがnowfaceのface_XXX.pngを再表示
	if (_loadReturnFaceShown && typeof facedraw==="function") facedraw();
	_loadReturnFaceShown=false;
	_dbg("scene restored from load-return: F"+nowgrp+" "+_currentSWFFile);
	return true;
	}

function _isAnimatingForLoadReturn()
	{
	// ★z120: ロード画面に入る時点で「アニメSWF再生途中」か。trueならPF3offで戻る時、snapshot静止画でなく
	//   そのアニメSWFを頭から再ロード(setposs)して再生し直す(「最初から」でOK・篠原)。静止/完了済みはfalse=従来snapshot。
	if (_currentFrameCount<=1 || _completionFired || !FLASH_PLAYER) return false;
	try{ return !!FLASH_PLAYER.isPlaying; }catch(e){ return false; }
	}

function _resetSceneForOmakeReplay()
	{
	// ★z36: おまけのED鑑賞(omake1go)を2回目以降再生する際、前回ED末尾のfreeze/char/SWF状態が残り、
	//    no-charフレーム(F188等=skip freezeでfreeze維持)ではクリアされず「charが切り替わらない」問題を防ぐ。
	//    ED再生開始前に freeze overlay と char/SWFトラッキングを明示リセットしてクリーンスタートさせる。
	_unfreezePlayer();
	_currentCharId=null;
	_currentSWFFile=null;
	_cancelPlaybackDetection();
	_dbg("scene reset for omake ED replay");
	}

// ============================================================
// デバッグオーバーレイ（F2トグル）
// ============================================================
var _dbgVisible=false;
var _dbgLines=[];
var _dbgMax=80;
var _dbgEl=null;
function _dbg()
	{
	var msg=Array.prototype.slice.call(arguments).join(" ");
	_dbgLines.push(msg);
	if (_dbgLines.length>_dbgMax) _dbgLines.shift();
	if (_dbgVisible) _dbgRender();
	}
function _dbgRender()
	{
	if (!_dbgEl)
		{
		_dbgEl=document.createElement("div");
		_dbgEl.id="DBG_OVERLAY";
		_dbgEl.style.cssText="position:fixed;top:0;left:0;width:640px;height:480px;background:rgba(0,0,0,0.8);color:#0f0;font:9px monospace;padding:4px;overflow-y:auto;z-index:9999;white-space:pre-wrap;pointer-events:none;";
		document.body.appendChild(_dbgEl);
		}
	_dbgEl.textContent=_dbgLines.join("\n");
	_dbgEl.scrollTop=_dbgEl.scrollHeight;
	}
function _dbgToggle()
	{
	_dbgVisible=!_dbgVisible;
	if (_dbgVisible) _dbgRender();
	else if (_dbgEl) _dbgEl.style.display="none";
	if (_dbgVisible && _dbgEl) _dbgEl.style.display="block";
	}
document.addEventListener("keydown",function(e){
	if (e.keyCode===113) _dbgToggle();	// F2
	});

// --- パス定数 ---
var SWF_GAME_DIR="../swf/split_game/";
var SWF_FACE_DIR="../swf/split_face/";
var FACE_PNG_DIR="../swf/face_png/";
var FACE_PNG_OVERRIDE_MAP={
	51:57,
	50:57,
	44:38,
	42:36
	};
var JPEG_DIR="../swf/extracted_jpeg/";

// ============================================================
// Ruffleオレンジ再生ボタン強制非表示
// SWF内stop()到達時にRuffleがplay overlayを表示する問題の対策
// shadowRoot内にCSSを注入して.play-buttonを非表示に
// ============================================================
function _injectPlayButtonHide(player)
	{
	if (!player) return;
	var attempts=0;
	function tryInject()
		{
		var sr=player.shadowRoot;
		if (!sr)
			{
			if (++attempts<50) setTimeout(tryInject,100);
			return;
			}
		// 既存のスタイルがあっても強制再注入（pause後のshadowRoot再構築対策）
		var existing=sr.querySelector("#ac_hide_play");
		if (existing) existing.remove();
		var s=document.createElement("style");
		s.id="ac_hide_play";
		// .play-button + コンテナ内のSVG再生アイコン等を広範囲で潰す
		s.textContent=":host{background:transparent!important}.play-button,.pause-overlay,.overlay,button[title*='Play'],button[aria-label*='Play'],button[title*='play'],button[aria-label*='play'],[class*='play-button'],[class*='pause-overlay'],[part='play-button'],[part='pause-overlay']{display:none!important;pointer-events:none!important;opacity:0!important;visibility:hidden!important;width:0!important;height:0!important}canvas,div,section,main{background-color:transparent!important}";
		sr.appendChild(s);
		// MutationObserver: 後から追加されるplay-buttonも即座に隠す
		if (!player._pbObserver)
			{
			player._pbObserver=new MutationObserver(function(mutations){
				for(var i=0;i<mutations.length;i++)
					{
					var added=mutations[i].addedNodes;
					for(var j=0;j<added.length;j++)
						{
						var node=added[j];
						if (node.nodeType===1)
							{
							if (node.classList && (node.classList.contains("play-button")||node.classList.contains("pause-overlay")))
								{node.style.display="none";node.style.visibility="hidden";node.style.opacity="0";}
							if (node.querySelectorAll)
								{
								var hidden=node.querySelectorAll(".play-button,.pause-overlay,.overlay,[part='play-button'],[part='pause-overlay'],button[title*='Play'],button[aria-label*='Play'],button[title*='play'],button[aria-label*='play'],[class*='play-button'],[class*='pause-overlay']");
								for(var h=0;h<hidden.length;h++)
									{hidden[h].style.display="none";hidden[h].style.visibility="hidden";hidden[h].style.opacity="0";}
								}
							}
						}
					}
				});
			player._pbObserver.observe(sr,{childList:true,subtree:true});
			}
		}
	tryInject();
	}

// load()/pause()後にshadowRootが再構築される場合の再注入
function _reinjectPlayButtonHide(player)
	{
	if (!player) return;
	// Ruffleのpause()→play-button表示はタイミングが不定
	// 複数回リトライして確実に潰す
	var delays=[50,100,200,400,800,1500];
	for(var i=0;i<delays.length;i++)
		{(function(d){setTimeout(function(){_injectPlayButtonHide(player);},d);})(delays[i]);}
	}

// ============================================================
// SWF切替時スクリーンショットオーバーレイ
// Ruffleのload()は旧SWFを即破棄→新SWF描画完了まで黒フレーム
// → 切替前にcanvasキャプチャを上に被せ、描画安定後に除去
// ============================================================
var _gameOverlay=null;
var _gameOverlayTimer=null;
// (face overlay変数: PNG方式移行に伴い不要)

function _captureOverlay(player,parentEl,w,h)
	{
	// Ruffle canvas だけでなく BG_LAYER / MAINW_JPEG も重ねて、
	// 実際に見えている合成結果に近い静止画を作る
	var canvas=null,bgImg=null,jpgImg=null,drawn=false;
	try{
		// shadowRoot内のcanvas
		if (player.shadowRoot) canvas=player.shadowRoot.querySelector("canvas");
		// フォールバック: 直下のcanvas
		if (!canvas) canvas=player.querySelector("canvas");
		}
	catch(e){}
	bgImg=document.getElementById("BG_LAYER");
	jpgImg=document.getElementById("MAINW_JPEG");
	if (!canvas && !bgImg && !jpgImg) return null;

	// キャプチャ用canvasに描画
	var ov=document.createElement("canvas");
	ov.width=w;ov.height=h;
	ov.style.cssText="position:absolute;top:0;left:0;width:"+w+"px;height:"+h+"px;z-index:10;pointer-events:none;";
	try{
		var ctx=ov.getContext("2d");
		if (bgImg && bgImg.style.display!=="none" && bgImg.complete)
			{
			ctx.drawImage(bgImg,0,0,w,h);
			_drawBgTintOverlay(ctx,w,h);
			drawn=true;
			}
		if (jpgImg && jpgImg.style.display!=="none" && jpgImg.complete)
			{
			ctx.drawImage(jpgImg,0,0,w,h);
			drawn=true;
			}
		if (canvas)
			{
			ctx.drawImage(canvas,0,0,w,h);
			drawn=true;
			}
		}
	catch(e){return null;}
	if (!drawn) return null;
	parentEl.appendChild(ov);
	return ov;
	}

function _captureBackgroundOverlay(parentEl,w,h)
	{
	var bgImg=document.getElementById("BG_LAYER");
	var jpgImg=document.getElementById("MAINW_JPEG");
	var drawn=false;
	var ov,ctx;
	if (!bgImg && !jpgImg) return null;
	ov=document.createElement("canvas");
	ov.width=w;ov.height=h;
	ov.style.cssText="position:absolute;top:0;left:0;width:"+w+"px;height:"+h+"px;z-index:10;pointer-events:none;";
	try{
		ctx=ov.getContext("2d");
		if (bgImg && bgImg.style.display!=="none" && bgImg.complete)
			{
			ctx.drawImage(bgImg,0,0,w,h);
			_drawBgTintOverlay(ctx,w,h);
			drawn=true;
			}
		if (jpgImg && jpgImg.style.display!=="none" && jpgImg.complete)
			{
			ctx.drawImage(jpgImg,0,0,w,h);
			drawn=true;
			}
		}
	catch(e){return null;}
	if (!drawn) return null;
	parentEl.appendChild(ov);
	return ov;
	}

function _removeOverlay(ov,delay)
	{
	if (!ov) return null;
	return setTimeout(function(){
		if (ov.parentNode) ov.parentNode.removeChild(ov);
		},delay);
	}

// --- Ruffle player参照 ---
function _clearGameOverlay()
	{
	if (_gameOverlayTimer)
		{
		clearTimeout(_gameOverlayTimer);
		_gameOverlayTimer=null;
		}
	if (_gameOverlay&&_gameOverlay.parentNode)
		_gameOverlay.parentNode.removeChild(_gameOverlay);
	_gameOverlay=null;
	}
var FLASH_PLAYER=null;   // game用
var FACE_PLAYER=null;    // face用

// --- 再生状態 ---
var nowgrp=0;
var drawsts=false;
var nowface=0;
var _playbackTimer=null;
var _completionFired=false;
var _skipForceStoppedFrame=null;	// ★z206: Enter個別停止から同じsetposs内のloadへ対象frameを引き渡す
var _completionSettleRaf=0;
var _completionSettleToken=0;
var _completionSettleCanvas=null;

// --- FRAME_TO_SWF 範囲検索 ---
// num以下の最大キーを探し、endFrame >= num ならヒット
var _swfKeys=null;
function _findSWF(num)
	{
	// 完全一致（高速パス）
	var exact=FRAME_TO_SWF[num];
	if (exact) {exact._key=num;return exact;}
	// キー配列キャッシュ（初回のみ生成）
	if (!_swfKeys)
		{
		_swfKeys=[];
		for(var k in FRAME_TO_SWF){if(FRAME_TO_SWF.hasOwnProperty(k))_swfKeys.push(parseInt(k,10));}
		_swfKeys.sort(function(a,b){return a-b;});
		}
	// 二分探索: num以下の最大キー
	var lo=0,hi=_swfKeys.length-1,best=-1;
	while(lo<=hi)
		{
		var mid=(lo+hi)>>>1;
		if(_swfKeys[mid]<=num){best=mid;lo=mid+1;}
		else hi=mid-1;
		}
	if (best<0) return null;
	var key=_swfKeys[best];
	var info=FRAME_TO_SWF[key];
	if (info && info.endFrame>=num) {info._key=key;return info;}
	return null;
	}

// ============================================================
// 初期化 (bootup → bootcheck → bootstep)
// ============================================================
function bootup()
	{
	InitMusic();
	_initRufflePlayers();
	}

function _initRufflePlayers()
	{
	var ruffle=window.RufflePlayer;
	if (!ruffle)
		{
		setTimeout(_initRufflePlayers,200);
		return;
		}
	var newest=ruffle.newest();

	// game player
	var mainDiv=document.getElementById("MAINW");
	FLASH_PLAYER=newest.createPlayer();
	FLASH_PLAYER.style.width="512px";
	FLASH_PLAYER.style.height="360px";
	FLASH_PLAYER.style.position="absolute";
	// ★z57: top/leftを明示(0)。未指定(auto)だとposition:absoluteでも「静的配置の位置」を基準にするため、
	//   display:none→""(SWF初表示時のFlash復帰)のたびに静的位置が再計算され、canvasが数pxズレる。
	//   freeze(ov)はtop:0 left:0固定なので、立ち絵SWFが初めて出る瞬間だけ両者がズレて「char少し動く」(篠原報告)。
	//   既にSWF表示中はdisplay維持→再計算が起きず動かない、という観察とも一致。原点固定でズレ解消。
	FLASH_PLAYER.style.top="0";
	FLASH_PLAYER.style.left="0";
	FLASH_PLAYER.style.zIndex="1";
	mainDiv.appendChild(FLASH_PLAYER);
	_injectPlayButtonHide(FLASH_PLAYER);

	// face player → PNG img方式（Ruffle不使用）
	var faceDiv=document.getElementById("FACEW");
	FACE_PLAYER=document.createElement("img");
	FACE_PLAYER.style.width="100px";
	FACE_PLAYER.style.height="100px";
	FACE_PLAYER.style.display="none";
	faceDiv.appendChild(FACE_PLAYER);

	bootcheck();
	}

// ★z206: Enter連打による連続load描画不能の個別対策。
//   確認済みのF4500-F4502/F4520-F4529/F4862-F4863へ入る時、前SWFが未完走またはEnter個別停止経由なら
//   壊れた連続load状態を引き継がないようgame用Ruffle playerだけを新品へ交換する。他フレームでは呼ばれない。
var Z206_RECREATE_ON_BUSY_FRAMES={
	4500:true,4501:true,4502:true,4520:true,4521:true,4522:true,4523:true,4524:true,
	4525:true,4526:true,4527:true,4528:true,4529:true,4862:true,4863:true
	};
function _recreateGamePlayerForBusyFrame(frameNum,file)
	{
	var oldPlayer=FLASH_PLAYER;
	var mainDiv=document.getElementById("MAINW");
	var newest,newPlayer;
	if (!oldPlayer || !mainDiv || !window.RufflePlayer) return false;
	try{
		newest=window.RufflePlayer.newest();
		newPlayer=newest.createPlayer();
		newPlayer.style.cssText=oldPlayer.style.cssText;
		newPlayer.style.display="";
		newPlayer.style.visibility="visible";
		newPlayer.style.opacity="1";
		mainDiv.appendChild(newPlayer);
		FLASH_PLAYER=newPlayer;
		_injectPlayButtonHide(newPlayer);
		try{if (oldPlayer._pbObserver) oldPlayer._pbObserver.disconnect();}catch(e){}
		try{oldPlayer.pause();}catch(e){}
		if (oldPlayer.parentNode) oldPlayer.parentNode.removeChild(oldPlayer);
		_dbg("z206: recreated game player for busy Enter transition F"+frameNum+" → "+file);
		return true;
		}
	catch(e)
		{
		if (newPlayer && newPlayer.parentNode) newPlayer.parentNode.removeChild(newPlayer);
		FLASH_PLAYER=oldPlayer;
		_dbg("z206: player recreation failed F"+frameNum+":",e);
		return false;
		}
	}

function bootcheck()
	{
	// Ruffle player準備完了 → BG_LAYER初期化 → JPEGプリロード → bootstep
	_initBgLayer();
	_preloadBgJpegs();
	bootstep();
	}

// ============================================================
// 背景JPEGプリロード（案A: 黒フレーム防止の前提条件）
// img.srcで初回デコードコスト発生→事前キャッシュで即表示保証
// ============================================================
var _preloadedJpegs={};
function _preloadBgJpegs()
	{
	// FRAME_TO_BG_JPEGから一意なファイル名を収集
	var seen={};
	for(var k in FRAME_TO_BG_JPEG)
		{
		if(!FRAME_TO_BG_JPEG.hasOwnProperty(k)) continue;
		var f=FRAME_TO_BG_JPEG[k];
		if(!seen[f])
			{
			seen[f]=true;
			var img=new Image();
			img.src=JPEG_DIR+f;
			_preloadedJpegs[f]=img;
			}
		}
	_dbg("preloaded BG JPEGs:",Object.keys(seen).length);
	}

function bootstep()
	{
	// SEF1/SEF2は削除済み（SE HTML5 Audio化済み）
	bootsys();	// sys.js
	}

// ============================================================
// setposs(num) — メイン画面制御
// ============================================================
var _f6120SlideEnd=0;
function setposs(num,force)
	{
	drawsts=false;
	// ★z151: 篠原指示「白スライド(F6120,101フレーム≈8.4秒)を最後まで見せる」。F6120ロードで完成予定時刻を記録し、
	//   #V6220(setposs 6220)がその前に来たら(ユーザーがセリフを速く送った)、白スライド完成までF6220のロードを遅延する。
	//   こうするとchar476の白い板が最後まで降りきってから次へ進む=フェードが途中で切れない。
	if (num===6120) _f6120SlideEnd=performance.now()+Math.ceil(101/_effectiveAssumedFps()*1000)+150;
	if (num===6220 && _f6120SlideEnd && performance.now()<_f6120SlideEnd)
		{
		var _remain=_f6120SlideEnd-performance.now();
		_dbg("F6220 delayed "+Math.round(_remain)+"ms until F6120 white-slide completes (z151)");
		setTimeout(function(){
			_f6120SlideEnd=0;
			// ★z156: 白スライド完成したF6120のcanvasをここでfreeze(z2)化してから次へ。これをしないと
			//   setposs(6220)内の_clearFlashCanvas(canvasクリア)でBG_LAYER(char474=ダイバー)が一瞬露出する。
			//   白freezeで覆ってから切替→2432分岐がそのfreezeを維持→F6220settleで白に更新。canvasは隠さない(白を維持)。
			if (_currentSWFFile==="game_F6120.swf" && typeof _freezePlayer==="function")
				{_freezePlayer(_currentSWFFile);_dbg("z156: F6120 white frozen before F6220 load");}
			setposs(6220);
			},_remain);
		return;
		}
	nowgrp=num;
	// ★特別付録(80.dat Line0 #v5930)のタイトル画面F5930は「おまけモード」EditText(useOutlines=0)が
	//   文字化けする([[help-save-overlay]]同型/注入不可)。既存の_omakeOverlay(char402背景+「おまけモード」HTML)で
	//   覆って隠す。F5930以外(小噺/あとがき本文の#v4889等)に進んだら隠して本文の絵を見せる。
	if (typeof _showOmakeOverlay==="function")
		{
		if (num===5930) _showOmakeOverlay();
		// ★おまけモード(F5930)→イベントCG等へ遷移する瞬間、覆い(_omakeOverlay)を即外すと、新フレーム(F2770等)が
		//   settleする前(約0.3秒)に前のF5930 canvas残骸(「おまけモード」文字化け)が露出する(篠原報告)。
		//   外すのを0.5秒遅らせ、CGが描画されてから外す(表示中の時だけ遅延hide。非表示時は何もしない)。
		else if (typeof _delayHideOmakeOverlay==="function") _delayHideOmakeOverlay(500);
		else if (typeof _hideOmakeOverlay==="function") _hideOmakeOverlay();
		}
	// ★SLG作業ムービー再再生(篠原指示): 教授と凪が同じ作業だと setposs(同フレーム)が_loadGameSWFのsame-fileスキップに
	//   引っかかり凪側が再生されない。force時は_currentSWFFileをクリアしてsame-fileスキップを回避し、各1回ずつ再生させる。
	if (force && typeof _currentSWFFile!=="undefined") _currentSWFFile="";
	// ★ セーブ/ロード画面中はSWF切替をブロック（PF2on()ホバー時の明滅防止）
	// PF2()内のsetposs(74)はその時点でnowwin="none"なので通過する
	if (typeof nowwin!=="undefined" && (nowwin==="save"||nowwin==="load"))
		{
		_dbg("setposs blocked: nowwin="+nowwin+" num="+num);
		return;
		}
	// ★z99: skip(Enter高速送り)中にこの特例フレームへ来たら、強制的にskipを切り通常(クリック/Ctrl)経路に合流させる。
	//   こうすると下の`if(skip)return`を通過して_loadGameSWFまで走り、背景込みcanvasが再描画され背景char.jpgが
	//   正しく切り替わる(z97はBG_LAYERだけ更新したが前面の古いcanvasに隠れて見えなかった)。enterは1コマ送りになる。
	if (typeof skip!=="undefined" && skip && typeof SKIP_FORCE_STOP_FRAMES!=="undefined" && SKIP_FORCE_STOP_FRAMES[num])
		{
		_skipForceStoppedFrame=num;
		skip=false;
		_dbg("skip force-stop at F"+num+" (z99: enter→クリック扱い)");
		}
	// ★z97: 背景char.jpg(BG_LAYER)の更新はskip(Enter高速送り)中も行う。従来は下のskip早期returnの後に_updateBgLayerが
	//   あったため、enter skip中は背景char.jpgが切り替わらなかった(ctrl=nowskip/クリック=kickはskip=falseで通過し更新できていた)。
	//   SWF(立ち絵/アニメ)切替はskip中スキップのまま(明滅防止/高速)だが、背景char.jpgはskipでも切り替える。num===370
	//   (manual fade)は従来通りここで更新せず_startManualSceneFade内に任せる(z65)。
	if (_sunsetBgHoldActive && (num===_sunsetBgHoldReleaseFrame || _sunsetBgHoldExtraReleaseFrames[num]))
		_clearSunsetBgHold();
	if (_sunsetBgHoldActive)
		_maintainSunsetBgHold();
	else if (num!==370)
		_updateBgLayer(num);
	if (typeof skip!=="undefined" && skip) return;
	// ★日付遷移はSWFアニメで見せるため、オーバーレイ化(_startDayTransition)を無効化し通常SWFロードに任せる
	if (false && (DAY_TRANSITION_DATE_FRAMES[num]||DAY_TRANSITION_WEATHER_FRAMES[num]))
		{
		_dbg("setposs day transition:",num);
		if (_startDayTransition(num))
			{
			drawsts=true;
			return;
			}
		}

	// ★z97: 背景レイヤー更新は上(skip return前)へ移動済み(skip中も背景char.jpgを切り替えるため)。num===370(manual fade)を
	//   除外するz65の意図も上で維持(num!==370のときだけ_updateBgLayer)。重複setposs(2回目)の吸収も従来通り。

	// EDマッピング
	var edInfo=ED_FRAME_MAP[num];
	if (edInfo)
		{
		_dbg("setposs ED:",num,"→",edInfo.file);
		_hideBgLayer(); // EDはF0-199外→背景レイヤー不要
		_loadGameSWF(edInfo.file,4);
		_showEdOverlay(edInfo.edNumber);
		drawsts=true;
		return;
		}

	// 通常SWFマッピング（範囲検索: num以下の最大キーを探す）
	var info=_findSWF(num);
	if (info)
		{
		if (num===370)
			{
			// ★z67: 一日目のSLG突入だけフェード元をchar006固定(篠原指示)。判定はr確実なschedule.js(menu02)側で
			//   window.__slgFadeC6に立て、ここで参照する。z66はsetposs内でr[0]==2を直接見たが、M.setposs経由で
			//   r[0]が変わるかスコープ問題でfalseになりfadeFrom=nullに化けた(ログ「(通常snapshot)」で判明)。
			var r0dbg=(typeof r!=="undefined" && r)?r[0]:"undef"; // 原因究明用
			var fadeFrom=(typeof window!=="undefined" && window.__slgFadeC6)?"char006.jpg":null;
			_dbg("setposs manual fade:",num,"[flag="+(typeof window!=="undefined"?window.__slgFadeC6:"?")+" setposs内r[0]="+r0dbg+"]",fadeFrom?("一日目特例 from "+fadeFrom):"(通常snapshot)");
			_hideEdOverlay();
			_startManualSceneFade(370,1330,fadeFrom);
			drawsts=true;
			return;
			}
		if (num===620)
			{
			_dbg("setposs sunset html fade:",num);
			_hideEdOverlay();
			_currentCharId=null;
			_currentSWFFile=null;
			_beginSunsetBgHoldTransition();
			drawsts=true;
			return;
			}
		_dbg("setposs SWF:",num,"→",info.file,"(key:",info._key+")");
		_hideEdOverlay();
		// ★ char_id比較: 同じ立ち絵ならfreezeを維持（明滅防止）
		var newCharId=(num<200)?FRAME_TO_CHAR_ID[num]:null;
		var sameChar=(newCharId!==undefined && newCharId!==null && newCharId===_currentCharId);
		_currentCharId=(newCharId!==undefined)?newCharId:null;
		// ★ skip時の立ち絵リンガリング対策([[bg-jpeg-skip-lag-bug]]): F0-199でキャラ定義なし
		//    (FRAME_TO_CHAR_ID[num]===undefined)のフレームでは古いfreeze overlayを即クリア。
		//    settle(最大700ms)を待つと skip 25ms/行ではキャラが長時間残る。
		//    skip中のみ。
		// ★z32: CLEAR_FREEZE_ON_NOCHAR_FRAMES登録(9/16/21/23/163=選択肢/特殊画面で描画物が無いframe)は
		//    skip外の通常遷移でも setposs時点で即クリア。これらは中身が空(F0021=PlaceObject char5だけでJPEG/Shape/Sprite無し)
		//    でRuffleがno-render→settleが700msでtimeoutするまで前の立ち絵freezeが残る(篠原報告「登場人物SWFが1秒未満残る」)。
		if (num<200 && newCharId===undefined && _freezeOverlay
			&& ((typeof nowskip!=="undefined"&&nowskip)||(typeof skip!=="undefined"&&skip)||CLEAR_FREEZE_ON_NOCHAR_FRAMES[num]))
			{
			_unfreezePlayer();
			_dbg("clear stale char freeze early at no-char F"+num+(CLEAR_FREEZE_ON_NOCHAR_FRAMES[num]?" (menu/no-render)":" (skip)"));
			}
		_loadGameSWF(info.file,info.frames,sameChar);
		drawsts=true;
		return;
		}

	// 静止画: JPEG表示
	_dbg("setposs JPEG:",num);
	_unfreezePlayer();
	_currentSWFFile=null;
	_hideEdOverlay();
	_hideBgLayer();
	_showJpeg(num);
	drawsts=true;
	}

// ============================================================
// revpos(sts,num) — 状態復元時の再表示
// ============================================================
function revpos(sts,num)
	{
	setposs(num);
	}

// ============================================================
// getsts() — 再生中判定
// ============================================================
function getsts()
	{
	if (!FLASH_PLAYER) return false;
	try{return FLASH_PLAYER.isPlaying;}catch(e){return false;}
	}

// ============================================================
// getpos() — 現在フレーム（Step 9差替え完了 z33）
// ★旧スタブは常に _omake2Cursor(7664) を返していた。PF3(LOAD)/PF7(HELP)起動時の
//   状態保存 PF2pos/PF7Frame=getpos() が 7664 になり、キャンセル(PF3off/PF7off)の
//   revpos→setposs(7664)→_findSWFでF7619(EDロール)が誤発火し、元画面にも戻れなかった。
//   現在表示中フレーム nowgrp を返す。omake2は _omake2Cursor を直接使うので getpos 非依存。
// ============================================================
var _omake2Cursor=7664;
function getpos()
	{
	return (typeof nowgrp!=="undefined" && nowgrp>=0)?nowgrp:0;
	}

// ============================================================
// face(num) — 顔グラフィック表示
// ============================================================
function face(num)
	{
	nowface=num;
	if (typeof skip!=="undefined" && skip) return;
	facedraw();
	}

function facedraw()
	{
	var resolved,pad;
	if (!FACE_PLAYER) return;
	if (nowface<0)
		{
		facehide();
		return;
		}
	resolved=FACE_PNG_OVERRIDE_MAP.hasOwnProperty(nowface)?FACE_PNG_OVERRIDE_MAP[nowface]:nowface;
	pad=String(resolved);
	while(pad.length<3) pad="0"+pad;

	// ★ PNG即表示（Ruffle不使用→ちらつきなし）
	FACE_PLAYER.src=FACE_PNG_DIR+"face_"+pad+".png";
	FACE_PLAYER.style.display="block";
	ShowLayer("RAY2A");
	}

function facehide()
	{
	if (!FACE_PLAYER) return;
	FACE_PLAYER.style.display="none";
	}

// ============================================================
// opmovie() — OP再生
// ============================================================
function opmovie()
	{
	// ★z102: タイトルロゴ(F5012)表示の唯一の入口。通常起動もED復帰(_restartTitleAsStartup→gotitle→opmovie)もここを通る。
	//   enter skipでED突入→クリックで飛ばしてタイトルに戻ると「上半分黒・ロゴ崩れ」になる件の対処。
	//   真因: F5012は自前背景を持たない(num>=200)ためsetposs→_updateBgLayer(5012)がz22ロジックで_currentBgJpegを「維持」する。
	//   通常起動は_currentBgJpegが空→黒だが、ED経由だとED roll背景char006(ENDING ROLL bg direct)が残って維持され、タイトルに
	//   海背景が残骸として残る。→ここで_hideBgLayerして_currentBgJpegを""にし、通常起動と同じBG_LAYER黒の状態でF5012を出す。
	//   _ensureFlashPlayerVisibleはFLASH visibleの保証(ED演出でhidden/pauseになっていた場合の保険、通常起動では無害)。
	// ★z106: ED roll中にenter skip(Enter)を押すとskip=trueが立ち、クリックで飛ばす→_restartTitleAsStartup→gotitle→opmovie→
	//   setposs(5012)までskip=trueが持ち越される(_restartTitleAsStartupはexitprocessと違いskipをリセットしない)。setposs(5012)は
	//   skip=trueだとif(skip)return(line1919)で早期returnし、OPアニメ(F5012)が正しくロード/再生されない(篠原「ED中にenter skip
	//   押してるのがダメ?」で判明)。タイトル復帰時はskip不要なのでここで解除する。skipはsys.jsのグローバル(z99と同じく書込可)。
	if (typeof skip!=="undefined" && skip) {skip=false;_dbg("opmovie: cleared leftover skip (z106)");}
	if (typeof window!=="undefined" && window._ed1Active) {window._ed1Active=false;_dbg("opmovie: cleared _ed1Active (ED1終了でEnter skip禁止解除)");}	// ★ED1のEnter skip禁止をタイトル復帰で解除
	if (typeof _hideBgLayer==="function") _hideBgLayer();
	// ★z161: ED→タイトル復帰時、FLASH canvas(z1)にED9(F7721=key4909)等の絵の残骸が残ったままvisible化される。
	//   setposs(5012)の_loadGameSWFがその残骸をfreezeにキャプチャし、F5012(OP)描画まで一瞬表示する(篠原報告「ED9→タイトルで一瞬バグ背景」)。
	//   z102の_hideBgLayerはBG_LAYER(z0)だけでcanvas残骸は消えない。visible化の前にcanvasをクリアして残骸を消す(通常起動と同じ黒からF5012が出る)。
	if (typeof _clearFlashCanvas==="function") _clearFlashCanvas();
	if (typeof _ensureFlashPlayerVisible==="function") _ensureFlashPlayerVisible();
	setposs(5012);
	// ★z103は撤回(play()保証)。実機でplay()が効かず(F5012 timeout継続)＝pause引きずりではなく、enter skipで白シーンを
	//   高速通過した際にFLASH_PLAYERが「visible復帰しても再生されない」死状態になるのが真因(ED突入F7742/roll F7619/
	//   タイトルF5012が一連でtimeout)。F7490(船)と同根。対処は白シーンをenter skipで通らせない方向([[bg-jpeg-skip-lag-bug]])。
	}

// ============================================================
// newgame() / loadgame() — ゲーム開始
// ============================================================
async function newgame()
	{
	var i,mainDiv;
	_clearTitleIntro();
	if (_gameOverlayTimer) {clearTimeout(_gameOverlayTimer);_gameOverlayTimer=null;}
	if (_gameOverlay&&_gameOverlay.parentNode) _gameOverlay.parentNode.removeChild(_gameOverlay);
	_gameOverlay=null;
	mainDiv=document.getElementById("MAINW");
	if (FLASH_PLAYER && mainDiv && !_freezeOverlay)
		{
		_gameOverlay=_captureOverlay(FLASH_PLAYER,mainDiv,512,360);
		if (_gameOverlay)
			{
			_gameOverlay.style.zIndex="9";
			_gameOverlayTimer=_removeOverlay(_gameOverlay,900);
			_dbg("newgame: cover current title OP before pause");
			}
		}
	// ★ 現在再生中のSWF（OP等）を即停止
	_cancelPlaybackDetection();
	_completionFired=true;
	if (FLASH_PLAYER) try{FLASH_PLAYER.pause();}catch(e){}
	_reinjectPlayButtonHide(FLASH_PLAYER);

	for(i=1;i<=60;i++) LF_FlashReg[i]="";
	// レジスタ・フラグ初期化
	for(i=0;i<=15;i++) reg[i]=0;
	for(i=0;i<=79;i++) flg[i]=0;
	reg[0]=1;	// ★ time=1開始（dat 0はreadfileで直接再生、case 1重複回避）
	reg[1]=100;	// ★ 教授HP初期値
	reg[2]=100;	// ★ 凪HP初期値
	nowgame="event";nowwin="";
	sfile="0";sstep=0;
	await readfile(0);
	}

function loadgame()
	{
	_clearTitleIntro();
	PF3();
	}

// ============================================================
// 内部: SWF読込＋再生完了検知
// wmode=transparent設定済み → SWF背景が透明
// → load()中canvasクリア=透明 → 下のBG_LAYERが見える
// → visibility制御/rAF/ポーリング一切不要
// ============================================================
var _currentSWFFile=null;
var _unfreezeTimer=null;
var _renderedUnfreezeRaf=0;	// ★z27: 描画検出unfreeze用rAFハンドル
var _renderedUnfreezeToken=0;	// ★z27: 描画検出unfreezeのキャンセル用トークン
// ★Ruffle想定再生fps。CONFIG「動作モード」(sys.js bootsys→PF4dsp)が_setAssumedFps経由で 標準=12 / 軽量=8 を設定する
//   (初期値はコア数で自動判定:6コア以下=軽量。以降ユーザーがCONFIGで変更可)。低性能PCはRuffleの実再生が遅く、12fps前提の
//   durationMs等がアニメ(フェード等)を実再生完了前にfreeze/完了させて霞む・立ち絵が描画前に次へ進み点滅する。想定fpsを
//   下げてタイマーを伸ばし、Ruffleの実再生完了と時間の帳尻を合わせる。
var _assumedFps=12;
window._setAssumedFps=function(f){ _assumedFps=(f>0)?f:12; if (typeof _dbg==="function") _dbg("assumedFps set to "+_assumedFps); return _assumedFps; };
// ★軽量モードの有効区間を「2日目早朝の強制イベント」だけに限定する(篠原指示。画像の開始=[SEQ.main]reg[0]=7→goevent、
//   終了=[SEQ.endevent]reg[0]=7→timegoesでreg[0]=8、で区切る)。reg[0]===7の間だけ_assumedFpsを適用し、それ以外
//   (SLG=reg[0]>=8 / 他の日 / OP等)は通常12fps。SLGパートで軽量にするとアニメが壊れるため、この区間に閉じ込める。
function _effectiveAssumedFps()
	{
	if (typeof reg!=="undefined" && reg && (+reg[0])===7) return _assumedFps;
	return 12;
	}
var _endingSequenceStage=0;
var _endingSequenceTimer=null;
var _endingTintOverlay=null;
var _endingTitleBgOverlay=null;
var _endingRollOverlay=null;
var _endingRollContent=null;
var _endingCurrentEdNumber=0;
var _endingTimelineMap=null;
var _endingTimelineMapPromise=null;
var _endingRollSections=null;
var _endingRollSectionsPromise=null;
var _endingRollDisplayDurationMs=0;
var _endingBackgroundTimers=[];

// ★ 追加: F0019のような「表示後すぐ消えるSWF」専用の早期freeze設定
var EARLY_FREEZE_SWFS={
	"game_F0019.swf":120,
	"game_F0026.swf":120
	};
var CLEAR_FREEZE_ON_NOCHAR_FRAMES={
	9:true,
	16:true,
	21:true,
	163:true,
	23:true,
	58:true	// ★8.dat #v58: char107(曇り空)のno char背景シーン。SLGのSWF(結果char169/F6080アニメ)が終わった後もそのfreezeが
		//   居座ってchar107を覆い「曇り空が見えない」(篠原報告)。no char時に前freezeを除去してchar107を露出させる
	};

function _loadGameSWF(file,frameCount,sameChar)
	{
	var nextFrameNum=typeof nowgrp!=="undefined"?nowgrp:null;
	var _z206ForcedEnter=(_skipForceStoppedFrame===nextFrameNum);
	_skipForceStoppedFrame=null;
	_pendingStaticBgToken++;
	_clearSaveTransitionPrecover();
	_clearSceneHoldOverlay();
	_clearDayTransitionOverlay();
	if (!_sunsetBgHoldActive) _clearManualFadeOverlay();
	else if (_manualFadeOverlay && nextFrameNum!==620)
		{
		if (_repaintOverlayWithCurrentBackground(_manualFadeOverlay))
			_dbg("sunset fade overlay repainted to current bg:",file,"F"+nextFrameNum);
		else
			{
			_clearManualFadeOverlay();
			_dbg("sunset fade overlay cleared on next scene:",file,"F"+nextFrameNum);
			}
		}
	_ensureFlashPlayerVisible();
	// ★ 同じSWFなら再load()しない（明滅防止）
	if (file===_currentSWFFile)
		{
		_dbg("load SKIP (same file):",file);
		return;
		}
	_currentSWFFile=file;
	_currentFrameCount=frameCount;	// ★z120: ロード戻りのアニメ頭出し判定用に保持
	if (!/^game_F7(619|7\d\d)\.swf$/.test(file||""))
		{
		_clearEndingSequenceTimer();
		_endingSequenceStage=0;
		_hideEndingTitleBgOverlay();
		_hideEndingTintOverlay();
		_hideEndingRollOverlay();
		}

	// ★ 同じ立ち絵（sameChar=true）ならSWFロード自体をスキップ
	// freeze overlayを維持したまま→明滅ゼロ
	if (sameChar)
		{
		_dbg("load SKIP (same char_id):",file);
		return;
		}

	// ★ sameChar=false: 通常ロード
	if (_unfreezeTimer) clearTimeout(_unfreezeTimer);
	_unfreezeTimer=null;
	_renderedUnfreezeToken++;	// ★z27: 進行中の描画検出unfreezeをキャンセル
	if (_renderedUnfreezeRaf) {cancelAnimationFrame(_renderedUnfreezeRaf);_renderedUnfreezeRaf=0;}

	_cancelPlaybackDetection();
	var _prevCharCompleted=_completionFired;	// ★z171: 前charが完走済みだったか(下のpause条件用)。リセット前に退避。
	_completionFired=false;

	if (!FLASH_PLAYER) {_dbg("ERROR: FLASH_PLAYER is null");return;}

	// ★z72: F7590(白→黒フェード)ロード時、F7540でかぶせた白カバーをframe0(白)描画後(~150ms)に外す。
	//   白カバー(白)とF7590 frame0(白 Ra255)が連続するので船露出なく、原作の白→黒フェード(id=160)へ引き継ぐ。
	// ★z77: 考え方変更(篠原)。固定タイマーの当てずっぽう調整(z73-76:780→950→1050→1350ms)をやめ、F7540の終点
	//   (settle=再生完了=白の維持が終わり白→黒へ切り替わる瞬間)から逆算する。終点≈durationMs=ceil(frameCount/12fps)+150。
	//   その手前200msから白カバーをかぶせ、白→黒(F7590)切替の隙間に出る船露出を覆う。白の維持区間は最後まで見せる。
	//   白カバー除去はF7590側(150ms)据え置き。settle側(z72 _onPlaybackComplete)はフェイルセーフとして残す(冪等)。
	if (nowgrp===7540)
		{
		var f7540End=Math.ceil(frameCount/_effectiveAssumedFps()*1000)+150;
		setTimeout(function(){ if (_currentSWFFile==="game_F7540.swf") {_showWhiteCover();_dbg("F7540: white cover from 終点-200ms (z77, end≈"+f7540End+"ms)");} },Math.max(0,f7540End-200));
		}
	// ★z80: 白/黒カバーが残ったまま白シーン(F7540/F7590)以外の通常フレームに来たら除去して次シーンへ復帰。
	// ★z80: 白/黒カバーが残ったまま白シーン(F7540/F7590)以外の通常フレームに来たら除去して次シーンへ復帰。
	// ★z80: 白/黒カバーが残ったまま白シーン(F7540/F7590)以外の通常フレームに来たら除去して次シーンへ復帰。
	if (nowgrp!==7540 && nowgrp!==7590 && document.getElementById("_whiteCoverOv")) {_hideWhiteCover();_dbg("white/black cover removed at F"+nowgrp+" (次シーン復帰)");}
	// ★z80: F7590はRuffle canvasの白→黒(誤処理で黒にならず)に頼らず、F7540でかぶせた白カバーを黒へCSSフェード。
	//   原作F7590の白→黒は約11フレーム≈920ms相当。除去せず黒divとして残し、次シーンのロード(上の分岐)で除去する。
	if (nowgrp===7590)
		setTimeout(function(){ _fadeWhiteCoverToBlack(900); _dbg("F7590: white cover → black CSS fade (z80, 900ms)"); },150);

	// JPEG静止画モード解除
	var jpgEl=document.getElementById("MAINW_JPEG");
	if (jpgEl) jpgEl.style.display="none";

	// 旧オーバーレイ除去（レガシー互換）
	var mainDiv=document.getElementById("MAINW");
	var hideFlashDuringLoad=!!_sunsetBgHoldActive;
	var gameOverlayDelayMs=hideFlashDuringLoad?260:160;
	// ★z30/z31: 固定160msだとF385等(settle≈durationMs+45ms)の描画完了前にカバーが切れ、
	//    SWFのステージ背景色(F385=#cccccc=白っぽい)が一瞬露出する("白く途切れる"=篠原報告)。
	//    本来は settle完了時に _onPlaybackComplete が _gameOverlay を除去して freeze へ引き継ぐのでそこまで持たせる。
	//    ★z31: ただし frameCount<=12(≒1秒以内の静止/メニュー系)に限定。frameCount大のOP(F5012=255)や演出は
	//    durationMsが巨大(255→約21秒)になり、cover/pauseで _onPlaybackComplete も来ず _gameOverlay が居座ってOPを覆う。
	//    長尺アニメは従来通り160msで剥がしてアニメを見せる。
	// ★z39: 閾値を12→4に。z31では<=12でF1540(11フレーム=ドア開閉等のアニメ)まで巻き込み、延長カバー(≈1.3秒)が
	//   アニメ全体を覆って「アニメが動かない」(篠原報告)に。5フレーム以上はアニメSWFとみなしカバー延長せず動きを見せる。
	// ★z31/z39/z41: frameCount<=4(メニュー/静止系)のみ延長。z40でtag9(#cccccc)除去を検証したが
	//   白は消えなかった(Ruffleはtag9無しでもデフォルトで#cccccc系を描く)→SWF書換による根治は無効と判明、対症に復帰。
	if (frameCount>1 && frameCount<=4) gameOverlayDelayMs=Math.max(gameOverlayDelayMs,Math.ceil((frameCount/_effectiveAssumedFps())*1000)+300);
	_clearGameOverlay();
	if (typeof BLACK_BG_CHAR_FRAMES!=="undefined" && BLACK_BG_CHAR_FRAMES[nowgrp] && nowgrp!==7590)
		{
		// ★z79: F7590はここ(skip freeze)から除外。z69のskip freeze(_unfreezePlayer)はF188等の空SWF(描画ゼロ)用で、
		//   canvas白→黒フェード(id=160)を持つF7590に適用すると黒フェードが壊れて白のままになる(z78で発覚)。
		//   F7590に要るのはBG_LAYER黒(_updateBgLayerの_hideBgLayer)だけ。canvasは通常freezeで白→黒が黒のまま固まる。
		// ★z69: F188等の黒背景空SWF。z37の_updateBgLayer(_hideBgLayer)はBG_LAYER(z0)を黒にするだけで
		//   freeze(z2)に触らない。ここでz51 _freezePlayer(前画面をfreeze化)が走ると、前画面F7150
		//   (20秒no-render=Ruffleステージ#cccccc≒白)を黒の上にfreezeして「本来黒が白」になる(篠原報告)。
		//   → BLACK_BG時はfreeze化せず、既存freezeも除去して黒BG_LAYERを露出させる。
		if (typeof _unfreezePlayer==="function") _unfreezePlayer();
		_dbg("BLACK_BG frame: skip freeze & clear existing freeze F"+nowgrp);
		}
	else if (nowgrp===58)
		{
		// ★F58(8.dat #v58): char107(曇り空)のno char背景。前のSLG(結果char169/F6080アニメ)のfreezeが居座りchar107を覆う。
		//   setposs時点で前freezeを除去(新freezeも作らない)し、settle(no render 703ms)を待たずchar107(BG_LAYER)を即露出する。
		if (typeof _unfreezePlayer==="function") _unfreezePlayer();
		_dbg("F58: clear freeze immediately, show char107");
		}
	else if (!_freezeOverlay && mainDiv)
		{
		if (hideFlashDuringLoad)
			{
			// 夕方背景ホールド時は背景のみ(立ち絵を隠す)を従来通りの固定タイマーで
			_gameOverlay=_captureBackgroundOverlay(mainDiv,512,360);
			if (_gameOverlay)
				{
				_gameOverlay.style.zIndex="9";
				_gameOverlayTimer=_removeOverlay(_gameOverlay,gameOverlayDelayMs);
				}
			}
		else
			{
			// ★z51: 前SWFがfreeze化される前に次へ進む場合(短い台詞のF2420等=settle前に#v次SWF)、
			//   従来の_gameOverlay(z9,gameOverlayDelayMs=160ms固定除去)は描画完了を待たず剥がれ、
			//   覆いが消えた瞬間に背景char072が露出する("立ち絵が完全に消えて海が見える"=篠原報告/点滅1回)。
			//   さらにF2420自身もfreeze未化なので下に立ち絵が残っていない。
			//   → 現canvas(今見えてる立ち絵)をfreeze(z2)化し、z44描画検出unfreezeまで維持。
			//     固定タイマーでなく新SWFの描画完了に連動して剥がれるので途切れない。
			_freezePlayer();
			}
		}
	if (_sunsetBgHoldActive && _manualFadeOverlay && _gameOverlay)
		{
		_clearManualFadeOverlay();
		_dbg("sunset fade overlay handed off to game overlay");
		}
	if (hideFlashDuringLoad) _hideFlashPlayerVisualOnly();

	// ★z206: 対象カットは未完走時に加え、Enter個別停止経由なら誤った完走判定後でもplayerを新品へ交換する。
	//   同じplayerへの連続loadが描画不能状態を引き継ぐ実測があるため。対象外は従来のz171経路を一切変えない。
	var _z206Recreated=false;
	if (Z206_RECREATE_ON_BUSY_FRAMES[nextFrameNum] && (!_prevCharCompleted || _z206ForcedEnter))
		_z206Recreated=_recreateGamePlayerForBusyFrame(nextFrameNum,file);
	// ★z171: 前charが再生途中(未完走)でpause→新char load(autoplay)するとRuffleが新charをframe0停止させる(flg63 ED18/20の黒)。
	//   前charが完走済みのときだけpause(従来=明滅防止)。再生途中ならpauseせずにload(autoplay)で再生中playerを置き換える。
	if (!_z206Recreated)
		{
		if (_prevCharCompleted) try{FLASH_PLAYER.pause();}catch(e){}
		else _dbg("z171: skip pause (prev char still playing) →",file);
		}
	_clearFlashCanvas();

	var fullUrl=SWF_GAME_DIR+file+"?cb="+Date.now();	// ★切り分け用キャッシュバスター（検証後に戻す）
	_dbg("load:",fullUrl,"f:",frameCount);

	var _diagLoadT0=(window._DIAG_CHAR_TIMING!==false && typeof nowgrp!=="undefined" && nowgrp<200)?performance.now():0;	// ★計測用。完了後削除
	var _loadP=null;
	try{
		_loadP=FLASH_PLAYER.load({url:fullUrl,autoplay:true,loop:false});
		_reinjectPlayButtonHide(FLASH_PLAYER);
		if (_diagLoadT0 && _loadP && typeof _loadP.then==="function")	// ★計測用。完了後削除
			_loadP.then(function(){_dbg("[diag] "+file+" load-resolved(fetch+parse) +"+Math.round(performance.now()-_diagLoadT0)+"ms");}).catch(function(){});
		}
	catch(e){_dbg("ERROR: load:",e);return;}
	if (hideFlashDuringLoad)
		{
		setTimeout(function(){
			if (!FLASH_PLAYER || _currentSWFFile!==file) return;
			FLASH_PLAYER.style.display="";
			FLASH_PLAYER.style.visibility="visible";
			FLASH_PLAYER.style.opacity="1";
			},120);
		}

	// ★ F0-199: unfreezeしない（freeze overlay常時維持）
	// 新SWFはバックグラウンドでロード→playback complete時にfreeze更新
	// → ユーザーには常にキャラが見える（空白フレームが出ない）
	// ★ F200以降(z27): 固定タイマーでなく「Ruffleが新SWFを描画した瞬間」にunfreeze。
	//   旧50msタイマーはframe0描画前に剥がして青地/別char露出、廃止(z26)は立ち絵残り。
	var isCharFrame=(nowgrp!==undefined && nowgrp<200);
	if (!isCharFrame)
		{
		// ★z46: 背景jpeg6内蔵立ち絵(4745-4747)は背景デコードが遅く描画検出が「立ち絵だけ」を拾うため、
		//   settle完了(_onPlaybackComplete=背景込み完成)まで前freezeを維持する特例。
		//   ※2420は当初ここに入れたが真因はchar205のalpha往復(Cxform)で、SWF側のmove(frame2-10)除去で
		//     静止化した(z50)ため特例不要→通常のz44描画検出に戻した。
		// ★z53: F4796(「…ですね」=char205+char373)は短い台詞でF2420から切替直後、z44描画検出が
		//   char205+char373の完成前にunfreeze→背景char072が一瞬露出("立ち絵が消えて海が見える"=篠原報告)。
		//   F4790-F4796はchar205(浴衣)の表情差分(口パク)カット群で、F4796はその「…ですね」のカット。
		//   4745-4747と同じく、settle完了(完全描画)まで前freeze(F2420のchar205)を維持して背景露出を防ぐ。
		// ★背景jpeg内蔵立ち絵の差分群(depth1=背景char内蔵+depth3立ち絵)。char(背景)デコード中に前freezeが剥がれ→立ち絵も背景も一瞬消失/ノイズ貫通。
		//   章ごとに内蔵背景charが違う: 16.dat=char184(8/2早朝さやか海, 1410-1520/4520-4529)、27.dat=char74(室内, 4530-4543)、
		//   46.dat=char186/189(凪, 4600-4628)、62.dat=char118(風呂, 800-890)、67.dat=char121(階段, 4570-4581)、69.dat=char205(海夕日ズーム, 4847-4878)。範囲でsettle待ち=settle完了まで前freeze維持。
		//   69.dat背景クロスフェード群(2420-2540): depth1=新背景char(205/189/211/222/186)+depth3=旧背景alpha fade out。新背景デコード中に背景貫通(char402露出)。
		//   ※8例目=範囲追加が続くが汎用化は副作用リスクで保留(篠原判断2026-06-21)。個別範囲で対処を継続。
		if ((nowgrp>=4745 && nowgrp<=4747) || nowgrp===4796 || (nowgrp>=4600 && nowgrp<=4628) || (nowgrp>=4813 && nowgrp<=4815) || nowgrp===4791 || (nowgrp>=2420 && nowgrp<=2540) || (nowgrp>=4520 && nowgrp<=4543) || (nowgrp>=4570 && nowgrp<=4581) || (nowgrp>=4847 && nowgrp<=4878) || (nowgrp>=800 && nowgrp<=890) || (nowgrp>=1410 && nowgrp<=1520))
			{
			// ★z68: F4627/F4628(8/5夜さやか説得カット)はDefineJPEG id=1(55KB)を内蔵=4745-4747/4796と同型の
			//   「背景jpeg内蔵立ち絵」。Ruffleが内蔵背景JPEGをデコードする前のcanvas(z1)が黒でBG_LAYER char151(z0)を
			//   覆い、z44描画検出がそのデコード途中を拾って早期unfreeze→「char+人物ごと一瞬黒」(篠原報告)。
			//   settle完了(背景込み完全描画)まで前freezeを維持して黒を覆う。
			// ★z70: F4813-4815(8/6夜さやか/なぎ浴衣の表情差分カット)も同型。DefineJPEG id=1(55KB)+id=35(36KB)内蔵。
			//   F4814で表情がdepth16→19に変わる時、新立ち絵デコード中に描画検出がunfreeze→背景char072露出=立ち絵一瞬消失。
			// ★z81: F4791/F2430/F2450(8/6夜char072維持の連続カット)も全てJPEG2(背景JPEG)内蔵=同型。「一瞬黒を突き抜けた」(篠原報告)。
			//   背景jpeg内蔵カットへの個別settle待ち追加は5例目→将来は「DefineJPEG内蔵+no own bg」を事前リスト化して一括判別する余地あり。
			if (typeof _hideFlashPlayerVisualOnly==="function") _hideFlashPlayerVisualOnly();
			_dbg("slow-render frame: freeze maintained until settle F"+nowgrp);
			}
		else if (nowgrp===660)
			{
			// ★z55: F660(立ち絵char56のスライドアウト退場アニメ)。frame0-1の静止描画は
			//   背景char121→立ち絵char56の2段デコードで、その途中に#cccccc(Ruffleステージ色)や
			//   部分描画が「一瞬白く」見える(z54 stable>=2でも描画検出では拾ってしまう)。
			//   → 描画検出をやめ、アニメ(move=frame2)が動き出す瞬間まで前の安定char(前freeze)を維持し、
			//     その間にF660のframe0描画(白む過程)を覆い隠す。frame2≈167ms(2/12fps)なので余裕込み220msで剥がす。
			//   剥がした後はスライドアウトのmoveがそのまま見える。
			(function(f){
				setTimeout(function(){
					if (_currentSWFFile===f && !_completionFired) _unfreezePlayer();
					_dbg("F660: unfreeze at animation start (move frame2)");
					},220);
				})(file);
			}
		else
			{
			// ★z157: F6220/F6250も描画検出で白スライドのアニメを見せる(z156の「freeze維持」はF6220/F6250の
			//   白スライド継続アニメ=char476 y=383の続きを隠して「白フェードが動かん」になったため撤回)。
			//   char474(BG_LAYER)露出は別の2経路でカバー:
			//   (a)ゆっくり送り=F6120 settleで作られたfreeze(白完成)が、setposs(6220)の_clearFlashCanvas隙間(z2)を覆う。
			//   (b)速く送り=z151遅延+遅延解除の_freezePlayer(F6120白)が同様に覆う。
			//   F6120終点y=383=F6220始点y=383(白完成)なので描画検出がF6220 frame0(白)を拾って剥がす→白のまま。
			_scheduleRenderedUnfreeze(file,400);
			}
		}
	else
		{
		_dbg("freeze maintained: F0-199 char frame");
		}

	// 再生完了検知
	if (frameCount<=1) return;

	// ★ 追加: F0019のような「表示後すぐ消えるSWF」は早期freeze
	var earlyFreezeMs=EARLY_FREEZE_SWFS[file];
	if (earlyFreezeMs)
		{
		// ★earlyFreezeMsも実時間(12fps前提)固定だと低コアPCで描画完了(frame0≈1000/_assumedFps ms)に間に合わずギリギリ/再発する
		//   (篠原指摘)。_assumedFpsでスケールしてマージンを確保(8fps:120→180ms)。load resolve後起算と合わせて二重に堅牢化。
		earlyFreezeMs=Math.round(earlyFreezeMs*12/_effectiveAssumedFps());
		_dbg("early freeze target:",file,"ms:",earlyFreezeMs);
		// ★早期freezeは「load(描画)完了後」にearlyFreezeMs待ってから焼く。低コアPCでload(数百ms)がearlyFreezeMsより
		//   長いと、従来(setposs直後起算)では _clearFlashCanvas後の空canvas(描画前)を焼き、立ち絵が一瞬消える=点滅した
		//   (フェードのdurationMsと同型の「実時間タイマー vs 実再生」レース。コア数で分かれる)。load resolve後に起算して解消。
		var _earlyFire=function(){
			_playbackTimer=setTimeout(function(){
				if (_completionFired) return;
				requestAnimationFrame(function(){
					requestAnimationFrame(function(){
						_freezePlayer(file);
						_completionFired=true;
						_cancelPlaybackDetection();
						_dbg("early freeze done:",file);
						});
					});
				},earlyFreezeMs);
			};
		if (_loadP && typeof _loadP.then==="function") _loadP.then(_earlyFire).catch(_earlyFire);
		else _earlyFire();
		return;
		}

	var durationMs=Math.ceil((frameCount/_effectiveAssumedFps())*1000)+150;
	// ★セーブ演出作り直し Step1b: precoverは残す(黒フレーム/チラ見え防止)が、FLASH_PLAYER非表示は外す
	if (file==="game_F0500.swf")
		{
		_saveTransitionPrecoverTimer=setTimeout(function(){
			_saveTransitionPrecoverTimer=null;
			_startSaveTransitionPrecover();
			},Math.max(0,durationMs-2000));
		}
	if (file==="game_F7520.swf")
		{
		_lateWhiteoutTimer=setTimeout(function(){
			_lateWhiteoutTimer=null;
			if (_completionFired) return;
			_waitForBgFile("white.jpg",function(){
				if (_completionFired||_currentSWFFile!=="game_F7520.swf") return;
				showBackgroundFile("white.jpg");
				if (FLASH_PLAYER)
					{
					FLASH_PLAYER.style.visibility="hidden";
					FLASH_PLAYER.style.opacity="0";
					}
				_dbg("late bg whiteout:",file);
				});
			},Math.max(0,durationMs-420));
		}
	// ★ settle前倒し: char frame(F0-199)はload完了直後からsettle開始（durationMs固定待ちを廃止）。
	//    requireChange=trueで描画前の誤freezeを防ぎ、明滅ガード(2連続安定/700msタイムアウト)は維持。
	//    それ以外(ムービー等)は従来どおりdurationMs後にsettle。
	if (isCharFrame && _loadP && typeof _loadP.then==="function")
		{
		_loadP.then(function(){
			if (!_completionFired) _beginPlaybackCompletionSettle(file,700,true);
			}).catch(function(){
			_playbackTimer=setTimeout(function(){
				if (!_completionFired) _beginPlaybackCompletionSettle(file,700,true);
				},durationMs);
			});
		}
	else
		{
		_playbackTimer=setTimeout(function(){
			if (!_completionFired) _beginPlaybackCompletionSettle(file,700);
			},durationMs);
		}
	}

function _getVisibleSceneFingerprint()
	{
	var canvas=_getFlashCanvas();
	var bgImg=document.getElementById("BG_LAYER");
	var jpgImg=document.getElementById("MAINW_JPEG");
	var w=32,h=24,ctx,data,i,hash=2166136261;
	if (!canvas && !bgImg && !jpgImg) return null;
	if (!_completionSettleCanvas)
		{
		_completionSettleCanvas=document.createElement("canvas");
		_completionSettleCanvas.width=w;
		_completionSettleCanvas.height=h;
		}
	ctx=_completionSettleCanvas.getContext("2d",{willReadFrequently:true});
	if (!ctx) return null;
	ctx.clearRect(0,0,w,h);
	try{
		if (bgImg && bgImg.style.display!=="none" && bgImg.complete) ctx.drawImage(bgImg,0,0,w,h);
		if (jpgImg && jpgImg.style.display!=="none" && jpgImg.complete) ctx.drawImage(jpgImg,0,0,w,h);
		if (canvas) ctx.drawImage(canvas,0,0,w,h);
		data=ctx.getImageData(0,0,w,h).data;
		for(i=0;i<data.length;i+=4)
			{
			hash^=data[i];
			hash=Math.imul(hash,16777619);
			hash^=data[i+1];
			hash=Math.imul(hash,16777619);
			hash^=data[i+2];
			hash=Math.imul(hash,16777619);
			hash^=data[i+3];
			hash=Math.imul(hash,16777619);
			}
		return (hash>>>0).toString(16);
		}
	catch(e){
		_dbg("settle fingerprint failed:",e.message);
		return null;
		}
	}

function _beginPlaybackCompletionSettle(expectedFile,maxWaitMs,requireChange)
	{
	var token,startAt,lastHash=null,stableCount=0,baseline=null,changed=false;
	if (_completionFired) return;
	if (_completionSettleRaf) cancelAnimationFrame(_completionSettleRaf);
	_completionSettleRaf=0;
	token=++_completionSettleToken;
	startAt=performance.now();
	if (requireChange) baseline=_getVisibleSceneFingerprint();	// ★前倒し時: 描画前(空/旧)を安定とみなさない基準
	function tick()
		{
		var hash,elapsed;
		if (_completionFired) return;
		if (token!==_completionSettleToken) return;
		if (expectedFile && _currentSWFFile!==expectedFile)
			{
			_dbg("settle aborted: file changed",expectedFile,"->",_currentSWFFile);
			return;
			}
		hash=_getVisibleSceneFingerprint();
		elapsed=performance.now()-startAt;
		// ★ requireChange: baselineと変化するまで安定カウントを始めない（描画前の誤freeze防止）。タイムアウトは効かせる
		if (requireChange && !changed)
			{
			if (hash!==null && hash!==baseline) changed=true;
			else
				{
				lastHash=hash;
				if (elapsed>=maxWaitMs)
					{
					_completionSettleRaf=0;
					_dbg("settle timeout (no render):",expectedFile,"elapsed="+Math.round(elapsed));
					if (!_completionFired) _onPlaybackComplete();
					return;
					}
				_completionSettleRaf=requestAnimationFrame(tick);
				return;
				}
			}
		if (hash!==null && hash===lastHash) stableCount++;
		else stableCount=0;
		lastHash=hash;
		if ((hash!==null && stableCount>=2) || (elapsed>=maxWaitMs))
			{
			_completionSettleRaf=0;
			if (elapsed>=maxWaitMs) _dbg("settle fallback timeout:",expectedFile,"elapsed="+Math.round(elapsed));
			else _dbg("settle complete:",expectedFile,"elapsed="+Math.round(elapsed),"stable="+stableCount);
			if (!_completionFired) _onPlaybackComplete();
			return;
			}
		_completionSettleRaf=requestAnimationFrame(tick);
		}
	_completionSettleRaf=requestAnimationFrame(tick);
	}

// ============================================================
// ★z27: 描画検出unfreeze（F200+ムービー/歩行アニメ用）
//   旧実装は固定50msタイマーでunfreeze→Ruffleがframe0を描く前(@12fps 50ms≒0.6枚)に
//   旧freezeを剥がし、透明キャンバスの下(背景char/黒/青地)が一瞬露出していた。
//   逆にタイマー廃止(z26)だと _onPlaybackComplete(durationMs≈1秒後)まで旧立ち絵が残った。
//   → fingerprint(BG+JPEG+canvas合成。freeze overlayは含まずRuffle実描画を反映)が
//     baseline(_clearFlashCanvas直後=透明)から変化＝新SWFが最初の絵を描いた瞬間にunfreeze。
//   保険でmaxWaitMs経過時も強制unfreeze。
function _scheduleRenderedUnfreeze(expectedFile,maxWaitMs)
	{
	var myToken=++_renderedUnfreezeToken;
	var startAt=performance.now();
	var baseline=_getVisibleSceneFingerprint();
	var changed=false,lastHash=null,stable=0;
	if (_renderedUnfreezeRaf) {cancelAnimationFrame(_renderedUnfreezeRaf);_renderedUnfreezeRaf=0;}
	function tick()
		{
		var hash,elapsed;
		if (myToken!==_renderedUnfreezeToken) return;	// 後続loadでキャンセル
		if (expectedFile && _currentSWFFile!==expectedFile)
			{
			_dbg("rendered-unfreeze aborted: file changed "+expectedFile+" -> "+_currentSWFFile);
			return;
			}
		hash=_getVisibleSceneFingerprint();
		elapsed=performance.now()-startAt;
		// ★z44: 変化(描画開始)後さらに安定(frame完成)を待ってからunfreeze。
		//   変化即(旧)だとframe0の部分描画(例:背景char121だけ・立ち絵char57が描かれる前)を拾い、
		//   「立ち絵でない間違ったchar」が一瞬見えて正常化する現象になっていた(篠原報告)。
		// ★z54: stable>=1ではF660(背景char121→立ち絵char56の2段デコード)で再発。立ち絵char56はdepth3で
		//   背景char121(depth1)よりデコードが遅れ、背景だけ描画された時点で剥がれ「変なchar(背景charが
		//   立ち絵の前に一瞬)」が出た。安定を3フレーム(stable>=2)に増やし立ち絵描画完了まで待つ。
		if (hash!==null && hash!==baseline)
			{
			changed=true;
			if (hash===lastHash) stable++; else stable=0;
			lastHash=hash;
			}
		if ((changed && stable>=2) || elapsed>=maxWaitMs)
			{
			_renderedUnfreezeRaf=0;
			_unfreezePlayer();
			_dbg("unfreeze on render: "+expectedFile+" elapsed="+Math.round(elapsed)+(elapsed>=maxWaitMs?" (timeout)":" settled"));
			return;
			}
		_renderedUnfreezeRaf=requestAnimationFrame(tick);
		}
	_renderedUnfreezeRaf=requestAnimationFrame(tick);
	}

// ============================================================
// 【一時計測用】立ち絵フレームの描画タイミング計測（挙動不変・ログのみ）
// 有効化: コンソール等で window._DIAG_CHAR_TIMING=true。F2でオーバーレイ表示して読む。
// 読み方: "first-render +Xms" = 新立ち絵が実際に描画された時刻
//         "stable +Yms"      = 絵が静止し固められる状態になった時刻
//   → 現状はこの後 durationMs(約317〜400ms)経過を待ってから settle 開始のため、
//     Y が durationMs より小さければ「その差分が無駄な待ち時間」。
// ★ 計測完了後はこの関数と呼び出し(_diagCharFrameTiming)を削除すること。
// ============================================================
function _diagCharFrameTiming(file)
	{
	if (window._DIAG_CHAR_TIMING===false) return;	// ★計測中は既定ON。完了後この関数と呼び出しごと削除すること
	var startAt=performance.now();
	var baseline=_getVisibleSceneFingerprint();
	var lastHash=baseline,stable=0,firstChange=false;
	function diag()
		{
		if (_currentSWFFile!==file) return;	// シーンが変わったら計測中断
		var hash=_getVisibleSceneFingerprint();
		var t=Math.round(performance.now()-startAt);
		if (!firstChange && hash!==null && hash!==baseline)
			{
			firstChange=true;
			_dbg("[diag] "+file+" first-render +"+t+"ms");
			}
		if (firstChange && hash!==null && hash===lastHash) stable++;
		else if (firstChange) stable=0;
		lastHash=hash;
		if (firstChange && stable>=2)
			{
			_dbg("[diag] "+file+" stable(could-freeze) +"+t+"ms");
			return;
			}
		if (t<800) requestAnimationFrame(diag);
		else _dbg("[diag] "+file+" NO-stable<800ms (flicker?)");
		}
	requestAnimationFrame(diag);
	}

// ============================================================
// 再生完了コールバック（二重発火防止付き）
// ============================================================
// ★z72: F7540(船→白フェード)の「フェード直後の船露出」を白で覆い、F7590(白→黒)で除去するための白カバー(z3)。
//   F7540はCxform Am=-256の負alpha白フェードインで、Ruffleが負alphaを誤処理し白が乗りきらず下の船(id=194)が透ける。
//   freezeすると船を含んだ画面が固まるので、settle時はfreezeの代わりに不透明白divをかぶせて確実に白くする。
//   白→黒フェードはF7590の原作canvas(id=160黒, Ra255→0)に任せ、F7590 frame0(白)描画後にこのカバーを外す。
function _showWhiteCover()
	{
	var mainDiv=document.getElementById("MAINW");
	if (!mainDiv) return;
	if (document.getElementById("_whiteCoverOv")) return;
	var ov=document.createElement("div");
	ov.id="_whiteCoverOv";
	ov.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;background:#ffffff;z-index:3;";
	mainDiv.appendChild(ov);
	}
function _hideWhiteCover()
	{
	var ov=document.getElementById("_whiteCoverOv");
	if (ov&&ov.parentNode) ov.parentNode.removeChild(ov);
	}
// ★z80: 白カバー(白div)をそのまま黒へCSSフェードして「白→黒」をJSで作る。F7590のcanvas白→黒(id=160 Cxform Ra255→0)は
//   Ruffleが誤処理して黒にならず白のまま固まる(z77-79で確定)。原作canvasに頼らず白カバーを黒へtransitionさせれば確実に
//   白→黒になる。フェード後は黒divとして残り(BG_LAYER黒z78と二重で黒を担保)、次の通常シーンのロードで_hideWhiteCoverする。
function _fadeWhiteCoverToBlack(durationMs)
	{
	var ov=document.getElementById("_whiteCoverOv");
	if (!ov) return;
	ov.style.transition="background-color "+durationMs+"ms linear";
	requestAnimationFrame(function(){ requestAnimationFrame(function(){ var o=document.getElementById("_whiteCoverOv"); if (o) o.style.background="#000000"; }); });
	}

// ============================================================
// 一日終了/セーブ前後の遷移アニメ(Movie>0)のスキップ
// クリック/Enter(sys.jsのklik)から呼ばれ、再生中SWFを完了扱いにして
// SEQ.movieendへ合流させる。_onPlaybackComplete内の_completionFiredガードで
// 自然停止時の二重発火を防止。連打で各段階(F500→セーブ→DATE→WEATHER→翌日)を順に飛ばせる。
// ============================================================
function _skipTransitionMovie()
	{
	if (typeof _completionFired!=="undefined" && _completionFired) return;
	// ★F500(セーブ入りロゴ=Movie1)はRuffleで「途中フレーム→鎮座へジャンプ」できないため、
	//   最終フレーム鎮座だけの1フレーム静止SWF(game_F0500s.swf)に差し替えて即鎮座させる。
	//   静止SWFロード(1フレーム/stop)→完了→_onPlaybackComplete→movieend(Movie1)→PF2(セーブ画面)。
	//   セーブ画面は_openSaveWindow(true)で背景(FLASH_PLAYERの鎮座ロゴ)を維持する。
	if (typeof SEQ!=="undefined" && SEQ.Movie===1 && _currentSWFFile==="game_F0500.swf")
		{
		_dbg("[skip movie] F500 → static logo (game_F0500s.swf)");
		_loadGameSWF("game_F0500s.swf",1);
		if (typeof window!=="undefined") window._saveIntroSkip=true;	// PF2後のロゴ見せ2秒遅延を飛ばす(sys._startSaveIntro)
		// ★1フレーム/stopの静止SWFは「最初から停止」のため自動完了検出(_onPlaybackComplete)が効かない。
		//   描画settle相当の短い待ち後に明示的に完了させ、movieend(→PF2)へ自動進行させる(2クリック不要化)。
		setTimeout(function(){
			if (_currentSWFFile==="game_F0500s.swf" && !_completionFired) _onPlaybackComplete();
			},260);
		return;
		}
	_dbg("[skip movie] Movie="+(typeof SEQ!=="undefined"?SEQ.Movie:"?")+" file="+_currentSWFFile);
	_onPlaybackComplete();
	}

function _onPlaybackComplete()
	{
	if (_completionFired) return;
	_completionFired=true;
	_cancelPlaybackDetection();
	if (_gameOverlayTimer) {clearTimeout(_gameOverlayTimer);_gameOverlayTimer=null;}
	if (_gameOverlay && _gameOverlay.parentNode) _gameOverlay.parentNode.removeChild(_gameOverlay);
	_gameOverlay=null;

	_dbg("playback complete, nowwin="+nowwin+" Movie="+(typeof SEQ!=="undefined"?SEQ.Movie:"?"));

	// ★ セーブ/ロード画面中はplayback完了を無視（pause→オレンジボタン防止）
	if (typeof nowwin!=="undefined" && (nowwin==="save"||nowwin==="load"))
		{
		_dbg("playback complete ignored: nowwin="+nowwin);
		return;
		}

	// コールバックルーティング:
	// 1. nowwin=="wait" → kick()（シナリオ#Vの完了）
	// 2. nowwin=="ending" → kick()（ED完了→タイトルへ）
	// 3. SEQ.Movie>0 → SEQ.movieend()（SLGエンジン）
	// 4. それ以外 → fire-and-forget（pause不要、ループ継続）
	//    ★ pause()するとRuffleがオレンジ再生ボタンを表示するため
	//      コールバック発火時のみpause()する
	if (typeof nowwin!=="undefined")
		{
		if (nowwin=="wait" || nowwin=="ending")
			{
			if (nowwin=="ending" && _endingSequenceStage===0 && _isEndingTitleSwf(_currentSWFFile))
				{
				_freezePlayer(_currentSWFFile);
				if (FLASH_PLAYER) try{FLASH_PLAYER.pause();}catch(e){}
				_dbg("ending title hold:",_currentSWFFile);
				_startEndingTitleSequence();
				return;
				}
			if (nowwin=="ending" && _endingSequenceStage===2 && _currentSWFFile==="game_F7619.swf")
				{
				_hideFlashPlayerVisualOnly();
				_dbg("ending roll audio complete");
				return;
				}
			requestAnimationFrame(function(){
				requestAnimationFrame(function(){
					if (_currentSWFFile==="game_F7540.swf") {_showWhiteCover();_dbg("F7540 settle: white cover (船露出防止 z72)");}
					else if (_currentSWFFile==="game_F7520.swf") _freezeBackgroundOnly(_currentSWFFile);
					else _freezePlayer(_currentSWFFile);
					if (FLASH_PLAYER) try{FLASH_PLAYER.pause();}catch(e){}
					kick();
					});
				});
			return;
			}
		}
	if (typeof SEQ!=="undefined" && typeof SEQ.movieend==="function")
		{
		if (typeof SEQ.Movie!=="undefined" && SEQ.Movie>0)
			{
			if (SEQ.Movie>=1 && SEQ.Movie<=4)
				{
				// ★stop注入済みSWF（セーブF500=Movie1 / 日付遷移DATE=Movie3・WEATHER=Movie4）は自然停止する。
				// freeze/holdは黒い瞬間を掴むため使わず、pause()はRuffleのオレンジ再生ボタン＋暗転を誘発するのでしない。
				}
			else if (FLASH_PLAYER) try{FLASH_PLAYER.pause();}catch(e){}
			SEQ.movieend();
			return;
			}
		}
	// fire-and-forget: canvasキャプチャでフリーズ表示（ループ明滅防止）
	// ★ F0-199の立ち絵なしフレーム（char_id未定義）はfreeze更新しない
	// → 前フレームのキャラoverlay維持（F16等でキャラが消えるのを防ぐ）
	if (_currentSWFFile==="game_F0620.swf")
		{
		_beginSunsetBgHoldTransition();
		_dbg("fire-and-forget: sunset bg hold");
		return;
		}
	var _nowgrp=nowgrp;
	var skipFreeze=(typeof _nowgrp!=="undefined" && _nowgrp<200 && !FRAME_TO_CHAR_ID[_nowgrp]);
	if (skipFreeze)
		{
		if (_sunsetBgHoldActive && CLEAR_FREEZE_ON_NOCHAR_FRAMES[_nowgrp])
			{
			_clearSunsetBgHold();
			_updateBgLayer(_nowgrp);
			_dbg("skip freeze but clearing sunset hold at F"+_nowgrp+" src="+_freezeSourceFile);
			_unfreezePlayer();
			}
		else if (_sunsetBgHoldActive)
			{
			_maintainSunsetBgHold();
			requestAnimationFrame(function(){
				requestAnimationFrame(function(){
					_freezeBackgroundOnly(_currentSWFFile);
					_hideFlashPlayerVisualOnly();
					_dbg("skip freeze -> bg-only hold at F"+_nowgrp);
					});
				});
			}
		else if (CLEAR_FREEZE_ON_NOCHAR_FRAMES[_nowgrp])
			{
			_dbg("skip freeze but clearing overlay at F"+_nowgrp+" src="+_freezeSourceFile);
			_unfreezePlayer();
			}
		else if (_freezeSourceFile && EARLY_FREEZE_SWFS[_freezeSourceFile])
			{
			_dbg("skip freeze but clearing early-freeze overlay "+_freezeSourceFile+" at F"+_nowgrp);
			_unfreezePlayer();
			}
		else
			{
			_dbg("fire-and-forget: skip freeze (no char at F"+_nowgrp+")");
			}
		}
	else
		{
		requestAnimationFrame(function(){
			requestAnimationFrame(function(){
				_freezePlayer(_currentSWFFile);
				_dbg("fire-and-forget, frozen");
				});
			});
		}
	}

function _cancelPlaybackDetection()
	{
	if (_playbackTimer) {clearTimeout(_playbackTimer);_playbackTimer=null;}
	if (_completionSettleRaf) {cancelAnimationFrame(_completionSettleRaf);_completionSettleRaf=0;}
	_completionSettleToken++;
	if (_unfreezeTimer) {clearTimeout(_unfreezeTimer);_unfreezeTimer=null;}
	_renderedUnfreezeToken++;	// ★z27: 描画検出unfreezeも止める
	if (_renderedUnfreezeRaf) {cancelAnimationFrame(_renderedUnfreezeRaf);_renderedUnfreezeRaf=0;}
	if (_dayTransitionTimer) {clearTimeout(_dayTransitionTimer);_dayTransitionTimer=null;}
	if (_saveTransitionPrecoverTimer) {clearTimeout(_saveTransitionPrecoverTimer);_saveTransitionPrecoverTimer=null;}
	if (_lateWhiteoutTimer) {clearTimeout(_lateWhiteoutTimer);_lateWhiteoutTimer=null;}
	if (!(_endingSequenceStage===1 || _endingSequenceStage===2))
		_clearEndingSequenceTimer();
	}

// ============================================================
// FRAME_TO_CHAR_ID: F0-199のdepth3（立ち絵）char_id マッピング
// 同じchar_idなら立ち絵が変わらない→freeze維持でSWFロード時の明滅防止
// nullフレーム（立ち絵なし）は省略（undefined扱い）
// ============================================================
var FRAME_TO_CHAR_ID={
    2:17,3:22,4:29,5:34,6:47,7:52,8:53,11:17,12:58,13:29,14:52,15:52,
    17:71,18:22,19:53,24:53,25:52,26:47,28:81,29:22,30:29,31:34,32:34,
    33:22,34:82,35:29,36:83,38:86,39:90,41:53,42:52,43:94,44:97,45:100,
    46:103,47:53,48:94,49:94,51:53,52:52,53:97,54:103,55:106,56:100,
    61:53,62:103,63:97,64:100,65:83,66:17,68:17,70:103,71:97,72:122,
    73:97,74:128,75:53,76:52,77:83,78:90,79:58,80:129,81:130,82:122,
    83:106,84:131,85:29,86:63,87:132,88:81,89:52,90:34,91:63,92:81,
    93:29,94:137,95:141,96:22,97:58,98:17,99:17,103:82,104:63,105:82,107:29,
    108:83,109:17,110:142,111:106,112:71,113:132,114:143,115:142,116:63,
    117:82,118:106,119:137,120:103,121:97,122:53,123:129,124:122,125:94,
    126:52,127:82,128:63,129:58,130:29,131:34,133:83,134:144,135:17,
    136:142,137:22,138:90,139:148,140:130,142:71,143:71,144:71,145:97,
    149:149,150:97,151:150,152:94,153:82,154:131,155:71,156:106,157:97,
    158:63,159:34,160:81,161:156,162:132,164:63,165:157,167:132,168:58,
    169:81,170:143,171:66,172:158,173:83,174:86,175:58,176:157,177:29,
    178:132,179:81,180:131,181:86,182:143,183:129,184:130,185:130,186:106,
    187:159,189:58,190:17,191:17,192:17,196:150,197:129,198:129
};
var _currentCharId=null; // 現在表示中のchar_id

// ★z99: skip(Enter高速送り)中にこのフレームへ来たら強制的にskipを切り、通常(クリック/Ctrl)経路に合流させる
//   特例フレーム(原作#Vスキップ不可ムービーと同等の考え方)。背景JPEG内蔵立ち絵はenter skip中だと前面canvas(z1)が
//   古い背景込み画像を表示し続け、BG_LAYER(z0)だけ更新しても背景char.jpgが切り替わらない([[bg-jpeg-skip-lag-bug]])。
//   該当シーンだけskipを止めれば_loadGameSWFまで走り背景込みcanvasが再描画される。enterは1コマ送り(クリック扱い)になる。
//   F2040=8/8午後3時「こうして時は流れ…」ナレーション(タイトルchar123→海char072へ背景切替)。
//   F7470=船航行SWFシーン(F7490「……教授」)の手前。enter skipでF7440〜F7470を超高速処理した勢いのまま、直後の
//     F7520(白/#Vスキップ不可ムービー)→F7490(船)へ遷移すると、白シーンで隠したFLASHのvisible復帰直後に描画検出が
//     白を拾ってtimeout→船SWFが描画されない。F7490自体はF7520(#V)でskipが既にfalseになっており登録しても発火しない
//     (skip必須のため)。→まだskip=trueのF7470で止め、状態が乱れる前にskip解除して通常描画に戻す。以降クリックで
//     白→船を進めればctrl/クリックで至ったのと同じ状況になり船が出る。
//   F7540/F7590=白シーン(船→白フェードイン/白→黒)。enter skipでここを高速通過するとFLASH_PLAYERが「visible復帰しても
//     再生されない」死状態になり、以降の結果発表→ED突入(F7742)→ED roll(F7619)→タイトルOP(F5012)が一連でtimeout＝OP
//     アニメが再生されない(z103のplay()でも復帰せず=pause引きずりでない深い停止)。白シーンをskip=false(クリック相当)で
//     通せばFLASHは壊れない(z101で船が出たのと同根)。→白シーンのフレームをskip強制解除。発火(skip force-stopログ)が
//     出なければ#V等でskip=false化済み＝手前のskip=trueフレームに要調整。
var SKIP_FORCE_STOP_FRAMES={
	2040:true,7470:true,7540:true,7590:true,
	// ★z206: 確認済みの対象カットだけEnter連続decodeを1カットずつ止め、Ruffleへの連続loadを局所的に防ぐ。
	4500:true,4501:true,4502:true,4520:true,4521:true,4522:true,4523:true,4524:true,
	4525:true,4526:true,4527:true,4528:true,4529:true,4862:true,4863:true
	};

// ============================================================
// F0-199 背景JPEGプレビュー（問題D対策: 案A）
// SWF load()時の黒フレーム防止用。背景JPEGを先に表示し、
// SWF描画安定後にJPEGを隠してSWFに切替える。
// depth 1（背景）のみ。depth 3（キャラ）はベクターのためSWF依存。
// ============================================================
var FRAME_TO_BG_JPEG={
0:"char001.jpg",1:"char006.jpg",2:"char006.jpg",3:"char006.jpg",
4:"char006.jpg",5:"char006.jpg",6:"char035.jpg",7:"char035.jpg",
8:"char035.jpg",9:"char054.jpg",10:"char035.jpg",11:"char035.jpg",
12:"char035.jpg",13:"char035.jpg",14:"char035.jpg",15:"char035.jpg",
16:"char067.jpg",17:"char067.jpg",18:"char067.jpg",19:"char067.jpg",
20:"char035.jpg",21:"char072.jpg",22:"char075.jpg",23:"char078.jpg",
24:"char078.jpg",25:"char078.jpg",26:"char078.jpg",27:"char078.jpg",
28:"char078.jpg",29:"char078.jpg",30:"char078.jpg",31:"char078.jpg",
32:"char075.jpg",33:"char075.jpg",34:"char075.jpg",35:"char075.jpg",
36:"char075.jpg",37:"char075.jpg",38:"char075.jpg",39:"char075.jpg",
40:"char091.jpg",41:"char091.jpg",42:"char091.jpg",43:"char091.jpg",
44:"char091.jpg",45:"char091.jpg",46:"char091.jpg",47:"char091.jpg",
48:"char091.jpg",49:"char091.jpg",50:"char091.jpg",51:"char035.jpg",
52:"char035.jpg",53:"char035.jpg",54:"char035.jpg",55:"char035.jpg",
56:"char035.jpg",57:"char054.jpg",58:"char107.jpg",59:"char110.jpg",
60:"char113.jpg",61:"char110.jpg",62:"char110.jpg",63:"char110.jpg",
64:"char110.jpg",65:"char110.jpg",66:"char110.jpg",67:"char116.jpg",
68:"char119.jpg",69:"char119.jpg",70:"char075.jpg",71:"char075.jpg",
72:"char075.jpg",73:"char067.jpg",74:"char123.jpg",75:"char075.jpg",
76:"char075.jpg",77:"char075.jpg",78:"char075.jpg",79:"char075.jpg",
80:"char110.jpg",81:"char110.jpg",82:"char110.jpg",83:"char110.jpg",
84:"char123.jpg",85:"char123.jpg",86:"char075.jpg",87:"char075.jpg",
88:"char075.jpg",89:"char110.jpg",90:"char110.jpg",91:"char110.jpg",
92:"char110.jpg",93:"char110.jpg",94:"char110.jpg",95:"char110.jpg",
96:"char110.jpg",97:"char110.jpg",98:"char078.jpg",99:"char078.jpg",
100:"char075.jpg",101:"char075.jpg",102:"char067.jpg",103:"char035.jpg",
104:"char035.jpg",105:"char119.jpg",106:"char119.jpg",107:"char119.jpg",
108:"char119.jpg",109:"char119.jpg",110:"char119.jpg",111:"char110.jpg",
112:"char006.jpg",113:"char006.jpg",114:"char006.jpg",115:"char006.jpg",
116:"char006.jpg",117:"char006.jpg",118:"char091.jpg",119:"char091.jpg",
120:"char067.jpg",121:"char067.jpg",122:"char067.jpg",123:"char067.jpg",
124:"char067.jpg",125:"char067.jpg",126:"char067.jpg",127:"char119.jpg",
128:"char119.jpg",129:"char119.jpg",130:"char119.jpg",131:"char119.jpg",
132:"char119.jpg",133:"char119.jpg",134:"char119.jpg",135:"char119.jpg",
136:"char119.jpg",137:"char119.jpg",138:"char054.jpg",139:"char145.jpg",
140:"char145.jpg",141:"char145.jpg",142:"char110.jpg",143:"char110.jpg",
144:"char110.jpg",145:"char110.jpg",146:"char110.jpg",147:"char110.jpg",
148:"char110.jpg",149:"char110.jpg",150:"char110.jpg",151:"char110.jpg",
152:"char110.jpg",153:"char110.jpg",154:"char110.jpg",155:"char110.jpg",
156:"char110.jpg",157:"char110.jpg",158:"char151.jpg",159:"char151.jpg",
160:"char151.jpg",161:"char151.jpg",162:"char151.jpg",163:"char151.jpg",
164:"char123.jpg",165:"char123.jpg",166:"char123.jpg",167:"char123.jpg",
168:"char123.jpg",169:"char123.jpg",170:"char123.jpg",171:"char123.jpg",
172:"char123.jpg",173:"char123.jpg",174:"char123.jpg",175:"char151.jpg",
176:"char151.jpg",177:"char151.jpg",178:"char119.jpg",179:"char119.jpg",
180:"char119.jpg",181:"char119.jpg",182:"char119.jpg",183:"char091.jpg",
184:"char091.jpg",185:"char067.jpg",186:"char067.jpg",187:"char067.jpg",
189:"char078.jpg",190:"char078.jpg",191:"char110.jpg",192:"char110.jpg",
193:"char110.jpg",194:"char110.jpg",195:"char110.jpg",196:"char110.jpg",
197:"char110.jpg",198:"char110.jpg",199:"char162.jpg",
370:"char169.jpg",
385:"char169.jpg"
};

// ============================================================
// 内部: 静止画JPEG表示
// ============================================================
// FRAME_TO_JPEG: フレーム番号→JPEG名のマッピング
// 暫定: 未定義フレームは黒画面のまま
// TODO: Phase 3で全静止画フレームのマッピング完成
// ============================================================
var FRAME_TO_JPEG={
	// タイトル/セーブ背景
	74:"char010.jpg",
	// ヘルプ画面 (F5910-5922) → DefineEditText含み、要テキスト抽出
	// おまけ画面 (F5930-5932)
	5932:"char113.jpg",	// 音楽鑑賞モード背景
	// 静止画背景 (F0-73): タイトル系 → 要マッピング
	9:"char002.jpg",
	21:"char004.jpg"
	};

// ============================================================
// BG_LAYER: 背景JPEG常時表示レイヤー
// MAINW内、FLASH_PLAYER(z:0)の下(z:-1)に配置
// wmode=transparent → SWF背景が透明 → load()中も背景が見える
// 表情切替時はBG_LAYERは変わらない（同一背景なら）→ 黒フレーム解消
// ============================================================
var _currentBgJpeg="";

var _bgSwapToken=0;	// ★z130: 背景ダブルバッファのswap世代トークン(enter skip高速時に最新の切替のみ反映)
function _initBgLayer()
	{
	var mainDiv=document.getElementById("MAINW");
	if (!mainDiv) return;
	var img=document.getElementById("BG_LAYER");
	if (img) return; // 既に作成済み
	img=document.createElement("img");
	img.id="BG_LAYER";
	// ★z62: 原版は背景char.jpgを scale1.0 + 左上(0,0)基準で原寸配置(game.swf解析: static配置は全てscale1.0、
	//   translate=char.jpg中心→左上を画面0,0へ)。frame毎のscale変化はアニメ代替のカメラワークで本質と無関係。
	//   従来のfill(width512×height360強制)は512×384を縦圧縮し、char.jpg毎に地平線等が数pxずれていた(篠原報告:位置ずれ)。
	//   object-fit:none(原寸=縮めない) + object-position:0 0(左上基準)で原版を再現。[z111で中心50% 50%を試した→原版の背景Shapeは中心原点(384版bounds=(-256,-192)-(256,192))だが、中心化すると384版背景を使う多くのシーンの絶対位置が12px動き見慣れた表示が崩れ撤回(z112)。原作者の「立ち絵で背景ずれ」は360版↔384版の絶対位置差が根本で、絶対位置を動かさず直すのは別途要検討]。枠(512×360)外(512×384なら下24px等)はclip。
	// ★z129: image-rendering:pixelated(=nearest)。未設定だとブラウザがCSS512px→物理576px(dpr1.125)を
	//   bilinear拡大し鮮鋭度がほぼ半減(計算実証: char078 nearest90.9 vs bilinear44.1)。立ち絵あり時に背景が
	//   BG_LAYER(img)で出るとボケる正体。Ruffleのcanvas描画はnearest相当(シャープ=背景のみ)なので、imgもnearestに
	//   揃えて鮮鋭度を一致させる(立ち絵あり/なしで背景の見た目が変わらないように)。
	img.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;object-fit:none;object-position:0 0;z-index:0;image-rendering:pixelated;";
	mainDiv.appendChild(img);
	// ★z130: 裏バッファ(BG_LAYER_BACK)。enter skip高速のsrc切替デコード隙間によるbg剥げ(下のBODY_BG露出)防止のダブルバッファ用。
	var imgB=document.createElement("img");
	imgB.id="BG_LAYER_BACK";
	imgB.style.cssText=img.style.cssText+"display:none;";
	mainDiv.appendChild(imgB);
	_initBgTintLayer();
	_dbg("BG_LAYER initialized");
	}

// ★z37: ED開始の「黒背景char」等、空SWF(描画物ゼロ)で背景を黒にすべきフレーム。
//   z22の背景維持(下の_currentBgJpeg維持)とは逆の要求＝前の背景(char402海)を残さず黒にする。
//   freezeが強かった頃は前状態保持で黒が見えていたが、z27/z32/z36でfreezeが剥がれ前の背景が露出したため明示的に黒化。
// ★z78: F7590(白→黒フェード id=160)はBG_LAYERがwhite.jpg維持のため、canvasの黒フェード完成後にcanvasが
//   消える/freezeが剥がれると裏のwhite.jpg(白)が露出して「黒→白」に戻る(篠原報告)。F7590もBLACK_BG扱いにして
//   BG_LAYERを黒にすれば、canvasの白→黒フェードは見せたまま、下が黒なのでwhite露出せず黒のまま維持される。
var BLACK_BG_CHAR_FRAMES={188:true,7590:true};	// ED開始のF188 + 白→黒フェード後の黒維持F7590。他で同症状なら番号追加

function _updateBgLayer(num)
	{
	// ★z158: 白フェード(6120/6220/6250)は自前bg JPEGを持たず、従来は下の!file→_currentBgJpeg維持パスで
	//   前シーンの背景(char474=水中ダイバー)をBG_LAYERに残していた。そのためcanvas(白スライド)の切替で
	//   _clearFlashCanvasが走る隙間やcanvasの白が覆いきらない瞬間に、下のBG_LAYER(char474)が一瞬透けて見える
	//   (篠原報告「char474が一瞬見える」)。白フェード中はchar474を維持せず下地をMAINW=白にする。canvasが覆う間は
	//   見た目不変(白フェードはそのまま動く)、隙間で透けてもchar474でなく白=白フェードに溶けて目立たない。
	//   _currentBgJpegはダミーにして次シーンのsetpossで必ず背景が貼り直されるようにする。
	if (num===6120 || num===6220 || num===6250)
		{
		var wbg=document.getElementById("BG_LAYER");
		if (wbg) wbg.style.display="none";
		var wbgB=document.getElementById("BG_LAYER_BACK");
		if (wbgB) wbgB.style.display="none";
		if (typeof _bgSwapToken!=="undefined") _bgSwapToken++;	// 進行中のswapを無効化
		var wmain=document.getElementById("MAINW");
		if (wmain) wmain.style.background="#ffffff";
		_currentBgJpeg="__whitefade__";
		_dbg("white fade BG: MAINW=white, BG_LAYER hidden F"+num);
		return;
		}
	if (BLACK_BG_CHAR_FRAMES[num])
		{
		_hideBgLayer();	// 背景char非表示＋MAINW黒。空SWF(F188「そして…」)の下を黒にする
		_dbg("BG_LAYER black at F"+num+" (ED black-char frame)");
		return;
		}
	var file=FRAME_TO_BG_JPEG[num];
	if (!file)
		{
		// ★ num>=200で自前bg JPEGを持たないフレーム(歩行アニメF250「すたすた」等)。
		//   旧実装は一律 _hideBgLayer()→BG_LAYER非表示+MAINW黒。だがSWFが描画される前に
		//   背景char(BG_LAYER)が黒へ落ちて黒反転する(篠原指摘)。
		//   背景charが既に出ているなら「維持」し、SWFを上に重ねる(charは前～このシーンまで保持)。
		//   背景char未表示(元から黒)の場合のみ従来通り黒にする。
		if (_currentBgJpeg)
			{
			var keepImg=document.getElementById("BG_LAYER");
			if (keepImg) keepImg.style.display="block";
			var keepMain=document.getElementById("MAINW");
			if (keepMain) keepMain.style.background="transparent";
			_dbg("BG_LAYER maintained at F"+num+" (no own bg, keep "+_currentBgJpeg+")");
			}
		else
			_hideBgLayer();
		return;
		}
	if (file===_currentBgJpeg) return; // 同一背景→変更不要
	_currentBgJpeg=file;
	if (!document.getElementById("BG_LAYER")) _initBgLayer();
	var active=document.getElementById("BG_LAYER");
	var back=document.getElementById("BG_LAYER_BACK");
	var mainDiv=document.getElementById("MAINW");
	if (mainDiv) mainDiv.style.background="transparent";	// F0-199: MAINW透明→BG_LAYERが透ける
	if (!_sunsetBgHoldActive) _hideBgTint();
	var url=JPEG_DIR+file;
	// ★z130: ダブルバッファ。裏(back)に新背景をロード→onloadで表示をswap。enter skip高速のsrc切替デコード隙間(bg剥げ=下のBODY_BG露出)を防ぐ。
	if (!back || !active)
		{
		if (active) {active.src=url;active.style.display="block";}
		_dbg("BG_LAYER updated(single):",file);
		return;
		}
	var token=++_bgSwapToken;
	var doSwap=function(){
		if (token!==_bgSwapToken) return;	// より新しい切替が来ていたら破棄(skip高速時=最新だけ反映)
		back.style.display="block";
		active.style.display="none";
		active.id="BG_LAYER_BACK"; back.id="BG_LAYER";	// 表裏入替(getElementById("BG_LAYER")は常に表示中の完成画像を指す)
		_dbg("BG_LAYER swapped:",file);
		};
	back.onload=doSwap; back.onerror=doSwap;
	back.src=url;
	if (back.complete && back.naturalWidth>0) doSwap();	// 既にキャッシュ済みなら即swap
	}

function _hideBgLayer()
	{
	var img=document.getElementById("BG_LAYER");
	if (img) img.style.display="none";
	var imgB=document.getElementById("BG_LAYER_BACK");	// ★z130: 裏バッファも隠す
	if (imgB) imgB.style.display="none";
	if (typeof _bgSwapToken!=="undefined") _bgSwapToken++;	// 進行中のswapを無効化
	_hideBgTint();
	_currentBgJpeg="";
	// F200以降: MAINW黒背景→SWFの透明部分が黒になる
	var mainDiv=document.getElementById("MAINW");
	if (mainDiv) mainDiv.style.background="#000";
	}

function _showJpeg(num)
	{
	var file=FRAME_TO_JPEG[num];
	_pendingStaticBgToken++;
	_clearSceneHoldOverlay();
	_clearDayTransitionOverlay();
	_clearManualFadeOverlay();
	if (!file)
		{
		// マッピング未定義: 黒画面（デバッグ用にログ）
		_dbg("FRAME_TO_JPEG undefined: "+num);
		return;
		}
	// Ruffleプレイヤーを非表示にしてIMG表示
	// （または Ruffleを隠してimg要素をMAINW内に表示）
	var mainDiv=document.getElementById("MAINW");
	var img=document.getElementById("MAINW_JPEG");
	if (!img)
		{
		img=document.createElement("img");
		img.id="MAINW_JPEG";
		img.style.position="absolute";
		img.style.top="0";
		img.style.left="0";
		img.style.width="512px";
		img.style.height="360px";
		img.style.zIndex="2";
		mainDiv.appendChild(img);
		}
	img.src=JPEG_DIR+file;
	img.style.display="block";
	_hideBgTint();
	// Ruffleプレイヤー停止（JPEGがz-index:1で上に表示される）
	if (FLASH_PLAYER) try{FLASH_PLAYER.pause();}catch(e){}
	}

// ============================================================
// omake2 音楽鑑賞モード (Step 9: 本実装)
// 元: FLASH.CurrentFrame/Back/Forward → JS変数管理 + HTML曲名表示
// ============================================================
var _omake2Songs=["01","02","03","04","05","06","07","09","10","11","12","13","14","15","16","17","18",
	"19","20","21","22","23","24","33","34"];
var _omake2Names=[
	"BGM 01","BGM 02","BGM 03","BGM 04","BGM 05",
	"BGM 06","BGM 07","BGM 09","BGM 10","BGM 11",
	"BGM 12","BGM 13","BGM 14","BGM 15","BGM 16",
	"BGM 17","BGM 18","BGM 19","BGM 20","BGM 21",
	"BGM 22","BGM 23","BGM 24","BGM 33","BGM 34"
	];
// TODO: bgmフォルダ内ファイル名 or ゲーム内データから実曲名に差替え

function omake2prev()
	{
	if (_omake2Cursor<=7664) _omake2Cursor=7688;
	else _omake2Cursor--;
	_omake2UpdateDisplay();
	}
function omake2next()
	{
	if (_omake2Cursor>=7688) _omake2Cursor=7664;
	else _omake2Cursor++;
	_omake2UpdateDisplay();
	}
function omake2play()
	{
	var a=_omake2Cursor-7664;
	if (a<0||a>=_omake2Songs.length) return;
	var b=_omake2Songs[a];
	sts_bgm=-1;
	bgmon(b);
	}
function omake2stop(){bgmoff();}
// omake2exit → sys.js に定義（omake()呼び出しのため）

function _omake2Init()
	{
	_omake2Cursor=7664;
	_omake2UpdateDisplay();
	}
var _omake2DispEl=null;
function _omake2UpdateDisplay()
	{
	// ★z45: 下部窓(SUBMSG)でなくMAINW中央の専用オーバーレイに♪曲名を出す(位置修正)。
	//   F5932のタイトル/枠(char456/457)はRuffleで文字化けするため除去済み→中央が空くのでここに表示。
	//   index.htmlの `div{position:absolute}` 罠回避のため内側divは position:static。
	var idx=_omake2Cursor-7664;
	var name=(idx>=0 && idx<_omake2Names.length)?_omake2Names[idx]:"---";
	var num=idx+1;
	var mainDiv=document.getElementById("MAINW");
	if (!_omake2DispEl && mainDiv)
		{
		_omake2DispEl=document.createElement("div");
		_omake2DispEl.id="OMAKE2_DISP";
		_omake2DispEl.style.cssText="position:absolute;top:0;left:0;width:512px;height:360px;z-index:20;pointer-events:none;color:#ffffff;font-family:'MS PGothic',sans-serif;text-shadow:0 0 5px #000,0 0 5px #000;";
		mainDiv.appendChild(_omake2DispEl);
		}
	if (!_omake2DispEl) return;
	_omake2DispEl.innerHTML="<div style='position:static;text-align:center;padding-top:120px;'>"+
		"<div style='position:static;font-size:22px;font-weight:bold;margin-bottom:28px;'>♪ 音楽鑑賞</div>"+
		"<div style='position:static;font-size:14px;color:#bbbbbb;margin-bottom:6px;'>"+num+" / "+_omake2Songs.length+"</div>"+
		"<div style='position:static;font-size:30px;font-weight:bold;'>"+name+"</div></div>";
	_omake2DispEl.style.display="block";
	}
function _hideOmake2Display()
	{
	if (_omake2DispEl) _omake2DispEl.style.display="none";
	}

// ============================================================
// EDテキストオーバーレイ (Step 10)
// Ruffleフォント問題で文字化けするため、HTMLで重ねて表示
// ============================================================
function _showEdOverlay(edNumber)
	{
	var el=document.getElementById("ED_OVERLAY");
	if (!el) return;
	var name=(typeof endt!=="undefined" && endt[edNumber])?endt[edNumber]:"END "+edNumber;
	_loadEndingTimelineMap();
	_endingCurrentEdNumber=edNumber;
	el.innerHTML="END "+edNumber+"<br><span style='font-size:18px'>"+name+"</span>";
	el.style.opacity="0";
	el.style.visibility="hidden";
	}
function _hideEdOverlay()
	{
	var el=document.getElementById("ED_OVERLAY");
	if (el){el.style.visibility="hidden";el.style.opacity="0";}
	}

// ============================================================
// focus互換
// ============================================================
var _endingRollStartedAtMs=0;
var _endingTitleStartedAtMs=0;
var _endingRollTargetDurationMs=0;
var _endingRollBgFront=null;
var _endingRollBgBack=null;
var _endingRollBgFile="";
var _endingRollBgSeq=0;

function _loadEndingTimelineMap()
	{
	if (_endingTimelineMap) return Promise.resolve(_endingTimelineMap);
	if (_endingTimelineMapPromise) return _endingTimelineMapPromise;
	_endingTimelineMapPromise=_loadTextUtf8("../sys/aqcan_ed_background_timeline_corrected.md").then(function(src){
		var map={};
		var lines=src.replace(/\r/g,"").split("\n");
		var i,line,m,ed,current=null,phase="title";
		for(i=0;i<lines.length;i++)
			{
			line=lines[i];
			m=line.match(/^##\s*ED(\d{2})\s+(.*)$/);
			if (m)
				{
				ed=parseInt(m[1],10);
				current={
					edNumber:ed,
					title:m[2].trim(),
					titleSegments:[],
					rollSegments:[],
					titleBeforeScrollSec:0,
					scrollEndSec:0,
					finalCardsEndSec:0
					};
				map[ed]=current;
				phase="title";
				continue;
				}
			if (!current) continue;
			if (/^###\s+/i.test(line))
				{
				phase=/scroll end/i.test(line)?"roll":"title";
				continue;
				}
			m=line.match(/^- title before scroll:\s*([\d.]+)/i);
			if (m)
				{
				current.titleBeforeScrollSec=parseFloat(m[1])||0;
				continue;
				}
			m=line.match(/^- scroll end:\s*([\d.]+)/i);
			if (m)
				{
				current.scrollEndSec=parseFloat(m[1])||0;
				continue;
				}
			m=line.match(/^- final cards end:\s*([\d.]+)/i);
			if (m)
				{
				current.finalCardsEndSec=parseFloat(m[1])||0;
				continue;
				}
			m=line.match(/^- (char\d{3}\.jpg|non-jpeg\/vector segment)\s*\/\s*([\d.]+)[^\/]*\//i);
			if (m)
				{
				(phase==="roll"?current.rollSegments:current.titleSegments).push({
					file:/^char/i.test(m[1])?m[1]:null,
					durationSec:parseFloat(m[2])||0
					});
				}
			}
		if (!Object.keys(map).length) throw new Error("no timeline rows");
		_endingTimelineMap=map;
		_endingTimelineMapPromise=null;
		_dbg("ending timeline loaded:",Object.keys(map).length,"rows");
		return map;
		}).catch(function(err){
		_endingTimelineMapPromise=null;
		_dbg("ending timeline load failed:",err.message);
		return null;
		});
	return _endingTimelineMapPromise;
	}

function _computeEndingRollDurationMs(tl,segmentTotalMs)
	{
	var durationMs=Math.max(0,_endingRollDisplayDurationMs||0,segmentTotalMs||0);
	var timelineMs=0;
	if (tl && tl.finalCardsEndSec>0 && tl.titleBeforeScrollSec>=0)
		{
		timelineMs=Math.round(Math.max(0,tl.finalCardsEndSec-tl.titleBeforeScrollSec)*1000);
		if (timelineMs>durationMs) durationMs=timelineMs;
		}
	if (!(durationMs>0)) durationMs=18000;
	return durationMs;
	}

function _refreshEndingRollCompleteTimer(tl,segmentTotalMs)
	{
	var durationMs=_computeEndingRollDurationMs(tl,segmentTotalMs);
	var elapsedMs=0;
	var remainingMs=durationMs;
	if (_endingRollStartedAtMs>0)
		{
		elapsedMs=Date.now()-_endingRollStartedAtMs;
		remainingMs=Math.max(500,durationMs-elapsedMs);
		}
	_endingRollTargetDurationMs=durationMs;
	_scheduleEndingRollComplete(remainingMs);
	return durationMs;
	}

function _finishEndingRollSequence()
	{
	if (_endingSequenceStage===0) return;
	_clearEndingAutoReturn();	// 曲ended/クリックのリスナーを掃除(別経路完了でも残さない)
	_clearEndingSequenceTimer();
	_clearEndingBackgroundTimers();
	_endingRollStartedAtMs=0;
	_endingRollTargetDurationMs=0;
	_endingSequenceStage=3;
	_hideEndingRollOverlay();
	_hideEndingTitleBgOverlay();
	_hideEndingTintOverlay();
	_hideEdOverlay();
	_dbg("ending roll complete");
	if (typeof _restartTitleAsStartup==="function")
		{
		_endingSequenceStage=0;
		_restartTitleAsStartup();
		return;
		}
	_endingSequenceStage=0;
	}

function _getEndingRollBgEl()
	{
	if (!_endingRollOverlay) return null;
	if (_endingRollOverlay.firstChild && _endingRollOverlay.firstChild!==_endingRollContent) return _endingRollOverlay.firstChild;
	return null;
	}

function _ensureEndingRollBgLayers()
	{
	var ov,bg1,bg2;
	ov=_endingRollOverlay||_ensureEndingRollOverlay();
	if (!ov) return null;
	if (_endingRollBgFront && _endingRollBgBack && _endingRollBgFront.parentNode===ov && _endingRollBgBack.parentNode===ov)
		{
		return {front:_endingRollBgFront,back:_endingRollBgBack};
		}
	bg1=_getEndingRollBgEl();
	if (!bg1 || bg1===_endingRollContent) return null;
	if (!bg1.id) bg1.id="ENDING_ROLL_BG_A";
	bg1.style.zIndex="0";
	bg1.style.opacity=bg1.style.opacity||"1";
	bg1.style.transition="opacity 900ms linear";
	bg1.style.pointerEvents="none";
	bg2=document.getElementById("ENDING_ROLL_BG_B");
	if (!bg2 || !bg2.parentNode)
		{
		bg2=document.createElement("div");
		bg2.id="ENDING_ROLL_BG_B";
		bg2.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;opacity:0;display:block;pointer-events:none;transition:opacity 900ms linear;filter:brightness(0.7) saturate(0.9);";
		ov.insertBefore(bg2,_endingRollContent);
		}
	_endingRollBgFront=bg1;
	_endingRollBgBack=bg2;
	return {front:bg1,back:bg2};
	}

function _setEndingRollBackgroundFile(file,instant)
	{
	var layers,front,back,oldFront,seq;
	if (!file) return false;
	layers=_ensureEndingRollBgLayers();
	if (!layers) return false;
	if (_endingRollBgFile===file && !instant) return true;
	front=layers.front;
	back=layers.back;
	back.style.display="block";
	back.style.backgroundRepeat="no-repeat";
	back.style.backgroundPosition="center center";
	back.style.backgroundSize="cover";
	back.style.filter="brightness(0.7) saturate(0.9)";
	if (instant || !_endingRollBgFile)
		{
		// ★z162→z164: direct(instant)時、CSS background-imageは読込完了まで前の画像を表示し続けるので
		//   imgプリロードしonload後にchar006を差し込む。z162は読込中back.opacity=0で前回charを隠したが、それだと
		//   下のBG_LAYER(char439=ED roll下地の海底)が透けて「erollの前に別背景char439が一瞬見える」(篠原報告)。
		//   z164: 読込中はback.opacity=1のまま背景を黒(backgroundColor#000+image none)にしてBG_LAYERごと覆い隠し、
		//   onloadでchar006背景+黒解除に差し替える。これで前回char(z162の狙い)もBG_LAYER char439も両方隠れる。
		front.style.opacity="0";
		back.style.backgroundImage="none";
		back.style.backgroundColor="#000";
		back.style.opacity="1";
		_endingRollBgFront=back;
		_endingRollBgBack=front;
		_endingRollBgFile=file;
		(function(b,fpath){
			var im=new Image();
			im.onload=im.onerror=function(){
				if (_endingRollBgFront!==b) return;	// より新しい背景が来ていたら破棄
				b.style.backgroundImage="url('"+fpath+"')";
				b.style.backgroundColor="";
				b.style.opacity="1";
				_dbg("ENDING_ROLL bg direct (preloaded):",fpath);
				};
			im.src=fpath;
			})(back,"../swf/extracted_jpeg/"+file);
		return true;
		}
	back.style.backgroundImage="url('../swf/extracted_jpeg/"+file+"')";
	oldFront=front;
	seq=++_endingRollBgSeq;
	back.style.opacity="0";
	void back.offsetHeight;
	back.style.opacity="1";
	oldFront.style.opacity="0";
	_endingRollBgFront=back;
	_endingRollBgBack=oldFront;
	_endingRollBgFile=file;
	setTimeout(function(){
		if (seq!==_endingRollBgSeq) return;
		if (oldFront) oldFront.style.display="block";
		},920);
	_dbg("ENDING_ROLL bg fade:",file);
	return true;
	}

function _scheduleEndingBackgroundSegments(segments)
	{
	var i,seg,offsetMs=0,totalMs=0,id,useRollLayer=false;
	_clearEndingBackgroundTimers();
	useRollLayer=(_endingSequenceStage===2 && _endingRollOverlay && _endingRollOverlay.style.visibility!=="hidden");
	if (!segments||!segments.length) return 0;
	for(i=0;i<segments.length;i++)
		{
		seg=segments[i];
		if (seg && seg.file)
			{
			if (offsetMs<=0)
				{
				if (useRollLayer) _setEndingRollBackgroundFile(seg.file);
				else showBackgroundFile(seg.file);
				}
			else
				{
				(function(file,delay,rollLayer){
					id=setTimeout(function(){
						if (rollLayer)
							{
							if (_endingSequenceStage!==2) return;
							_setEndingRollBackgroundFile(file);
							}
						else
							{
							if (_endingSequenceStage!==1 && _endingSequenceStage!==2) return;
							showBackgroundFile(file);
							}
						_dbg("ending bg:",file,"at",delay+"ms");
						},delay);
					_endingBackgroundTimers.push(id);
					})(seg.file,offsetMs,useRollLayer);
				}
			}
		offsetMs+=Math.round(((seg&&seg.durationSec)||0)*1000);
		}
	totalMs=offsetMs;
	return totalMs;
	}

function _showEndingRollOverlay(edNumber)
	{
	var ov=_ensureEndingRollOverlay();
	var bgEl,fallbackLines,durationMs;
	if (!ov||!_endingRollContent) return;
	_endingRollBgFile="";
	_endingRollBgSeq=0;
	bgEl=_getEndingRollBgEl();
	ov.style.background="transparent";
	if (bgEl) bgEl.style.display="block";
	ov.style.transition="none";
	ov.style.visibility="visible";
	ov.style.opacity="1";
	_endingRollContent.textContent="";
	_endingRollDisplayDurationMs=0;
	fallbackLines=[
		"",
		"Credits",
		"",
		"Aquanaut Campus",
		"",
		"Pleiades Company",
		"Original Release 2002-2007",
		"",
		"Thank you for playing",
		""
		];
	durationMs=_applyEndingRollLines(fallbackLines);
	_endingRollDisplayDurationMs=durationMs;
	// ★z172(2026-06-21): 影早発バグ修正。timeline(別fetch=_loadEndingTimelineMap)をcreditsより先に待つ。
	//   従来は_getEndingCreditsHtml解決時にtimeline未ロード→tl=null→scrollMs=0→durationMs=18591(fallback
	//   distancePx/32.8)になり、Pleiades影(中央停止時演出)がスクロール途中で早発=「影つきで流れてくる」(ED20篠原報告)。
	//   timeline→creditsの順に待ってtlロード済(scrollMs=実尺185916等)を保証し、影を中央停止時(=durationMs後)に正しく出す。
	_loadEndingTimelineMap().then(function(){ return _getEndingCreditsHtml(); }).then(function(frag){
		var tl,scrollMs;
		if (_endingSequenceStage!==2 || !_endingRollOverlay || _endingRollOverlay.style.visibility==="hidden") return;
		if (!frag) return;	// 取得失敗時は上のfallback(暫定textContent)のまま
		tl=_getEndingTimelineInfo(_endingCurrentEdNumber);
		scrollMs=(tl&&tl.scrollEndSec>0&&tl.titleBeforeScrollSec>=0)?(tl.scrollEndSec-tl.titleBeforeScrollSec)*1000:0;
		durationMs=_applyEndingRollHtml(frag,scrollMs);	// 完了制御(曲終了で自動戻り+保険)は _applyEndingRollHtml 内の _armEndingAutoReturn が担う
		_endingRollDisplayDurationMs=durationMs;
		_dbg("ed credits applied","ms="+durationMs,"scrollEnd="+(tl?tl.scrollEndSec:"-"));
		});
	}

function _startEndingRollSequence(crossfadeMs)
	{
	var tl=_getEndingTimelineInfo(_endingCurrentEdNumber);
	var segmentTotalMs=0;
	var durationMs=0;
	var initialRollBgFile=(tl && tl.rollSegments && tl.rollSegments.length && tl.rollSegments[0] && tl.rollSegments[0].file)?tl.rollSegments[0].file:"char439.jpg";
	var ov=null;
	var doCrossfade=(crossfadeMs>0);
	_endingSequenceStage=2;
	_endingRollStartedAtMs=Date.now();
	// ★ 観察用: タイトル開始からロール開始までの実測経過を、原作「title before scroll」と並べて出す。
	//   両者が擦り合ってれば差≈0、固定10秒が原作とズレてるなら差で見える。
	if (_endingTitleStartedAtMs>0)
		{
		var _titleElapsedMs=Date.now()-_endingTitleStartedAtMs;
		var _origTitleMs=(tl&&tl.titleBeforeScrollSec)?Math.round(tl.titleBeforeScrollSec*1000):0;
		_dbg("ending roll start","ed="+_endingCurrentEdNumber,
			"title->roll elapsed="+_titleElapsedMs+"ms",
			"orig titleBeforeScroll="+(_origTitleMs?_origTitleMs+"ms":"-"),
			"diff="+(_origTitleMs?(_titleElapsedMs-_origTitleMs)+"ms":"-"));
		}
	_hideMainJpeg();
	if (!doCrossfade)
		{
		_hideEndingTitleBgOverlay();
		_hideEndingTintOverlay();
		_hideEdOverlay();
		}
	_showEndingRollOverlay(_endingCurrentEdNumber);
	ov=_endingRollOverlay;
	if (doCrossfade && ov)
		{
		ov.style.transition="none";
		ov.style.visibility="visible";
		ov.style.opacity="0";
		void ov.offsetHeight;
		ov.style.transition="opacity "+crossfadeMs+"ms linear";
		ov.style.opacity="1";
		if (_endingTintOverlay)
			{
			_endingTintOverlay.style.transition="opacity "+crossfadeMs+"ms linear";
			_endingTintOverlay.style.opacity="0";
			}
		}
	// ★ crossfade中にFlash Playerの残骸(タイトルフレーム等)がロールオーバーレイ越しに透けて
	//   「黒→一瞬char→ロール」になる問題(篠原指摘,ED16)。
	//   ロール表示はHTMLオーバーレイ(ov)が担うので、_loadGameSWF(フォント注入目的)を
	//   オーバーレイがopacity=1になってから(crossfadeMs後)遅延ロードする。
	//   この間Flashは非表示のまま→charが絶対透けない。クレジットHTMLは既に描画済みなので遅延無問題。
	if (doCrossfade)
		{
		_hideFlashPlayerVisualOnly();
		setTimeout(function(){
			// ★z163: F7619(ロール本体)ロードのvisible復帰時、canvasに前タイトル(F7739等)/前回EDの残骸が残ったまま
			//   freeze化され、ロール開始に一瞬「全く関係ないswf/別のEDロール入り」が映る(篠原報告)。z161(opmovie)と同型。
			//   _loadGameSWFの前にcanvasをクリアして残骸を消す(背景char006のz162プリロードとは別系統=こちらはcanvas側)。
			if (typeof _clearFlashCanvas==="function") _clearFlashCanvas();
			_loadGameSWF("game_F7619.swf",76,false);
			// ★ _loadGameSWF内で_captureOverlay→z9のgameOverlayが生成される。
			//   z9はロールオーバーレイ(z6)より上なので、Flashの残骸が一瞬被さって見える。
			//   ロールは既にopacity=1で全面覆い済みなので即撤去して問題なし。
			_clearGameOverlay();
			},crossfadeMs);
		}
	else
		{
		if (typeof _clearFlashCanvas==="function") _clearFlashCanvas();	// ★z163: F7619ロードのvisible復帰前にcanvas残骸を消す(z161同型・別SWF/別EDロール入りの一瞬対策)
		_loadGameSWF("game_F7619.swf",76,false);
		setTimeout(function(){_hideFlashPlayerVisualOnly();},60);
		}
	_setEndingRollBackgroundFile(initialRollBgFile,true);
	if (tl && tl.rollSegments && tl.rollSegments.length)
		{
		segmentTotalMs=_scheduleEndingBackgroundSegments(tl.rollSegments);
		}
	durationMs=_refreshEndingRollCompleteTimer(tl,segmentTotalMs);
	_dbg("ending roll started","ms="+durationMs,"segments="+((tl&&tl.rollSegments)?tl.rollSegments.length:0));
	}

function _hideEndingRollOverlay()
	{
	var bgEl;
	if (!_endingRollOverlay) return;
	_endingRollOverlay.style.transition="none";
	_endingRollOverlay.style.visibility="hidden";
	_endingRollOverlay.style.opacity="0";
	_endingRollBgFile="";
	_endingRollBgSeq=0;
	bgEl=_getEndingRollBgEl();
	if (bgEl) bgEl.style.opacity="1";
	if (_endingRollBgBack) _endingRollBgBack.style.opacity="0";
	if (_endingRollContent)
		{
		_endingRollContent.style.transition="none";
		_endingRollContent.style.transform="translateY(0)";
		}
	}

function _startEndingTitleSequence()
	{
	var el=document.getElementById("ED_OVERLAY");
	var bgEl=_ensureEndingTitleBgOverlay();
	var tintEl=_ensureEndingTintOverlay();
	var bgFile=_getEndingTitleBackgroundFile(_endingCurrentEdNumber);
	var titleMs=10000;
	var fadeMs=1200;
	var blackHoldMs=1000;
	var titleTl=_getEndingTimelineInfo(_endingCurrentEdNumber);
	_endingSequenceStage=1;
	_endingTitleStartedAtMs=Date.now();
	// ★ 観察用: 現在のタイトル固定尺と、原作タイムラインの「title before scroll」を並べて出す。
	//   実際の経過(タイトル開始→ロール開始)は _startEndingRollSequence 側で計測ログする。
	_dbg("ending title start","ed="+_endingCurrentEdNumber,
		"titleMs(fixed)="+titleMs,
		"orig titleBeforeScroll="+((titleTl&&titleTl.titleBeforeScrollSec)?(titleTl.titleBeforeScrollSec+"s="+Math.round(titleTl.titleBeforeScrollSec*1000)+"ms"):"-"));
	_hideMainJpeg();
	_hideFlashPlayerVisualOnly();
	if (bgEl)
		{
		bgEl.style.transition="none";
		bgEl.style.backgroundImage="url('../swf/extracted_jpeg/"+bgFile+"')";
		bgEl.style.visibility="visible";
		bgEl.style.opacity="0";
		}
	if (tintEl)
		{
		// ★ ED毎のtint色を乗算で適用(原作再現)。ED00/15=紫青、他=無彩色暗転/無tint。
		tintEl.style.background=_ED_TITLE_TINT[_endingCurrentEdNumber]||"rgb(180,180,180)";
		tintEl.style.mixBlendMode="multiply";
		tintEl.style.transition="none";
		tintEl.style.visibility="visible";
		tintEl.style.opacity="0";
		}
	if (el)
		{
		el.style.transition="none";
		el.style.opacity="0";
		el.style.visibility="visible";
		}
	requestAnimationFrame(function(){
		requestAnimationFrame(function(){
			if (bgEl)
				{
				bgEl.style.transition="opacity "+fadeMs+"ms linear";
				bgEl.style.opacity="1";
				}
			if (tintEl)
				{
				tintEl.style.transition="opacity "+fadeMs+"ms linear";
				tintEl.style.opacity="1";
				}
			if (el)
				{
				el.style.transition="opacity "+fadeMs+"ms linear";
				el.style.opacity="1";
				}
			});
		});
	if (titleMs<fadeMs) fadeMs=Math.max(200,titleMs);
	_clearEndingSequenceTimer();
	// ★ タイトル→ロールは「黒フェード」を挟む2段遷移(篠原指示で復帰)。
	//   ①タイトル(文字ED_OVERLAY/背景)をフェードアウトして黒へ ②黒を1秒ホールド
	//   ③黒からロールをフェードイン。
	_endingSequenceTimer=setTimeout(function(){
		var edEl=document.getElementById("ED_OVERLAY");
		_endingSequenceTimer=null;
		if (edEl)
			{
			edEl.style.transition="opacity "+fadeMs+"ms linear";
			edEl.style.opacity="0";
			}
		if (bgEl)
			{
			bgEl.style.transition="opacity "+fadeMs+"ms linear";
			bgEl.style.opacity="0";
			}
		// ★ タイトル背景(bgEl,z3)だけ消すと下の freeze overlay(z2)に焼かれた
		//   「ED突入直前の古い背景char」が透けて、黒フェード直前に背景charが一瞬
		//   切り替わって見える(篠原指摘,ED16)。freeze overlayと tint も同じ尺で
		//   フェードアウトし、下を露出させず確実に黒へ落とす。
		if (_freezeOverlay)
			{
			_freezeOverlay.style.transition="opacity "+fadeMs+"ms linear";
			_freezeOverlay.style.opacity="0";
			}
		if (tintEl)
			{
			tintEl.style.transition="opacity "+fadeMs+"ms linear";
			tintEl.style.opacity="0";
			}
		_endingSequenceTimer=setTimeout(function(){
			_endingSequenceTimer=null;
			_hideEndingTitleBgOverlay();
			_hideEdOverlay();
			_unfreezePlayer();	// ★ 透けの元になる古いfreeze焼き込みを撤去
			_hideFlashPlayerVisualOnly();	// ★ Flashに残るタイトルフレームも隠し黒ホールドを保つ
			_endingSequenceTimer=setTimeout(function(){
				_endingSequenceTimer=null;
				_startEndingRollSequence(fadeMs);
				},blackHoldMs);
			},fadeMs);
		},titleMs);
	}

function _findEndingRollSectionByTitle(sections,title)
	{
	var i;
	if (!sections||!sections.length) return null;
	for(i=0;i<sections.length;i++)
		{
		if (sections[i] && sections[i].title===title) return sections[i];
		}
	return null;
	}

function _normalizeEndingRollSectionTitle(title)
	{
	if (!title) return "";
	return String(title).replace(/\s+\d+(?:本|件)\s*$/,"");
	}

function _buildEndingRollLinesFromSections(sections)
	{
	var lines=["","Credits",""];
	var staff=_findEndingRollSectionByTitle(sections,"通常スタッフ");
	var orderTitles=["画像素材集提供","音楽素材集提供","効果音素材提供","開発環境","技術資料","参照資料提供","デバッグ協力"];
	var i,j,section,item,makioItems=[];
	if (!sections||!sections.length) return null;
	if (staff && staff.items && staff.items.length)
		{
		for(i=0;i<staff.items.length;i++)
			{
			item=staff.items[i];
			if (/MAKIO|まきお|マキヲ/i.test(item)) makioItems.push(item);
			}
		if (!makioItems.length) makioItems=staff.items.slice(0);
		lines.push("通常スタッフ");
		lines.push("");
		for(i=0;i<makioItems.length;i++) lines.push(makioItems[i]);
		lines.push("");
		}
	for(i=0;i<orderTitles.length;i++)
		{
		section=_findEndingRollSectionByTitle(sections,orderTitles[i]);
		if (!section||!section.items||!section.items.length) continue;
		lines.push(_normalizeEndingRollSectionTitle(section.title));
		lines.push("");
		for(j=0;j<section.items.length;j++) lines.push(section.items[j]);
		lines.push("");
		}
	lines.push("企画制作");
	lines.push("");
	lines.push("Pleiades Company");
	lines.push("");
	return lines;
	}

function _applyEndingRollLines(lines)
	{
	var contentHeight,distancePx,durationMs;
	if (!_endingRollContent) return 18000;
	_endingRollContent.textContent=(lines&&lines.length)?lines.join("\n"):"";
	_endingRollContent.style.transition="none";
	_endingRollContent.style.transform="translateY(0)";
	void _endingRollContent.offsetHeight;
	contentHeight=_endingRollContent.scrollHeight||0;
	distancePx=Math.max(720,contentHeight+420);
	durationMs=Math.max(60000,Math.min(240000,Math.round(distancePx/27.5*1000)));
	_endingRollContent.style.transition="transform "+durationMs+"ms linear";
	_endingRollContent.style.transform="translateY(-"+distancePx+"px)";
	return durationMs;
	}

function focus()
	{
	try{window.focus();}catch(e){}
	}
