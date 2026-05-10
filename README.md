# Job Data Fetcher

## 簡介
Job Data Fetcher 是一個使用 Node.js 來從外部 API 獲取職位數據並將其輸入到 Google Sheets 的應用程式。它使用 Google Sheets API 來讀取和寫入數據，同時利用 LINE Notify 將每次新增職位信息通報給指定的用戶。本專案適合需要自動化招聘信息管理的開發者和 HR 團隊使用。

## 功能
- 從外部 API 獲取職位數據。
- 查詢 Google Sheets 中現有的職位編號以避免重複插入數據。
- 將獲取的數據寫入到指定的 Google Sheets。
- 使用 LINE Notify 向用戶發送新增職位的通知。
- 支持翻頁抓取以獲取多頁的職位數據。

## 安裝與使用方式
1. 首先，確保你的系統上已安裝 [Node.js](https://nodejs.org/)。
2. 從 GitHub 克隆本項目：
    ```bash
    git clone https://github.com/yourusername/job-data-fetcher.git
    cd job-data-fetcher
    ```
3. 安裝必要的依賴模組：
    ```bash
    npm install
    ```
4. 創建一個 `api_token.json` 文件，並填入你 Google API 的憑證。
5. 在程式碼中設定你的 Google Sheets ID 和 LINE Notify token。
6. 最後，運行程式：
    ```bash
    node index.js
    ```

## 必要的依賴模組清單
- `axios`: 用於發送 HTTP 請求。
- `googleapis`: Google API 客戶端庫，用於調用 Google Sheets API。
- `fs`: Node.js 的檔案系統模組，用於讀取憑證文件。

## 授權條款
本專案采用 MIT 開源許可證。詳情請參閱 [LICENSE](LICENSE) 文件。