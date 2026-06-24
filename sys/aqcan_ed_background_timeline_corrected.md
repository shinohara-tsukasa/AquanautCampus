# アクアノートキャンパス ED背景JPG順・秒数まとめ 修正版

前回の短い秒数表は誤り。今回の表は game.swf 原本の入れ子 sprite を追い直した修正版。

前回との違い:
- 親 END title sprite だけで切らず、その先で配置される長尺の credits sprite まで追跡した。
- 各 ED の「スクロール終了時刻」は credits sprite の frame 2231 を基準に再計算した。
- 各 ED の「最終カード終了時刻」は credits sprite の frame 2331 を基準に併記した。
- 背景順は roll 側の depth 1 JPEG 切替を frame 単位で追い直した。

凡例:
- scroll end: 最後のスクロール本文が抜ける時刻
- final cards end: スクロール後の終端カードまで含めた時刻
- non-jpeg/vector: そのスロットでは JPEG を確認できず、ベクタ/オーバーレイ系のキャラが置かれている

## ED00 夢やぶれて
- root frame: 7694
- title sprite: 566
- tail sprite: 565
- background variant sprite: 547
- credits sprite: 564
- title before scroll: 14.083秒
- scroll end: 200.0秒
- final cards end: 208.333秒

### タイトル相当区間
- non-jpeg/vector segment / 2.417秒 / ED開始+0.0秒〜2.417秒
- char225.jpg / 11.667秒 / ED開始+2.417秒〜14.083秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.083秒〜25.75秒
- char035.jpg / 11.667秒 / ED開始+25.75秒〜37.417秒
- char169.jpg / 11.667秒 / ED開始+37.417秒〜49.083秒
- char113.jpg / 11.667秒 / ED開始+49.083秒〜60.75秒
- char119.jpg / 11.667秒 / ED開始+60.75秒〜72.417秒
- char110.jpg / 11.667秒 / ED開始+72.417秒〜84.083秒
- char054.jpg / 11.667秒 / ED開始+84.083秒〜95.75秒
- char091.jpg / 11.667秒 / ED開始+95.75秒〜107.417秒
- char123.jpg / 11.667秒 / ED開始+107.417秒〜119.083秒
- char078.jpg / 11.667秒 / ED開始+119.083秒〜130.75秒
- char107.jpg / 11.667秒 / ED開始+130.75秒〜142.417秒
- char187.jpg / 11.667秒 / ED開始+142.417秒〜154.083秒
- char197.jpg / 11.667秒 / ED開始+154.083秒〜165.75秒
- char439.jpg / 11.667秒 / ED開始+165.75秒〜177.417秒
- char225.jpg / 11.667秒 / ED開始+177.417秒〜189.083秒
- char173.jpg / 10.917秒 / ED開始+189.083秒〜200.0秒

### 注記
- Title phase begins with a non-JPEG/vector segment before the first confirmed JPEG appears.

## ED01 二人のキャンパス
- root frame: 7697
- title sprite: 571
- tail sprite: 570
- background variant sprite: 569
- credits sprite: 564
- title before scroll: 12.417秒
- scroll end: 198.333秒
- final cards end: 206.667秒

### タイトル相当区間
- char265.jpg / 12.417秒 / ED開始+0.0秒〜12.417秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+12.417秒〜24.083秒
- char035.jpg / 11.667秒 / ED開始+24.083秒〜35.75秒
- char169.jpg / 11.667秒 / ED開始+35.75秒〜47.417秒
- char113.jpg / 11.667秒 / ED開始+47.417秒〜59.083秒
- char119.jpg / 11.667秒 / ED開始+59.083秒〜70.75秒
- char110.jpg / 11.667秒 / ED開始+70.75秒〜82.417秒
- char054.jpg / 11.667秒 / ED開始+82.417秒〜94.083秒
- char091.jpg / 11.667秒 / ED開始+94.083秒〜105.75秒
- char123.jpg / 11.667秒 / ED開始+105.75秒〜117.417秒
- char078.jpg / 11.667秒 / ED開始+117.417秒〜129.083秒
- char107.jpg / 11.667秒 / ED開始+129.083秒〜140.75秒
- char187.jpg / 11.667秒 / ED開始+140.75秒〜152.417秒
- char197.jpg / 11.667秒 / ED開始+152.417秒〜164.083秒
- char439.jpg / 11.667秒 / ED開始+164.083秒〜175.75秒
- char072.jpg / 11.667秒 / ED開始+175.75秒〜187.417秒
- char176.jpg / 10.917秒 / ED開始+187.417秒〜198.333秒

## ED02 前途を見据えて
- root frame: 7700
- title sprite: 577
- tail sprite: 576
- background variant sprite: 574
- credits sprite: 575
- title before scroll: 12.417秒
- scroll end: 198.333秒
- final cards end: 206.667秒

