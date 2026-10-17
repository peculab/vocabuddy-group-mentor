# VocaBuddy：國三英文・中文答英文

VocaBuddy 是以「看中文提示、輸入英文單字或片語」為核心的英文練習網頁。本文件介紹成果專案 [ytp-e2-colab/e2-result](ytp-e2-colab/e2-result) 的功能、字庫、執行與測試方式。

專案使用 HTML、CSS 與原生 JavaScript，不需要後端、帳號或資料庫，也沒有建置步驟。學習紀錄與自訂單字儲存在使用者的瀏覽器內。

## 小組資料與分工

| 項目 | 內容 |
| --- | --- |
| 小組名稱 | 待填 |
| 組員姓名 | 待填 |
| 組員的 GitHub 帳號 | 待填 |
| 組員分工 | 待填：依實際負責的字庫、介面、答題邏輯、測試或文件填寫 |

## 主要功能

- **中文答英文**：顯示中文提示，輸入對應的英文單字或片語後檢查答案。
- **課次篩選**：可選康軒三上全部精選、Unit 1～6，或自訂匯入單字。「全部精選」只包含內建字庫。
- **答案判斷**：忽略大小寫與前後空白，連續空白視為一個空白；拼字仍需正確，不接受同義字或模糊比對。
- **即時回饋**：顯示正確答案；不會時可直接查看答案，並計入錯誤紀錄。
- **當次錯字重練**：答錯或查看答案的字，在按下一題後會排到隊尾，直到答對才移出當次佇列。
- **間隔複習**：記錄作答次數、錯誤次數、熟練盒級與下次複習日期。
- **重練錯字**：從目前範圍挑出曾答錯的字，依累積錯誤率由高到低排列，不受原定複習日期限制。
- **CSV 文字匯入**：貼上自己的中英對照，逐行驗證並顯示錯誤行號。
- **本機保存與離線快取**：透過 localStorage 保存資料，並透過 Service Worker 快取網頁資源。

## 程式執行方式

請使用本機 HTTP 伺服器開啟網頁。以下指令在 PowerShell 執行，選擇一種方式即可。

### 方式一：Node.js

需要已安裝 Node.js。進入成果資料夾後，以 `http-server` 啟動：

```powershell
cd "C:\Users\pecu6\OneDrive\文件\GitHub\vocabuddy-group-mentor\ytp-e2-colab\e2-result"
npx --yes http-server . -a 127.0.0.1 -p 8000 -c-1
```

首次執行可能需要連線下載 `http-server`。它是開發用的靜態檔案伺服器，不是應用程式的後端。

### 方式二：Python

若已安裝可執行的 Python 3，也可使用內建伺服器：

```powershell
cd "C:\Users\pecu6\OneDrive\文件\GitHub\vocabuddy-group-mentor\ytp-e2-colab\e2-result"
python -m http.server 8000 --bind 127.0.0.1
```

啟動後，在瀏覽器開啟 **http://localhost:8000**。保留伺服器終端機，停止時按 `Ctrl+C`。若 8000 已被占用，可改用 8001，並開啟對應網址。

直接雙擊 `index.html` 並非建議方式，因為 Service Worker 的註冊需要 localhost 或 HTTPS 環境。

## 使用流程

1. 在「練習範圍」選擇全部精選、指定課次或自訂單字。
2. 閱讀中文提示，輸入英文答案。
3. 按 Enter 或「檢查答案」查看結果；空白答案只會提示輸入，不會計入作答。
4. 按「下一題」或再次按 Enter 繼續。不會時可按「不會，查看答案」，再進入下一題。
5. 佇列清空後顯示今日練習完成，可切換課次或按「重練錯字」。

「本範圍」是該範圍的總字數，「今日剩」是當次佇列題數。答錯的字會重新排入，因此不一定每答一題就減一。

## 內建單字與課程範圍

目前收錄 **康軒版 114 學年三上（第五冊）Unit 1～6 的 35 個精選單字與片語**，不是完整課本字表；三下字庫尚未加入。中文提示另行編寫，不同學年的課程內容可能有差異。

| 課次 | 數量 | 英文單字與片語 |
| --- | ---: | --- |
| Unit 1 | 6 | subject、type、holiday、Christmas Eve、nobody、king |
| Unit 2 | 6 | delivery、choice、driver、tip、couch、tap |
| Unit 3 | 5 | spider、present、lovely、expect、opinion |
| Unit 4 | 6 | create、explain、butterfly、lie、farm、lesson |
| Unit 5 | 6 | foreign、rise、success、fail、deal with、pot |
| Unit 6 | 6 | appear、deal、kilogram、paint、total、sight |

