# React + TypeScript + Vite
よく使う構成のフロントエンドテンプレ
scss、react route、リセットcssなどの初期設定済み
---------------------------------------------
環境設定ファイルの基本設定以下 </br>
front-taco/.env </br>
VITE_CLOUDNAME = fugafuga </br>
VITE_IMAGE_API = https://hogehoge/api </br>
VITE_WS = wss://hogehoge/api </br>

.env.developmentと.env.productionでビルド時の設定読み込みを切り替えること </br>

開発環境でもSSL/TLS通信を行うこと。</br>
websocketの通信でhttpsドメインでないと、正常に動かない </br>
※今回はローカル動作時(npm run dev)はオレオレ署名で秘密鍵をローカルから読み込んでいる