### タイトル相当区間
- non-jpeg/vector segment / 3.167秒 / ED開始+0.0秒〜3.167秒
- char225.jpg / 9.25秒 / ED開始+3.167秒〜12.417秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+12.417秒〜24.083秒
- char035.jpg / 11.667秒 / ED開始+24.083秒〜35.75秒
- char169.jpg / 11.667秒 / ED開始+35.75秒〜47.417秒
- char113.jpg / 11.667秒 / ED開始+47.417秒〜59.083秒
- char119.jpg / 11.667秒 / ED開始+59.083秒〜70.75秒
- char110.jpg / 11.667秒 / ED開始+70.75秒〜82.417秒
- char054.jpg / 11.667秒 / ED開始+82.417秒〜94.083秒
- char091.jpg / 11.667秒 / ED開始+94.083秒〜105.75秒
- char123.jpg / 11.667秒 / ED開始+105.75秒〜117.417秒
- char078.jpg / 11.667秒 / ED開始+117.417秒〜129.083秒
- char107.jpg / 11.667秒 / ED開始+129.083秒〜140.75秒
- char187.jpg / 11.667秒 / ED開始+140.75秒〜152.417秒
- char206.jpg / 11.667秒 / ED開始+152.417秒〜164.083秒
- char197.jpg / 11.667秒 / ED開始+164.083秒〜175.75秒
- char439.jpg / 11.667秒 / ED開始+175.75秒〜187.417秒
- char194.jpg / 10.917秒 / ED開始+187.417秒〜198.333秒

### 注記
- Title phase begins with a non-JPEG/vector segment before the first confirmed JPEG appears.

## ED03 広がる世界
- root frame: 7703
- title sprite: 580
- tail sprite: 576
- background variant sprite: 574
- credits sprite: 575
- title before scroll: 14.167秒
- scroll end: 200.083秒
- final cards end: 208.417秒

### タイトル相当区間
- char333.jpg / 14.167秒 / ED開始+0.0秒〜14.167秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.167秒〜25.833秒
- char035.jpg / 11.667秒 / ED開始+25.833秒〜37.5秒
- char169.jpg / 11.667秒 / ED開始+37.5秒〜49.167秒
- char113.jpg / 11.667秒 / ED開始+49.167秒〜60.833秒
- char119.jpg / 11.667秒 / ED開始+60.833秒〜72.5秒
- char110.jpg / 11.667秒 / ED開始+72.5秒〜84.167秒
- char054.jpg / 11.667秒 / ED開始+84.167秒〜95.833秒
- char091.jpg / 11.667秒 / ED開始+95.833秒〜107.5秒
- char123.jpg / 11.667秒 / ED開始+107.5秒〜119.167秒
- char078.jpg / 11.667秒 / ED開始+119.167秒〜130.833秒
- char107.jpg / 11.667秒 / ED開始+130.833秒〜142.5秒
- char187.jpg / 11.667秒 / ED開始+142.5秒〜154.167秒
- char206.jpg / 11.667秒 / ED開始+154.167秒〜165.833秒
- char197.jpg / 11.667秒 / ED開始+165.833秒〜177.5秒
- char439.jpg / 11.667秒 / ED開始+177.5秒〜189.167秒
- char194.jpg / 10.917秒 / ED開始+189.167秒〜200.083秒

## ED04 憧れ
- root frame: 7706
- title sprite: 583
- tail sprite: 576
- background variant sprite: 574
- credits sprite: 575
- title before scroll: 14.083秒
- scroll end: 200.0秒
- final cards end: 208.333秒

### タイトル相当区間
- char225.jpg / 14.083秒 / ED開始+0.0秒〜14.083秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.083秒〜25.75秒
- char035.jpg / 11.667秒 / ED開始+25.75秒〜37.417秒
- char169.jpg / 11.667秒 / ED開始+37.417秒〜49.083秒
- char113.jpg / 11.667秒 / ED開始+49.083秒〜60.75秒
- char119.jpg / 11.667秒 / ED開始+60.75秒〜72.417秒
- char110.jpg / 11.667秒 / ED開始+72.417秒〜84.083秒
- char054.jpg / 11.667秒 / ED開始+84.083秒〜95.75秒
- char091.jpg / 11.667秒 / ED開始+95.75秒〜107.417秒
- char123.jpg / 11.667秒 / ED開始+107.417秒〜119.083秒
- char078.jpg / 11.667秒 / ED開始+119.083秒〜130.75秒
- char107.jpg / 11.667秒 / ED開始+130.75秒〜142.417秒
- char187.jpg / 11.667秒 / ED開始+142.417秒〜154.083秒
- char206.jpg / 11.667秒 / ED開始+154.083秒〜165.75秒
- char197.jpg / 11.667秒 / ED開始+165.75秒〜177.417秒
- char439.jpg / 11.667秒 / ED開始+177.417秒〜189.083秒
- char194.jpg / 10.917秒 / ED開始+189.083秒〜200.0秒