完整中英對照與課次設定見 [words.js](ytp-e2-colab/e2-result/words.js)。程式內標示的課次參考為[均一教育平台的適康軒版課程索引](https://www.junyiacademy.org/topics/k-j-114-vocab-b5-u1)。

## 匯入自訂單字

點選「匯入課本單字」，在文字框貼上 CSV 文字，再按「匯入」。目前採貼上文字的方式，沒有檔案上傳按鈕。

```csv
en,zh
apple,蘋果
give up,放棄
"take care of","照顧,照料"
```

- 每行必須剛好兩欄，順序為 `英文,中文`，兩欄都不能為空。
- 可省略表頭；若使用 `en,zh` 表頭，請放在第一行。
- 支援空行、UTF-8 BOM、Windows 換行，以及雙引號包住的逗號；欄位內的雙引號以 `""` 表示。每筆資料請維持一行。
- 英文轉為小寫，欄位前後空白會移除。
- 不允許與內建字庫、已匯入單字或同次匯入的其他單字重複，檢查時不分大小寫。
- 合法資料會匯入；錯誤資料會跳過並顯示原始行號，不影響其他合法資料。
- 匯入成功後自動切換到「自訂匯入單字」，再次匯入會累加合法的新單字。

「清除匯入」會在確認後移除所有自訂單字，保留內建字庫及學習紀錄。重新匯入相同英文時，仍可能沿用先前的複習狀態。

## 複習與資料保存規則

每個字初始為盒級 1，首次即可練習。答對後升一級，最高為盒級 5；答錯或查看答案則回到盒級 1。

| 作答後盒級 | 下次複習間隔 |
| --- | ---: |
| 1 | 1 天 |
| 2 | 2 天 |
| 3 | 4 天 |
| 4 | 8 天 |
| 5 | 16 天 |

例如，新字首次答對會進入盒級 2，排定 2 天後複習。答錯雖然排定隔天複習，當次仍會放回隊尾；切換範圍或重新載入時，則重新依到期日建立佇列。

「重練錯字」依累積錯誤次數 ÷ 作答次數排序。曾答錯的字即使後來答對，仍保留在可重練清單中。日期以 UTC 日數計算，並非依使用者所在地的午夜切換。

| localStorage 鍵名 | 儲存內容 |
| --- | --- |
| `vb-log-zh-en-kangxuan` | 以英文為索引的作答次數 `seen`、錯誤次數 `wrong`、盒級 `box`、到期日 `due` |
| `vb-words` | 自訂匯入的中英對照單字 |

資料保存在目前瀏覽器的網站來源下，沒有雲端同步或匯出備份功能。不同瀏覽器、裝置、主機名稱或連接埠不共用資料；例如 `localhost:8000` 與 `127.0.0.1:8000` 是不同來源。清除網站資料後，紀錄與匯入字庫會消失。若瀏覽器禁止儲存，資料可能無法在重新開啟後保留。

## 離線使用與更新

`sw.js` 會快取主頁、JavaScript、manifest 與圖示。需先在 localhost 或 HTTPS 開啟網頁，待 Service Worker 安裝及快取完成，之後才可在離線時使用已快取的資源；外部課程參考連結仍需網路。

目前優先讀取快取。修改前端檔案後，應同步更新 `sw.js` 的 `CACHE` 版本名稱，讓新版本重新建立快取。開發時若仍看到舊畫面，可在瀏覽器開發者工具移除 Service Worker 與 Cache Storage 後重新載入；若要保留學習紀錄，請避免一併清除 localStorage。

專案附有 Web App Manifest，實際安裝入口依瀏覽器與裝置支援情況而定。

## 專案檔案

以下檔案皆位於 [ytp-e2-colab/e2-result](ytp-e2-colab/e2-result)：

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 頁面、樣式、答題佇列、課次篩選、儲存與匯入操作 |
| `words.js` | 35 個內建單字、中譯與課次 |
| `answer.js` | 答案正規化與正確性判斷 |
| `srs.js` | 盒級排程、複習間隔與到期數量計算 |
| `csv.js` | CSV 解析與匯入資料驗證 |
| `manifest.json`、`icon.png` | 應用程式名稱、顯示設定與圖示 |
| `sw.js` | 離線資源快取與舊版快取清理 |
| `check_words.js` | 檢查字庫必要欄位與重複英文 |
| `test_srs.js`、`test_count_due.js` | 驗證複習排程與到期數量計算 |
| `test_csv.js` | 驗證 CSV 解析、重複檢查與錯誤回報 |
| `test_practice.js` | 使用模擬 DOM 與儲存環境驗證答題及匯入流程 |
| `e2_contract.js` | 驗證字庫課次、基本資料條件及排程契約 |

## 測試方式

需要 Node.js，測試使用內建模組，不需執行 `npm install`。請在成果資料夾執行，因為流程測試會從目前目錄讀取網頁及腳本：

```powershell
cd "C:\Users\pecu6\OneDrive\文件\GitHub\vocabuddy-group-mentor\ytp-e2-colab\e2-result"
node check_words.js
node test_srs.js
node test_count_due.js
node test_csv.js
node test_practice.js
node e2_contract.js
```

本次文件整理時，以上六項檢查皆通過。流程測試涵蓋空白作答、正確與錯誤答案、查看答案、重複提交、課次切換、錯字重練、完成狀態、匯入及清除。這些測試不等同實際瀏覽器測試；離線快取、安裝與視覺呈現仍需在瀏覽器確認。

## Google Colab 開啟連結

儲存庫另附以下筆記本：

- [YTP_E2_Colab.fixed.ipynb：在 Google Colab 開啟](https://colab.research.google.com/github/peculab/vocabuddy-group-mentor/blob/main/YTP_E2_Colab.fixed.ipynb)
- [VocaBuddy.ipynb：在 Google Colab 開啟](https://colab.research.google.com/github/peculab/vocabuddy-group-mentor/blob/main/VocaBuddy.ipynb)

執行本文件介紹的成果網頁不需要 Colab，直接啟動 `e2-result` 的靜態伺服器即可。筆記本與成果資料夾為不同檔案，請以目前 `e2-result` 原始碼為本文件所述功能的依據。
