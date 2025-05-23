# ポモドーロタイマー

Electron と Next.js を使用した、モドーロタイマーアプリケーションです。

## 機能

- 作業時間（25 分）と休憩時間（5 分）の自動切り替え
- 作業開始/終了時にランダムな音声通知
- デスクトップ通知
- 進捗バーの視覚的表示
- セッション数のカウント

## 技術スタック

- Electron
- Next.js
- React
- TypeScript
- Tailwind CSS

## 開発環境のセットアップ

### 必要条件

- Node.js (v18 以上)
- npm または yarn

### インストール

1. リポジトリをクローン

```bash
git clone [リポジトリURL]
cd pomodoro-timer-app
```

2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

3. 開発サーバーの起動

```bash
npm run electron-dev
# または
yarn electron-dev
```

## ビルド

### macOS 向けビルド

```bash
npm run dist-mac
# または
yarn dist-mac
```

ビルドされたアプリケーションは `dist` ディレクトリに生成されます。

## プロジェクト構造

```
pomodoro-timer-app/
├── app/                # Next.jsアプリケーション
├── components/         # Reactコンポーネント
├── electron/          # Electron関連ファイル
│   ├── main.js       # メインプロセス
│   ├── preload.js    # プリロードスクリプト
│   └── sounds/       # 音声ファイル
├── hooks/            # カスタムフック
├── public/           # 静的ファイル
└── types/            # TypeScript型定義
```

## 音声ファイル

音声ファイルは以下のディレクトリ構造で配置する必要があります：

```
electron/sounds/
├── workStart/
│   ├── start1.mp3
│   ├── start2.mp3
│   ├── start3.mp3
│   ├── start4.mp3
│   └── start5.mp3
└── workEnd/
    ├── end1.mp3
    ├── end2.mp3
    ├── end3.mp3
    └── end4.mp3
```

## 作者

sodateya