## ED05 私のセンセイ
- root frame: 7709
- title sprite: 586
- tail sprite: 576
- background variant sprite: 574
- credits sprite: 575
- title before scroll: 14.083秒
- scroll end: 200.0秒
- final cards end: 208.333秒

### タイトル相当区間
- char283.jpg / 14.083秒 / ED開始+0.0秒〜14.083秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.083秒〜25.75秒
- char035.jpg / 11.667秒 / ED開始+25.75秒〜37.417秒
- char169.jpg / 11.667秒 / ED開始+37.417秒〜49.083秒
- char113.jpg / 11.667秒 / ED開始+49.083秒〜60.75秒
- char119.jpg / 11.667秒 / ED開始+60.75秒〜72.417秒
- char110.jpg / 11.667秒 / ED開始+72.417秒〜84.083秒
- char054.jpg / 11.667秒 / ED開始+84.083秒〜95.75秒
- char091.jpg / 11.667秒 / ED開始+95.75秒〜107.417秒
- char123.jpg / 11.667秒 / ED開始+107.417秒〜119.083秒
- char078.jpg / 11.667秒 / ED開始+119.083秒〜130.75秒
- char107.jpg / 11.667秒 / ED開始+130.75秒〜142.417秒
- char187.jpg / 11.667秒 / ED開始+142.417秒〜154.083秒
- char206.jpg / 11.667秒 / ED開始+154.083秒〜165.75秒
- char197.jpg / 11.667秒 / ED開始+165.75秒〜177.417秒
- char439.jpg / 11.667秒 / ED開始+177.417秒〜189.083秒
- char194.jpg / 10.917秒 / ED開始+189.083秒〜200.0秒

## ED06 夕暮れの憩い
- root frame: 7712
- title sprite: 589
- tail sprite: 576
- background variant sprite: 574
- credits sprite: 575
- title before scroll: 14.167秒
- scroll end: 200.083秒
- final cards end: 208.417秒

### タイトル相当区間
- char113.jpg / 14.167秒 / ED開始+0.0秒〜14.167秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.167秒〜25.833秒
- char035.jpg / 11.667秒 / ED開始+25.833秒〜37.5秒
- char169.jpg / 11.667秒 / ED開始+37.5秒〜49.167秒
- char113.jpg / 11.667秒 / ED開始+49.167秒〜60.833秒
- char119.jpg / 11.667秒 / ED開始+60.833秒〜72.5秒
- char110.jpg / 11.667秒 / ED開始+72.5秒〜84.167秒
- char054.jpg / 11.667秒 / ED開始+84.167秒〜95.833秒
- char091.jpg / 11.667秒 / ED開始+95.833秒〜107.5秒
- char123.jpg / 11.667秒 / ED開始+107.5秒〜119.167秒
- char078.jpg / 11.667秒 / ED開始+119.167秒〜130.833秒
- char107.jpg / 11.667秒 / ED開始+130.833秒〜142.5秒
- char187.jpg / 11.667秒 / ED開始+142.5秒〜154.167秒
- char206.jpg / 11.667秒 / ED開始+154.167秒〜165.833秒
- char197.jpg / 11.667秒 / ED開始+165.833秒〜177.5秒
- char439.jpg / 11.667秒 / ED開始+177.5秒〜189.167秒
- char194.jpg / 10.917秒 / ED開始+189.167秒〜200.083秒

## ED07 別れの告白
- root frame: 7715
- title sprite: 594
- tail sprite: 593
- background variant sprite: 592
- credits sprite: 564
- title before scroll: 12.417秒
- scroll end: 198.333秒
- final cards end: 206.667秒

### タイトル相当区間
- char265.jpg / 12.417秒 / ED開始+0.0秒〜12.417秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+12.417秒〜24.083秒
- char035.jpg / 11.667秒 / ED開始+24.083秒〜35.75秒
- char169.jpg / 11.667秒 / ED開始+35.75秒〜47.417秒
- char113.jpg / 11.667秒 / ED開始+47.417秒〜59.083秒
- char119.jpg / 11.667秒 / ED開始+59.083秒〜70.75秒
- char110.jpg / 11.667秒 / ED開始+70.75秒〜82.417秒
- char054.jpg / 11.667秒 / ED開始+82.417秒〜94.083秒
- char091.jpg / 11.667秒 / ED開始+94.083秒〜105.75秒
- char245.jpg / 11.667秒 / ED開始+105.75秒〜117.417秒
- char078.jpg / 11.667秒 / ED開始+117.417秒〜129.083秒
- non-jpeg/vector segment / 11.667秒 / ED開始+129.083秒〜140.75秒
- char203.jpg / 11.667秒 / ED開始+140.75秒〜152.417秒
- char197.jpg / 11.667秒 / ED開始+152.417秒〜164.083秒
- char220.jpg / 11.667秒 / ED開始+164.083秒〜175.75秒
- char162.jpg / 11.667秒 / ED開始+175.75秒〜187.417秒
- char276.jpg / 10.917秒 / ED開始+187.417秒〜198.333秒

