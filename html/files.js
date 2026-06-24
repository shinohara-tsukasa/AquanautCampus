// ============================================================
// files.js — Step 5: localStorage化 + LoadScn fetch/async化
// ============================================================
// 元: ActiveXObject(FSO) → localStorage
// 元: fso.OpenTextFile → fetch + Shift-JISデコード
// csave/cload: 無改修（文字列操作のみ）
// ============================================================

var LF_FlashReg=new Array(99);
var scn=new Array();

// --- 初期化: localStorageからセーブデータ読込 ---
(function(){
	var i;
	for(i=0;i<=60;i++)
		{
		var v=localStorage.getItem("ac_"+i);
		LF_FlashReg[i]=(v!==null)?v:"";
		}
})();

// **********************************************
// csave — 無改修（メモリ上KVS操作）
// **********************************************
function csave(file,section,data)
	{
	var stt=0;
	var end=0;
	var s;
	s=LF_FlashReg[file];
	stt=s.indexOf(section+"=",0);
	if (stt==-1)
		{
		s+=section+"="+data+"/";
		}
	else	{
		end=s.indexOf("/",stt);
		s1=s.substring(0,stt);
		s2=s.substring(end+1,s.length);
		s=s1+s2+section+"="+data+"/";
		}
	LF_FlashReg[file]=s;
	}
// **********************************************
// cload — 無改修
// **********************************************
function cload(file,section)
	{
	var stt=0;
	var end=0;
	var len=0;
	var secs="";
	var v;
	s=LF_FlashReg[file];
	stt=s.indexOf(section+"=",0);
	if (stt==-1) return null;
	len=section.length;
	end=s.indexOf("/",stt);
	v=s.substring(stt+len+1,end);
	return v;
	}
// **********************************************
// cwrite — localStorage書き出し
// **********************************************
function cwrite(file)
	{
	localStorage.setItem("ac_"+file,LF_FlashReg[file]);
	}
// **********************************************
// LoadScn — fetch + Shift-JISデコード (async)
// 呼び出し元(readfile@sys.js)をawait対応する必要あり
// **********************************************
async function LoadScn(file)
	{
	var i=0;
	try{
		var resp=await fetch("../sys/"+file+".dat?cb="+Date.now());	// ★切り分け用キャッシュバスター(.dat改変を確実に反映。検証後に戻す)
		if (!resp.ok){scn[0]="";return;}
		var buf=await resp.arrayBuffer();
		var decoder=new TextDecoder("shift_jis");
		var text=decoder.decode(buf);
		var lines=text.split(/\r?\n/);
		for(i=0;i<lines.length;i++)
			{
			if (lines[i].length<1) break;
			scn[i]=lines[i];
			}
		scn[i]="";
		}
	catch(e){scn[0]="";}
	}