### 注記
- Roll phase contains a non-JPEG/vector segment inside the background timeline; no JPEG could be confirmed for that slot from the SWF tags.

## ED08 彼女の志
- root frame: 7718
- title sprite: 599
- tail sprite: 598
- background variant sprite: 597
- credits sprite: 564
- title before scroll: 11.667秒
- scroll end: 197.583秒
- final cards end: 205.917秒

### タイトル相当区間
- char296.jpg / 11.667秒 / ED開始+0.0秒〜11.667秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+11.667秒〜23.333秒
- char035.jpg / 11.667秒 / ED開始+23.333秒〜35.0秒
- char169.jpg / 11.667秒 / ED開始+35.0秒〜46.667秒
- char113.jpg / 11.667秒 / ED開始+46.667秒〜58.333秒
- char119.jpg / 11.667秒 / ED開始+58.333秒〜70.0秒
- char110.jpg / 11.667秒 / ED開始+70.0秒〜81.667秒
- char054.jpg / 11.667秒 / ED開始+81.667秒〜93.333秒
- char091.jpg / 11.667秒 / ED開始+93.333秒〜105.0秒
- char123.jpg / 11.667秒 / ED開始+105.0秒〜116.667秒
- char078.jpg / 11.667秒 / ED開始+116.667秒〜128.333秒
- char107.jpg / 11.667秒 / ED開始+128.333秒〜140.0秒
- char187.jpg / 11.667秒 / ED開始+140.0秒〜151.667秒
- char190.jpg / 11.667秒 / ED開始+151.667秒〜163.333秒
- char220.jpg / 11.667秒 / ED開始+163.333秒〜175.0秒
- char209.jpg / 11.667秒 / ED開始+175.0秒〜186.667秒
- char296.jpg / 10.917秒 / ED開始+186.667秒〜197.583秒

## ED09 夏への憧憬
- root frame: 7721
- title sprite: 602
- tail sprite: 598
- background variant sprite: 597
- credits sprite: 564
- title before scroll: 11.667秒
- scroll end: 197.583秒
- final cards end: 205.917秒

### タイトル相当区間
- char296.jpg / 11.667秒 / ED開始+0.0秒〜11.667秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+11.667秒〜23.333秒
- char035.jpg / 11.667秒 / ED開始+23.333秒〜35.0秒
- char169.jpg / 11.667秒 / ED開始+35.0秒〜46.667秒
- char113.jpg / 11.667秒 / ED開始+46.667秒〜58.333秒
- char119.jpg / 11.667秒 / ED開始+58.333秒〜70.0秒
- char110.jpg / 11.667秒 / ED開始+70.0秒〜81.667秒
- char054.jpg / 11.667秒 / ED開始+81.667秒〜93.333秒
- char091.jpg / 11.667秒 / ED開始+93.333秒〜105.0秒
- char123.jpg / 11.667秒 / ED開始+105.0秒〜116.667秒
- char078.jpg / 11.667秒 / ED開始+116.667秒〜128.333秒
- char107.jpg / 11.667秒 / ED開始+128.333秒〜140.0秒
- char187.jpg / 11.667秒 / ED開始+140.0秒〜151.667秒
- char190.jpg / 11.667秒 / ED開始+151.667秒〜163.333秒
- char220.jpg / 11.667秒 / ED開始+163.333秒〜175.0秒
- char209.jpg / 11.667秒 / ED開始+175.0秒〜186.667秒
- char296.jpg / 10.917秒 / ED開始+186.667秒〜197.583秒

## ED10 すべてを捨てて
- root frame: 7724
- title sprite: 607
- tail sprite: 606
- background variant sprite: 605
- credits sprite: 575
- title before scroll: 12.417秒
- scroll end: 198.333秒
- final cards end: 206.667秒

### タイトル相当区間
- char293.jpg / 12.417秒 / ED開始+0.0秒〜12.417秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+12.417秒〜24.083秒
- char035.jpg / 11.667秒 / ED開始+24.083秒〜35.75秒
- char169.jpg / 11.667秒 / ED開始+35.75秒〜47.417秒
- char113.jpg / 11.667秒 / ED開始+47.417秒〜59.083秒
- char119.jpg / 11.667秒 / ED開始+59.083秒〜70.75秒
- char110.jpg / 11.667秒 / ED開始+70.75秒〜82.417秒
- char054.jpg / 11.667秒 / ED開始+82.417秒〜94.083秒
- char091.jpg / 11.667秒 / ED開始+94.083秒〜105.75秒
- char123.jpg / 11.667秒 / ED開始+105.75秒〜117.417秒
- char078.jpg / 11.667秒 / ED開始+117.417秒〜129.083秒
- char107.jpg / 11.667秒 / ED開始+129.083秒〜140.75秒
- char187.jpg / 11.667秒 / ED開始+140.75秒〜152.417秒
- char206.jpg / 11.667秒 / ED開始+152.417秒〜164.083秒
- char197.jpg / 11.667秒 / ED開始+164.083秒〜175.75秒
- non-jpeg/vector segment / 11.667秒 / ED開始+175.75秒〜187.417秒
- char194.jpg / 10.917秒 / ED開始+187.417秒〜198.333秒

### 注記
- Roll phase contains a non-JPEG/vector segment inside the background timeline; no JPEG could be confirmed for that slot from the SWF tags.

## ED11 人並みの幸せ
- root frame: 7727
- title sprite: 610
- tail sprite: 598
- background variant sprite: 597
- credits sprite: 564
- title before scroll: 11.667秒
- scroll end: 197.583秒
- final cards end: 205.917秒

### タイトル相当区間
- char296.jpg / 11.667秒 / ED開始+0.0秒〜11.667秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+11.667秒〜23.333秒
- char035.jpg / 11.667秒 / ED開始+23.333秒〜35.0秒
- char169.jpg / 11.667秒 / ED開始+35.0秒〜46.667秒
- char113.jpg / 11.667秒 / ED開始+46.667秒〜58.333秒
- char119.jpg / 11.667秒 / ED開始+58.333秒〜70.0秒
- char110.jpg / 11.667秒 / ED開始+70.0秒〜81.667秒
- char054.jpg / 11.667秒 / ED開始+81.667秒〜93.333秒
- char091.jpg / 11.667秒 / ED開始+93.333秒〜105.0秒
- char123.jpg / 11.667秒 / ED開始+105.0秒〜116.667秒
- char078.jpg / 11.667秒 / ED開始+116.667秒〜128.333秒
- char107.jpg / 11.667秒 / ED開始+128.333秒〜140.0秒
- char187.jpg / 11.667秒 / ED開始+140.0秒〜151.667秒
- char190.jpg / 11.667秒 / ED開始+151.667秒〜163.333秒
- char220.jpg / 11.667秒 / ED開始+163.333秒〜175.0秒
- char209.jpg / 11.667秒 / ED開始+175.0秒〜186.667秒
- char296.jpg / 10.917秒 / ED開始+186.667秒〜197.583秒

## ED12 触れあわない距離
- root frame: 7730
- title sprite: 613
- tail sprite: 598
- background variant sprite: 597
- credits sprite: 564
- title before scroll: 11.667秒
- scroll end: 197.583秒
- final cards end: 205.917秒

### タイトル相当区間
- char296.jpg / 11.667秒 / ED開始+0.0秒〜11.667秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+11.667秒〜23.333秒
- char035.jpg / 11.667秒 / ED開始+23.333秒〜35.0秒
- char169.jpg / 11.667秒 / ED開始+35.0秒〜46.667秒
- char113.jpg / 11.667秒 / ED開始+46.667秒〜58.333秒
- char119.jpg / 11.667秒 / ED開始+58.333秒〜70.0秒
- char110.jpg / 11.667秒 / ED開始+70.0秒〜81.667秒
- char054.jpg / 11.667秒 / ED開始+81.667秒〜93.333秒
- char091.jpg / 11.667秒 / ED開始+93.333秒〜105.0秒
- char123.jpg / 11.667秒 / ED開始+105.0秒〜116.667秒
- char078.jpg / 11.667秒 / ED開始+116.667秒〜128.333秒
- char107.jpg / 11.667秒 / ED開始+128.333秒〜140.0秒
- char187.jpg / 11.667秒 / ED開始+140.0秒〜151.667秒
- char190.jpg / 11.667秒 / ED開始+151.667秒〜163.333秒
- char220.jpg / 11.667秒 / ED開始+163.333秒〜175.0秒
- char209.jpg / 11.667秒 / ED開始+175.0秒〜186.667秒
- char296.jpg / 10.917秒 / ED開始+186.667秒〜197.583秒

## ED13 逃避
- root frame: 7733
- title sprite: 616
- tail sprite: 598
- background variant sprite: 597
- credits sprite: 564
- title before scroll: 14.083秒
- scroll end: 200.0秒
- final cards end: 208.333秒

### タイトル相当区間
- char225.jpg / 14.083秒 / ED開始+0.0秒〜14.083秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.083秒〜25.75秒
- char035.jpg / 11.667秒 / ED開始+25.75秒〜37.417秒
- char169.jpg / 11.667秒 / ED開始+37.417秒〜49.083秒
- char113.jpg / 11.667秒 / ED開始+49.083秒〜60.75秒
- char119.jpg / 11.667秒 / ED開始+60.75秒〜72.417秒
- char110.jpg / 11.667秒 / ED開始+72.417秒〜84.083秒
- char054.jpg / 11.667秒 / ED開始+84.083秒〜95.75秒
- char091.jpg / 11.667秒 / ED開始+95.75秒〜107.417秒
- char123.jpg / 11.667秒 / ED開始+107.417秒〜119.083秒
- char078.jpg / 11.667秒 / ED開始+119.083秒〜130.75秒
- char107.jpg / 11.667秒 / ED開始+130.75秒〜142.417秒
- char187.jpg / 11.667秒 / ED開始+142.417秒〜154.083秒
- char190.jpg / 11.667秒 / ED開始+154.083秒〜165.75秒
- char220.jpg / 11.667秒 / ED開始+165.75秒〜177.417秒
- char209.jpg / 11.667秒 / ED開始+177.417秒〜189.083秒
- char296.jpg / 10.917秒 / ED開始+189.083秒〜200.0秒

## ED14 両手に災難
- root frame: 7736
- title sprite: 619
- tail sprite: 576
- background variant sprite: 574
- credits sprite: 575
- title before scroll: 12.417秒
- scroll end: 198.333秒
- final cards end: 206.667秒

### タイトル相当区間
- char006.jpg / 12.417秒 / ED開始+0.0秒〜12.417秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+12.417秒〜24.083秒
- char035.jpg / 11.667秒 / ED開始+24.083秒〜35.75秒
- char169.jpg / 11.667秒 / ED開始+35.75秒〜47.417秒
- char113.jpg / 11.667秒 / ED開始+47.417秒〜59.083秒
- char119.jpg / 11.667秒 / ED開始+59.083秒〜70.75秒
- char110.jpg / 11.667秒 / ED開始+70.75秒〜82.417秒
- char054.jpg / 11.667秒 / ED開始+82.417秒〜94.083秒
- char091.jpg / 11.667秒 / ED開始+94.083秒〜105.75秒
- char123.jpg / 11.667秒 / ED開始+105.75秒〜117.417秒
- char078.jpg / 11.667秒 / ED開始+117.417秒〜129.083秒
- char107.jpg / 11.667秒 / ED開始+129.083秒〜140.75秒
- char187.jpg / 11.667秒 / ED開始+140.75秒〜152.417秒
- char206.jpg / 11.667秒 / ED開始+152.417秒〜164.083秒
- char197.jpg / 11.667秒 / ED開始+164.083秒〜175.75秒
- char439.jpg / 11.667秒 / ED開始+175.75秒〜187.417秒
- char194.jpg / 10.917秒 / ED開始+187.417秒〜198.333秒

## ED15 取り残されて
- root frame: 7739
- title sprite: 622
- tail sprite: 565
- background variant sprite: 547
- credits sprite: 564
- title before scroll: 14.083秒
- scroll end: 200.0秒
- final cards end: 208.333秒

### タイトル相当区間
- non-jpeg/vector segment / 2.417秒 / ED開始+0.0秒〜2.417秒
- char225.jpg / 11.667秒 / ED開始+2.417秒〜14.083秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.083秒〜25.75秒
- char035.jpg / 11.667秒 / ED開始+25.75秒〜37.417秒
- char169.jpg / 11.667秒 / ED開始+37.417秒〜49.083秒
- char113.jpg / 11.667秒 / ED開始+49.083秒〜60.75秒
- char119.jpg / 11.667秒 / ED開始+60.75秒〜72.417秒
- char110.jpg / 11.667秒 / ED開始+72.417秒〜84.083秒
- char054.jpg / 11.667秒 / ED開始+84.083秒〜95.75秒
- char091.jpg / 11.667秒 / ED開始+95.75秒〜107.417秒
- char123.jpg / 11.667秒 / ED開始+107.417秒〜119.083秒
- char078.jpg / 11.667秒 / ED開始+119.083秒〜130.75秒
- char107.jpg / 11.667秒 / ED開始+130.75秒〜142.417秒
- char187.jpg / 11.667秒 / ED開始+142.417秒〜154.083秒
- char197.jpg / 11.667秒 / ED開始+154.083秒〜165.75秒
- char439.jpg / 11.667秒 / ED開始+165.75秒〜177.417秒
- char225.jpg / 11.667秒 / ED開始+177.417秒〜189.083秒
- char173.jpg / 10.917秒 / ED開始+189.083秒〜200.0秒

### 注記
- Title phase begins with a non-JPEG/vector segment before the first confirmed JPEG appears.

## ED16 あいも変わらず
- root frame: 7742
- title sprite: 625
- tail sprite: 565
- background variant sprite: 547
- credits sprite: 564
- title before scroll: 14.083秒
- scroll end: 200.0秒
- final cards end: 208.333秒

### タイトル相当区間
- char225.jpg / 14.083秒 / ED開始+0.0秒〜14.083秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.083秒〜25.75秒
- char035.jpg / 11.667秒 / ED開始+25.75秒〜37.417秒
- char169.jpg / 11.667秒 / ED開始+37.417秒〜49.083秒
- char113.jpg / 11.667秒 / ED開始+49.083秒〜60.75秒
- char119.jpg / 11.667秒 / ED開始+60.75秒〜72.417秒
- char110.jpg / 11.667秒 / ED開始+72.417秒〜84.083秒
- char054.jpg / 11.667秒 / ED開始+84.083秒〜95.75秒
- char091.jpg / 11.667秒 / ED開始+95.75秒〜107.417秒
- char123.jpg / 11.667秒 / ED開始+107.417秒〜119.083秒
- char078.jpg / 11.667秒 / ED開始+119.083秒〜130.75秒
- char107.jpg / 11.667秒 / ED開始+130.75秒〜142.417秒
- char187.jpg / 11.667秒 / ED開始+142.417秒〜154.083秒
- char197.jpg / 11.667秒 / ED開始+154.083秒〜165.75秒
- char439.jpg / 11.667秒 / ED開始+165.75秒〜177.417秒
- char225.jpg / 11.667秒 / ED開始+177.417秒〜189.083秒
- char173.jpg / 10.917秒 / ED開始+189.083秒〜200.0秒

## ED17 お笑いの星
- root frame: 7745
- title sprite: 628
- tail sprite: 576
- background variant sprite: 574
- credits sprite: 575
- title before scroll: 12.417秒
- scroll end: 198.333秒
- final cards end: 206.667秒

### タイトル相当区間
- char265.jpg / 12.417秒 / ED開始+0.0秒〜12.417秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+12.417秒〜24.083秒
- char035.jpg / 11.667秒 / ED開始+24.083秒〜35.75秒
- char169.jpg / 11.667秒 / ED開始+35.75秒〜47.417秒
- char113.jpg / 11.667秒 / ED開始+47.417秒〜59.083秒
- char119.jpg / 11.667秒 / ED開始+59.083秒〜70.75秒
- char110.jpg / 11.667秒 / ED開始+70.75秒〜82.417秒
- char054.jpg / 11.667秒 / ED開始+82.417秒〜94.083秒
- char091.jpg / 11.667秒 / ED開始+94.083秒〜105.75秒
- char123.jpg / 11.667秒 / ED開始+105.75秒〜117.417秒
- char078.jpg / 11.667秒 / ED開始+117.417秒〜129.083秒
- char107.jpg / 11.667秒 / ED開始+129.083秒〜140.75秒
- char187.jpg / 11.667秒 / ED開始+140.75秒〜152.417秒
- char206.jpg / 11.667秒 / ED開始+152.417秒〜164.083秒
- char197.jpg / 11.667秒 / ED開始+164.083秒〜175.75秒
- char439.jpg / 11.667秒 / ED開始+175.75秒〜187.417秒
- char194.jpg / 10.917秒 / ED開始+187.417秒〜198.333秒

## ED18 遠い約束
- root frame: 7748
- title sprite: 631
- tail sprite: 598
- background variant sprite: 597
- credits sprite: 564
- title before scroll: 14.083秒
- scroll end: 200.0秒
- final cards end: 208.333秒

### タイトル相当区間
- char296.jpg / 14.083秒 / ED開始+0.0秒〜14.083秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.083秒〜25.75秒
- char035.jpg / 11.667秒 / ED開始+25.75秒〜37.417秒
- char169.jpg / 11.667秒 / ED開始+37.417秒〜49.083秒
- char113.jpg / 11.667秒 / ED開始+49.083秒〜60.75秒
- char119.jpg / 11.667秒 / ED開始+60.75秒〜72.417秒
- char110.jpg / 11.667秒 / ED開始+72.417秒〜84.083秒
- char054.jpg / 11.667秒 / ED開始+84.083秒〜95.75秒
- char091.jpg / 11.667秒 / ED開始+95.75秒〜107.417秒
- char123.jpg / 11.667秒 / ED開始+107.417秒〜119.083秒
- char078.jpg / 11.667秒 / ED開始+119.083秒〜130.75秒
- char107.jpg / 11.667秒 / ED開始+130.75秒〜142.417秒
- char187.jpg / 11.667秒 / ED開始+142.417秒〜154.083秒
- char190.jpg / 11.667秒 / ED開始+154.083秒〜165.75秒
- char220.jpg / 11.667秒 / ED開始+165.75秒〜177.417秒
- char209.jpg / 11.667秒 / ED開始+177.417秒〜189.083秒
- char296.jpg / 10.917秒 / ED開始+189.083秒〜200.0秒

## ED19 落伍者
- root frame: 7751
- title sprite: 636
- tail sprite: 635
- background variant sprite: 634
- credits sprite: 564
- title before scroll: 14.083秒
- scroll end: 200.0秒
- final cards end: 208.333秒

### タイトル相当区間
- char035.jpg / 14.083秒 / ED開始+0.0秒〜14.083秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.083秒〜25.75秒
- char035.jpg / 11.667秒 / ED開始+25.75秒〜37.417秒
- char169.jpg / 11.667秒 / ED開始+37.417秒〜49.083秒
- char113.jpg / 11.667秒 / ED開始+49.083秒〜60.75秒
- char119.jpg / 11.667秒 / ED開始+60.75秒〜72.417秒
- char110.jpg / 11.667秒 / ED開始+72.417秒〜84.083秒
- char054.jpg / 11.667秒 / ED開始+84.083秒〜95.75秒
- char091.jpg / 11.667秒 / ED開始+95.75秒〜107.417秒
- char123.jpg / 11.667秒 / ED開始+107.417秒〜119.083秒
- char078.jpg / 11.667秒 / ED開始+119.083秒〜130.75秒
- char107.jpg / 11.667秒 / ED開始+130.75秒〜142.417秒
- char187.jpg / 11.667秒 / ED開始+142.417秒〜154.083秒
- char190.jpg / 11.667秒 / ED開始+154.083秒〜165.75秒
- char220.jpg / 11.667秒 / ED開始+165.75秒〜177.417秒
- char209.jpg / 11.667秒 / ED開始+177.417秒〜189.083秒
- char262.jpg / 10.917秒 / ED開始+189.083秒〜200.0秒

## ED20 一触即発
- root frame: 7754
- title sprite: 639
- tail sprite: 576
- background variant sprite: 574
- credits sprite: 575
- title before scroll: 12.417秒
- scroll end: 198.333秒
- final cards end: 206.667秒

### タイトル相当区間
- char119.jpg / 12.417秒 / ED開始+0.0秒〜12.417秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+12.417秒〜24.083秒
- char035.jpg / 11.667秒 / ED開始+24.083秒〜35.75秒
- char169.jpg / 11.667秒 / ED開始+35.75秒〜47.417秒
- char113.jpg / 11.667秒 / ED開始+47.417秒〜59.083秒
- char119.jpg / 11.667秒 / ED開始+59.083秒〜70.75秒
- char110.jpg / 11.667秒 / ED開始+70.75秒〜82.417秒
- char054.jpg / 11.667秒 / ED開始+82.417秒〜94.083秒
- char091.jpg / 11.667秒 / ED開始+94.083秒〜105.75秒
- char123.jpg / 11.667秒 / ED開始+105.75秒〜117.417秒
- char078.jpg / 11.667秒 / ED開始+117.417秒〜129.083秒
- char107.jpg / 11.667秒 / ED開始+129.083秒〜140.75秒
- char187.jpg / 11.667秒 / ED開始+140.75秒〜152.417秒
- char206.jpg / 11.667秒 / ED開始+152.417秒〜164.083秒
- char197.jpg / 11.667秒 / ED開始+164.083秒〜175.75秒
- char439.jpg / 11.667秒 / ED開始+175.75秒〜187.417秒
- char194.jpg / 10.917秒 / ED開始+187.417秒〜198.333秒

## ED21 前途多難
- root frame: 7757
- title sprite: 642
- tail sprite: 576
- background variant sprite: 574
- credits sprite: 575
- title before scroll: 14.083秒
- scroll end: 200.0秒
- final cards end: 208.333秒

### タイトル相当区間
- char225.jpg / 14.083秒 / ED開始+0.0秒〜14.083秒

### ロール背景区間（scroll end まで）
- char006.jpg / 11.667秒 / ED開始+14.083秒〜25.75秒
- char035.jpg / 11.667秒 / ED開始+25.75秒〜37.417秒
- char169.jpg / 11.667秒 / ED開始+37.417秒〜49.083秒
- char113.jpg / 11.667秒 / ED開始+49.083秒〜60.75秒
- char119.jpg / 11.667秒 / ED開始+60.75秒〜72.417秒
- char110.jpg / 11.667秒 / ED開始+72.417秒〜84.083秒
- char054.jpg / 11.667秒 / ED開始+84.083秒〜95.75秒
- char091.jpg / 11.667秒 / ED開始+95.75秒〜107.417秒
- char123.jpg / 11.667秒 / ED開始+107.417秒〜119.083秒
- char078.jpg / 11.667秒 / ED開始+119.083秒〜130.75秒
- char107.jpg / 11.667秒 / ED開始+130.75秒〜142.417秒
- char187.jpg / 11.667秒 / ED開始+142.417秒〜154.083秒
- char206.jpg / 11.667秒 / ED開始+154.083秒〜165.75秒
- char197.jpg / 11.667秒 / ED開始+165.75秒〜177.417秒
- char439.jpg / 11.667秒 / ED開始+177.417秒〜189.083秒
- char194.jpg / 10.917秒 / ED開始+189.083秒〜200.0秒
